import React from 'react';
import { ThemeProvider } from 'styled-components';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import { BigNumber } from 'bignumber.js';
import { BondingCurveContext } from '@onomy/react-hub';

import { darkNew } from 'theme/theme';
import { ExchangeContext, UpdateExchangeContext } from '../context/exchange/ExchangeContext';
import { ModalContext } from '../context/modal/ModalContext';

export const renderWithTheme = (Component, props, children) => {
  if (children) {
    return render(
      <MemoryRouter>
        <ThemeProvider theme={darkNew}>
          <Component {...props}>{children}</Component>
        </ThemeProvider>
      </MemoryRouter>
    );
  }
  return render(
    <MemoryRouter>
      <ThemeProvider theme={darkNew}>
        <Component {...props} />
      </ThemeProvider>
    </MemoryRouter>
  );
};

export function ThemeWrapper(Component, props, children) {
  return (
    <ThemeProvider theme={darkNew}>
      <Component {...props}>{children}</Component>
    </ThemeProvider>
  );
}

export function ChainContextWrapper(children, contextProps) {
  return (
    <BondingCurveContext.Provider
      value={{
        blockNumber: BigNumber(0),
        currentETHPrice: BigNumber(0),
        currentNOMPrice: BigNumber(0),
        NOMallowance: BigNumber(0),
        strongBalance: BigNumber(0),
        supplyNOM: BigNumber(0),
        weakBalance: BigNumber(0),
        ...contextProps,
      }}
    >
      {children}
    </BondingCurveContext.Provider>
  );
}

export function ExchangeContextWrapper(children, contextProps) {
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
}

export function UpdateExchangeContextWrapper(children, contextProps) {
  return (
    <UpdateExchangeContext.Provider
      value={{
        objDispatch: () => {},
        strDispatch: () => {},
        setInputPending: false,
        ...contextProps,
      }}
    >
      {children}
    </UpdateExchangeContext.Provider>
  );
}

export function ModalContextWrapper(children, contextProps) {
  return (
    <ModalContext.Provider
      value={{
        handleModal: () => {},
        modal: false,
        modalContent: 'Modal Content',
        ...contextProps,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export const renderWithContext = (Component, props, contextValues) => {
  return render(
    <ThemeProvider theme={darkNew}>
      <BondingCurveContext.Provider
        value={{
          supplyNOM: BigNumber(0),
          blockNumber: BigNumber(0),
          currentETHPrice: BigNumber(0),
          currentNOMPrice: BigNumber(0),
          NOMallowance: BigNumber(0),
          strongBalance: BigNumber(0),
          weakBalance: BigNumber(0),
          ...contextValues,
        }}
      >
        <UpdateExchangeContext.Provider
          value={{
            objDispatch: jest.fn(),
            strDispatch: jest.fn(),
            setInputPending: false,
            ...contextValues,
          }}
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
              value={{
                handleModal: jest.fn(),
                modal: false,
                modalContent: 'Modal Content',
                ...contextValues,
              }}
            >
              <Component {...props} />
            </ModalContext.Provider>
          </ExchangeContext.Provider>
        </UpdateExchangeContext.Provider>
      </BondingCurveContext.Provider>
    </ThemeProvider>
  );
};
