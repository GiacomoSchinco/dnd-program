import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { CampaignProvider } from './context/CampaignContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CampaignProvider>
      <HashRouter>
        <App />
      </HashRouter>
    </CampaignProvider>
  </React.StrictMode>,
);
