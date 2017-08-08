import request from 'request-promise'

import React, { Component } from 'react';
import {Row, Jumbotron, Button, Col} from 'react-bootstrap'
import StripeCheckout from 'react-stripe-checkout';

import { RequestConfig, StripePublicKey } from '../Config';

class Payment extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  onToken(token) {
    const requestInstance = request.defaults(RequestConfig);
    const self = this;
    return requestInstance.post('/api/invoices/stripe/').form(token).then( (res) => {
      console.log(res);
    });
  }
  render() {
    return (
      <StripeCheckout
        name="Fremancer" // the pop-in header title
        description="Fremancer Payments" // the pop-in header subtitle
        ComponentClass="div"
        panelLabel="Add Payment" // prepended to the amount in the bottom pay button
        amount={0} // cents
        currency="USD"
        stripeKey={StripePublicKey}
        email={this.props.user ? this.props.user.email: ''}
        billingAddress={true}
        allowRememberMe // "Remember Me" option (default true)
        token={this.onToken.bind(this)}>
          <button className="btn btn-primary">
            Add Credit Card Payment
          </button>
      </StripeCheckout>
    );
  }
}

export default Payment;
