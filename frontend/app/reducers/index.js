// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import options from './options';
import home from './home';
import loading from './loading';
import buildjob from './buildjob'

const rootReducer = combineReducers({
  options,
  home,
  loading,
  buildjob,
  router
});

export default rootReducer;
