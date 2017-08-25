import React, { Component } from 'react';
import request from 'request-promise'
import { Col, Row } from 'react-bootstrap'
import { RequestConfig } from '../Config';
import ContractListItem from './ContractListItem';

class ContractList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contracts: []
    };
  }

  componentDidMount() {
    const self = this;
    const requestInstance = request.defaults(RequestConfig);
    if (this.props.user) {
      requestInstance.get('/api/contracts/').then(function (response) {
        self.setState({contracts: response});
        return response;
      }).catch(function (err) {
        console.log(err);
      });
    }
  }

  render() {
    return (
      <Row>
        <Col md={2}/>
        <Col md={8}>
          {
            this.state.contracts.map( contract => <ContractListItem key={`contract_${contract.id}`} {...contract}/>)
          }
        </Col>
      </Row>
    );
  }
}

export default ContractList;
