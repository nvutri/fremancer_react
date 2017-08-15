import request from 'request-promise';
import moment from 'moment';
import update from 'react-addons-update';

import React, { Component } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Alert, Button, Row, Col, ControlLabel, Form, FormControl, FormGroup, InputGroup, Well } from 'react-bootstrap'
import FRC from 'formsy-react-components';
import DatePicker from 'react-datepicker';

import DailySheetView from './DailySheetView';
import { RequestConfig } from '../Config'


const DOW = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const DAY_SIZE = [4, 4, 4, 3, 3, 3, 3];

class TimeSheetView extends Component {
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
                  sm={DAY_SIZE[index]}
                  key={`daily_${daily_data.id}`}>
                  <DailySheetView
                      user={this.props.user}
                      dow={DOW[index]}
                      {...daily_data}/>
                </Col>
              )
            }
          </Row>
          <Row>
            <Col sm={6}>
              <FormGroup>
                <Col componentClass={ControlLabel} sm={3}>
                  Total Hours
                </Col>
                <Col sm={9}>
                  <FormGroup>
                    <InputGroup>
                      <FormControl type="text" value={this.state.total_hours} disabled/>
                      <InputGroup.Addon>hours</InputGroup.Addon>
                    </InputGroup>
                  </FormGroup>
                </Col>
              </FormGroup>
              <FormGroup>
                <Col componentClass={ControlLabel} sm={3}>
                  Hourly Rate
                </Col>
                <Col sm={9}>
                  <FormGroup>
                    <InputGroup>
                      <InputGroup.Addon>$</InputGroup.Addon>
                      <FormControl type="text" value={this.state.contract.hourly_rate} disabled/>
                      <InputGroup.Addon>per hour</InputGroup.Addon>
                    </InputGroup>
                  </FormGroup>
                </Col>
              </FormGroup>
              <FormGroup>
                <Col componentClass={ControlLabel} sm={3}>
                  Total Amount
                </Col>
                <Col sm={9}>
                  <FormGroup>
                    <InputGroup>
                      <InputGroup.Addon>$</InputGroup.Addon>
                      <FormControl type="text" value={this.state.total_amount} disabled/>
                    </InputGroup>
                  </FormGroup>
                </Col>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col sm={12}>
              <ControlLabel>Summary</ControlLabel>
              <Well>{this.state.summary}</Well>
            </Col>
          </Row>
        </Col>
      </Row>
    )
  }
}

export default TimeSheetView
