/* eslint-disable no-nested-ternary */
import React, { useCallback, useRef } from 'react';
import styled from 'styled-components';
import { BigNumber } from 'bignumber.js';
import { useWeb3React } from '@web3-react/core';
import _ from 'lodash';

import ConfirmTransactionModal from 'components/Modals/components/ConfirmTransactionModal';
import PendingModal from 'components/Modals/components/PendingModal';
import ApproveTokensModal from 'components/Modals/components/ApproveTokensModal';
import RequestFailedModal from 'components/Modals/components/RequestFailedModal';
import TransactionCompletedModal from 'components/Modals/components/TransactionCompletedModal';
import TransactionFailedModal from 'components/Modals/components/TransactionFailedModal';
import { useChain } from 'context/chain/ChainContext';
import { BondingCont, NOMCont } from 'context/chain/contracts';
import { useExchange, useUpdateExchange } from 'context/exchange/ExchangeContext';
import {
  ExchangeItem,
  Sending,
  Receiving,
  ExchangeInput,
  MaxBtn,
  ReceivingValue,
  ExchangeButton,
  SendingBox,
} from './exchangeStyles';
import { useModal } from 'context/modal/ModalContext';
import NOMButton from 'components/Exchange/NOMButton';
import { format18, parse18 } from 'utils/math';
import { NOTIFICATION_MESSAGES } from 'constants/NotificationMessages';

const FlexDiv = styled.div`
  display: flex;
`;

const AvailableDiv = styled.strong`
  flex-grow: 1;
  text-align: right;
`;

