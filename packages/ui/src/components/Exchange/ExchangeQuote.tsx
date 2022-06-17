/* eslint-disable no-nested-ternary */
import React, { useCallback, useRef } from 'react';
import styled from 'styled-components';
import { BigNumber } from 'bignumber.js';
import _ from 'lodash';
import { useBondingCurve } from '@onomy/react-hub';

import ConfirmTransactionModal from 'components/Modals/components/ConfirmTransactionModal';
import PendingModal from 'components/Modals/components/PendingModal';
import ApproveTokensModal from 'components/Modals/components/ApproveTokensModal';
import RequestFailedModal from 'components/Modals/components/RequestFailedModal';
import TransactionCompletedModal from 'components/Modals/components/TransactionCompletedModal';
import TransactionFailedModal from 'components/Modals/components/TransactionFailedModal';
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
import { ExchObjState, ExchStringState } from 'context/exchange/ExchangeReducer';

const FlexDiv = styled.div`
  display: flex;
`;

const AvailableDiv = styled.strong`
  flex-grow: 1;
  text-align: right;
`;

export default function ExchangeQuote({ strength }: { strength: 'strong' | 'weak' }) {
  const { strongBalance, weakBalance, NOMallowance, bondingCurve } = useBondingCurve();
  const { handleModal } = useModal();

  const { askAmount, bidAmount, approveAmount, bidDenom, input, output, strong, weak } =
    useExchange();
  const { objDispatch, strDispatch } = useUpdateExchange();
  const isBuying = strength === 'strong';

  const approveRef = useRef<BigNumber>();
  approveRef.current = approveAmount;

  const getAskAmount = useCallback(
    async (askAmountState, bidAmountUpdate, textStrength) => {
      let askAmountUpdate = askAmountState;

      switch (textStrength) {
        case 'strong':
          // console.log('Strong: ', bidAmountUpdate.toFixed(0));
          askAmountUpdate = await bondingCurve!.actions.bondBuyQuoteETH(bidAmountUpdate);
          // console.log('Pull Strong Ask Amount', askAmountUpdate);
          break;

        case 'weak':
          askAmountUpdate = await bondingCurve!.actions.bondSellQuoteNOM(bidAmountUpdate);
          // console.log('Pull Weak Ask Amount', askAmountUpdate);
          break;

        default:
          // eslint-disable-next-line no-console
          console.error('Denom not set');
      }
      return new BigNumber(askAmountUpdate.toString());
    },
    [bondingCurve]
  );

  const submitTrans = useCallback(
    async (isApproving: boolean, slippage: BigNumber, gasPrice: BigNumber) => {
      handleModal(<PendingModal isApproving={isApproving} />);

      if (isApproving) {
        if (!approveAmount || !approveRef.current) return;

        try {
          const [, tx] = await bondingCurve!.actions.bNomIncreaseBondAllowance(
            new BigNumber(approveRef.current),
            gasPrice
          );
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
    [askAmount, bidAmount, approveAmount, bidDenom, handleModal, strong, weak, bondingCurve]
  );

  const onConfirmApprove = () => {
    try {
      handleModal(<ConfirmTransactionModal isApproving submitTrans={submitTrans} />);
    } catch (e: any) {
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
    const strUpdate: Partial<ExchStringState> = {};
    strUpdate.bidDenom = strength;

    const bidMaxValue = strength === 'strong' ? strongBalance : weakBalance;
    strUpdate.input = format18(bidMaxValue).toFixed();

    let askAmountUpdate;

    try {
      // console.log('calling here:', askAmount, bidMaxValue, strength);
      askAmountUpdate = await getAskAmount(askAmount, bidMaxValue, strength);
    } catch (err: any) {
      if (err) {
        handleModal(<RequestFailedModal error={err.error.message} />);
      }
    }

    const objUpdate: Partial<ExchObjState> = {};
    if (bidMaxValue.gt(NOMallowance)) {
      const approvalAmount = bidMaxValue.minus(NOMallowance);

      objUpdate.approveAmount = approvalAmount;

      strUpdate.approve = format18(approvalAmount).toFixed();
    }

    objUpdate.askAmount = askAmountUpdate;

    objUpdate.bidAmount = bidMaxValue;

    objDispatch({
      type: 'update',
      value: objUpdate,
    });

    if (askAmountUpdate) {
      strUpdate.output = format18(new BigNumber(askAmountUpdate.toString())).toFixed(8);
    }

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

        try {
          const bidAmountUpdate = parse18(new BigNumber(parseFloat(evt.target.value).toString()));

          const askAmountUpdate = (
            await await getAskAmount(askAmount, bidAmountUpdate, textStrength)
          ).toString();

          objDispatch({
            type: 'askAmount',
            value: new BigNumber(askAmountUpdate),
          });

          strDispatch({
            type: 'output',
            value: format18(new BigNumber(askAmountUpdate)).toFixed(8),
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
          objDispatch({
            type: 'update',
            value: {
              askAmount: new BigNumber(0),
              bidAmount: new BigNumber(0),
              approveAmount: new BigNumber(0),
            },
          });

          strDispatch({
            type: 'update',
            value: {
              bidDenom: strength,
              input: evt.target.value.toString(),
              output: '',
              approve: '',
            },
          });

          break;
        }

        case floatRegExp.test(evt.target.value.toString()): {
          const bidAmountUpdate = parse18(new BigNumber(parseFloat(evt.target.value).toString()));

          const strUpdate: Partial<ExchStringState> = {};
          const objUpdate: Partial<ExchObjState> = {};

          if (bidDenom !== strength) {
            strUpdate.bidDenom = strength;
          }

          objUpdate.bidAmount = bidAmountUpdate;
          strUpdate.input = evt.target.value.toString();

          debounced.call(null);

          if (bidAmountUpdate.gt(NOMallowance)) {
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
          <ExchangeButton>Exceeds Available {strong}</ExchangeButton>
        )
      ) : (
        <NOMButton onBid={onBid} onApprove={onApprove} />
      )}
    </ExchangeItem>
  );
}
