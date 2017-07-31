// Link.react-test.js
import React from 'react';
import { mount, shallow } from 'enzyme';
import sinon from 'sinon';

import TimeSheetCreate from './TimeSheetCreate';
import { RequestConfig } from './TestConfig';


describe('TimeSheet', () => {
  it('Renders Components', () => {
    const wrapper = shallow(<TimeSheetCreate
      requestConfig={RequestConfig}
    />);
    expect(wrapper.find('input').exists());
  });
  it('Load Value from Server', () => {
    sinon.spy(TimeSheetCreate.prototype, 'componentDidMount');
    var wrapper = mount(<TimeSheetCreate
      requestConfig={RequestConfig}
    />);
    expect(TimeSheetCreate.prototype.componentDidMount.calledOnce).toBe(true);
  });
  it('Create New TimeSheet', async () => {
    const wrapper = shallow(<TimeSheetCreate
      requestConfig={RequestConfig}
    />);
    var createInstance = wrapper.instance();
    const contractID = Math.ceil(Math.random() * 100);
    const createResult = await createInstance.create({
      contract: contractID,
      start_date: '2017-07-31'
    });
    expect(createResult.errors).toBeUndefined();
    expect(createResult.id).toBeGreaterThan(0);
    expect(createResult.contract).toBe(contractID);
  });
});
