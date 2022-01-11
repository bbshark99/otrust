import { isBigNumber } from 'bignumber.js';

function reducerCallback(state, key, value, update) {
  switch (state[key]) {
    case value:
      break;
    default:
      switch (true) {
        case isBigNumber(value):
          return {
            [key]: value,
            ...update,
          };
        default:
          throw new Error();
      }
  }
}

export function reducer(state, action) {
  let update;
  switch (action.type) {
    case 'updateAll':
      // eslint-disable-next-line no-restricted-syntax
      for (const [key, value] of action.value.entries()) {
        if (state[key]) {
          try {
            switch (key) {
              case 'currentETHPrice':
                update = reducerCallback(state[key], key, value, update);
                break;
              case 'currentNOMPrice':
                update = reducerCallback(state[key], key, value, update);
                break;
              case 'NOMallowance':
                update = reducerCallback(state[key], key, value, update);
                // console.log('Update NOM Allowance: ', update);
                break;
              case 'strongBalance':
                update = reducerCallback(state[key], key, value, update);
                break;
              case 'supplyNOM':
                update = reducerCallback(state[key], key, value, update);
                break;
              case 'weakBalance':
                update = reducerCallback(state[key], key, value, update);
                break;
              case 'blockNumber':
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
      }
      // console.log('ChainReducer Update: ', update);
      if (update) {
        return {
          ...update,
        };
      }
      break;
    default:
      throw new Error();
  }
}
