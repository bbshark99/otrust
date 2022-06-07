import React, { useMemo } from 'react';
import styled from 'styled-components/macro';
import { Link, useParams } from 'react-router-dom';
import BigNumber from 'bignumber.js';
import { ValidatorData } from '@onomy/react-hub';

import ValidatorFooter from './ValidatorFooter';
import { Success } from '../Icons';
import { Caption, Desc } from './ValidatorHeader';
import * as Modal from '../styles';
import ValidatorNodeHeader from './ValidatorNodeHeader';
import StakingModal from './StakingModal';
import { FormattedNumber } from 'components/FormattedNumber';

const DeligatedWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  padding: 32px 40px;

  position: relative;

  background-color: ${props => props.theme.colors.bgNormal};
  border-radius: 8px;

  > strong {
    position: absolute;
    left: 40px;

    color: ${props => props.theme.colors.highlightBlue};
    font-size: 12px;
    text-transform: uppercase;
    font-weight: 500;
  }

  > span {
    font-size: 24px;
    font-weight: 500;

    color: ${props => props.theme.colors.textPrimary};

    sup {
      margin-left: 8px;
      font-size: 12px;
    }
  }
`;

export default function ValidatorDelegationSuccess({
  direction = 'DELEGATE',
  data,
  amount,
}: {
  direction: 'DELEGATE' | 'UNDELEGATE';
  data: ValidatorData;
  amount: BigNumber;
}) {
  const { id } = useParams();
  const verb = useMemo(() => (direction === 'DELEGATE' ? 'delegated' : 'undelegated'), [direction]);
  const { validator } = data;
  if (!validator) return null;

  return (
    <StakingModal>
      <Modal.StakingWrapper>
        <ValidatorNodeHeader
          name={validator.description?.moniker ?? ''}
          url={validator.description?.website}
        />

        <div>
          <Modal.ModalIconWrapper>
            <Success />
          </Modal.ModalIconWrapper>

          <Caption style={{ textAlign: 'center', textTransform: 'capitalize' }}>
            {verb} successfully!
          </Caption>
          <Desc style={{ textAlign: 'center' }}>
            {direction === 'DELEGATE'
              ? `Your NOM has been successfully delegated to ${
                  validator.description?.moniker ?? 'unknown'
                } and is now earning staking rewards!`
              : `You have undelegated from ${
                  validator.description?.moniker ?? 'unknown'
                } and your NOM is now unstaking. It will be available for other uses in 21 days.`}
          </Desc>
          <DeligatedWrapper>
            <strong style={{ textTransform: 'capitalize' }}>{verb}</strong>
            <span>
              <FormattedNumber value={amount.toNumber()} /> <sup>NOM</sup>
            </span>
          </DeligatedWrapper>
        </div>
      </Modal.StakingWrapper>
      <ValidatorFooter>
        <Link to={`/validators/${id}`}>
          <Modal.SecondaryButton type="button">Back to validator</Modal.SecondaryButton>
        </Link>
        <Link to="/">
          <Modal.PrimaryButton type="button">Done</Modal.PrimaryButton>
        </Link>
      </ValidatorFooter>
    </StakingModal>
  );
}
