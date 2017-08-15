// Link.react-test.js
import React from 'react';
import { mount, shallow } from 'enzyme';
import request from 'request-promise';
import sinon from 'sinon';
import { RouterContext } from '../TestConfig';

import TimeSheetView from './TimeSheetView';

describe('TimeSheetView', () => {
  it('Renders Components', () => {
    const wrapper = shallow(<TimeSheetView/>);
    expect(wrapper.find('input').exists());
  });
  it('Load Value from Server', () => {
    sinon.spy(TimeSheetView.prototype, 'componentDidMount');
    var wrapper = mount(<TimeSheetView/>, RouterContext);
  });
});
