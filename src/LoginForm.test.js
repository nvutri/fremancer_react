// Link.react-test.js
import React from 'react';
import ReactDOM from 'react-dom';

import LoginForm from './LoginForm';

const RequestConfig = {
  baseUrl: 'http://localhost:8000',  // Test Server.
  json: true,
  auth: null
};

describe('Login Form Test', () => {

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<LoginForm
      requestConfig={RequestConfig}
      />, div);
  });

});
