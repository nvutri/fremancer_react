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
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';
import JobTable from './JobTable';
import JobPostForm from './JobPostForm';
import TimeSheet from './TimeSheet';
import Contract from './Contract';


class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      requestConfig: {
        baseUrl: 'http://localhost:8000',
        json: true
      },
      authenticated: false,
      auth: null
    }
  }
  componentWillMount() {
    const authData = store.get('auth');
    if (authData) {
      this.setAuth(authData);
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
      if (res.success) {
        self.setAuth(authData);
      }
      return res;
    });
  }
  setAuth(authData) {
    authData['sendImmediately'] = true;
    // Create an request config based on the given authentication data.
    this.state.requestConfig['auth'] = authData;
    // Create a request instance based on the current configuration.
    const requestInstance = request.defaults(this.state.requestConfig);
    const self = this;
    return requestInstance.get('/api/users/').then( (response) => {
      // Save authentication data in the local storage for later re-login.
      store.set('auth', authData);
      store.set('user', response);
      // Set the authentication state.
      self.setState({
        authenticated: true,
        user: response
      });
      return response;
    }).catch(function (err) {
      console.log(err);
    });
  }
  removeAuth() {
    store.remove('auth');
    store.remove('user');
    this.setState({
      authenticated: false,
      user: null
    })
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
              { this.state.authenticated ?
              <Nav>
                <LinkContainer to="/jobs/">
                 <NavItem eventKey={3}>Job Board</NavItem>
                </LinkContainer>
                <LinkContainer to="/contracts/">
                 <NavItem eventKey={4}>Contracts</NavItem>
                </LinkContainer>
              </Nav>
              : ''
              }
              { this.state.authenticated ?
                <Nav pullRight>
                  <NavDropdown eventKey="1" title={this.state.user.username} id="nav-dropdown">
                    <MenuItem eventKey="1.1" onClick={this.removeAuth.bind(this)}>Log Out</MenuItem>
                  </NavDropdown>
                </Nav>
                  :
                <Nav pullRight>
                  <LinkContainer to="/login/">
                   <NavItem eventKey={1}>Login</NavItem>
                  </LinkContainer>
                  <LinkContainer to="/signup/">
                   <NavItem eventKey={2}>Sign Up</NavItem>
                  </LinkContainer>
                </Nav>
              }
            </Navbar.Collapse>
          </Navbar>
          <Route exact path="/" component={Home}/>
          <Route path="/login" render={ (props) =>
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
          <Route path="/jobs/" render={() =>
            <Switch>
              <Route exact path='/jobs' render={ (props) =>
                <JobTable
                  requestConfig={this.state.requestConfig}
                  {...props.match}
                />
              }/>
              <Route exact path='/jobs/create/' render={ (props) =>
                <JobPostForm
                  requestConfig={this.state.requestConfig}
                />
              }/>
              <Route path='/jobs/:id/' render={ (props) =>
                <JobPostForm
                    requestConfig={this.state.requestConfig}
                    user={this.state.user}
                    {...props.match}
                  />
              }/>
            </Switch>
          }/>
          <Route path="/contracts/" render={ (props) =>
            <Contract
              requestConfig={this.state.requestConfig}
              user={this.state.user}
            />
          }/>
          <Route path="/timesheets/:contract/:id/" render={ (props) =>
            <TimeSheet
              requestConfig={this.state.requestConfig}
              user={this.state.user}
              {...props.match}
            />
          }/>
        </div>
      </Router>
    )
  }
}

export default App;
