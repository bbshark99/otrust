import React, { useReducer, useEffect, createContext, useContext } from 'react';
import { useWeb3React } from '@web3-react/core';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import { BigNumber } from 'bignumber.js';

import { BondingCont, NOMCont } from 'context/chain/contracts';
import { reducer } from 'context/chain/ChainReducer';
import { REACT_APP_BONDING_NOM_CONTRACT_ADDRESS, REACT_APP_GRAPHQL_ENDPOINT } from 'constants/env';
// eslint-disable-next-line import/no-cycle
import { OnomyProvider } from './OnomyContext';

export const ChainContext = createContext();
export const useChain = () => useContext(ChainContext);

export const UpdateChainContext = createContext();
export const useUpdateChain = () => useContext(UpdateChainContext);

function ChainProvider({ theme, children }) {
  const { account, library } = useWeb3React();
  const bondContract = BondingCont(library);
  const NOMContract = NOMCont(library);
  const [state, dispatch] = useReducer(reducer, {
    blockNumber: new BigNumber(0),
    currentETHPrice: new BigNumber(0),
    currentNOMPrice: new BigNumber(0),
    NOMallowance: new BigNumber(0),
    strongBalance: new BigNumber(0),
    supplyNOM: new BigNumber(0),
    weakBalance: new BigNumber(0),
  });

  const client = new ApolloClient({
    uri: REACT_APP_GRAPHQL_ENDPOINT,
    cache: new InMemoryCache(),
  });

  useEffect(() => {
    // listen for changes on an Ethereum address
    async function onBlock(number) {
      if (state.blocknumber !== number) {
        try {
          await Promise.all([
            // Current ETH Price & Current NOM Price
            bondContract.buyQuoteETH((10 ** 18).toString()),
            // NOM Allowance
            NOMContract.allowance(account, REACT_APP_BONDING_NOM_CONTRACT_ADDRESS),
            // Strong Balance
            library.getBalance(account),
            // Supply NOM
            bondContract.getSupplyNOM(),
            // Weak Balance (May need to move these to Exchange)
            NOMContract.balanceOf(account),
            number,
            // UniSwap Pricing
            // UniSwapCont.getReserves(),
          ]).then(values => {
            let update = new Map();
            for (let i = 0; i < values.length; i += 1) {
              switch (i) {
                case 0:
                  update = update.set('currentETHPrice', new BigNumber(values[0].toString()));

                  update = update.set(
                    'currentNOMPrice',
                    new BigNumber(1).div(new BigNumber(values[0].toString()))
                  );
                  break;

                case 1:
                  update = update.set('NOMallowance', new BigNumber(values[1].toString()));
                  break;

                case 2:
                  update = update.set('strongBalance', new BigNumber(values[2].toString()));
                  break;

                case 3:
                  update = update.set('supplyNOM', new BigNumber(values[3].toString()));
                  break;

                case 4:
                  update = update.set('weakBalance', new BigNumber(values[4].toString()));
                  break;

                case 5:
                  update = update.set('blockNumber', new BigNumber(number.toString()));
                  break;
                default:
                  break;
              }
            }
            dispatch({ type: 'updateAll', value: update });
          });
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error('Failed Chain Promise', e);
        }
      }
    }

    library.on('block', onBlock);
    // remove listener when the component is unmounted
    return () => {
      library.removeListener('block', onBlock);
    };
    // trigger the effect only on component mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const contextValue = {
    ...state,
    client,
    library,
    theme,
  };

  return (
    <ApolloProvider client={client}>
      <UpdateChainContext.Provider value={dispatch}>
        <ChainContext.Provider value={contextValue}>
          <OnomyProvider>{children}</OnomyProvider>
        </ChainContext.Provider>
      </UpdateChainContext.Provider>
    </ApolloProvider>
  );
}

export default ChainProvider;
