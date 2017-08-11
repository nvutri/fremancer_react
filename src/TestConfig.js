import React from 'react';
import request from 'request-promise'

const TestUser = {
  'username': 'freelancer@gmail.com',
  'password': 'Thisisfreelancing',
  'id': 6
};

const RequestConfig = {
  baseUrl: 'http://localhost:8000',  // Test Server.
  json: true,
  auth: TestUser
};

const MockFunction = function () {
};

const RouterContext = {
  context: {
    router: {
      history : {
          createHref: MockFunction,
          push: MockFunction,
          replace: MockFunction
      },
      route: {
        location : {}
      }
    }
  },
  childContextTypes: {router: React.PropTypes.object}
};

function Authenticate(authData) {
  if (!authData) {
    authData = TestUser;
  }
  const requestInstance = request.defaults(RequestConfig);
  return requestInstance.post('/api/users/authenticate/').form(authData).then( (res) => {
    return res;
  });
}

module.exports = {
  Authenticate,
  TestUser,
  RequestConfig,
  RouterContext
};
