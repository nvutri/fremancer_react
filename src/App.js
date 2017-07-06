import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import JobTable from './JobTable'

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Fremancer</h2>
        </div>
        <div className="row jumbotron">
          <div className="col-md-2"></div>
          <div className="col-md-8">
            <JobTable/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
