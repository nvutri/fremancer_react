import React, { Component } from 'react';
import { Button, Jumbotron } from 'react-bootstrap'
import request from 'request-promise';

import DailySheet from './DailySheet';


class TimeSheet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      total_hours: 0,
      total_amount: 0,
      summary: '',
      start_date: '',
      submitted: false,
      invoiced: false,
      contract: null
    };
  }
  componentDidMount() {
    const self = this;
    const requestInstance = request.defaults(this.props.requestConfig);
    requestInstance.get(`/api/timesheets/${this.props.id}/`).then(function (response) {
      self.setState(response);
      return response;
    }).catch(function (err) {
      console.log(err);
    });
  }
  save() {
    const data = Objects.assign({'id': this.props.id}, this.state);
    const requestInstance = request.defaults(this.props.requestConfig);
    return requestInstance.post(`/api/timesheets/${this.props.id}`).form(data).then(function (response) {
      return response;
    }).catch(function (err) {
      console.log(err);
    });
  }
  render() {
    return (
      <fieldset>
        <input
            name="summary"
            type="text"
            value={this.state.summary}
            onChange={ (e) => {this.setState({summary: e.target.value})}}
        />
      </fieldset>
    )
  }
}

export default TimeSheet
