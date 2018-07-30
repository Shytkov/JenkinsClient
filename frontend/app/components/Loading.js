// @flow
import React, { Component } from 'react';
import { ipcRenderer } from  'electron';
import { Link } from 'react-router-dom';
import { Card, CardBody, CardTitle, CardSubtitle, CardText } from 'reactstrap';
import Api from '../utils/Api';
import * as Constants from '../utils/Constants';
import type { optionsStateType } from '../types/options';

type Props = {
  goHome: (history) => void,
  pingApi: () => void,
  loadOptions: () => void
};

export default class Loading extends Component<Props> {

  constructor() {
    super();
    this.ipcListenerHandler = this.ipcListener.bind(this);
  }

  componentDidMount() {
    ipcRenderer.on(Constants.MAIN_THREAD_CHANNEL, this.ipcListenerHandler)

    this.setLoadingState('Initialize application...');
    this.pingAsync();
  }

  componentWillUnmount() {
    ipcRenderer.removeListener(Constants.MAIN_THREAD_CHANNEL, this.ipcListenerHandler)
  }

  setLoadingState(message: string) {
    this.setState({
      loading: true,
      loadingText: message
    })
  }

  ipcListener(event, name, arg) {
    console.log(event, name, arg);

    if(name === Constants.INIT_API_START) {
      console.log("INITIALIZE API: START");
    }
    if(name === Constants.INIT_API_DONE) {
      console.log("INITIALIZE API: DONE");
      // const apiUrl = arg;
      // Api.initialize(apiUrl);

      this.loadOptionsAsync()
          .then(() => this.goHome())
    }
    if(name === Constants.INIT_API_ERROR) {
      this.errorText = 'Cannot start the application. Error: API initialization failed.';
      this.setLoadingState('Initialize API: Failed');
      console.error("INITIALIZE API: ERROR!");
    }
  }

  pingAsync() {
    return new Promise((resolve) => {
      this.setLoadingState('Initialize API...');
      setTimeout(() => {
        this.props.pingApi();
        resolve();
      }, 500);
    });
  }

  loadOptionsAsync() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.setLoadingState('Load options...');
        this.props.loadOptions();
        resolve();
      }, 500);
    });
  }

  goHome() {
    if(!this.props.errorText)
      this.props.goHome(this.props.history)
  }

  render() {
    const error = this.errorText ? (<CardText>{this.errorText}</CardText>) : '';

    if(this.state && this.state.loading)
      return (
        <Card>
          <CardBody>
            <CardTitle>Loading...</CardTitle>
            <CardSubtitle>{this.state.loadingText}</CardSubtitle>
            {error}
          </CardBody>
        </Card>);
    return ( '' );
  }
}
