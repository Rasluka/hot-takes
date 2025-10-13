import AppRouter from "./routes/AppRouter";
import type { ReactElement } from "react";
import { Toaster } from "react-hot-toast";
import "./App.css";

function App(): ReactElement {
  return (
    <>
      <AppRouter />
      <Toaster position="top-right" />
    </>
  );
}

export default App;
