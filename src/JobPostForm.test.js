// Link.react-test.js
import React from 'react';
import { shallow } from 'enzyme';
import FRC from 'formsy-react-components';

import JobPostForm from './JobPostForm';

const { Input, Textarea, Select } = FRC;

describe('Job Post Form', () => {
  it('renders three <Input/> components', () => {
    const wrapper = shallow(<JobPostForm/>);
    expect(wrapper.find(Input).exists());
    expect(wrapper.find(Input)).toHaveLength(4)
  });
  it('Fill and submit forms', async () => {
    const jobForm = shallow(<JobPostForm/>);
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
