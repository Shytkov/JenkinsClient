// @flow
import React, { Component } from 'react';
import {
  Card,
  CardBody,
  CardTitle,
  Alert,
  CardSubtitle } from 'reactstrap';

import Trash from 'react-feather/dist/icons/trash';
import type { optionsUrlType } from '../types/options';
import OptionsJobList from './OptionsJobList'
import styles from './OptionsUrlListItem.css';


type Props = {
  item: optionsUrlType,
  load: () => void,
  delete: () => void,
  checkChanged: (jobIndex: number) => void
};

export default class OptionsUrlListItem extends Component<Props> {

  componentDidMount() {
    if(this.props.item.jobs.length === 0)
      this.props.load();
  }

  render() {
    let subTitle = this.props.item.loading ? 'Loading...' : this.props.item.url;
    let content = <OptionsJobList jobs={this.props.item.jobs} checkChanged={this.props.checkChanged} />;
    if (this.props.item.error) {
      subTitle = '';
      content = <Alert className={styles.errorText} color="warning">{this.props.item.error}</Alert>;
    }

    return (
      <Card className={styles.urlCard}>
        <CardBody>
          <CardTitle> 
            <span className={styles.cardTitle}>{this.props.item.name}</span>
            <span
              className={`btn btn-light ${styles.closeButton}`}
              title="person"
              aria-hidden="true"
              onClick={this.props.delete}
            >
              <Trash />
            </span>
          </CardTitle>
          <CardSubtitle>{subTitle}</CardSubtitle>
          <div className={styles.urlContent}>
            {content}
          </div>
        </CardBody>
      </Card>
    );
  }
}