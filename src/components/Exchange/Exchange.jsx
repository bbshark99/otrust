import React from 'react';

import { ExchangeWrapper } from './exchangeStyles';
import ExchangeQuote from './ExchangeQuote';

export default function Exchange() {
  return (
    <ExchangeWrapper>
      <div id="tour-buy">
        <ExchangeQuote strength="strong" />
      </div>
      <div id="tour-sell">
        <ExchangeQuote strength="weak" />
      </div>
    </ExchangeWrapper>
  );
}
