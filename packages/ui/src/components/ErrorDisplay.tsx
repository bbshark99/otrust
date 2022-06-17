import React, { useEffect } from 'react';

export function ErrorDisplay({ error }: { error: Error }) {
  useEffect(() => console.error('error', error), [error]);
  return <pre>{`${error}`}</pre>;
}
