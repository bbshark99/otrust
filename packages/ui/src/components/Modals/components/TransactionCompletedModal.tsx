import React, { useState } from 'react';
import styled from 'styled-components';
import { BigNumber } from 'bignumber.js';
import { EthContractTransaction } from '@onomy/hub';

import { useExchange, useUpdateExchange } from 'context/exchange/ExchangeContext';
import { Caret, Close, Success } from '../Icons';
import * as Modal from '../styles';
import { useModal } from 'context/modal/ModalContext';
import { format18 } from 'utils/math';

export const ExplorerButton = styled(Modal.SecondaryButton)`
  width: 100%;
  margin-top: 32px;
`;

const networks = ['rinkeby.', '', '', '', 'rinkeby.'];

export default function TransactionCompletedModal({
  isApproving,
  tx,
}: {
  isApproving?: boolean;
  tx: EthContractTransaction;
}) {
  const [detailsActive, setDetailsActive] = useState(false);

  const { objDispatch, strDispatch } = useUpdateExchange();

  const { bidDenom, askAmount, bidAmount, approve, status, strong, weak } = useExchange();

  const { handleModal } = useModal();

  const shortten = (addr: string) => {
    return `${addr.slice(0, 15)}...${addr.slice(addr.length - 3)}`;
  };

  const onExplore = () => {
    window.open(`https://${networks[tx.chainId]}etherscan.io/tx/${tx.hash}`, '_blank');
  };

  const closeModal = () => {
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
        input: '',
        output: '',
        approve: '',
      },
    });

    handleModal();
  };

  return (
    <Modal.Wrapper>
      <Modal.CloseIcon onClick={() => closeModal()} data-testid="completed-modal-close-icon">
        <Close />
      </Modal.CloseIcon>

      <main>
        <Modal.ModalIconWrapper>
          <Success />
        </Modal.ModalIconWrapper>
        <Modal.Caption>Transaction Confirmed</Modal.Caption>

        <ExplorerButton onClick={() => onExplore()}>View in Etherscan</ExplorerButton>

        {status !== 'APPROVE' ? (
          <>
            <Modal.ExchangeResult data-testid="completed-modal-exchange-result">
              {isApproving ? (
                <>
                  {approve} {weak} <br /> approved for selling
                </>
              ) : (
                <>
                  + {format18(askAmount).toFixed(8)}{' '}
                  <sup>{bidDenom === 'strong' ? weak : strong}</sup>
                  <Modal.Spent>
                    - {format18(bidAmount).toFixed(8)}{' '}
                    <sup>{bidDenom === 'strong' ? strong : weak}</sup>
                  </Modal.Spent>
                </>
              )}
            </Modal.ExchangeResult>

            <Modal.ExchangeRateWrapper data-testid="completed-modal-exchange-rate">
              <span>Exchange Rate</span>

              <strong>
                {bidDenom && (
                  <>
                    1 {bidDenom === 'strong' ? strong : weak} ={' '}
                    {BigNumber.isBigNumber(bidAmount)
                      ? askAmount.div(bidAmount).toFixed(6)
                      : 'Loading'}
                  </>
                )}{' '}
                {bidDenom === 'strong' ? weak : strong}
              </strong>
            </Modal.ExchangeRateWrapper>
          </>
        ) : (
          <Modal.ExchangeApproveText data-testid="completed-exchange-approve-text">
            Onomy blockchain confirmed access for selling.
          </Modal.ExchangeApproveText>
        )}
      </main>
      <footer>
        <Modal.FooterControls>
          <Modal.DetailsButton
            // @ts-ignore
            active={detailsActive}
            onClick={() => setDetailsActive(!detailsActive)}
            data-testid="completed-modal-details-button"
          >
            View Details <Caret />
          </Modal.DetailsButton>
          <Modal.PrimaryButton
            onClick={() => closeModal()}
            data-testid="completed-modal-primary-button"
          >
            Done
          </Modal.PrimaryButton>
        </Modal.FooterControls>

        {detailsActive && (
          <Modal.FooterDetails data-testid="completed-modal-footer-details">
            <Modal.FooterDetailsRow>
              <span>From</span> <strong>{shortten(tx.from)}</strong>
            </Modal.FooterDetailsRow>
            {!!tx.to && (
              <Modal.FooterDetailsRow>
                <span>To</span> <strong>{shortten(tx.to)}</strong>
              </Modal.FooterDetailsRow>
            )}
            <Modal.FooterDetailsRow>
              <span>TxID</span> <strong>{shortten(tx.hash)}</strong>
            </Modal.FooterDetailsRow>
            <Modal.FooterDetailsRow>
              <span>Network Confirmations</span>{' '}
              <strong>{tx.confirmations > 0 ? tx.confirmations : 1}</strong>
            </Modal.FooterDetailsRow>

            <ExplorerButton
              onClick={() => onExplore()}
              data-testid="completed-model-explorer-button"
            >
              View in Explorer
            </ExplorerButton>
          </Modal.FooterDetails>
        )}
      </footer>
    </Modal.Wrapper>
  );
}
