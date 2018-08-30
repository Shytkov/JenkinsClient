// @flow
import * as Actions from '../actions/loading'

const defaultState = {
};

export default function loadingReducer(
  state = defaultState,
  action: actionType) {

  console.log('Loading Reducer', action);
  return state;
}