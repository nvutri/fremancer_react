import request from 'request-promise'

import React, { Component } from 'react';
import {Row, Jumbotron, Button, Col, Table, Alert} from 'react-bootstrap'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import StripeCheckout from 'react-stripe-checkout';
import FontAwesome from 'react-fontawesome';
import { RequestConfig, StripePublicKey } from '../Config';

class Payment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      payments: null,
      loading: true
    };
  }
  componentDidMount() {
    this.loadPaymentOptions();
  }
  loadPaymentOptions() {
    const requestInstance = request.defaults(RequestConfig);
    const url = '/api/invoices/list_payments/';
    const self = this;
    this.setState({loading:true});
    return requestInstance.get(url).then( (response) => {
      self.setState({
        loading: false,
        payments: response.data
      })
    });
  }
  onToken(token) {
    const requestInstance = request.defaults(RequestConfig);
    const self = this;
    return requestInstance.post('/api/invoices/create_payment/').form(token).then( (res) => {
      self.loadPaymentOptions();
    });
  }
  render() {
    return (
      <Row>
        <Col sm={1}/>
        <Col sm={10}>
          <Row>
          { this.state.loading ?
            <Alert bsStyle="info" className="text-center">
              <FontAwesome name='spinner' size='lg'/>  Loading ...
              <FontAwesome name='spinner' size='lg'/>
            </Alert>:
            <BootstrapTable
              data={this.state.payments}
              striped={true}
              hover={true}>
                <TableHeaderColumn dataField="id" isKey={true} hidden></TableHeaderColumn>
                <TableHeaderColumn dataField="name">Card Name</TableHeaderColumn>
                <TableHeaderColumn dataField="last4">Card Number</TableHeaderColumn>
                <TableHeaderColumn dataField="exp">Expiration</TableHeaderColumn>
            </BootstrapTable>
          }
          </Row>
          <Row>
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
                <button className="btn btn-primary center-block">
                  <FontAwesome name='plus' size='lg'/>
                  {this.state.payments ? ' Add Credit Card ' : ' Add Your First Credit Card '}
                  <FontAwesome name='credit-card' size='lg'/>
                </button>
            </StripeCheckout>
          </Row>
        </Col>
      </Row>
    );
  }
}

export default Payment;
