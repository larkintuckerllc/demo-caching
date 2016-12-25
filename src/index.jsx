import 'babel-polyfill';
import 'bootstrap-loader';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './configureStore';
import App from './components/App';
import './favicon.ico';
import './index.scss';
import './fallback_playable.pdf';
// SERVER EMULATION
import './default_playable.pdf';
import './playable.pdf';
import './default_playable.json';
import './playable.json';

const store = configureStore();
render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
