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

import Home from './Home';
import LoginForm from '../LoginForm';
import SignUpForm from '../SignUpForm';


class App extends Component {

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
    store.remove('auth');
    store.remove('user');
    this.setState({
      authenticated: false,
      user: null
    })
    window.location = '/login/';
  }
  render() {
    return (
      <Router>
        <div>
          <Navbar inverse collapseOnSelect>
            <Navbar.Header>
              <Navbar.Brand>
                <a href="/">Fremancer</a>
              </Navbar.Brand>
              <Navbar.Toggle />
            </Navbar.Header>
            <Navbar.Collapse>
              <Nav pullRight>
                <LinkContainer to="/login/">
                 <NavItem eventKey={1}>Login</NavItem>
                </LinkContainer>
                <LinkContainer to="/signup/">
                 <NavItem eventKey={2}>Sign Up</NavItem>
                </LinkContainer>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
          <Route exact path="/" component={Home}/>
          <Route path="/login/" render={ (props) =>
            <LoginForm
              ref={ (instance) => { this.loginForm = instance; } }
              requestConfig={this.state.requestConfig}
              authenticate={this.authenticate.bind(this)}
              {...props}
            />
          }/>
          <Route path="/signup/" render={ (props) =>
            <SignUpForm
              requestConfig={this.state.requestConfig}
              authenticate={this.authenticate.bind(this)}
              {...props}
            />
          }/>
        </div>
      </Router>
    )
  }
}

export default App;
