// Link.react-test.js
import React from 'react';
import { shallow } from 'enzyme';

import LoginForm from './LoginForm';

describe('Login Form Test', () => {

  it('Fill and submit authentication', async () => {
    const testUser = {
      'username': 'freelancer@gmail.com',
      'password': 'Thisisfreelancing',
    };
    const setAuth = function(data) {
      expect(data.username).toBe(testUser.username);
      expect(data.id).toBeGreaterThanOrEqual(0);
    };
    const wrapper = shallow(
      <LoginForm
        setAuth={setAuth}
        requestConfig={{
          baseUrl: 'http://localhost:8000',
          json: true
        }}
      />
    );
    const userResult = await wrapper.instance().submit(testUser);
  });
});
