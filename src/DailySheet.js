import React, { Component } from 'react';
import request from 'request-promise';
import FRC from 'formsy-react-components';


class DailySheet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      'hours': props.hours,
      'summary': props.summary,
      'report_date': props.report_date,
      'validationErrors': {},
      'msg': '',
    };
  }
  save() {
    const data = {
      timesheet: this.props.timesheet,
      report_date: this.props.report_date,
      hours: this.state.hours,
      summary: this.state.summary
    };
    const requestInstance = request.defaults(this.props.requestConfig);
    const self = this;
    return requestInstance.post(`/api/dailysheets/${this.props.id}`).form(data).then(function (response) {
      return response;
    }).catch(function (err) {
      self.setState({
        validationErrors: err.error,
        msg: err.message
      });
    });
  }
  render() {
    return (
      <FRC.Form
        validationErrors={this.state.validationErrors}>
        <fieldset>
          <legend className="text-center">{this.props.dow}</legend>
          <FRC.Input
              name="report_date"
              label="Date"
              type="date"
              value={this.state.report_date}
              disabled/>
          <FRC.Input
              name="hours"
              type="number"
              label="Hours"
              value={this.state.hours}
              onChange={ (e) => {this.setState({hours: e.target.value})}}/>
          <FRC.Textarea
              name="summary"
              label="Note"
              placeholder={`${this.props.dow} Note`}
              value={this.state.summary ? this.state.summary : ''}
              onChange={ (e) => {this.setState({summary: e.target.value})}}/>
        </fieldset>
        { this.state.msg ?
          <Row>
            <Col sm={3}/>
            <Col sm={9}>
              <Alert bsStyle="danger">
                {this.state.msg}
              </Alert>
            </Col>
          </Row>
          : ''
        }
      </FRC.Form>
    )
  }
}

export default DailySheet
