import moment from 'moment';
import request from 'request-promise';
import React, { Component } from 'react';
import FRC from 'formsy-react-components';
import { Button, Col, ControlLabel, Form, FormGroup, Jumbotron, Row } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { RequestConfig } from '../Config';

class Contract extends Component {
  constructor(props) {
    super(props);
    this.state = {
      msg: '',
      id: props.match ? props.match.params.id : null
    };
  }

  componentDidMount() {
    const self = this;
    const requestInstance = request.defaults(RequestConfig);
    const membership = this.props.user.membership;
    const url = `/api/contracts/${this.state.id}/`
    requestInstance.get(url).then(function (response) {
      self.setState(response);
      if (response.accepted) {
        self.loadTimeSheet();
      }
      return response;
    }).catch(function (err) {
      self.setState({msg: err});
    });
  }
  /**
   * Accept a project.
   * @return {[type]} [description]
   */
  acceptProject() {
    const self = this;
    const requestInstance = request.defaults(RequestConfig);
    return requestInstance.post(`/api/contracts/${this.state.id}/accept/`).then( (response) => {
      if (response.success) {
        self.setState({accepted: true});
        self.loadTimeSheet();
      }
      return response;
    });
  }
  /**
   * Create TimeSheet of the latest one.
   * @param  {String} lastMonday a start_date of the latest Monday.
   * @return {[type]}            [description]
   */
  createLatestTimeSheet(lastMonday) {
    const self = this;
    const data = {
      contract: this.state.id,
      start_date: lastMonday,
      user: this.props.user.id
    };
    const requestInstance = request.defaults(RequestConfig);
    return requestInstance.post('/api/timesheets/').form(data).then( (response) => {
      self.setState({timesheet: response.id});
      return response;
    });
  }
  /**
   * Load timesheet ID of this week.
   * Create a new timesheet if needs to.
   * @return {[Promise]} A promise of the AJAX request for opening timesheet.
   */
  loadTimeSheet() {
    const requestInstance = request.defaults(RequestConfig);
    const url = `/api/timesheets/?contract=${this.state.id}`;
    const self = this;
    return requestInstance.get(url).then( (response) => {
      return response.count > 0 ? response.results[0] : {}
    }).then( (response) => {
      const lastMonday = moment().day('Monday').format('YYYY-MM-DD');
      if (lastMonday === response.start_date) {
        self.setState({timesheet: response.id});
      } else {
        self.createLatestTimeSheet(lastMonday);
      }
      return response
    });
  }
  render() {
    return <Row>
        <Col sm={1}/>
        <Col sm={10}>
          <FRC.Form onSubmit={this.acceptProject.bind(this)}>
          <Row>
            {
              this.state.accepted && this.state.timesheet ?
                <LinkContainer to={`/timesheets/${this.state.timesheet}/`}>
                  <Button bsStyle="primary"
                    name="timesheet-button"
                    formNoValidate={true} type="button">
                    Open TimeSheet
                  </Button>
                </LinkContainer>
                : ''
            }
          </Row>
          <fieldset>
            <FRC.Input
                name="title"
                label="Title"
                value={this.state.title}
                disabled/>
            <FRC.Textarea
                name="description"
                label="Description"
                value={this.state.description}
                disabled/>
            <FRC.Input
                name="hourly_rate"
                label="Hourly Rate"
                value={this.state.hourly_rate}
                disabled/>
            <FRC.Input
                name="max_weekly_hours"
                label="Max Weekly Hours"
                value={this.state.max_weekly_hours}
                disabled/>
            <br/>
            <FRC.Input
                name="total_budget"
                label="Project Budget"
                value={this.state.total_budget}
                disabled/>
            <FRC.Select
                name="duration"
                label="Anticipating Duration"
                options={[
                  {value: 'short', label: 'Short Term (About 1 month or less)'},
                  {value: 'long', label: 'Long Term (More than 1 month)'}
                ]}
                value={this.state.duration}
                disabled/>
            <FRC.Select
                name="budget_type"
                label="Budget Type"
                options={[
                  {value: 'hourly', label: 'Hourly - Pay by Hour'},
                ]}
                value={this.state.budget_type}
                disabled/>
            <FRC.Input
                name="freelancer"
                label="Freelancer"
                value={this.state.freelancer}
                disabled/>
            <FRC.Input
                name="accepted"
                label="Accept Status"
                value={this.state.accepted}
                disabled/>
          <br/>
          </fieldset>
          </FRC.Form>
          { this.state.accepted ?
              '' :
              <Button bsStyle="primary" className="center-block"
                name="accept-button"
                onClick={this.acceptProject.bind(this)}
                disabled={this.state.accepted}>
                Accept Project Contract
              </Button>
          }
        </Col>
      </Row>
  }
}

export default Contract;
