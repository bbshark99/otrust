/* eslint-disable no-nested-ternary */
import React, { useCallback } from 'react';
import styled from 'styled-components';
import { useAsyncValue } from '@onomy/react-utils';
import { useBondingCurve } from '@onomy/react-hub';

import { responsive } from 'theme/constants';
import { useModal } from 'context/modal/ModalContext';
import { Close } from '../Icons';
import * as Modal from '../styles';

const Message = styled.div`
  margin: 32px 0 0;
  color: ${props => props.theme.colors.textSecondary};
  @media screen and (max-width: ${responsive.smartphone}) {
    font-size: 14px;
  }
`;

const Caption = styled(Modal.Caption)`
  text-align: left;
`;

// eslint-disable-next-line react/function-component-definition
export default function StakingModal() {
  const { handleModal } = useModal();
  const { onomyClient, onomyAddress } = useBondingCurve();

  const [validators, { pending: validatorsPending, error: validatorsError }] = useAsyncValue(
    useCallback(async () => {
      const results = await onomyClient!.getValidators();
      /*
      return Promise.all(
        results.map(async validator => {
          const selfDelegation = await onomyClient.getSelfDelegation(validator.operator_address);
          return {
            validator,
            selfDelegation,
          };
        })
      );
      */
      return results;
    }, [onomyClient]),
    []
  );

  const [delegations, { pending: delegationsPending, error: delegationsError }] = useAsyncValue(
    useCallback(async () => {
      const results = await onomyClient!.getDelegationsForDelegator(onomyAddress);
      return results;
    }, [onomyAddress, onomyClient]),
    []
  );

  const [rewards, { pending: rewardsPending, error: rewardsError }] = useAsyncValue(
    useCallback(async () => {
      const results = await onomyClient!.getRewardsForDelegator(onomyAddress);
      return results;
    }, [onomyAddress, onomyClient]),
    null
  );

  return (
    <div>
      <Modal.CloseIcon onClick={() => handleModal()} data-testid="staking-modal-close-icon">
        <Close />
      </Modal.CloseIcon>

      <main>
        <Caption>Validators</Caption>
        {validatorsError ? (
          <Message>{`${validatorsError}`}</Message>
        ) : validatorsPending ? (
          <Message>Loading...</Message>
        ) : (
          // TODO: figure out why item type isn't making it at runtime
          // eslint-disable-next-line react/no-array-index-key
          validators.map((item: any, idx: number) => (
            // eslint-disable-next-line react/no-array-index-key
            <pre key={idx}>{JSON.stringify(item, null, 2)}</pre>
          ))
        )}

        <Caption>Delegations</Caption>
        {delegationsError ? (
          <Message>{`${delegationsError}`}</Message>
        ) : delegationsPending ? (
          <Message>Loading...</Message>
        ) : (
          // TODO: figure out why item type isn't making it at runtime
          // eslint-disable-next-line react/no-array-index-key
          delegations.map((item: any, idx: number) => (
            // eslint-disable-next-line react/no-array-index-key
            <pre key={idx}>{JSON.stringify(item, null, 2)}</pre>
          ))
        )}

        <Caption>Rewards</Caption>
        {rewardsError ? (
          <Message>{`${rewardsError}`}</Message>
        ) : rewardsPending ? (
          <Message>Loading...</Message>
        ) : (
          <pre>{JSON.stringify(rewards, null, 2)}</pre>
        )}
      </main>
    </div>
  );
}
