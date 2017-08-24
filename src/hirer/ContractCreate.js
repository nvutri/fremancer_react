import request from 'request-promise';
import React, { Component } from 'react';
import Formsy from 'formsy-react';
import FRC from 'formsy-react-components';
import Select from 'react-select'
import { Alert, Button, Col, Row, Jumbotron, Panel } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap';
import { RequestConfig } from '../Config'


class ContractCreateForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hirer: this.props.user.id,
      contract_type: 'wage',
      saving: false,
      payments: [],
      validationErrors: {}
    };
  }
  submit(data) {
    const self = this;
    this.setState({saving: true})
    // Assign the user profile as the hiring person.
    data['hirer'] = this.props.user.id;
    data['freelancer'] = this.state.freelancer;
    const requestInstance = request.defaults(RequestConfig);
    // Create a new Contract.
    const url = '/api/contracts/';
    return requestInstance.post(url).form(data).then(function (response) {
      self.setState({saving: false});
      setTimeout( () => self.props.history.push('/contracts/'), 1000);
      return response;
    }).catch(function (err) {
      self.setState({
        validationErrors: err.error,
        saving: false,
      });
    });
  }

  componentDidMount() {
    this.loadPayments();
  }

  loadPayments() {
    const self = this;
    const requestInstance = request.defaults(RequestConfig);
    return requestInstance.get('/api/payments/').then( response => {
      const paymentOptions = response.data.map( item => {
        return {
          value: item.id,
          label: `${item.name}: ${item.brand} - ${item.last4} ${item.exp}`
        }
      });
      self.setState({
        payments: paymentOptions,
        default_payment: paymentOptions.length > 0 ? paymentOptions[0].value : ''
      });
    });
  }
  loadFreelancers() {
    const requestInstance = request.defaults(RequestConfig);
    const self = this;
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
    });
  }
  render() {
    var self = this;
    var frcForm = <FRC.Form
      onValidSubmit={this.submit.bind(this)}>
      <fieldset>
        <FRC.Input
            name="title"
            label="Title"
            validations={{
              minLength: 8,
              maxLength: 100
            }}
            validationErrors={{
              minLength: 'Title minimum length is 8',
              maxLength: 'Title maximum length is 100'
            }}
            placeholder="What is your project title?"
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
            disabled={this.state.saving}
            addonBefore="$"
            required/>
        <FRC.Select
            name="duration"
            label="Anticipating Duration"
            options={[
              {value: 'long', label: 'Long Term (More than 1 month)'},
              {value: 'short', label: 'Short Term (About 1 month or less)'}
            ]}
            value='long'
            disabled={this.state.saving}
        />
        <FRC.Select
            name="contract_type"
            label="Contract Type"
            options={[
              {value: 'wage', label: 'Wage - Pay Fixed Amount Weekly'},
              {value: 'hourly', label: 'Hourly - Pay by Hour'},
              {value: 'fixed', label: 'Fixed Project - Pay an amount once'},
            ]}
            value='wage'
            onChange={ (name, value) => this.setState({contract_type: value})}
            disabled={this.state.saving}
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
                label="Fixed Project Amount"
                disabled={this.state.saving}
                required/>
        }
        <FRC.Row>
          <Col sm={9}>
            <FRC.Select
                name="default_payment"
                label="Default Payment"
                labelClassName={[{'col-sm-3': false}, 'col-sm-4']}
                elementWrapperClassName={[{'col-sm-9': false}, 'col-sm-8']}
                options={this.state.payments}
                value={this.state.default_payment}
                required/>
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
        <FRC.Row>
          <label className="control-label col-sm-3">
            Freelancer
          </label>
          <Col sm={9}>
            <Select.Async
                name="freelancer"
                value={this.state.freelancer}
                loadOptions={this.loadFreelancers.bind(this)}
                onChange={ (selectedOption) => { this.setState({freelancer: selectedOption.value})} }
                disabled={this.state.saving}
                required
            />
          </Col>
        </FRC.Row>
      <br/>
      </fieldset>
      <fieldset>
        <Button bsStyle="primary" className="center-block"
          name="submit-button"
          bsSize="large"
          formNoValidate={true} type="submit"
          disabled={this.state.saving}>
          {this.state.saving ? 'Saving Contract ...' : 'Create Contract'}</Button>
      </fieldset>
    </FRC.Form>;
    return (
      <Row>
        <Col md={1}></Col>
        <Col md={10}>
          <Panel header={<h3 className="text-center">Contract Create Form</h3>} bsStyle="info">
            {frcForm}
          </Panel>
        </Col>
      </Row>
    );
  }
}

export default ContractCreateForm;
