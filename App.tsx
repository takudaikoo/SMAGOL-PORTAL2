import React, { useState, useEffect } from 'react';
import PageTemplate from './PageTemplate';
import AdminDashboard from './components/AdminDashboard';
import { AppDataProvider } from './contexts/AppDataContext';

const App = () => {
  // Simple query param check for admin routing
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get('admin') === 'true') {
      setIsAdmin(true);
    }
  }, []);

  return (
    <AppDataProvider>
      {isAdmin ? <AdminDashboard /> : <PageTemplate />}
    </AppDataProvider>
  );
};

export default App;