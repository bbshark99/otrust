import React from 'react';
import styled from 'styled-components';
import { useWeb3React } from '@web3-react/core';
import { Dimmer } from 'components/UI/Dimmer';
import LoadingSpinner from 'components/UI/LoadingSpinner';

import ApproveTokensBridgeModal from './ApproveTokensBridgeModal';
import BridgeTransactionComplete from './BridgeTransactionComplete';
import { getFirstMessage } from '../../../utils/helpers';
import { Close } from '../Icons';
import * as Modal from '../styles';
import { responsive } from 'theme/constants';
import { BridgeSending, BridgeAmountInput, BridgeMaxBtn, BridgeAddressInput } from '../../Exchange/exchangeStyles';
import oneWayBridgeImg from '../assets/one-way-bridge.svg';
import whyBridgeImg from '../assets/why-bridge.svg';
import bridgeCurveImg from '../assets/icon-bridge-curve.svg';
import walletImg from '../assets/icon-onomy-wallet.svg';

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

export default function BridgeSwapModal({ ...props }) {
  const { active, account } = useWeb3React();
  const { values, flags, handlers } = { ...props };

  return (
    <>
      <Dimmer onClick={() => handlers.closeModalClickHandler()} />
      <Modal.BridgeModalWrapper>
        <Modal.CloseIcon onClick={() => handlers.closeModalClickHandler()}>
          <Close />
        </Modal.CloseIcon>

        <Modal.BridgeLayout>
          {flags.showBridgeExchangeModal && (
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
                      {account ? `${account.substring(0, 6)}...${account.substring(account.length - 4)}` : ''}
                    </span>
                  </Modal.ConnectionItemContent>
                  <Modal.Balance>
                    <strong>wNOM Balance</strong>
                    <span>{`${values.formattedWeakBalance.toFixed(6)}`}</span>
                  </Modal.Balance>
                </Modal.ConnectionItem>
                <Modal.ConnectionStatus active={active}>
                  {active ? 'Bridge Connected' : 'Wallet Disconnected'}
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
              </Modal.BridgeContent>
              <FormWrapper>
                {flags.showLoader && (
                  <Modal.LoadingWrapper>
                    <LoadingSpinner />
                  </Modal.LoadingWrapper>
                )}
                <InputWrapper>
                  <BridgeSending error={values.errors.amountError}>
                    <strong>Swap to NOM</strong>
                    <BridgeAmountInput type="text" value={values.amountValue} onChange={handlers.amountChangeHandler} />
                    wNOM
                    <BridgeMaxBtn onClick={handlers.maxBtnClickHandler} disabled={flags.isTransactionPending}>
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
                  disabled={flags.isDisabled || !active}
                >
                  Swap wNOM for NOM
                </Modal.FullWidthButton>
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
                closeModalHandler={handlers.closeModalClickHandler}
                amountValue={values.amountValue}
              />
            </main>
          )}
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
        </Modal.BridgeLayout>
      </Modal.BridgeModalWrapper>
    </>
  );
}
