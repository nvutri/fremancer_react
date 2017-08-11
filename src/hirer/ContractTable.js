import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import request from 'request-promise'
import {Row, Jumbotron, Button, Col, Modal} from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap';
import { RequestConfig } from '../Config'

class ContractTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }

  componentDidMount() {
    const self = this;
    const requestInstance = request.defaults(RequestConfig);
    if (this.props.user) {
      requestInstance.get('/api/contracts/').then(function (response) {
        self.setState({data: response});
        return response;
      }).catch(function (err) {
        console.log(err);
      });
    }
  }

  linkFormatter(cell, row) {
    return (
      <LinkContainer to={`/contracts/${row.id}/`}>
        <a href="#">{row.title}</a>
      </LinkContainer>
    );
  }

  render() {
    return (
      <Row>
        <Col md={2}></Col>
        <Col md={8}>
          <BootstrapTable
            data={this.state.data} striped={true} hover={true}>
              <TableHeaderColumn dataField="id" isKey={true} hidden>Contract ID</TableHeaderColumn>
              <TableHeaderColumn dataField="title" dataFormat={ this.linkFormatter }>Contract</TableHeaderColumn>
              <TableHeaderColumn dataField="description">Description</TableHeaderColumn>
              <TableHeaderColumn dataField="hourly_rate">Rate</TableHeaderColumn>
              <TableHeaderColumn dataField="total_budget">Budget</TableHeaderColumn>
              <TableHeaderColumn dataField="freelancer_name">Freelancer</TableHeaderColumn>
          </BootstrapTable>
        </Col>
      </Row>
    );
  }
}

export default ContractTable;
