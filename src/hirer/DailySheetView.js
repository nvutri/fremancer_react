import React, { Component } from 'react';
import { Col, ControlLabel, Panel, Row, Well } from 'react-bootstrap'


class DailySheetView extends Component {
  render() {
    return <Panel header={this.props.dow} bsStyle="info">
      <Row>
        <Col componentClass={ControlLabel} sm={4}>Date:</Col>
        <Col sm={8}>{this.props.report_date}</Col>
      </Row>
      <Row>
        <Col componentClass={ControlLabel} sm={4}>Hours:</Col>
        <Col sm={8}>{this.props.hours}</Col>
      </Row>
      <Row>
        <Col componentClass={ControlLabel} sm={12}>Note:</Col>
        <Col sm={12}>
          <Well>{this.props.summary}</Well>
        </Col>
      </Row>
    </Panel>
  }
}

export default DailySheetView
