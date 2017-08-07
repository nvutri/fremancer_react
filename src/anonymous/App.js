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

import AppBase from '../AppBase';
import LoginForm from '../LoginForm';
import SignUpForm from '../SignUpForm';
import Home from './Home';


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
