import { Link } from "react-router-dom";
import { useContent } from "../content/useContent.js";

import "./about.scss";
import SEO from "../seo/SEO.jsx";
import Signature from "../components/Signature.jsx";

import Portrait from "../assets/portraitmp.jpg";

export default function About() {
  const { t, list, isLoading, error } = useContent();

  // Adaptation par profil gérée par useContent() (getByProfile + fallback visitor)
  const heroTitle = t("about.hero.title", "À propos");
  const heroLead = t("about.hero.lead", "Enchantée, moi c’est Manon.");

  const keyTitle = t("about.keyPoints.title", "En bref");
  const keyItems = list("about.keyPoints.items");

  const presTitle = t("about.presentation.title", "Enchantée, moi c’est Manon");
  const presParagraphs = list("about.presentation.paragraphs");

  const calloutText = t("about.callout.text", "");

  const ctaTitle = t("about.cta.title", "Envie d’échanger ?");
  const ctaText = t(
    "about.cta.text",
    "Je suis disponible pour répondre à vos questions.",
  );

  const ctaHref = t("about.cta.button.href", "/contact");
  const ctaLabel = t("about.cta.button.label", "Me contacter");

  if (isLoading) {
    return (
      <div className="about">
        <div className="about__content">
          <div className="about__state reveal">
            <p>Chargement…</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="about">
        <div className="about__content">
          <div className="about__state reveal">
            <p>Erreur : {String(error.message || error)}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        path="about"
        fallbackTitle="Manon Pontasse - À propos"
        fallbackDesc="Découvrez le parcours de Manon Pontasse, éducatrice spécialisée en libéral."
      />

      <div className="about">
        <div className="about__content">
          {/* HERO */}
          <header className="about__hero">
            <h1
              className="about__title reveal reveal--up"
              style={{ "--delay": "60ms" }}
            >
              {heroTitle}
            </h1>

            {heroLead && (
              <p
                className="about__lead reveal reveal--up"
                style={{ "--delay": "120ms" }}
              >
                {heroLead}
              </p>
            )}
          </header>

          {/* Chips */}
          {keyItems.length > 0 && (
            <section
              className="about__section about__section--chips reveal"
              style={{ "--delay": "180ms" }}
              aria-label={keyTitle}
            >
              <h2 className="about__eyebrow">{keyTitle}</h2>
              <ul className="about__chips" role="list">
                {keyItems.map((it, idx) => (
                  <li key={idx} className="about__chip">
                    {it}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Présentation */}
          <section
            className="about__section"
            aria-labelledby="about-presentation"
          >
            <article
              className="about__card about__card--featured reveal"
              style={{ "--delay": "0ms" }}
            >
              <h2
                className="about__h2 about__h2--center"
                id="about-presentation"
              >
                {presTitle}
              </h2>
              <div className="about__presentation">
              <div
                className="about__avatarWrap reveal reveal--up"
                aria-hidden="true"
                style={{ "--delay": "0ms" }}
              >
                <img className="about__avatar" src={Portrait} alt="" />
              </div>

              {presParagraphs.length > 0 && (
                <div className="about__paragraphs">
                  {presParagraphs.map((p, idx) => (
                    <p key={idx} className="about__p about__p--body">
                      {p}
                    </p>
                  ))}
                </div>
              )}

              </div>

              {calloutText && (
                <div className="about__callout" role="note">
                  <p className="about__calloutText">{calloutText}</p>
                </div>
              )}
            </article>
          </section>

          {/* CTA */}
          <section className="about__cta" aria-label="Contact">
            <div
              className="about__ctaCard reveal"
              style={{ "--delay": "120ms" }}
            >
              <div className="about__ctaText">
                <h2 className="about__h2">{ctaTitle}</h2>
                {ctaText && <p className="about__p">{ctaText}</p>}
              </div>

              {ctaHref && (
                <Link className="about__btn" to={ctaHref}>
                  {ctaLabel}
                </Link>
              )}
            </div>
          </section>

          <Signature type="emotional" variant="subtle" />
        </div>
      </div>
    </>
  );
}
