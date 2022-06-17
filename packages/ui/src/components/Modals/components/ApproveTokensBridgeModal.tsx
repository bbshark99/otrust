import React, { useState, useEffect, useCallback } from 'react';
import { useBondingCurve } from '@onomy/react-hub';
import styled from 'styled-components';
import useInterval from '@use-it/interval';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BigNumber } from 'bignumber.js';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

import { useGasPriceSelection } from 'hooks/useGasPriceSelection';
import LoadingSpinner from 'components/UI/LoadingSpinner';
import * as Modal from '../styles';
import { responsive } from 'theme/constants';
import { MaxBtn } from 'components/Exchange/exchangeStyles';
import { NOTIFICATION_MESSAGES } from '../../../constants/NotificationMessages';

const Message = styled.div`
  margin: 32px 0 0;

  color: ${props => props.theme.colors.textSecondary};

  @media screen and (max-width: ${responsive.smartphone}) {
    font-size: 14px;
  }
`;

const Caption = styled(Modal.Caption)`
  text-align: left;
`;

const ModalBtn = styled.button`
  width: 44px;
  height: 44px;

  margin-bottom: 32px;

  border-radius: 8px;
  border: none;
  background-color: ${props => props.theme.colors.bgHighlightBorder};

  color: #84809a;

  cursor: pointer;
`;

const ApproveTokensWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 12px;
  margin-top: 24px;

  background-color: ${props => props.theme.colors.bgHighlightBorder};
  border-radius: 8px;

  > div {
    margin-left: 8px;

    display: flex;
    flex-direction: column;
  }

  label {
    margin-bottom: 6px;

    color: ${props => props.theme.colors.textThirdly};
    font-size: 12px;
  }

  input {
    display: block;

    background: none;
    border: none;

    color: ${props => props.theme.colors.textPrimary};
    font-size: 18px;

    &:focus {
      outline: none;
    }
  }
`;

const OptionCaption = styled.p`
  margin: 0 0 12px;
  color: ${props => props.theme.colors.textThirdly};
`;

const Options = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin: 12px 0 16px;
`;

const OptionBtn = styled.button<{ active: boolean }>`
  padding: 12px 16px;
  background-color: ${props =>
    props.active ? props.theme.colors.bgHighlightBorder : 'transparent'};
  border: 1px solid ${props => props.theme.colors.bgHighlightBorder};
  border-radius: 22px;
  font-size: 14px;
  font-weight: 500;
  color: ${props =>
    props.active ? props.theme.colors.textPrimary : props.theme.colors.textSecondary};
  &:hover {
    background-color: ${props => props.theme.colors.bgHighlightBorder_lighten};
  }
  &:active {
    background-color: ${props => props.theme.colors.bgHighlightBorder_darken};
  }
`;

