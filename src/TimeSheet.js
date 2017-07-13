import React, { Component } from 'react';
import { Button } from 'react-bootstrap'
import request from 'request-promise';
import moment from 'moment';

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
      contract: null,
      daily_sheets: []
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
    requestInstance.get(`/api/dailysheets/?timesheet=${this.props.id}`).then(function (response) {
      self.setState({daily_sheets: response.results});
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
  submit() {
    this.state.submitted = true;
    this.save();
  }
  render() {
    const self = this;
    const daily_sheets = this.state.daily_sheets.map( (daily_data) => {
      daily_data['requestConfig'] = self.props.requestConfig;
      daily_data['key'] = `daily_${daily_data.id}`;
      return <DailySheet
        {...daily_data}
      />
    });
    return (
      <fieldset>
        {daily_sheets}
        <input
            name="summary"
            type="text"
            value={this.state.summary}
            onChange={ (e) => {this.setState({summary: e.target.value})}}
        />
        <Button onClick={this.save.bind(this)} className="">Save</Button>
        { this.state.submitted ?
          <Button bsStyle="default" disalbed>Submitted</Button>:
          <Button bsStyle="primary" onClick={this.submit.bind(this)}>Submit</Button>
        }
      </fieldset>
    )
  }
}

export default TimeSheet
