import request from 'request-promise';
import moment from 'moment';
import React, { Component } from 'react';
import Formsy from 'formsy-react';
import { Button, Col, Row, Jumbotron } from 'react-bootstrap'
import FRC from 'formsy-react-components';
import { LinkContainer } from 'react-router-bootstrap';
import Select from 'react-select'


class JobPostForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      view: true,
      editable: false,
      acceptable: false,
      title: '',
      description: '',
      hourly_rate: '',
      max_weekly_hours: '',
      hirer: this.props.user ? this.props.user.id : null,
      freelancer: null,
      total_budget: '',
      duration: '',
      budget_type: '',
      application_type: '',
      accepted: false,
      id: this.props.match && this.props.match.params ? this.props.match.params.id : null,
      validationErrors: {},
      timesheet: ''
    };
  }
  submit(data) {
    var self = this;
    // Assign the user profile as the hiring person.
    data['hirer'] = this.state.hirer;
    data['freelancer'] = this.state.freelancer;
    data['accepted'] = this.state.accepted;
    const requestInstance = request.defaults(this.props.requestConfig);
    if (this.state.id) {
      // Update an existing job by PUT request with the ID..
      const url = `/api/contracts/${this.state.id}/`;
      return requestInstance.put(url).form(data).then(function (response) {
        self.setState({view : true});
        return response;
      }).catch(function (err) {
        self.setState({validationErrors: err.error});
      });
    }
  }
  /**
   * Create TimeSheet of the latest one.
   * @param  {String} lastMonday a start_date of the latest Monday.
   * @return {[type]}            [description]
   */
  createLatestTimeSheet(lastMonday) {
    const self = this;
    const data = {
      contract: this.state.id,
      start_date: lastMonday,
      user: this.props.user.id
    };
    const requestInstance = request.defaults(this.props.requestConfig);
    return requestInstance.post('/api/timesheets/').form(data).then( (response) => {
      self.setState({timesheet: response.id});
      return response;
    });
  }
  /**
   * Load timesheet ID of this week.
   * Create a new timesheet if needs to.
   * @return {[Promise]} A promise of the AJAX request for opening timesheet.
   */
  loadTimeSheet() {
    const requestInstance = request.defaults(this.props.requestConfig);
    const url = `/api/timesheets/?contract=${this.state.id}`;
    const self = this;
    return requestInstance.get(url).then( (response) => {
      if (response.count > 0) {
        return response.results[0];
      } else {
        return {};
      }
    }).then( (response) => {
      const lastMonday = moment().day('Monday').format('YYYY-MM-DD');
      if (lastMonday === response.start_date) {
        self.setState({timesheet: response.id});
        return response;
      } else {
        return self.createLatestTimeSheet(lastMonday);
      }
    });
  }
  /**
   * Get related data of this job post.
   * @return {Promise} a promise of the given AJAX data.
   */
  componentDidMount() {
    const self = this;
    if (this.state.id) {
      const requestInstance = request.defaults(this.props.requestConfig);
      const url = `/api/contracts/${this.state.id}/`;
      const result = requestInstance.get(url).then( (response) => {
        if (self.props.user) {
          // Make edit switch visible if the user is the job creator.
          response['editable'] = self.props.user.id == response.hirer;
          response['is_freelancer'] = self.props.user.id == response.freelancer
          response['acceptable'] = response.is_freelancer && (!response.accepted);
        }
        self.setState(response);
        if (response.is_freelancer) {
          self.loadTimeSheet();
        }
        return response;
      }).catch( (err) => {
        self.setState({validationErrors: err.error});
      });
      return result;
    }
  }
  /**
   * Load freelancer to selector input.
   * @return {[Object.{'value': String, 'label': String}]} a list of options.
   */
  loadFreelancers() {
    const requestInstance = request.defaults(this.props.requestConfig);
    const url = '/api/profiles/?membership=freelancer';
    return requestInstance.get(url).then(function (response) {
      const options = response.results.map(function(item) {
        const fl = item.user;
        return {
          'value': fl.id,
          'label': `${fl.first_name} ${fl.last_name}: ${fl.email}`
        }
      });
      return {
        options: options,
        complete: true
      }
    }).catch(function (err) {
      console.log(err);
    });
  }
  toggleEdit() {
    this.setState({
      view: !this.state.view
    });
  }
  acceptProject() {
    this.state.accepted = true;
    this.submit(this.state);
  }
  render() {
    var self = this;
    var frcForm = <FRC.Form
      onValidSubmit={this.submit.bind(this)}
      validationErrors={this.state.validationErrors}>
      <Row>
        {
          this.state.is_freelancer && this.state.timesheet ?
            <LinkContainer to={`/timesheets/${this.state.timesheet}/`}>
              <Button bsStyle="primary"
                name="timesheet-button"
                formNoValidate={true} type="button">
                Open TimeSheet
              </Button>
            </LinkContainer>
            : ''
        }
        {
          this.state.editable ?
            <Button bsStyle="default"
              name="edit-button"
              formNoValidate={true} type="button" onClick={this.toggleEdit.bind(this)}>
              {
                this.state.view ? 'Edit': 'View'
              }
            </Button>
          : ''
        }
      </Row>
      <fieldset>
        <FRC.Input
            name="title"
            label="Title"
            validations={{
              isWords: true,
              minLength: 8
            }}
            validationErrors={{
              isWords: 'Only use alphanumeric characters',
              minLength: 'Title minimum length is 8'
            }}
            placeholder="What is your project title?"
            value={this.state.title}
            disabled={this.state.view}
            required/>
        <FRC.Textarea
            name="description"
            validations={{
              isWords: true,
              minLength: 50
            }}
            validationErrors={{
              isWords: 'Only use alphanumeric characters',
              minLength: 'Description minimum length is 50'
            }}
            placeholder="What is your project description?"
            label="Description"
            value={this.state.description}
            disabled={this.state.view}
            required/>
        <FRC.Input
            name="hourly_rate"
            validations={{
              isNumeric: true,
            }}
            validationErrors={{
              isNumeric: 'Only use number.',
            }}
            placeholder="Project hourly rate? (20, 30 ..)"
            label="Hourly Rate"
            value={this.state.hourly_rate}
            disabled={this.state.view}
            required/>
        <FRC.Input
            name="max_weekly_hours"
            validations={{
              isNumeric: true,
            }}
            validationErrors={{
              isNumeric: 'Only use number.',
            }}
            placeholder="Project Weekly Hours Cap"
            label="Max Weekly Hours"
            value={this.state.max_weekly_hours}
            disabled={this.state.view}
            required/>
        <br/>
        <FRC.Input
            name="total_budget"
            validations={{
              isNumeric: true,
            }}
            validationErrors={{
              isNumeric: 'Only use number.',
            }}
            placeholder="Project Budget? (20,000, 30,000 ..)"
            label="Project Budget"
            value={this.state.total_budget}
            disabled={this.state.view}
            required/>
        <FRC.Select
            name="duration"
            label="Anticipating Duration"
            options={[
              {value: 'short', label: 'Short Term (About 1 month or less)'},
              {value: 'long', label: 'Long Term (More than 1 month)'}
            ]}
            value={this.state.duration}
            disabled={this.state.view}
        />
        <FRC.Select
            name="budget_type"
            label="Budget Type"
            options={[
              {value: 'hourly', label: 'Hourly - Pay by Hour'},
            ]}
            value={this.state.budget_type}
            disabled={this.state.view}
        />
        <FRC.Row>
          <label className="control-label col-sm-3">
            Freelancer
          </label>
          <Col sm={9}>
            <Select.Async
                name="freelancer"
                value={this.state.freelancer}
                loadOptions={this.loadFreelancers.bind(this)}
                onChange={ (selectedOption) => { this.setState({freelancer: selectedOption.value})} }
                disabled={this.state.view}
            />
          </Col>
        </FRC.Row>
        <FRC.Input
            name="accepted"
            label="Accept Status"
            value={this.state.accepted}
            disabled/>
      <br/>
      </fieldset>
      { !this.state.view ?
        <fieldset>
          <Button bsStyle="primary" className="center-block"
            name="submit-button"
            formNoValidate={true} type="submit">Submit</Button>
        </fieldset>
        : ''
      }
      {
        this.state.acceptable && !this.state.accepted ?
          <fieldset>
            <Button bsStyle="primary" className="center-block"
              name="accept-button"
              formNoValidate={true} type="submit"
              onClick={this.acceptProject.bind(this)}
              disabled={this.state.accepted}>
              Accept Project Contract
            </Button>
          </fieldset>
          : ''
      }
    </FRC.Form>;
    return (
      <Row>
        <Col md={1}></Col>
        <Col md={10}>
          {frcForm}
        </Col>
      </Row>
    );
  }
}

export default JobPostForm;
