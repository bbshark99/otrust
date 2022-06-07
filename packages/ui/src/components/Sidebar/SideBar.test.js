import React from 'react';
import { cleanup, render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { BigNumber } from 'bignumber.js';
import { MemoryRouter } from 'react-router-dom';
import { BondingCurveContext } from '@onomy/react-hub';

import { darkNew } from 'theme/theme';
import { ExchangeContext } from '../../context/exchange/ExchangeContext';
import Sidebar from './Sidebar';

describe('Given the Sidebar component and strongBalance, weakBalance are of BigNumber type', () => {
  describe('when the component is rendered', () => {
    afterEach(cleanup);

    it('should match the snapshot', () => {
      const { asFragment } = render(
        <MemoryRouter>
          <ThemeProvider theme={darkNew}>
            <BondingCurveContext.Provider
              value={{
                blockNumber: 12345678,
                strongBalance: new BigNumber(0),
                weakBalance: new BigNumber(10),
                nomBalance: {
                  amount: BigInt(0),
                },
              }}
            >
              <ExchangeContext.Provider value={{ strong: 'ETH', weak: 'bNOM' }}>
                <Sidebar />
              </ExchangeContext.Provider>
            </BondingCurveContext.Provider>
          </ThemeProvider>
        </MemoryRouter>
      );
      expect(asFragment()).toMatchSnapshot();
    });
  });
});

describe('Given the Sidebar component and strongBalance, weakBalance are NOT of BigNumber type', () => {
  describe('when the component is rendered', () => {
    afterEach(cleanup);

    it('should match the snapshot', () => {
      const { asFragment } = render(
        <MemoryRouter>
          <ThemeProvider theme={darkNew}>
            <BondingCurveContext.Provider
              value={{
                blockNumber: 12345678,
                strongBalance: 0,
                weakBalance: 10,
                nomBalance: {
                  amount: BigInt(0),
                },
              }}
            >
              <ExchangeContext.Provider value={{ strong: 'ETH', weak: 'bNOM' }}>
                <Sidebar />
              </ExchangeContext.Provider>
            </BondingCurveContext.Provider>
          </ThemeProvider>
        </MemoryRouter>
      );
      expect(asFragment()).toMatchSnapshot();
    });
  });
});
