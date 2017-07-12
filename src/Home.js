import React, { Component } from 'react';
import {Row, Jumbotron, Button, Col, Modal} from 'react-bootstrap'
import request from 'request-promise'

import './App.css';
import LoginForm from './LoginForm'


class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      requestConfig: {
        baseUrl: 'http://localhost:8000',
        json: true
      }
    };
  }
  setAuth(requestConfig, user) {
    this.setState({
      requestConfig: requestConfig,
      requestInstance: request.defaults(requestConfig),
      user: user
    })
  }
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Fremancer</h2>
        </div>
        <Jumbotron>
          <Row>
            <Col md={2}/>
            <Col md={8}>
              <LoginForm
                requestConfig={this.state.requestConfig}
                setAuth={this.setAuth.bind(this)}
              />
            </Col>
          </Row>
        </Jumbotron>
      </div>
    );
  }
}

export default Home;
