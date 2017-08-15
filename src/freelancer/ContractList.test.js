// Link.react-test.js
import React from 'react';
import { mount, shallow } from 'enzyme';
import request from 'request-promise';
import sinon from 'sinon';
import { RouterContext } from '../TestConfig';

import ContractList from './ContractList';


describe('ContractList', () => {
  it('Renders Components', () => {
    const wrapper = shallow(<ContractList/>);
    expect(wrapper.find('input').exists());
  });
  it('Load Value from Server', () => {
    sinon.spy(ContractList.prototype, 'componentDidMount');
    var wrapper = mount(<ContractList/>, RouterContext);
  });
});
