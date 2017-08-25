import request from 'request-promise';
import update from 'react-addons-update';

import React, { Component } from 'react';
import { Alert, Badge, Row, Button, Col, ControlLabel, Label, Panel, Well } from 'react-bootstrap'
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import FRC from 'formsy-react-components';

import { RequestConfig } from '../Config'

class WithdrawalForm extends Component {
  constructor(props) {
    super(props);
    this.MIN_AMOUNT = 5.00;
    this.MAX_AMOUNT = 5000;
    this.state = {
      validationErrors: {},
      isValid: true,
      method: 'wu',
      country: props.user.country,
      region: props.user.region
    };
    this.UNKNOWN_FEE = 'TBD';
    this.methodConfig = {
      'wu': {
        'label': 'Western Union',
        'fee': this.UNKNOWN_FEE
      },
      'paypal': {
        'label': 'PayPal',
        'fee': this.UNKNOWN_FEE
      }
    }
    this.withdrawalMethods = [
      {'value': 'wu', 'label': 'Western Union'},
    ];
    this.receiveMethodOptions = [
      {'value': 'cash', 'label': 'Cash At Location'},
      {'value': 'bank', 'label': 'Bank Account'}
    ]
  }
  componentDidMount() {
    const requestInstance = request.defaults(RequestConfig);
    const self = this;
    requestInstance.get('/api/withdrawals/balance/').then( (response) => {
      const newState = update(response, {$merge: {
        'total_amount': response.available
      }});
      self.setState(newState)
    });
  }
  submit(formData) {
    const data = update(formData, {$merge: {
      freelancer: this.props.user.id,
      country: this.state.country,
      region: this.state.region,
      fee: this.state.fee === this.UNKNOWN_FEE ? '' : this.state.fee
    }});
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

  handleMethodChange(name, value) {
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
              <FRC.Input
                name="total_amount"
                label="Total Amount"
                type="number"
                validations="isNumeric"
                addonBefore="$"
                min={this.MIN_AMOUNT}
                max={this.state.available}
                value={this.state.total_amount}
              />
              <FRC.Input
                name="fee"
                label={`${this.methodConfig[this.state.method].label} Fee`}
                value={this.state.fee ? this.state.fee : this.UNKNOWN_FEE}
                addonBefore="$"
                disabled
              />
              <FRC.Select
                name="method"
                label="Method"
                options={this.withdrawalMethods}
                value={this.state.method}
                onChange={this.handleMethodChange.bind(this)}
              />
              <FRC.Select
                name="receive_method"
                label="Receive Method"
                options={this.receiveMethodOptions}
                value={this.state.receive_method}
                onChange={ (name, value) => this.setState({receive_method: value})}
              />
              {
                this.state.receive_method === 'bank' ?
                  <fieldset>
                    <FRC.Input
                      name="bank_iban"
                      label="Bank IBAN"
                      placeholder="Bank IBAN"
                    />
                    <FRC.Input
                      name="bank_swift"
                      label="Bank SWIFT/BIC"
                      placeholder="Bank SWIFT/BIC"
                    />
                    <FRC.Input
                      name="bank_number"
                      label="Account Number"
                      placeholder="Bank Account Number"
                    />
                  </fieldset>:
                  ''
              }
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
                <Row>
                  <Col sm={3} componentClass={ControlLabel}>
                    Country
                  </Col>
                  <Col sm={9}>
                    <CountryDropdown
                      classes="form-control"
                      value={this.state.country}
                      onChange={(val) => this.setState({country: val})}/>
                  </Col>
                </Row>
                <Row>
                  <Col sm={3} componentClass={ControlLabel}>
                    Region
                  </Col>
                  <Col sm={9}>
                    <RegionDropdown
                      classes="form-control"
                      country={this.state.country}
                      value={this.state.region}
                      onChange={(val) => this.setState({region: val})}/>
                  </Col>
                </Row>
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
