import React, { Component } from 'react';
import { Button } from 'react-bootstrap'
import { Input, Form } from 'formsy-react-components';
import { RequestConfig } from './Config'


class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      validationErrors: {}
    };
  }
  handleLogIn(authData) {
    const self = this;
    this.props.authenticate(authData).then( (response) => {
      if (response.error) {
        self.setState({
          validationErrors: response.error
        });
      } else {
        // Reload page to load a different app for different types of users.
        window.location.assign('/');
      }
    });
  }
  render() {
    return (
      <Form
        onSubmit={this.handleLogIn.bind(this)} validationErrors={this.state.validationErrors}>
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
              placeholder="What is email address?"
              required/>
          <br/>
          <Input
              name="password"
              label="Password"
              type="password"
              validations="minLength:8"
              validationError="Your password must be at least 8 characters long."
              placeholder="Choose a password" required/>
        </fieldset>
        <fieldset>
          <Button className="btn btn-primary" formNoValidate={true} type="submit">Login</Button>
        </fieldset>
      </Form>
    );
  }
}

export default LoginForm;
