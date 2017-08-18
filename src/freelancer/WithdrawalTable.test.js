// Link.react-test.js
import React from 'react';
import { mount, shallow } from 'enzyme';
import request from 'request-promise';
import sinon from 'sinon';

import WithdrawalTable from './WithdrawalTable';
import { RouterContext } from '../TestConfig';


describe('WithdrawalTable', () => {
  it('Renders Components', () => {
    const wrapper = shallow(<WithdrawalTable
    />);
    expect(wrapper.find('input').exists());
  });
  it('Load Value from Server', () => {
    sinon.spy(WithdrawalTable.prototype, 'componentDidMount');

    var wrapper = mount(<WithdrawalTable/>, RouterContext);
    expect(WithdrawalTable.prototype.componentDidMount.calledOnce).toBe(true);
  });
});
