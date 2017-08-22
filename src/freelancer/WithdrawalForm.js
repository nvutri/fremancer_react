import request from 'request-promise';
import update from 'react-addons-update';

import React, { Component } from 'react';
import { Alert, Badge, Row, Button, Col, Label, Panel, Well } from 'react-bootstrap'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import FRC from 'formsy-react-components';

import { LinkContainer } from 'react-router-bootstrap';
import { RequestConfig } from '../Config'

class WithdrawalForm extends Component {
  constructor(props) {
    super(props);
    this.MIN_AMOUNT = 5.00;
    this.MAX_AMOUNT = 5000;
    this.state = {
      validationErrors: {},
      fee: this.MIN_AMOUNT,
      isValid: true,
      method: 'wu',
    };
    this.methodConfig = {
      'wu': {
        'label': 'Western Union',
        'fee': 5.00
      },
      'paypal': {
        'label': 'PayPal',
        'fee': 3.00
      }
    }
    this.withdrawalMethods = [
      {'value': 'wu', 'label': 'Western Union'},
      {'value': 'paypal', 'label': 'PayPal'},
    ];
  }
  componentDidMount() {
    const requestInstance = request.defaults(RequestConfig);
    const self = this;
    requestInstance.get('/api/withdrawals/balance/').then( (response) => {
      const newState = update(response, {$merge: {
        'amount': response.available - self.state.fee,
        'total_amount': response.available
      }});
      self.setState(newState)
    });
  }
  submit(data) {
    data['freelancer'] = this.props.user.id;
    // Create a new withdrawal.
    this.setState({saving: true});
    const self = this;
    const requestInstance = request.defaults(RequestConfig);
    return requestInstance.post('/api/withdrawals/').form(data).then( (response) => {
      self.props.history.push('/withdrawals/');
      return response;
    }).catch(function (err) {
      self.setState({
        saving: false,
        validationErrors: err.error,
        msg: err.message
      });
    });
  }

  handleAmountChange(e) {
    const newAmount = parseFloat(e.target.value);
    if (newAmount) {
      this.setState({
        amount: newAmount,
        total_amount: newAmount + this.state.fee,
        isValid: newAmount >= this.MIN_AMOUNT && newAmount <= this.MAX_AMOUNT
      })
    } else {
      this.setState({
        amount: e.target.value,
        total_amount: this.state.fee,
        isValid: false
      })
    }
  }

  handleSelectChange(name, value) {
    const newFee = this.methodConfig[value].fee;
    this.setState({
      'method': value,
      'fee': newFee,
      'total_amount': this.state.amount + newFee
    })
  }

  render() {
    const panelHeader = <h2 className="text-center">Withdrawal Create</h2>
    return (
      <Row>
        <Col md={3}/>
        <Col md={6}>
          <Row>
            <Col sm={4}>
              <h3><Label bsStyle="info">Balance: <Badge>${this.state.balance}</Badge></Label></h3>
            </Col>
            <Col sm={4}>
              <h3><Label bsStyle="warning">Pending: <Badge>${this.state.pending}</Badge></Label></h3>
            </Col>
            <Col sm={4}>
              <h3><Label bsStyle="success">Available: <Badge>${this.state.available}</Badge></Label></h3>
            </Col>
          </Row>
          <Panel header={panelHeader} bsStyle="info">
            <FRC.Form
              onSubmit={this.submit.bind(this)}
              validationErrors={this.state.validationErrors}>
              <FRC.Select
                name="method"
                label="Method"
                options={this.withdrawalMethods}
                value={this.state.method}
                onChange={this.handleSelectChange.bind(this)}
              />
              <FRC.Input
                name="amount"
                label="Amount"
                type="number"
                placeholder="Amount"
                validations="isNumeric"
                addonBefore="$"
                min={this.MIN_AMOUNT}
                max={this.state.available}
                onKeyUp={this.handleAmountChange.bind(this)}
                value={this.state.amount}
              />
              <FRC.Input
                name="fee"
                label={`${this.methodConfig[this.state.method].label} Fee`}
                type="number"
                value={this.state.fee}
                addonBefore="$"
                disabled
              />
              <FRC.Input
                name="total_amount"
                label="Total Amount"
                type="number"
                min={this.MIN_AMOUNT}
                max={this.state.available}
                value={this.state.total_amount}
                addonBefore="$"
                disabled
              />
              <hr/>
              <Well>
                <p className="text-center"><strong>Recipient Information</strong></p>
                <FRC.Input
                  name="first_name"
                  label="First Name"
                  placeholder="First Name"
                  value={this.props.user.first_name}
                  validations="minLength:2"
                />
                <FRC.Input
                  name="last_name"
                  label="Last Name"
                  placeholder="Last Name"
                  value={this.props.user.last_name}
                  validations="minLength:2"
                />
                <FRC.Input
                  name="email"
                  label="Email"
                  placeholder="Email"
                  value={this.props.user.email}
                  validations="isEmail"
                />
                <FRC.Input
                  name="phone_number"
                  label="Phone Number"
                  placeholder="Phone Number"
                  value={this.props.user.phone_number}
                />
              </Well>
              <Button bsStyle={this.state.saving || !this.state.isValid ? "warning" : "primary"}
                id="save-button"
                block={true}
                formNoValidate={true}
                type="submit"
                disabled={ this.state.saving || !this.state.isValid }>
                {this.state.saving ? 'Submitting' : this.state.isValid ? 'Submit Withdrawal Request': 'Invalid Amount. Please Fix'}
              </Button>
            </FRC.Form>
            { this.state.msg ?
              <Row>
                  <Alert bsStyle="danger">
                    {this.state.msg}
                  </Alert>
              </Row>
              : ''
            }
          </Panel>
        </Col>
      </Row>
    );
  }
}

export default WithdrawalForm;
