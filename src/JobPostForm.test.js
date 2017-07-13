import React from 'react';
import { shallow } from 'enzyme';
import { Input } from 'formsy-react-components';

import JobPostForm from './JobPostForm';
import { RequestConfig, TestUser } from './TestConfig';

describe('Job Post Form', () => {
  it('renders three <Input/> components', () => {
    const wrapper = shallow(<JobPostForm/>);
    expect(wrapper.find(Input).exists());
    expect(wrapper.find(Input)).toHaveLength(4)
  });
  it('Fill and submit forms', async () => {
    const jobForm = shallow(<JobPostForm
      requestConfig={RequestConfig}
      user={TestUser}
      id={1}
    />);
    const titleInput = jobForm.find({'name': 'title'}).first();
    expect(titleInput.exists());
    titleInput.value = 'Test Input Title';
    expect(titleInput.value).toBe('Test Input Title');
    const submitPromise = jobForm.instance().submit({
      'title': 'This is a title',
      'description': 'This is a test project for further development in future',
      'hourly_rate': '20',
      'max_weekly_hours': '20',
      'total_budget': '2000',
      'duration': 'short',
      'budget_type': 'hourly'
    });
  })
});
