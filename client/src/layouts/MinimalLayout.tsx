import type { JSX } from "react";
import { MinimalNavbar } from "../components/MinimalNavbar";
import { Outlet } from "react-router-dom";

export function MinimalLayout(): JSX.Element {
  return (
    <>
      <MinimalNavbar />
      <main className="">
        <Outlet />
      </main>
    </>
  );
}
