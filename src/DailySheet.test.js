// Link.react-test.js
import React from 'react';
import { mount, shallow } from 'enzyme';
import sinon from 'sinon';

import DailySheet from './DailySheet';
import { RequestConfig } from './TestConfig';


describe('DailySheet', () => {
  it('Renders <input/> Components', () => {
    const wrapper = shallow(<DailySheet/>);
    expect(wrapper.find('input').exists());
    expect(wrapper.find('input')).toHaveLength(2)
  });
  it('Set State Change Hours', () => {
    const wrapper = shallow(<DailySheet/>);
    var hoursInput = wrapper.find({'name': 'hours'}).first();
    expect(hoursInput.exists());
    wrapper.setState({'hours': 4});
    hoursInput = wrapper.find({'name': 'hours'}).first();
    expect(hoursInput.props().value).toBe(4);
  });
  it('Change Hours Change State', () => {
    const wrapper = shallow(<DailySheet/>);
    var hoursInput = wrapper.find({'name': 'hours'}).first();
    hoursInput.simulate('change', {target: {value: 20}});
    expect(wrapper.state('hours')).toBe(20);
  });
  it('Change Summary Change State', () => {
    const wrapper = shallow(<DailySheet/>);
    var summaryInput = wrapper.find({'name': 'summary'}).first();
    summaryInput.simulate('change', {target: {value: 'Good day'}});
    expect(wrapper.state('summary')).toBe('Good day');
  });
  it('Load Value from Server', () => {
    sinon.spy(DailySheet.prototype, 'componentDidMount');
    var wrapper = mount(<DailySheet
      requestConfig={RequestConfig}
      timesheet={1}
      report_date={'2017-06-16'}
      id={1}
    />);
    expect(DailySheet.prototype.componentDidMount.calledOnce).toBe(true);
  });
  it('Save changes', () => {
    const wrapper = shallow(<DailySheet
      requestConfig={RequestConfig}
      timesheet={1}
      report_date={'2017-06-16'}
      id={1}
    />);
    var instance = wrapper.instance();
    instance.setState({'hours': 4, 'summary': 'Happy Day'});
    instance.save();
  });
});
