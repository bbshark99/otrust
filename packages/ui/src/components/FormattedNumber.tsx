import React from 'react';

export function FormattedNumber({ value }: { value: number }) {
  return <>{Number(value).toLocaleString()}</>;
}
