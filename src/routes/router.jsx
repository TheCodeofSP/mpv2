import { createBrowserRouter } from "react-router-dom";
import Layout from "../layout/Layout.jsx";

import Home from "../pages/Home.jsx";
import About from "../pages/About.jsx";
import Process from "../pages/Process.jsx";
import Informations from "../pages/Informations.jsx";
import Contact from "../pages/Contact.jsx";
import Legal from "../pages/Legal.jsx";
import Privacy from "../pages/Privacy.jsx";
import NotFound from "../pages/NotFound.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },
      { path: "about", element: <About /> },
      { path: "process", element: <Process /> },
      { path: "informations", element: <Informations /> },
      { path: "contact", element: <Contact /> },
      { path: "legal", element: <Legal /> },
      { path: "privacy", element: <Privacy /> },
    ],
  },
  { path: "*", element: <NotFound /> },
]);
