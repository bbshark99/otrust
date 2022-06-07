import { BigNumber } from 'bignumber.js';
import type { EthContractTransaction } from '@onomy/hub';

export interface ExchStringState {
  bidDenom: string;
  input: string;
  output: string;
  approve: string;
  status: string;
  strong: string;
  weak: string;
}

interface ExchStringSetPropertyAction {
  type: keyof ExchStringState;
  value: string;
}

interface ExchStringUpdateStateAction {
  type: 'update';
  value: Partial<ExchStringState>;
}

export type ExchStringAction = ExchStringSetPropertyAction | ExchStringUpdateStateAction;

function reducerCallback<V, S>(state: V, key: string, value: V, update: S) {
  switch (state) {
    case value:
      return update;
    default:
      update = {
        ...update,
        [key]: value,
      };
      return update;
  }
}

function bnReducerCallback<S>(state: BigNumber, key: string, value: any, update: S): S {
  if (!BigNumber.isBigNumber(value)) {
    throw new Error();
  }
  return reducerCallback(state, key, value, update);
}

export function exchStringReducer(
  state: ExchStringState,
  action: ExchStringAction
): ExchStringState {
  // console.log('Exchange String Reducer State: ', state);
  // console.log('Exchange String Reducer Action: ', action);
  let update = state;
  try {
    switch (action.type) {
      case 'bidDenom':
        update = reducerCallback(state[action.type], action.type, action.value, update);
        break;
      case 'input':
        update = reducerCallback(state[action.type], action.type, action.value, update);
        break;
      case 'output':
        update = reducerCallback(state[action.type], action.type, action.value, update);
        break;
      case 'approve':
        update = reducerCallback(state[action.type], action.type, action.value, update);
        break;
      case 'status':
        update = reducerCallback(state[action.type], action.type, action.value, update);
        break;
      case 'strong':
        update = reducerCallback(state[action.type], action.type, action.value, update);
        break;
      case 'weak':
        update = reducerCallback(state[action.type], action.type, action.value, update);
        break;
      case 'update':
        // eslint-disable-next-line
        for (const [key, value] of Object.entries(action.value)) {
          try {
            switch (key) {
              case 'bidDenom':
                update = reducerCallback(state[key], key, value, update);
                break;
              case 'input':
                update = reducerCallback(state[key], key, value.toString(), update);
                break;
              case 'output':
                update = reducerCallback(state[key], key, value, update);
                break;
              case 'approve':
                update = reducerCallback(state[key], key, value, update);
                break;
              case 'status':
                update = reducerCallback(state[key], key, value, update);
                break;
              case 'strong':
                update = reducerCallback(state[key], key, value, update);
                break;
              case 'weak':
                update = reducerCallback(state[key], key, value, update);
                break;
              default:
                throw new Error('Unexpected default case');
            }
          } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e);
          }
        }
        break;
      default:
        throw new Error('Unexpected default case');
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  }
  return {
    ...update,
  };
}

export interface ExchObjState {
  askAmount: BigNumber;
  bidAmount: BigNumber;
  approveAmount: BigNumber;
  pendingTx: EthContractTransaction | null;
  slippage: BigNumber;
  txPending: boolean;
}

interface ExchObjSetPropertyAction {
  type: keyof ExchObjState;
  value: ExchObjState[keyof ExchObjState];
}

interface ExchObjUpdateStateAction {
  type: 'update';
  value: Partial<ExchObjState>;
}

export type ExchObjAction = ExchObjSetPropertyAction | ExchObjUpdateStateAction;

export function exchObjReducer(state: ExchObjState, action: ExchObjAction): ExchObjState {
  // console.log("Exchange Obj Reducer State: ", state)
  // console.log("Exchange Obj Reducer State Action: ", action)
  let update = state;

  try {
    switch (action.type) {
      case 'askAmount':
        update = bnReducerCallback(state[action.type], action.type, action.value, update);
        break;
      case 'bidAmount':
        update = bnReducerCallback(state[action.type], action.type, action.value, update);
        break;
      case 'approveAmount':
        update = bnReducerCallback(state[action.type], action.type, action.value, update);
        break;
      case 'pendingTx':
        update = reducerCallback(state[action.type], action.type, action.value, update);
        break;
      case 'slippage':
        update = bnReducerCallback(state[action.type], action.type, action.value, update);
        break;
      case 'txPending':
        update = reducerCallback(state[action.type], action.type, action.value, update);
        break;
      case 'update':
        // eslint-disable-next-line
        for (const [key, value] of Object.entries(action.value)) {
          try {
            if (state[key as keyof ExchObjState]) {
              switch (key) {
                case 'askAmount':
                  update = bnReducerCallback(state[key], key, value, update);
                  break;
                case 'bidAmount':
                  update = bnReducerCallback(state[key], key, value, update);
                  break;
                case 'approveAmount':
                  update = bnReducerCallback(state[key], key, value, update);
                  break;
                case 'pendingTx':
                  update = reducerCallback(state[key], key, value, update);
                  // console.log('Pending Tx Update: ', update);
                  break;
                case 'slippage':
                  update = bnReducerCallback(state[key], key, value, update);
                  break;
                case 'txPending':
                  update = reducerCallback(state[key], key, value, update);
                  break;
                default:
                  throw new Error('Unexpected default case');
              }
            }
          } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e);
          }
        }
        break;
      default:
        throw new Error('Unexpected default case');
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  }

  return {
    ...update,
  };
}
