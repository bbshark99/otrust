import React, { createContext, useContext, useReducer, useState } from 'react';
import { BigNumber } from 'bignumber.js';

import {
  exchStringReducer,
  exchObjReducer,
  ExchStringState,
  ExchStringAction,
  ExchObjState,
  ExchObjAction,
} from 'context/exchange/ExchangeReducer';

type ExchangeContextType = ExchStringState & ExchObjState;
export const ExchangeContext = createContext<ExchangeContextType>(
  undefined as unknown as ExchangeContextType
);
export const useExchange = () => useContext(ExchangeContext);

interface UpdateExchangeContextType {
  objDispatch: React.Dispatch<ExchObjAction>;
  strDispatch: React.Dispatch<ExchStringAction>;
  setInputPending: React.Dispatch<React.SetStateAction<boolean>>;
}

export const UpdateExchangeContext = createContext<UpdateExchangeContextType>(
  undefined as unknown as UpdateExchangeContextType
);
export const useUpdateExchange = () => useContext(UpdateExchangeContext);

function ExchangeProvider({ children }: { children: React.ReactNode }) {
  const [inputPending, setInputPending] = useState(false);

  const [objState, objDispatch] = useReducer(exchObjReducer, {
    askAmount: new BigNumber(0),
    bidAmount: new BigNumber(0),
    approveAmount: new BigNumber(0),
    pendingTx: null,
    slippage: new BigNumber(0),
    txPending: false,
  });

  const [strState, strDispatch] = useReducer(exchStringReducer, {
    bidDenom: 'strong',
    input: '',
    output: '',
    approve: '',
    status: '',
    strong: 'ETH',
    weak: 'bNOM',
  });

  const contextValue = {
    ...objState,
    ...strState,
    inputPending,
  };

  const updateValue = {
    objDispatch,
    strDispatch,
    setInputPending,
  };

  return (
    <UpdateExchangeContext.Provider value={updateValue}>
      <ExchangeContext.Provider value={contextValue}>{children}</ExchangeContext.Provider>
    </UpdateExchangeContext.Provider>
  );
}

export default ExchangeProvider;
