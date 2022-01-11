import { StargateClient } from '@cosmjs/stargate';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { BigNumber } from 'bignumber.js';

import { useAsyncValue } from 'hooks/useAsyncValue';
import { useStateRef } from 'hooks/useStateRef';
import {
  REACT_APP_CHAIN_ID,
  REACT_APP_CHAIN_NAME,
  REACT_APP_ONOMY_REST_URL,
  REACT_APP_ONOMY_RPC_URL,
  REACT_APP_ONOMY_WS_URL,
} from 'constants/env';
// eslint-disable-next-line import/no-cycle
import { ChainContext } from './ChainContext';
import { format18 } from 'utils/math';

// This is lame, but can't find a way to subscribe to cosmos events
const POLLING_INTERVAL = 1000;
const DENOM = 'anom';
const DENOM_DECIMALS = 18;
const BLOCKS_TO_WAIT_FOR_BRIDGE = new BigNumber(14);

type BridgeTransactionInProgress = {
  startBalance: BigNumber;
  startEthBlock: BigNumber;
  expectedIncrease: BigNumber;
};

function useOnomyState() {
  const { blockNumber } = useContext<{ blockNumber: BigNumber }>(ChainContext);
  const [bridgedSupplyStr, setBridgedSupplyStr] = useState('');
  const blockNumRef = useRef(blockNumber);
  const keplrConnected = useRef(false);

  const hasKeplr = !!window.keplr;
  blockNumRef.current = blockNumber;
  const [address, setAddress, addressRef] = useStateRef('');
  const [amount, setAmount, amountRef] = useStateRef('0');
  const [bridgeTransactions, setBridgeTransactions] = useState<BridgeTransactionInProgress[]>([]);

  const bridgedSupply = useMemo(() => {
    if (!bridgedSupplyStr) return 0;
    const formated = format18(new BigNumber(bridgedSupplyStr));
    return formated.toNumber();
  }, [bridgedSupplyStr]);

  const addPendingBridgeTransaction = useCallback((expectedIncrease: BigNumber) => {
    const transaction = {
      startBalance: new BigNumber(amountRef.current),
      startEthBlock: blockNumRef.current,
      expectedIncrease,
    };
    setBridgeTransactions(t => [...t, transaction]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Clear any pending transactions that appear to have been processed
    const curBalance = new BigNumber(amount);
    const clearedTransactions = bridgeTransactions.filter(({ startBalance, expectedIncrease }) => {
      const expectedBalance = startBalance.plus(expectedIncrease);
      return curBalance.isGreaterThanOrEqualTo(expectedBalance);
    });
    setBridgeTransactions(pending => pending.filter(t => clearedTransactions.indexOf(t) === -1));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount]);

  const bridgeProgress = useMemo(() => {
    if (bridgeTransactions.length === 0) return null;
    const [{ startEthBlock }] = bridgeTransactions;
    const { startEthBlock: lastStartBlock } = bridgeTransactions.slice().pop()!;
    const expectedEndBlock = lastStartBlock.plus(BLOCKS_TO_WAIT_FOR_BRIDGE);
    const progressBlocks = blockNumber.minus(startEthBlock);
    const totalBlocks = expectedEndBlock.minus(startEthBlock);
    const progress = progressBlocks.dividedBy(totalBlocks).multipliedBy(100).toNumber();
    return Math.min(progress, 100);
  }, [blockNumber, bridgeTransactions]);

  const [stargate] = useAsyncValue(
    // useCallback(() => StargateClient.connect(`wss://${window.location.hostname}/tendermint`), []),
    useCallback(() => StargateClient.connect(REACT_APP_ONOMY_WS_URL), []),
    null
  );

  useEffect(() => {
    if (!stargate) return;

    async function updateBalance() {
      if (!addressRef.current || !stargate) return;
      try {
        const coin = await stargate.getBalance(addressRef.current, DENOM);
        setAmount(coin.amount);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn('Error fetching Onomy balance', e);
      }
    }

    updateBalance();
    const interval = setInterval(updateBalance, POLLING_INTERVAL);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stargate]);

  const connectKeplr = useCallback(async () => {
    if (keplrConnected.current) return;
    keplrConnected.current = true;
    try {
      if (window.keplr) {
        await window.keplr.experimentalSuggestChain({
          // Chain-id of the Cosmos SDK chain.
          chainId: REACT_APP_CHAIN_ID,
          // The name of the chain to be displayed to the user.
          chainName: REACT_APP_CHAIN_NAME,
          // RPC endpoint of the chain.
          rpc: REACT_APP_ONOMY_RPC_URL,
          // REST endpoint of the chain.
          rest: REACT_APP_ONOMY_REST_URL,
          stakeCurrency: {
            // Coin denomination to be displayed to the user.
            coinDenom: 'NOM',
            // Actual denom (i.e. uatom, uscrt) used by the blockchain.
            coinMinimalDenom: DENOM,
            // # of decimal points to convert minimal denomination to user-facing denomination.
            coinDecimals: DENOM_DECIMALS,
            // (Optional) Keplr can show the fiat value of the coin if a coingecko id is provided.
            // You can get id from https://api.coingecko.com/api/v3/coins/list if it is listed.
            // coinGeckoId: ""
          },
          bip44: {
            coinType: 118,
          },
          bech32Config: {
            bech32PrefixAccAddr: 'onomy',
            bech32PrefixAccPub: 'onomypub',
            bech32PrefixValAddr: 'onomyvaloper',
            bech32PrefixValPub: 'onomyvaloperpub',
            bech32PrefixConsAddr: 'onomyvalcons',
            bech32PrefixConsPub: 'onomyvalconspub',
          },
          currencies: [
            {
              coinDenom: 'NOM',
              coinMinimalDenom: DENOM,
              coinDecimals: DENOM_DECIMALS,
            },
          ],
          feeCurrencies: [
            {
              coinDenom: 'NOM',
              coinMinimalDenom: DENOM,
              coinDecimals: DENOM_DECIMALS,
            },
          ],
          coinType: 118,
          gasPriceStep: {
            low: 0.01,
            average: 0.025,
            high: 0.04,
          },
        });
        // Staking coin information
        await window.keplr.enable(REACT_APP_CHAIN_ID);
        if (!window.getOfflineSigner) throw new Error('No Offline Signer');
        const offlineSigner = window.getOfflineSigner(REACT_APP_CHAIN_ID);
        const accounts = await offlineSigner.getAccounts();
        setAddress(() => accounts[0].address);

        /*
        const tmclient = await Tendermint34Client.connect(COSMOS_WS);
        const txQuery = buildQuery({
          tags: [
            {
              key: 'action',
              value: 'send_to_cosmos_claim',
            },
          ],
        });
        const stream = tmclient.subscribeTx(txQuery);
        const stream = tmclient.subscribeNewBlock();
        stream.addListener({
          next: evt => console.log('tendermint-rpc', evt),
          error: err => console.error('tendermint error', err),
          complete: () => console.log('tendermint-rpc complete'),
        });
        */
      } else {
        // eslint-disable-next-line no-console
        console.error('Install keplr chrome extension');
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('keplr error', e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /*
  useEffect(() => {
    // Wait for kepler load
    const interval = setInterval(() => {
      if (window.keplr) {
        connectKeplr();
        clearInterval(interval);
      }
    }, 100);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  */

  const updateBridgedSupply = useCallback(async function () {
    const res = await fetch(`${REACT_APP_ONOMY_REST_URL}/cosmos/bank/v1beta1/supply/anom`);
    const json = await res.json();
    const val = json.amount.amount || '';
    setBridgedSupplyStr(val);
  }, []);

  useEffect(() => {
    updateBridgedSupply();
    const interval = setInterval(() => updateBridgedSupply(), POLLING_INTERVAL);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    address,
    amount,
    bridgedSupply,
    bridgeProgress,
    hasKeplr,
    setAddress,
    addPendingBridgeTransaction,
    connectKeplr,
  };
}

export type OnomyState = ReturnType<typeof useOnomyState>;

const DEFAULT_STATE: OnomyState = {
  address: '',
  amount: '0',
  bridgedSupply: 0,
  bridgeProgress: null,
  hasKeplr: false,
  connectKeplr: () => Promise.resolve(),
  setAddress: () => {},
  addPendingBridgeTransaction: () => {},
};

const OnomyContext = createContext(DEFAULT_STATE);

export function useOnomy() {
  const context = useContext(OnomyContext);
  context.connectKeplr();
  return context;
}

export function OnomyProvider({ children }: { children: JSX.Element | JSX.Element[] }) {
  const state = useOnomyState();

  return <OnomyContext.Provider value={state}>{children}</OnomyContext.Provider>;
}
