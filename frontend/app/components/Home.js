// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'reactstrap';

import Settings from 'react-feather/dist/icons/settings';
import Loader from 'react-feather/dist/icons/loader';

import HomeJobListContainer from '../containers/HomeJobListContainer'
import Help from './Help';
import type { jobType } from '../types/home';
import type { optionsStateType } from '../types/options';

import styles from './Home.css';

type Props = {
  loading: boolean,
  jobs: Array<jobType>,
  options: optionsStateType,
  updateJobs: (jobs: Array<jobType>) => void,
  reloadJobs: (options: optionsStateType) => void,
  buildJob: (job: jobType) => void
};

export default class Home extends Component<Props> {

  componentDidMount() {
    this.props.reloadJobs(this.props.options);
  }

  componentDidUpdate() {
    if(this.props.jobs.length > 0 && !this.timerId) {
      this.props.updateJobs(this.props.jobs);
      this.startTimer(10000); // 10 sec
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

    let help = '';
    if(!this.props.jobs || this.props.jobs.length == 0)
        help = <Help />;

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
            {help}
          </Container>
        </div>
        <HomeJobListContainer onBuild={(job) => this.props.buildJob(job, this.props.history)} />
      </div>
    );
  }
}
