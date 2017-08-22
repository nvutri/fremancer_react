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
      account: {}
    };
  }

  componentDidMount() {
    const requestInstance = request.defaults(RequestConfig);
    const self = this;
    requestInstance.get('/api/withdrawals/balance/').then( (response) => {
      self.setState({'account': response})
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

  moneyFormatter(cell, row) {
    return cell != null ?  '$' + cell : 'TBD';
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
          <h2 className="text-center">Withdrawals</h2>
          <Row>
            <Col sm={4}>
              <h3><Label bsStyle="info">Balance: <Badge>${this.state.account.balance}</Badge></Label></h3>
            </Col>
            <Col sm={4}>
              <h3><Label bsStyle="warning">Pending: <Badge>${this.state.account.pending}</Badge></Label></h3>
            </Col>
            <Col sm={4}>
              <h3><Label bsStyle="success">Available: <Badge>${this.state.account.available}</Badge></Label></h3>
            </Col>
          </Row>
          <Row>
            <Col sm={2}>
              <LinkContainer to={'/withdrawals/create/'}>
                <Button bsStyle="primary" block disabled={!(this.state.account.available > 0)}>
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
              <TableHeaderColumn dataField="status_title">Status</TableHeaderColumn>
              <TableHeaderColumn dataField="total_amount" dataFormat={ this.moneyFormatter }>Total Amount</TableHeaderColumn>
              <TableHeaderColumn dataField="fee" dataFormat={ this.moneyFormatter }>Fee</TableHeaderColumn>
              <TableHeaderColumn dataField="receive" dataFormat={ this.moneyFormatter }>Receive Amount</TableHeaderColumn>
              <TableHeaderColumn dataField="method_name">Method</TableHeaderColumn>
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
