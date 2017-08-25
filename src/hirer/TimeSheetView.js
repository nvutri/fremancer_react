import request from 'request-promise';
import React, { Component } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Button, Row, Col, ControlLabel, FormControl, FormGroup, InputGroup, Label, Well } from 'react-bootstrap'

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
    this.loadTimeSheet(this.props.match.params.id);
  }

  componentWillReceiveProps(nextProps) {
    this.loadTimeSheet(nextProps.match.params.id);
  }

  dateRange() {
    if (this.state.daily_sheets.length > 0) {
      const firstDay = this.state.daily_sheets[0].report_date;
      const lastDay = this.state.daily_sheets[6].report_date;
      return `${firstDay} - ${lastDay}`;
    }
    return '';
  }
  render() {
    const headerLabel = this.state.paid ? 'success' : this.state.invoiced ? 'primary' : 'info'
    return (
      <Row>
        <Col sm={1}/>
        <Col sm={10}>
          <Row>
            <Col sm={2}>
              { this.state.prev_timesheet ?
                <LinkContainer to={`/timesheets/${this.state.prev_timesheet}/`}>
                  <Button bsStyle="primary" name="last-week-button" block>
                    <i className="fa fa-arrow-left fa-lg" aria-hidden="true"></i> Previous Week
                  </Button>
                </LinkContainer>
                : ''
              }
            </Col>
            <Col sm={8}>
              <h4 className="text-center">
                Week {this.dateRange()}
                <Label bsStyle={headerLabel} className="pull-right">{this.state.status}</Label>
              </h4>
            </Col>
            <Col sm={2}>
              { this.state.next_timesheet ?
                <LinkContainer to={`/timesheets/${this.state.next_timesheet}/`}>
                  <Button bsStyle="primary" name="next-week-button" block>
                    Next Week <i className="fa fa-arrow-right fa-lg" aria-hidden="true"></i>
                  </Button>
                </LinkContainer>
                : ''
              }
            </Col>
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
