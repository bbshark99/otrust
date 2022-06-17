import { cleanup, fireEvent, render, waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';

import {
  ThemeWrapper,
  ExchangeContextWrapper,
  UpdateExchangeContextWrapper,
  ChainContextWrapper,
  renderWithContext,
  ModalContextWrapper,
} from 'utils/testing';
import ExchangeQuote from './ExchangeQuote';

const testProps = {
  strength: '10',
};

const testModalContext = {
  handleModal: jest.fn(),
};

const testUpdateExchangeContext = {
  objDispatch: jest.fn(),
  strDispatch: jest.fn(),
  setInputPending: false,
};

const testChainContext = {
  strongBalance: new BigNumber(0),
  weakBalance: new BigNumber(0),
};

const testExchangeContext = {
  askAmount: new BigNumber(0),
  bidAmount: new BigNumber(0),
  bidDenom: 'strong',
  status: 'Not Approved',
  strong: 'ETH',
  weak: 'NOM',
};

describe('Given an ExchangeQuote component', () => {
  describe('when the component is rendered', () => {
    afterEach(cleanup);

    it('should match the snapshot', () => {
      const { asFragment } = renderWithContext(ExchangeQuote);
      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('when strong balance changed', () => {
    it('should updated the ask amount', async () => {
      const { getByTestId } = renderWithContext(ExchangeQuote);
      const receivingValue = getByTestId('exchange-weak-balance');

      fireEvent.change(getByTestId('exchange-strong-balance-input'), { target: { value: '1' } });

      await waitFor(() => expect(receivingValue).toHaveTextContent('ETH'));
    });
  });

  describe('when max button clicked', () => {
    it('should calculated max balace correctly', async () => {
      const { queryByTestId } = render(
        ChainContextWrapper(
          UpdateExchangeContextWrapper(
            ExchangeContextWrapper(
              ModalContextWrapper(ThemeWrapper(ExchangeQuote, testProps), testModalContext),
              testExchangeContext
            ),
            testUpdateExchangeContext
          ),
          testChainContext
        )
      );
      const receivingValue = queryByTestId('exchange-weak-balance');

      fireEvent.click(queryByTestId('max-value-button'));

      await waitFor(() => expect(receivingValue).toHaveTextContent('ETH'));
    });
  });
});