export default function ApproveTokensBridgeModal({
  amountValue, // string
  allowanceAmountGravity, // BigNumber
  onCancelHandler, // () => void
  formattedWeakBalance, // BigNumber
  weakBalance, // BigNumber
  gasOptions, // { id: number, text: string, gas: BigNumber }
  gasPriceChoice, // number
  setGasPriceChoice, // (id: number) => void
  gasPrice, // BigNumber
}: {
  amountValue: string;
  allowanceAmountGravity: BigNumber; // TODO: incompatible BigNumber coming in here
  onCancelHandler: () => void;
  formattedWeakBalance: BigNumber;
  weakBalance: BigNumber;
  gasOptions: ReturnType<typeof useGasPriceSelection>['gasOptions'];
  gasPriceChoice: number;
  setGasPriceChoice: (choice: number) => void;
  gasPrice: BigNumber;
}) {
  const [count, setCount] = useState(60);
  const [delay, setDelay] = useState<number | null>(1000);
  const [isBtnDisabled, setIsBtnDisabled] = useState(false);
  const [approveAmountInputValue, setApproveAmountInputValue] = useState('');
  const [showLoader, setShowLoader] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isTransactionCompleted, setIsTransactionCompleted] = useState(false);
  const { bondingCurve } = useBondingCurve();

  useEffect(() => {
    if (amountValue && allowanceAmountGravity) {
      const amountBigNum = new BigNumber(amountValue).shiftedBy(18);
      const approveAmount = amountBigNum.minus(new BigNumber(allowanceAmountGravity.toString()));
      const formattedApproveAmount = approveAmount.shiftedBy(-18).toString(10);
      setApproveAmountInputValue(formattedApproveAmount);
    }
  }, [amountValue, allowanceAmountGravity]);

  const handleApproveAmountInputChange = (event: { target: { value: any } }) => {
    const { value } = event.target;
    const floatRegExp = new RegExp(
      /(^(?=.+)(?:[1-9]\d*|0)?(?:\.\d{1,18})?$)|(^\d+?\.$)|(^\+?(?!0\d+)$|(^$)|(^\.$))/
    );
    if (floatRegExp.test(value)) {
      setApproveAmountInputValue(value);
    }
  };

  const increaseCount = () => {
    if (count === 0) {
      setDelay(null);
      onCancelHandler();
    } else {
      setCount(count - 1);
    }
  };

  useInterval(increaseCount, delay);

  const maxBtnHandler = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    if (formattedWeakBalance) {
      const maxFormatted = weakBalance.minus(allowanceAmountGravity).shiftedBy(-18).toString(10);
      setApproveAmountInputValue(maxFormatted);
    }
  };

  const confirmApproveHandler = useCallback(
    async event => {
      event.preventDefault();
      if (approveAmountInputValue === '.' || !approveAmountInputValue) return;

      try {
        setErrorMessage('');
        setSuccessMessage('');
        setIsBtnDisabled(true);
        setDelay(null);
        setShowLoader(true);

        await bondingCurve?.actions.bNomIncreaseBridgeAllowance(
          new BigNumber(approveAmountInputValue).shiftedBy(18),
          gasPrice
        );

        setSuccessMessage(
          NOTIFICATION_MESSAGES.success.approvedBridgeTokens(approveAmountInputValue)
        );
        setIsTransactionCompleted(true);
      } catch (error: any) {
        if (error.code === 4001) {
          setErrorMessage(NOTIFICATION_MESSAGES.error.rejectedTransaction);
        } else {
          setErrorMessage(error.message);
        }
      } finally {
        setShowLoader(false);
        setIsBtnDisabled(false);
      }
    },
    [bondingCurve, approveAmountInputValue, gasPrice]
  );

  let infoMessage;
  const amountDisplay = parseFloat(amountValue || '0');

  if (allowanceAmountGravity?.gt(0)) {
    const formattedAllowanceAmountGravity = new BigNumber(allowanceAmountGravity.toString())
      .shiftedBy(-18)
      .toString(10);
    infoMessage = (
      <Message>
        You have approved bridging of up to <strong>{formattedAllowanceAmountGravity} bNOM</strong>.
        To bridge <strong>{amountDisplay} bNOM</strong>, you must approve at least an additional{' '}
        <strong>{approveAmountInputValue} bNOM</strong>.
      </Message>
    );
  } else {
    infoMessage = (
      <Message>
        You must approve <strong>{amountDisplay} bNOM</strong> for bridging to the Onomy Network.
        Your bNOM will be burned and you will receive an equivalent number of NOM tokens in your
        Onomy Wallet. After approval, you may submit a bridge transaction!
      </Message>
    );
  }

  return (
    <Modal.BridgeSectionWrapper>
      <header>
        <ModalBtn
          onClick={onCancelHandler}
          disabled={isBtnDisabled}
          data-testid="bridge-mobile-info-modal-button"
        >
          <FontAwesomeIcon icon={faChevronLeft as unknown as any} />
        </ModalBtn>
        <Caption>Approve Bridge Transaction</Caption>
      </header>

      <main>
        {infoMessage}
        <ApproveTokensWrapper>
          <div>
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="">Approve tokens (bNOM)</label>
            <input
              type="text"
              placeholder="0.00"
              value={approveAmountInputValue}
              onChange={handleApproveAmountInputChange}
            />
          </div>
          <MaxBtn onClick={maxBtnHandler}>MAX</MaxBtn>
        </ApproveTokensWrapper>
      </main>
      {errorMessage && <Modal.ErrorSection>{errorMessage}</Modal.ErrorSection>}
      {successMessage && <Modal.SuccessSection>{successMessage}</Modal.SuccessSection>}
      {showLoader && (
        <Modal.ApprovedModalLoadingWrapper>
          <LoadingSpinner />
        </Modal.ApprovedModalLoadingWrapper>
      )}
      <div>
        <OptionCaption>Gas Fee</OptionCaption>
        <Options>
          {gasOptions.map(gasPriceOption => (
            <OptionBtn
              active={gasPriceChoice === gasPriceOption.id}
              key={gasPriceOption.id}
              onClick={e => {
                e.preventDefault();
                setGasPriceChoice(gasPriceOption.id);
              }}
            >
              {gasPriceOption.text}
            </OptionBtn>
          ))}
        </Options>
      </div>
      <footer>
        {!isTransactionCompleted && (
          <>
            <Modal.SecondaryButton
              onClick={onCancelHandler}
              disabled={isBtnDisabled}
              data-testid="approve-tokens-modal-secondary-button"
            >
              Cancel
            </Modal.SecondaryButton>
            <Modal.PrimaryButton
              onClick={confirmApproveHandler}
              disabled={isBtnDisabled}
              data-testid="approve-tokens-modal-primary-button"
            >
              Confirm ({count})
            </Modal.PrimaryButton>
          </>
        )}
        {isTransactionCompleted && (
          <Modal.PrimaryButton onClick={onCancelHandler} style={{ margin: 'auto' }}>
            Return to Bridge Screen
          </Modal.PrimaryButton>
        )}
      </footer>
    </Modal.BridgeSectionWrapper>
  );
}
