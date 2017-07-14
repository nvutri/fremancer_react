import React, { Component } from 'react';
import { Button } from 'react-bootstrap'
import { Input, Form } from 'formsy-react-components';


class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <Form
        onSubmit={this.props.setAuth}>
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
