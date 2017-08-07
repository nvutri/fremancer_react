import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch
} from 'react-router-dom'
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap';
import request from 'request-promise'
import store from 'store'


class AppBase extends Component {

  constructor(props) {
    super(props);
    this.state = {
      requestConfig: {
        baseUrl: 'http://localhost:8000',
        json: true
      },
      authenticated: false
    }
  }

  componentWillMount() {
    const authData = store.get('auth');
    if (authData) {
      this.authenticate(authData);
    }
    const userData = store.get('user');
    if (userData) {
      this.state.user = userData;
    }
  }

  authenticate(authData) {
    var requestInstance = request.defaults(this.state.requestConfig);
    var self = this;
    return requestInstance.post('/authenticate/').form(authData).then( (res) => {
      // Save authentication data in the local storage for later re-login.
      store.set('auth', authData);
      store.set('user', res);
      // Set the authentication state.
      self.state.requestConfig['auth'] = authData;
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
    const requestInstance = request.defaults(this.state.requestConfig);
    const self = this;
    // Cancel backend session.
    return requestInstance.post('/api/users/logout/').then( () => {
      store.remove('auth');
      store.remove('user');
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
