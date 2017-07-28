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
  it('Update Existing Job', async () => {
    const jobForm = shallow(<JobPostForm
      requestConfig={RequestConfig}
      user={TestUser}
      match={{params: {id: 1}}}
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
      params={{id: 1}}
      user={TestUser}
    />);
  });
  it('Test Editability for Owner and non-owner', () => {
    var jobForm = shallow(<JobPostForm
      requestConfig={RequestConfig}
      user={TestUser}
      params={{id: 1}}
    />);
    expect(jobForm.find({'name': 'edit-button'}).exists());
    expect(jobForm.find({'name': 'accept-button'}).exists());
    expect(jobForm.find({'name': 'submit-button'}).exists());
  });
});
