import React, { useState } from 'react';
import styled from 'styled-components';
import useInterval from '@use-it/interval';
import { BigNumber } from 'bignumber.js';
import { useBondingCurve } from '@onomy/react-hub';

import { Close } from '../Icons';
import * as Modal from '../styles';
import { responsive } from 'theme/constants';
import { useModal } from 'context/modal/ModalContext';
import { MaxBtn } from 'components/Exchange/exchangeStyles';
import { useExchange, useUpdateExchange } from 'context/exchange/ExchangeContext';
import { format18, parse18 } from 'utils/math';
import RequestFailedModal from './RequestFailedModal';

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

export default function ApproveTokensModal({
  onConfirmApprove,
}: {
  onConfirmApprove?: React.MouseEventHandler<HTMLButtonElement>;
}) {
  const [count, setCount] = useState(60);
  const [delay, setDelay] = useState<number | null>(1000);
  const { handleModal } = useModal();
  const { approve, bidAmount, input } = useExchange();
  const { objDispatch, strDispatch } = useUpdateExchange();
  const { NOMallowance, weakBalance } = useBondingCurve();

  const initialApproveAmount = bidAmount.minus(NOMallowance);

  const increaseCount = () => {
    if (count === 0) {
      setDelay(null);
      handleModal();
    } else {
      setCount(count - 1);
    }
  };

  useInterval(increaseCount, delay);

  const onTextChange: React.ChangeEventHandler<HTMLInputElement> = async event => {
    event.preventDefault();

    // console.log('Approve Amount:-approve ', approve);

    const floatRegExp = new RegExp(/(^(?=.+)(?:[1-9]\d*|0)?(?:\.\d+)?$)|(^\d\.$)/);

    if (floatRegExp.test(event.target.value.toString())) {
      // console.log('Approve Amount:-pass ', approve);

      const approvalAmount = parse18(new BigNumber(parseFloat(event.target.value).toString()));

      objDispatch({
        type: 'approveAmount',
        value: approvalAmount,
      });

      strDispatch({
        type: 'approve',
        value: format18(approvalAmount).toFixed(),
      });
    } else {
      // console.log('Text Change: ', 'regex failed');
      handleModal(<RequestFailedModal error="Please enter numbers only. Thank you!" />);
    }
  };

  const onMax = () => {
    const approvalAmount = weakBalance.minus(NOMallowance);

    objDispatch({
      type: 'approveAmount',
      value: approvalAmount,
    });

    strDispatch({
      type: 'approve',
      value: format18(approvalAmount).toString(),
    });
  };

  const inputDisplay = parseFloat(input || '0').toFixed(6);
  const initApproveAmountDisplay = format18(initialApproveAmount || 0).toFixed(6);

  let infoMessage;
  if (NOMallowance.gt(0)) {
    const nomAllowanceDisplay = format18(NOMallowance).toFixed(6);
    infoMessage = (
      <Message>
        You have approved the Bonding Curve to sell up to{' '}
        <strong>{nomAllowanceDisplay} bNOM</strong>. To sell <strong>{inputDisplay} bNOM</strong>,
        you must approve at least an additional <strong>{initApproveAmountDisplay} bNOM</strong>.
      </Message>
    );
  } else {
    infoMessage = (
      <Message>
        You currently have not approved any bNOM for selling. To proceed, you must approve at least{' '}
        <strong>{initApproveAmountDisplay} bNOM</strong> for selling.
      </Message>
    );
  }

  return (
    <Modal.Wrapper>
      <Modal.CloseIcon onClick={() => handleModal()} data-testid="approve-tokens-modal-close-icon">
        <Close />
      </Modal.CloseIcon>

      <main>
        <Caption>Approve Tokens</Caption>

        {infoMessage}

        <ApproveTokensWrapper>
          <div>
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="">Approve tokens (bNOM)</label>
            <input type="text" placeholder="0.00" value={approve} onChange={onTextChange} />
          </div>
          <MaxBtn onClick={onMax}>MAX</MaxBtn>
        </ApproveTokensWrapper>
      </main>
      <footer>
        <Modal.FooterControls>
          <Modal.SecondaryButton
            onClick={() => handleModal()}
            data-testid="approve-tokens-modal-secondary-button"
          >
            Cancel
          </Modal.SecondaryButton>
          <Modal.PrimaryButton
            onClick={onConfirmApprove}
            data-testid="approve-tokens-modal-primary-button"
          >
            Approve ({count})
          </Modal.PrimaryButton>
        </Modal.FooterControls>
      </footer>
    </Modal.Wrapper>
  );
}
