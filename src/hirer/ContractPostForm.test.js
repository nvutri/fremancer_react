import React from 'react';
import moment from 'moment';
import { mount, shallow } from 'enzyme';
import { Input } from 'formsy-react-components';
import sinon from 'sinon';
import request from 'request-promise';

import ContractPostForm from './ContractPostForm';
import { TestUser } from '../TestConfig';

describe('Contract Post Form', () => {
  it('renders three <Input/> components', () => {
    const wrapper = shallow(<ContractPostForm
      user={TestUser}
      id={1}
    />);
    expect(wrapper.find(Input).exists());
  });
  it('Test Form filling', () => {
    var ContractForm = shallow(<ContractPostForm
      user={TestUser}
    />);
    const titleInput = ContractForm.find({'name': 'title'}).first();
    expect(titleInput.exists());
    titleInput.value = 'Test Input Title';
    expect(titleInput.value).toBe('Test Input Title');
  })
  it('Update Existing Contract', async () => {
    const ContractForm = shallow(<ContractPostForm
      user={TestUser}
      match={{params: {id: 1}}}
    />);
    ContractForm.setState({
      freelancer: 6,
      hirer: 6,
      accepted: true
    });
    const submitResult = await ContractForm.instance().submit({
      'title': 'This is update the exiting Contract',
      'description': 'This Contract is updated',
      'hourly_rate': '20',
      'max_weekly_hours': '20',
      'total_budget': '2000',
      'duration': 'short',
      'budget_type': 'hourly',
      'freelancer': 6,
      'hirer': 6
    });
    expect(submitResult.id).toBe(1);
    expect(submitResult.title).toBe('This is update the exiting Contract');
  });
  it('Load Value from Server', () => {
    sinon.spy(ContractPostForm.prototype, 'componentDidMount');
    var wrapper = mount(<ContractPostForm
      params={{id: 1}}
      user={TestUser}
    />);
  });
  it('Test Editability for Owner and non-owner', () => {
    var ContractForm = shallow(<ContractPostForm
      user={TestUser}
      params={{id: 1}}
    />);
    expect(ContractForm.find({'name': 'edit-button'}).exists());
    expect(ContractForm.find({'name': 'accept-button'}).exists());
    expect(ContractForm.find({'name': 'submit-button'}).exists());
  });
  it('Load timesheet', async () => {
    const ContractForm = shallow(<ContractPostForm
      user={TestUser}
      match={{params: {id: 1}}}
    />);
    const createResult = await ContractForm.instance().loadTimeSheet();
    expect(createResult.contract).toBe(1);
    const lastMonday = moment().day('Monday').format('YYYY-MM-DD');
    expect(createResult.start_date).toBe(lastMonday);
    // Delete last monday start_date to test creating new time sheet.
    const requestInstance = request.defaults(RequestConfig);
    requestInstance.delete(`/api/timesheets/${createResult.id}/`);
  });
});
