import JenkinsApi from "../utils/JenkinsApi";

// @flow
export const ADD_URL = 'ADD_URL';
export const DELETE_URL = 'DELETE_URL';
export const LOAD_JOBS = 'LOAD_JOBS';
export const LOAD_JOBS_SUCCESS = 'LOAD_JOBS_SUCCESS';
export const LOAD_JOBS_FAILURE = 'LOAD_JOBS_FAILURE';
export const JOB_CHECK_CHANGED = 'JOB_CHECK_CHANGED';

export function addUrl(url: string) {
  return {
    type: ADD_URL,
    payload: url
  };
}

export function deleteUrl(i: number) {
  return {
    type: DELETE_URL,
    payload: i
  };
}

export function loadJobs(url: string, index: number) {

  return dispatch => {
    dispatch(getLoadJobsAction(index));
    let name = url;
    const jenkinsApi = new JenkinsApi(url);
    jenkinsApi.getMasterAsync()
              .then((response) => {
                name = response.data.Name;
                return jenkinsApi.getJobsAsync();
              })
              .then((response) => {
                dispatch(getLoadJobsSuccessAction(index, name, response.data))
                return null;
              })
              .catch((error) => {
                dispatch(getLoadJobsFailureAction(index, error))
              });
  };
}

export function jobCheckChanged(url: optionsUrlType, jobIndex: number) {
  return {
    type: JOB_CHECK_CHANGED,
    payload: {
      url,
      jobIndex
    }
  };
}

function getLoadJobsAction(index: number) {
  return {
    type: LOAD_JOBS,
    payload: index
  };
}

function getLoadJobsSuccessAction(index: number, name: string, data) {
  return {
    type: LOAD_JOBS_SUCCESS,
    payload: {
      index,
      name,
      data
    }
  };
}

function getLoadJobsFailureAction(index: number, error) {
  return {
    type: LOAD_JOBS_FAILURE,
    payload: {
      index,
      error
    }
  };
}