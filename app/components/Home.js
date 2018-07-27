// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button } from 'reactstrap';

import Settings from 'react-feather/dist/icons/settings';
import Loader from 'react-feather/dist/icons/loader';


import HomeJobListContainer from '../containers/HomeJobListContainer'
import type { jobType } from '../types/home';
import type { optionsStateType } from '../types/options';

import styles from './Home.css';

type Props = {
  loading: boolean,
  jobs: Array<jobType>,
  options: optionsStateType,
  updateJobs: (jobs: Array<jobType>) => void,
  reloadJobs: (options: optionsStateType) => void
};

export default class Home extends Component<Props> {

  componentDidMount() {
    this.props.reloadJobs(this.props.options);

    // const notification = new ToastNotification({
    //   appId: 'com.devart.jenkinsclient',
    //   template: `<toast><visual><binding template="ToastText01"><text id="1">%s</text></binding></visual></toast>`,
    //   strings: ['Hi!']
    // });
    // notification.on('activated', () => console.log('Activated!'))
    // notification.show();

    
    // const notification1 = {
    //   title: 'Basic Notification',
    //   body: 'Short message part'
    // }
    // const myNotification = new window.Notification(notification1.title, notification1)
  }

  componentDidUpdate() {
    if(this.props.jobs.length > 0 && !this.timerId) {
      this.props.updateJobs(this.props.jobs);
      this.startTimer(30000); // 30 sec
    }
  }

  componentWillUnmount() {
    this.stopTimer();
  }

  startTimer(interval: number) {
    this.stopTimer();
    console.log('Start timer: ', interval);
    this.timerId = setInterval(this.timer.bind(this), interval);
  }

  stopTimer() {
    console.log('Stop timer');
    clearInterval(this.timerId);
  }

  timer() {
    if (this.props.loading)
      return;
    this.props.updateJobs(this.props.jobs);
  }

  // grant() {
  //   if(!window.Notification) {
  //     console.log('Notifications are not supported.');
  //   }
  //   else {
  //     Notification.requestPermission()
  //                 .then((permition) => {
  //                                        console.log('Notification permition:', permition);
  //                                      });
  //   }
  // }

  render() {
    let loading = '';
    if(this.props.loading) 
      loading = (
        <div className={styles.stateImage}>
          <Loader className={`${styles.loader} text-primary`} />
        </div>);

    return (
      <div>
        <div className="form-group">
          <Container className={`${styles.jobsContainer} container-fluid`}>
            <Row className='align-items-center'>
              <Col xs="auto"><span className={styles.header}>Jenkins Client</span></Col>
              <Col xs="auto">{loading}</Col>
              <Col>
                <Link className={`${styles.optionsButton}`} data-toggle="tooltip" data-placement="top" title="Open Settings" to="/options">
                  <Settings size={24} />
                </Link>
              </Col>
            </Row>
          </Container>
        </div>
        <HomeJobListContainer />
        {/* <Button onClick={this.grant}>Grant</Button>
        <Button onClick={this.notify}>Notify</Button> */}
      </div>
    );
  }
}
