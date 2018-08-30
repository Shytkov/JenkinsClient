// @flow
import { ipcRenderer } from  'electron';
import { jobType } from "../types/home";
import * as Constants from '../utils/Constants';
import type { optionsStateType } from '../types/options';
import Api from "../utils/Api";
import * as Utils from '../utils/Utils';

export const RELOAD_JOBS = 'RELOAD_JOBS';
export const UPDATE_JOBS = 'UPDATE_JOBS';
export const UPDATE_JOBS_DONE = 'UPDATE_JOBS_DONE';
export const BUILD_JOB = 'BUILD_JOB';

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
    const notifications = [];
    let hasRedBuilds = false;

    jobs.forEach(job => {
      promises.push(
        Api.getJobAsync(job.name, job.url)
                  .then((response) => {
                    if(shouldNotify(job, response.data))
                      notifications.push({
                        name: job.name,
                        group: job.group,
                        url: response.data.LastBuild.Url,
                        number: response.data.LastBuild.Number,
                        status: response.data.LastBuild.Result
                      });
                      
                    if(!hasRedBuilds) hasRedBuilds = response.data.Color === 'red';

                    updatedJobs.push({
                      ...job,
                      joburl: response.data.Url,
                      color: response.data.Color,
                      health: response.data.Health,
                      building: response.data.Building,
                      lastBuild: response.data.LastBuild,
                    });
                    return null;
                  })
                  .catch((error) => {
                    updatedJobs.push({
                      ...job,
                      joburl: '',
                      color: '',
                      health: -1,
                      building: false,
                      lastBuild: null
                    });
                    console.error(error);
                  })
      );
    });


    Promise.all(promises).then(() => {
      dispatch(getUpdateJobsDoneAction(updatedJobs));
      notifications.forEach(notification => showNotification(notification));
      console.log('SEND TRAY', hasRedBuilds);
      ipcRenderer.send(Constants.MAIN_THREAD_CHANNEL, Constants.SET_TRAY, hasRedBuilds);

      return null;
    }).catch((error) => {
      console.log('Error: ', error);
    });
  }
}

export function buildJob(job: jobType, history) {
  return dispatch => {
    dispatch(getBuidJobAction(job));
    history.push('/buildjob');
  };
}

function showNotification(notification) {

  // url: response.data.LastBuild.Url,
  // number: response.data.LastBuild.Number,
  // status: response.data.LastBuild.Result
  // const appUserModelId = 'com.squirrel.PavelShytkov.ElectronJenkins';
  // let toast = new ToastNotification({
  //   appId: appUserModelId,
  //   template: `<toast><visual><binding template="ToastText01"><text id="1">%s</text></binding></visual></toast>`,
  //   strings: ['Hi!']
  // });
  // toast.on('click', () => console.log('Clicked!'));
  // toast.show();

  const icon = notification.status === 'SUCCESS' ? 'done1.png' : 'fire1.png';

  const notificationParams = {
    title: notification.status === 'SUCCESS' ? 'Successfull Build' : 'Failed Build',
    body: `${notification.group} -> ${notification.name}`,
    icon: Utils.getResource(icon),
    silent: true
  }
  // ipcRenderer.send(Constants.MAIN_THREAD_CHANNEL,
  //   Constants.SHOW_NOTIFICATION,
  //   notificationParams);
  new Notification(notificationParams.title, notificationParams);
}

function shouldNotify(job, updatedJobData) {

  if(!job.lastBuild) {
    return false;
  }
  return job.lastBuild.Result !== updatedJobData.LastBuild.Result;
}

function getUpdateJobsAction() {
  return {
    type: UPDATE_JOBS,
  };
}

function getBuidJobAction(job) {
  return {
    type: BUILD_JOB,
    payload: job
  };
}

function getUpdateJobsDoneAction(jobs) {
  return {
    type: UPDATE_JOBS_DONE,
    payload: jobs
  };
}