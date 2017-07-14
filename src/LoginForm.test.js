// Link.react-test.js
import React from 'react';
import ReactDOM from 'react-dom';

import LoginForm from './LoginForm';
import { RequestConfig } from './TestConfig';

describe('Login Form Test', () => {

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<LoginForm
      requestConfig={RequestConfig}
      />, div);
  });

});
