import { Link, Outlet } from "react-router";
import styles from "./styles/App.module.css";
import logo from "./assets/favicon.png";

function App() {
  return (
    <>
      <nav>
        <Link to="/">
          BTD6 Stats <img className="logo" src={logo} alt="" />
        </Link>
        <Link to="/tower">Towers</Link>
        {/* <Link to="/">Coverage</Link> */}
        {/* <Link to="/">Compare</Link> */}
      </nav>
      <main>
        <Outlet />
      </main>
      <footer>
        <p>
          all images, names, etc. copyright of Ninja Kiwi. data sourced from
          Blooncyclopedia.
        </p>
      </footer>
    </>
  );
}

export default App;
