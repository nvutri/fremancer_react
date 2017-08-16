// Link.react-test.js
import React from 'react';
import { mount, shallow } from 'enzyme';
import request from 'request-promise';
import sinon from 'sinon';

import InvoiceTable from './InvoiceTable';
import { RouterContext } from '../TestConfig';


describe('InvoiceTable', () => {
  it('Renders Components', () => {
    const wrapper = shallow(<InvoiceTable
    />);
    expect(wrapper.find('input').exists());
  });
  it('Load Value from Server', () => {
    sinon.spy(InvoiceTable.prototype, 'componentDidMount');

    var wrapper = mount(<InvoiceTable/>, RouterContext);
    expect(InvoiceTable.prototype.componentDidMount.calledOnce).toBe(true);
  });
});
