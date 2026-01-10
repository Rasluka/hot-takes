import type { ReactElement } from 'react';
import { Toaster } from 'react-hot-toast';

import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { UserProvider, useUser } from '@/contexts/UserContext';
import AppRouter from '@/routes/AppRouter';

function AppContent(): ReactElement {
  const { isLoading } = useUser();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <AppRouter />
      <Toaster position="top-center" />
    </>
  );
}

function App(): ReactElement {
  return (
    <ThemeProvider>
      <UserProvider>
        <AppContent />
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
