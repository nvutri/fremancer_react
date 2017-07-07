import React, { Component } from 'react';
import Formsy from 'formsy-react';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import { Button } from 'react-bootstrap'
import { FormsyText } from 'formsy-material-ui/lib';

class JobTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      canSubmit: false
    };
    this.errorMessages = {
       'wordsError': "Please only use letters",
       'numericError': "Please provide a number",
       'urlError': "Please provide a valid URL",
    };
  }

  submitForm(data) {
    alert(JSON.stringify(data, null, 4));
  }

  notifyFormError(data) {
    console.error('Form error:', data);
  }

  render() {
    let { wordsError, numericError, urlError } = this.errorMessages;

    return (
      <MuiThemeProvider muiTheme={getMuiTheme()}>
        <Formsy.Form
          onValid={(e) => this.setState({canSubmit: true})}
          onInvalid={(e) => this.setState({canSubmit: false})}
          onValidSubmit={this.submitForm.bind(this)}
          onInvalidSubmit={this.notifyFormError.bind(this)}
        >
          <FormsyText
            name="title"
            validations={{
              isWords: true,
              minLength: 8
            }}
            validationErrors={{
              isWords: 'Only use alphanumeric characters',
              minLength: 'Title minimum length is 8'
            }}
            hintText="What is your project title?"
            floatingLabelText="Title"
            required
          />
          <br/>
          <FormsyText
            name="description"
            validations={{
              isWords: true,
              minLength: 50
            }}
            validationErrors={{
              isWords: 'Only use alphanumeric characters',
              minLength: 'Description minimum length is 50'
            }}
            hintText="What is your project description?"
            floatingLabelText="Description"
            required
          />
          <br/>
          <Button type="submit">Submit</Button>
          <br/>
        </Formsy.Form>
      </MuiThemeProvider>
    );
  }
}

export default JobTable;
