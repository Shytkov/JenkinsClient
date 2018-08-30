/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { Switch, Route } from 'react-router';
import App from './containers/App';
import HomePage from './containers/HomePage';
import OptionsPage from './containers/OptionsPage';
import LoadingPage from './containers/LoadingPage';
import BuildJobPage from './containers/BuildJobPage';

export default () => (
  <App>
    <Switch>
      <Route path="/options" component={OptionsPage} />
      <Route path="/home" component={HomePage} />
      <Route path="/buildjob" component={BuildJobPage} />
      <Route path="/" component={LoadingPage} />
    </Switch>
  </App>
);
