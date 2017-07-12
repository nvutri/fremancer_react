// Link.react-test.js
import React from 'react';
import { shallow } from 'enzyme';

import LoginForm from './LoginForm';

describe('Login Form Test', () => {

  it('Fill and submit authentication', async () => {
    const testUser = {
      'user': 'freelancer@gmail.com',
      'pass': 'Thisisfreelancing',
    };
    const setAuth = function(data) {
      expect(data.username).toBe(testUser.username);
      expect(data.password).toBe(testUser.password);
    };
    const wrapper = shallow(
      <LoginForm
        setAuth={setAuth}
        requestConfig={{
          baseUrl: 'http://localhost:8000'
        }}
      />
    );
    const submitPromise = await wrapper.instance().submit(testUser);
    expect(submitPromise).toBe()
  });
});
