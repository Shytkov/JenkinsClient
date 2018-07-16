// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'reactstrap';
import Settins from 'react-feather/dist/icons/settings';
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
    this.forceUpdate = true;
    this.props.reloadJobs(this.props.options);
  }

  componentDidUpdate() {
    console.log('componentDidUpdate');
    if(this.props.jobs.length > 0 && !this.timerId) {
      this.props.updateJobs(this.props.jobs);
      this.startTimer(20000); // 20 sec
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
                  <Settins size={24} />
                </Link>
              </Col>
            </Row>
          </Container>
        </div>
        <HomeJobListContainer />
      </div>
    );
  }
}
