import AppRouter from "./routes/AppRouter";
import type { ReactElement } from "react";
import { Toaster } from "react-hot-toast";
import { UserProvider } from "./contexts/UserContext";
import "./App.css";

function App(): ReactElement {
  return (
    <UserProvider>
      <AppRouter />
      <Toaster position="top-right" />
    </UserProvider>
  );
}

export default App;
