import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { shallow } from 'enzyme';
import { TestUser } from './TestConfig';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App/>, div);
});

it('Fill and submit authentication', async () => {
  const wrapper = shallow(
    <App/>
  );
  const userResult = await wrapper.instance().setAuth(TestUser);
  expect(userResult.username).toBe(TestUser.username);
  expect(userResult.id).toBeGreaterThanOrEqual(0);
});
