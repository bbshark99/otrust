import React from 'react';
import styled from 'styled-components';

import { responsive } from 'theme/constants';

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: center;
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
  align-items: center;
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

export default function SidebarHeader({ account }) {
  return (
    <Header>
      <AccountNumber>
        <p>My Account</p>
        <span>
          {/* eslint-disable-next-line no-nested-ternary */}
          {account === null
            ? '-'
            : account
            ? `${account.substring(0, 6)}...${account.substring(account.length - 4)}`
            : ''}
        </span>
      </AccountNumber>
    </Header>
  );
}
