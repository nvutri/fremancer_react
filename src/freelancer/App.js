import React from 'react';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch
} from 'react-router-dom'
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap';

import AppBase from '../AppBase';

import Contract from './Contract';
import ContractList from './ContractList';

import InvoiceForm from './InvoiceForm';
import InvoiceTable from './InvoiceTable';
import InvoiceView from './InvoiceView';

import TimeSheet from './TimeSheet';
import TimeSheetTable from './TimeSheetTable';

import WithdrawalTable from './WithdrawalTable';
import WithdrawalForm from './WithdrawalForm';

class App extends AppBase {
  render() {
    return (
      <Router>
        <div>
          <Navbar inverse collapseOnSelect>
            <Navbar.Header>
              <Navbar.Brand>
                <a href="/">
                  <img
                    alt="F"
                    style={{maxHeight: '50px', marginTop: '-15px'}}
                    src="/static/assets/img/png/dark_logo_only.png"/>
                </a>
              </Navbar.Brand>
              <Navbar.Brand>
                <a href="/">Fremancer</a>
              </Navbar.Brand>
              <Navbar.Toggle />
            </Navbar.Header>
            <Navbar.Collapse>
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
              <Nav pullRight>
                <NavDropdown eventKey="1" title={this.state.user && this.state.user.username ? this.state.user.username : 'Loading..'} id="nav-dropdown">
                  <MenuItem eventKey="1.1" onClick={this.removeAuth.bind(this)}>Log Out</MenuItem>
                </NavDropdown>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
          <Route exact path="/" render={(props) => <Redirect to="/contracts"/>}/>
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
              <Route exact path="/withdrawals/create/" render={ (props) =>
                <WithdrawalForm
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
