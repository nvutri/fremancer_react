import request from 'request-promise'

import React, { Component } from 'react';
import {Alert, Button, Col, Jumbotron, Row} from 'react-bootstrap'
import FontAwesome from 'react-fontawesome';
import { RequestConfig, StripePublicKey } from '../Config';
import Stripe from 'stripe-client';
import FRC from 'formsy-react-components';

const stripe = Stripe(StripePublicKey);

class PaymentACH extends Component {
  constructor(props) {
    super(props);
    this.state = {
      payments: null,
      loading: false,
      validationErrors: {},
      msg: ''
    };
  }
  createACHSource(token) {
    const requestInstance = request.defaults(RequestConfig);
    const self = this;
    return requestInstance.post('/api/payments/').form(token).then( (res) => {
      self.setState({
        loading: false
      });
      self.props.loadPaymentOptions();
    }).catch( (response) => {
      self.setState({
        loading: false,
        msg: response.message
      });
    });
  }
  submit(data) {
    const self = this;
    this.setState({
      loading: true,
      msg: ''
    });
    return stripe.createToken({'bank_account': data})
      .then( result => result.json())
      .then( result => {
        if (result.object === 'token') {
          self.createACHSource(result);
        } else {
          self.setState({
            validationErrors: result.error,
            msg: result.error.message,
            loading: false
          });
        }
        return result;
      }).catch( response => {
        self.setState({
          msg: response.error
        });
      });
  }
  render() {
    const user = this.props.user;
    return <FRC.Form
      onValidSubmit={this.submit.bind(this)}
      validationErrors={this.state.validationErrors}>
      <fieldset>
        <FRC.Input
            name="country"
            label="Country"
            value="US"
            disabled
            required/>
        <FRC.Input
            name="currency"
            label="Currency"
            value="USD"
            disabled
            required/>
        <FRC.Input
            name="account_holder_name"
            label="Account Holder Name"
            validations={{
              isWords: true,
              minLength: 6
            }}
            validationErrors={{
              isWords: 'Please Enter a Valid Name',
              minLength: 'Name minimum length is 6'
            }}
            value={`${user.first_name} ${user.last_name}`}
            placeholder="What is your account holder name?"
            required/>
        <FRC.Select
            name="account_holder_type"
            label="Account Holder Type"
            value="individual"
            options={[
              {value: 'individual', label: 'Individual'},
              {value: 'company', label: 'Company'},
            ]}/>
        <FRC.Input
            name="routing_number"
            label="Routing Number"
            type="number"
            step="1"
            validations={{
              isNumeric: true,
              minLength: 6
            }}
            validationErrors={{
              isNumeric: 'Please Enter Valid Routing Number',
              minLength: 'Routing minimum length is 6'
            }}
            placeholder="What is your bank routing number?"
            required/>
        <FRC.Input
            name="account_number"
            label="Account Number"
            type="number"
            step="1"
            validations={{
              isNumeric: true,
              minLength: 6
            }}
            validationErrors={{
              isNumeric: 'Please Enter Valid Account Number',
              minLength: 'Account minimum length is 6'
            }}
            placeholder="What is your bank account number?"
            required/>
        </fieldset>
        <fieldset>
          <Button bsStyle="primary" className="center-block"
            name="submit-button"
            formNoValidate={true} type="submit"
            disabled={this.state.loading}>
            { this.state.loading ? 'Verifying Payment': 'Add Bank Payment'}
          </Button>
        </fieldset>
        { this.state.msg ?
          <Row>
            <Alert bsStyle="danger">
              {this.state.msg}
            </Alert>
          </Row>
          : ''
        }
      </FRC.Form>
  }
}

export default PaymentACH;
