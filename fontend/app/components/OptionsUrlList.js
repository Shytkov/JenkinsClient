// @flow
import React, { Component } from 'react';
import type { optionsUrlType } from '../types/options';
import OptionsUrlListItem from './OptionsUrlListItem';

type Props = {
  urls: Array<optionsUrlType>,
  loadJobs: (url: string, index: number) => void,
  deleteUrl: (i: number) => void,
  jobCheckChanged: (url: optionsUrlType, i: number) => void
};

export default class OptionsUrlList extends Component<Props> {

  renderItem(item: optionsUrlType, i: number) {
    return (
      <OptionsUrlListItem
        key={i}
        item={item}
        load={() => {this.props.loadJobs(item.url, i)}}
        delete={() => {this.props.deleteUrl(i)}}
        checkChanged={(jobIndex) => this.props.jobCheckChanged(item, jobIndex)}
      />
    );
  }

  render() {
    if(!this.props.urls)
      return <div>No items</div>;
    return <div>{this.props.urls.map(this.renderItem.bind(this))}</div>;
  }
}