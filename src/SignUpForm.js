import React, { Component } from 'react';
import { Button, Jumbotron } from 'react-bootstrap'
import { Input, Form, Select } from 'formsy-react-components';
import request from 'request-promise'


class SignUpForm extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  submit(data) {
    const self = this;
    const requestInstance = request.defaults(this.props.requestConfig);
    return requestInstance.post('/api/users/').then(function (response) {
      self.props.setAuth(self.props.requestConfig, response);
      return response;
    }).catch(function (err) {
      console.log(err);
    });
  }
  render() {
    return (
      <Jumbotron>
        <Form onSubmit={this.submit.bind(this)}>
          <fieldset>
            <Input
                name="username"
                label="Email"
                validations={{
                  isEmail: true
                }}
                validationErrors={{
                  isEmail: 'Please enter a valid email address'
                }}
                placeholder="What is your email address?"
                required/>
            <br/>
            <Input
                name="password"
                label="Password"
                type="password"
                validations="minLength:8"
                validationError="Your password must be at least 8 characters long."
                placeholder="Choose a password" required/>
            <br/>
            <Input
                name="first_name"
                label="First Name"
                validations={{
                  minLength: 2
                }}
                validationErrors={{
                  minLength: 'Please enter more than 2 characters.'
                }}
                placeholder="What is your first name?"
                required/>
            <br/>
            <Input
                name="last_name"
                label="Last Name"
                validations={{
                  minLength: 2
                }}
                validationErrors={{
                  minLength: 'Please enter more than 2 characters.'
                }}
                placeholder="What is your last name?"
                required/>
          </fieldset>
          <fieldset>
            <legend className="text-center">Im here to</legend>
            <Select
                name="membership"
                label="Membership"
                help="Select your membership type."
                options={[
                  {'value': 'hirer', 'label': 'Hirer'},
                  {'value': 'worker', 'label': 'Worker'}
                ]}
                required
            />
          </fieldset>
          <fieldset>
            <Button className="btn btn-primary center-block btn-block" formNoValidate={true} type="submit">Sign Up</Button>
          </fieldset>
        </Form>
      </Jumbotron>
    )
  }
}

export default SignUpForm
