// Link.react-test.js
import React from 'react';
import { shallow } from 'enzyme';
import FRC from 'formsy-react-components';

import DailySheet from './DailySheet';

const { Input } = FRC;

describe('DailySheet', () => {
  it('renders <Input/> components', () => {
    const wrapper = shallow(<DailySheet/>);
    expect(wrapper.find(Input).exists());
    expect(wrapper.find(Input)).toHaveLength(2)
  });
  it('Set State Change Hours', () => {
    const wrapper = shallow(<DailySheet/>);
    var hoursInput = wrapper.find({'name': 'hours'}).first();
    expect(hoursInput.exists());
    wrapper.setState({'hours': 4});
    hoursInput = wrapper.find({'name': 'hours'}).first();
    expect(hoursInput.props().value).toBe(4);
  });
  it('Change hours change state', () => {
    const wrapper = shallow(<DailySheet/>);
    var hoursInput = wrapper.find({'name': 'hours'}).first();
    hoursInput.simulate('change', {target: {value: 20}});
    expect(wrapper.state('hours')).toBe(20);
  })
  it('Change summary change state', () => {
    const wrapper = shallow(<DailySheet/>);
    var summaryInput = wrapper.find({'name': 'summary'}).first();
    summaryInput.simulate('change', {target: {value: 'Good day'}});
    expect(wrapper.state('summary')).toBe('Good day');
  })
});
