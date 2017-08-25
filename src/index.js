import React from 'react';
import ReactDOM from 'react-dom';

import App from './hirer/App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
