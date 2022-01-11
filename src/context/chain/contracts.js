import { Contract } from '@ethersproject/contracts';

import {
  REACT_APP_BONDING_NOM_CONTRACT_ADDRESS,
  REACT_APP_GRAVITY_CONTRACT_ADDRESS,
  REACT_APP_WNOM_CONTRACT_ADDRESS,
} from 'constants/env';

const NomContractJSON = require('./ERC20NOM.json');
const BondingContractJSON = require('./BondingNOM.json');
const UniswapContractJSON = require('./UniSwap.json');
const GravityContractJSON = require('./Gravity.json');

const uniswapUsdcAddress = '0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc';
/**
 * NOM ERC20 Contract instance
 */
export function NOMCont(library) {
  const ABI = NomContractJSON.abi;
  return new Contract(REACT_APP_WNOM_CONTRACT_ADDRESS, ABI, library?.getSigner());
}

/**
 * Haven Contract instance
 */
export function BondingCont(library) {
  const ABI = BondingContractJSON.abi;
  return new Contract(REACT_APP_BONDING_NOM_CONTRACT_ADDRESS, ABI, library?.getSigner());
}

/**
 * UniSwap Contract instance
 */
export function UniSwapCont(library) {
  const ABI = UniswapContractJSON;
  return new Contract(uniswapUsdcAddress, ABI, library?.getSigner());
}

export function GravityCont(library) {
  const ABI = GravityContractJSON.abi;
  return new Contract(REACT_APP_GRAVITY_CONTRACT_ADDRESS, ABI, library.getSigner());
}
