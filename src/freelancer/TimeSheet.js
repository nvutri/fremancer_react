import request from 'request-promise';
import moment from 'moment';
import update from 'react-addons-update';

import React, { Component } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Alert, Button, Row, Col } from 'react-bootstrap'
import FRC from 'formsy-react-components';
import DatePicker from 'react-datepicker';

import DailySheet from './DailySheet';
import { RequestConfig } from '../Config'


const DOW = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

class TimeSheet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      daily_sheets: [],
      id: this.props.match ? this.props.match.params.id : null,
      contract: {},
      saving: false,
      changed: false
    };
    this.daily_sheets = [];
  }

  /**
   * Load timesheet from server.
   * @param  {[type]} timesheetID [description]
   * @return {[type]}             [description]
   */
  loadTimeSheet(timesheetID) {
    const self = this;
    const requestInstance = request.defaults(RequestConfig);
    // Get Timesheet data.
    requestInstance.get(`/api/timesheets/${timesheetID}/`).then(function (response) {
      self.setState(response);
      return response;
    }).catch(function (err) {
      self.setState({msg: err.message});
    });
  }

  componentDidMount() {
    this.loadTimeSheet(this.state.id);
  }

  componentWillReceiveProps(nextProps) {
    this.loadTimeSheet(nextProps.match.params.id);
  }

  /**
   * Save form data to server.
   * Save daily sheets as well as this timesheet.
   * @param  {[type]} formData [description]
   * @return {[type]}          [description]
   */
  save(formData) {
    this.setState({saving: true});
    const data = update(formData, {$merge: {
      contract: this.state.contract.id,
      start_date: this.state.start_date,
      user: this.state.user
    }});
    const requestInstance = request.defaults(RequestConfig);
    // Save subsequent daily element data.
    this.daily_sheets.forEach( (daily_sheet) => {
      if (daily_sheet.form.refs.formsy.isChanged()) {
        daily_sheet.form.refs.formsy.submit();
      }
    });
    // Save timesheet data.
    const self = this;
    return requestInstance.put(`/api/timesheets/${this.state.id}/`).form(data).then(function (response) {
      self.setState({saving: false});
      self.setState(response);
      return response;
    }).catch((err) => {
      self.setState({
        validationErrors: err.error,
        msg: err.message,
        saving: false
      });
    });
  }

  /**
   * Add total hours of all the daily sheets.
   */
  addTotal() {
    // Get all the hours value.
    const hours = this.daily_sheets.map( (ds) => {
      return parseFloat(ds.hoursInput.getValue());
    });
    // Calculate the the total of all these hours.
    const total_hours = hours.reduce( (sum, value) => {
      return isNaN(value) ? sum : sum + value;
    }, 0);
    if (total_hours) {
      this.setState({
        total_hours: total_hours,
        total_amount: this.state.contract.hourly_rate * total_hours
      });
    }
  }

  render() {
    return (
      <Row>
        <Col sm={1}/>
        <Col sm={10}>
          <Row>
            { this.state.prev_timesheet ?
              <LinkContainer className="pull-left" to={`/timesheets/${this.state.prev_timesheet}/`}>
                <Button bsStyle="primary" name="last-week-button">
                  Prev Week
                </Button>
              </LinkContainer>
              : ''
            }
            { this.state.next_timesheet ?
              <LinkContainer className="pull-right" to={`/timesheets/${this.state.next_timesheet}/`}>
                <Button bsStyle="primary" name="next-week-button">
                  Next Week
                </Button>
              </LinkContainer>
              : ''
            }
          </Row>
          <Row>
          {
            this.state.daily_sheets.map( (daily_data, index) =>
              <Col
                key={`daily_${daily_data.id}`}
                sm={ this.state.focused_id === daily_data.id ? 5 : 3 }
                onFocus={(e) => this.setState({focused_id: daily_data.id})}>
                <DailySheet
                    ref={(instance) => {this.daily_sheets[index] = instance} }
                    requestConfig={this.props.requestConfig}
                    user={this.props.user}
                    dow={DOW[index]}
                    addTotal={this.addTotal.bind(this)}
                    {...daily_data}
                  />
              </Col>
            )
          }
          </Row>
          <FRC.Form
            onValidSubmit={this.save.bind(this)}
            validationErrors={this.state.validationErrors}>
            <FRC.Input
              name="total_hours"
              label="Total Hours"
              type="number"
              value={this.state.total_hours}
              disabled
              />
            <FRC.Input
              name="hourly_rate"
              label="Hourly Rate"
              type="number"
              value={this.state.contract.hourly_rate}
              disabled
              />
            <FRC.Input
              name="total_amount"
              label="Total Amount"
              type="number"
              value={this.state.total_amount}
              disabled
              />
            <FRC.Textarea
                name="summary"
                validations={{
                  minLength: 50
                }}
                validationErrors={{
                  minLength: 'Summary minimum length is 50'
                }}
                placeholder="Weekly Summary"
                label="Summary"
                value={this.state.summary}
            />
            <FRC.Input
              ref={ instance => this.submittedInput = instance }
              name="submitted"
              label="Submit Status"
              value={this.state.submitted}
              disabled
              />
            <Row>
              <Col sm={2}>
                <Button bsStyle="warning" className="btn-block"
                  id="submit-button" type="submit"
                  onClick={ e => this.submittedInput.setValue(true) }
                  formNoValidate={true} disabled={this.state.submitted}>
                  {this.state.submitted ? 'Submitted' : 'Submit'}
                </Button>
              </Col>
              <Col sm={3}/>
              <Col sm={3}>
                <Button bsStyle="primary" className="btn-block"
                  id="save-button"
                  formNoValidate={true} type="submit"
                  disabled={ this.state.saving }>
                  {this.state.saving ? 'Saving' : 'Save'}
                </Button>
              </Col>
            </Row>
          </FRC.Form>
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
        </Col>
      </Row>
    )
  }
}

export default TimeSheet
