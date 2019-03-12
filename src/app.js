import React from 'react';
import ReactDOM from 'react-dom';
import App from './componenets/App';

require('./index.html');

// Create app
const container = document.querySelector('#app-container');

// Render app
ReactDOM.render(
    <App/>
);
