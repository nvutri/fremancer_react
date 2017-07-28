import React from 'react';
import { mount, shallow } from 'enzyme';
import { Input } from 'formsy-react-components';
import sinon from 'sinon';
import moment from 'moment';

import JobCreateForm from './JobCreateForm';
import { RequestConfig, TestUser } from './TestConfig';

describe('Job Create Form', () => {
  it('renders three <Input/> components', () => {
    const wrapper = shallow(<JobCreateForm
      requestConfig={RequestConfig}
      user={TestUser}
      id={1}
    />);
    expect(wrapper.find(Input).exists());
  });
  it('Test Form filling', () => {
    var jobForm = shallow(<JobCreateForm
      requestConfig={RequestConfig}
      user={TestUser}
    />);
    const titleInput = jobForm.find({'name': 'title'}).first();
    expect(titleInput.exists());
    titleInput.value = 'Test Input Title';
    expect(titleInput.value).toBe('Test Input Title');
  })
  it('Create New Job', async () => {
    var jobForm = shallow(<JobCreateForm
      requestConfig={RequestConfig}
      user={TestUser}
      history={[]}
    />);
    var jobInstance = jobForm.instance();
    const createResult = await jobInstance.submit({
      'title': 'This is a new job',
      'description': `This is a new Job tested at ${moment.now()}`,
      'hourly_rate': '20',
      'max_weekly_hours': '20',
      'total_budget': '2000',
      'duration': 'short',
      'budget_type': 'hourly'
    });
    expect(createResult.id).toBeGreaterThan(0);
  })
});
