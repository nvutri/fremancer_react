// Link.react-test.js
import React from 'react';
import { mount, shallow } from 'enzyme';
import sinon from 'sinon';

import TimeSheet from './TimeSheet';
import { RequestConfig } from './TestConfig';


describe('TimeSheet', () => {
  it('Renders Components', () => {
    const wrapper = shallow(<TimeSheet
      requestConfig={RequestConfig}
      id={1}/>);
    expect(wrapper.find('input').exists());
  });
  it('Load Value from Server', () => {
    sinon.spy(TimeSheet.prototype, 'componentDidMount');
    var wrapper = mount(<TimeSheet
      requestConfig={RequestConfig}
      id={1}
    />);
    expect(TimeSheet.prototype.componentDidMount.calledOnce).toBe(true);
  });
});
