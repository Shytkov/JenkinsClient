// @flow
import update from 'react-addons-update';
import * as Actions from '../actions/options';

import type { actionType } from '../types/basic';
import type { optionsStateType, optionsUrlType } from '../types/options';
import Utils from '../utils/Utils';

let defaultState;

const getDefaultState = () => {
  if(defaultState) {
    return defaultState;
  }

  defaultState = Actions.loadOptions();
  if(!defaultState) {
    defaultState = {
      urls: []
    };
  }

  return defaultState;
}

const addUrl = (state: optionsStateType, action: actionType) => {
  console.log("ADD_URL", action);
  const {
    urls
  } = state;

  const newUrl: optionsUrlType = {
    id: Utils.getId(),
    url: action.payload,
    name: action.payload,
    loading: false,
    error: '',
    jobs: []
  };
  return{
    ...state,
    urls: update(urls, {$push: [newUrl]})
  };
}

const deleteUrl = (state: optionsStateType, action: actionType) => {
  console.log("DELETE_URL", action);
  const {
    urls
  } = state;

  const index = action.payload;
  // urls.splice(index, 1);
  return {
    ...state,
    urls: update(urls, { $splice: [[index, 1]] })
  };
}

const loadJobs = (state: optionsStateType, action: actionType) => {
  const index = action.payload;
  return {
    ...state,
    urls: update(state.urls, {[index]: {loading: {$set: true}}})
  };
}

const loadJobsSuccess = (state: optionsStateType, action: actionType) => {
  const {
    index,
    name,
    data
  } = action.payload;

  const jobs = data.map(item => {
    return {
      id: Utils.getId(),
      included: true,
      name: item.Name
    };
  });

  return {
    ...state,
    urls: update(state.urls, {
      [index]: {
        name: {$set: name},
        loading: {$set: false},
        jobs: {$set: jobs}
      }
    })
  };
}

const loadJobsFailure = (state: optionsStateType, action: actionType) => {
  const {
    index,
    error
  } = action.payload;

  return {
    ...state,
    urls: update(state.urls, {
      [index]: {
        error: {$set: error.message},
        loading: {$set: false}
      }
    })
  };
}

const jobCheckChanged = (state: optionsStateType, action: actionType) => {
  const {
    url,
    jobIndex
  } = action.payload;
  const index = state.urls.indexOf(url);
  if(index < 0)
    return state;

  const includedState = !url.jobs[jobIndex].included;
  const jobs = update(url.jobs, {[jobIndex]: {included: {$set: includedState}}})

  return {
    ...state,
    urls: update(state.urls, {[index]: {jobs: {$set: jobs}}})
  };
}

export default function optionsReducer(
  state: optionsStateType = getDefaultState(),
  action: actionType
) {
  console.log('Options Reducer', action);

  switch (action.type) {
    case Actions.ADD_URL:
      return addUrl(state, action);
    case Actions.DELETE_URL:
      return deleteUrl(state, action);
    case Actions.LOAD_JOBS:
      return loadJobs(state, action);
    case Actions.LOAD_JOBS_SUCCESS:
      return loadJobsSuccess(state, action);
    case Actions.LOAD_JOBS_FAILURE:
      return loadJobsFailure(state, action);
    case Actions.JOB_CHECK_CHANGED:
      return jobCheckChanged(state, action);
    default:
      return state;
  }
}
