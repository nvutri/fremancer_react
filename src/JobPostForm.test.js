import React from 'react';
import { mount, shallow } from 'enzyme';
import { Input } from 'formsy-react-components';
import sinon from 'sinon';
import moment from 'moment';

import JobPostForm from './JobPostForm';
import { RequestConfig, TestUser } from './TestConfig';

describe('Job Post Form', () => {
  it('renders three <Input/> components', () => {
    const wrapper = shallow(<JobPostForm
      requestConfig={RequestConfig}
      user={TestUser}
      id={1}
    />);
    expect(wrapper.find(Input).exists());
    expect(wrapper.find(Input)).toHaveLength(4)
  });
  it('Test Form filling', () => {
    var jobForm = shallow(<JobPostForm
      requestConfig={RequestConfig}
      user={TestUser}
    />);
    const titleInput = jobForm.find({'name': 'title'}).first();
    expect(titleInput.exists());
    titleInput.value = 'Test Input Title';
    expect(titleInput.value).toBe('Test Input Title');
  })
  it('Create and update New Job', async () => {
    var jobForm = shallow(<JobPostForm
      requestConfig={RequestConfig}
      user={TestUser}
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
    const updateResult = await jobInstance.submit({
      'title': 'This is update the exiting job',
      'description': 'This is a updated job',
      'hourly_rate': '20',
      'max_weekly_hours': '20',
      'total_budget': '2000',
      'duration': 'short',
      'budget_type': 'hourly'
    });
    expect(updateResult.id).toBe(createResult.id);
    expect(updateResult.title).toBe('This is update the exiting job');
  })
  it('Update Existing Job', async () => {
    const jobForm = shallow(<JobPostForm
      requestConfig={RequestConfig}
      user={TestUser}
      params={{id: 1}}
    />);
    const submitResult = await jobForm.instance().submit({
      'title': 'This is update the exiting job',
      'description': 'This job is updated',
      'hourly_rate': '20',
      'max_weekly_hours': '20',
      'total_budget': '2000',
      'duration': 'short',
      'budget_type': 'hourly',
      'freelancer': 6
    });
    expect(submitResult.id).toBe(1);
    expect(submitResult.title).toBe('This is update the exiting job');
  });
  it('Load Value from Server', () => {
    sinon.spy(JobPostForm.prototype, 'componentDidMount');
    var wrapper = mount(<JobPostForm
      requestConfig={RequestConfig}
      id={1}
      user={TestUser}
    />);
    expect(JobPostForm.prototype.componentDidMount.calledOnce).toBe(true);
  });
});
