import React, { Component } from 'react';
import { Button, Jumbotron } from 'react-bootstrap'
import { Input, Form, Select } from 'formsy-react-components';
import request from 'request-promise'


class DailySheet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      day: '',
      hours: '',
      summary: ''
    };
  }
  save(data) {
    const requestInstance = request.defaults(this.props.requestConfig);
    return requestInstance.post('/api/dailysheets/').then(function (response) {
      return response;
    }).catch(function (err) {
      console.log(err);
    });
  }
  render() {
    return (
      <fieldset>
        <legend className="text-center">this.state.day</legend>
        <Input
            name="hours"
            type="number"
            label=""
            validations={{
              isNumeric: true
            }}
            value={this.state.hours}
            onChange={ (e) => {this.setState({hours: e.target.value})}}
        />
        <Input
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
