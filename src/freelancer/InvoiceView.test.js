// Link.react-test.js
import React from 'react';
import { mount, shallow } from 'enzyme';
import sinon from 'sinon';

import InvoiceView from './InvoiceView';
import { Authenticate, RouterContext, TestUser } from '../TestConfig';


describe('InvoiceView', () => {
  it('Renders Components', async () => {
    const user = await Authenticate();
    const wrapper = shallow(<InvoiceView id={1}/>, RouterContext);
    expect(wrapper.find('input').exists());
  });
  it('Load Value from Server', async () => {
    const user = await Authenticate();
    sinon.spy(InvoiceView.prototype, 'componentDidMount');
    var wrapper = mount(<InvoiceView
        match={{params: {id:1}}}
        user={user}
        />, RouterContext);
    expect(InvoiceView.prototype.componentDidMount.calledOnce).toBe(true);
  });
});
