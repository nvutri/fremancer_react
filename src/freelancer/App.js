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
import AppBase from '../AppBase';
import LoginForm from '../LoginForm';
import SignUpForm from '../SignUpForm';

import Contract from './Contract';
import ContractList from './ContractList';

import InvoiceForm from './InvoiceForm';
import InvoiceTable from './InvoiceTable';
import InvoiceView from './InvoiceView';

import TimeSheet from './TimeSheet';
import TimeSheetTable from './TimeSheetTable';

import WithdrawalTable from './WithdrawalTable';

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
                <LinkContainer to="/contracts/">
                 <NavItem eventKey={4}>Contracts</NavItem>
                </LinkContainer>
                <LinkContainer to="/timesheets/">
                 <NavItem eventKey={5}>TimeSheets</NavItem>
                </LinkContainer>
                <LinkContainer to="/invoices/">
                 <NavItem eventKey={6}>Invoices</NavItem>
                </LinkContainer>
                <LinkContainer to="/withdrawals/">
                 <NavItem eventKey={7}>Withdrawals</NavItem>
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
              authenticate={this.authenticate.bind(this)}
              {...props}
            />
          }/>
          <Route path="/signup/" render={ (props) =>
            <SignUpForm
              requestConfig={this.state.requestConfig}
              {...props}
            />
          }/>
          <Route path="/contracts/" render={ (props) =>
            <Switch>
              <Route exact path='/contracts/' render={ (props) =>
                <ContractList
                  user={this.state.user}
                />
              }/>
              <Route path='/contracts/:id/' render={ (props) =>
                <Contract
                  user={this.state.user}
                  {...props}
                />
              }/>
            </Switch>
          }/>
          <Route path="/timesheets/" render={ () =>
            <Switch>
              <Route exact path='/timesheets/' render={ (props) =>
                <TimeSheetTable
                  user={this.state.user}
                  {...props}
                />
              }/>
              <Route exact path="/timesheets/create/" render={ (props) =>
                <TimeSheetCreate
                  user={this.state.user}
                  {...props}
                />
              }/>
              <Route path="/timesheets/:id/" render={ (props) =>
                <TimeSheet
                  user={this.state.user}
                  {...props}
                />
              }/>
            </Switch>
          }/>
          <Route path="/invoices/" render={ () =>
            <Switch>
              <Route exact path='/invoices/' render={ (props) =>
                <InvoiceTable
                  user={this.state.user}
                  {...props}
                />
              }/>
              <Route exact path="/invoices/create/" render={ (props) =>
                <InvoiceForm
                  user={this.state.user}
                  {...props}
                />
              }/>
              <Route path="/invoices/:id/" render={ (props) =>
                <InvoiceView
                  user={this.state.user}
                  {...props}
                />
              }/>
            </Switch>
          }/>
          <Route path="/withdrawals/" render={ () =>
            <Switch>
              <Route exact path='/withdrawals/' render={ (props) =>
                <WithdrawalTable
                  user={this.state.user}
                  {...props}
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
