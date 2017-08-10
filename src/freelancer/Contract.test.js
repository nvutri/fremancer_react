// Link.react-test.js
import React from 'react';
import { mount, shallow } from 'enzyme';
import request from 'request-promise';
import sinon from 'sinon';

import Contract from './Contract';
import { TestUser } from './TestConfig';


describe('Contract', () => {
  it('Renders Components', () => {
    const wrapper = shallow(<Contract/>);
    expect(wrapper.find('input').exists());
  });
  it('Load Value from Server', () => {
    sinon.spy(Contract.prototype, 'componentDidMount');
    var wrapper = mount(<Contract
        user={TestUser}
      />);
  });
});
