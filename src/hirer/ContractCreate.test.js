import React from 'react';
import { mount, shallow } from 'enzyme';
import { Input } from 'formsy-react-components';
import sinon from 'sinon';
import moment from 'moment';

import ContractCreate from './ContractCreate';
import { TestUser } from '../TestConfig';

describe('Contract Create Form', () => {
  it('renders three <Input/> components', () => {
    const wrapper = shallow(<ContractCreate
      user={TestUser}
      id={1}
    />);
    expect(wrapper.find(Input).exists());
  });
  it('Test Form filling', () => {
    var ContractForm = shallow(<ContractCreate user={TestUser} />);
    const titleInput = ContractForm.find({'name': 'title'}).first();
    expect(titleInput.exists());
    titleInput.value = 'Test Input Title';
    expect(titleInput.value).toBe('Test Input Title');
  })
  it('Create New Contract', async () => {
    var ContractForm = shallow(<ContractCreate
      user={TestUser}
      history={[]}
    />);
    var ContractInstance = ContractForm.instance();
    const createResult = await ContractInstance.submit({
      'title': 'This is a new Contract',
      'description': `This is a new Contract tested at ${moment.now()}`,
      'hourly_rate': '20',
      'max_weekly_hours': '20',
      'total_budget': '2000',
      'duration': 'short',
      'budget_type': 'hourly'
    });
    expect(createResult.id).toBeGreaterThan(0);
  })
});
