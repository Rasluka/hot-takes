import type { JSX } from "react";
import Home from "../pages/Home";
import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";
import { MainLayout } from "../layouts/MainLayout";
import { MinimalLayout } from "../layouts/MinimalLayout";
import { GuestRoute } from "./GuestRoute";

export interface AppRoute {
  path: string;
  element?: JSX.Element;
  layout?: React.ComponentType;
  protected?: boolean;
  children?: AppRoute[];
}

export const routes: AppRoute[] = [
  {
    path: "/",
    layout: MainLayout,
    children: [{ path: "/", element: <Home /> }],
  },
  {
    path: "/",
    layout: MinimalLayout,
    children: [
      {
        path: "/signin",
        element: (
          <GuestRoute>
            <SignIn />
          </GuestRoute>
        ),
      },
      {
        path: "/signup",
        element: (
          <GuestRoute>
            <SignUp />
          </GuestRoute>
        ),
      },
    ],
  },
  //Standalone routes
];
