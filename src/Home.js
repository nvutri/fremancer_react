import React, { Component } from 'react';
import {Row, Jumbotron, Button, Col, Modal} from 'react-bootstrap'
import request from 'request-promise'

import './App.css';
import LoginForm from './LoginForm'


class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <div className="App">
        <Jumbotron>
          <Row>
            <Col md={2}/>
            <Col md={8}>
            </Col>
          </Row>
        </Jumbotron>
      </div>
    );
  }
}

export default Home;
