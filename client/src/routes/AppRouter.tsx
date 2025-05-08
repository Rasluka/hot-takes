import { Routes, Route } from "react-router-dom";
import type { ReactElement } from "react";
import type { AppRoute } from ".";
import { routes } from ".";

export default function AppRouter(): ReactElement {
  return (
    <Routes>
      {routes.map((aRoute: AppRoute, idx: number) => (
        <Route key={idx} path={aRoute.path} element={aRoute.element} />
      ))}
    </Routes>
  );
}
