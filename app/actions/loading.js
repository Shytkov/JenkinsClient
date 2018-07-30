// @flow
import { ipcRenderer } from  'electron';
import thunk from 'redux-thunk';
import * as Constants from '../utils/Constants';
import * as Options from '../actions/options';


export const LOAD_OPTIONS = 'LOAD_OPTIONS';
export const PING_API = 'PING_API';
export const GO_HOME = 'GO_HOME';

export function goHome(history) {

  console.log("GO HOME");
  history.push('/home');
  return {
    type: GO_HOME
  };
}

export function pingApi() {
  console.log('send to main', Constants.MAIN_THREAD_CHANNEL);
  ipcRenderer.send(Constants.MAIN_THREAD_CHANNEL, Constants.INIT_API);
  return {
    type: PING_API
  };
}

export function loadOptions() {

  let options = Options.loadOptions();
  if(!options) options = null;
  return {
    type: LOAD_OPTIONS,
    payload: options
  };
}