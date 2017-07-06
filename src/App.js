import React, { Component } from 'react';
import './App.css';
import JobTable from './JobTable'

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
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
