import React from 'react';
import moment from 'moment';
import { mount, shallow } from 'enzyme';
import { Input } from 'formsy-react-components';
import sinon from 'sinon';
import request from 'request-promise';

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
    jobForm.setState({
      freelancer: 6,
      hirer: 6,
      accepted: true
    });
    const submitResult = await jobForm.instance().submit({
      'title': 'This is update the exiting job',
      'description': 'This job is updated',
      'hourly_rate': '20',
      'max_weekly_hours': '20',
      'total_budget': '2000',
      'duration': 'short',
      'budget_type': 'hourly',
      'freelancer': 6,
      'hirer': 6
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
  it('Load timesheet', async () => {
    const jobForm = shallow(<JobPostForm
      requestConfig={RequestConfig}
      user={TestUser}
      match={{params: {id: 1}}}
    />);
    const createResult = await jobForm.instance().loadTimeSheet();
    expect(createResult.contract).toBe(1);
    const lastMonday = moment().day('Monday').format('YYYY-MM-DD');
    expect(createResult.start_date).toBe(lastMonday);
    // Delete last monday start_date to test creating new time sheet.
    const requestInstance = request.defaults(RequestConfig);
    requestInstance.delete(`/api/timesheets/${createResult.id}/`);
  });
});
