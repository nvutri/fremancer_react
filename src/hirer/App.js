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

import AppBase from '../AppBase'
import LoginForm from '../LoginForm';
import SignUpForm from '../SignUpForm';
import Contract from './Contract';
import Home from './Home';
import JobTable from './JobTable';
import JobPostForm from './JobPostForm';
import JobCreateForm from './JobCreateForm';


class App extends AppBase {

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
          <Route path="/jobs/" render={() =>
            <Switch>
              <Route exact path='/jobs/' render={ (props) =>
                <JobTable
                  requestConfig={this.state.requestConfig}
                  {...props}
                />
              }/>
              <Route exact path='/jobs/create/' render={ (props) =>
                <JobCreateForm
                  requestConfig={this.state.requestConfig}
                  user={this.state.user}
                  {...props}
                />
              }/>
              <Route path='/jobs/:id/' render={ (props) =>
                <JobPostForm
                    requestConfig={this.state.requestConfig}
                    user={this.state.user}
                    {...props}
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
        </div>
      </Router>
    )
  }
}

export default App;
