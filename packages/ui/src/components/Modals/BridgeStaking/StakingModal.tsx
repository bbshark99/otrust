import React from 'react';
import styled from 'styled-components/macro';
import { Link } from 'react-router-dom';

import { Dimmer } from 'components';
import { Close } from '../Icons';
import * as Modal from '../styles';
import { responsive } from 'theme/constants';

const ModalBody = styled.div`
  width: 770px;
  padding: 4px;

  position: absolute;
  top: 50%;
  left: 50%;

  background-color: ${props => props.theme.colors.bgNormal};
  border-radius: 8px;

  transform: translate(-50%, -50%);
  z-index: 11;

  @media screen and (max-width: ${responsive.tabletSmall}) {
    max-width: calc(100% - 20px);
    margin: 0 10px;

    top: 50px;
    left: 0;

    transform: none;
  }

  @media screen and (max-width: ${responsive.smartphone}) {
    width: 100%;
    min-height: 100vh;
    max-width: none;
    margin: 0;

    top: 0;

    border-radius: 0;
  }
`;

export default function StakingModal({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Dimmer />

      <ModalBody>
        <Link to="/">
          <Modal.CloseIcon>
            <Close />
          </Modal.CloseIcon>
        </Link>
        {children}
      </ModalBody>
    </>
  );
}
