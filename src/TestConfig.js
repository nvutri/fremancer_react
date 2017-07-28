import React from 'react';

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

module.exports = {
  TestUser,
  RequestConfig,
  RouterContext
};
