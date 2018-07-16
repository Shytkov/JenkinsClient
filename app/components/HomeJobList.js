// @flow
import { shell } from 'electron';

import React, { Component } from 'react';
import { Container, Row, Col, Badge } from 'reactstrap';
import * as Icon from 'react-feather';
import Utils from '../utils/Utils';
import styles from './HomeJobList.css';

// const { shell } = require('electron').shell;

type Props = {
  jobs: Array<jobType>
};

export default class HomeJobList extends Component<Props> {

  handleUrl(e) {
    e.preventDefault();
    shell.openExternal(e.target.href);
  }

  renderState(job) {

    if (job.color === '')
      return <Icon.MinusCircle className='text-muted' />;
    else if (job.color === 'red')
      return <Icon.XCircle className='text-danger' />;
    return <Icon.CheckCircle className='text-success' />;
  }

  renderHealth(job) {

    if (job.health < 0)
      return <div className={styles.healthImage} />;

    if (job.health > 0 && job.health <= 30)
      return <Icon.CloudLightning className='text-secondary' />;
    if (job.health > 30 && job.health <= 50)
      return <Icon.CloudRain className='text-secondary' />;
    if (job.health > 50 && job.health <= 70)
      return <Icon.Cloud className='text-info' />;
    return <Icon.Sun className='text-warning' />;
  }

  renderItem(item) {
    const job = item;
    const state = this.renderState(job);
    const health = this.renderHealth(job);

    let building = '';
    if (job.building)
      building = <Badge className={`${styles.building} badge-info`}>Building</Badge>;

    let title = job.name;
    if (job.joburl)
      title = <a href={job.joburl} onClick={this.handleUrl}>{job.name}</a>

    return (
      <Row key={job.id}>
        <Col xs="auto">{state}</Col>
        <Col xs="auto">{health}</Col>
        <Col>{title}</Col>
        <Col>{building}</Col>
      </Row>
    );
  }

  renderGroup(jobs, group) {
    if(group.length === 0)
      return;

    const sorted = jobs.sort((a, b) => {
      if(a.name < b.name) return -1;
      if(a.name > b.name) return 1;
      return 0;
    });

    return (
      <div key={group} className="form-group">
        <Container className={styles.jobsContainer}>
          <h5>{group}</h5>
          {sorted.map(item => this.renderItem(item))}
        </Container>
      </div>
    );
  }

  render() {
    if(!this.props.jobs)
      return <div>No items</div>;
    const groups = Utils.groupBy(this.props.jobs, key => key.group);
    const groupContent = [];
    groups.forEach((jobs, group) => groupContent.push(this.renderGroup(jobs, group)));
    return <div>{groupContent.map(item => item)}</div>;
  }
}