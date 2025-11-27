import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { BoardsProvider } from './context/BoardsContext.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BoardsProvider>
      <App />
    </BoardsProvider>
  </React.StrictMode>
);
