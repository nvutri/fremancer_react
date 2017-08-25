import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import request from 'request-promise'
import { Button, Col, Row } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap';
import { RequestConfig } from '../Config'


class InvoiceTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      page: 1,
      dataTotalSize: 0,
      sizePerPage: 10
    };
  }

  componentDidMount() {
    this.loadData(this.state.page, this.state.sizePerPage);
  }

  /**
   * Load remote data to fill table.
   * @return {[type]} [description]
   */
  loadData(page, sizePerPage) {
    const self = this;
    const requestInstance = request.defaults(RequestConfig);
    requestInstance.get(`/api/invoices/?page=${page}&page_size=${sizePerPage}`).then(function (response) {
      self.setState({
        data: response.results,
        dataTotalSize: response.count,
        page: page,
        sizePerPage: sizePerPage
      });
      return response;
    }).catch(function (err) {
      console.log(err);
    });
  }

  handlePageChange(page, sizePerPage) {
    this.loadData(page, sizePerPage);
  }

  handleSizePerPageChange(sizePerPage) {
    // When changing the size per page always navigating to the first page
    this.loadData(1, sizePerPage);
  }

  dateFormatter(cell, row) {
    const options = {
        weekday: "short", year: "numeric", month: "short",
        day: "numeric", hour: "2-digit"
    };
    const d = new Date(row.date_created);
    return d.toLocaleDateString("en-US", options);
  }

  idLinkFormatter(cell, row) {
    return <LinkContainer to={`/invoices/${cell}/`}>
      <a href={`/invoices/${cell}/`}>Invoice #{cell}</a>
    </LinkContainer>
  }

  contractLinkFormatter(cell, row) {
    return <LinkContainer to={`/contracts/${cell}/`}>
      <a href={`/contracts/${cell}/`}>{row.contract_data.title}</a>
    </LinkContainer>
  }

  render() {
    const options = {
      onPageChange: this.handlePageChange.bind(this),
      onSizePerPageList: this.handleSizePerPageChange.bind(this),
      page: this.state.page,
      sizePerPage: this.state.sizePerPage,
    };
    return (
      <Row>
        <Col md={1}/>
        <Col md={10}>
          <Row>
            <Col sm={2}>
              <LinkContainer to={'/invoices/create/'}>
                <Button bsStyle="primary" block>
                  <i className='fa fa-plus fa-lg'/> Create Invoice
                </Button>
              </LinkContainer>
            </Col>
          </Row>
          <h3 className="text-center">Invoices</h3>
          <BootstrapTable
            data={this.state.data}
            remote={true}
            pagination={true}
            options={ options }
            fetchInfo={{dataTotalSize: this.state.dataTotalSize}}
            striped={true}
            hover={true}>
              <TableHeaderColumn dataField="id" isKey={true} dataFormat={ this.idLinkFormatter }>Invoice ID</TableHeaderColumn>
              <TableHeaderColumn dataField="status">Status</TableHeaderColumn>
              <TableHeaderColumn dataField="total_hours">Total Hours</TableHeaderColumn>
              <TableHeaderColumn dataField="amount">Amount</TableHeaderColumn>
              <TableHeaderColumn dataField="date_created" dataFormat={ this.dateFormatter }>Created</TableHeaderColumn>
              <TableHeaderColumn dataField="contract" dataFormat={ this.contractLinkFormatter }>Contract</TableHeaderColumn>
          </BootstrapTable>
        </Col>
      </Row>
    );
  }
}

export default InvoiceTable;
