import AppRouter from "./routes/AppRouter";
import type { ReactElement } from "react";
import { Toaster } from "react-hot-toast";
import { UserProvider, useUser } from "./contexts/UserContext";
import { LoadingSpinner } from "./components/LoadingSpinner";
import "./App.css";

function AppContent(): ReactElement {
  const { isLoading } = useUser();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <AppRouter />
      <Toaster position="top-right" />
    </>
  );
}

function App(): ReactElement {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}

export default App;
