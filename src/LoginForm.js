import React, { Component } from 'react';
import { Button } from 'react-bootstrap'
import FRC from 'formsy-react-components';
import request from 'request'

const { Input } = FRC;


class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  submit(data) {
    data['sendImmediately'] = true;
    this.props.requestConfig['auth'] = data;
    const requestInstance = request.defaults(this.props.requestConfig);
    return requestInstance.get('/api/users/', function (error, response, body) {
      console.log('error:', error); // Print the error if one occurred
      console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
      console.log('body:', body); // Print the HTML for the Google homepage.
      return response
    });
  }
  render() {
    var self = this;
    return (
      <FRC.Form
        onSubmit={this.submit.bind(this)}>
        <fieldset>
          <Input
              name="username"
              label="Username"
              validations={{
                isEmail: true
              }}
              validationErrors={{
                isEmail: 'Please enter a valid email address'
              }}
              placeholder="What is username?"
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
      </FRC.Form>
    );
  }
}

export default LoginForm;
