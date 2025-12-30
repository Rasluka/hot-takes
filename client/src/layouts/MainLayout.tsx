import type { JSX } from "react";
import { MainNavBar } from "../components/Navbar";
// import { MainFooter } from "../components/Footer";
import { Outlet } from "react-router-dom";

export function MainLayout(): JSX.Element {
  return (
    <div className="bg-base-200">
      <MainNavBar />
      <main className="grow container mx-auto p-4">
        <Outlet />
      </main>
      {/* <MainFooter /> */}
    </div>
  );
}
