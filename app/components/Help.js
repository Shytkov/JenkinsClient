// @flow
import React, { Component } from 'react';
import { Alert } from 'reactstrap';
import { Link } from 'react-router-dom';


export default class Help extends Component {

  render() {
    return (
      <Alert color="dark">
        <span>No jobs. Please setup jobs in </span>
        <Link to="/options">Options</Link>
      </Alert>
    );
  }
}