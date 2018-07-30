import path from 'path';
import os from 'os';

module.exports = {

  validateUrl(value) {
    return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value);
  },

  groupBy(list, keyGetter) {
    const map = new Map();
    list.forEach((item) => {
        const key = keyGetter(item);
        const collection = map.get(key);
        if (!collection) {
            map.set(key, [item]);
        } else {
            collection.push(item);
        }
    });
    return map;
  },

  getId () {
    return '_' + Math.random().toString(36).substr(2, 9);
  },

  getDebugResourcePath() {

    let dir = __dirname;
    while(true) {
      dir = path.join(dir, '../');
      if(dir.endsWith('frontend\\') || dir.length < 10)
        break;
    }
    return path.join(dir, './resources');
  },

  getReleaseResourcePath(appInstance=null) {

    console.log('getReleaseResourcePath')
    let app = appInstance;
    if(!app) {
      app = require('electron').remote.app;
    }

    let dir = app.getAppPath();
    console.log('getReleaseResourcePath', dir)
    while(true) {
      dir = path.join(dir, '../')
      if(dir.endsWith('resources\\') || dir.length < 10)
        break;
    }
    return dir;
  },

  

  getResource(name) {
    const DEBUG = process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';
    if(DEBUG) {
      return path.join(this.getDebugResourcePath(), name);
    }
    return path.join(this.getReleaseResourcePath(), name);
  },

  getResourceMain(name, app) {
    const DEBUG = process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';
    if(DEBUG) {
      return this.getResource(name);
    }
    return path.join(this.getReleaseResourcePath(app), name);
  }
};