import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import Modal from 'react-modal';
import styled from 'styled-components';
import { BigNumber } from 'bignumber.js';
import ConfirmTransactionModal from 'components/Modals/components/ConfirmTransactionModal';
import PendingModal from 'components/Modals/components/PendingModal';
import ApproveTokensModal from 'components/Modals/components/ApproveTokensModal';
import RequestFailedModal from 'components/Modals/components/RequestFailedModal';
import TransactionCompletedModal from 'components/Modals/components/TransactionCompletedModal';
import TransactionFailedModal from 'components/Modals/components/TransactionFailedModal';
import { useWeb3React } from '@web3-react/core';
import _ from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faExchangeAlt } from '@fortawesome/free-solid-svg-icons';

import { responsive } from 'theme/constants';
import { SellBtn, ExchangeButton, Sending, ExchangeInput, MaxBtn, Receiving, ReceivingValue } from './exchangeStyles';
import { useChain } from 'context/chain/ChainContext';
import { BondingCont, NOMCont } from 'context/chain/contracts';
import { useExchange, useUpdateExchange } from 'context/exchange/ExchangeContext';
import { useModal } from 'context/modal/ModalContext';
import { format18 } from 'utils/math';
import { SendingBox } from './exchangeStyles';
import { NOTIFICATION_MESSAGES } from 'constants/NotificationMessages';

const ModalTrigger = styled.div`
  display: none;

  @media screen and (max-width: ${responsive.smartphoneLarge}) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
  }
`;

const ExchangeModalWrapper = styled.div`
  width: 100%;
  height: 100%;

  background-color: ${props => props.theme.colors.bgDarkest};

  header {
    padding: 20px 20px 0;

    background-color: ${props => props.theme.colors.bgNormal};
  }
`;

const ModalHeader = styled.header`
  display: flex;
  align-items: center;

  h6 {
    margin: 0 auto;

    font-size: 16px;
  }
`;

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  padding: 56px 20px;
`;

const HeaderInfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;

  @media screen and (max-width: ${responsive.laptop}) {
    gap: 5px;
  }

  & + & {
    margin-left: 56px;

    @media screen and (max-width: ${responsive.laptop}) {
      margin-left: 32px;
    }
  }

  > strong {
    color: ${props => props.theme.colors.textThirdly};
    font-weight: 400;

    @media screen and (max-width: ${responsive.smartphoneLarge}) {
      font-size: 10px;
    }
  }
`;

const HeaderInfoItemValue = styled.div`
  @media screen and (max-width: ${responsive.smartphoneLarge}) {
    display: flex;
    flex-direction: column;

    gap: 5px;
  }

  > strong {
    margin-right: 12px;

    color: ${props => props.theme.colors.textPrimary};
    font-family: 'Bebas Neue', sans-serif;
    font-size: 24px;

    @media screen and (max-width: ${responsive.laptop}) {
      font-size: 20px;
    }

    @media screen and (max-width: ${responsive.smartphoneLarge}) {
      font-size: 18px;
    }
  }
`;

const ModalInfo = styled.div`
  display: flex;
  justify-content: space-between;

  padding: 32px 20px;

  background-color: ${props => props.theme.colors.bgNormal};
`;

const ModalBtn = styled.button`
  width: 44px;
  height: 44px;

  border-radius: 8px;
  border: none;
  background-color: ${props => props.theme.colors.bgHighlightBorder};

  color: #84809a;

  cursor: pointer;
`;

