import type { JSX } from "react";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { Sun, Moon } from "lucide-react";

export function MinimalNavbar(): JSX.Element {
  const { currentTheme, toggleTheme } = useTheme();

  const onToggleTheme = () => {
    toggleTheme();
  };

  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost">
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
      </div>

      <div className="navbar-center">
        <Link to="/" className="nav-link font-bold text-xl">
          Hot Takes
        </Link>
      </div>

      <div className="navbar-end">
        <div className="flex me-24">
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
      </div>
    </div>
  );
}
