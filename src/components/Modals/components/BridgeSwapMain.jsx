import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useWeb3React } from '@web3-react/core';
import { BigNumber } from 'bignumber.js';
import cosmos from 'cosmos-lib';
import { ethers } from 'ethers';
import { useMediaQuery } from 'react-responsive';

import { useChain } from 'context/chain/ChainContext';
import { GravityCont, NOMCont } from 'context/chain/contracts';
import BridgeSwapMobile from './BridgeSwapMobile';
import BridgeSwapModal from './BridgeSwapModal';
import { contAddrs } from '../../../context/chain/contracts';
import { NOTIFICATION_MESSAGES } from '../../../constants/NotificationMessages';
import { responsive } from 'theme/constants';

export const initialErrorsState = { amountError: '', onomyWalletError: '', transactionError: '' };

export const initialGasOptions = [
  {
    id: 0,
    text: '00.00 (Standard)',
  },
  {
    id: 1,
    text: '00.00 (Fast)',
  },
  {
    id: 2,
    text: '00.00 (Instant)',
  },
];

export default function BridgeSwapMain({ closeBridgeModal }) {
  const [onomyWalletValue, setOnomyWalletValue] = useState('');
  const [amountValue, setAmountValue] = useState('');
  const [errors, setErrors] = useState(initialErrorsState);
  const [gasPrice, setGasPrice] = useState(0);
  const [gasPriceChoice, setGasPriceChoice] = useState(2);
  const [gasOptions, setGasOptions] = useState(initialGasOptions);
  const [formattedWeakBalance, setFormattedWeakBalance] = useState(0);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isTransactionPending, setIsTransactionPending] = useState(false);
  const [allowanceAmountGravity, setAllowanceAmountGravity] = useState(0);
  const [showBridgeExchangeModal, setShowBridgeExchangeModal] = useState(true);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showTransactionCompleted, setShowTransactionCompleted] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  const standardBrigdeBreakpoint = useMediaQuery({ minWidth: responsive.smartphoneLarge });

  const { account, library } = useWeb3React();
  const { weakBalance } = useChain();

  const GravityContract = useMemo(() => GravityCont(library), [library]);
  const NOMContract = useMemo(() => NOMCont(library), [library]);

  useEffect(() => {
    const getGasPrices = async () => {
      const prices = await fetch('https://www.gasnow.org/api/v3/gas/price?utm_source=onomy');
      const result = await prices.json();
      const fetchedGasOptions = [
        {
          id: 0,
          text: `${(result.data.standard / 1e9).toPrecision(4)} (Standard)`,
          gas: new BigNumber(result.data.standard.toString()),
        },
        {
          id: 1,
          text: `${(result.data.fast / 1e9).toPrecision(4)} (Fast)`,
          gas: new BigNumber(result.data.fast.toString()),
        },
        {
          id: 2,
          text: `${(result.data.rapid / 1e9).toPrecision(4)} (Instant)`,
          gas: new BigNumber(result.data.rapid.toString()),
        },
      ];
      setGasOptions(fetchedGasOptions);
      setGasPrice(fetchedGasOptions[gasPriceChoice].gas);
    };
    getGasPrices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gasPriceChoice, showApproveModal]);

  useEffect(() => {
    setFormattedWeakBalance(weakBalance.shiftedBy(-18));
  }, [weakBalance]);

  const updateAllowanceAmount = useCallback(async () => {
    const allowanceGravity = await NOMContract.allowance(account, contAddrs.Gravity);
    setAllowanceAmountGravity(allowanceGravity);
    return allowanceGravity;
  }, [NOMContract, account]);

  useEffect(() => {
    if (NOMContract && account && !allowanceAmountGravity) {
      updateAllowanceAmount();
    }
  }, [NOMContract, account, allowanceAmountGravity, updateAllowanceAmount]);

  const walletChangeHandler = event => {
    setOnomyWalletValue(event.target.value);
  };

  const amountChangeHandler = event => {
    const { value } = event.target;
    const floatRegExp = new RegExp(
      /(^(?=.+)(?:[1-9]\d*|0)?(?:\.\d{1,18})?$)|(^\d+?\.$)|(^\+?(?!0\d+)$|(^$)|(^\.$))/
    );
    if (floatRegExp.test(value)) {
      setAmountValue(value);
      const bigAmountShifted18 = BigNumber(value).shiftedBy(18);
      if (bigAmountShifted18.gt(weakBalance)) {
        setErrors(prevState => {
          return { ...prevState, amountError: NOTIFICATION_MESSAGES.error.insufficientFunds };
        });
        setIsDisabled(true);
      } else {
        setErrors(prevState => {
          return { ...prevState, amountError: '' };
        });
        setIsDisabled(false);
      }
    }
  };

  const maxBtnClickHandler = event => {
    event.preventDefault();
    if (weakBalance.toNumber()) {
      setAmountValue(formattedWeakBalance.toString(10));
      setIsDisabled(false);
    }
  };

  const onCancelClickHandler = () => {
    setShowApproveModal(false);
    setShowBridgeExchangeModal(true);
    setIsDisabled(false);
    updateAllowanceAmount();
  };

  const closeModal = () => {
    if (!isTransactionPending) {
      closeBridgeModal();
    }
  };

  const submitTransClickHandler = useCallback(
    async event => {
      let cosmosAddressBytes32;
      event.preventDefault();
      setErrors(initialErrorsState);
      if (amountValue === '.' || !parseFloat(amountValue)) {
        setErrors(prevState => {
          return { ...prevState, amountError: NOTIFICATION_MESSAGES.error.incorrectAmountFormat };
        });
        return;
      }

      const string18FromAmount = BigNumber(amountValue).shiftedBy(18).toString(10);

      try {
        setIsDisabled(true);
        const bytes = cosmos.address.getBytes(onomyWalletValue);
        const ZEROS = Buffer.alloc(12);
        cosmosAddressBytes32 = Buffer.concat([ZEROS, bytes]);
      } catch (error) {
        setErrors(prevState => {
          return {
            ...prevState,
            onomyWalletError: NOTIFICATION_MESSAGES.error.incorrectOnomyAddressFormat,
          };
        });
        setIsDisabled(false);
        return;
      }

      let tx;
      if (allowanceAmountGravity.gte(ethers.BigNumber.from(string18FromAmount))) {
        try {
          setShowLoader(true);
          setIsTransactionPending(true);
          tx = await GravityContract.sendToCosmos(
            contAddrs.NOMERC20,
            cosmosAddressBytes32,
            string18FromAmount,
            {
              gasPrice: gasPrice.toFixed(0),
            }
          );

          tx.wait().then(() => {
            setIsDisabled(false);
            setShowBridgeExchangeModal(false);
            setShowTransactionCompleted(true);
            setShowLoader(false);
            setIsTransactionPending(false);
          });
        } catch (error) {
          if (error.code === 4001) {
            setErrors(prevState => {
              return {
                ...prevState,
                transactionError: NOTIFICATION_MESSAGES.error.rejectedTransaction,
              };
            });
          } else {
            setErrors(prevState => {
              return { ...prevState, transactionError: error.message };
            });
          }

          setShowLoader(false);
          setIsDisabled(false);
          setIsTransactionPending(false);
        }
      } else {
        setShowBridgeExchangeModal(false);
        setShowApproveModal(true);
      }
    },
    [onomyWalletValue, amountValue, GravityContract, allowanceAmountGravity, gasPrice]
  );

  const Props = {
    values: {
      onomyWalletValue,
      amountValue,
      formattedWeakBalance,
      allowanceAmountGravity,
      weakBalance,
      errors,
      gasPrice,
      gasPriceChoice,
      gasOptions,
    },
    flags: {
      isDisabled,
      isTransactionPending,
      showBridgeExchangeModal,
      showApproveModal,
      showTransactionCompleted,
      showLoader,
    },
    handlers: {
      walletChangeHandler,
      amountChangeHandler,
      maxBtnClickHandler,
      submitTransClickHandler,
      onCancelClickHandler,
      closeModal,
      setGasPriceChoice,
      setGasPrice,
    },
  };

  return (
    <>
      {standardBrigdeBreakpoint ? <BridgeSwapModal {...Props} /> : <BridgeSwapMobile {...Props} />}
    </>
  );
}
