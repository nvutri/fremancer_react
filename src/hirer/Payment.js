import request from 'request-promise'

import React, { Component } from 'react';
import {Alert, Button, Col, Modal, Row} from 'react-bootstrap'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import StripeCheckout from 'react-stripe-checkout';
import FontAwesome from 'react-fontawesome';
import { RequestConfig, StripePublicKey } from '../Config';
import PaymentACH from './PaymentACH';

class Payment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      payments: null,
      loading: false,
      showACH: false
    };
  }
  componentDidMount() {
    this.loadPaymentOptions();
  }
  loadPaymentOptions() {
    const requestInstance = request.defaults(RequestConfig);
    const url = '/api/payments/';
    const self = this;
    this.setState({loading:true});
    return requestInstance.get(url).then( (response) => {
      self.setState({
        loading: false,
        payments: response.data,
        showACH: false
      })
    });
  }
  onToken(token) {
    const requestInstance = request.defaults(RequestConfig);
    const self = this;
    return requestInstance.post('/api/payments/').form(token).then( (res) => {
      self.loadPaymentOptions();
    });
  }
  render() {
    let closeACH = () => this.setState({ showACH: false});
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
                <TableHeaderColumn dataField="brand">Card Type</TableHeaderColumn>
                <TableHeaderColumn dataField="name">Card Name</TableHeaderColumn>
                <TableHeaderColumn dataField="last4" dataFormat={(cell, row) => `...${cell}`}>Card Number</TableHeaderColumn>
                <TableHeaderColumn dataField="exp">Expiration</TableHeaderColumn>
            </BootstrapTable>
          }
          </Row>
          <hr/>
          <Row>
            <Col sm={3}/>
            <Col sm={3}>
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
                  <Button bsStyle="primary" block>
                    <FontAwesome name='plus' size='lg'/>
                    {this.state.payments ? ' Add Credit Card ' : ' Add Your First Credit Card '}
                    <FontAwesome name='credit-card' size='lg'/>
                  </Button>
              </StripeCheckout>
            </Col>
            <Col sm={3}>
              <Button
                bsStyle="primary"
                onClick={() => this.setState({ showACH: true})} block>
                <FontAwesome name='plus' size='lg'/>
                {' Add Bank Account '}
                <FontAwesome name='bank' size='lg'/>
              </Button>
              <Modal
                show={this.state.showACH}
                onHide={closeACH}>
                <Modal.Header closeButton>
                  <Modal.Title>Add Bank Account</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <PaymentACH
                    user={this.props.user}
                    loadPaymentOptions={this.loadPaymentOptions.bind(this)}
                  />
                </Modal.Body>
                <Modal.Footer>
                  <Button onClick={closeACH}>Close</Button>
                </Modal.Footer>
              </Modal>
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
}

export default Payment;
