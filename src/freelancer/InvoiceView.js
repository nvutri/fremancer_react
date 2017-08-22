import request from 'request-promise';
import update from 'react-addons-update'; // ES6

import React, { Component } from 'react';
import { Alert, Button, Col, ControlLabel, Jumbotron, Label, Panel, Row } from 'react-bootstrap'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import FRC from 'formsy-react-components';

import { LinkContainer } from 'react-router-bootstrap';
import { RequestConfig } from '../Config'

class InvoiceForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contract : {},
      contractOptions : [],
      timesheets: [],
      id: props.match.params.id
    };
    this.timesheetTable = {};
  }
  /**
   * Get related data of this Contract post.
   * @return {Promise} a promise of the given AJAX data.
   */
  loadInvoice() {
    const self = this;
    const requestInstance = request.defaults(RequestConfig);
    requestInstance.get(`/api/invoices/${this.state.id}/`).then( (response) => {
      const newState = update(response, {$merge: {
        contract: response.contract_data,
        timesheets: response.timesheets_data
      }});
      self.setState(newState);
      return response;
    }).catch( (err) => {
      self.setState({msg: err.error});
    });
  }

  componentDidMount() {
    this.loadInvoice();
  }

  componentWillReceiveProps() {
    this.loadInvoice();
  }

  timesheetLinkFormatter(cell, row) {
    return <LinkContainer to={`/timesheets/${row.id}/`}>
        <a href="#">{row.start_date}</a>
      </LinkContainer>
  }

  render() {
    const panelHeader = <h3 className="text-center">
      Invoice #{this.state.id ? this.state.id : ''}
      <Label bsStyle="info" className="pull-right">{this.state.status}</Label>
    </h3>
    return (
      <Row>
        <Col md={3}/>
        <Col md={6}>
          <Panel header={panelHeader} bsStyle={this.state.paid ? 'success': 'primary'}>
            <FRC.Form>
              <FRC.Row>
                <Col componentClass={ControlLabel} sm={3}>
                  Contract
                </Col>
                <Col sm={9}>
                  <LinkContainer className="form-control" to={`/contracts/${this.state.contract.id}/`}>
                    <a href="#">{this.state.contract.title}</a>
                  </LinkContainer>
                </Col>
              </FRC.Row>
              <FRC.Input
                name="hirer"
                label="Hirer"
                value={this.state.contract.hirer_name}
                disabled
                />
              <FRC.Input
                name="freelancer"
                label="Freelancer"
                value={this.state.contract.freelancer_name}
                disabled
                />
              <Row>
                <Col sm={1}/>
                <Col sm={10}>
                  <BootstrapTable
                    ref={ (instance) => {this.timesheetTable = instance} }
                    data={this.state.timesheets}
                    pagination={false}
                    striped={true}
                    hover={true}>
                    <TableHeaderColumn dataField="id" isKey={true} hidden>ID</TableHeaderColumn>
                    <TableHeaderColumn dataField="start_date" dataFormat={ this.timesheetLinkFormatter }>Timesheet Week</TableHeaderColumn>
                    <TableHeaderColumn dataField="summary">Summary</TableHeaderColumn>
                    <TableHeaderColumn dataField="total_hours">Hours</TableHeaderColumn>
                    <TableHeaderColumn dataField="total_amount">Amount</TableHeaderColumn>
                    <TableHeaderColumn dataField="status">Status</TableHeaderColumn>
                  </BootstrapTable>
                </Col>
              </Row>
              <hr/>
              <FRC.Input
                name="total_hours"
                label="Total Hours"
                value={this.state.total_hours}
                addonAfter="hours"
                disabled
              />
              <FRC.Input
                name="hourly_rate"
                label="Hourly Rate"
                value={this.state.contract.hourly_rate}
                addonBefore="$"
                addonAfter="per hour"
                disabled
              />
              <FRC.Input
                name="amount"
                label="Amount"
                value={this.state.amount}
                addonBefore="$"
                disabled
              />
              <FRC.Input
                name="fee"
                label="Fee"
                value={this.state.fee}
                addonBefore="$"
                disabled
              />
              <FRC.Input
                name="total_amount"
                label="Total Amount"
                value={this.state.total_amount}
                addonBefore="$"
                disabled
              />
            </FRC.Form>
          </Panel>
        </Col>
      </Row>
    );
  }
}

export default InvoiceForm;
