import React, { Component } from 'react';
import {Row, Button, Col, Thumbnail, ListGroup, ListGroupItem, Page, PageHeader} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <Row>
        <Col sm={2}/>
        <Col sm={8}>
          <Thumbnail src="/static/assets/img/png/white_logo_color_background@2x.png" alt="242x200">
            <LinkContainer to="/signup/" className="center-block">
              <Button bsSize="large" bsStyle="info">Sign Up</Button>
            </LinkContainer>
          </Thumbnail>
          <h3>Why Should I consider Fremancer?</h3>
          <ListGroup>
            <ListGroupItem header="Home For Happiest Freelancer" bsStyle="success" className="text-center"></ListGroupItem>
            <ListGroupItem header="Zero Platform Fee!" bsStyle="info">I was a freelancer myself and I have no interest in charging hefty rate.</ListGroupItem>
            <ListGroupItem header="Simple TimeSheet">Track Your Work by Hour</ListGroupItem>
            <ListGroupItem header="Weekly Report" bsStyle="info">Report and Summarize Your Work</ListGroupItem>
            <ListGroupItem header="Simple Invoice">Create Invoice of one or multiple timesheets</ListGroupItem>
            <ListGroupItem header="Quick Invoice Payment" bsStyle="info">Super Easy Payment and low fee for Client. Integrated with Stripe for best service and lowest fee.</ListGroupItem>
            <ListGroupItem header="Best Payout Option">Use Western Union (and soon other great options) to give you the best exchange rate. Support both Cash at Location and direct bank transfer.</ListGroupItem>
          </ListGroup>
        </Col>
      </Row>
    );
  }
}

export default Home;
// <Image src="/static/assets/img/png/white_logo_color_background@2x.png" responsive />
