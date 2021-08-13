import React, { useState } from 'react';
import ReactModal from 'react-modal';
import styled from 'styled-components';
import { useWeb3React } from '@web3-react/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import LoadingSpinner from 'components/UI/LoadingSpinner';

import { responsive } from 'theme/constants';
import ApproveTokensBridgeModal from './ApproveTokensBridgeModal';
import BridgeTransactionComplete from './BridgeTransactionComplete';
import { getFirstMessage } from '../../../utils/helpers';
import { BridgeMaxBtn, BridgeAddressInput, BridgeSending, BridgeAmountInput } from '../../Exchange/exchangeStyles';
import { ConnectionStatus } from '../../UI/ConnectionStatus';
import * as Modal from '../styles';
import oneWayBridgeImg from '../assets/one-way-bridge.svg';
import whyBridgeImg from '../assets/why-bridge.svg';

const BridgeSwapModalWrapper = styled.div`
  @media screen and (min-width: 701px) {
    display: none;
  }
`;

const BridgeSwapModal = styled.div`
  width: 100%;
  height: 100%;

  background-color: ${props => props.theme.colors.bgDarkest};

  header {
    padding: 20px 20px 0;

    background-color: ${props => props.theme.colors.bgNormal};
  }
`;

const ModalHeader = styled.header`
  display: flex;
  align-items: center;

  h6 {
    margin: 0 auto;

    font-size: 16px;
  }
`;

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  padding: 20px;
`;

const HeaderInfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: ${props => (props.align ? props.align : 'normal')};
  @media screen and (max-width: ${responsive.laptop}) {
    gap: 5px;
  }

  & + & {
    margin-left: 56px;

    @media screen and (max-width: ${responsive.laptop}) {
      margin-left: 32px;
    }
  }

  > strong {
    color: ${props => props.theme.colors.textThirdly};
    font-weight: 400;

    @media screen and (max-width: ${responsive.smartphoneLarge}) {
      font-size: 10px;
    }
  }
`;

const HeaderInfoItemValue = styled.div`
  @media screen and (max-width: ${responsive.smartphoneLarge}) {
    display: flex;
    flex-direction: column;

    gap: 5px;
  }

  > strong {
    margin-right: 12px;

    color: ${props => props.theme.colors.textPrimary};
    font-family: 'Bebas Neue', sans-serif;
    font-size: 24px;

    @media screen and (max-width: ${responsive.laptop}) {
      font-size: 20px;
    }

    @media screen and (max-width: ${responsive.smartphoneLarge}) {
      font-size: 18px;
    }
  }
`;

const ModalInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  row-gap: 10px;

  padding: 32px 20px;

  background-color: ${props => props.theme.colors.bgNormal};
`;

const ModalBtn = styled.button`
  width: 44px;
  height: 44px;

  border-radius: 8px;
  border: none;
  background-color: ${props => props.theme.colors.bgHighlightBorder};

  color: #84809a;

  cursor: pointer;
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

const OptionBtn = styled.button`
  padding: 12px 16px;
  background-color: ${props => (props.active ? props.theme.colors.bgHighlightBorder : 'transparent')};
  border: 1px solid ${props => props.theme.colors.bgHighlightBorder};
  border-radius: 22px;
  font-size: 14px;
  font-weight: 500;
  color: ${props => (props.active ? props.theme.colors.textPrimary : props.theme.colors.textSecondary)};
  &:hover {
    background-color: ${props => props.theme.colors.bgHighlightBorder_lighten};
  }
  &:active {
    background-color: ${props => props.theme.colors.bgHighlightBorder_darken};
  }
`;