export default function ExchangeQuote({ strength }) {
  const { strongBalance, weakBalance } = useChain();
  const { handleModal } = useModal();
  const { library } = useWeb3React();

  const bondContract = BondingCont(library);
  const NOMcontract = NOMCont(library);

  const { askAmount, bidAmount, approveAmount, bidDenom, input, output, strong, weak } =
    useExchange();
  const { NOMallowance } = useChain();
  const { objDispatch, strDispatch } = useUpdateExchange();
  const isBuying = strength === 'strong';

  const approveRef = useRef();
  approveRef.current = approveAmount;

  const getAskAmount = useCallback(
    async (askAmountState, bidAmountUpdate, textStrength) => {
      let askAmountUpdate = askAmountState;

      switch (textStrength) {
        case 'strong':
          // console.log('Strong: ', bidAmountUpdate.toFixed(0));
          askAmountUpdate = await bondContract.buyQuoteETH(bidAmountUpdate.toFixed(0));
          // console.log('Pull Strong Ask Amount', askAmountUpdate);
          break;

        case 'weak':
          askAmountUpdate = await bondContract.sellQuoteNOM(bidAmountUpdate.toFixed(0));
          // console.log('Pull Weak Ask Amount', askAmountUpdate);
          break;

        default:
          // eslint-disable-next-line no-console
          console.error('Denom not set');
      }
      return new BigNumber(askAmountUpdate.toString());
    },
    [bondContract]
  );

  const submitTrans = useCallback(
    async (isApproving, slippage, gasPrice) => {
      handleModal(<PendingModal isApproving={isApproving} />);

      if (isApproving) {
        if (!approveAmount) return;

        try {
          const tx = await NOMcontract.increaseAllowance(
            bondContract.address,
            approveRef.current.toFixed(0),
            {
              gasPrice: gasPrice.toFixed(0),
            }
          );

          tx.wait().then(() => {
            handleModal(<TransactionCompletedModal isApproving tx={tx} />);
          });
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error(e);
          handleModal(<TransactionFailedModal error={`${e.code}\n${e.message.slice(0, 80)}...`} />);
        }
      } else {
        if (!bidAmount || !askAmount) return;
        try {
          let tx;
          let gasFee;

          switch (bidDenom) {
            case 'strong':
              // Preparing for many tokens / coins
              switch (strong) {
                case 'ETH':
                  // eslint-disable-next-line no-case-declarations
                  const gasFeeRaw = await bondContract.estimateGas.buyNOM(
                    askAmount.toFixed(0),
                    slippage.toFixed(0),
                    {
                      value: bidAmount.toFixed(0),
                    }
                  );

                  gasFee = new BigNumber(gasFeeRaw.toString());

                  // eslint-disable-next-line no-case-declarations
                  const gas = gasFee.times(gasPrice);
                  if (bidAmount.lt(gas)) {
                    handleModal(
                      <TransactionFailedModal error={NOTIFICATION_MESSAGES.error.lowBid} />
                    );
                    return;
                  }

                  // eslint-disable-next-line no-case-declarations
                  const bidAmountUpdate = bidAmount.minus(gasFee.times(gasPrice));
                  // eslint-disable-next-line no-case-declarations
                  const askAmountUpdateRaw = await bondContract.buyQuoteETH(
                    bidAmountUpdate.toFixed()
                  );
                  // eslint-disable-next-line no-case-declarations
                  const askAmountUpdate = new BigNumber(askAmountUpdateRaw.toString());

                  tx = await bondContract.buyNOM(askAmountUpdate.toFixed(0), slippage.toFixed(0), {
                    value: bidAmountUpdate.toFixed(0),
                    gasPrice: gasPrice.toFixed(0),
                    gasLimit: gasFee.toFixed(0),
                  });

                  tx.wait().then(() => {
                    handleModal(<TransactionCompletedModal tx={tx} />);
                  });

                  break;
                default: {
                  break;
                }
              }
              break;

            case 'weak':
              switch (weak) {
                case 'wNOM':
                  tx = await bondContract.sellNOM(
                    bidAmount.toFixed(0),
                    askAmount.toFixed(0),
                    slippage.toFixed(0),
                    {
                      gasPrice: gasPrice.toFixed(0),
                    }
                  );

                  tx.wait().then(() => {
                    handleModal(<TransactionCompletedModal tx={tx} />);
                  });
                  break;
                default: {
                  break;
                }
              }
              break;

            default:
              break;
          }
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error(e.code, e.message.message);
          // alert(e.message)
          handleModal(<TransactionFailedModal error={`${e.code}\n${e.message.slice(0, 80)}...`} />);
        }
      }
    },
    [
      askAmount,
      bidAmount,
      approveAmount,
      bidDenom,
      NOMcontract,
      bondContract,
      handleModal,
      strong,
      weak,
    ]
  );

  const onConfirmApprove = () => {
    try {
      handleModal(<ConfirmTransactionModal isApproving submitTrans={submitTrans} />);
    } catch (e) {
      handleModal(<TransactionFailedModal error={`${e.code}\n${e.message.slice(0, 80)}...`} />);
    }
  };

  const onApprove = () => {
    if (weakBalance.gte(bidAmount)) {
      if (bidAmount.gt(NOMallowance)) {
        handleModal(<ApproveTokensModal onConfirmApprove={onConfirmApprove} />);
      } else {
        handleModal(<ConfirmTransactionModal submitTrans={submitTrans} />);
      }
    } else {
      handleModal(<TransactionFailedModal error={`${weak} Balance too low`} />);
    }
  };

  const onBid = () => {
    switch (true) {
      case bidDenom !== strength:
        handleModal(<RequestFailedModal error="Please enter amount" />);
        break;
      case strength === 'strong' && strongBalance.gte(bidAmount):
        handleModal(<ConfirmTransactionModal submitTrans={submitTrans} />);
        break;
      case strength === 'weak' && weakBalance.gte(bidAmount):
        handleModal(<ConfirmTransactionModal submitTrans={submitTrans} />);
        break;
      default:
        handleModal(<RequestFailedModal error="Insufficient funds" />);
    }
  };

  const onMax = async () => {
    let strUpdate = new Map();
    strUpdate.set('bidDenom', strength);
    const bidMaxValue = strength === 'strong' ? strongBalance : weakBalance;

    strUpdate.set('input', format18(bidMaxValue).toFixed());

    let askAmountUpdate;

    try {
      // console.log('calling here:', askAmount, bidMaxValue, strength);
      askAmountUpdate = await getAskAmount(askAmount, bidMaxValue, strength);
    } catch (err) {
      if (err) {
        handleModal(<RequestFailedModal error={err.error.message} />);
      }
    }

    let objUpdate = new Map();
    if (bidMaxValue.gt(NOMallowance)) {
      const approvalAmount = bidMaxValue.minus(NOMallowance);

      objUpdate = objUpdate.set('approveAmount', approvalAmount);

      strUpdate = strUpdate.set('approve', format18(approvalAmount).toFixed());
    }

    objUpdate = objUpdate.set('askAmount', askAmountUpdate);

    objUpdate = objUpdate.set('bidAmount', bidMaxValue);

    objDispatch({
      type: 'update',
      value: objUpdate,
    });

    strUpdate.set('output', format18(new BigNumber(askAmountUpdate.toString())).toFixed(8));

    strDispatch({
      type: 'update',
      value: strUpdate,
    });
  };

  const onTextChange = useCallback(
    async (evt, textStrength) => {
      evt.preventDefault();
      const debounced = _.debounce(async () => {
        if (bidDenom === strength && input === evt.target.value) {
          return;
        }

        let askAmountUpdate;

        try {
          const bidAmountUpdate = parse18(new BigNumber(parseFloat(evt.target.value).toString()));

          askAmountUpdate = await getAskAmount(askAmount, bidAmountUpdate, textStrength);

          let objUpdate = new Map();
          let strUpdate = new Map();

          objUpdate = objUpdate.set('askAmount', new BigNumber(askAmountUpdate.toString()));
          strUpdate = strUpdate.set(
            'output',
            format18(new BigNumber(askAmountUpdate.toString())).toFixed(8)
          );

          objDispatch({
            type: 'update',
            value: objUpdate,
          });

          strDispatch({
            type: 'update',
            value: strUpdate,
          });
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error(err);
          // err && handleModal(<RequestFailedModal error={err.error.message} />);
        }
      }, 500);

      const floatRegExp = new RegExp(
        /(^(?=.+)(?:[1-9]\d*|0)?(?:\.\d+)?$)|(^\d+?\.$)|(^\+?(?!0\d+)$)/
      );
      switch (true) {
        case evt.target.value === '' || evt.target.value === '.': {
          let objUpdate = new Map();

          objUpdate = objUpdate.set('askAmount', new BigNumber(0));

          objUpdate = objUpdate.set('bidAmount', new BigNumber(0));

          objUpdate = objUpdate.set('approveAmount', new BigNumber(0));

          objDispatch({
            type: 'update',
            value: objUpdate,
          });

          let strUpdate = new Map();

          strUpdate = strUpdate.set('bidDenom', strength);

          strUpdate = strUpdate.set('input', evt.target.value.toString());

          strUpdate = strUpdate.set('output', '');

          strUpdate = strUpdate.set('approve', '');

          strDispatch({
            type: 'update',
            value: strUpdate,
          });

          break;
        }

        case floatRegExp.test(evt.target.value.toString()): {
          const bidAmountUpdate = parse18(new BigNumber(parseFloat(evt.target.value).toString()));

          let strUpdate = new Map();
          let objUpdate = new Map();

          if (bidDenom !== strength) {
            strUpdate = strUpdate.set('bidDenom', strength);
          }

          objUpdate = objUpdate.set('bidAmount', bidAmountUpdate);
          strUpdate = strUpdate.set('input', evt.target.value.toString());

          debounced.call();

          if (bidAmountUpdate.gt(NOMallowance)) {
            const approvalAmount = bidAmountUpdate.minus(NOMallowance);

            objUpdate = objUpdate.set('approveAmount', approvalAmount);

            strUpdate = strUpdate.set('approve', format18(approvalAmount).toFixed());
          }

          objDispatch({
            type: 'update',
            value: objUpdate,
          });

          strDispatch({
            type: 'update',
            value: strUpdate,
          });

          break;
        }

        default:
          handleModal(<RequestFailedModal error="Please enter numbers only. Thank you!" />);
      }
    },
    [
      askAmount,
      bidDenom,
      NOMallowance,
      getAskAmount,
      handleModal,
      input,
      objDispatch,
      strDispatch,
      strength,
    ]
  );

  return (
    <ExchangeItem>
      <FlexDiv>
        <strong>{isBuying ? `Buy ${weak}` : `Sell ${weak}`}</strong>
        <AvailableDiv>
          {isBuying
            ? `Available: ${format18(strongBalance).toFixed(6)} ${strong}`
            : `Available: ${format18(weakBalance).toFixed(6)} ${weak}`}
        </AvailableDiv>
      </FlexDiv>
      <Sending>
        <SendingBox style={{ width: '100%', paddingRight: 16 }}>
          {(bidDenom !== strength || !input) && <strong>Amount</strong>}
          <ExchangeInput
            type="text"
            data-testid="exchange-strong-balance-input"
            onChange={evt => onTextChange(evt, strength)}
            value={bidDenom === strength ? input : ''}
            placeholder="0.00"
          />
        </SendingBox>
        <SendingBox>
          {strength === 'strong' ? strong : weak}
          <MaxBtn data-testid="max-value-button" onClick={() => onMax()}>
            Max
          </MaxBtn>
        </SendingBox>
      </Sending>
      <Receiving>
        <strong>You will receive</strong>
        <ReceivingValue data-testid="exchange-weak-balance">
          {strength === bidDenom && output ? `~${output}` : ''}{' '}
          {strength === 'strong' ? weak : strong}
        </ReceivingValue>
      </Receiving>
      {strength === 'strong' ? (
        bidDenom === 'weak' ? (
          <ExchangeButton>Buy {strength === 'strong' ? weak : strong}</ExchangeButton>
        ) : bidAmount.lte(strongBalance) ? (
          input === '' ? (
            <ExchangeButton>Buy {strength === 'strong' ? weak : strong}</ExchangeButton>
          ) : (
            <ExchangeButton onClick={onBid}>
              Buy {strength === 'strong' ? weak : strong}
            </ExchangeButton>
          )
        ) : (
          <ExchangeButton>Low {strong} Balance</ExchangeButton>
        )
      ) : (
        <NOMButton onBid={onBid} onApprove={onApprove} />
      )}
    </ExchangeItem>
  );
}
