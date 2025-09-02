import { Link } from "react-router-dom";

export function MainNavBar() {
  return (
    <ul>
      <li>
        <Link to="/">Home</Link>
      </li>
      <li>
        <Link to="/signin">Sign In</Link>
      </li>
    </ul>
  );
}
