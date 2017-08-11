// Link.react-test.js
import React from 'react';
import { mount, shallow } from 'enzyme';
import sinon from 'sinon';

import TimeSheet from './TimeSheet';
import { Authenticate, RouterContext, TestUser } from '../TestConfig';


describe('TimeSheet', () => {
  it('Renders Components', async () => {
    const user = await Authenticate();
    const wrapper = shallow(<TimeSheet id={1}/>, RouterContext);
    expect(wrapper.find('input').exists());
  });
  it('Load Value from Server', async () => {
    const user = await Authenticate();
    sinon.spy(TimeSheet.prototype, 'componentDidMount');
    var wrapper = mount(<TimeSheet
        match={{params: {id:1}}}
        user={user}
        />, RouterContext);
    expect(TimeSheet.prototype.componentDidMount.calledOnce).toBe(true);
  });
  it('Submit TimeSheet to Server', async () => {
    const user = await Authenticate();
    const wrapper = shallow(<TimeSheet
        id={1}
        match={{params: {id: 1}}}
        user={user}
    />, RouterContext);
    expect(wrapper.find('#submit-button').exists());
    expect(wrapper.find('#submit-button').simulate('click'));
  })
});
