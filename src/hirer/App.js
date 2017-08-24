import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Link,
  Switch
} from 'react-router-dom'
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap';
import request from 'request-promise'
import store from 'store'
import FontAwesome from 'react-fontawesome';

import AppBase from '../AppBase'
import LoginForm from '../LoginForm';
import SignUpForm from '../SignUpForm';
import Payment from './Payment';

import InvoiceTable from './InvoiceTable';
import InvoiceView from './InvoiceView';

import ContractCreateForm from './ContractCreateForm';
import ContractList from './ContractList';
import ContractPostForm from './ContractPostForm';

import TimeSheetView from './TimeSheetView';

class App extends AppBase {

  render() {
    return (
      <Router>
        <div>
          <Navbar inverse collapseOnSelect>
            <Navbar.Header>
              <Navbar.Brand>
                <a href="/"><img style={{maxHeight: '50px', marginTop: '-15px'}} src="/static/assets/img/png/dark_logo_only.png"/></a>
              </Navbar.Brand>
              <Navbar.Brand>
                <a href="/">Fremancer</a>
              </Navbar.Brand>
              <Navbar.Toggle />
            </Navbar.Header>
            <Navbar.Collapse>
              <Nav>
                <LinkContainer to="/contracts/">
                  <NavItem eventKey={4}>
                    <FontAwesome name='briefcase' size='lg'/> Contracts
                  </NavItem>
                </LinkContainer>
                <LinkContainer to="/invoices/">
                  <NavItem eventKey={6}>
                    <FontAwesome name='credit-card' size='lg'/> Invoices
                  </NavItem>
                </LinkContainer>
              </Nav>
              <Nav pullRight>
                <NavDropdown eventKey="1" title={this.state.user && this.state.user.username ? this.state.user.username : 'Loading..'} id="nav-dropdown">
                  <LinkContainer to="/accounts/payment/">
                    <MenuItem eventKey="1.2">Payment</MenuItem>
                  </LinkContainer>
                  <MenuItem eventKey="1.1" onClick={this.removeAuth.bind(this)}>Log Out</MenuItem>
                </NavDropdown>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
          <Route exact path="/" render={ () =>
            <Redirect to="/contracts"/>
          }/>
          <Route path="/accounts/" render={() =>
            <Switch>
              <Route exact path='/accounts/payment/' render={ (props) =>
                <Payment
                  user={this.state.user}
                  {...props}/>
              }/>
            </Switch>
          }/>
          <Route path="/contracts/" render={() =>
            <Switch>
              <Route exact path='/contracts/' render={ (props) =>
                <ContractList
                  user={this.state.user}
                  {...props}/>
              }/>
              <Route exact path='/contracts/create/' render={ (props) =>
                <ContractCreateForm
                  user={this.state.user}
                  {...props}
                />
              }/>
              <Route path='/contracts/:id/' render={ (props) =>
                <ContractPostForm
                  user={this.state.user}
                  {...props}
                />
              }/>
            </Switch>
          }/>
          <Route path="/timesheets/" render={ () =>
            <Switch>
              <Route path="/timesheets/:id/" render={ (props) =>
                <TimeSheetView
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
              <Route path="/invoices/:id/" render={ (props) =>
                <InvoiceView
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
