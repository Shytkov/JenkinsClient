/* eslint global-require: 0, flowtype-errors/show-errors: 0 */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build-main`, this file is compiled to
 * `./app/main.prod.js` using webpack. This gives us some performance wins.
 *
 * @flow
 */
import { app, BrowserWindow, ipcMain, Tray, Menu } from 'electron';
import ChildProcess from 'child_process';
import os from 'os';
import path from 'path';
import axios from 'axios';

import MenuBuilder from './menu';
import * as Constants from './utils/Constants';


let mainWindow = null;
let tray = null;
let apiProcess = null;
let apiPort = 5100;

const DEBUG = process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (DEBUG) {
  require('electron-debug')();
  const path = require('path');
  const p = path.join(__dirname, '..', 'app', 'node_modules');
  require('module').globalPaths.push(p);
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];
  return Promise.all(extensions.map(name => installer.default(installer[name], forceDownload))).catch(console.log);
};

const getApiUrl = (port, func) => func ? `http://localhost:${port}/${func}` : `http://localhost:${port}`;

const startApi = (port) => {

  let apipath = '';
  if(DEBUG) {
    apipath = path.join(__dirname, '.\\dist\\netcoreapp2.0\\CoreApi.dll');
    if (os.platform() === 'darwin') {
      apipath = path.join(__dirname, './dist/netcoreapp2.0/CoreApi.dll');
    }
  }
  else {
    apipath = path.join(__dirname, '..\\..\\app\\dist\\netcoreapp2.0\\publish\\CoreApi.dll');
    if (os.platform() === 'darwin') {
      apipath = path.join(__dirname, '../../app/dist/netcoreapp2.0/publish/CoreApi.dll');
    }
  }
  console.log('START API:', apipath);
  return ChildProcess.spawn("dotnet", [apipath, "--server.urls", getApiUrl(port)]);
}

const stopApi = () => {
  if(apiProcess) {
    console.log("API STOP: pid=", apiProcess.pid);
    apiProcess.kill();
    //ChildProcess.spawn("taskkill", ["/pid", apiProcess.pid, '/f', '/t']);
  }
}

const ipcListener = (event, args) => {

  console.log('IPC RECEIVE:', args);

  if(args === Constants.INITIALIZE_API_CHANEL) {

    if(!apiProcess) {
      mainWindow.webContents.send(Constants.INITIALIZE_API_CHANEL, Constants.INITIALIZE_API_CHANEL_ERROR);
      return;
    }

    console.log("API PING: START");
    let waiting = false;
    let attempts = 5;
  
    mainWindow.webContents.send(Constants.INITIALIZE_API_CHANEL, Constants.INITIALIZE_API_CHANEL_START);
    let timer = setInterval(() => {
  
      if(waiting)
        return;

      attempts -= 1;
      if (attempts == 0)
        clearInterval(timer);
  
      waiting = true;
      const url = getApiUrl(apiPort, 'ping');
      axios.get(url)
      .then((result) => {
        clearInterval(timer);
        console.log('API PING: SUCCESS');
        mainWindow.webContents.send(Constants.INITIALIZE_API_CHANEL, Constants.INITIALIZE_API_CHANEL_DONE, getApiUrl(apiPort));
      })
      .catch((error) => {
        console.log('API PING: ERROR');
        waiting = false;
      });
  
    }, 500, 'pingApi');
  }


}

const setAppUserModelId = () => {

  const appUserModelId = 'com.squirrel.PavelShytkov.ElectronJenkins';
  console.log('SET APP ID:', appUserModelId)
  app.setAppUserModelId(appUserModelId);
}

const installTray = () => {

  const iconName = process.platform === 'win32' ? 'windows-icon.png' : 'iconTemplate.png'
  let iconPath = DEBUG ? path.join(__dirname, '..\\resources', iconName) : path.join(__dirname, '..\\', iconName)
  if (os.platform() === 'darwin') {
    iconPath = DEBUG ? path.join(__dirname, '../resources', iconName) : path.join(__dirname, '../', iconName)
  }

  console.log('INITIALIZE TRAY', iconPath);

  const trayInstance = new Tray(iconPath);
  const contextMenu = Menu.buildFromTemplate([
     { 
       label: 'Show', 
       click: (item, window, event) => {
         mainWindow.show();
       }
     },
     {
       label: 'Quit',
       click: (item, window, event) => {
        app.isQuiting = true;
        app.quit();
       }
     } 
  ]);
  trayInstance.setToolTip('Devart JenkinsClient');
  trayInstance.setContextMenu(contextMenu);

  trayInstance.on('click', () => {
    console.log('TRAY CLICK');
    mainWindow.show();
  });
  return trayInstance;
}

// Add event listeners...
app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('browser-window-created', () => {

  try {
    apiProcess = startApi(apiPort);
    console.log('API START: pid=', apiProcess.pid, apiPort);
    apiProcess.on('exit', (code) => {
      console.error(`API EXIT: ${code}`);
      apiProcess = null;
    });
  } 
  catch(error) {
    console.error(error);
  }
  ipcMain.on(Constants.INITIALIZE_API_CHANEL, ipcListener);
  console.log('IPC LISTENER SUBSCRIBED');
});

app.on('ready', async () => {

  if (DEBUG) {
    await installExtensions();
  }

  setAppUserModelId();
  if(!tray) tray = installTray();

  let options = {
    show: false,
    width: 500,
    height: 700,
    minWidth: 500,
    minHeight: 700,
    maximizable: false
  };

  if (DEBUG) {
    options = {
      show: false,
      width: 1400,
      height: 728
    }
  }
  mainWindow = new BrowserWindow(options);
  mainWindow.loadURL(`file://${__dirname}/app.html`);

  // @TODO: Use 'ready-to-show' event
  // https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', async () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }

    mainWindow.show();
    mainWindow.focus();
  });

  mainWindow.on('closed', () => {
    stopApi();
    mainWindow = null;
  });

  mainWindow.on('minimize', (event) => {
    event.preventDefault();
    mainWindow.hide();
  });
  
  mainWindow.on('close', (event) => {
    console.log('APP QUIT', app.isQuiting);
    if(!app.isQuiting){
      event.preventDefault();
      mainWindow.hide();
    }
    return false;
  });

  // if (DEBUG) {
    const menuBuilder = new MenuBuilder(mainWindow);
    menuBuilder.buildMenu();
  // }
});


