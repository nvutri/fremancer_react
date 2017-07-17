import request from 'request-promise';
import React, { Component } from 'react';
import Formsy from 'formsy-react';
import { Button } from 'react-bootstrap'
import FRC from 'formsy-react-components';
import DjangoCSRFToken from 'django-react-csrftoken'

const { Input, Textarea, Select } = FRC;


class JobPostForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      description: '',
      hourly_rate: '',
      max_weekly_hours: '',
      hirer: this.props.user ? this.props.user.id : null,
      total_budget: '',
      duration: '',
      budget_type: '',
      application_type: '',
      accepted: false,
      id: this.props.params ? this.props.params.id : null
    };
  }
  submit(data) {
    var self = this;
    // Assign the user profile as the hiring person.
    data['hirer'] = this.state.hirer;
    const requestInstance = request.defaults(this.props.requestConfig);
    if (this.state.id) {
      // Update an existing job by PUT request with the ID..
      const url = `/api/contracts/${this.state.id}/`;
      return requestInstance.put(url).form(data).then(function (response) {
        return response;
      }).catch(function (err) {
        console.log(err);
      });
    }
    else {
      // Create a new job.
      const url = '/api/contracts/';
      return requestInstance.post(url).form(data).then(function (response) {
        self.setState({id : response.id});
        return response;
      }).catch(function (err) {
        console.log(err);
      });
    }
  }
  componentDidMount() {
    if (this.props.params) {
      var self = this;
      const requestInstance = request.defaults(this.props.requestConfig);
      const url = `/api/contracts/${this.props.params.id}/`;
      return requestInstance.get(url).then(function (response) {
        self.setState(response);
        return response;
      }).catch(function (err) {
        console.log(err);
      });
    }
  }
  render() {
    var self = this;
    return (
      <FRC.Form
        onValidSubmit={this.submit.bind(this)}>
        <fieldset>
          <DjangoCSRFToken ref={ (token) => { this.csrfToken = token; } }/>
          <Input
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
              required/>
          <Textarea
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
              required/>
          <Input
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
              required/>
          <Input
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
              required/>
          <br/>
          <Input
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
              required/>
          <Select
              name="duration"
              label="Anticipating Duration"
              options={[
                {value: 'short', label: 'Short Term (About 1 month or less)'},
                {value: 'long', label: 'Long Term (More than 1 month)'}
              ]}
              value={this.state.duration}
          />
          <Select
              name="budget_type"
              label="Budget Type"
              options={[
                {value: 'hourly', label: 'Hourly - Pay by Hour'},
              ]}
              value={this.state.budget_type}
          />
        <br/>
        </fieldset>
        <fieldset>
          <Button bsStyle="primary" className="center-block" formNoValidate={true} type="submit">Submit</Button>
        </fieldset>
      </FRC.Form>
    );
  }
}

export default JobPostForm;
