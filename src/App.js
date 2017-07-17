import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch
} from 'react-router-dom'
import { Navbar, Nav, NavItem } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap';
import request from 'request-promise'
import store from 'store'

import Home from './Home';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';
import JobTable from './JobTable';
import JobPostForm from './JobPostForm';


class App extends Component {

  constructor(props) {
    super(props);
    this.initialState = {
      requestConfig: {
        baseUrl: 'http://localhost:8000',
        json: true
      },
      authenticated: false
    }
    this.state = Object.assign({}, this.initialState);
  }
  componentDidMount() {
    const authData = store.get('auth');
    if (authData) {
      this.setAuth(authData);
    }
  }
  setAuth(authData) {
    authData['sendImmediately'] = true;
    // Create an request config based on the given authentication data.
    var requestConfig = Object.assign({'auth': authData}, this.state.requestConfig);
    var self = this;
    // Create a request instance based on the current configuration.
    const requestInstance = request.defaults(requestConfig);
    return requestInstance.get('/api/users/').then(function (response) {
      // Save authentication data in the local storage for later re-login.
      store.set('auth', authData);
      // Set the authentication state.
      self.setState({
        authenticated: true,
        requestConfig: requestConfig,
        user: response
      });
      return response;
    }).catch(function (err) {
      console.log(err);
    });
  }
  removeAuth() {
    store.remove('auth');
    this.setState(this.initialState);
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
              <Nav>
                <LinkContainer to="/login/">
                 <NavItem eventKey={1}>Login</NavItem>
                </LinkContainer>
                <LinkContainer to="/signup/">
                 <NavItem eventKey={2}>Sign Up</NavItem>
                </LinkContainer>
                <LinkContainer to="/jobs/">
                 <NavItem eventKey={3}>Job Board</NavItem>
                </LinkContainer>
              </Nav>
              {this.state.authenticated ?
                <Nav pullRight>
                  <NavItem eventKey={1} href="#">{this.state.user.username}</NavItem>
                </Nav>
                :
                ''
              }
            </Navbar.Collapse>
          </Navbar>
          <Route exact path="/" component={Home}/>
          <Route path="/login" render={() =>
            <LoginForm
              ref={ (instance) => { this.loginForm = instance; } }
              requestConfig={this.state.requestConfig}
              setAuth={this.setAuth.bind(this)}
            />
          }/>
          <Route path="/signup/" render={() =>
            <SignUpForm
              requestConfig={this.state.requestConfig}
              setAuth={this.setAuth.bind(this)}
            />
          }/>
          <Route path="/jobs/" render={() =>
            <Switch>
              <Route exact path='/jobs' render={ (props) => {
                return <JobTable
                  requestConfig={this.state.requestConfig}
                  {...props.match}
                />
              }
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
        </div>
      </Router>
    )
  }
}

export default App;
