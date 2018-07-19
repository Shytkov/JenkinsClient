// @flow
import { ipcRenderer } from  'electron';
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
  setTimeout(() => {
    console.log('send to main', Constants.INITIALIZE_API_CHANEL);
    ipcRenderer.send(Constants.INITIALIZE_API_CHANEL, Constants.INITIALIZE_API_CHANEL);
  }, 500, 'initialize_api');

  return {
    type: PING_API
  };
}

export function loadOptions() {
  return {
    type: LOAD_OPTIONS,
    payload: Options.loadOptions()
  };
}