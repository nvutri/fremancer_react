import request from 'request-promise';
import moment from 'moment';
import React, { Component } from 'react';
import { Button, Col, Row, Panel } from 'react-bootstrap'
import FRC from 'formsy-react-components';
import { LinkContainer } from 'react-router-bootstrap';
import Select from 'react-select'
import { RequestConfig } from '../Config'


class ContractEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hirer: this.props.user ? this.props.user.id : null,
      id: props.match.params.id,
      payments: [],
      validationErrors: {},
      saving: false
    };
  }
  submit(data) {
    var self = this;
    this.setState({saving: true});
    // Assign the user profile as the hiring person.
    data['hirer'] = this.state.hirer;
    data['freelancer'] = this.state.freelancer;
    const requestInstance = request.defaults(RequestConfig);
    // Update an existing Contract by PUT request with the ID..
    const url = `/api/contracts/${this.state.id}/`;
    return requestInstance.put(url).form(data).then(function (response) {
      self.props.history.push('/contracts/');
      return response;
    }).catch(function (err) {
      self.setState({
        validationErrors: err.error,
        saving: false
      });
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
      if (response.count > 0) {
        return response.results[0];
      } else {
        return {};
      }
    }).then( (response) => {
      if (response.start_date) {
        self.setState({timesheet: response.id});
        return response;
      }
    });
  }
  /**
   * Get related data of this Contract post.
   * @return {Promise} a promise of the given AJAX data.
   */
  componentDidMount() {
    const self = this;
    const requestInstance = request.defaults(RequestConfig);
    this.loadTimeSheet();
    requestInstance.get('/api/payments/').then( response => {
      const paymentOptions = response.data.map( item => {
        return {
          value: item.id,
          label: `${item.name}: ${item.brand} - ${item.last4} ${item.exp}`
        }
      });
      self.setState({
        payments: paymentOptions
      });
    });
    return requestInstance.get(`/api/contracts/${this.state.id}/`).then( (response) => {
      self.setState(response);
      self.loadTimeSheet();
      return response;
    }).catch( (err) => {
      self.setState({validationErrors: err.error});
    });
  }

  /**
   * Load freelancer to selector input.
   * @return {[Object.{'value': String, 'label': String}]} a list of options.
   */
  loadFreelancers() {
    const requestInstance = request.defaults(RequestConfig);
    const url = '/api/profiles/?membership=freelancer';
    return requestInstance.get(url).then(function (response) {
      const options = response.results.map(function(item) {
        const fl = item.user;
        return {
          'value': fl.id,
          'label': `${fl.first_name} ${fl.last_name}: ${fl.email}`
        }
      });
      return {
        options: options,
        complete: true
      }
    }).catch(function (err) {
      console.log(err);
    });
  }
  render() {
    var self = this;
    var frcForm = <FRC.Form
      onValidSubmit={this.submit.bind(this)}
      validationErrors={this.state.validationErrors}>
      <fieldset>
        <FRC.Input
            name="title"
            label="Title"
            validations={{
              minLength: 8,
              maxLength: 100
            }}
            validationErrors={{
              minLength: 'Title minimum length is 8'
            }}
            placeholder="What is your project title?"
            value={this.state.title}
            disabled={this.state.saving}
            required/>
        <FRC.Textarea
            name="description"
            validations={{
              minLength: 50
            }}
            validationErrors={{
              minLength: 'Description minimum length is 50'
            }}
            placeholder="What is your project description?"
            label="Description"
            value={this.state.description}
            disabled={this.state.saving}
            required/>
        <br/>
        <FRC.Input
            name="total_budget"
            validations={{
              isNumeric: true,
            }}
            validationErrors={{
              isNumeric: 'Only use number.',
            }}
            placeholder="Project Budget? (20,000, 30,000 ..)"
            label="Project Budget"
            value={this.state.total_budget}
            addonBefore="$"
            disabled={this.state.saving}
            required/>
        <FRC.Select
            name="duration"
            label="Anticipating Duration"
            options={[
              {value: 'short', label: 'Short Term (About 1 month or less)'},
              {value: 'long', label: 'Long Term (More than 1 month)'}
            ]}
            value={this.state.duration}
        />
        <FRC.Select
            name="contract_type"
            label="Contract Type"
            options={[
              {value: 'wage', label: 'Wage - Pay Fixed Amount Weekly'},
              {value: 'hourly', label: 'Hourly - Pay by Hour'},
              {value: 'fixed', label: 'Fixed Project - Pay an amount once'},
            ]}
            value={this.state.contract_type}
            onChange={ (name, value) => this.setState({contract_type: value})}
            disabled
        />
        {
          this.state.contract_type === 'hourly' ?
            <fieldset>
              <FRC.Input
                  name="hourly_rate"
                  validations={{
                    isNumeric: true,
                  }}
                  validationErrors={{
                    isNumeric: 'Only use number.',
                  }}
                  placeholder="Project hourly rate? (20, 30 ..)"
                  label="Hourly Rate"
                  addonBefore="$"
                  addonAfter="an hour"
                  value={this.state.hourly_rate}
                  disabled={this.state.saving}
                  required/>
              <FRC.Input
                  name="max_weekly_hours"
                  validations={{
                    isNumeric: true,
                  }}
                  validationErrors={{
                    isNumeric: 'Only use number.',
                  }}
                  placeholder="Project Weekly Hours Cap"
                  label="Max Weekly Hours"
                  addonAfter="hours"
                  value={this.state.max_weekly_hours}
                  disabled={this.state.saving}
                  required/>
            </fieldset>
          : this.state.contract_type === 'wage' ?
            <fieldset>
              <FRC.Input
                  name="wage_amount"
                  validations={{
                    isNumeric: true,
                  }}
                  validationErrors={{
                    isNumeric: 'Only use number.',
                  }}
                  placeholder="Weekly Wage Amount? ($200.0, $300.0 ..)"
                  addonBefore="$"
                  value={this.state.wage_amount}
                  label="Weekly Wage Amount"
                  disabled={this.state.saving}
                  required/>
              <FRC.Input
                  name="max_weekly_hours"
                  validations={{
                    isNumeric: true,
                  }}
                  validationErrors={{
                    isNumeric: 'Only use number.',
                  }}
                  placeholder="Expecting number of work hours weekly."
                  help="40 hours or more for Full-Time Position. 20-30 hours for Part-Time."
                  label="Weekly Hours"
                  addonAfter="hours"
                  value={this.state.max_weekly_hours}
                  disabled={this.state.saving}
                  required/>
              </fieldset>
          :  <FRC.Input
                name="fixed_amount"
                validations={{
                  isNumeric: true,
                }}
                validationErrors={{
                  isNumeric: 'Only use number.',
                }}
                placeholder="Fixed Project Amount? ($200.0, $300.0 ..)"
                addonBefore="$"
                value={this.state.fixed_amount}
                label="Fixed Project Amount"
                disabled
                required/>
        }
        <FRC.Row>
          <label className="control-label col-sm-3">
            Freelancer
          </label>
          <Col sm={9}>
            <Select.Async
                name="freelancer"
                value={this.state.freelancer}
                loadOptions={this.loadFreelancers.bind(this)}
                onChange={ (option) => { this.setState({freelancer: option.value})} }
                disabled
            />
          </Col>
        </FRC.Row>
        <FRC.Row>
          <Col sm={9}>
            <FRC.Select
                name="default_payment"
                label="Default Payment"
                labelClassName={[{'col-sm-3': false}, 'col-sm-4']}
                elementWrapperClassName={[{'col-sm-9': false}, 'col-sm-8']}
                options={this.state.payments}
                disabled={this.state.saving}
                value={this.state.default_payment}/>
          </Col>
          <Col sm={3}>
            <LinkContainer to={`/accounts/payment/`}>
              <Button bsStyle="primary"
                name="timesheet-button"
                formNoValidate={true} type="button">
                Add Payment
              </Button>
            </LinkContainer>
          </Col>
        </FRC.Row>
      <br/>
      </fieldset>
      <fieldset>
        <Button bsStyle="primary" className="center-block"
          name="submit-button"
          bsSize="large"
          disabled={this.state.saving}
          formNoValidate={true} type="submit">
          {this.state.saving ? 'Updating Contract ...' : 'Update Contract'}
        </Button>
      </fieldset>
    </FRC.Form>;
    return (
      <Row>
        <Col md={1}></Col>
        <Col md={10}>
          {
            this.state.timesheet ?
              <LinkContainer to={`/timesheets/${this.state.timesheet}/`}>
                <Button bsStyle="primary"
                  name="timesheet-button"
                  formNoValidate={true} type="button">
                  Open TimeSheet
                </Button>
              </LinkContainer>
              : ''
          }
          <Panel header={<h3 className="text-center">Contract Edit Form</h3>} bsStyle="info">
            {frcForm}
          </Panel>
        </Col>
      </Row>
    );
  }
}

export default ContractEdit;
