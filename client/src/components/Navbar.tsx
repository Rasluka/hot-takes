import type { JSX } from "react";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import { useUser } from "../contexts/UserContext";
import { useTheme } from "../contexts/ThemeContext";
import { Sun, Moon } from "lucide-react";

export function MainNavBar(): JSX.Element {
  const { isAuthenticated, logout, user } = useUser();
  const { currentTheme, toggleTheme } = useTheme();

  const onToggleTheme = () => {
    toggleTheme();
  };

  return (
    <div className="navbar bg-base-100 shadow-sm">
      {/* Nav Start */}
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <Menu />
          </div>
          <ul
            tabIndex={-1}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            <li className="">
              <Link to="/new" className="nav-link">
                Feed
              </Link>
            </li>

            <li>
              <Link to="/takes" className="nav-link">
                My Takes
              </Link>
            </li>

            <li>
              <Link to="/explore" className="nav-link">
                Explore
              </Link>
            </li>

            <li>
              <Link to="/aboutus" className="nav-link">
                About Us
              </Link>
            </li>
          </ul>
        </div>
        <Link to="/" className="nav-link font-bold text-xl">
          Hot Takes
        </Link>
      </div>

      {/* Nav Center */}
      <div className="navbar-center hidden lg:flex">
        <ul className="flex gap-x-10 font-medium">
          <li className="">
            <Link to="/" className="nav-link">
              Home
            </Link>
          </li>

          <li className="">
            <Link to="/new" className="nav-link">
              Feed
            </Link>
          </li>

          <li>
            <Link to="/takes" className="nav-link">
              My Takes
            </Link>
          </li>

          <li>
            <Link to="/explore" className="nav-link">
              Explore
            </Link>
          </li>

          <li>
            <Link to="/aboutus" className="nav-link">
              About Us
            </Link>
          </li>
        </ul>
      </div>

      {/* Nav End */}
      <div className="navbar-end">
        <div className="flex me-8">
          {currentTheme === "dark" ? (
            <div
              className="tooltip tooltip-bottom tooltip-primary"
              data-tip="Switch to light mode "
            >
              <Sun
                onClick={onToggleTheme}
                cursor="pointer"
                className="hover:scale-110 transition-transform duration-300 ease-in-out"
              />
            </div>
          ) : (
            <div
              className="tooltip tooltip-bottom"
              data-tip="Switch to dark mode "
            >
              <Moon
                onClick={onToggleTheme}
                cursor="pointer"
                className="hover:scale-110 transition-transform duration-300 ease-in-out"
              />
            </div>
          )}
        </div>

        {isAuthenticated ? (
          <div className="dropdown dropdown-end me-8">
            <div tabIndex={0} role="button" className="btn btn-circle avatar">
              <div className="w-10 rounded-full bg-black flex justify-center items-center text-xl text-white font-bold">
                {user?.nickname.charAt(0).toUpperCase()}
              </div>
            </div>
            <ul
              tabIndex={-1}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              <li>
                <a className="justify-between">
                  Profile
                  <span className="badge badge-warning">Not Yet</span>
                </a>
              </li>
              <li>
                <a>
                  Settings
                  <span className="badge badge-warning">Not Yet</span>
                </a>
              </li>
              <li>
                <button onClick={() => void logout()}>Logout</button>
              </li>
            </ul>
          </div>
        ) : (
          <Link to="/signin" className="nav-link font-bold">
            Sign In
          </Link>
        )}
        {/* User Dropdown */}
      </div>
    </div>
  );
}
