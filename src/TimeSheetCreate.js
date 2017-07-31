import React, { Component } from 'react';
import { Button, Col, Alert, Row } from 'react-bootstrap'
import request from 'request-promise';
import moment from 'moment';
import FRC from 'formsy-react-components';
import DatePicker from 'react-datepicker';


class TimeSheetCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: moment(),
      id: null,
      contractOptions: [],
      validationErrors: {},
      msg: ''
    };
  }
  componentDidMount() {
    const requestInstance = request.defaults(this.props.requestConfig);
    const self = this;
    requestInstance.get('/api/contracts/').then((response) => {
      const options = response.results.map(function(item) {
        return {
          'value': item.id,
          'label': item.title
        }
      });
      self.setState({
        contractOptions: options
      });
      return response;
    });
  }
  /**
   * Create a new time-sheet given basic info.
   * Redirect to an edit page to fill-out more information.
   * @return {[Promise]} A XHR Promise to get data from timesheet API.
   */
  create(data) {
    const requestInstance = request.defaults(this.props.requestConfig);
    const self = this;
    return requestInstance.post('/api/timesheets/').form(data).then(function (response) {
      if (self.props.history) {
        self.props.history.push(`/timesheets/${response.id}/`);
      }
      return response;
    }).catch(function (err) {
      self.setState({validationErrors: err.error});
      if (err.message) {
        self.setState({msg: err.message});
      }
      return err;
    });
  }
  render() {
    return (
      <FRC.Form
        onValidSubmit={ (data) => {
          data['start_date'] = this.state.date.format('YYYY-MM-DD');
          this.create(data);
        }}
        validationErrors={this.state.validationErrors}>
        <fieldset>
          <FRC.Row>
            <label className="control-label col-sm-3">
              Week
            </label>
            <Col sm={9}>
              <DatePicker
                  inline
                  showWeekNumbers
                  selected={this.state.date}
                  onChange={ (date) => {this.setState({date: date})} }
              />
            </Col>
          </FRC.Row>
          <FRC.Select
              name="contract"
              label="Contract"
              options={this.state.contractOptions}
              required
          />
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
          <Button bsStyle="primary" className="center-block"
            name="submit-button"
            formNoValidate={true} type="submit">Create TimeSheet</Button>
        </fieldset>
      </FRC.Form>
    )
  }
}

export default TimeSheetCreate
