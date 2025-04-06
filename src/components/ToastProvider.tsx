'use client';

import { Toaster } from 'react-hot-toast';

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: '#363636',
          color: '#fff',
        },
        success: {
          duration: 3000,
          style: {
            background: 'rgba(34, 197, 94, 0.9)',
            color: '#fff',
          },
        },
        error: {
          duration: 3000,
          style: {
            background: 'rgba(239, 68, 68, 0.9)',
            color: '#fff',
          },
        },
      }}
    />
  );
} 