import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import { useUser } from "../contexts/UserContext";

export function MainNavBar() {
  const { isAuthenticated, logout } = useUser();

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
        {isAuthenticated ? (
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img
                  alt="Tailwind CSS Navbar component"
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                />
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
                <button onClick={logout}>Logout</button>
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
