import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import request from 'request-promise'
import { Alert, Badge, Row, Button, Col, Label } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap';
import { RequestConfig } from '../Config'


class WithdrawalTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      page: 1,
      dataTotalSize: 0,
      sizePerPage: 10,
      msg: '',
    };
  }

  componentDidMount() {
    const requestInstance = request.defaults(RequestConfig);
    const self = this;
    requestInstance.get('/api/withdrawals/total/').then( (response) => {
      self.setState({'totalWithdraw': response.total})
    });
    requestInstance.get('/api/invoices/balance/').then( (response) => {
      self.setState({
        'totalEarn': response.total,
        'totalPending': response.pending
      });
    });
    this.loadData(this.state.page, this.state.sizePerPage);
  }

  /**
   * Load remote data to fill table.
   * @return {[type]} [description]
   */
  loadData(page, sizePerPage) {
    const self = this;
    const requestInstance = request.defaults(RequestConfig);
    return requestInstance.get(`/api/withdrawals/?page=${page}&page_size=${sizePerPage}`).then( (response) => {
      self.setState({
        data: response.results,
        dataTotalSize: response.count,
        page: page,
        sizePerPage: sizePerPage,
        msg: ''
      });
      return response;
    }).catch(function (err) {
      self.setState({
        msg: err.error
      })
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

  render() {
    const options = {
      onPageChange: this.handlePageChange.bind(this),
      onSizePerPageList: this.handleSizePerPageChange.bind(this),
      page: this.state.page,
      sizePerPage: this.state.sizePerPage,
    };
    const availableBalance = this.state.totalEarn - this.state.totalPending - this.state.totalWithdraw;
    return (
      <Row>
        <Col md={1}/>
        <Col md={10}>
          <h3 className="text-center">Withdrawals</h3>
          <Row>
            <Col sm={4}>
              <h4><Label bsStyle="info">Earned: <Badge>${this.state.totalEarn}</Badge></Label></h4>
            </Col>
            <Col sm={4}>
              <h4><Label bsStyle="warning">Pending: <Badge>${this.state.totalPending}</Badge></Label></h4>
            </Col>
            <Col sm={4}>
              <h4><Label bsStyle="success">Available: <Badge>${availableBalance ? availableBalance : 0}</Badge></Label></h4>
            </Col>
          </Row>
          <Row>
            <Col sm={2}>
              <LinkContainer to={'/withdrawals/create/'}>
                <Button bsStyle="primary" block disabled={!(availableBalance > 0)}>
                  <i className='fa fa-plus fa-lg'/> Create Withdrawal
                </Button>
              </LinkContainer>
            </Col>
          </Row>

          <BootstrapTable
            data={this.state.data}
            remote={true}
            pagination={true}
            options={ options }
            fetchInfo={{dataTotalSize: this.state.dataTotalSize}}
            striped={true}
            hover={true}>
              <TableHeaderColumn dataField="id" isKey={true} dataFormat={ this.idLinkFormatter }>Withdrawal ID</TableHeaderColumn>
              <TableHeaderColumn dataField="status">Status</TableHeaderColumn>
              <TableHeaderColumn dataField="amount">Amount</TableHeaderColumn>
              <TableHeaderColumn dataField="method">Method</TableHeaderColumn>
              <TableHeaderColumn dataField="date_created" dataFormat={ this.dateFormatter }>Created</TableHeaderColumn>
          </BootstrapTable>
          { this.state.msg ?
            <Row>
                <Alert bsStyle="danger">
                  {this.state.msg}
                </Alert>
            </Row>
            : ''
          }
        </Col>
      </Row>
    );
  }
}

export default WithdrawalTable;
