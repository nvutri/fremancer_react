import request from 'request-promise';
import React, { Component } from 'react';
import Formsy from 'formsy-react';
import { Button, Col, Row, Jumbotron } from 'react-bootstrap'
import FRC from 'formsy-react-components';
import { LinkContainer } from 'react-router-bootstrap';
import Select from 'react-select'


class JobCreateForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      description: '',
      hourly_rate: '',
      max_weekly_hours: '',
      hirer: this.props.user.id,
      freelancer: null,
      total_budget: '',
      duration: '',
      budget_type: '',
      application_type: '',
      accepted: false
    };
  }
  submit(data) {
    var self = this;
    // Assign the user profile as the hiring person.
    data['hirer'] = this.state.hirer;
    data['freelancer'] = this.state.freelancer;
    const requestInstance = request.defaults(this.props.requestConfig);
    // Create a new job.
    const url = '/api/contracts/';
    return requestInstance.post(url).form(data).then(function (response) {
      self.props.history.push('/jobs/');
      return response;
    }).catch(function (err) {
      console.log(err);
    });
  }
  loadFreelancers() {
    const requestInstance = request.defaults(this.props.requestConfig);
    const url = '/api/profiles/?membership=freelancer';
    return requestInstance.get(url).then(function (response) {
      const options = response.results.map(function(item) {
        const fl = item.user;
        return {
          'value': fl.id,
          'label': `${fl.first_name} ${fl.last_name}: ${fl.email}`
        }
      });
      return {
        options: options,
        complete: true
      }
    }).catch(function (err) {
      console.log(err);
    });
  }
  render() {
    var self = this;
    var frcForm = <FRC.Form
      onValidSubmit={this.submit.bind(this)}>
      <fieldset>
        <FRC.Input
            name="title"
            label="Title"
            validations={{
              isWords: true,
              minLength: 8
            }}
            validationErrors={{
              isWords: 'Only use alphanumeric characters',
              minLength: 'Title minimum length is 8'
            }}
            placeholder="What is your project title?"
            value={this.state.title}
            disabled={this.state.view}
            required/>
        <FRC.Textarea
            name="description"
            validations={{
              isWords: true,
              minLength: 50
            }}
            validationErrors={{
              isWords: 'Only use alphanumeric characters',
              minLength: 'Description minimum length is 50'
            }}
            placeholder="What is your project description?"
            label="Description"
            value={this.state.description}
            disabled={this.state.view}
            required/>
        <FRC.Input
            name="hourly_rate"
            validations={{
              isNumeric: true,
            }}
            validationErrors={{
              isNumeric: 'Only use number.',
            }}
            placeholder="Project hourly rate? (20, 30 ..)"
            label="Hourly Rate"
            value={this.state.hourly_rate}
            disabled={this.state.view}
            required/>
        <FRC.Input
            name="max_weekly_hours"
            validations={{
              isNumeric: true,
            }}
            validationErrors={{
              isNumeric: 'Only use number.',
            }}
            placeholder="Project Weekly Hours Cap"
            label="Max Weekly Hours"
            value={this.state.max_weekly_hours}
            disabled={this.state.view}
            required/>
        <br/>
        <FRC.Input
            name="total_budget"
            validations={{
              isNumeric: true,
            }}
            validationErrors={{
              isNumeric: 'Only use number.',
            }}
            placeholder="Project Budget? (20,000, 30,000 ..)"
            label="Project Budget"
            value={this.state.total_budget}
            disabled={this.state.view}
            required/>
        <FRC.Select
            name="duration"
            label="Anticipating Duration"
            options={[
              {value: 'short', label: 'Short Term (About 1 month or less)'},
              {value: 'long', label: 'Long Term (More than 1 month)'}
            ]}
            value={this.state.duration}
            disabled={this.state.view}
        />
        <FRC.Select
            name="budget_type"
            label="Budget Type"
            options={[
              {value: 'hourly', label: 'Hourly - Pay by Hour'},
            ]}
            value={this.state.budget_type}
            disabled={this.state.view}
        />
        <FRC.Row>
          <label className="control-label col-sm-3">
            Freelancer
          </label>
          <Col sm={9}>
            <Select.Async
                name="freelancer"
                value={this.state.freelancer}
                loadOptions={this.loadFreelancers.bind(this)}
                onChange={ (selectedOption) => { this.setState({freelancer: selectedOption.value})} }
                disabled={this.state.view}
            />
          </Col>
        </FRC.Row>
      <br/>
      </fieldset>
      <fieldset>
        <Button bsStyle="primary" className="center-block"
          name="submit-button"
          formNoValidate={true} type="submit">Submit</Button>
      </fieldset>
    </FRC.Form>;
    return (
      <Row>
        <Col md={1}></Col>
        <Col md={10}>
          {frcForm}
        </Col>
      </Row>
    );
  }
}

export default JobCreateForm;
