import request from 'request';
import React, { Component } from 'react';
import Formsy from 'formsy-react';
import { Button } from 'react-bootstrap'
import FRC from 'formsy-react-components';
import DjangoCSRFToken from 'django-react-csrftoken'

const { Input, Textarea, Select } = FRC;
var r = request.defaults({
  baseUrl: 'http://localhost:8000',
  auth: {
    'user': 'freelancer@gmail.com',
    'pass': 'Thisisfreelancing',
    'sendImmediately': true
  }
});

class JobPostForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      canSubmit: false,
      hirer: document.getElementById('userID').value
    };
  }
  submit(data) {
    data['hirer'] = this.state.hirer;
    console.log(data);
    return r.post('/api/contracts/').form(data)
    .on('data', function(data) {
      // decompressed data as it is received
      console.log('decoded chunk: ' + data)
    })
    .on('error', function(error) {
      console.log('ERROR: ' + error);
    })
  }
  render() {
    var self = this;
    return (
      <FRC.Form
        onSubmit={this.submit.bind(this)}>
        <fieldset>
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
              required/>
          <Select
              name="duration"
              label="Anticipating Duration"
              options={[
                {value: 'short', label: 'Short Term (About 1 month or less)'},
                {value: 'long', label: 'Long Term (More than 1 month)'}
              ]}
          />
          <Select
              name="budget_type"
              label="Budget Type"
              options={[
                {value: 'hourly', label: 'Hourly - Pay by Hour'},
              ]}
          />
        <br/>
        </fieldset>
        <fieldset>
          <Button className="btn btn-primary" formNoValidate={true} type="submit">Submit</Button>
        </fieldset>
      </FRC.Form>
    );
  }
}

export default JobPostForm;
