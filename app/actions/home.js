// @flow
// import {ToastNotification, Template} from 'electron-windows-notifications';
import path from 'path';
import { jobType } from "../types/home";
import type { optionsStateType } from '../types/options';
import Api from "../utils/Api";

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
    const notifications = [];

    jobs.forEach(job => {
      promises.push(
        Api.getJobAsync(job.name, job.url)
                  .then((response) => {
                    if(shouldNotify(job, response.data))
                      notifications.push({
                        name: job.name,
                        url: response.data.LastBuild.Url,
                        number: response.data.LastBuild.Number,
                        status: response.data.LastBuild.Result
                      });

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
      return null;
    }).catch((error) => {
      console.log('Error: ', error);
    });
  }
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
  const notificationParams = {
    title: notification.status === 'SUCCESS' ? 'Successfull Build' : 'Failed Build',
    body: notification.name,
    icon: path.join(__dirname, notification.status === 'SUCCESS' ? '../resources/success1.png' : '../resources/failed1.png')
  }
  const toast = new Notification(notificationParams.title, notificationParams);
  // toast.on('click', () => {
  //   console.log('Click');
  // });

  //  let strings = ['Hi from Electron'];
  //  let template = new Template({
  //    templateText: '<text>%s</text>'
  //  });

  // let notification = new ToastNotification({
  //   appId: 'com.squirrel.PavelShytkov.ElectronJenkins',
  //   template: template.getXML(),
  //   strings: strings
  // })
  // notification.on('activated', () => console.log('Activated!'))
  // notification.show();
}

function shouldNotify(job, updatedJobData) {

  if(!job.lastBuild) {
    return false;
  }
  return job.lastBuild.Result != updatedJobData.LastBuild.Result;
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