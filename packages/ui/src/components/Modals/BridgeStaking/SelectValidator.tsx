import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components/macro';

import ValidatorHeader from './ValidatorHeader';
import ValidatorFooter from './ValidatorFooter';
import ValidatorTable from './ValidatorTable';
import * as Modal from '../styles';
import StakingModal from './StakingModal';
import { ConnectKeplr } from 'components/ConnectKeplr';
import warningSrc from '../assets/warning.svg';

const Message = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding: 15px 20px 15px 12px;

  background-color: #252b39;
  border-radius: 4px;

  color: ${props => props.theme.colors.highlightBlue};
`;

export default function SelectValidator() {
  const [selected, setSelected] = useState('');

  return (
    <StakingModal>
      <ConnectKeplr />
      <Modal.StakingWrapper>
        <ValidatorHeader />

        <Message>
          <img src={warningSrc} alt="" />
          NOTE: To stop staking and make your balance available, there is a 3-week unbonding time.
        </Message>

        <ValidatorTable selected={selected} setSelected={setSelected} />
      </Modal.StakingWrapper>
      <ValidatorFooter>
        {selected ? (
          <Link to={`/validators/${selected}`}>
            <Modal.PrimaryButton type="button">Select validator</Modal.PrimaryButton>
          </Link>
        ) : (
          <Modal.PrimaryButton type="button" disabled>
            Select validator
          </Modal.PrimaryButton>
        )}
      </ValidatorFooter>
    </StakingModal>
  );
}
