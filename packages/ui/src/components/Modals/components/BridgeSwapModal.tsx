import React, { useState } from 'react';
import { BigNumber } from 'bignumber.js';
import styled from 'styled-components';
import { useMediaQuery } from 'react-responsive';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import { useAnomSupply, useBondingCurve, useOnomyHub } from '@onomy/react-hub';

import { Dimmer } from 'components/UI/Dimmer';
import LoadingSpinner from 'components/UI/LoadingSpinner';
import ApproveTokensBridgeModal from './ApproveTokensBridgeModal';
import BridgeTransactionComplete from './BridgeTransactionComplete';
import { getFirstMessage } from '../../../utils/helpers';
import { Close } from '../Icons';
import * as Modal from '../styles';
import { responsive } from 'theme/constants';
import {
  BridgeSending,
  BridgeAmountInput,
  BridgeMaxBtn,
  BridgeAddressInput,
} from '../../Exchange/exchangeStyles';
import oneWayBridgeImg from '../assets/one-way-bridge.svg';
import whyBridgeImg from '../assets/why-bridge.svg';
import bridgeCurveImg from '../assets/icon-bridge-curve.svg';
import walletImg from '../assets/icon-onomy-wallet.svg';
import BridgeLineChart from './BridgeLineChart';

const InputWrapper = styled.div`
  margin: 0 0 12px;
`;

const FormWrapper = styled.form`
  padding: 32px 32px 0;
  margin: 32px -32px 0 -36px;

  border-top: 1px solid ${props => props.theme.colors.bgHighlightBorder};

  @media screen and (max-width: ${responsive.laptop}) {
    margin-left: -28px;
    margin-right: -24px;
  }

  @media screen and (max-width: ${responsive.laptopSmall}) {
    margin-left: -28px;
    margin-right: -28px;
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

const OptionBtn = styled.button<{
  active?: boolean;
}>`
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

const ModalHeader = styled.header<{
  collapsedInfoBreakpoint?: boolean;
}>`
  display: flex;

  h2 {
    margin: ${props => (props.collapsedInfoBreakpoint ? '8px auto' : '')};
  }
`;

const ModalBtn = styled.button`
  width: 40px;
  height: 40px;

  border-radius: 8px;
  border: none;
  background-color: ${props => props.theme.colors.bgHighlightBorder};

  color: #84809a;

  cursor: pointer;
`;

const KeplrLink = styled.a`
  margin: 5px auto 0;

  font-size: 12px;
  color: ${props => props.theme.colors.textThirdly};
`;

function BridgeSwapModalInfo({
  closeModal,
}: {
  closeModal?: React.MouseEventHandler<HTMLButtonElement>;
}) {
  const collapsedInfoBreakpoint = useMediaQuery({ maxWidth: responsive.laptopSmall });
  const [bridgedSupply] = useAnomSupply();
  return (
    <Modal.Info>
      <ModalHeader collapsedInfoBreakpoint={collapsedInfoBreakpoint}>
        {collapsedInfoBreakpoint && (
          <ModalBtn onClick={closeModal}>
            <FontAwesomeIcon icon={faChevronLeft as IconProp} />
          </ModalBtn>
        )}
      </ModalHeader>

      <BridgeLineChart coinsInCirculation={bridgedSupply.toNumber()} />

      <Modal.InfoRow>
        <div>
          <Modal.InfoSubCaption>One Way Bridge</Modal.InfoSubCaption>

          <Modal.Desc>
            Choose to bridge when you are ready to do so to finalize your purchase of NOM!{' '}
            <strong>
              After bridging, you can no longer sell back to the bonding curve or bridge back for
              bNOM.
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
            <li>NOM is the native token of the Onomy Network. </li>
            <li>Early stakers of NOM take advantage of larger staking yield. </li>
            <li>NOM is used for governance, staking, and collateral to mint stablecoins.</li>
            <li>All bridged bNOM is burned from the bonding curve supply. </li>
            <li>NOM would be listed on exchanges rather than bNOM. </li>
          </Modal.List>
        </div>

        <Modal.InfoImgWrapper>
          <img src={whyBridgeImg} alt="" />
        </Modal.InfoImgWrapper>
      </Modal.InfoRow>
    </Modal.Info>
  );
}

export interface BridgeSwapModalProps {
  values: {
    onomyWalletValue: string;
    amountValue: string;
    formattedWeakBalance: BigNumber;
    allowanceAmountGravity: BigNumber;
    weakBalance: BigNumber;
    errors: {
      amountError: string;
      onomyWalletError: string;
      transactionError: string;
    };
    gasPrice: BigNumber;
    gasPriceChoice: number;
    gasOptions: {
      id: number;
      text: string;
      gas: BigNumber;
    }[];
  };
  flags: {
    isDisabled: boolean;
    isTransactionPending: boolean;
    showBridgeExchangeModal: boolean;
    showApproveModal: boolean;
    showTransactionCompleted: boolean;
    showLoader: boolean;
  };
  handlers: {
    walletChangeHandler: React.ChangeEventHandler<HTMLInputElement>;
    amountChangeHandler: React.ChangeEventHandler<HTMLInputElement>;
    maxBtnClickHandler: React.MouseEventHandler<HTMLButtonElement>;
    submitTransClickHandler: React.MouseEventHandler<HTMLButtonElement>;
    onCancelClickHandler: () => void;
    closeModal: () => void;
    setGasPriceChoice: React.Dispatch<React.SetStateAction<number>>;
  };
}

