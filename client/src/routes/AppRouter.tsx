import { Routes, Route } from "react-router-dom";
import type { ReactElement } from "react";
// import type { AppRoute } from ".";
import { routes } from ".";

export default function AppRouter(): ReactElement {
  return (
    <Routes>
      {routes.map((aRoute, idx) => {
        if (aRoute.layout) {
          return (
            <Route key={idx} path={aRoute.path} element={aRoute.layout}>
              {aRoute.children?.map((childRoute, childIdx) => (
                <Route
                  key={childIdx}
                  path={childRoute.path}
                  element={childRoute.element}
                />
              ))}
            </Route>
          );
        }

        return <Route key={idx} path={aRoute.path} element={aRoute.element} />;
      })}
    </Routes>
  );
}
