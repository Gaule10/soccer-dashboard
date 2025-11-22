import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// Note: We are using the Tailwind CDN in index.html, so no local CSS import is needed here.

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);