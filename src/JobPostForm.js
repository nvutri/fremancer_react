import React, { Component } from 'react';
import Formsy from 'formsy-react';
import { Button } from 'react-bootstrap'
import FRC from 'formsy-react-components';
const { Input, Textarea, Select } = FRC;


class JobTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      canSubmit: false
    };
  }

  render() {
    return (
      <FRC.Form>
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
                {value: 'short_term', label: 'Short Term (About 1 month or less)'},
                {value: 'long_term', label: 'Long Term (More than 1 month)'}
              ]}
              required
          />
          <Select
              name="budget_type"
              label="Budget Type"
              options={[
                {value: 'hourly', label: 'Hourly - Pay by Hour'},
                {value: 'fixed', label: 'Fixed - Pay a fixed amount'}
              ]}
              required
          />
        <br/>
        </fieldset>
        <fieldset>
          <input className="btn btn-primary" formNoValidate={true} type="submit" defaultValue="Submit" />
        </fieldset>
      </FRC.Form>
    );
  }
}

export default JobTable;
