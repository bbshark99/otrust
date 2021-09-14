import { ThemeProvider } from 'styled-components';
import ApolloClient, { InMemoryCache } from 'apollo-boost';
import { ApolloProvider } from '@apollo/client';
import { render } from '@testing-library/react';
import { BigNumber } from 'bignumber.js';

import { darkNew } from 'theme/theme';
import { ChainContext } from '../context/chain/ChainContext';
import { ExchangeContext } from '../context/exchange/ExchangeContext';
import { ModalContext } from '../context/modal/ModalContext';
import { UpdateExchangeContext } from '../context/exchange/ExchangeContext';

const client = new ApolloClient({
  uri: process.env.REACT_APP_GRAPHQL_ENDPOINT,
  cache: new InMemoryCache(),
});

export const renderWithTheme = (Component, props, children) => {
  if (children) {
    return render(
      <ThemeProvider theme={darkNew}>
        <Component {...props}>{children}</Component>
      </ThemeProvider>,
    );
  }
  return render(
    <ThemeProvider theme={darkNew}>
      <Component {...props} />
    </ThemeProvider>,
  );
};

export const ThemeWrapper = (Component, props, children) => {
  return (
    <ThemeProvider theme={darkNew}>
      <Component {...props}>{children}</Component>
    </ThemeProvider>
  );
};

export const ChainContextWrapper = (children, contextProps) => {
  return (
    <ChainContext.Provider
      value={{
        blockNumber: BigNumber(0),
        currentETHPrice: BigNumber(0),
        currentNOMPrice: BigNumber(0),
        NOMallowance: BigNumber(0),
        strongBalance: BigNumber(0),
        supplyNOM: BigNumber(0),
        weakBalance: BigNumber(0),
        theme: { darkNew },
        ...contextProps,
      }}
    >
      {children}
    </ChainContext.Provider>
  );
};

export const ExchangeContextWrapper = (children, contextProps) => {
  return (
    <ExchangeContext.Provider
      value={{
        askAmount: BigNumber(0),
        bidAmount: BigNumber(0),
        bidDenom: 'strong',
        status: 'Not Approved',
        strong: 'ETH',
        weak: 'NOM',
        ...contextProps,
      }}
    >
      {children}
    </ExchangeContext.Provider>
  );
};

export const UpdateExchangeContextWrapper = (children, contextProps) => {
  return (
    <UpdateExchangeContext.Provider
      value={{ objDispatch: () => {}, strDispatch: () => {}, setInputPending: false, ...contextProps }}
    >
      {children}
    </UpdateExchangeContext.Provider>
  );
};

export const ModalContextWrapper = (children, contextProps) => {
  return (
    <ModalContext.Provider
      value={{ handleModal: () => {}, modal: false, modalContent: 'Modal Content', ...contextProps }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const renderWithContext = (Component, props, contextValues) => {
  return render(
    <ThemeProvider theme={darkNew}>
      <ApolloProvider client={client}>
        <ChainContext.Provider
          value={{
            supplyNOM: BigNumber(0),
            blockNumber: BigNumber(0),
            currentETHPrice: BigNumber(0),
            currentNOMPrice: BigNumber(0),
            NOMallowance: BigNumber(0),
            strongBalance: BigNumber(0),
            weakBalance: BigNumber(0),
            theme: darkNew,
            ...contextValues,
          }}
        >
          <UpdateExchangeContext.Provider
            value={{ objDispatch: jest.fn(), strDispatch: jest.fn(), setInputPending: false, ...contextValues }}
          >
            <ExchangeContext.Provider
              value={{
                askAmount: BigNumber(0),
                bidAmount: BigNumber(0),
                bidDenom: 'strong',
                status: 'Not Approved',
                strong: 'ETH',
                weak: 'NOM',
                ...contextValues,
              }}
            >
              <ModalContext.Provider
                value={{ handleModal: jest.fn(), modal: false, modalContent: 'Modal Content', ...contextValues }}
              >
                <Component {...props} />
              </ModalContext.Provider>
            </ExchangeContext.Provider>
          </UpdateExchangeContext.Provider>
        </ChainContext.Provider>
      </ApolloProvider>
    </ThemeProvider>,
  );
};
