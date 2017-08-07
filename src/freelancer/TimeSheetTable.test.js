// Link.react-test.js
import React from 'react';
import { mount, shallow } from 'enzyme';
import request from 'request-promise';
import sinon from 'sinon';

import TimeSheetTable from './TimeSheetTable';
import { RouterContext } from '../TestConfig';


describe('TimeSheetTable', () => {
  it('Renders Components', () => {
    const wrapper = shallow(<TimeSheetTable
    />);
    expect(wrapper.find('input').exists());
  });
  it('Load Value from Server', () => {
    sinon.spy(TimeSheetTable.prototype, 'componentDidMount');

    var wrapper = mount(<TimeSheetTable/>, RouterContext);
    expect(TimeSheetTable.prototype.componentDidMount.calledOnce).toBe(true);
  });
});
