import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function useRevealOnScroll({
  selector = ".reveal",
  root = null,
  rootMargin = "0px 0px -10% 0px",
  threshold = 0.12,
  once = true,
} = {}) {
  const location = useLocation();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const prefersReducedMotion =
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

    const getAll = () => Array.from(document.querySelectorAll(selector));

    // Reduced motion => visible direct
    if (prefersReducedMotion) {
      getAll().forEach((el) => el.classList.add("is-visible"));
      return;
    }

    // Fallback si IO absent
    if (!("IntersectionObserver" in window)) {
      getAll().forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-visible");
          if (once) io.unobserve(entry.target);
        }
      },
      { root, rootMargin, threshold }
    );

    const observe = (el) => {
      if (!(el instanceof Element)) return;
      if (!el.matches(selector)) return;
      if (el.classList.contains("is-visible")) return;
      io.observe(el);
    };

    const scanAndObserve = () => {
      getAll().forEach(observe);
    };

    // 1) scan initial
    scanAndObserve();

    // 2) rescans après paint (important avec fetch/rendu conditionnel)
    const raf = requestAnimationFrame(() => {
      scanAndObserve();
      setTimeout(scanAndObserve, 80);
    });

    // 3) observe aussi les reveal ajoutés plus tard
    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        for (const node of m.addedNodes) {
          if (!(node instanceof Element)) continue;

          observe(node);

          const nested = node.querySelectorAll?.(selector);
          if (nested?.length) nested.forEach(observe);
        }
      }
    });

    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(raf);
      mo.disconnect();
      io.disconnect();
    };
  }, [location.pathname, selector, root, rootMargin, threshold, once]);
}