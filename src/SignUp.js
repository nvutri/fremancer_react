import React, { Component } from 'react';
import { Button, Modal } from 'react-bootstrap'

import JobPostForm from './JobPostForm'


class SignUp extends Component {
  render() {
    return (
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
    )
  }
}
