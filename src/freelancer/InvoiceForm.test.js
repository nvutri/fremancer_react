// Link.react-test.js
import React from 'react';
import { mount, shallow } from 'enzyme';
import sinon from 'sinon';

import InvoiceForm from './InvoiceForm';
import { Authenticate, RouterContext, TestUser } from '../TestConfig';


describe('InvoiceForm', () => {
  it('Renders Components', async () => {
    const user = await Authenticate();
    const wrapper = shallow(<InvoiceForm id={1}/>, RouterContext);
    expect(wrapper.find('input').exists());
  });
  it('Load Value from Server', async () => {
    const user = await Authenticate();
    sinon.spy(InvoiceForm.prototype, 'componentDidMount');
    var wrapper = mount(<InvoiceForm
        match={{params: {id:1}}}
        user={user}
        />, RouterContext);
    expect(InvoiceForm.prototype.componentDidMount.calledOnce).toBe(true);
  });
});
