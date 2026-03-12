import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar.jsx";

import Logo from "../assets/logomp.webp";
import "./header.scss";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let raf = 0;
    let last = null;

    const compute = () => {
      const next = window.scrollY > 24;
      // évite les re-renders inutiles
      if (next !== last) {
        last = next;
        setIsScrolled(next);
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(compute);
    };

    compute();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <header className={`header ${isScrolled ? "is-scrolled" : ""}`}>
      <div className="header__inner">
        <Link to="/" className="header__brand" aria-label="Retour à l’accueil">
          <img className="header__logo" src={Logo} alt="Manon Pontasse" />
        </Link>

        <Navbar />
      </div>
    </header>
  );
}
