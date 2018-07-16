// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Form, FormGroup, Label, Button, InputGroup, Input, InputGroupAddon } from 'reactstrap';
import OptionsUrlListComponent from '../containers/OptionsUrlListComponent';
import Utils from '../utils/Utils';

type Props = {
  addUrl: (url: string) => void
};

export default class Options extends Component<Props> {
  urlInput: Class;
  constructor() {
    super();

    this.state = {
      urlValid: 'valid',
    };
  }

  addUrlHandler() {

    this.props.addUrl(this.urlInput.value);
    this.urlInput.value = '';
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
              <Button color="primary" disabled={this.addButtonDisabled()} onClick={this.addUrlHandler.bind(this)}>Add</Button>
            </InputGroupAddon>
          </InputGroup>
        </FormGroup>
        <OptionsUrlListComponent />
        <Link className="btn btn-primary" to="/">Save</Link>
      </Form>
    );
  }
}
