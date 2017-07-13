// Link.react-test.js
import React from 'react';
import { shallow } from 'enzyme';

import LoginForm from './LoginForm';
import {RequestConfig, TestUser} from './TestConfig';

describe('Login Form Test', () => {
  it('Fill and submit authentication', async () => {
    const setAuth = function(requestConfig, data) {
      expect(data.username).toBe(TestUser.username);
      expect(data.id).toBeGreaterThanOrEqual(0);
    };
    const wrapper = shallow(
      <LoginForm
        setAuth={setAuth}
        requestConfig={RequestConfig}
      />
    );
    const userResult = await wrapper.instance().submit(testUser);
  });
});
