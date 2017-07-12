import React, { Component } from 'react';
import {Row, Jumbotron, Button, Col, Modal} from 'react-bootstrap'

import JobTable from './JobTable'
import JobPostForm from './JobPostForm'


class Jobs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
    };
  }

  openModal() {
    this.setState({
      showModal: true
    })
  }

  closeModal() {
    this.setState({
      showModal: false
    })
  };

  render() {
    return (
      <div className="App">
        <Jumbotron>
          <Row>
            <Col md={2}>
              <Button bsStyle="default" bsSize="large" block onClick={this.openModal.bind(this)}>New Job</Button>
            </Col>
            <Col md={8}>
              <JobTable/>
            </Col>
          </Row>
        </Jumbotron>
        <Modal show={self.state.showModal}>
          <Modal.Header closeButton>
            <Modal.Title>Post New Job</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <JobPostForm/>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.closeModal.bind(this)}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}
