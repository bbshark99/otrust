import React from 'react';
import styled from 'styled-components';

import { Success } from '../Icons';
import * as Modal from '../styles';

export const ExplorerButton = styled(Modal.SecondaryButton)`
  width: 100%;
  margin-top: 32px;
`;

export default function BridgeTransactionComplete({ closeModalHandler, amountInputValue }) {
  const closeModal = () => {
    closeModalHandler();
  };

  return (
    <Modal.BridgeSuccessWrapper>
      <main>
        <Modal.ModalIconWrapper>
          <Success />
        </Modal.ModalIconWrapper>
        <Modal.Caption>Transaction Completed!</Modal.Caption>

        <Modal.ExchangeResult data-testid="completed-modal-exchange-result">
          + {amountInputValue} <sup>NOM</sup> / - {amountInputValue} <sup>wNOM</sup>
        </Modal.ExchangeResult>

        <Modal.ExchangeRateWrapper data-testid="completed-modal-exchange-rate">
          <span>Exchange Rate</span>

          <strong>1 NOM = 1 wNOM</strong>
        </Modal.ExchangeRateWrapper>
      </main>
      <footer>
        <Modal.BridgeFooterControl>
          <Modal.PrimaryButton onClick={() => closeModal()} data-testid="completed-modal-primary-button">
            Done
          </Modal.PrimaryButton>
        </Modal.BridgeFooterControl>
      </footer>
    </Modal.BridgeSuccessWrapper>
  );
}
