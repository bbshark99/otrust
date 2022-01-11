import {
  boolReducerCallback,
  bnReducerCallback,
  objReducerCallback,
  stringReducerCallback,
} from 'context/reducerCallback';

export function exchStringReducer(state, action) {
  // console.log('Exchange String Reducer State: ', state);
  // console.log('Exchange String Reducer Action: ', action);
  let update = state;
  try {
    switch (action.type) {
      case 'bidDenom':
        update = stringReducerCallback(state[action.type], action.type, action.value, update);
        break;
      case 'input':
        update = stringReducerCallback(state[action.type], action.type, action.value, update);
        break;
      case 'output':
        update = stringReducerCallback(state[action.type], action.type, action.value, update);
        break;
      case 'approve':
        update = stringReducerCallback(state[action.type], action.type, action.value, update);
        break;
      case 'status':
        update = stringReducerCallback(state[action.type], action.type, action.value, update);
        break;
      case 'strong':
        update = stringReducerCallback(state[action.type], action.type, action.value, update);
        break;
      case 'weak':
        update = stringReducerCallback(state[action.type], action.type, action.value, update);
        break;
      case 'update':
        // eslint-disable-next-line no-restricted-syntax
        for (const [key, value] of action.value.entries()) {
          try {
            switch (key) {
              case 'bidDenom':
                update = stringReducerCallback(state[key], key, value, update);
                break;
              case 'input':
                update = stringReducerCallback(state[key], key, value.toString(), update);
                break;
              case 'output':
                update = stringReducerCallback(state[key], key, value, update);
                break;
              case 'approve':
                update = stringReducerCallback(state[key], key, value, update);
                break;
              case 'status':
                update = stringReducerCallback(state[key], key, value, update);
                break;
              case 'strong':
                update = stringReducerCallback(state[key], key, value, update);
                break;
              case 'weak':
                update = stringReducerCallback(state[key], key, value, update);
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

  if (update) {
    // console.log('Exchange String Update: ', update);
    return {
      ...update,
    };
  }
}

export function exchObjReducer(state, action) {
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
        update = objReducerCallback(state[action.type], action.type, action.value, update);
        break;
      case 'slippage':
        update = bnReducerCallback(state[action.type], action.type, action.value, update);
        break;
      case 'txPending':
        update = boolReducerCallback(state[action.type], action.type, action.value, update);
        break;
      case 'update':
        // eslint-disable-next-line no-restricted-syntax
        for (const [key, value] of action.value.entries()) {
          try {
            if (state[key]) {
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
                  update = objReducerCallback(state[key], key, value, update);
                  // console.log('Pending Tx Update: ', update);
                  break;
                case 'slippage':
                  update = bnReducerCallback(state[key], key, value, update);
                  break;
                case 'txPending':
                  update = boolReducerCallback(state[key], key, value, update);
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

  if (update) {
    // console.log('Exchange Obj Reducer Update: ', update);
    return {
      ...update,
    };
  }
}
