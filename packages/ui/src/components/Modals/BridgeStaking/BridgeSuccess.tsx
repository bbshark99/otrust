import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import * as Modal from '../styles';
import { Dimmer } from 'components';
import { Close, Success } from '../Icons';
import {
  MyBridgedNomBalanceDisplay,
  MyWrappedNomBalanceDisplay,
} from 'components/NomBalanceDisplay';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;

  padding: 40px;
`;

const Caption = styled.h3`
  margin-bottom: 20px;

  font-family: Barlow Condensed, sans-serif;
  font-size: 28px;
  font-weight: 500;
  color: ${props => props.theme.colors.txtPrimary};
`;

const Section = styled.section`
  margin-bottom: 20px;
`;

const Desc = styled.p`
  color: ${props => props.theme.colors.textSecondary};
`;

const ResultWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default function BridgeSuccess({ amountValue = '0' }) {
  return (
    <>
      <Dimmer />
      <Modal.BridgeModalWrapper>
        <Link to="/">
          <Modal.CloseIcon>
            <Close />
          </Modal.CloseIcon>
        </Link>

        <Modal.BridgeLayout>
          <Wrapper>
            <Modal.ModalIconWrapper>
              <Success />
            </Modal.ModalIconWrapper>

            <Modal.Caption>Assets Bridged Successfully!</Modal.Caption>

            <Modal.ExchangeResult>
              <ResultWrapper>
                <div>
                  + {amountValue}
                  <sup>NOM</sup>
                </div>
                <Modal.DetailsSeparator>/</Modal.DetailsSeparator>
                <Modal.Spent>
                  - {amountValue}
                  <sup>bNOM</sup>
                </Modal.Spent>
              </ResultWrapper>
            </Modal.ExchangeResult>

            <Modal.ExchangeRateWrapper>
              <span>Exchange Rate</span>
              <strong>1 NOM = 1 bNOM</strong>
            </Modal.ExchangeRateWrapper>
            <Modal.ExchangeRateWrapper>
              <span>New NOM balance</span>
              <strong>
                <MyBridgedNomBalanceDisplay /> NOM
              </strong>
            </Modal.ExchangeRateWrapper>
            <Modal.ExchangeRateWrapper>
              <span>New bNOM balance</span>
              <strong>
                <MyWrappedNomBalanceDisplay /> bNOM
              </strong>
            </Modal.ExchangeRateWrapper>
          </Wrapper>
          <Modal.Info>
            <Caption>Congratulations & Welcome to the Onomy Network!</Caption>

            <Section>
              <Desc>
                Together, we will build the decentralized reserve bank and facilitate Forex volumes
                on-chain. Learn more by watching our animated film!
              </Desc>
            </Section>

            <Section>
              <div style={{ height: 338, backgroundColor: '#302e3d' }}>v i d e o</div>
            </Section>

            <Section>
              <Desc>
                NOM is now in your wallet! You can start earning rewards by staking and manage
                staking at any point in the future.
              </Desc>
            </Section>

            <Section>
              <Link to="/validators">
                <Modal.FullWidthButton>Start Staking</Modal.FullWidthButton>
              </Link>
            </Section>

            <Section>
              <Link to="/">
                <Modal.SecondaryButton style={{ width: '100%', height: 52 }}>
                  Done
                </Modal.SecondaryButton>
              </Link>
            </Section>
          </Modal.Info>
        </Modal.BridgeLayout>
      </Modal.BridgeModalWrapper>
    </>
  );
}
