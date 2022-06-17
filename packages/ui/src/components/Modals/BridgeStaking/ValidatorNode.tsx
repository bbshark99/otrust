import React from 'react';
import { Route, Routes, useParams } from 'react-router-dom';
import { useValidatorDetail } from '@onomy/react-hub';

import StakingModal from './StakingModal';
import LoadingSpinner from 'components/UI/LoadingSpinner';
import ValidatorDetail from './ValidatorDetail';
import ValidatorDelegation from './ValidatorDelegation';
import { ConnectKeplr } from 'components/ConnectKeplr';

export default function ValidatorNode() {
  const { id } = useParams();
  const [data, { error, pending }] = useValidatorDetail(id);

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
    <>
      <ConnectKeplr />
      <Routes>
        <Route path="/" element={<ValidatorDetail data={data} />} />
        <Route
          path="/delegate"
          element={<ValidatorDelegation data={data} direction="DELEGATE" />}
        />
        <Route
          path="/undelegate"
          element={<ValidatorDelegation data={data} direction="UNDELEGATE" />}
        />
      </Routes>
    </>
  );
}
