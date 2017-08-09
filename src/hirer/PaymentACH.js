import request from 'request-promise'
import update from 'react-addons-update';

import React, { Component } from 'react';
import {Row, Jumbotron, Button, Col, Alert} from 'react-bootstrap'
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
      loading: true,
      validationErrors: {},
      msg: ''
    };
  }
  createACHSource(token) {
    const requestInstance = request.defaults(RequestConfig);
    const self = this;
    return requestInstance.post('/api/invoices/create_payment/').form(token).then( (res) => {
      console.log(res);
    });
  }
  submit(formData) {
    const self = this;
    const data = update(formData, {$merge: {
      country: 'US',
      currency: 'usd'
    }});
    return stripe.createToken({'bank_account': data})
      .then( result => result.json())
      .then( result => {
        if (result.object === 'token') {
          self.createACHSource(result);
        } else {
          self.setState({
            validationErrors: result.error,
            msg: result.error.message
          });
        }
        return result;
      }).catch( response => {
        self.setState(
          msg: response.error
        )
      });
  }
  render() {
    return <FRC.Form
      onValidSubmit={this.submit.bind(this)}
      validationErrors={this.state.validationErrors}>
      <fieldset>
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
            formNoValidate={true} type="submit">
            <FontAwesome name='plus' size='lg'/>
            {' Add Bank Account '}
            <FontAwesome name='bank' size='lg'/>
          </Button>
        </fieldset>
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
      </FRC.Form>
  }
}

export default PaymentACH;
