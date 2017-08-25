import update from 'react-addons-update';
import React, { Component } from 'react';
import request from 'request-promise';
import FRC from 'formsy-react-components';
import { Alert, Row, Col } from 'react-bootstrap'
import { RequestConfig } from '../Config'


class DailySheet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      'validationErrors': {},
      'msg': '',
    };
  }
  save(formData) {
    const data = update(formData, {$merge: {
      timesheet: this.props.timesheet,
      user: this.props.user
    }});
    const requestInstance = request.defaults(RequestConfig);
    const self = this;
    return requestInstance.put(`/api/dailysheets/${this.props.id}/`).form(data).then(function (response) {
      return response;
    }).catch(function (err) {
      self.setState({
        validationErrors: err.error,
        msg: err.message
      });
    });
  }
  isPristine() {
    return this.hoursInput.isPristine() && this.summaryInput.isPristine();
  }
  render() {
    return (
      <FRC.Form
        validationErrors={this.state.validationErrors}
        onValidSubmit={this.save.bind(this)}
        ref={(instance) => {this.form = instance}}>
        <fieldset>
          <legend className="text-center">{this.props.dow}</legend>
          <FRC.Input
              name="report_date"
              label="Date"
              type="date"
              value={this.props.report_date}
              disabled/>
          {
            this.props.is_hourly ?
              <FRC.Input
                  name="hours"
                  type="number"
                  label="Hours"
                  ref={(instance) => {this.hoursInput = instance}}
                  value={this.props.hours ? this.props.hour : ''}
                  addonAfter="hours"
                  onKeyUp={ this.props.addTotal }/>
              : ''
          }
          <FRC.Textarea
              name="summary"
              label="Note"
              ref={(instance) => {this.summaryInput = instance}}
              placeholder={`${this.props.dow} Note`}
              value={this.props.summary ? this.props.summary : ''}/>
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
