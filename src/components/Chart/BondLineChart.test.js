import { cleanup, render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { BigNumber } from 'bignumber.js';

import { darkNew } from 'theme/theme';
import LineChart, { supplyToArray, labelArray, bounds } from './BondLineChart';
import { format18 } from 'utils/math';
import { ChainContext } from '../../context/chain/ChainContext';
import { ExchangeContext } from '../../context/exchange/ExchangeContext';

describe('Given the supplyToArray util function', () => {
  describe('when the function is called', () => {
    it('should return correct value', () => {
      const result = supplyToArray([50, 100]);
      expect(result).toHaveLength(100);
      expect(result[0]).toEqual({ x: 50, y: 2.5e-13 });
      expect(result[99]).toEqual({ x: 99.5, y: 9.90025e-13 });
    });
  });
});

describe('Given the labelArray util function', () => {
  describe('when the function is called', () => {
    it('should return correct value', () => {
      const result = labelArray([50, 100]);
      expect(result).toEqual({
        paymentETH: 2.916666666666666e-11,
        priceAvg: 5.833333333333332e-13,
        supAvg: 76.37626158259732,
      });
    });
  });
});

describe('Given the bounds util function', () => {
  describe('when the function is called', () => {
    it('should return correct value', () => {
      const formatSupply = [format18(new BigNumber(10 ** 16)).toNumber(), format18(new BigNumber(10 ** 20)).toNumber()];
      const result = bounds(formatSupply);
      expect(result).toEqual({
        lowerBound: 0,
        upperBound: 200,
      });
    });
  });
});

describe('Given the LineChart component', () => {
  describe('when the component is rendered', () => {
    afterEach(cleanup);

    it('should match the snapshot with not defined bidDenom', () => {
      const { asFragment } = render(
        <ThemeProvider theme={darkNew}>
          <ChainContext.Provider value={{ supplyNOM: new BigNumber(0), theme: darkNew }}>
            <ExchangeContext.Provider value={{ askAmount: 0, bidAmount: 0, bidDenom: undefined }}>
              <LineChart />
            </ExchangeContext.Provider>
          </ChainContext.Provider>
        </ThemeProvider>,
      );
      expect(asFragment()).toMatchSnapshot();
    });

    it('should match the snapshot with bidDenom strong', () => {
      const { asFragment } = render(
        <ThemeProvider theme={darkNew}>
          <ChainContext.Provider value={{ supplyNOM: new BigNumber(0), theme: darkNew }}>
            <ExchangeContext.Provider value={{ askAmount: 0, bidAmount: 0, bidDenom: 'strong' }}>
              <LineChart />
            </ExchangeContext.Provider>
          </ChainContext.Provider>
        </ThemeProvider>,
      );
      expect(asFragment()).toMatchSnapshot();
    });

    it('should match the snapshot with bidDenom weak', () => {
      const { asFragment } = render(
        <ThemeProvider theme={darkNew}>
          <ChainContext.Provider value={{ supplyNOM: new BigNumber(0), theme: darkNew }}>
            <ExchangeContext.Provider value={{ askAmount: 0, bidAmount: 0, bidDenom: 'weak' }}>
              <LineChart />
            </ExchangeContext.Provider>
          </ChainContext.Provider>
        </ThemeProvider>,
      );
      expect(asFragment()).toMatchSnapshot();
    });
  });
});
