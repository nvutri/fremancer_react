// Link.react-test.js
import React from 'react';
import ReactDOM from 'react-dom';
import { mount, shallow } from 'enzyme';

import SignUpForm from './SignUpForm';

const RequestConfig = {
  baseUrl: 'http://localhost:8000',  // Test Server.
  json: true,
  auth: null
};

describe('SignUp Form Test', async () => {

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<SignUpForm
      requestConfig={RequestConfig}
      />, div);
  });
  it('Create and update New user', async () => {
    var signUpForm = shallow(<SignUpForm
      requestConfig={RequestConfig}
      authenticate={ (response) => {
        return {
          success: true
        }
      }}
      history={[]}
    />);
    var signUpInstance = signUpForm.instance();
    const testEmail = 'testSignup' + Math.round(Math.random() * 100000) + '@fremancer.com';
    const createResult = await signUpInstance.submit({
      'email': testEmail,
      'username': testEmail,
      'password': 'testSignup',
      'membership': 'hirer',
      'first_name': 'First Name',
      'last_name': 'Last Name'
    });
    expect(createResult.errors).toBeUndefined();
    expect(createResult.id).toBeGreaterThan(0);
    expect(createResult.email).toBe(testEmail);
  });
});
