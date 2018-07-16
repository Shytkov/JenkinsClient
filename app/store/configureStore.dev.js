import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { createHashHistory } from 'history';
import { routerMiddleware, routerActions } from 'react-router-redux';
import axios from 'axios';
import axiosMiddleware from 'redux-axios-middleware';
import { createLogger } from 'redux-logger';
import rootReducer from '../reducers';
import * as optionsActions from '../actions/options';
import type { storeStateType } from '../types/store';

const history = createHashHistory();

const crateLogger = (middleware) => {

    // Logging Middleware
    const logger = createLogger({
      level: 'info',
      collapsed: true
    });
  
    // Skip redux logs in console during the tests
    if (process.env.NODE_ENV !== 'test') {
      middleware.push(logger);
    }
}

const createEnhancers = () => {

    // Redux DevTools Configuration
    const actionCreators = {
      ...optionsActions,
      ...routerActions
    };
    // If Redux DevTools Extension is installed use it, otherwise use Redux compose
    /* eslint-disable no-underscore-dangle */
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
          // Options: http://zalmoxisus.github.io/redux-devtools-extension/API/Arguments.html
          actionCreators
        })
      : compose;

    return composeEnhancers;
    /* eslint-enable no-underscore-dangle */
}

// const createAxios = () => {

//   const client = axios.create({
//     baseURL:'http://localhost:5000/',
//     responseType: 'json'
//   });
//   return axiosMiddleware(client);
// }

const configureStore = (initialState?: storeStateType) => {
  // Redux Configuration
  const middleware = [];
  const enhancers = [];

  // Thunk Middleware
  middleware.push(thunk);
  // Logging Middleware
  crateLogger(middleware);
  // Router Middleware
  const router = routerMiddleware(history);
  middleware.push(router);

  const client = axios.create({
    baseURL:'http://localhost:5000/',
    responseType: 'json'
  });
  const ax = axiosMiddleware(client);
  middleware.push(ax);

  const composeEnhancers = createEnhancers();

  // Apply Middleware & Compose Enhancers
  enhancers.push(applyMiddleware(...middleware));
  const enhancer = composeEnhancers(...enhancers);

  // Create Store
  const store = createStore(rootReducer, initialState, enhancer);

  if (module.hot) {
    module.hot.accept(
      '../reducers',
      () => store.replaceReducer(require('../reducers')) // eslint-disable-line global-require
    );
  }

  return store;
};

export default { configureStore, history };
