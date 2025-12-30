import AppRouter from "./routes/AppRouter";
import type { ReactElement } from "react";
import { Toaster } from "react-hot-toast";
import { UserProvider, useUser } from "./contexts/UserContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LoadingSpinner } from "./components/LoadingSpinner";

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
