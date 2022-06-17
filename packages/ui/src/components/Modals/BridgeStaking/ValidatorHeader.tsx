import React from 'react';
import styled from 'styled-components/macro';

export const Caption = styled.h3`
  margin-bottom: 20px;

  font-family: Barlow Condensed, sans-serif;
  font-size: 28px;
  font-weight: 500;
  color: ${props => props.theme.colors.txtPrimary};
`;

export const Desc = styled.p`
  margin-bottom: 24px;

  font-size: 14px;
  line-height: 20px;
  color: ${props => props.theme.colors.txtSecondary};
`;

export default function ValidatorHeader() {
  return (
    <header>
      <Caption>Select validator node</Caption>
      <Desc>
        Earn staking rewards for delegating your NOM to a validator. Please choose one from the list
        below.
      </Desc>
    </header>
  );
}
