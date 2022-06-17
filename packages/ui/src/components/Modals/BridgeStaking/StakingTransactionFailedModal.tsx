import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { Close, Fail } from '../Icons';
import * as Modal from '../styles';
import { responsive } from 'theme/constants';

const FailIconWrapper = styled(Modal.ModalIconWrapper)`
  background-color: ${props => props.theme.colors.highlightRed};
  border-color: #412a33;

  svg * {
    fill: ${props => props.theme.colors.textPrimary};
  }
`;

const FooterControls = styled(Modal.FooterControls)`
  justify-content: center;
`;

const Message = styled.div`
  padding: 32px;
  margin: 32px 0 24px;

  background-color: ${props => props.theme.colors.bgDarken};
  border-radius: 8px;

  color: ${props => props.theme.colors.textSecondary};
  text-align: center;

  @media screen and (max-width: ${responsive.laptop}) {
    padding: 24px;
    margin: 24px 0 20px;
  }

  @media screen and (max-width: ${responsive.smartphone}) {
    font-size: 14px;
  }
`;

export default function StakingTransactionFailedModal({ error }: { error: string }) {
  return (
    <Modal.Wrapper>
      <Link to="/">
        <Modal.CloseIcon>
          <Close />
        </Modal.CloseIcon>
      </Link>

      <main>
        <FailIconWrapper>
          <Fail />
        </FailIconWrapper>
        <Modal.Caption>Transaction Failed</Modal.Caption>

        <Message>{error.toString()}</Message>
      </main>
      <footer>
        <FooterControls>
          <Link to="/">
            <Modal.PrimaryButton>Ok &#x1f625;</Modal.PrimaryButton>
          </Link>
        </FooterControls>
      </footer>
    </Modal.Wrapper>
  );
}
