import React, { Component } from 'react';
import { Badge, Col, ControlLabel, Label, Panel, Row } from 'react-bootstrap'
import FontAwesome from 'react-fontawesome';
import { LinkContainer } from 'react-router-bootstrap';


class ContractListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const titleElem = <LinkContainer to={`/contracts/${this.props.id}/`}>
      <a href="#">{this.props.title}</a>
    </LinkContainer>;
    return <Panel header={titleElem} bsStyle={this.props.freelancer ? "info" : "default"}>
      <Row>
        <Col componentClass={ControlLabel} sm={2}>
          Hirer:
        </Col>
        <Col sm={4}>
        {
          this.props.hirer ?
          <Label bsStyle="success">
            {this.props.hirer_name}
          </Label> :
          ''
        }
        </Col>
        <Col componentClass={ControlLabel} sm={2}>
          Project Status:
        </Col>
        <Col sm={4}>
          {
            this.props.accepted ?
              <Label bsStyle="info">Freelancer Accepted</Label> :
              <Label bsStyle="warning">Waiting Freelancer Acceptance</Label>
          }
        </Col>
      </Row>
      <Row>
        <Col componentClass={ControlLabel} sm={2}>Weekly Hours:</Col>
        <Col sm={4}>
          <Label bsStyle="primary">{this.props.max_weekly_hours} hours/week</Label>
        </Col>
        <Col componentClass={ControlLabel} sm={2}>Hourly Rate:</Col>
        <Col sm={4}><Badge>${this.props.hourly_rate}/hour</Badge></Col>
      </Row>
      <Row>
        <Col componentClass={ControlLabel} sm={2}>Total Budget:</Col>
        <Col sm={4}><Badge>${this.props.total_budget}</Badge></Col>
        <Col componentClass={ControlLabel} sm={2}>Project Duration:</Col>
        <Col sm={4}>
          <Label bsStyle="info">{this.props.duration}</Label>
        </Col>
      </Row>
      <Row>
        <Col componentClass={ControlLabel} sm={2}>Description</Col>
        <Col sm={10}>
          {this.props.description}
        </Col>
      </Row>

    </Panel>
  }
}

export default ContractListItem;
