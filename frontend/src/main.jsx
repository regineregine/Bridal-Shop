import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { CartProvider } from './user/context/CartContext';
import { AuthProvider } from './user/context/AuthContext';
import { Toaster } from 'react-hot-toast';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        <App />
        <Toaster
          position="top-center"
          containerStyle={{
            top: 90,
          }}
          toastOptions={{
            duration: 3000,
            style: {
              background: '#fff',
              color: '#334155',
              padding: '16px',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(165, 148, 139, 0.15)',
              border: '1px solid #f3f4f6',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#ec4899',
                secondary: '#fff',
              },
              style: {
                background: '#fdf2f8',
                color: '#831843',
                border: '1px solid #f9a8d4',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
              style: {
                background: '#fef2f2',
                color: '#991b1b',
                border: '1px solid #fca5a5',
              },
            },
            loading: {
              iconTheme: {
                primary: '#ec4899',
                secondary: '#fff',
              },
            },
          }}
        />
      </CartProvider>
    </AuthProvider>
  </StrictMode>
);