const modalOverride = {
  content: {
    padding: 0,
    border: 'none',
    borderRadius: 0,

    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
};

export default function BridgeSwapMobile({ ...props }) {
  const { active } = useWeb3React();

  const { values, flags, handlers } = { ...props };

  const [infoModal, setInfoModal] = useState(false);

  return (
    <BridgeSwapModalWrapper>
      <ReactModal isOpen={flags.showApproveModal} style={modalOverride} data-testid="bridge-mobile-approve-modal">
        <BridgeSwapModal>
          <ModalInfo>
            <ApproveTokensBridgeModal
              {...props}
              onCancelHandler={handlers.onCancelClickHandler}
              amountValue={values.amountValue}
              allowanceAmountGravity={values.allowanceAmountGravity}
              formattedWeakBalance={values.formattedWeakBalance}
              weakBalance={values.weakBalance}
              gasOptions={values.gasOptions}
              gasPriceChoice={values.gasPriceChoice}
              gasPrice={values.gasPrice}
              setGasPriceChoice={handlers.setGasPriceChoice}
            />
          </ModalInfo>
        </BridgeSwapModal>
      </ReactModal>
      <ReactModal
        isOpen={flags.showTransactionCompleted}
        style={modalOverride}
        data-testid="bridge-mobile-success-modal"
      >
        <BridgeSwapModal>
          <ModalInfo>
            <BridgeTransactionComplete
              closeModalHandler={handlers.closeModalClickHandler}
              amountValue={values.amountValue}
            />
          </ModalInfo>
        </BridgeSwapModal>
      </ReactModal>
      <ReactModal isOpen={infoModal} style={modalOverride} data-testid="bridge-mobile-info-modal">
        <BridgeSwapModal>
          <ModalHeader>
            <ModalBtn
              onClick={() => {
                setInfoModal(false);
              }}
              data-testid="bridge-mobile-info-modal-button"
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </ModalBtn>
            <h6>What Is Onomy Bridge?</h6>
          </ModalHeader>

          <ModalInfo>
            <Modal.Info>
              <h2>What is Onomy Bridge?</h2>

              <Modal.Desc>
                The Onomy Bonding Curve platform is a gateway into the Onomy Network. This is achieved by participants
                purchasing wrapped-NOM, an ERC-20 token on the Ethereum Network, and swapping for NOM on the Onomy
                Network.
              </Modal.Desc>

              <Modal.InfoRow>
                <div>
                  <Modal.InfoSubCaption>One Way Bridge</Modal.InfoSubCaption>

                  <Modal.Desc>
                    Choose to bridge when you are ready to do so to finalize your purchase of NOM!{' '}
                    <strong>
                      After bridging, you can no longer sell back to the bonding curve or bridge back for wNOM.
                    </strong>{' '}
                    There are no guarantees of liquid markets.
                  </Modal.Desc>
                </div>

                <img src={oneWayBridgeImg} alt="" />
              </Modal.InfoRow>

              <Modal.InfoRow>
                <div>
                  <Modal.InfoSubCaption>Why Bridge?</Modal.InfoSubCaption>

                  <Modal.List>
                    <li>You must hold NOM to participate in the Onomy Network. </li>
                    <li>Early stakers of NOM take advantage of larger staking yield. </li>
                    <li>NOM is used for governance, staking, and collateral to mint stablecoins.</li>
                    <li>All bridged wNOM is burned from the bonding curve supply. </li>
                    <li>NOM would be listed on exchanges rather than wNOM. </li>
                  </Modal.List>
                </div>

                <Modal.InfoImgWrapper>
                  <img src={whyBridgeImg} alt="" />
                </Modal.InfoImgWrapper>
              </Modal.InfoRow>
            </Modal.Info>
          </ModalInfo>
        </BridgeSwapModal>
      </ReactModal>
      <ReactModal
        isOpen={flags.showBridgeExchangeModal && !infoModal}
        style={modalOverride}
        data-testid="bridge-mobile-swap-modal"
        onRequestClose={() => handlers.closeModalClickHandler()}
      >
        <BridgeSwapModal>
          <ModalHeader>
            <ModalBtn onClick={() => handlers.closeModalClickHandler()} data-testid="bridge-mobile-header-button">
              <FontAwesomeIcon icon={faChevronLeft} />
            </ModalBtn>
            <h6>Onomy Bridge</h6>
          </ModalHeader>

          <ModalInfo>
            <HeaderInfoItem>
              <strong>wNom Balance</strong>
              <HeaderInfoItemValue>
                <strong>{`${values.formattedWeakBalance.toFixed(6)}`}</strong>
              </HeaderInfoItemValue>
            </HeaderInfoItem>
            <HeaderInfoItem align={'flex-end'}>
              <strong>Bridge</strong>
              <HeaderInfoItemValue>
                <ConnectionStatus active={active}>{active ? 'Connected' : 'Wallet Disconnected'}</ConnectionStatus>
              </HeaderInfoItemValue>
            </HeaderInfoItem>
            <Modal.CosmosInputSection error={values.errors.onomyWalletError}>
              <BridgeAddressInput
                type="text"
                placeholder="Your Onomy Wallet Address"
                value={values.onomyWalletValue}
                onChange={handlers.walletChangeHandler}
              />
            </Modal.CosmosInputSection>
          </ModalInfo>

          <FormWrapper>
            {flags.showLoader && (
              <Modal.LoadingWrapper>
                <LoadingSpinner />
              </Modal.LoadingWrapper>
            )}
            <BridgeSending error={values.errors.amountError}>
              <strong>Swap to NOM</strong>
              <BridgeAmountInput type="text" value={values.amountValue} onChange={handlers.amountChangeHandler} />
              wNOM
              <BridgeMaxBtn onClick={handlers.maxBtnClickHandler} disabled={flags.isTransactionPending}>
                Max
              </BridgeMaxBtn>
            </BridgeSending>
            {getFirstMessage(values.errors) && (
              <Modal.ErrorSection>{getFirstMessage(values.errors)}</Modal.ErrorSection>
            )}
            <div>
              <OptionCaption>Gas Fee</OptionCaption>
              <Options>
                {values.gasOptions.map(gasPriceOption => (
                  <OptionBtn
                    active={values.gasPriceChoice === gasPriceOption.id}
                    key={gasPriceOption.id}
                    onClick={e => {
                      e.preventDefault();
                      handlers.setGasPriceChoice(gasPriceOption.id);
                    }}
                  >
                    {gasPriceOption.text}
                  </OptionBtn>
                ))}
              </Options>
            </div>
            <Modal.FullWidthButton onClick={handlers.submitTransClickHandler} disabled={flags.isDisabled || !active}>
              Swap wNOM for NOM
            </Modal.FullWidthButton>
            <Modal.SecondaryButton
              style={{ width: '100%' }}
              onClick={() => {
                setInfoModal(true);
              }}
              data-testid="bridge-mobile-secondary-button"
            >
              What is Onomy Bridge?
            </Modal.SecondaryButton>
          </FormWrapper>
        </BridgeSwapModal>
      </ReactModal>
    </BridgeSwapModalWrapper>
  );
}
