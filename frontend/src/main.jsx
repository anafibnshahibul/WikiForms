import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// Bringing in our translation setup before the app loads
import './i18n'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);