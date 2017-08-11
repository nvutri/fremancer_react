import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import request from 'request-promise'
import {Row, Jumbotron, Button, Col, Modal} from 'react-bootstrap'
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
        <a href="#">{row.start_date}</a>
      </LinkContainer>
  }

  contractLinkFormatter(cell, row) {
    return <LinkContainer to={`/contracts/${row.contract}/`}>
      <a href="#">{cell}</a>
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
      <Jumbotron>
        <Row>
          <Col md={2}></Col>
          <Col md={8}>
            <LinkContainer to="/timesheets/create/">
              <Button bsStyle="primary">Create TimeSheet</Button>
            </LinkContainer>
            <BootstrapTable
              data={this.state.data} striped={true} hover={true}>
                <TableHeaderColumn dataField="id" isKey={true}>TimeSheet ID</TableHeaderColumn>
                <TableHeaderColumn dataField="contract">Contract ID</TableHeaderColumn>
                <TableHeaderColumn dataField="start_date" dataFormat={ this.linkFormatter } dataSort={true} >Week</TableHeaderColumn>
                <TableHeaderColumn dataField="summary" dataSort={true}>Summary</TableHeaderColumn>
                <TableHeaderColumn dataField="total_hours" dataSort={true}>Total Hours</TableHeaderColumn>
                <TableHeaderColumn dataField="total_amount" dataSort={true}>Amount</TableHeaderColumn>
            </BootstrapTable>
          </Col>
        </Row>
      </Jumbotron>
    );
  }
}

export default TimeSheetTable;
