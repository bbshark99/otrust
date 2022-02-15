import React, { useCallback } from 'react';
import { Route, Routes, useParams } from 'react-router-dom';

import StakingModal from './StakingModal';
import { useOnomy } from 'context/chain/OnomyContext';
import { useAsyncValue } from 'hooks/useAsyncValue';
import LoadingSpinner from 'components/UI/LoadingSpinner';
import ValidatorDetail from './ValidatorDetail';
import ValidatorDelegation from './ValidatorDelegation';
import ValidatorDelegationSuccess from './ValidatorDelegationSuccess';

export default function ValidatorNode() {
  const { onomyClient, address } = useOnomy();
  const { id } = useParams();

  const [data, { error, pending }] = useAsyncValue(
    useCallback(async () => {
      if (!id) return { validator: null, delegation: null };
      const [validators, selfDelegation, delegationData, rewardsData] = await Promise.all([
        // TODO: more focused query?
        onomyClient.getValidators(),
        onomyClient.getSelfDelegation(id),
        onomyClient.getDelegation(id, address),
        onomyClient.getRewardsForDelegator(id),
      ]);
      const validatorData = validators.find(v => v.operator_address === id);
      if (!validatorData) return { validator: null, delegation: delegationData };
      const selfStakeRate = selfDelegation?.balance.amount.div(validatorData.tokens);
      const rewardItems = rewardsData?.rewards.find(v => v.validator_address === id);
      const rewardItem = rewardItems?.reward.find(r => r.denom === 'nom'); // TODO: don't hardcode?
      return {
        validator: validatorData,
        selfDelegation,
        selfStake: selfStakeRate ? selfStakeRate.toNumber() : 0,
        delegation: delegationData,
        rewards: rewardItem,
      };
    }, [onomyClient, id, address]),
    { validator: null, delegation: null, rewards: null, selfStake: 0 }
  );

  if (pending) {
    return (
      <StakingModal>
        <LoadingSpinner />
      </StakingModal>
    );
  }

  if (error) {
    return (
      <StakingModal>
        <pre>{`${error}`}</pre>
      </StakingModal>
    );
  }

  if (!data.validator) {
    return <StakingModal>No Matching Validator</StakingModal>;
  }

  return (
    <Routes>
      <Route path="/" element={<ValidatorDetail data={data} />} />
      <Route path="/delegate" element={<ValidatorDelegation data={data} direction="DELEGATE" />} />
      <Route
        path="/undelegate"
        element={<ValidatorDelegation data={data} direction="UNDELEGATE" />}
      />
      <Route path="/validator-delegation/success" element={<ValidatorDelegationSuccess />} />
    </Routes>
  );
}
