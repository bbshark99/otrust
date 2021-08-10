import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import useInterval from '@use-it/interval';
import { useWeb3React } from '@web3-react/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BigNumber } from 'bignumber.js';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import LoadingSpinner from 'components/UI/LoadingSpinner';

import { NOMCont } from 'context/chain/contracts';
import * as Modal from '../styles';
import { contAddrs } from '../../../context/chain/contracts';
import { responsive } from 'theme/constants';
import { MaxBtn } from 'components/Exchange/exchangeStyles';
import { NOTIFICATION_MESSAGES } from '../../../constants/NotificationMessages';
import { bignumberToJsNumber } from 'utils/math';
import { parse18 } from 'utils/math';

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

export default function ApproveTokensBridgeModal({
  amountValue,
  allowanceAmountGravity,
  onCancelHandler,
  formattedWeakBalance,
  weakBalance,
  isMaxAmount,
}) {
  const [count, setCount] = useState(60);
  const [delay, setDelay] = useState(1000);
  const [isBtnDisabled, setIsBtnDisabled] = useState(false);
  const [calculatedApproveValue, setCalculatedApproveValue] = useState('');
  const [approveAmountInputValue, setApproveAmountInputValue] = useState('');
  const [isMaxButtonClicked, setIsMaxButtonClicked] = useState(isMaxAmount);
  const [showLoader, setShowLoader] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isTransactionCompleted, setIsTransactionCompleted] = useState(false);

  const { library } = useWeb3React();
  const NOMContract = NOMCont(library);

  useEffect(() => {
    if (amountValue && allowanceAmountGravity) {
      const approveValue = amountValue - bignumberToJsNumber(allowanceAmountGravity);
      setCalculatedApproveValue(approveValue);
      setApproveAmountInputValue(approveValue);
    } else {
      setCalculatedApproveValue(0);
    }
  }, [amountValue, allowanceAmountGravity]);

  const handleApproveAmountInputChange = event => {
    setIsMaxButtonClicked(false);
    const value = event.target.value;
    const floatRegExp = new RegExp(/(^(?=.+)(?:[1-9]\d*|0)?(?:\.\d+)?$)|(^\d+?\.$)|(^\+?(?!0\d+)$|(^$)|(^\.$))/);
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

  const maxBtnHandler = event => {
    event.preventDefault();
    setIsMaxButtonClicked(true);
    if (formattedWeakBalance) {
      setApproveAmountInputValue(formattedWeakBalance.toNumber() - bignumberToJsNumber(allowanceAmountGravity));
    }
  };

  const confirmApproveHandler = useCallback(
    async event => {
      event.preventDefault();
      if (approveAmountInputValue === '.' || !approveAmountInputValue) {
        return;
      }

      let tx;

      try {
        setErrorMessage('');
        setSuccessMessage('');
        setIsBtnDisabled(true);
        setDelay(null);
        setShowLoader(true);
        if (isMaxButtonClicked) {
          tx = await NOMContract.approve(contAddrs.Gravity, weakBalance.toString(10));
        } else {
          tx = await NOMContract.increaseAllowance(
            contAddrs.Gravity,
            parse18(new BigNumber(approveAmountInputValue)).toString(10),
          );
        }

        tx.wait().then(() => {
          setSuccessMessage(NOTIFICATION_MESSAGES.success.approvedBridgeTokens(approveAmountInputValue));
          setShowLoader(false);
          setIsBtnDisabled(false);
          setIsTransactionCompleted(true);
        });
      } catch (error) {
        if (error.code === 4001) {
          setErrorMessage(NOTIFICATION_MESSAGES.error.rejectedTransaction);
        } else {
          setErrorMessage(error.message);
        }
        setIsBtnDisabled(false);
        setShowLoader(false);
        return;
      }
    },
    [NOMContract, approveAmountInputValue, isMaxButtonClicked, weakBalance],
  );

  return (
    <Modal.BridgeSectionWrapper>
      <header>
        <ModalBtn onClick={onCancelHandler} disabled={isBtnDisabled} data-testid="bridge-mobile-info-modal-button">
          <FontAwesomeIcon icon={faChevronLeft} />
        </ModalBtn>
        <Caption>Approve Tokens</Caption>
      </header>

      <main>
        <Message>
          You want to sell <strong>{amountValue} wNOM</strong>, but you approved for sale only{' '}
          {allowanceAmountGravity && bignumberToJsNumber(allowanceAmountGravity)} wNOM. To sell this amount, please
          approve <strong>{calculatedApproveValue} wNOM</strong> or more.
        </Message>
        <ApproveTokensWrapper>
          <div>
            <label htmlFor="">Approve tokens (wNOM)</label>
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
            Done
          </Modal.PrimaryButton>
        )}
      </footer>
    </Modal.BridgeSectionWrapper>
  );
}
