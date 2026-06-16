import React from 'react';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';

export default function App() {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}
