import React from 'react';
import styled from 'styled-components';
import { useBondingCurve } from '@onomy/react-hub';

import { BridgeProgress } from 'components/BridgeProgress';
import { Success } from '../Icons';
import * as Modal from '../styles';
import BridgeSuccess from '../BridgeStaking/BridgeSuccess';

export const ExplorerButton = styled(Modal.SecondaryButton)`
  width: 100%;
  margin-top: 32px;
`;

export default function BridgeTransactionComplete({ amountValue }: { amountValue?: string }) {
  const { bridgeProgress } = useBondingCurve();

  if (bridgeProgress === null) {
    return <BridgeSuccess amountValue={amountValue} />;
  }
  return (
    <Modal.BridgeSuccessWrapper>
      <main>
        <Modal.ModalIconWrapper>
          <Success />
        </Modal.ModalIconWrapper>
        <Modal.Caption>Bridge in progress!</Modal.Caption>

        <Modal.ExchangeResult data-testid="completed-modal-exchange-result">
          + {amountValue} <sup>NOM</sup> / - {amountValue} <sup>bNOM</sup>
        </Modal.ExchangeResult>

        <Modal.ExchangeRateWrapper data-testid="completed-modal-exchange-rate">
          <span>Exchange Rate</span>

          <strong>1 NOM = 1 bNOM</strong>
        </Modal.ExchangeRateWrapper>
        <BridgeProgress />
      </main>
      {/* <footer>
        <Modal.BridgeFooterControl>
          <Modal.PrimaryButton
            onClick={() => closeModalHandler()}
            data-testid="completed-modal-primary-button"
          >
            Done
          </Modal.PrimaryButton>
        </Modal.BridgeFooterControl>
      </footer> */}
    </Modal.BridgeSuccessWrapper>
  );
}
