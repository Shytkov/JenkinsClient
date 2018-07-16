// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import options from './options';
import home from './home';

const rootReducer = combineReducers({
  options,
  home,
  router
});

export default rootReducer;
