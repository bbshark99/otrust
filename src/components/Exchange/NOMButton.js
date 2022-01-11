import React from 'react';

import { useExchange } from 'context/exchange/ExchangeContext';
import { useChain } from 'context/chain/ChainContext';
import { SellBtn } from './exchangeStyles';

export default function NOMButton({ onBid, onApprove }) {
  const { weakBalance, NOMallowance } = useChain();

  const { bidAmount, bidDenom, input, weak } = useExchange();

  if (bidDenom === 'strong') return <SellBtn>Sell {weak}</SellBtn>;
  if (bidAmount.lte(weakBalance)) {
    if (input === '') return <SellBtn>Sell {weak}</SellBtn>;
    if (NOMallowance.gte(bidAmount)) return <SellBtn onClick={onBid}>Sell {weak}</SellBtn>;
    return <SellBtn onClick={onApprove}>Approve</SellBtn>;
  }
  return <SellBtn> Low {weak} Balance </SellBtn>;
}
