// @flow
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { createHashHistory } from 'history';
import { routerMiddleware } from 'react-router-redux';
import axios from 'axios';
import axiosMiddleware from 'redux-axios-middleware';
import rootReducer from '../reducers';
import type { storeStateType } from '../types/store';

const createAxios = () => {
  const client = axios.create({
    baseURL:'http://localhost:5000/',
    responseType: 'json'
  });
  return axiosMiddleware(client);
}

const history = createHashHistory();
const router = routerMiddleware(history);
const axiosClient = createAxios();
const enhancer = applyMiddleware(thunk, router, axiosClient);

function configureStore(initialState?: storeStateType) {
  return createStore(rootReducer, initialState, enhancer);
}

export default { configureStore, history };
