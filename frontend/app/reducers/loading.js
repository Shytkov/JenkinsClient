// @flow
import * as Actions from '../actions/loading'
let defaultState = {
};

export default function loadingReducer(
  state = defaultState,
  action: actionType) {

  console.log('Loading Reducer', action);

  switch (action.type) {
    case Actions.LOAD_OPTIONS:
    break;
  }

  return state;
}