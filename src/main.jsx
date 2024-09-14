import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { router } from './Routes/Routes';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserProvider } from '../src/Provider/UserProvider';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={ queryClient }>
      <UserProvider>
        <RouterProvider router={ router } />
      </UserProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)