export default function BridgeSwapModal({ ...props }: BridgeSwapModalProps) {
  const { values, flags, handlers } = { ...props };
  const [showInfoModal, setShowInfoModal] = useState(false);
  const { hub } = useOnomyHub();
  const { bridgeProgress, ethActive, ethAddress } = useBondingCurve();

  const collapsedInfoBreakpoint = useMediaQuery({
    query: `(max-width: ${responsive.laptopSmall})`,
  });

  const closeModal = () => {
    if (!bridgeProgress) handlers.closeModal();
  };

  return (
    <>
      <Dimmer onClick={closeModal} disabled={!!bridgeProgress} />
      <Modal.BridgeModalWrapper>
        <Modal.CloseIcon onClick={closeModal} disabled={!!bridgeProgress}>
          <Close />
        </Modal.CloseIcon>

        <Modal.BridgeLayout>
          {flags.showBridgeExchangeModal &&
            (!collapsedInfoBreakpoint || (collapsedInfoBreakpoint && !showInfoModal)) && (
              <main>
                <Modal.CaptionLeft>Onomy Bridge Here</Modal.CaptionLeft>

                <Modal.BridgeContent>
                  <Modal.ConnectionItem>
                    <Modal.ConnectionItemIcon>
                      <img src={bridgeCurveImg} alt="" />
                    </Modal.ConnectionItemIcon>
                    <Modal.ConnectionItemContent>
                      <strong>Onomy Bonding Curve</strong>
                      <span>
                        {ethAddress
                          ? `${ethAddress.substring(0, 6)}...${ethAddress.substring(
                              ethAddress.length - 4
                            )}`
                          : ''}
                      </span>
                    </Modal.ConnectionItemContent>
                    <Modal.Balance>
                      <strong>bNOM Balance</strong>
                      <span>{`${values.formattedWeakBalance.toFixed(6)}`}</span>
                    </Modal.Balance>
                  </Modal.ConnectionItem>
                  <Modal.ConnectionStatus active={ethActive}>
                    {ethActive ? 'Bridge Connected' : 'Wallet Disconnected'}
                  </Modal.ConnectionStatus>

                  <Modal.ConnectionItem>
                    <Modal.ConnectionItemIcon>
                      <img src={walletImg} alt="" />
                    </Modal.ConnectionItemIcon>
                    <Modal.CosmosInputSection error={values.errors.onomyWalletError}>
                      <BridgeAddressInput
                        type="text"
                        placeholder="Your Onomy Wallet Address"
                        value={values.onomyWalletValue}
                        onChange={handlers.walletChangeHandler}
                      />
                    </Modal.CosmosInputSection>
                  </Modal.ConnectionItem>
                  {!hub?.chains.onomy.wallet.isAvailable() && (
                    <KeplrLink href="https://www.keplr.app/" target="_new">
                      Get Keplr Cosmos Wallet
                    </KeplrLink>
                  )}
                </Modal.BridgeContent>
                <FormWrapper>
                  {flags.showLoader && (
                    <Modal.LoadingWrapper>
                      <LoadingSpinner />
                    </Modal.LoadingWrapper>
                  )}
                  <InputWrapper>
                    <BridgeSending error={values.errors.amountError}>
                      <strong>Bridge to NOM</strong>
                      <BridgeAmountInput
                        type="text"
                        value={values.amountValue}
                        onChange={handlers.amountChangeHandler}
                      />
                      bNOM
                      <BridgeMaxBtn
                        onClick={handlers.maxBtnClickHandler}
                        disabled={flags.isTransactionPending}
                      >
                        Max
                      </BridgeMaxBtn>
                    </BridgeSending>
                  </InputWrapper>
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
                  <Modal.FullWidthButton
                    onClick={handlers.submitTransClickHandler}
                    disabled={flags.isDisabled || !ethActive}
                  >
                    Bridge bNOM to NOM
                  </Modal.FullWidthButton>
                  {collapsedInfoBreakpoint && (
                    <Modal.SecondaryButton
                      style={{ width: '100%', height: 52, marginTop: '15px' }}
                      onClick={() => {
                        setShowInfoModal(true);
                      }}
                    >
                      What is Onomy Bridge?
                    </Modal.SecondaryButton>
                  )}
                </FormWrapper>
              </main>
            )}
          {flags.showApproveModal && (
            <main>
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
            </main>
          )}
          {flags.showTransactionCompleted && (
            <main>
              <BridgeTransactionComplete
                // closeModalHandler={handlers.closeModal}
                amountValue={values.amountValue}
              />
            </main>
          )}
          {(showInfoModal || !collapsedInfoBreakpoint) && (
            <BridgeSwapModalInfo closeModal={() => setShowInfoModal(false)} />
          )}
        </Modal.BridgeLayout>
      </Modal.BridgeModalWrapper>
    </>
  );
}
