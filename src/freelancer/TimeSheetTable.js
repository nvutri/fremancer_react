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
      data: []
    };
  }

  componentDidMount() {
    const self = this;
    const requestInstance = request.defaults(RequestConfig);
    requestInstance.get('/api/timesheets/').then(function (response) {
      self.setState({data: response.results});
      return response;
    }).catch(function (err) {
      console.log(err);
    });
  }

  linkFormatter(cell, row) {
    return (
      <LinkContainer to={`/timesheets/${row.id}/`}>
        <a href="#">{row.start_date}</a>
      </LinkContainer>
    );
  }

  render() {
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
