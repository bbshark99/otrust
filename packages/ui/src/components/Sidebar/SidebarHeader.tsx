import React from 'react';
import styled from 'styled-components';

import { responsive } from 'theme/constants';
import { LogoutIcon } from './SidebarIcons';

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;

  height: 100px;
  padding: 24px 48px;

  background-color: ${props => props.theme.colors.bgDarken};
  border-radius: 4px;

  @media screen and (max-width: ${responsive.laptop}) {
    gap: 24px;

    padding: 24px 48px;
  }

  @media screen and (max-width: ${responsive.laptopSmall}) {
    grid-template-columns: 32px 56px 32px;
    gap: 24px;

    padding: 24px;
  }

  @media screen and (max-width: ${responsive.tablet}) {
    grid-template-rows: none;
    grid-template-columns: 56px 250px 32px 32px;
    justify-items: start;
    justify-content: start;
    gap: 10px;

    height: 100px;

    background-color: ${props => props.theme.colors.bgNormal};
    border-bottom: 1px solid ${props => props.theme.colors.bgHighlightBorder};
    border-radius: 0;
  }

  @media screen and (max-width: ${responsive.tabletSmall}) {
    grid-template-columns: 56px 150px 32px 32px;

    border-radius: 0;
  }

  @media screen and (max-width: ${responsive.smartphoneLarge}) {
    grid-template-columns: 56px 1fr 44px 44px;
    gap: 16px;

    padding: 20px;
  }

  @media screen and (max-width: ${responsive.smartphoneSmall}) {
    grid-column: 1fr 44px 44px;
  }
`;

const AccountNumber = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;

  grid-column: 1/4;

  @media screen and (max-width: ${responsive.tablet}) {
    align-items: flex-start;
    grid-column: 2/3;
    grid-row: 1/2;

    padding-left: 14px;
  }

  @media screen and (max-width: ${responsive.smartphoneSmall}) {
    grid-column: 1/2;

    padding: 0;
  }

  span {
    font-size: 16px;
    font-weight: 500;
    color: ${props => props.theme.colors.textSecondary};

    @media screen and (max-width: ${responsive.laptop}) {
      font-size: 14px;
    }
  }
`;

const PrimaryIcon = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 44px;
  width: 44px;
  background-color: ${props => props.theme.colors.bgDarken};
  border: 1px solid ${props => props.theme.colors.bgHighlightBorder};
  border-radius: 8px;
  svg {
    width: 20px;
    height: 20px;
  }
  color: ${props => props.theme.colors.iconsNormal};
  cursor: pointer;
  @media screen and (max-width: ${responsive.laptop}) {
    width: 32px;
    height: 32px;
    svg {
      width: 16px;
      height: 16px;
    }
  }
  @media screen and (max-width: ${responsive.tablet}) {
    &:first-child {
      grid-column: 3/4;
    }
    &:nth-child(3) {
      grid-column: 4/5;
    }
  }
  @media screen and (max-width: ${responsive.smartphoneLarge}) {
    width: 44px;
    height: 44px;
    svg {
      width: 20px;
      height: 20px;
    }
  }
  &:hover {
    background-color: ${props => props.theme.colors.bgNormal_lighten};
  }
  &:active {
    background-color: ${props => props.theme.colors.bgNormal_darken};
  }
`;

export default function SidebarHeader({
  account,
  onLogout,
}: {
  account: string | null | undefined;
  onLogout: () => void;
}) {
  return (
    <Header>
      <AccountNumber>
        <p>My Ethereum Address</p>
        <span>
          {/* eslint-disable-next-line no-nested-ternary */}
          {account === null
            ? '-'
            : account
            ? `${account.substring(0, 6)}...${account.substring(account.length - 4)}`
            : ''}
        </span>
      </AccountNumber>

      <PrimaryIcon onClick={onLogout}>
        <LogoutIcon />
      </PrimaryIcon>
    </Header>
  );
}
