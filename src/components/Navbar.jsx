import { Link, NavLink, useLocation } from "react-router-dom";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./navbar.scss";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);

  const location = useLocation();

  const dropdownRef = useRef(null);
  const dropBtnRef = useRef(null);
  const menuRef = useRef(null);

  const close = useCallback(() => {
    setOpen(false);
    setInfoOpen(false);
  }, []);

  const infoItems = useMemo(
    () => [
      {
        label: "Déficience intellectuelle",
        to: "/informations#deficience-intellectuelle",
      },
      { label: "Troubles associés", to: "/informations#troubles-associes" },
      { label: "FAQ", to: "/informations#faq" },
      { label: "Ressources", to: "/informations#ressources" },
    ],
    [],
  );

  // Ferme menus quand on change de route
  useEffect(() => {
    close();
  }, [location.pathname, location.hash, close]);

  // Scroll lock quand menu mobile ouvert (premium)
  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  // Ferme le menu si on passe en desktop (évite états bizarres)
  useEffect(() => {
    const onResize = () => {
      // 768px = bp mobile actuel
      if (window.innerWidth >= 768) {
        close();
      }
    };
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, [close]);

  // Escape uniquement quand un menu est ouvert (évite listener global permanent)
  useEffect(() => {
    if (!open && !infoOpen) return;

    const onKeyDown = (e) => {
      if (e.key !== "Escape") return;
      close();
      // Si le dropdown était ouvert, on rend le focus au bouton
      dropBtnRef.current?.focus();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, infoOpen, close]);

  // Fermer au clic extérieur (dropdown seulement) — pointerdown (unifié)
  useEffect(() => {
    if (!infoOpen) return;

    const onPointerDown = (e) => {
      const root = dropdownRef.current;
      if (!root) return;
      if (!root.contains(e.target)) setInfoOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [infoOpen]);

  // Fermer quand on quitte le dropdown au clavier (Tab)
  const onDropdownBlur = (e) => {
    const next = e.relatedTarget;
    const root = dropdownRef.current;
    if (!root) return;

    if (infoOpen && next && !root.contains(next)) {
      setInfoOpen(false);
    }
  };

  // Gestion clavier sur le bouton dropdown
  const openAndFocusFirst = () => {
    setInfoOpen(true);
    requestAnimationFrame(() => {
      const first = menuRef.current?.querySelector('[role="menuitem"]');
      first?.focus();
    });
  };

  const onDropBtnKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setInfoOpen((v) => !v);
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      openAndFocusFirst();
    }
  };

  // Gestion clavier dans le menu (flèches + Home/End)
  const focusMenuItemAt = (index) => {
    const items = menuRef.current?.querySelectorAll('[role="menuitem"]');
    if (!items || items.length === 0) return;
    const clamped = ((index % items.length) + items.length) % items.length;
    items[clamped].focus();
  };

  const onMenuKeyDown = (e) => {
    const items = menuRef.current?.querySelectorAll('[role="menuitem"]');
    if (!items || items.length === 0) return;

    const currentIndex = Array.from(items).indexOf(document.activeElement);

    if (e.key === "ArrowDown") {
      e.preventDefault();
      focusMenuItemAt(currentIndex + 1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      focusMenuItemAt(currentIndex - 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      focusMenuItemAt(0);
    } else if (e.key === "End") {
      e.preventDefault();
      focusMenuItemAt(items.length - 1);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setInfoOpen(false);
      dropBtnRef.current?.focus();
    }
  };

  return (
    <nav className="navbar" aria-label="Navigation principale">
      <button
        className={`navbar__burger ${open ? "is-open" : ""}`}
        type="button"
        aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
        aria-expanded={open}
        aria-controls="navbar-menu"
        onClick={() => setOpen((v) => !v)}
      >
        <span />
        <span />
        <span />
      </button>

      <div
        id="navbar-menu"
        className={`navbar__links ${open ? "is-open" : ""}`}
      >
        <Link to="/" onClick={close} className="navbar__link">
          Accueil
        </Link>

        {/* Dropdown */}
        <div
          ref={dropdownRef}
          className={`navbar__dropdown ${infoOpen ? "is-open" : ""}`}
          onBlur={onDropdownBlur}
        >
          <button
            ref={dropBtnRef}
            type="button"
            className={`navbar__dropbtn ${
              location.pathname === "/informations" ? "is-active" : ""
            }`}
            aria-haspopup="menu"
            aria-expanded={infoOpen}
            aria-controls="info-menu"
            onClick={() => setInfoOpen((v) => !v)}
            onKeyDown={onDropBtnKeyDown}
          >
            Informations{" "}
            <span className="navbar__chev" aria-hidden="true">
              ▾
            </span>
          </button>

          {/* Desktop dropdown menu (clavier + hover/focus via CSS) */}
          <div
            id="info-menu"
            ref={menuRef}
            className="navbar__menu"
            role="menu"
            aria-label="Informations"
            onKeyDown={onMenuKeyDown}
          >
            <NavLink
              to="/informations"
              onClick={close}
              className="navbar__menuItem"
              role="menuitem"
              tabIndex={infoOpen ? 0 : -1}
            >
              Vue d’ensemble
            </NavLink>

            {infoItems.map((it) => (
              <Link
                key={it.to}
                to={it.to}
                onClick={close}
                className="navbar__menuItem"
                role="menuitem"
                tabIndex={infoOpen ? 0 : -1}
              >
                {it.label}
              </Link>
            ))}
          </div>

          {/* Mobile sublinks */}
          <div className={`navbar__mobileSub ${infoOpen ? "is-open" : ""}`}>
            {infoItems.map((it) => (
              <Link
                key={it.to}
                to={it.to}
                onClick={close}
                className="navbar__sublink"
              >
                {it.label}
              </Link>
            ))}
          </div>
        </div>

        <NavLink to="/process" onClick={close} className="navbar__link">
          Mon approche
        </NavLink>
        <NavLink to="/about" onClick={close} className="navbar__link">
          Me connaître
        </NavLink>
        <NavLink to="/contact" onClick={close} className="navbar__link">
          Contact
        </NavLink>
      </div>

      {open && (
        <button
          className="navbar__overlay"
          onClick={close}
          aria-label="Fermer le menu"
          type="button"
        />
      )}
    </nav>
  );
}