const modalOverride = {
  content: {
    padding: 0,
    border: 'none',
    borderRadius: 0,

    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
};

const initialAmount = { ETHValue: '', WNOMValue: '' };
const initialCalculatedAmount = { ETHCalcValue: '', WNOMCalcValue: '' };

export default function ExchangeModals() {
  const [buyModalOpen, setBuyModalOpen] = useState(false);
  const [sellModalOpen, setSellModalOpen] = useState(false);
  const [sellAmount, setSellAmount] = useState(initialAmount);
  const [calculatedAmount, setCalculatedAmount] = useState(initialCalculatedAmount);
  const [isStrongOrWeak, setIsStrongOrWeak] = useState('');

  const { askAmount, bidAmount, approveAmount, bidDenom, strong, weak } = useExchange();
  const { strongBalance, weakBalance, currentETHPrice, NOMallowance } = useChain();
  const { objDispatch, strDispatch } = useUpdateExchange();
  const { library } = useWeb3React();
  const { handleModal } = useModal();
  const approveRef = useRef();
  approveRef.current = approveAmount;

  const bondContract = BondingCont(library);
  const NOMcontract = NOMCont(library);

  useEffect(() => {
    if (buyModalOpen) setIsStrongOrWeak('strong');
    else if (sellModalOpen) setIsStrongOrWeak('weak');
  }, [buyModalOpen, sellModalOpen]);

  const calculateReceivingAmount = useMemo(
    () =>
      _.debounce(async value => {
        let askAmountUpdate;
        let strUpdate = new Map();
        let objUpdate = new Map();
        if (value === '.' || value === '') {
          setCalculatedAmount('');
          return BigNumber(0);
        }
        try {
          if (buyModalOpen) {
            askAmountUpdate = await bondContract.buyQuoteETH(BigNumber(value).shiftedBy(18).toString(10));
            setCalculatedAmount(prevState => {
              return {
                ...prevState,
                WNOMCalcValue: BigNumber(askAmountUpdate.toString()).shiftedBy(-18).toFixed(8).toString(10),
              };
            });
          } else if (sellModalOpen) {
            askAmountUpdate = await bondContract.sellQuoteNOM(BigNumber(value).shiftedBy(18).toString(10));
            setCalculatedAmount(prevState => {
              return {
                ...prevState,
                ETHCalcValue: BigNumber(askAmountUpdate.toString()).shiftedBy(-18).toFixed(8).toString(10),
              };
            });
          }
        } catch (error) {
          console.log(error.message);
        }
        objUpdate.set('askAmount', BigNumber(askAmountUpdate.toString()));
        objDispatch({
          type: 'update',
          value: objUpdate,
        });

        strUpdate.set('output', format18(BigNumber(askAmountUpdate.toString())).toFixed(8));
        strDispatch({
          type: 'update',
          value: strUpdate,
        });
      }, 300),
    [buyModalOpen, sellModalOpen, bondContract, strDispatch, objDispatch],
  );

  const handleChange = async event => {
    const value = event.target.value;
    const floatRegExp = new RegExp(/(^(?=.+)(?:[1-9]\d*|0)?(?:\.\d{1,18})?$)|(^\d+?\.$)|(^\+?(?!0\d+)$|(^$)|(^\.$))/);
    if (floatRegExp.test(value)) {
      setSellAmount(prevState => {
        return { ...prevState, [event.target.name]: value };
      });
      calculateReceivingAmount(value);
      let strUpdate = new Map();
      let objUpdate = new Map();
      const bidAmountUpdate = BigNumber(value.toString()).shiftedBy(18);

      objUpdate.set('bidAmount', bidAmountUpdate);

      objDispatch({
        type: 'update',
        value: objUpdate,
      });

      strUpdate.set('bidDenom', isStrongOrWeak).set('input', value.toString());

      if (isStrongOrWeak === 'weak' && bidAmountUpdate.gt(NOMallowance)) {
        const approvalAmount = bidAmountUpdate.minus(NOMallowance);

        objUpdate.set('approveAmount', approvalAmount);

        strUpdate.set('approve', format18(approvalAmount).toFixed());
      }

      objDispatch({
        type: 'update',
        value: objUpdate,
      });

      strDispatch({
        type: 'update',
        value: strUpdate,
      });
    }
  };

  const handleMaxBtn = async event => {
    event.preventDefault();
    let maxValue;
    let objUpdate = new Map();
    let strUpdate = new Map();
    let bidMaxValue = isStrongOrWeak === 'strong' ? strongBalance : weakBalance;

    if (event.target.name === 'ETHValue') {
      maxValue = strongBalance.shiftedBy(-18).toString(10);
      calculateReceivingAmount(maxValue);
      setSellAmount(prevState => {
        return { ...prevState, [event.target.name]: maxValue };
      });
    } else if (event.target.name === 'WNOMValue') {
      maxValue = weakBalance.shiftedBy(-18).toString(10);
      calculateReceivingAmount(maxValue);
      setSellAmount(prevState => {
        return { ...prevState, [event.target.name]: maxValue };
      });
    }
    if (isStrongOrWeak === 'weak' && bidMaxValue.gt(NOMallowance)) {
      const approvalAmount = bidMaxValue.minus(NOMallowance);

      objUpdate.set('approveAmount', approvalAmount);

      strUpdate.set('approve', format18(approvalAmount).toFixed());
    }
    objUpdate.set('bidAmount', bidMaxValue);

    objDispatch({
      type: 'update',
      value: objUpdate,
    });

    strUpdate.set('bidDenom', isStrongOrWeak).set('input', format18(bidMaxValue).toFixed());

    strDispatch({
      type: 'update',
      value: strUpdate,
    });
  };

  const submitTrans = useCallback(
    async (isApproving, slippage, gasPrice) => {
      handleModal(<PendingModal isApproving={isApproving} />);

      if (isApproving) {
        if (!approveAmount) return;

        try {
          let tx = await NOMcontract.increaseAllowance(bondContract.address, approveRef.current.toFixed(0), {
            gasPrice: gasPrice.toFixed(0),
          });

          tx.wait().then(() => {
            setCalculatedAmount('');
            setSellAmount(initialAmount);
            handleModal(<TransactionCompletedModal isApproving tx={tx} />);
          });
        } catch (e) {
          console.log(e);
          handleModal(<TransactionFailedModal error={e.code + '\n' + e.message.slice(0, 80) + '...'} />);
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
                  const gasFeeRaw = await bondContract.estimateGas.buyNOM(askAmount.toFixed(0), slippage.toFixed(0), {
                    value: bidAmount.toFixed(0),
                  });

                  gasFee = new BigNumber(gasFeeRaw.toString());

                  const gas = gasFee.times(gasPrice);
                  if (bidAmount.lt(gas)) {
                    handleModal(<TransactionFailedModal error={NOTIFICATION_MESSAGES.error.lowBid} />);
                    return;
                  }

                  const bidAmountUpdate = bidAmount.minus(gasFee.times(gasPrice));
                  const askAmountUpdateRaw = await bondContract.buyQuoteETH(bidAmountUpdate.toFixed());
                  const askAmountUpdate = new BigNumber(askAmountUpdateRaw.toString());

                  tx = await bondContract.buyNOM(askAmountUpdate.toFixed(0), slippage.toFixed(0), {
                    value: bidAmountUpdate.toFixed(0),
                    gasPrice: gasPrice.toFixed(0),
                    gasLimit: gasFee.toFixed(0),
                  });

                  tx.wait().then(() => {
                    setCalculatedAmount('');
                    setSellAmount(initialAmount);
                    handleModal(<TransactionCompletedModal tx={tx} />);
                  });

                  break;
                default: {
                }
              }
              break;

            case 'weak':
              switch (weak) {
                case 'wNOM':
                  tx = await bondContract.sellNOM(bidAmount.toFixed(0), askAmount.toFixed(0), slippage.toFixed(0), {
                    gasPrice: gasPrice.toFixed(0),
                  });

                  tx.wait().then(() => {
                    setCalculatedAmount('');
                    setSellAmount(initialAmount);
                    handleModal(<TransactionCompletedModal tx={tx} />);
                  });
                  break;
                default: {
                }
              }
              break;

            default:
              console.log();
          }
        } catch (e) {
          console.error(e.code, e.message.message);
          handleModal(<TransactionFailedModal error={e.code + '\n' + e.message.slice(0, 80) + '...'} />);
        }
      }
    },
    [askAmount, bidAmount, approveAmount, bidDenom, NOMcontract, bondContract, handleModal, strong, weak],
  );

  const onBuyNomHandler = () => {
    if (strongBalance.gte(BigNumber(sellAmount.ETHValue).shiftedBy(18))) {
      handleModal(<ConfirmTransactionModal submitTrans={submitTrans} />);
    } else {
      handleModal(<RequestFailedModal error="Insufficient funds" />);
    }
  };

  const onConfirmApprove = () => {
    try {
      handleModal(<ConfirmTransactionModal isApproving submitTrans={submitTrans} />);
    } catch (e) {
      handleModal(<TransactionFailedModal error={e.code + '\n' + e.message.slice(0, 80) + '...'} />);
    }
  };

  const onSellNomHandler = () => {
    if (weakBalance.gte(BigNumber(sellAmount.WNOMValue).shiftedBy(18))) {
      handleModal(<ConfirmTransactionModal submitTrans={submitTrans} />);
      if (bidAmount.gt(NOMallowance)) {
        handleModal(<ApproveTokensModal onConfirmApprove={onConfirmApprove} />);
      } else {
        handleModal(<ConfirmTransactionModal submitTrans={submitTrans} />);
      }
    } else {
      handleModal(<RequestFailedModal error="Insufficient funds" />);
    }
  };

  return (
    <ModalTrigger>
      <ExchangeButton data-testid="exchanges-modals-buy-button" onClick={() => setBuyModalOpen(true)}>
        Buy wNOM
      </ExchangeButton>

      <SellBtn data-testid="exchanges-modals-sell-button" onClick={() => setSellModalOpen(true)}>
        Sell wNOM
      </SellBtn>

      <Modal
        ariaHideApp={false}
        isOpen={buyModalOpen}
        style={modalOverride}
        onRequestClose={() => setBuyModalOpen(false)}
      >
        <ExchangeModalWrapper>
          <ModalHeader>
            <ModalBtn onClick={() => setBuyModalOpen(false)}>
              <FontAwesomeIcon icon={faChevronLeft} />
            </ModalBtn>
            <h6>Buy wNOM</h6>
            <ModalBtn
              onClick={() => {
                setSellModalOpen(!sellModalOpen);
                setBuyModalOpen(!buyModalOpen);
              }}
            >
              <FontAwesomeIcon icon={faExchangeAlt} />
            </ModalBtn>
          </ModalHeader>

          <ModalInfo data-testid="buy-nom-modal-info">
            <HeaderInfoItem>
              <strong>Eth Balance</strong>
              <HeaderInfoItemValue>
                <strong>
                  {BigNumber.isBigNumber(strongBalance) ? `${format18(strongBalance).toFixed(6)}` : 'Loading'}
                </strong>
              </HeaderInfoItemValue>
            </HeaderInfoItem>
            <HeaderInfoItem>
              <strong>wNOM Balance</strong>
              <HeaderInfoItemValue>
                <strong>
                  {BigNumber.isBigNumber(weakBalance) ? `${format18(weakBalance).toFixed(6)}` : 'Loading'}
                </strong>
              </HeaderInfoItemValue>
            </HeaderInfoItem>
            <HeaderInfoItem>
              <strong>NOM / USDT</strong>
              <HeaderInfoItemValue>
                <strong>$10.12</strong>
              </HeaderInfoItemValue>
            </HeaderInfoItem>
            <HeaderInfoItem>
              <strong>NOM / ETH</strong>
              <HeaderInfoItemValue>
                <strong>
                  {BigNumber.isBigNumber(currentETHPrice)
                    ? `${Math.round(format18(currentETHPrice).toNumber())}`
                    : 'Loading'}
                </strong>
              </HeaderInfoItemValue>
            </HeaderInfoItem>
          </ModalInfo>

          <FormWrapper data-testid="buy-nom-modal-results">
            <strong>Buy wNOM</strong>
            <Sending>
              <strong>I'm buying for</strong>
              <ExchangeInput
                type="text"
                name="ETHValue"
                onChange={handleChange}
                value={sellAmount.ETHValue}
                placeholder="0.00"
                autoComplete="off"
              />
              <SendingBox>
                <strong style={{ marginLeft: '16px' }}>ETH</strong>
                <MaxBtn onClick={handleMaxBtn} name="ETHValue">
                  Max
                </MaxBtn>
              </SendingBox>
            </Sending>
            <Receiving>
              <strong>You will receive</strong>
              <ReceivingValue>{calculatedAmount.WNOMCalcValue}</ReceivingValue>
            </Receiving>
            <div>
              <ExchangeButton onClick={onBuyNomHandler}>Buy NOM</ExchangeButton>
            </div>
          </FormWrapper>
        </ExchangeModalWrapper>
      </Modal>

      <Modal
        ariaHideApp={false}
        isOpen={sellModalOpen}
        style={modalOverride}
        onRequestClose={() => setSellModalOpen(false)}
      >
        <ExchangeModalWrapper>
          <ModalHeader>
            <ModalBtn onClick={() => setSellModalOpen(false)}>
              <FontAwesomeIcon icon={faChevronLeft} />
            </ModalBtn>
            <h6>Sell wNOM</h6>
            <ModalBtn
              onClick={() => {
                setSellModalOpen(!sellModalOpen);
                setBuyModalOpen(!buyModalOpen);
                setSellAmount(initialAmount);
                setCalculatedAmount(initialCalculatedAmount);
              }}
            >
              <FontAwesomeIcon icon={faExchangeAlt} />
            </ModalBtn>
          </ModalHeader>

          <ModalInfo data-testid="sell-nom-modal-info">
            <HeaderInfoItem>
              <strong>Eth Balance</strong>
              <HeaderInfoItemValue>
                <strong>
                  {BigNumber.isBigNumber(strongBalance) ? `${format18(strongBalance).toFixed(6)}` : 'Loading'}
                </strong>
              </HeaderInfoItemValue>
            </HeaderInfoItem>
            <HeaderInfoItem>
              <strong>wNOM Balance</strong>
              <HeaderInfoItemValue>
                <strong>
                  {BigNumber.isBigNumber(weakBalance) ? `${format18(weakBalance).toFixed(6)}` : 'Loading'}
                </strong>
              </HeaderInfoItemValue>
            </HeaderInfoItem>
            <HeaderInfoItem>
              <strong>NOM / USDT</strong>
              <HeaderInfoItemValue>
                <strong>$10.12</strong>
              </HeaderInfoItemValue>
            </HeaderInfoItem>
            <HeaderInfoItem>
              <strong>NOM / ETH</strong>
              <HeaderInfoItemValue>
                <strong>
                  {BigNumber.isBigNumber(currentETHPrice)
                    ? `${Math.round(format18(currentETHPrice).toNumber())}`
                    : 'Loading'}
                </strong>
              </HeaderInfoItemValue>
            </HeaderInfoItem>
          </ModalInfo>

          <FormWrapper data-testid="sell-nom-modal-results">
            <strong>Sell wNOM</strong>
            <Sending>
              <strong>I'm selling</strong>
              <ExchangeInput
                type="text"
                name="WNOMValue"
                onChange={handleChange}
                value={sellAmount.WNOMValue}
                placeholder="0.00"
                autoComplete="off"
              />
              <SendingBox>
                <strong style={{ marginLeft: '16px' }}>wNOM</strong>
                <MaxBtn onClick={handleMaxBtn} name="WNOMValue">
                  Max
                </MaxBtn>
              </SendingBox>
            </Sending>
            <Receiving>
              <strong>You will receive</strong>
              <ReceivingValue>{calculatedAmount.ETHCalcValue}</ReceivingValue>
            </Receiving>
            <div>
              <SellBtn onClick={onSellNomHandler}>Sell wNOM</SellBtn>
            </div>
          </FormWrapper>
        </ExchangeModalWrapper>
      </Modal>
    </ModalTrigger>
  );
}
