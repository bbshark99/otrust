import React from 'react';

import { ExchangeWrapper } from './exchangeStyles';
import ExchangeQuote from './ExchangeQuote';
import ExchangeModals from './ExchangeModals';

export default function Exchange() {
  return (
    <ExchangeWrapper>
      <ExchangeModals />
      <div id="tour-buy">
        <ExchangeQuote strength="strong" />
      </div>
      <div id="tour-sell">
        <ExchangeQuote strength="weak" />
      </div>
    </ExchangeWrapper>
  );
}
