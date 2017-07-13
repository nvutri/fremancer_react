import React, { Component } from 'react';
import request from 'request-promise'


class DailySheet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      'hours': props.hours,
      'summary': props.summary
    };
  }
  componentDidMount() {
    const self = this;
    const requestInstance = request.defaults(this.props.requestConfig);
    requestInstance.get(`/api/dailysheets/${this.props.id}/`).then(function (response) {
      self.setState(response);
      return response;
    }).catch(function (err) {
      console.log(err);
    });
  }
  save() {
    const data = {
      timesheet: this.props.timesheet,
      report_date: this.props.report_date,
      hours: this.state.hours,
      summary: this.state.summary
    };
    const requestInstance = request.defaults(this.props.requestConfig);
    return requestInstance.post(`/api/dailysheets/${this.props.id}`).form(data).then(function (response) {
      return response;
    }).catch(function (err) {
      console.log(err);
    });
  }
  render() {
    return (
      <fieldset>
        <legend className="text-center">this.props.day</legend>
        <input
            name="hours"
            type="number"
            value={this.state.hours}
            onChange={ (e) => {this.setState({hours: e.target.value})}}
        />
        <input
            name="summary"
            type="text"
            label="Note"
            value={this.state.summary}
            onChange={ (e) => {this.setState({summary: e.target.value})}}
        />
      </fieldset>
    )
  }
}

export default DailySheet
