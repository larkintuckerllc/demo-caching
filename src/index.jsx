import 'babel-polyfill';
import 'bootstrap-loader';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './configureStore';
import App from './components/App';
import './favicon.ico';
import './index.scss';
import './fallback.pdf';
// TODO: IMPLEMENT IN SERVER
import './offline.pdf';
import './online.pdf';
import './offline_playable.json';
import './online_playable.json';

const store = configureStore();
render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);