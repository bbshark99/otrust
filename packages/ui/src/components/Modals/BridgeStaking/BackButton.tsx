/* eslint-disable react/require-default-props */
import React from 'react';
import styled from 'styled-components/macro';

import { BackArrow } from '../Icons';

const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 40px;
  height: 40px;

  position: absolute;
  left: -76px; // width 40 + gap 36
  top: 38px;

  background-color: ${props => props.theme.colors.bgHighlightBorder};
  border: none;
  border-radius: 8px;
`;

export default function BackButton({
  clickHandler,
}: {
  clickHandler?: React.MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <IconButton onClick={clickHandler}>
      <BackArrow />
    </IconButton>
  );
}
