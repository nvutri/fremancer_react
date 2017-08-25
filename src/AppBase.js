import { Component } from 'react';
import request from 'request-promise'

import { RequestConfig } from './Config';


class AppBase extends Component {

  constructor(props) {
    super(props);
    this.state = {
      authenticated: false,
      user: {}
    }
  }

  componentWillMount() {
    const requestInstance = request.defaults(RequestConfig);
    const self = this;
    requestInstance.post('/api/users/is_authenticated/').then( (res) => {
      if (res.success) {
        self.setState({
          authenticated: true,
          user: res.user
        });
      }
    })
  }

  authenticate(authData) {
    const requestInstance = request.defaults(RequestConfig);
    const self = this;
    return requestInstance.post('/api/users/authenticate/').form(authData).then( (res) => {
      self.setState({
        authenticated: true,
        user: res
      });
      return res;
    }).catch( (errors) => {
      return errors
    });
  }

  removeAuth() {
    const requestInstance = request.defaults(RequestConfig);
    const self = this;
    // Cancel backend session.
    return requestInstance.post('/api/users/logout/').then( () => {
      self.setState({
        authenticated: false,
        user: null
      });
      // Move back to the login page.
      window.location = '/login/';
    });
  }
}

export default AppBase;
