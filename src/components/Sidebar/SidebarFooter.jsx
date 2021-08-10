import React from 'react';
import styled from 'styled-components';

import { responsive } from 'theme/constants';
import { TelegramIcon, MediumIcon, TwitterIcon } from './SidebarIcons';

const SidebarFooterWrapper = styled.footer`
  display: flex;
  align-items: center;
  gap: 16px;

  padding: 50px 40px;
  margin-top: auto;

  @media screen and (max-width: ${responsive.laptop}) {
    flex-direction: column-reverse;
    padding: 40px 24px;
  }

  @media screen and (max-width: ${responsive.tablet}) {
    width: 100%;
    gap: 12px;

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

const Link = styled.a`
  display: block;
  margin-right: auto;

  color: ${props => props.theme.colors.textSecondary};
  text-decoration: none;

  &:hover {
    color: ${props => props.theme.colors.textPrimary};
  }

  &:active {
    color: ${props => props.theme.colors.textThirdly};
  }

  @media screen and (max-width: ${responsive.laptop}) {
    margin: 0 auto;
  }
`;

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

  gap: 16px;

  @media screen and (max-width: ${responsive.tablet}) {
    gap: 12px;
  }
`;

export default function SidebarFooter() {
  return (
    <SidebarFooterWrapper>
      <Link href="https://onomy.io/" target="_blank">
        About Onomy
      </Link>

      <IconsWrapper>
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
    </SidebarFooterWrapper>
  );
}
