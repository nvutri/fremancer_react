const TestUser = {
  'username': 'freelancer@gmail.com',
  'password': 'Thisisfreelancing',
};

const RequestConfig = {
  baseUrl: 'http://localhost:8000',  // Test Server.
  json: true,
  auth: TestUser
};

module.exports = {
  TestUser,
  RequestConfig
};
