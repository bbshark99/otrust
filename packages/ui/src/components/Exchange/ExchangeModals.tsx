import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import Modal from 'react-modal';
import styled from 'styled-components';
import { BigNumber } from 'bignumber.js';
import _ from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faExchangeAlt } from '@fortawesome/free-solid-svg-icons';
import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import { useBondingCurve } from '@onomy/react-hub';

import ConfirmTransactionModal from 'components/Modals/components/ConfirmTransactionModal';
import PendingModal from 'components/Modals/components/PendingModal';
import ApproveTokensModal from 'components/Modals/components/ApproveTokensModal';
import RequestFailedModal from 'components/Modals/components/RequestFailedModal';
import TransactionCompletedModal from 'components/Modals/components/TransactionCompletedModal';
import TransactionFailedModal from 'components/Modals/components/TransactionFailedModal';
import { responsive } from 'theme/constants';
import {
  SellBtn,
  ExchangeButton,
  Sending,
  ExchangeInput,
  MaxBtn,
  Receiving,
  ReceivingValue,
  SendingBox,
} from './exchangeStyles';
import { useExchange, useUpdateExchange } from 'context/exchange/ExchangeContext';
import { useModal } from 'context/modal/ModalContext';
import { format18 } from 'utils/math';
import { NOTIFICATION_MESSAGES } from 'constants/NotificationMessages';
import { ExchObjState, ExchStringState } from 'context/exchange/ExchangeReducer';

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
  const { strongBalance, weakBalance, currentETHPrice, NOMallowance, bondingCurve } =
    useBondingCurve();
  const { objDispatch, strDispatch } = useUpdateExchange();
  const { handleModal } = useModal();
  const approveRef = useRef<BigNumber>();
  approveRef.current = approveAmount;

  useEffect(() => {
    if (buyModalOpen) setIsStrongOrWeak('strong');
    else if (sellModalOpen) setIsStrongOrWeak('weak');
  }, [buyModalOpen, sellModalOpen]);

  const calculateReceivingAmount = useMemo(
    () =>
      _.debounce(async value => {
        let askAmountUpdate: BigNumber;
        if (value === '.' || value === '') {
          setCalculatedAmount(initialCalculatedAmount);
          return new BigNumber(0);
        }
        try {
          if (buyModalOpen) {
            askAmountUpdate = await bondingCurve!.actions.bondBuyQuoteETH(
              new BigNumber(value).shiftedBy(18)
            );
            setCalculatedAmount(prevState => {
              return {
                ...prevState,
                WNOMCalcValue: new BigNumber(askAmountUpdate.toString())
                  .shiftedBy(-18)
                  .toFixed(8)
                  .toString(),
              };
            });
          } else if (sellModalOpen) {
            askAmountUpdate = await bondingCurve!.actions.bondSellQuoteNOM(
              new BigNumber(value).shiftedBy(18)
            );
            setCalculatedAmount(prevState => {
              return {
                ...prevState,
                ETHCalcValue: new BigNumber(askAmountUpdate.toString())
                  .shiftedBy(-18)
                  .toFixed(8)
                  .toString(),
              };
            });
          }
        } catch (error: any) {
          // eslint-disable-next-line no-console
          console.log(error.message);
        }

        // @ts-ignore
        if (askAmountUpdate) {
          objDispatch({
            type: 'askAmount',
            value: new BigNumber(askAmountUpdate.toString()),
          });

          strDispatch({
            type: 'output',
            value: format18(new BigNumber(askAmountUpdate.toString())).toFixed(8),
          });
        }
      }, 300),
    [buyModalOpen, sellModalOpen, bondingCurve, strDispatch, objDispatch]
  );

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = async event => {
    const { value } = event.target;
    const floatRegExp = new RegExp(
      /(^(?=.+)(?:[1-9]\d*|0)?(?:\.\d{1,18})?$)|(^\d+?\.$)|(^\+?(?!0\d+)$|(^$)|(^\.$))/
    );
    if (floatRegExp.test(value)) {
      setSellAmount(prevState => {
        return { ...prevState, [event.target.name]: value };
      });
      calculateReceivingAmount(value);

      const bidAmountUpdate = new BigNumber(value.toString()).shiftedBy(18);
      const strUpdate: Partial<ExchStringState> = {
        bidDenom: isStrongOrWeak,
        input: value.toString(),
      };
      const objUpdate: Partial<ExchObjState> = {
        bidAmount: bidAmountUpdate,
      };

      if (isStrongOrWeak === 'weak' && bidAmountUpdate.gt(NOMallowance)) {
        const approvalAmount = bidAmountUpdate.minus(NOMallowance);
        objUpdate.approveAmount = approvalAmount;
        strUpdate.approve = format18(approvalAmount).toFixed();
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

  const handleMaxBtn: React.MouseEventHandler<HTMLButtonElement> = async event => {
    event.preventDefault();
    let maxValue: string;

    const bidMaxValue = isStrongOrWeak === 'strong' ? strongBalance : weakBalance;
    const eventTargetName = (event.target as HTMLButtonElement).name;
    if (eventTargetName === 'ETHValue') {
      maxValue = strongBalance.shiftedBy(-18).toString(10);
      calculateReceivingAmount(maxValue);
      setSellAmount(prevState => {
        return { ...prevState, [eventTargetName]: maxValue };
      });
    } else if (eventTargetName === 'WNOMValue') {
      maxValue = weakBalance.shiftedBy(-18).toString(10);
      calculateReceivingAmount(maxValue);
      setSellAmount(prevState => {
        return { ...prevState, [eventTargetName]: maxValue };
      });
    }
    const objUpdate: Partial<ExchObjState> = {
      bidAmount: bidMaxValue,
    };
    const strUpdate: Partial<ExchStringState> = {
      bidDenom: isStrongOrWeak,
      input: format18(bidMaxValue).toFixed(),
    };

    if (isStrongOrWeak === 'weak' && bidMaxValue.gt(NOMallowance)) {
      const approvalAmount = bidMaxValue.minus(NOMallowance);

      objUpdate.approveAmount = approvalAmount;

      strUpdate.approve = format18(approvalAmount).toFixed();
    }

    objDispatch({
      type: 'update',
      value: objUpdate,
    });

    strDispatch({
      type: 'update',
      value: strUpdate,
    });
  };

  const submitTrans = useCallback(
    async (isApproving, slippage, gasPrice) => {
      handleModal(<PendingModal isApproving={isApproving} />);

      if (isApproving) {
        if (!approveAmount || !approveRef.current) return;

        try {
          const [, tx] = await bondingCurve!.actions.bNomIncreaseBondAllowance(
            new BigNumber(approveRef.current),
            gasPrice
          );

          setCalculatedAmount(initialCalculatedAmount);
          setSellAmount(initialAmount);
          handleModal(<TransactionCompletedModal isApproving tx={tx} />);
        } catch (e: any) {
          // eslint-disable-next-line no-console
          console.error(e);
          handleModal(<TransactionFailedModal error={`${e.code}\n${e.message.slice(0, 80)}...`} />);
        }
      } else {
        if (!bidAmount || !askAmount) return;
        try {
          let tx;

          switch (bidDenom) {
            case 'strong':
              // Preparing for many tokens / coins
              switch (strong) {
                case 'ETH':
                  // eslint-disable-next-line prefer-destructuring
                  tx = (
                    await bondingCurve!.actions.bondBuyNOM(bidAmount, askAmount, slippage, gasPrice)
                  )[1];
                  setCalculatedAmount(initialCalculatedAmount);
                  setSellAmount(initialAmount);
                  handleModal(<TransactionCompletedModal tx={tx} />);

                  break;
                default: {
                  break;
                }
              }
              break;

            case 'weak':
              switch (weak) {
                case 'bNOM':
                  // eslint-disable-next-line prefer-destructuring
                  tx = (
                    await bondingCurve!.actions.bondSellNOM(
                      bidAmount,
                      askAmount,
                      slippage,
                      gasPrice
                    )
                  )[1];

                  setCalculatedAmount(initialCalculatedAmount);
                  setSellAmount(initialAmount);
                  handleModal(<TransactionCompletedModal tx={tx} />);
                  break;
                default: {
                  break;
                }
              }
              break;

            default:
              break;
          }
        } catch (e: any) {
          let error;
          if (Object.keys(NOTIFICATION_MESSAGES).includes(e.message)) {
            error = (NOTIFICATION_MESSAGES.error as any)[e.message];
          } else {
            error = `${e.code}\n${e.message.slice(0, 80)}...`;
          }
          handleModal(<TransactionFailedModal error={error} />);
        }
      }
    },
    [askAmount, bidAmount, approveAmount, bidDenom, bondingCurve, handleModal, strong, weak]
  );

  const onBuyNomHandler = () => {
    if (strongBalance.gte(new BigNumber(sellAmount.ETHValue).shiftedBy(18))) {
      handleModal(<ConfirmTransactionModal submitTrans={submitTrans} />);
    } else {
      handleModal(<RequestFailedModal error="Insufficient funds" />);
    }
  };

  const onConfirmApprove = () => {
    try {
      handleModal(<ConfirmTransactionModal isApproving submitTrans={submitTrans} />);
    } catch (e: any) {
      handleModal(<TransactionFailedModal error={`${e.code}\n${e.message.slice(0, 80)}...`} />);
    }
  };

  const onSellNomHandler = () => {
    if (weakBalance.gte(new BigNumber(sellAmount.WNOMValue).shiftedBy(18))) {
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
      <ExchangeButton
        data-testid="exchanges-modals-buy-button"
        onClick={() => setBuyModalOpen(true)}
      >
        Buy bNOM
      </ExchangeButton>

      <SellBtn data-testid="exchanges-modals-sell-button" onClick={() => setSellModalOpen(true)}>
        Sell bNOM
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
              <FontAwesomeIcon icon={faChevronLeft as IconProp} />
            </ModalBtn>
            <h6>Buy bNOM</h6>
            <ModalBtn
              onClick={() => {
                setSellModalOpen(!sellModalOpen);
                setBuyModalOpen(!buyModalOpen);
              }}
            >
              <FontAwesomeIcon icon={faExchangeAlt as IconProp} />
            </ModalBtn>
          </ModalHeader>

          <ModalInfo data-testid="buy-nom-modal-info">
            <HeaderInfoItem>
              <strong>Eth Balance</strong>
              <HeaderInfoItemValue>
                <strong>
                  {BigNumber.isBigNumber(strongBalance)
                    ? `${format18(strongBalance).toFixed(6)}`
                    : 'Loading'}
                </strong>
              </HeaderInfoItemValue>
            </HeaderInfoItem>
            <HeaderInfoItem>
              <strong>bNOM Balance</strong>
              <HeaderInfoItemValue>
                <strong>
                  {BigNumber.isBigNumber(weakBalance)
                    ? `${format18(weakBalance).toFixed(6)}`
                    : 'Loading'}
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
            <strong>Buy bNOM</strong>
            <Sending>
              {sellAmount.ETHValue === '' && <strong>I&apos;m buying for</strong>}
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
              <FontAwesomeIcon icon={faChevronLeft as IconProp} />
            </ModalBtn>
            <h6>Sell bNOM</h6>
            <ModalBtn
              onClick={() => {
                setSellModalOpen(!sellModalOpen);
                setBuyModalOpen(!buyModalOpen);
                setSellAmount(initialAmount);
                setCalculatedAmount(initialCalculatedAmount);
              }}
            >
              <FontAwesomeIcon icon={faExchangeAlt as IconProp} />
            </ModalBtn>
          </ModalHeader>

          <ModalInfo data-testid="sell-nom-modal-info">
            <HeaderInfoItem>
              <strong>Eth Balance</strong>
              <HeaderInfoItemValue>
                <strong>
                  {BigNumber.isBigNumber(strongBalance)
                    ? `${format18(strongBalance).toFixed(6)}`
                    : 'Loading'}
                </strong>
              </HeaderInfoItemValue>
            </HeaderInfoItem>
            <HeaderInfoItem>
              <strong>bNOM Balance</strong>
              <HeaderInfoItemValue>
                <strong>
                  {BigNumber.isBigNumber(weakBalance)
                    ? `${format18(weakBalance).toFixed(6)}`
                    : 'Loading'}
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
            <strong>Sell bNOM</strong>
            <Sending>
              {sellAmount.ETHValue === '' && <strong>I&apos;m selling</strong>}
              <ExchangeInput
                type="text"
                name="WNOMValue"
                onChange={handleChange}
                value={sellAmount.WNOMValue}
                placeholder="0.00"
                autoComplete="off"
              />
              <SendingBox>
                <strong style={{ marginLeft: '16px' }}>bNOM</strong>
                <MaxBtn onClick={handleMaxBtn} name="bNOMValue">
                  Max
                </MaxBtn>
              </SendingBox>
            </Sending>
            <Receiving>
              <strong>You will receive</strong>
              <ReceivingValue>{calculatedAmount.ETHCalcValue}</ReceivingValue>
            </Receiving>
            <div>
              <SellBtn onClick={onSellNomHandler}>Sell bNOM</SellBtn>
            </div>
          </FormWrapper>
        </ExchangeModalWrapper>
      </Modal>
    </ModalTrigger>
  );
}
