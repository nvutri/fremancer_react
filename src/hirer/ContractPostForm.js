import request from 'request-promise';
import moment from 'moment';
import React, { Component } from 'react';
import { Button, Col, Row, Jumbotron } from 'react-bootstrap'
import FRC from 'formsy-react-components';
import { LinkContainer } from 'react-router-bootstrap';
import Select from 'react-select'
import { RequestConfig } from '../Config'


class ContractPostForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      view: true,
      hirer: this.props.user ? this.props.user.id : null,
      id: props.match.params.id,
      payments: [],
      validationErrors: {},
    };
  }
  submit(data) {
    var self = this;
    // Assign the user profile as the hiring person.
    data['hirer'] = this.state.hirer;
    data['freelancer'] = this.state.freelancer;
    const requestInstance = request.defaults(RequestConfig);
    if (this.state.id) {
      // Update an existing Contract by PUT request with the ID..
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
   * Load timesheet ID of this week.
   * Create a new timesheet if needs to.
   * @return {[Promise]} A promise of the AJAX request for opening timesheet.
   */
  loadTimeSheet() {
    const requestInstance = request.defaults(RequestConfig);
    const url = `/api/timesheets/?contract=${this.state.id}`;
    const self = this;
    return requestInstance.get(url).then( (response) => {
      if (response.count > 0) {
        return response.results[0];
      } else {
        return {};
      }
    }).then( (response) => {
      if (response.start_date) {
        self.setState({timesheet: response.id});
        return response;
      }
    });
  }
  /**
   * Get related data of this Contract post.
   * @return {Promise} a promise of the given AJAX data.
   */
  componentDidMount() {
    const self = this;
    const requestInstance = request.defaults(RequestConfig);
    requestInstance.get('/api/invoices/list_payments/').then( response => {
      const paymentOptions = response.data.map( item => {
        return {
          value: item.id,
          label: `${item.name}: ${item.brand} - ${item.last4} ${item.exp}`
        }
      });
      self.setState({
        payments: paymentOptions
      });
    });
    return requestInstance.get(`/api/contracts/${this.state.id}/`).then( (response) => {
      self.setState(response);
      self.loadTimeSheet();
      return response;
    }).catch( (err) => {
      self.setState({validationErrors: err.error});
    });
  }

  /**
   * Load freelancer to selector input.
   * @return {[Object.{'value': String, 'label': String}]} a list of options.
   */
  loadFreelancers() {
    const requestInstance = request.defaults(RequestConfig);
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
  render() {
    var self = this;
    var frcForm = <FRC.Form
      onValidSubmit={this.submit.bind(this)}
      validationErrors={this.state.validationErrors}>
      <Row>
        {
          this.state.timesheet ?
            <LinkContainer to={`/timesheets/${this.state.timesheet}/`}>
              <Button bsStyle="primary"
                name="timesheet-button"
                formNoValidate={true} type="button">
                Open TimeSheet
              </Button>
            </LinkContainer>
            : ''
        }
        <Button bsStyle="default"
          name="edit-button"
          formNoValidate={true} type="button"
          onClick={ e => this.setState({view: !this.state.view}) }>
          {
            this.state.view ? 'Edit': 'View'
          }
        </Button>
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
                onChange={ (value) => { this.setState({freelancer: value})} }
                disabled={this.state.view}
            />
          </Col>
        </FRC.Row>
        <FRC.Row>
          <Col sm={9}>
            <FRC.Select
                name="default_payment"
                label="Default Payment"
                labelClassName={[{'col-sm-3': false}, 'col-sm-4']}
                elementWrapperClassName={[{'col-sm-9': false}, 'col-sm-8']}
                options={this.state.payments}
                value={this.state.budget_type}
                disabled={this.state.view}/>
          </Col>
          <Col sm={3}>
            <LinkContainer to={`/accounts/payment/`}>
              <Button bsStyle="primary"
                name="timesheet-button"
                formNoValidate={true} type="button">
                Add Payment
              </Button>
            </LinkContainer>
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

export default ContractPostForm;
