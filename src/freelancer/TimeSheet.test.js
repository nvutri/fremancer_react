// Link.react-test.js
import React from 'react';
import { mount, shallow } from 'enzyme';
import sinon from 'sinon';

import TimeSheet from './TimeSheet';
import { RouterContext } from '../TestConfig';


describe('TimeSheet', () => {
  it('Renders Components', () => {
    const wrapper = shallow(<TimeSheet
      id={1}/>, RouterContext);
    expect(wrapper.find('input').exists());
  });
  it('Load Value from Server', () => {
    sinon.spy(TimeSheet.prototype, 'componentDidMount');
    var wrapper = mount(<TimeSheet match={{params: {id:1}}}/>, RouterContext);
    expect(TimeSheet.prototype.componentDidMount.calledOnce).toBe(true);
  });
});
