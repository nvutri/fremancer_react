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
    this.state = {
      validationErrors: {},
    };
    this.withdrawalMethods = [
      {'value': 'wu', 'label': 'Western Union'},
    ];
  }
  componentDidMount() {
    const requestInstance = request.defaults(RequestConfig);
    const self = this;
    requestInstance.get('/api/withdrawals/balance/').then( (response) => {
      self.setState(response)
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
                value={this.withdrawalMethods[0].value}
              />
              <FRC.Input
                name="amount"
                label="Amount"
                type="number"
                placeholder="Amount"
                validations="isNumeric"
                addonBefore="$"
                value={this.state.available}
              />
              <FRC.Input
                name="fee"
                label="Fee"
                placeholder="Withdrawal Fee"
                value="5.00"
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
              <Button bsStyle="primary"
                id="save-button"
                block={true}
                formNoValidate={true}
                type="submit"
                disabled={ this.state.saving }>
                {this.state.saving ? 'Submitting' :'Submit Withdrawal Request'}
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
