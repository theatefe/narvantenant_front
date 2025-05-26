import React from 'react';
import ReactDOM from 'react-dom/client';
import { swRegister } from 'pwa-updater';
import { BrowserRouter } from 'react-router-dom';
// third-party
import { Provider as ReduxProvider } from 'react-redux';

import { ReactNotifications } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import 'semantic-ui-css/semantic.min.css';
import './assets';
import { store } from './components/redux';

import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';

const container = document.getElementById('root');

const root = ReactDOM.createRoot(container);
root.render(
  <ReduxProvider store={store}>
    <ReactNotifications />
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ReduxProvider>,
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
// serviceWorkerRegistration.unregister();
serviceWorkerRegistration.register(swRegister);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(null);
