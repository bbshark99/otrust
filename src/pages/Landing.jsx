import React from 'react';
import styled from 'styled-components';
import { isMobile } from 'react-device-detect';

import { AccentButton } from 'components/UI/Button';
import { responsive } from 'theme/constants';
import logo from '../assets/images/onomy.png';
import rightCursor from '../assets/images/rightCursor.png';
import metamask from '../assets/images/metamask.png';
import ledger from '../assets/images/ledger.png';
import coinbase from '../assets/images/coinbase.png';
import walletConnect from '../assets/images/walletConnect.png';
import { SUPPORTED_WALLETS } from '../connectors';

export const wallets = [
  { title: 'Metamask', img: metamask },
  { title: 'Ledger', img: ledger },
  { title: 'Wallet Connect', img: walletConnect },
  { title: 'Coinbase Wallet', img: coinbase },
];

const Wrapper = styled.div`
  text-align: center;
`;

const StyledHeader = styled.header`
  background-image: linear-gradient(to bottom, #16161f, #06060f);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  font-size: calc(10px + 2vmin);
  color: white;

  @media screen and (max-width: ${responsive.smartphoneLarge}) {
    background-image: none;
    background-color: ${props => props.theme.colors.bgDarkest};
    overflow: hidden;
  }
`;

const StyledTopPart = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 20vh;
  background-color: ${props => props.theme.colors.bgDarken};
  width: 100%;
  @media screen and (max-width: ${responsive.smartphoneLarge}) {
    background-color: transparent;
  }
`;

const StyledLogo = styled.img`
  width: 64px;
  height: 51.2px;
  margin-bottom: 20px;
`;

const StyledLogoText = styled.span`
  text-align: left;
  font: normal normal bold 28px/21px 'Bebas Neue';
  letter-spacing: 0px;
  color: #e1dfeb;
  opacity: 1;
`;

const StyledMiddlePart = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: Poppins;
  margin: 20px 0;
`;

const StyledBottomPart = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const BottomTitleText = styled.span`
  text-align: center;
  font: normal normal medium 16px/30px Poppins;
  font-size: 16px;
  letter-spacing: 0px;
  color: ${props => props.theme.colors.txtPrimary};
`;

const BottomDescriptionText = styled.span`
  font: normal normal normal 12px/20px Poppins;
  letter-spacing: 0px;
  color: ${props => props.theme.colors.txtSecondary};
  width: 300px;
  margin-top: 12px;
`;

const WalletWrapper = styled(AccentButton)`
  width: 385px;
  height: 75px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: ${props => props.theme.colors.bgDarken};
  padding: 24px;
  border-radius: 8px;
  margin-bottom: 16px;

  @media screen and (max-width: ${responsive.smartphoneLarge}) {
    width: 300px;
  }
`;

const StyledModal = styled.div`
  width: 433px;
  height: auto;
  padding: 4px 4px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${props => props.theme.colors.bgNormal};
  margin: 36px auto;
  border-radius: 8px;
  box-shadow: 0 13px 26px 0 rgba(0, 0, 0, 0.16);

  @media screen and (max-width: ${responsive.smartphoneLarge}) {
    width: 100%;
    padding: 4px;
    background-color: transparent;
    border: none;
    box-shadow: none;
  }
`;

const IconWrapper = styled.div`
  width: 43px;
`;

const WalletIcon = styled.img`
  height: 27px;
`;

const WalletText = styled.span`
  font: normal normal normal 16px/25px 'Poppins';
  line-height: 1.56;
  color: ${props => props.theme.colors.txtPrimary};
`;

const RightIcon = styled.img`
  width: 24px;
`;

export default function Landing({ connectWallet }) {
  const onWalletClick = wallet => {
    Object.values(SUPPORTED_WALLETS).forEach(sWallet => {
      if (sWallet.name === wallet.title) {
        if (isMobile && wallet.title === 'Metamask' && window.ethereum === undefined) {
          const url = window.location.href;
          const arr = url.split('/');
          arr[2] = arr[2].replaceAll('/', '');
          const newurl = `https://metamask.app.link/dapp/${arr[2]}`;
          window.location.href = newurl;
        } else {
          window.localStorage.setItem('connectorId', sWallet.name);
          // This part of code never can be executed with SUPPORTED_WALLETS constants. Can it be deleted?
          if (sWallet.name === 'Injected') {
            if (typeof web3 !== 'undefined') {
              connectWallet(sWallet.connector);
            } else {
              window.open('https://metamask.io/download.html');
            }
          } else {
            connectWallet(sWallet.connector);
          }
        }
      }
    });
  };

  return (
    <Wrapper>
      <StyledHeader>
        <StyledModal>
          <StyledTopPart>
            <StyledLogo src={logo} alt="logo" />
            <StyledLogoText>ONOMY</StyledLogoText>
          </StyledTopPart>
          <StyledMiddlePart>
            <BottomTitleText>Connect Your Wallet</BottomTitleText>
            <BottomDescriptionText>
              To participate in the Bonding Curve Platform, you must connect your Ethereum wallet.
            </BottomDescriptionText>
          </StyledMiddlePart>
          <StyledBottomPart>
            {wallets.map(wallet => (
              <WalletWrapper key={wallet.title} onClick={() => onWalletClick(wallet)}>
                <IconWrapper>
                  <WalletIcon alt={`${wallet.title} Icon`} src={wallet.img} />
                </IconWrapper>
                <WalletText>{wallet.title}</WalletText>
                <RightIcon alt="Right Cursor" src={rightCursor} />
              </WalletWrapper>
            ))}
          </StyledBottomPart>
        </StyledModal>
      </StyledHeader>
    </Wrapper>
  );
}
