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


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      requestConfig: {
        baseUrl: 'http://localhost:8000',
        json: true
      }
    }
  }
  setAuth(requestConfig, user) {
    this.setState({
      requestConfig: requestConfig,
      requestInstance: request.defaults(requestConfig),
      user: user
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
              <Nav>
                <LinkContainer to="/login">
                 <NavItem eventKey={1}>Login</NavItem>
                </LinkContainer>
                <LinkContainer to="/signup">
                 <NavItem eventKey={2}>Sign Up</NavItem>
                </LinkContainer>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
          <hr/>
          <Route exact path="/" component={Home}/>
          <Route path="/login" render={() =>
            <LoginForm
              requestConfig={this.state.requestConfig}
              setAuth={this.setAuth.bind(this)}
            />}
          />
          <Route path="/signup" render={() =>
            <SignUpForm
              requestConfig={this.state.requestConfig}
              setAuth={this.setAuth.bind(this)}
            />}
          />
        </div>
      </Router>
    )
  }
}

export default App;
