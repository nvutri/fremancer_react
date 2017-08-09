// Link.react-test.js
import React from 'react';
import { mount, shallow } from 'enzyme';
import request from 'request-promise';
import sinon from 'sinon';

import JobTable from './JobTable';


describe('JobTable', () => {
  it('Renders Components', () => {
    const wrapper = shallow(<JobTable/>);
    expect(wrapper.find('input').exists());
  });
  it('Load Value from Server', () => {
    sinon.spy(JobTable.prototype, 'componentDidMount');
    var wrapper = mount(<JobTable/>);
    expect(JobTable.prototype.componentDidMount.calledOnce).toBe(true);
  });
});