// @flow
// import update from 'react-addons-update';
import * as Actions from '../actions/home';

import type { actionType } from '../types/basic';
import type { homeStateType } from '../types/home';

const defaultState = {
  loading: false,
  jobs: []
}

const reloadJobs = (state: homeStateType, action: actionType) => {
  const {
    urls
  } = action.payload;

  if(!urls)
    return state;

  const jobs = [];

  urls.forEach(url => {
    url.jobs.forEach(job => {
      if(job.included) jobs.push(
        {
          id: job.id,
          name: job.name,
          group: url.name,
          url: url.url,
          color: '',
          joburl: '',
          health: -1,
          building: false,
        }
      );
    });
  });

  return {
    ...state,
    jobs
  };
}

const updateJobs = (state: homeStateType, action: actionType) => {

  return {
    ...state,
    loading: true
  }
}

const updateJobsDone = (state: homeStateType, action: actionType) => {

  const newJobs = action.payload;
  return {
    ...state,
    jobs: newJobs,
    loading: false
  }
}

export default function homeReducer(
  state: homeStateType = defaultState,
  action: actionType
) {
  console.log('Home Reducer', action);
  switch (action.type) {
    case Actions.RELOAD_JOBS:
      return reloadJobs(state, action);
    case Actions.UPDATE_JOBS:
      return updateJobs(state, action);
    case Actions.UPDATE_JOBS_DONE:
      return updateJobsDone(state, action);
    default:
      return state;
  }
}
