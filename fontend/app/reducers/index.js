// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import options from './options';
import home from './home';
import loading from './loading';

const rootReducer = combineReducers({
  options,
  home,
  loading,
  router
});

export default rootReducer;
