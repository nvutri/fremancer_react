// Link.react-test.js
import React from 'react';
import { mount, shallow } from 'enzyme';
import request from 'request-promise';
import sinon from 'sinon';

import WithdrawalForm from './WithdrawalForm';
import { RouterContext } from '../TestConfig';


describe('WithdrawalForm', () => {
  it('Renders Components', () => {
    const wrapper = shallow(<WithdrawalForm/>);
    expect(wrapper.find('input').exists());
  });
  it('Load Value from Server', () => {
    sinon.spy(WithdrawalForm.prototype, 'componentDidMount');

    var wrapper = mount(<WithdrawalForm/>, RouterContext);
    expect(WithdrawalForm.prototype.componentDidMount.calledOnce).toBe(true);
  });
});
