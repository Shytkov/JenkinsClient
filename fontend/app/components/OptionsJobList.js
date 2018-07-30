// @flow
import React, { Component } from 'react';
import type { optionsJobType } from '../types/options';

type Props = {
  jobs: Array<optionsJobType>,
  checkChanged: (i: number) => void
};

export default class OptionsJobList extends Component<Props> {

  checkChanged(i: number) {
    this.props.checkChanged(i);
  }

  renderItem(item: optionsJobType, i: number) {
    const checkId = `checkBox${item.id}`;
    return (
      <div key={item.id} className="custom-control custom-checkbox my-1 mr-sm-2">
        <input type="checkbox" className="custom-control-input" checked={item.included} id={checkId} onChange={() => this.checkChanged(i)} />
        <label className="custom-control-label" htmlFor={checkId}>{item.name}</label>
      </div>
    );
  }

  render() {
    if(!this.props.jobs)
      return <div>No items</div>;
    return <div>{this.props.jobs.map(this.renderItem.bind(this))}</div>;
  }
}