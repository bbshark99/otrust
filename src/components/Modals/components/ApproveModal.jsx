import React, { useState } from 'react';
import styled from 'styled-components';
import useInterval from '@use-it/interval';

import { Close } from '../Icons';
import * as Modal from '../styles';
import { responsive } from 'theme/constants';
import { useModal } from 'context/modal/ModalContext';

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

// const FeeWrapper = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: space-between;

//   margin-top: 16px;

//   color: ${props => props.theme.colors.textThirdly};

//   strong {
//     color: ${props => props.theme.colors.textPrimary};
//   }
// `;

export default function ApproveModal({ onApprove }) {
  const [count, setCount] = useState(60);
  const [delay, setDelay] = useState(1000);
  const { handleModal } = useModal();

  const increaseCount = () => {
    if (count === 0) {
      setDelay(null);
      handleModal();
    } else {
      setCount(count - 1);
    }
  };

  useInterval(increaseCount, delay);

  return (
    <Modal.Wrapper>
      <Modal.CloseIcon onClick={() => handleModal()} data-testid="approve-modal-close-icon">
        <Close />
      </Modal.CloseIcon>

      <main>
        <Caption>Step1. Onomy confirmation</Caption>

        <Message>
          Onomy blockchain requires access for selling
          <strong>1234 wNOM</strong>. Please confirm you want to do it
        </Message>

        {/* <FeeWrapper>
          <span>Transaction fee</span>
          <span>
            <strong>$5.4</strong> (0.00032 ETH)
          </span>
        </FeeWrapper> */}
      </main>
      <footer>
        <Modal.FooterControls>
          <Modal.SecondaryButton onClick={() => handleModal()} data-testid="approve-modal-secondary-button">
            Cancel
          </Modal.SecondaryButton>
          <Modal.PrimaryButton onClick={onApprove} data-testid="approve-modal-primary-button">
            Approve ({count})
          </Modal.PrimaryButton>
        </Modal.FooterControls>
      </footer>
    </Modal.Wrapper>
  );
}
