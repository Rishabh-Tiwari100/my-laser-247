import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import { App } from './App';
import { store } from '@/store';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { Toaster } from '@/components/common/Toaster';
// Poppins - import only needed weights
import '@fontsource/poppins/300.css'; // Light
import '@fontsource/poppins/400.css'; // Regular
import '@fontsource/poppins/500.css'; // Medium
import '@fontsource/poppins/600.css'; // Semi-bold
import '@fontsource/poppins/700.css'; // Bold

// Roboto - import only needed weights
import '@fontsource/roboto/400.css'; // Regular
import '@fontsource/roboto/500.css'; // Medium
import '@fontsource/roboto/700.css'; // Bold

// Inter - import only needed weights
import '@fontsource/inter/400.css'; // Regular
import '@fontsource/inter/500.css'; // Medium
import '@fontsource/inter/600.css'; // Semi-bold
import '@fontsource/inter/700.css'; // Bold
import '@/styles/globals.css';
import DisableDevtool from 'disable-devtool';
import { initializePwa } from '@/utils/pwa';

initializePwa();

// if (import.meta.env.VITE_APP_ENV === 'production') {
//   DisableDevtool();
// }

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <BrowserRouter>
          <App />
          <Toaster />
        </BrowserRouter>
      </Provider>
    </ErrorBoundary>
  </React.StrictMode>
);
