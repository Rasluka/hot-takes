import AppRouter from "./routes/AppRouter";
import type { ReactElement } from "react";
import "./App.css";

function App(): ReactElement {
  return (
    <>
      <AppRouter />
    </>
  );
}

export default App;
