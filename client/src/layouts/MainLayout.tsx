import { MainNavBar } from "../components/Navbar";
// import { MainFooter } from "../components/Footer";
import { Outlet } from "react-router-dom";

export function MainLayout() {
  return (
    <>
      <MainNavBar />
      <main className="flex-grow container mx-auto p-4">
        <Outlet />
      </main>
      {/* <MainFooter /> */}
    </>
  );
}
