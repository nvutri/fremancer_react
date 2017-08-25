import React, { Component } from 'react';
import request from 'request-promise'
import { Button, Col, Row } from 'react-bootstrap'
import FontAwesome from 'react-fontawesome';
import { LinkContainer } from 'react-router-bootstrap';
import { RequestConfig } from '../Config';
import ContractListItem from './ContractListItem';

class ContractList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
  }

  componentDidMount() {
    const self = this;
    const requestInstance = request.defaults(RequestConfig);
    requestInstance.get('/api/contracts/').then(function (response) {
      self.setState({
        contracts: response,
        loading: false
      });
      return response;
    }).catch(function (err) {
      console.log(err);
    });
  }

  render() {
    return (
      <Row>
        <Col md={2}/>
        <Col md={8}>
          {
            this.state.loading ?
              <h3 className="text-center">Loading Contracts...</h3>
            : this.state.contracts && this.state.contracts.length > 0 ?
              <div>
                <LinkContainer to={'/contracts/create/'}>
                  <Button
                    bsStyle="primary"
                    className="block-center">
                    <FontAwesome name='plus' size='lg'/>
                    {' Create Contract '}
                  </Button>
                </LinkContainer>
                {
                  this.state.contracts.map( contract => <ContractListItem key={`contract_${contract.id}`} {...contract}/>)
                }
              </div> :
              <LinkContainer to={'/contracts/create/'} className="center-block">
                <Button
                  bsStyle="primary"
                  bsSize="large"
                  className="center-block">
                  <FontAwesome name='plus' size='lg'/>
                  {' Create Your First Contract '}
                </Button>
              </LinkContainer>
          }
        </Col>
      </Row>
    );
  }
}

export default ContractList;
