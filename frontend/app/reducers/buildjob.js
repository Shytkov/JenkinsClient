// @flow
import update from 'react-addons-update';
import * as ActionsHome from '../actions/home';
import * as Actions from '../actions/buildjob';

const defaultState = {
  parameters: [],
  loading: false,
  job: null
};


const buildJob = (state, action: actionType) => {

  console.log('BUILD_JOB', action);
  const job = action.payload;
  return {
    ...state,
    job };
}

const loadParameters = (state) => {

  return {
    ...state,
    loading: true
  }
}

const loadParametersDone = (state, action: actionType) => {

  return {
    ...state,
    loading: false,
    parameters: action.payload
  }
}

const parameterChanged = (state, action: actionType) => {

  const {
    parameter,
    value
  } = action.payload;

  console.log(parameter, value);

  const index = state.parameters.indexOf(parameter);
  if(index < 0)
    return state;

  const updated = update(state.parameters, {[index]: {Value: {$set: value}}})

  return {
    ...state,
    parameters: updated
  };
}

export default function buildjob(
  state = defaultState,
  action: actionType) {

  console.log('buildjob Reducer', action);

  switch (action.type) {
    case ActionsHome.BUILD_JOB:
      return buildJob(state, action);
    case Actions.LOAD_JOB_PARAMETERS:
      return loadParameters(state);
    case Actions.LOAD_JOB_PARAMETERS_DONE:
      return loadParametersDone(state, action);
    case Actions.PARAMETER_CHANGED:
      return parameterChanged(state, action);
    default:
      return state;
  }
}
