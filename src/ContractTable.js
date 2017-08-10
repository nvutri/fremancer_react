import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import request from 'request-promise'
import {Row, Jumbotron, Button, Col, Modal} from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap';
import { RequestConfig } from './Config'

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
      const membership = this.props.user.membership;
      const url = `/api/contracts/?${membership}=${this.props.user.id}`
      requestInstance.get(url).then(function (response) {
        self.setState({data: response.results});
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
      <Jumbotron>
        <Row>
          <Col md={2}></Col>
          <Col md={8}>
            <BootstrapTable
              data={this.state.data} striped={true} hover={true}>
                <TableHeaderColumn dataField="id" isKey={true}>Contract ID</TableHeaderColumn>
                <TableHeaderColumn dataField="title" dataSort={true} dataFormat={ this.linkFormatter }>Name</TableHeaderColumn>
                <TableHeaderColumn dataField="description" dataSort={true}>Description</TableHeaderColumn>
                <TableHeaderColumn dataField="hourly_rate" dataSort={true}>Rate</TableHeaderColumn>
                <TableHeaderColumn dataField="total_budget" dataSort={true}>Budget</TableHeaderColumn>
                <TableHeaderColumn dataField="hirer" dataSort={true}>Hirer</TableHeaderColumn>
                <TableHeaderColumn dataField="freelancer" dataSort={true}>Freelancer</TableHeaderColumn>
            </BootstrapTable>
          </Col>
        </Row>
      </Jumbotron>
    );
  }
}

export default ContractTable;
