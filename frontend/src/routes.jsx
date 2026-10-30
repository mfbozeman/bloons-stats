import RootErrorBoundary from "./ErrorBoundary.jsx";
import AllTowers from "./AllTowers.jsx";
import App from "./App.jsx";
import Coverage from "./Coverage.jsx";
import Home from "./Home.jsx";
import Tower from "./Tower.jsx";

const indexLoader = async () => {};

const routes = [
  {
    path: "/",
    element: <App />,
    ErrorBoundary: RootErrorBoundary,
    children: [
      { index: true, element: <Home />, loader: indexLoader },
      { path: "/tower/:towerId", element: <Tower /> },
      { path: "/tower", element: <AllTowers /> },
      { path: "/coverage", element: <Coverage /> },
    ],
  },
];

export default routes;
