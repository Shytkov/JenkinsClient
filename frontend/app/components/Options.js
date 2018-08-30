// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Form, FormGroup, Label, Button, InputGroup, Input, InputGroupAddon } from 'reactstrap';
import OptionsUrlListComponent from '../containers/OptionsUrlListComponent';
import Utils from '../utils/Utils';
import type { optionsStateType } from '../types/options';

type Props = {
  options: optionsStateType,
  addUrl: (url: string) => void,
  saveOptions: () => void
};

export default class Options extends Component<Props> {
  urlInput: Class;
  constructor() {
    super();

    this.state = {
      urlValid: 'valid',
    };
  }

  addUrl() {
    this.props.addUrl(this.urlInput.value);
    this.urlInput.value = '';
  }

  saveOptions() {
    this.props.saveOptions(this.props.options);
  }

  urlInputChange() {
    this.setState({
      urlValid: this.validateUrl(this.urlInput.value)
    });
  }

  validateUrl(url: string) {
    if(!url) return null;
    return Utils.validateUrl(url);
  }

  addButtonDisabled() {
    return !this.state.urlValid;
  }

  render() {
    // const urlValidState = this.state.urlvalid ? valid : invalid;
    return (
      <Form>
        <FormGroup>
          <Label for="jenkinsUrl">Jenkins URL:</Label>
          <InputGroup>
            <Input invalid={!this.state.urlValid} innerRef={(ref) => this.urlInput = ref} onChange={this.urlInputChange.bind(this)} />
            <InputGroupAddon addonType="append">
              <Button
                color="primary" 
                disabled={this.addButtonDisabled()}
                onClick={this.addUrl.bind(this)}
              >
                Add
              </Button>
            </InputGroupAddon>
          </InputGroup>
        </FormGroup>
        <OptionsUrlListComponent />
        <Link className="btn btn-primary" onClick={this.saveOptions.bind(this)} to="/">Save</Link>
      </Form>
    );
  }
}
