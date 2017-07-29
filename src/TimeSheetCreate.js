import React, { Component } from 'react';
import { Button } from 'react-bootstrap'
import request from 'request-promise';
import moment from 'moment';
import FRC from 'formsy-react-components';


class TimeSheetCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      start_date: '',
      id: null,
      contractOptions: [],
      validationErrors: {}
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
      self.props.history.push(`/timesheets/${response.id}/`);
      return response;
    }).catch(function (err) {
      self.setState({validationErrors: err});
    });
  }
  render() {
    return (
      <FRC.Form
        onValidSubmit={this.create.bind(this)}
        validationErrors={this.state.validationErrors}>
        <fieldset>
          <FRC.Input
              name="start_date"
              type="date"
              label="Week"
              value={this.state.start_date}
              placeholder="start_date"
              onChange={ (e) => {this.setState({summary: e.start_date.value})}}
          />
          <FRC.Select
              name="contract"
              label="Contract"
              options={this.state.contractOptions}
              required
          />
          <Button bsStyle="primary" className="center-block"
            name="submit-button"
            formNoValidate={true} type="submit">Create TimeSheet</Button>
        </fieldset>
      </FRC.Form>
    )
  }
}

export default TimeSheetCreate
