import type { JSX, ReactElement, ReactNode } from "react";
import Home from "../pages/Home";
import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";
import { MainLayout } from "../layouts/MainLayout";
import { MinimalLayout } from "../layouts/MinimalLayout";

export interface AppRoute {
  path: string;
  element?: JSX.Element;
  layout?: ReactElement | ReactNode;
  protected?: boolean;
  children?: AppRoute[];
}

export const routes: AppRoute[] = [
  {
    path: "/",
    layout: <MainLayout />,
    children: [{ path: "/", element: <Home /> }],
  },
  {
    path: "/",
    layout: <MinimalLayout />,
    children: [
      { path: "/signin", element: <SignIn /> },
      { path: "/signup", element: <SignUp /> },
    ],
  },
  //Standalone routes
];
