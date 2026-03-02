import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";

import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import FloatingActions from "../components/FloatingActions.jsx";
import LocalBusinessJsonLd from "../seo/LocalBusinessJsonLd.jsx";

import { useRevealOnScroll } from "../hook/useRevealOnScroll.js";

export default function Layout() {
  const { pathname } = useLocation();

  // ✅ Reveal unique
  useRevealOnScroll({
    selector: ".reveal",
    rootMargin: "0px 0px -12% 0px",
    threshold: 0.08,
    once: true,
  });

  // ✅ Scroll to top à chaque navigation
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  return (
    <>
      <a href="#main-content" className="skip-link">
        Aller au contenu
      </a>

      <LocalBusinessJsonLd />
      <Header />

      <main id="main-content">
        <Outlet />
      </main>

      <Footer />
      <FloatingActions contactTo="/contact" contactLabel="Me contacter" />
    </>
  );
}
