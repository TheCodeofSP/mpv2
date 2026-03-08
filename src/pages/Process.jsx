import { useMemo, useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useContent } from "../content/useContent.js";
import "./process.scss";
import SEO from "../seo/SEO.jsx";
import ServiceArea from "../components/ServiceArea.jsx";
import Signature from "../components/Signature.jsx";

import {
  FiHeart,
  FiUsers,
  FiTarget,
  FiTrendingUp,
  FiSmile,
  FiShield,
  FiCompass,
  FiMessageCircle,
  FiRefreshCcw,
} from "react-icons/fi";

export default function Process() {
  const { node, list, t, isLoading, error, content } = useContent();

  const hasProcess = !!(content && content.process);
  const base = hasProcess ? "process" : "approach";

  const intro = node(`${base}.intro`) ?? {};
  const steps = list(`${base}.content.steps`);
  const principles = list(`${base}.content.principles`);

  // Flip state (mobile/touch + click desktop)
  const [flipped, setFlipped] = useState({}); // { [idx]: boolean }

  const toggleFlip = (idx) => {
    setFlipped((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const onCardKeyDown = (e, idx) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleFlip(idx);
    }
  };

  const principleIcons = useMemo(
    () => [
      FiHeart,
      FiUsers,
      FiTarget,
      FiTrendingUp,
      FiSmile,
      FiShield,
      FiCompass,
      FiMessageCircle,
    ],
    [],
  );

  const stepsTitle = t(`${base}.ui.stepsTitle`, "Étapes");
  const principlesTitle = t(`${base}.ui.principlesTitle`, "Principes");

  const ctaTitle = t(
    `${base}.ui.ctaTitle`,
    "Vous souhaitez échanger sur votre situation ?",
  );
  const ctaText = t(
    `${base}.ui.ctaText`,
    "Décrivez votre situation et vos objectifs : je vous réponds dès que possible.",
  );
  const ctaLabel = t(`${base}.ui.ctaLabel`, "Me contacter");

  const pricingsTitle = t(`${base}.ui.pricingsTitle`, "Tarifs");

  const pricingsText = t(
    `${base}.ui.pricingsText`,
    "Les tarifs sont modulables selon le type d’intervention défini ensemble. Des aides financières peuvent être possibles. N’hésitez pas à me contacter pour en discuter.",
  );

  // ======================================================
  // Option A (mobile) : micro “nudge” du hint quand in-view
  // ======================================================
  const itemRefs = useRef([]);

  useEffect(() => {
    const els = itemRefs.current.filter(Boolean);
    if (!els.length) return;

    // only mobile/coarse pointer
    const isTouch =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(pointer: coarse)").matches;

    if (!isTouch) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle("is-inview", entry.isIntersecting);
        });
      },
      { threshold: 0.25, rootMargin: "0px 0px -15% 0px" },
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [steps.length]);

  // ======================================================
  // Option B (wow) : auto-flip 1 seule fois sur la 1ère carte
  // ======================================================
  const firstItemRef = useRef(null);
  const autoFlippedOnce = useRef(false);
  const scrollFlag = useRef(false);

  useEffect(() => {
    const isTouch =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(pointer: coarse)").matches;

    if (!isTouch) return;
    if (autoFlippedOnce.current) return;
    if (!firstItemRef.current) return;

    let flipTimer = null;
    let unflipTimer = null;

    const clearTimers = () => {
      if (flipTimer) {
        clearTimeout(flipTimer);
        flipTimer = null;
      }
      if (unflipTimer) {
        clearTimeout(unflipTimer);
        unflipTimer = null;
      }
    };

    const onScroll = () => {
      scrollFlag.current = true;
      clearTimers();

      window.clearTimeout(onScroll._t);
      onScroll._t = window.setTimeout(() => {
        scrollFlag.current = false;
      }, 180);
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;

        const wellVisible =
          entry.isIntersecting && entry.intersectionRatio >= 0.72;

        if (!wellVisible || scrollFlag.current) {
          clearTimers();
          return;
        }

        if (!flipTimer) {
          flipTimer = window.setTimeout(() => {
            if (scrollFlag.current) return;

            autoFlippedOnce.current = true;

            // flip idx 0 only if user didn't already flip
            setFlipped((prev) => {
              if (prev[0] === true) return prev;
              return { ...prev, 0: true };
            });

            // auto return
            unflipTimer = window.setTimeout(() => {
              setFlipped((prev) => {
                if (prev[0] !== true) return prev;
                return { ...prev, 0: false };
              });
            }, 2600);
          }, 1200);
        }
      },
      { threshold: [0.5, 0.72, 0.9], rootMargin: "0px 0px -20% 0px" },
    );

    io.observe(firstItemRef.current);

    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimers();
      io.disconnect();
    };
  }, [steps.length]);

  if (isLoading) {
    return (
      <div className="process">
        <div className="process__content">
          <div className="process__state reveal">
            <p>Chargement…</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="process">
        <div className="process__content">
          <div className="process__state reveal">
            <p>Erreur : {String(error.message || error)}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        path="approach"
        fallbackTitle="Manon Pontasse - Approche"
        fallbackDesc="Découvrez les étapes et principes de l’accompagnement éducatif spécialisé."
      />

      <div className="process">
        <div className="process__content">
          {/* HERO */}
          <header
            className="process__hero reveal reveal--up"
            style={{ "--delay": "0ms" }}
          >
            <h1 className="process__title">{intro?.title ?? "Mon approche"}</h1>
            {intro?.subtitle && (
              <p className="process__kicker">{intro.subtitle}</p>
            )}
            {intro?.lead && <p className="process__lead">{intro.lead}</p>}
          </header>

          <div className="reveal" style={{ "--delay": "80ms" }}>
            <ServiceArea variant="highlight" />
          </div>

          {/* TIMELINE */}
          <section className="process__section">
            <h2 className="process__h2 reveal" style={{ "--delay": "0ms" }}>
              {stepsTitle}
            </h2>

            <div className="timeline" aria-label="Étapes de l’accompagnement">
              <div className="timeline__line" aria-hidden="true" />

              {steps.map((s, idx) => {
                const isRight = idx % 2 === 1;
                const num = String(idx + 1).padStart(2, "0");

                const title = s?.title ?? "";
                const frontSummary = s?.front?.summary ?? s?.text ?? "";
                const backText = s?.back?.text ?? s?.text ?? "";
                const backExamples = Array.isArray(s?.back?.examples)
                  ? s.back.examples
                  : [];

                const isFlipped = !!flipped[idx];

                return (
                  <article
                    key={idx}
                    ref={(el) => {
                      itemRefs.current[idx] = el;
                      if (idx === 0) firstItemRef.current = el;
                    }}
                    className={[
                      "timeline__item",
                      isRight ? "is-right" : "is-left",
                      isFlipped ? "is-flipped" : "",
                      "reveal",
                    ].join(" ")}
                    style={{ "--delay": `${idx * 90}ms` }}
                  >
                    <div className="timeline__dot" aria-hidden="true">
                      {num}
                    </div>

                    <button
                      type="button"
                      className="timeline__card"
                      onClick={() => toggleFlip(idx)}
                      onKeyDown={(e) => onCardKeyDown(e, idx)}
                      aria-pressed={isFlipped}
                      aria-label={
                        isFlipped
                          ? `Revenir au recto : ${title}`
                          : `Voir le verso : ${title}`
                      }
                    >
                      <div className="timeline__cardInner">
                        {/* RECTO */}
                        <div className="timeline__face timeline__face--front">
                          <div className="timeline__faceBody">
                            <p className="timeline__eyebrow">Étape {num}</p>
                            <h3 className="process__h3">{title}</h3>

                            {frontSummary && (
                              <p className="process__p process__p--muted">
                                {frontSummary}
                              </p>
                            )}
                          </div>

                          <span
                            className="timeline__tapHint"
                            aria-hidden="true"
                          >
                            Voir le détail →
                          </span>
                        </div>

                        {/* VERSO */}
                        <div className="timeline__face timeline__face--back">
                          <div className="timeline__faceBody">
                            {backText && (
                              <p className="process__p process__p--muted">
                                {backText}
                              </p>
                            )}
                          </div>

                          <span
                            className="timeline__tapHint"
                            aria-hidden="true"
                          >
                            ← Revenir
                          </span>
                        </div>
                      </div>

                      <span className="sr-only">
                        Appuyez sur Entrée ou Espace pour retourner la carte.
                      </span>
                    </button>
                  </article>
                );
              })}
            </div>
          </section>

          {/* PRINCIPES */}
          <section className="process__section">
            <h2 className="process__h2 reveal" style={{ "--delay": "0ms" }}>
              {principlesTitle}
            </h2>

            <div className="principles" role="list">
              {principles.map((text, idx) => {
                const Icon = principleIcons[idx % principleIcons.length];
                return (
                  <article
                    key={idx}
                    className="principleCard reveal"
                    role="listitem"
                    style={{ "--delay": `${idx * 70}ms` }}
                  >
                    <div className="principleCard__icon" aria-hidden="true">
                      <Icon />
                    </div>
                    <p className="principleCard__text">{text}</p>
                  </article>
                );
              })}
            </div>
          </section>

          <section
            className="process__footerCta reveal"
            style={{ "--delay": "120ms" }}
          >
            <div className="process__footerCard">
              <h2 className="process__h2">{pricingsTitle}</h2>
              <p className="process__p process__p--muted">
                {pricingsText}
              </p>{" "}
            </div>
          </section>

          {/* CTA bas de page */}
          <section
            className="process__footerCta reveal"
            style={{ "--delay": "120ms" }}
          >
            <div className="process__footerCard">
              <h2 className="process__h2">{ctaTitle}</h2>
              <p className="process__p process__p--muted">{ctaText}</p>
              <Link
                className="process__btn process__btn--primary"
                to="/contact"
              >
                {ctaLabel}
              </Link>
            </div>
          </section>
        </div>
        <Signature type="emotional" variant="subtle" />
      </div>
    </>
  );
}
