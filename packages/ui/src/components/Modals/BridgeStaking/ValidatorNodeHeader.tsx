/* eslint-disable react/require-default-props */
import React from 'react';
import styled from 'styled-components/macro';
import { useStakingRewardAPR } from '@onomy/react-hub';

import { Hint, TooltipCaption, TooltipDesc } from '../../Sidebar/SidebarStyles';
import { ExternalLink } from '../Icons';
import { responsive } from 'theme/constants';

const Header = styled.header`
  display: flex;
  align-items: center;

  padding: 0 0 32px;
  margin-bottom: 40px;

  border-bottom: 1px solid ${props => props.theme.colors.bgHighlightBorder};
`;

const Validator = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;

  img {
    border-radius: 4px;
  }
`;

const ValidatorDesc = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;

  > a {
    display: flex;
    align-items: center;
    gap: 8px;

    font-size: 12px;
    font-weight: 400;
    color: ${props => props.theme.colors.textThirdly};
    text-decoration: none;
  }
`;

const ValidatorName = styled.strong`
  font-family: Bebas Neue, sans-serif;
  font-size: 26px;
  font-weight: 600;
  letter-spacing: 2.08px;

  color: ${props => props.theme.colors.textPrimary};

  @media screen and (max-width: ${responsive.smartphoneLarge}) {
    font-family: Poppins, sans-serif;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: normal;
  }
`;

const APR = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  margin-left: auto;

  @media screen and (max-width: ${responsive.smartphoneLarge}) {
    flex-direction: column-reverse;
  }

  > span {
    font-size: 12px;
    font-weight: 400;
    color: ${props => props.theme.colors.textThirdly};
  }

  > strong {
    font-family: Bebas Neue, sans-serif;
    font-size: 24px;
    font-weight: 600;
    color: ${props => props.theme.colors.highlightBlue};

    > sup {
      margin-left: 4px;
      font-size: 12px;
    }
  }
`;

const Icon = styled.div`
  margin-left: 150px;

  @media screen and (max-width: ${responsive.smartphoneLarge}) {
    display: none;
  }
`;

export default function ValidatorNodeHeader({
  // imgSrc = 'https://picsum.photos/80/80',
  name,
  url,
}: {
  // imgSrc?: string;
  name: string;
  url?: string;
}) {
  const [estimatedAPR] = useStakingRewardAPR();

  return (
    <Header>
      <Validator>
        {/* <img src={imgSrc} alt="" /> */}
        <ValidatorDesc>
          <ValidatorName>{name}</ValidatorName>
          {url && (
            <a href={url}>
              {url} <ExternalLink /> {/* TODO: pull out domain for display */}
            </a>
          )}
        </ValidatorDesc>
      </Validator>
      <APR>
        <span>Estimated APR</span>
        <strong>
          {estimatedAPR.toFixed(2)}
          <sup>%</sup>
        </strong>
      </APR>
      <Icon>
        <Hint>
          <TooltipCaption>APR</TooltipCaption>
          <TooltipDesc>The estimated annual reward rate you will earn on delegated NOM</TooltipDesc>
        </Hint>
      </Icon>
    </Header>
  );
}
