// @flow
import React, { Component } from 'react';
import { ipcRenderer } from  'electron';
import { Link } from 'react-router-dom';
import * as Constants from '../utils/Constants';
import { resolve } from 'dns';

type Props = {
  goHome: (history) => void
};

export default class Loading extends Component<Props> {

  constructor() {
    super();
    this.ipcListenerHandler = this.ipcListener.bind(this);
  }

  componentDidMount() {
    ipcRenderer.on(Constants.INITIALIZE_API_CHANEL, this.ipcListenerHandler)

    this.setLoadingState('Initialize application...');
    this.pingAsync()
        .then(() => this.loadOptionsAsync())
        .then(() => this.goHome())
  }

  componentWillUnmount() {
    ipcRenderer.removeListener(Constants.INITIALIZE_API_CHANEL, this.ipcListenerHandler)
  }

  setLoadingState(message: string) {
    this.setState({
      loading: true,
      loadingText: message
    })
  }

  ipcListener(event, args) {
    console.log(event, args);
    if(args === Constants.INITIALIZE_API_CHANEL_START) {
      console.log("INITIALIZE API: START");
    }
    if(args === Constants.INITIALIZE_API_CHANEL_DONE) {
      console.log("INITIALIZE API: DONE");
    }
    if(args === Constants.INITIALIZE_API_CHANEL_ERROR) {
      this.errorText = 'Cannot start the application. Error: API initialization failed.';
      this.setLoadingState('Initialize API: Failed');
      console.error("INITIALIZE API: ERROR!");
    }
  }

  pingAsync() {
    this.setLoadingState('Initialize API...');
    return new Promise((resolve) => {
      this.props.pingApi();
      resolve();
    });
  }

  loadOptionsAsync() {
    this.setLoadingState('Load options...');
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log('LOAD OPTIONS');
        resolve(true);
      }, 2000);
    });
  }

  goHome() {
    // if(!this.props.errorText)
    //   this.props.goHome(this.props.history)
  }

  render() {
    const error = this.errorText ? this.errorText : '';

    if(this.state && this.state.loading)
      return (
        <div>
          <p>{this.state.loadingText}</p>
          <p>{this.errorText}</p>
        </div>);

    return ( <div>done...</div> );
  }
}
