import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'
import { Navbar, Nav, NavItem } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap';

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
  setAuth(requestConfig, user) {
    this.setState({
      authenticated: true,
      requestConfig: requestConfig,
      user: user
    })
  }
  removeAuth() {
    this.setState(this.initialState);
  }
  render() {
    console.log(this.state);
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
                <LinkContainer to="/login">
                 <NavItem eventKey={1}>Login</NavItem>
                </LinkContainer>
                <LinkContainer to="/signup">
                 <NavItem eventKey={2}>Sign Up</NavItem>
                </LinkContainer>
                <LinkContainer to="/jobs">
                 <NavItem eventKey={3}>Job Board</NavItem>
                </LinkContainer>
                { this.state.authenticated ?
                  <LinkContainer to="/postjobs">
                    <NavItem eventKey={4}>Post Job</NavItem>
                  </LinkContainer> : ''
                }
              </Nav>
            </Navbar.Collapse>
          </Navbar>
          <hr/>
          <Route exact path="/" component={Home}/>
          <Route path="/login" render={() =>
            <LoginForm
              requestConfig={this.state.requestConfig}
              setAuth={this.setAuth.bind(this)}
            />
          }/>
          <Route path="/signup" render={() =>
            <SignUpForm
              requestConfig={this.state.requestConfig}
              setAuth={this.setAuth.bind(this)}
            />
          }/>
          <Route path="/jobs" render={() =>
            <JobTable
              requestConfig={this.state.requestConfig}
            />
          }/>
          { this.state.authenticated ?
            <Route path="/postjobs" render={() =>
              <JobPostForm
                requestConfig={this.state.requestConfig}
                user={this.state.user}
              />
            }/> :
            <div/>
          }
        </div>
      </Router>
    )
  }
}

export default App;
