import React from 'react';
import ReactDOM from 'react-dom';
import Payment from './Payment';
import { mount, shallow } from 'enzyme';


describe('Payment', () => {
  it('Renders Components', () => {
    const wrapper = shallow(<Payment/>);
    expect(wrapper.find('button').exists());
  });
  it('Activate Pay With Card', () => {
    var wrapper = mount(<Payment/>);
    wrapper.find('button').simulate('click');
  });
});
