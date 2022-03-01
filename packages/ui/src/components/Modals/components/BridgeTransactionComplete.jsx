import React from 'react';
import styled from 'styled-components';
import { useOnomy } from '@onomy/react-client';

import { BridgeProgress } from 'components/BridgeProgress';
import { Success } from '../Icons';
import * as Modal from '../styles';
import BridgeSuccess from '../BridgeStaking/BridgeSuccess';

export const ExplorerButton = styled(Modal.SecondaryButton)`
  width: 100%;
  margin-top: 32px;
`;

export default function BridgeTransactionComplete({ closeModalHandler, amountValue }) {
  const { bridgeProgress } = useOnomy();

  if (bridgeProgress === null) {
    return <BridgeSuccess />;
  }
  return (
    <Modal.BridgeSuccessWrapper>
      <main>
        <Modal.ModalIconWrapper>
          <Success />
        </Modal.ModalIconWrapper>
        <Modal.Caption>Transaction Completed!</Modal.Caption>

        <Modal.ExchangeResult data-testid="completed-modal-exchange-result">
          + {amountValue} <sup>NOM</sup> / - {amountValue} <sup>wNOM</sup>
        </Modal.ExchangeResult>

        <Modal.ExchangeRateWrapper data-testid="completed-modal-exchange-rate">
          <span>Exchange Rate</span>

          <strong>1 NOM = 1 wNOM</strong>
        </Modal.ExchangeRateWrapper>
        <BridgeProgress />
      </main>
      <footer>
        <Modal.BridgeFooterControl>
          <Modal.PrimaryButton
            onClick={() => closeModalHandler()}
            data-testid="completed-modal-primary-button"
          >
            Done
          </Modal.PrimaryButton>
        </Modal.BridgeFooterControl>
      </footer>
    </Modal.BridgeSuccessWrapper>
  );
}
