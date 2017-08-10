// Link.react-test.js
import React from 'react';
import { mount, shallow } from 'enzyme';
import request from 'request-promise';
import sinon from 'sinon';

import ContractTable from './ContractTable';


describe('ContractTable', () => {
  it('Renders Components', () => {
    const wrapper = shallow(<ContractTable/>);
    expect(wrapper.find('input').exists());
  });
  it('Load Value from Server', () => {
    sinon.spy(ContractTable.prototype, 'componentWillReceiveProps');
    var wrapper = mount(<ContractTable/>);
  });
});
