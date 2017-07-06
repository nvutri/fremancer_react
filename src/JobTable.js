import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

class JobTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }

  componentDidMount() {
    const self = this;
    fetch('/api/contracts/').then((response) => response.json()).then(
      (response) => {
        self.setState({data: response.results})
      }
    )
  }
  render() {
    return (
      <BootstrapTable data={this.state.data} striped={true} hover={true}>
          <TableHeaderColumn dataField="id" isKey={true} dataAlign="center" dataSort={true}>Job ID</TableHeaderColumn>
          <TableHeaderColumn dataField="name" dataSort={true}>Name</TableHeaderColumn>
          <TableHeaderColumn dataField="description" dataSort={true}>Description</TableHeaderColumn>
          <TableHeaderColumn dataField="hourly_rate" dataSort={true}>Rate</TableHeaderColumn>
          <TableHeaderColumn dataField="total_budget" dataSort={true}>Budget</TableHeaderColumn>
      </BootstrapTable>
    );
  }
}

export default JobTable;
