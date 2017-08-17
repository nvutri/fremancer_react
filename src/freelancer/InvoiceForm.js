import request from 'request-promise';
import update from 'react-addons-update'; // ES6

import React, { Component } from 'react';
import { Alert, Button, Col, ControlLabel, Row, Jumbotron, Panel } from 'react-bootstrap'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import FRC from 'formsy-react-components';

import { LinkContainer } from 'react-router-bootstrap';
import { RequestConfig } from '../Config'

class InvoiceForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hirer: this.props.user ? this.props.user.id : null,
      id: props.match && props.match.params ? props.match.params.id : undefined,
      validationErrors: {},
      contract : {},
      contractOptions : [],
      timesheetOptions: []
    };
    this.timesheetTable = {};
  }
  createInvoice(data) {
    const requestConfig = update(RequestConfig, {$merge: {
      useQuerystring: true
    }});
    const requestInstance = request.defaults(requestConfig);
    const self = this;
    // Update an existing Contract by PUT request with the ID..
    const url = `/api/invoices/${this.state.id}/`;
    return requestInstance.put(url).form(data).then( (response) => {
      self.props.history.push('/invoices/');
      return response;
    }).catch(function (err) {
      self.setState({
        validationErrors: err.error,
        msg: err.message
      });
    });
  }
  updateInvoice(data) {
    const self = this;
    const requestConfig = update(RequestConfig, {$merge: {
      useQuerystring: true
    }});
    const requestInstance = request.defaults(requestConfig);
    return requestInstance.post('/api/invoices/').form(data).then( (response) => {
      self.props.history.push('/invoices/');
      return response
    }).catch(function (err) {
      self.setState({
        validationErrors: err.error,
        msg: err.message
      });
    });
  }
  submit(formData) {
    const self = this;
    const data = update(formData, {$merge: {
      'hirer': this.state.contract.hirer,
      'freelancer': this.state.contract.freelancer,
      'timesheets': this.timesheetTable.state.selectedRowKeys
    }});
    if (this.state.id) {
      this.createInvoice(data);
    } else {
      this.updateInvoice(data);
    }
  }

  /**
   * Load timesheet ID of this week.
   * Create a new timesheet if needs to.
   * @return {[Promise]} A promise of the AJAX request for opening timesheet.
   */
  loadTimeSheets(contract) {
    const self = this;
    const requestInstance = request.defaults(RequestConfig);
    const url = `/api/timesheets/unpaid/?contract=${contract.id}`;
    return requestInstance.get(url).then(function (response) {
      self.setState({timesheetOptions: response});
      return response;
    }).catch(function (err) {
      self.setState({msg: err.error});
    });
  }

  loadContracts() {
    const self = this;
    const requestInstance = request.defaults(RequestConfig);
    return requestInstance.get('/api/contracts/').then( (response) => {
      if (response.length > 0) {
        const options = response.map( (option) => {
          return {
            'value': option.id,
            'label': `${option.title} - $${option.hourly_rate}/hour`
          }
        });
        const contract = response[0];
        self.setState({
          contractOptions: options,
          contracts: response,
          contract: contract
        });
        self.loadTimeSheets(contract);
      }
      return response;
    }).catch( (err) => {
      self.setState({msg: err.error});
    });
  }

  /**
   * Get related data of this Contract post.
   * @return {Promise} a promise of the given AJAX data.
   */
  componentDidMount() {
    if (this.state.id) {
      const self = this;
      const requestInstance = request.defaults(RequestConfig);
      requestInstance.get(`/api/invoices/${this.state.id}/`).then( (response) => {
        self.setState(response);
        return response;
      }).catch( (err) => {
        self.setState({msg: err.error});
      });
    } else {
      this.loadContracts();
    }
  }

  handleSelectChange(name, selectedID) {
    const selectedContract = this.state.contracts.find( item => item.id == selectedID );
    this.setState({
      contract: selectedContract
    });
    this.loadTimeSheets(selectedContract);
  }

  /**
   * Calculate total hours of all timesheets.
   * @return {[type]} [description]
   */
  calculateHours() {
    const selectedKeys = this.timesheetTable.state.selectedRowKeys;
    const selectedRows = this.state.timesheetOptions.filter((item) => selectedKeys.indexOf(item.id) > -1);
    var total_hours = 0.0;
    selectedRows.forEach( (row) => {
      total_hours += parseFloat(row.total_hours)
    });
    this.setState({
      total_hours: total_hours,
      total_amount: parseFloat(this.state.contract.hourly_rate) * total_hours
    });
  }

  /**
   * Calculate the new total hours and amount value.
   */
  onRowSelect(row) {
    setTimeout(this.calculateHours.bind(this), 100);
  }

  render() {
    const panelHeader = <h3 className="text-center">
      {this.state.id ? 'Invoice Edit' : 'Invoice Create'}
    </h3>
    return (
      <Row>
        <Col md={3}/>
        <Col md={6}>
          <Panel header={panelHeader} bsStyle="info">
            <FRC.Form
              onValidSubmit={this.submit.bind(this)}
              validationErrors={this.state.validationErrors}>
              <FRC.Select
                name="contract"
                label="Contract"
                options={this.state.contractOptions}
                value={this.state.contract.id}
                onChange={this.handleSelectChange.bind(this)}
              />
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
                <Col componentClass={ControlLabel} sm={3}>
                  Select TimeSheets
                </Col>
              </Row>
              <Row>
                <BootstrapTable
                  ref={ (instance) => {this.timesheetTable = instance} }
                  data={this.state.timesheetOptions}
                  pagination={false}
                  striped={true}
                  hover={true}
                  selectRow={{
                    mode: 'checkbox',
                    clickToSelect: true,
                    onSelect: this.onRowSelect.bind(this),
                    onSelectAll: this.onRowSelect.bind(this)
                  }}>
                  <TableHeaderColumn dataField="id" isKey={true} hidden>ID</TableHeaderColumn>
                  <TableHeaderColumn dataField="summary">Summary</TableHeaderColumn>
                  <TableHeaderColumn dataField="total_hours">Hours</TableHeaderColumn>
                  <TableHeaderColumn dataField="total_amount">Amount</TableHeaderColumn>
                  <TableHeaderColumn dataField="status">Status</TableHeaderColumn>
                </BootstrapTable>
              </Row>
              <hr/>
              <FRC.Input
                name="total_hours"
                label="Total Hours"
                value={this.state.total_hours}
                disabled
              />
              <FRC.Input
                name="hourly_rate"
                label="Hourly Rate"
                value={this.state.contract.hourly_rate}
                disabled
              />
              <FRC.Input
                name="total_amount"
                label="Total Amount"
                value={this.state.total_amount}
                disabled
              />
              <Button bsStyle="primary"
                id="save-button"
                block={true}
                formNoValidate={true}
                type="submit"
                disabled={ this.state.saving }>
                {this.state.saving ? 'Saving' : this.state.id ? 'Save' : 'Create'}
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

export default InvoiceForm;
