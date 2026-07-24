import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// Bootstrap JS (dropdowns, offcanvas, etc.) + our SCSS entry point
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './styles/main.scss';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);