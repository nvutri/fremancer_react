import React from 'react';
import ReactDOM from 'react-dom';
import PaymentACH from './PaymentACH';
import { mount, shallow } from 'enzyme';

import { TestUser } from '../TestConfig';

describe('PaymentACH', () => {
  it('Renders Components', () => {
    const wrapper = shallow(<PaymentACH/>);
    expect(wrapper.find('button').exists());
  });
  it('Submit ACH Form', () => {
    const achForm = shallow(<PaymentACH
      user={TestUser}
    />);
    const submitResult = achForm.instance().submit({
      'account_holder_name': 'Test Holder',
      'account_holder_type': 'individual',
      'routing_number': '110000000',
      'account_number': '000123456789'
    });
  })
});
