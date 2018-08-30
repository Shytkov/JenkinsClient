// @flow
import { shell } from 'electron';

import React, { Component } from 'react';
import { Container, Row, Col, Badge, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import * as Icon from 'react-feather';

import Utils from '../utils/Utils';
import styles from './HomeJobList.css';

type Props = {
  jobs: Array<jobType>,
  onBuild: (job) => void
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

    const health = job.health;
    const healthTooltip = `${health}%`;
    if (health < 0)
      return <div className={styles.healthImage} />;

    if (health >= 0 && health < 30)
      return <div data-toggle="tooltip" data-placement="top" title={healthTooltip}><Icon.CloudRain className='text-secondary' /></div>;
    if (health >= 30 && health <= 40)
      return <div data-toggle="tooltip" data-placement="top" title={healthTooltip}><Icon.CloudDrizzle className='text-secondary' /></div>;
    if (health > 40 && health <= 60)
      return <div data-toggle="tooltip" data-placement="top" title={healthTooltip}><Icon.Cloud className='text-info' /></div>;
    return <div data-toggle="tooltip" data-placement="top" title={healthTooltip}><Icon.Sun className='text-warning' /></div>;
  }

  buildClick(job: jobType) {
    this.props.onBuild(job);
  }

  renderItem(item) {
    const job = item;
    const state = this.renderState(job);
    const health = this.renderHealth(job);

    let building = '';
    if (job.building)
      building = <Badge className={`${styles.building} badge-info vcenter`}>Building</Badge>;

    const buildButton = job.color === '' ? '' : <Button className={`${styles.buildButton}`} color="link" onClick={() => this.buildClick(item)}><Icon.PlayCircle size={24} /></Button>

    let title = job.name;
    if (job.joburl)
      title = <a href={job.joburl} onClick={this.handleUrl}>{job.name}</a>

    return (
      <Row key={job.id}>
        <Col xs="auto">{state}</Col>
        <Col xs="auto">{health}</Col>
        <Col className={styles.valigncenter}>{title}</Col>
        <Col className={styles.valigncenter}>{building}</Col>
        <Col xs="auto">{buildButton}</Col>
      </Row>
    );
  }

  renderGroup(jobs, group) {
    if (group.length === 0)
      return;

    const sorted = jobs.sort((a, b) => {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
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
    if (!this.props.jobs)
      return <div>No items</div>;
    const groups = Utils.groupBy(this.props.jobs, key => key.group);
    const groupsAsc = new Map([...groups.entries()].sort());
    const groupContent = [];
    groupsAsc.forEach((jobs, group) => groupContent.push(this.renderGroup(jobs, group)));
    return <div>{groupContent.map(item => item)}</div>;
  }
}