export const {
  REACT_APP_ETHERSCAN_API_KEY = '3CVJBSFD6KVNBTNFCBN2T2QHRVYP1K81YB',
  REACT_APP_GRAPHQL_ENDPOINT = 'https://api.thegraph.com/subgraphs/name/onomyprotocol/ograph-devnet',
  REACT_APP_CHAIN_ID = 'onomy-devnet-1',
  REACT_APP_CHAIN_NAME = 'Onomy Devnet 1',
  REACT_APP_ONOMY_RPC_URL = 'https://rpc-devnet.onomy.io/',
  REACT_APP_ONOMY_REST_URL = 'https://rest-devnet.onomy.io/',
  REACT_APP_ONOMY_WS_URL = 'wss://rpc-devnet.onomy.io',
  REACT_APP_ETH_WS_URL = 'wss://ws-eth-goerli.onomy.io',
  REACT_APP_BONDING_NOM_CONTRACT_ADDRESS = '0xD179c5BEd30cADE4E62d53DD89240745Fb4C0CC2',
  REACT_APP_WNOM_CONTRACT_ADDRESS = '0x8EFe26D6839108E831D3a37cA503eA4F136A8E73',
  REACT_APP_GRAVITY_CONTRACT_ADDRESS = '0x18619DE15bDd14b0360e82e2746aAf77B17b3925',
  REACT_APP_SHOW_BRIDGED_NOM = false,
} = process.env;

export const DENOM = 'anom';
export const COIN_DENOM = 'NOM';
export const COIN_DENOM_DECIMALS = 18;
export const BLOCKS_TO_WAIT_FOR_BRIDGE = parseInt(
  process.env.REACT_APP_BLOCKS_TO_WAIT_FOR_BRIDGE || '35',
  10
);

export const KEPLR_CONFIG = {
  features: ['stargate', 'no-legacy-stdTx'],

  // Chain-id of the Cosmos SDK chain.
  chainId: REACT_APP_CHAIN_ID,
  chainName: REACT_APP_CHAIN_NAME,
  rpc: REACT_APP_ONOMY_RPC_URL,
  rest: REACT_APP_ONOMY_REST_URL,
  stakeCurrency: {
    // Coin denomination to be displayed to the user.
    coinDenom: COIN_DENOM,
    // Actual denom (i.e. uatom, uscrt) used by the blockchain.
    coinMinimalDenom: DENOM,
    coinDecimals: COIN_DENOM_DECIMALS,
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
      coinDenom: COIN_DENOM,
      coinMinimalDenom: DENOM,
      coinDecimals: COIN_DENOM_DECIMALS,
    },
  ],
  feeCurrencies: [
    {
      coinDenom: COIN_DENOM,
      coinMinimalDenom: DENOM,
      coinDecimals: COIN_DENOM_DECIMALS,
    },
  ],
  coinType: 118,
  gasPriceStep: {
    low: 0.01,
    average: 0.025,
    high: 0.04,
  },
};
