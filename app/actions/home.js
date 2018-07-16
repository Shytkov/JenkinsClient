// @flow
import { jobType } from "../types/home";
import type { optionsStateType } from '../types/options';
import JenkinsApi from "../utils/JenkinsApi";

export const RELOAD_JOBS = 'RELOAD_JOBS';
export const UPDATE_JOBS = 'UPDATE_JOBS';
export const UPDATE_JOBS_DONE = 'UPDATE_JOBS_DONE';


export function reloadJobs(options: optionsStateType) {
  return {
    type: RELOAD_JOBS,
    payload: options
  };
}

export function updateJobs(jobs: Array<jobType>) {
  return dispatch => {
    dispatch(getUpdateJobsAction());

    const updatedJobs = [];
    const promises = [];

    jobs.forEach(job => {
      const jenkinsApi = new JenkinsApi(job.url);
      promises.push(
        jenkinsApi.getJobAsync(job.name)
                  .then((response) => {
                    updatedJobs.push({
                      ...job,
                      joburl: response.data.Url,
                      color: response.data.Color,
                      health: response.data.Health,
                      building: response.data.Building
                    });
                    return null;
                  })
                  .catch(() => {
                    updatedJobs.push({
                      ...job,
                      joburl: '',
                      color: '',
                      health: -1,
                      building: false,
                    });
                  })
      );
    });
    Promise.all(promises).then(() => {
      dispatch(getUpdateJobsDoneAction(updatedJobs));
      return null;
    }).catch((error) => {
      console.log('Error: ', error);
    });
  }
}

function getUpdateJobsAction() {
  return {
    type: UPDATE_JOBS,
  };
}

function getUpdateJobsDoneAction(jobs) {
  return {
    type: UPDATE_JOBS_DONE,
    payload: jobs
  };
}