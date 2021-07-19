import React from 'react';
import styled from 'styled-components';

const Tooltip = styled.div`
  display: none;
  padding: 12px 24px;

  position: absolute;
  bottom: -48px;

  background-color: ${props => props.theme.colors.bgHighlightBorder};
  border-radius: 8px;
  box-shadow: 0 5px 50px 0 rgba(0, 0, 0, 0.36);

  color: ${props => props.theme.colors.textPrimary};
  font-size: 14px;
  font-family: 'Poppins', sans-serif;

  z-index: 1;
`;

const Wrapper = styled.div`
  position: relative;

  &:hover ${Tooltip} {
    display: ${props => (props.hasValue ? 'block' : 'none')};
  }
`;

const formatDecimals = value => {
  if (value === null || value === undefined || value === '') return '';

  let str = `${value}`;
  const index = str.indexOf('.');

  if (index > -1) {
    if (str.length - index > 6) {
      str = `${parseFloat(value).toFixed(6)}...`;
    } else if (index + 1 !== str.length) {
      str = parseFloat(parseFloat(str).toFixed(6));
    }
  }

  return str;
};

export const withTrimmedWrapper = WrappedComponent => {
  return props => {
    const value = formatDecimals(props.value);

    return (
      <Wrapper hasValue={!!value}>
        <Tooltip>{props.value}</Tooltip>
        <WrappedComponent {...props} value={value} />
      </Wrapper>
    );
  };
};
