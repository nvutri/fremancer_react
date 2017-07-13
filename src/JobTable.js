import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import request from 'request-promise'
import {Row, Jumbotron, Button, Col, Modal} from 'react-bootstrap'


class JobTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }

  componentDidMount() {
    const self = this;
    const requestInstance = request.defaults(this.props.requestConfig);
    requestInstance.get('/api/contracts/').then(function (response) {
      self.setState({data: response.results});
      return response;
    }).catch(function (err) {
      console.log(err);
    });
  }

  render() {
    const selectRow = {
      clickToSelect: true
    };
    return (
      <Jumbotron>
        <Row>
          <Col md={2}></Col>
          <Col md={8}>
            <a role="button" href="/postjobs">Create Job</a>
            <BootstrapTable
              data={this.state.data} striped={true} hover={true}
              selectRow={ selectRow }
            >
                <TableHeaderColumn dataField="id" isKey={true} dataAlign="center" dataSort={true}>Job ID</TableHeaderColumn>
                <TableHeaderColumn dataField="name" dataSort={true}>Name</TableHeaderColumn>
                <TableHeaderColumn dataField="description" dataSort={true}>Description</TableHeaderColumn>
                <TableHeaderColumn dataField="hourly_rate" dataSort={true}>Rate</TableHeaderColumn>
                <TableHeaderColumn dataField="total_budget" dataSort={true}>Budget</TableHeaderColumn>
            </BootstrapTable>
          </Col>
        </Row>
      </Jumbotron>
    );
  }
}

export default JobTable;
