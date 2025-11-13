import { MinimalNavbar } from "../components/MinimalNavbar";
import { Outlet } from "react-router-dom";

export function MinimalLayout() {
  return (
    <>
      <MinimalNavbar />
      <main className="">
        <Outlet />
      </main>
    </>
  );
}
