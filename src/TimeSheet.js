import request from 'request-promise';
import moment from 'moment';

import React, { Component } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Alert, Button, Row, Col } from 'react-bootstrap'
import FRC from 'formsy-react-components';
import DatePicker from 'react-datepicker';

import DailySheet from './DailySheet';

const DOW = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

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
      daily_sheets: [],
      id: this.props.match ? this.props.match.params.id : null,
      prev_timesheet: '',
      next_timesheet: '',
      msg: null,
      focused_id: null,
      contract: {}
    };
  }
  componentDidMount() {
    const self = this;
    const requestInstance = request.defaults(this.props.requestConfig);
    // Get Timesheet data.
    requestInstance.get(`/api/timesheets/${this.state.id}/`).then(function (response) {
      self.setState(response);
      return response;
    }).catch(function (err) {
      self.setState({msg: err.message});
    });
  }

  submit(data) {
    this.state.submitted = true;
    const requestInstance = request.defaults(this.props.requestConfig);
    return requestInstance.post(`/api/timesheets/${this.props.id}`).form(data).then(function (response) {
      return response;
    }).catch(function (err) {
      self.setState({validationErrors: err.error});
      self.setState({msg: err.message});
    });
  }

  render() {
    return (
      <Row>
        <Col sm={1}/>
        <Col sm={10}>
          <Row>
            { this.state.prev_timesheet ?
              <LinkContainer to={`/timesheets/${this.state.prev_timesheet}/`}>
                <Button bsStyle="primary" className="pull-left" name="last-week-button">
                  Prev Week
                </Button>
              </LinkContainer>
              : ''
            }
            { this.state.next_timesheet ?
              <LinkContainer to={`/timesheets/${this.state.next_timesheet}/`}>
                <Button bsStyle="primary" className="pull-right" name="next-week-button">
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
                  requestConfig={this.props.requestConfig}
                  dow={DOW[index]}
                  {...daily_data}
                />
              </Col>
            )
          }
          </Row>
          <FRC.Form
            onValidSubmit={ (data) => {
              data['start_date'] = this.state.start_date.format('YYYY-MM-DD');
              this.submit(data);
            }}
            validationErrors={this.state.validationErrors}>
            <FRC.Input
              name="total_hours"
              label="Total Hours"
              type="number"
              value={this.state.total_hours}
              />
            <FRC.Input
              name="total_amount"
              label="Total Amount"
              type="number"
              value={this.state.total_amount}
              />
            <FRC.Textarea
                name="summary"
                validations={{
                  isAlphanumeric: true,
                  minLength: 50
                }}
                validationErrors={{
                  isAlphanumeric: 'Only use alphanumeric characters',
                  minLength: 'Summary minimum length is 50'
                }}
                placeholder="Weekly Summary"
                label="Summary"
                value={this.state.summary}
            />
            <Button bsStyle="primary" className="center-block" name="submit-button"
              formNoValidate={true} type="submit" disabled={this.state.submitted}>
              Submit
            </Button>
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
