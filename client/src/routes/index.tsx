import type { JSX } from "react";
import Home from "../pages/Home";
import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";

export interface AppRoute {
  path: string;
  element: JSX.Element;
  protected?: boolean;
}

export const routes: AppRoute[] = [
  { path: "/", element: <Home /> },
  { path: "/signin", element: <SignIn /> },
  { path: "/signup", element: <SignUp /> },
];
