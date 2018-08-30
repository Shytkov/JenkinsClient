// @flow
import React, { Component } from 'react';
import { Form, FormGroup, Label, Button, Input } from 'reactstrap';
import { jobType } from '../types/home';
import styles from './BuildJob.css';

type Props = {
  job: jobType,
  parameters: Array<object>,
  loading: boolean,
  loadJobParameters: () => void,
  parameterValueChanged: (parameter, value) => void,
  buildJob: (job, parameters, hist) => void
};

export default class BuildJob extends Component<Props> {

  componentDidMount() {

    if(this.props.job)
      this.props.loadJobParameters(this.props.job);
  }

  buildClick() {

    this.props.buildJob(this.props.job,
      this.props.parameters,
      this.props.history);
  }

  cancelClick() {

    this.props.history.push('/home');
  }

  onParameterChanged(item) {

    const itemName = item.target.id.substring('item'.length, 1000);
    const parameter = this.props.parameters.find((i) => i.Name === itemName);
    console.log(item.target.id, item.target.value, parameter);

    let value = item.target.value;
    if (parameter.DataType === 'BooleanParameterDefinition')
      value = item.target.checked;

    this.props.parameterValueChanged(parameter, value);
  }


  renderItem(item, i: number) {
    const itemId = `item${item.Name}`;

    if(item.DataType === "StringParameterDefinition") {

      let defaultText = '';
      if(item.Value)
        defaultText = item.Value;
      else if(item.DefaultValue)
        defaultText = item.DefaultValue;

      return (
        <FormGroup key={i}>
          <Label htmlFor={itemId}>{item.Name}:</Label>
          <Input id={itemId} value={defaultText} onChange={this.onParameterChanged.bind(this)} />
        </FormGroup>
      );
    }

    let checked = 'false';

    if(typeof item.Value !== 'undefined' )
      checked = item.Value;
    else if(item.DefaultValue)
      checked = item.DefaultValue;

    return (
      <FormGroup key={i}>
        <div key={item.id} className="custom-control custom-checkbox my-1 mr-sm-2">
          <input type="checkbox" className="custom-control-input" checked={checked} id={itemId} onChange={this.onParameterChanged.bind(this)} />
          <label className="custom-control-label" htmlFor={itemId}>{item.Name}</label>
        </div>
      </FormGroup>
    );
  }
  
  render() {
    if(this.props.loading)
      return ( 'Loading...' );
    if(!this.props.parameters)
      return <div>No items</div>;

    return ( 
      <Form>
        <div>{this.props.parameters.map(this.renderItem.bind(this))}</div>
        <Button color="primary" onClick={this.buildClick.bind(this)} >Build</Button>
        <Button className={`${styles.cancel}`} color="secondary" onClick={this.cancelClick.bind(this)} >Cancel</Button>
      </Form>
     );
  }
}
