// @flow
import Api from "../utils/Api";

export const LOAD_JOB_PARAMETERS = 'LOAD_JOB_PARAMETERS';
export const LOAD_JOB_PARAMETERS_DONE = 'LOAD_JOB_PARAMETERS_DONE';
export const PARAMETER_CHANGED = 'PARAMETER_CHANGED';
export const BUILD_JOB = 'BUILD_JOB';

export function loadJobParameters(job) {

  return dispatch => {
    dispatch(getLoadJobParameters());

    Api.getJobParametersAsync(job.name, job.url)
      .then((response) => {
        dispatch(getLoadJobParametersDone(response.data))
        return null;
      }).catch((error) => {
        console.log('Error: ', error);
        dispatch(getLoadJobParametersDone(null))
      });
  }
}

export function parameterValueChanged(parameter, value) {
  return {
    type: PARAMETER_CHANGED,
    payload: {
      parameter,
      value
    }
  };
}

export function buildJob(job, params, history) {

  const parameters = [];
  params.forEach(param => {
    const name = param.Name;
    let value = '';
    if(typeof param.Value !== 'undefined' )
      value = param.Value;
    else if(param.DefaultValue)
      value = param.DefaultValue;

    parameters.push({
      key: name,
      value
    });
  });

  const sss = JSON.stringify(parameters);

  Api.buildJobAsync(job.name, job.url, sss)
    .then((response) => {
      console.log('buildJobAsync: ', response.data);
      return response.data;
    }).catch((error) => {
      console.log('Error: ', error);
    });

  history.push('/home');
  return {
    type: BUILD_JOB
  };
}

function getLoadJobParameters() {
  return {
    type: LOAD_JOB_PARAMETERS
  };
}

function getLoadJobParametersDone(parameters) {
  return {
    type: LOAD_JOB_PARAMETERS_DONE,
    payload: parameters
  };
}