import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import request from 'request-promise'
import { Row, Col } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap';
import { RequestConfig } from '../Config'


class TimeSheetTable extends Component {
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
    requestInstance.get(`/api/timesheets/?page=${page}&page_size=${sizePerPage}`).then(function (response) {
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

  timesheetLinkFormatter(cell, row) {
    return <LinkContainer to={`/timesheets/${row.id}/`}>
        <a href="#timesheet">{row.start_date}</a>
      </LinkContainer>
  }

  contractLinkFormatter(cell, row) {
    return <LinkContainer to={`/contracts/${row.contract}/`}>
      <a href="#contract">{cell}</a>
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
        <Col md={2}></Col>
        <Col md={8}>
          <BootstrapTable
            data={this.state.data}
            remote={true}
            pagination={true}
            options={ options }
            fetchInfo={{dataTotalSize: this.state.dataTotalSize}}
            striped={true}
            hover={true}>
              <TableHeaderColumn dataField="start_date" dataFormat={ this.timesheetLinkFormatter }>Week</TableHeaderColumn>
              <TableHeaderColumn dataField="id" isKey={true} hidden>ID</TableHeaderColumn>
              <TableHeaderColumn dataField="contract_title" dataFormat={ this.contractLinkFormatter }>Contract</TableHeaderColumn>
              <TableHeaderColumn dataField="summary">Summary</TableHeaderColumn>
              <TableHeaderColumn dataField="total_hours">Total Hours</TableHeaderColumn>
              <TableHeaderColumn dataField="total_amount">Amount</TableHeaderColumn>
              <TableHeaderColumn dataField="status">Status</TableHeaderColumn>
          </BootstrapTable>
        </Col>
      </Row>
    );
  }
}

export default TimeSheetTable;
