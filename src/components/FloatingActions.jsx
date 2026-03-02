import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowUp } from "react-icons/fi";
import "./floatingActions.scss";

export default function FloatingActions({
  contactTo = "/contact",
  contactLabel = "Me contacter",
  showTopAfter = 400,
}) {
  const bubbleRef = useRef(null);
  const rafRef = useRef(0);

  const [showTop, setShowTop] = useState(false);

  // Magnet effect (desktop only + performant)
  useEffect(() => {
    const canMagnet =
      typeof window !== "undefined" &&
      window.matchMedia?.("(pointer: fine)").matches &&
      !window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (!canMagnet) return;

    const el = bubbleRef.current;
    if (!el) return;

    const onMove = (e) => {
      if (rafRef.current) return;

      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = 0;

        const { innerWidth, innerHeight } = window;

        const dx = e.clientX - innerWidth;
        const dy = e.clientY - innerHeight;

        const x = Math.max(-40, Math.min(0, dx / 12));
        const y = Math.max(-40, Math.min(0, dy / 12));

        el.style.transform = `translate(${x}px, ${y}px)`;
      });
    };

    window.addEventListener("mousemove", onMove);

    return () => {
      window.removeEventListener("mousemove", onMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Scroll → show/hide top button (throttled)
  useEffect(() => {
    let raf = 0;

    const onScroll = () => {
      if (raf) return;

      raf = requestAnimationFrame(() => {
        raf = 0;
        setShowTop(window.scrollY > showTopAfter);
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [showTopAfter]);

  const scrollToTop = () =>
    window.scrollTo({ top: 0, behavior: "smooth" });

  const ariaContact = useMemo(
    () => contactLabel || "Me contacter",
    [contactLabel]
  );

  return (
    <div
      className="floating-actions"
      role="region"
      aria-label="Actions rapides"
    >
      {/* Scroll to top */}
      <button
        type="button"
        className={`floating-actions__top ${showTop ? "is-visible" : ""}`}
        onClick={scrollToTop}
        aria-label="Retour en haut"
      >
        <FiArrowUp />
      </button>

      {/* Contact bubble */}
      <Link
        ref={bubbleRef}
        to={contactTo}
        className="floating-actions__bubble"
        aria-label={ariaContact}
      >
        <svg
          className="floating-actions__icon"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M20 2H4a2 2 0 0 0-2 2v16l4-3h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2Z" />
        </svg>

        <span className="floating-actions__label">
          {contactLabel}
        </span>
      </Link>
    </div>
  );
}