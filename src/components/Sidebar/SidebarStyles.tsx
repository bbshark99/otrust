import React, { useState } from 'react';
import styled from 'styled-components';

import { responsive } from 'theme/constants';
import { withTrimmedWrapper } from 'components/UI';

export const Balances = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;

  padding: 24px 40px;

  border-bottom: 1px solid
    ${(props: { theme: { colors: { bgHighlightBorder: any } } }) =>
      props.theme.colors.bgHighlightBorder};

  @media screen and (max-width: ${responsive.laptop}) {
    padding: 24px;
  }

  @media screen and (max-width: ${responsive.tablet}) {
    flex-direction: row;
    align-items: center;
    grid-column: 1/3;
    grid-row: 2/3;

    border: none;
  }

  @media screen and (max-width: ${responsive.tabletSmall}) {
    gap: 40px;
  }

  @media screen and (max-width: ${responsive.smartphoneLarge}) {
    display: flex;
    flex-direction: column;
    align-items: stretch;

    padding: 20px;
    gap: 0px;
  }

  strong {
    display: block;
    margin-bottom: 10px;

    font-weight: 400;
    color: ${(props: { theme: { colors: { textSecondary: any } } }) =>
      props.theme.colors.textSecondary};
  }
`;

export const BalanceNumber = styled.div`
  font-family: 'Bebas Neue', sans-serif;
  font-size: 28px;
  font-weight: ${(props: { strong: any }) => (props.strong ? 700 : 400)};

  > small {
    margin-left: 5px;

    font-family: 'Poppins', sans-serif;
    color: ${(props: { theme: { colors: { textSecondary: any } } }) =>
      props.theme.colors.textSecondary};
    font-size: 11px;
  }

  @media screen and (max-width: ${responsive.laptop}) {
    font-size: 20px;
  }
`;

export const Balance = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const BalancePrice = styled.div``;

export const BalanceHint = styled.div`
  position: relative;
`;

export const SecondaryIcon = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;

  height: 40px;
  width: 40px;

  background-color: ${(props: { theme: { colors: { bgHighlightBorder: any } } }) =>
    props.theme.colors.bgHighlightBorder};
  border-radius: 8px;
  border: none;

  font-size: 20px;
  font-weight: 500;
  color: ${(props: { theme: { colors: { iconsSecondary: any } } }) =>
    props.theme.colors.iconsSecondary};

  cursor: pointer;
  user-select: none;

  @media screen and (max-width: ${responsive.laptop}) {
    width: 32px;
    height: 32px;

    font-size: 14px;
  }

  @media screen and (max-width: ${responsive.tablet}) {
    margin-left: 24px;
  }

  &:hover {
    background-color: ${(props: { theme: { colors: { iconsNormal: any } } }) =>
      props.theme.colors.iconsNormal};
    color: ${(props: { theme: { colors: { bgDarken: any } } }) => props.theme.colors.bgDarken};
  }

  &:active {
    background-color: ${(props: { theme: { colors: { bgHighlightBorder_darken: any } } }) =>
      props.theme.colors.bgHighlightBorder_darken};
  }
`;

export const Approved = styled.div`
  display: inline-block;

  padding: 4px 8px;
  margin-top: 6px;

  position: relative;

  background-color: #2a303f;
  border-radius: 6px;

  color: ${(props: { theme: { colors: { highlightBlue: any } } }) =>
    props.theme.colors.highlightBlue};
  font-size: 12px;
  font-weight: 400;
  font-family: Poppins, sans-serif;

  /* @media screen and (max-width: ${responsive.tablet}) {
    margin: 0 0 0 12px;
  } */

  svg {
    position: absolute;
    right: 4px;
    top: 2px;

    cursor: pointer;
    * {
      fill: currentColor;
    }
  }
`;

export const WithdrawBtnWrapper = styled.div`
  margin-top: 20px;
  min-width: 150px;

  @media screen and (max-width: ${responsive.tablet}) {
    margin: 0 0 0 auto;
  }

  @media screen and (max-width: ${responsive.smartphoneLarge}) {
    padding-top: 10px;
    margin: 0;
  }
`;

export const TooltipWrapper = styled.div`
  display: ${(props: { active: any }) => (props.active ? 'block' : 'none')};

  width: 360px;
  padding: 32px 40px;

  position: absolute;
  right: 65px;
  top: -35px;

  background-color: ${(props: { theme: { colors: { bgHighlightBorder: any } } }) =>
    props.theme.colors.bgHighlightBorder};
  border-radius: 8px;
  box-shadow: 0 5px 50px 0 rgba(0, 0, 0, 0.36);

  z-index: 1;
  cursor: pointer;

  &:after {
    content: '';
    display: block;

    position: absolute;
    right: -20px;
    top: 25px;

    width: 0;
    height: 0;
    border-top: 30px solid transparent;
    border-bottom: 30px solid transparent;

    border-left: 30px solid
      ${(props: { theme: { colors: { bgHighlightBorder: any } } }) =>
        props.theme.colors.bgHighlightBorder};
  }

  @media screen and (max-width: ${responsive.tablet}) {
    width: 300px;
    padding: 24px;

    right: -135px;
    top: 50px;

    &:after {
      right: 130px;
      top: -35px;

      border-top: 20px solid transparent;
      border-bottom: 20px solid
        ${(props: { theme: { colors: { bgHighlightBorder: any } } }) =>
          props.theme.colors.bgHighlightBorder};
      border-left: 20px solid transparent;
      border-right: 20px solid transparent;
    }
  }

  @media screen and (max-width: ${responsive.smartphoneLarge}) {
    width: 240px;
    padding: 16px 24px;

    right: 50px;
    top: -55px;

    &:after {
      right: -30px;
      top: 50px;

      border-top: 20px solid transparent;
      border-bottom: 20px solid transparent;
      border-left: 20px solid
        ${(props: { theme: { colors: { bgHighlightBorder: any } } }) =>
          props.theme.colors.bgHighlightBorder};
      border-right: 20px solid transparent;
    }
  }
`;

export const TooltipCaption = styled.h5`
  margin-bottom: 16px;

  font-size: 14px;
  font-weight: 500;
`;

export const TooltipDesc = styled.p`
  color: ${(props: { theme: { colors: { textSecondary: any } } }) =>
    props.theme.colors.textSecondary};
`;

export const TrimmedApproved = withTrimmedWrapper(({ value }: { value: string | number }) => (
  <Approved>
    <span>{value} approved</span>
  </Approved>
));

export function Hint({ children }: { children: JSX.Element[] }) {
  const [active, setActive] = useState(false);

  return (
    <BalanceHint onPointerOver={() => setActive(true)} onPointerLeave={() => setActive(false)}>
      <TooltipWrapper active={active}>{children}</TooltipWrapper>
      {/* @ts-ignore */}
      <SecondaryIcon active={active}>i</SecondaryIcon>
    </BalanceHint>
  );
}
