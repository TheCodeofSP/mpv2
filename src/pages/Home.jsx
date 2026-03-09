import { useId, useMemo } from "react";
import { Link } from "react-router-dom";
import { FiCheckCircle } from "react-icons/fi";

import { useContent } from "../content/useContent.js";
import { useProfile } from "../context/profile/ProfileContext.jsx";

import "./home.scss";
import Portrait from "../assets/portraitHome.webp";
import SEO from "../seo/SEO.jsx";
import Signature from "../components/Signature.jsx";

export default function Home() {
  const uid = useId();
  const { profile, setProfile } = useProfile();
  const { t, node, list, isLoading, error } = useContent();

  const options = useMemo(() => {
    const raw = list("home.profileSelector.options");
    return raw.filter((opt) => opt && opt.key);
  }, [list]);

  const heroTitle = t("home.intro.title", "");
  const heroSubtitle = t("home.intro.subtitle", "");

  const intro = node("home.introsByProfile") ?? {};
  const highlights = list("home.content.highlights");
  const paragraphs = list("home.content.paragraphs");

  const ctaPrimary = node("home.cta.primary") ?? null;
  const ctaSecondary = node("home.cta.secondary") ?? null;

  const primaryLabel = ctaPrimary?.label ?? "Me contacter";
  const primaryHref = ctaPrimary?.href ?? "/contact";

  const secondaryLabel = ctaSecondary?.label ?? "Découvrir l’approche";
  const secondaryHref = ctaSecondary?.href ?? "/process";

  const profileLabel = t("home.profileSelector.label", "Vous êtes :");

  const activeIndex = Math.max(
    0,
    options.findIndex((o) => o.key === profile),
  );

  const tabPanelId = `home-profile-panel-${uid}`;
  const tabId = (key) => `home-profile-tab-${uid}-${key}`;

  if (isLoading) {
    return (
      <div className="home">
        <div className="home__content">
          <div className="home__state reveal">
            <p>Chargement…</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home">
        <div className="home__content">
          <div className="home__state reveal">
            <p>Erreur : {String(error.message || error)}</p>
          </div>
        </div>
      </div>
    );
  }

  const onTabsKeyDown = (e) => {
    if (!options.length) return;

    const keys = ["ArrowLeft", "ArrowRight", "Home", "End"];
    if (!keys.includes(e.key)) return;

    e.preventDefault();

    let nextIndex = activeIndex;

    if (e.key === "ArrowLeft") nextIndex = activeIndex - 1;
    if (e.key === "ArrowRight") nextIndex = activeIndex + 1;
    if (e.key === "Home") nextIndex = 0;
    if (e.key === "End") nextIndex = options.length - 1;

    if (nextIndex < 0) nextIndex = options.length - 1;
    if (nextIndex >= options.length) nextIndex = 0;

    const next = options[nextIndex];
    if (!next) return;

    setProfile(next.key);

    requestAnimationFrame(() => {
      const el = document.getElementById(tabId(next.key));
      el?.focus();
    });
  };

  return (
    <>
      <SEO
        path="home"
        fallbackTitle="Manon Pontasse – Éducatrice spécialisée"
        fallbackDesc="Accompagnement éducatif spécialisé pour personnes avec déficience intellectuelle. Évaluation, autonomie, habiletés sociales, régulation, soutien aux familles. Interventions personnalisées."
      />

      <div className="home">
        <h1 className="home__h1 reveal reveal--up" style={{ "--delay": "0ms" }}>
          {heroTitle}
        </h1>

        <div className="home__content">
          {/* Intro */}
          <section className="home__intro">
            {/* Portrait : tu as déjà une anim CSS portraitIn dans home.scss.
                On garde reveal sur le wrapper (colonne), pas sur l'image elle-même. */}
            <div
              className="home__introImg reveal reveal--up"
              style={{ "--delay": "80ms" }}
            >
              <img
                src={Portrait}
                alt="Portrait de Manon Pontasse"
                className="home__portrait"
                loading="eager"
              />
            </div>

            <div className="home__introText">
              {heroSubtitle && (
                <p
                  className="home__subtitle reveal reveal--up"
                  style={{ "--delay": "120ms" }}
                >
                  {heroSubtitle}
                </p>
              )}

              <div
                className="home__profile reveal"
                style={{ "--delay": "160ms" }}
              >
                <p className="home__profileLabel">{profileLabel}</p>

                <div
                  className="home__tabs"
                  role="tablist"
                  aria-label={profileLabel}
                  onKeyDown={onTabsKeyDown}
                >
                  {options.map((opt) => {
                    const isActive = profile === opt.key;
                    return (
                      <button
                        key={opt.key}
                        id={tabId(opt.key)}
                        type="button"
                        role="tab"
                        className={`home__tab ${isActive ? "is-active" : ""}`}
                        aria-selected={isActive}
                        aria-controls={tabPanelId}
                        tabIndex={isActive ? 0 : -1}
                        onClick={() => setProfile(opt.key)}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>

                {/* Panel : reveal--swap (plus premium au changement de profil) */}
              </div>
              <div
                id={tabPanelId}
                className="home__panel reveal reveal--swap is-visible"
                role="tabpanel"
                tabIndex={0}
                aria-labelledby={
                  options[activeIndex]?.key
                    ? tabId(options[activeIndex].key)
                    : undefined
                }
              >
                {intro?.title && (
                  <h2 className="home__panelTitle">{intro.title}</h2>
                )}
                {intro?.lead && <p className="home__panelLead">{intro.lead}</p>}
                {intro?.text && <p className="home__panelText">{intro.text}</p>}
              </div>
            </div>
          </section>

          {/* Blocks */}
          <section className="home__blocks">
            <div className="home__card reveal" style={{ "--delay": "0ms" }}>
              <h2 className="home__h2">
                {t("home.content.highlightsTitle", "Ce que je propose")}
              </h2>

              {highlights.length > 0 && (
                <div className="home__highlightsGrid" role="list">
                  {highlights.map((h, idx) => (
                    <article
                      key={idx}
                      className="home__highlightCard reveal"
                      role="listitem"
                      style={{ "--delay": `${(idx + 1) * 70}ms` }}
                    >
                      <div className="home__highlightIcon" aria-hidden="true">
                        <FiCheckCircle />
                      </div>
                      <p className="home__highlightText">{h}</p>
                    </article>
                  ))}
                </div>
              )}
            </div>

            <div
              className="home__card home__card--accent reveal"
              style={{ "--delay": "90ms" }}
            >
              <h2 className="home__h2">{secondaryLabel}</h2>

              {paragraphs.length > 0 && (
                <div className="home__paragraphs">
                  {paragraphs.map((p, idx) => (
                    <p key={idx}>{p}</p>
                  ))}
                </div>
              )}

              <div className="home__ctaRow">
                <Link className="home__btn home__btn--primary" to={primaryHref}>
                  {primaryLabel}
                </Link>

                <Link className="home__btn home__btn--ghost" to={secondaryHref}>
                  {secondaryLabel}
                </Link>
              </div>
            </div>
          </section>
        </div>
        <Signature type="emotional" variant="subtle" />
      </div>
    </>
  );
}
