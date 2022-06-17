import React, { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components/macro';
import { Link, useParams } from 'react-router-dom';
import BigNumber from 'bignumber.js';
import { useAsyncProcess } from '@onomy/react-utils';
import { useBondingCurve, ValidatorData } from '@onomy/react-hub';

import ValidatorFooter from './ValidatorFooter';
import { Caption, Desc } from './ValidatorHeader';
import ValidatorNodeHeader from './ValidatorNodeHeader';
import * as Modal from '../styles';
import BackButton from './BackButton';
import StakingModal from './StakingModal';
import StakingTransactionFailedModal from './StakingTransactionFailedModal';
import { BigNumberInput } from 'components/BigNumberInput';
import { format18, parse18 } from 'utils/math';
import LoadingSpinner from 'components/UI/LoadingSpinner';
import ValidatorDelegationSuccess from './ValidatorDelegationSuccess';

const FieldWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  height: 76px;
  padding: 12px;

  background-color: ${props => props.theme.colors.bgHighlightBorder};
  border-radius: 8px;
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  padding: 4px 12px;

  span {
    font-size: 12px;
    font-weight: 500;
    color: ${props => props.theme.colors.textThirdly};
  }

  input {
    background: transparent;
    border: none;

    font-size: 18px;
    font-weight: 500;
    color: ${props => props.theme.colors.textPrimary};

    &:focus,
    &:active {
      outline: none;
    }
  }
`;

const MaxButton = styled.button`
  width: 70px;
  height: 100%;

  border: none;
  border-radius: 7px;
  background-color: #2a2837;

  font-size: 14px;
  font-weight: 500;
  color: ${props => props.theme.colors.highlightYellow};
`;

export default function ValidatorDelegation({
  data,
  direction = 'DELEGATE',
}: {
  data: ValidatorData;
  direction: 'DELEGATE' | 'UNDELEGATE';
}) {
  const { id } = useParams();
  const { onomyClient, nomBalance } = useBondingCurve();
  const [attemptTx, { pending: txPending, error: txError, finished: txFinished }] =
    useAsyncProcess();
  const verb = useMemo(() => (direction === 'DELEGATE' ? 'delegate' : 'undelegate'), [direction]);
  const { validator, delegation } = data;

  const [amount, setAmount] = useState(new BigNumber(0));

  const isValid = useMemo(() => {
    if (amount.lte(0) || amount.isNaN()) {
      return false;
    }

    if (direction === 'DELEGATE') {
      const bigNumBal = format18(new BigNumber(nomBalance.amount.toString()));
      if (amount.lte(0)) return false;
      if (amount.gt(bigNumBal)) return false;
    } else {
      const delegated = format18(delegation ?? new BigNumber(0));
      if (amount.gt(delegated)) return false;
    }
    return true;
  }, [amount, nomBalance, direction, delegation]);

  const onConfirm = useCallback(async () => {
    if (!isValid || !id) throw new Error('Invalid delegation form');
    return attemptTx(async () => {
      const intAmount = parse18(amount);

      if (direction === 'DELEGATE') {
        await onomyClient?.delegate({
          validatorAddress: id,
          amountFixed: intAmount,
        });
      } else {
        await onomyClient?.undelegate({
          validatorAddress: id,
          amountFixed: intAmount,
        });
      }
    });
  }, [attemptTx, direction, amount, onomyClient, id, isValid]);

  function setMax() {
    if (direction === 'DELEGATE') {
      setAmount(format18(new BigNumber(nomBalance.amount.toString())));
    } else {
      const delegated = format18(delegation ?? new BigNumber(0));
      setAmount(delegated);
    }
  }

  if (!validator) return null;

  if (txError) {
    return <StakingTransactionFailedModal error={txError.message} />;
  }

  if (txPending) {
    return (
      <StakingModal>
        <LoadingSpinner />
      </StakingModal>
    );
  }

  if (txFinished) {
    return <ValidatorDelegationSuccess data={data} direction={direction} amount={amount} />;
  }

  return (
    <StakingModal>
      <Modal.StakingWrapper>
        <Link to={`/validators/${id}/`}>
          <BackButton />
        </Link>

        <ValidatorNodeHeader
          name={validator.description?.moniker ?? ''}
          url={validator.description?.website}
        />

        <div>
          <Caption style={{ textTransform: 'capitalize' }}>{verb} NOMs</Caption>
          <Desc>
            Enter the amount of NOM you would like to {verb}. Remember, unstaking your NOM will take
            21 days before your NOM is available for other uses.
          </Desc>
          <FieldWrapper>
            <InputWrapper>
              <span style={{ textTransform: 'capitalize' }}>{verb} NOM</span>
              <BigNumberInput value={amount} onChange={setAmount} />
            </InputWrapper>
            <MaxButton onClick={() => setMax()}>MAX</MaxButton>
          </FieldWrapper>
        </div>
      </Modal.StakingWrapper>
      <ValidatorFooter>
        <Link to={`/validators/${id}`}>
          <Modal.SecondaryButton type="button">Back</Modal.SecondaryButton>
        </Link>
        <Modal.PrimaryButton type="button" onClick={onConfirm} disabled={!isValid}>
          Confirm
        </Modal.PrimaryButton>
      </ValidatorFooter>
    </StakingModal>
  );
}
