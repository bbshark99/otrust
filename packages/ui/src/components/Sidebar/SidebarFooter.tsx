import React from 'react';
import styled from 'styled-components';

import { REACT_APP_BONDING_NOM_CONTRACT_ADDRESS } from 'constants/env';
import { responsive } from 'theme/constants';
import { TelegramIcon, MediumIcon, TwitterIcon, SiteIcon, DiscordIcon } from './SidebarIcons';

const SidebarFooterWrapper = styled.footer`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 24px;

  padding: 24px 40px;
  margin-top: auto;

  @media screen and (max-width: ${responsive.laptop}) {
    padding: 20px 24px;
  }

  @media screen and (max-width: ${responsive.tablet}) {
    gap: 12px;

    width: 100%;
    padding: 40px 24px;

    position: absolute;
    bottom: 0;
    left: 0;
  }

  @media screen and (max-width: ${responsive.smartphoneLarge}) {
    padding: 24px 20px;

    position: relative;

    background-color: ${props => props.theme.colors.bgDarken};
  }
`;

// const Logout = styled.button`
//   display: block;
//   margin-top: 10px;

//   background: transparent;
//   border: none;

//   color: ${props => props.theme.colors.textSecondary};
//   text-decoration: none;

//   &:hover {
//     color: ${props => props.theme.colors.textPrimary};
//   }

//   &:active {
//     color: ${props => props.theme.colors.textThirdly};
//   }

//   @media screen and (max-width: ${responsive.tablet}) {
//     margin: 0;
//   }
// `;

const SecondaryIcon = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;

  height: 40px;
  width: 40px;

  background-color: ${props => props.theme.colors.bgHighlightBorder};
  border-radius: 8px;

  font-size: 20px;
  color: ${props => props.theme.colors.iconsSecondary};

  cursor: pointer;

  svg {
    width: 20px;
    height: 20px;
  }

  @media screen and (max-width: ${responsive.laptop}) {
    width: 32px;
    height: 32px;

    font-size: 14px;

    svg {
      width: 16px;
      height: 16px;
    }
  }

  &:hover {
    background-color: ${props => props.theme.colors.bgHighlightBorder_lighten};

    svg * {
      fill: ${props => props.theme.colors.textPrimary};
    }
  }

  &:active {
    background-color: ${props => props.theme.colors.bgHighlightBorder_darken};
  }
`;

const IconsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  width: 100%;

  @media screen and (max-width: ${responsive.tablet}) {
    justify-content: center;
    gap: 12px;
  }
`;

const AddressWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  width: 100%;

  color: ${props => props.theme.colors.textSecondary};

  a {
    color: ${props => props.theme.colors.highlightBlue};
    text-decoration: none;
  }

  @media screen and (max-width: ${responsive.tablet}) {
    justify-content: center;
    gap: 12px;
  }
`;

export default function SidebarFooter() {
  return (
    <SidebarFooterWrapper>
      <IconsWrapper>
        <SecondaryIcon href="https://onomy.io/" target="_blank">
          <SiteIcon />
        </SecondaryIcon>
        <SecondaryIcon href="https://discord.gg/27r73SYAkQ" target="_blank">
          <DiscordIcon />
        </SecondaryIcon>
        <SecondaryIcon href="https://t.me/onomyprotocol" target="_blank">
          <TelegramIcon />
        </SecondaryIcon>

        <SecondaryIcon href="https://medium.com/onomy-protocol" target="_blank">
          <MediumIcon />
        </SecondaryIcon>

        <SecondaryIcon href="https://twitter.com/onomyprotocol" target="_blank">
          <TwitterIcon />
        </SecondaryIcon>
      </IconsWrapper>

      <AddressWrapper>
        <span>Contract Address</span>
        <a
          href={`https://rinkeby.etherscan.io/address/${REACT_APP_BONDING_NOM_CONTRACT_ADDRESS}`}
          target="_new"
        >
          Etherscan
        </a>
      </AddressWrapper>
    </SidebarFooterWrapper>
  );
}
