// Link.react-test.js
import React from 'react';
import { shallow } from 'enzyme';

import TimeSheet from './TimeSheet';


describe('TimeSheet', () => {
  it('Renders Components', () => {
    const wrapper = shallow(<TimeSheet/>);
    expect(wrapper.find('input').exists());
  });
});
