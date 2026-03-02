import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { useContent } from "../content/useContent.js";
import "./informations.scss";
import SEO from "../seo/SEO.jsx";

function scrollToHash(hash) {
  if (!hash) return;
  const id = hash.replace("#", "");
  if (!id) return;

  // attend le rendu + rAF
  setTimeout(() => {
    window.requestAnimationFrame(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, 0);
}

export default function Informations() {
  const { node, list, isLoading, error } = useContent();
  const location = useLocation();

  // Mobile TOC (repliable)
  const [tocOpen, setTocOpen] = useState(false);

  const usefulLinks = node("informations.usefulLinks") ?? {};
  const linkSections = useMemo(
    () => (Array.isArray(usefulLinks?.sections) ? usefulLinks.sections : []),
    [usefulLinks?.sections],
  );

  const intro = node("informations.intro") ?? {};
  const deficiency = node("informations.deficiency") ?? {};
  const associated = node("informations.associatedDisorders") ?? {};
  const faq = node("informations.faq") ?? {};

  const deficiencyParagraphs = useMemo(
    () => (Array.isArray(deficiency?.paragraphs) ? deficiency.paragraphs : []),
    [deficiency?.paragraphs],
  );

  const associatedItems = useMemo(
    () => (Array.isArray(associated?.items) ? associated.items : []),
    [associated?.items],
  );

  const faqItems = useMemo(
    () => (Array.isArray(faq?.items) ? faq.items : []),
    [faq?.items],
  );

  // TOC
  const toc = useMemo(
    () => [
      {
        id: "deficience-intellectuelle",
        label: deficiency?.title ?? "Déficience intellectuelle",
      },
      {
        id: "troubles-associes",
        label: associated?.title ?? "Troubles associés",
      },
      { id: "faq", label: faq?.title ?? "FAQ" },
      { id: "ressources", label: usefulLinks?.title ?? "Ressources" },
    ],
    [usefulLinks?.title, deficiency?.title, associated?.title, faq?.title],
  );

  // Scroll quand on arrive avec un hash (ou qu'il change)
  useEffect(() => {
    scrollToHash(location.hash);
  }, [location.hash, location.key]);

  // Si on clique un lien (hash) : on ferme le sommaire mobile
  useEffect(() => {
    if (location.hash) setTocOpen(false);
  }, [location.hash]);

  const onTocLinkClick = () => setTocOpen(false);

  if (isLoading) {
    return (
      <div className="info">
        <div className="info__container">
          <div className="info__state reveal">
            <p>Chargement…</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="info">
        <div className="info__container">
          <div className="info__state reveal">
            <p>Erreur : {String(error.message || error)}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        path="informations"
        fallbackTitle="Informations – Déficience intellectuelle / Troubles associés"
        fallbackDesc="Comprendre la déficience intellectuelle et les troubles associés."
      />

      <div className="info">
        <div className="info__container">
          {/* HERO */}
          <header className="info__hero">
            <h1
              className="info__title reveal reveal--up"
              style={{ "--delay": "0ms" }}
            >
              {intro?.title}
            </h1>

            {intro?.subtitle && (
              <p
                className="info__kicker reveal reveal--up"
                style={{ "--delay": "60ms" }}
              >
                {intro.subtitle}
              </p>
            )}

            {intro?.lead && (
              <p
                className="info__lead reveal reveal--up"
                style={{ "--delay": "120ms" }}
              >
                {intro.lead}
              </p>
            )}
          </header>

          {/* TOC mobile (collapsible) */}
          <section
            className="info__tocMobile reveal"
            style={{ "--delay": "0ms" }}
            aria-label="Sommaire"
          >
            <details
              className="info__tocDetails"
              open={tocOpen}
              onToggle={(e) => setTocOpen(e.currentTarget.open)}
            >
              <summary className="info__tocSummary">
                Sommaire
                <span className="info__tocChevron" aria-hidden="true">
                  ▾
                </span>
              </summary>

              <nav className="info__tocNav">
                <ul className="info__tocList">
                  {toc.map((item) => (
                    <li key={item.id}>
                      <a
                        className="info__tocLink"
                        href={`#${item.id}`}
                        onClick={onTocLinkClick}
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </details>
          </section>

          <div className="info__layout">
            {/* TOC desktop (sticky) */}
            <aside
              className="info__toc reveal"
              style={{ "--delay": "0ms" }}
              aria-label="Sommaire"
            >
              <div className="info__tocCard">
                <p className="info__tocTitle">Sommaire</p>
                <nav>
                  <ul className="info__tocList">
                    {toc.map((item) => (
                      <li key={item.id}>
                        <a className="info__tocLink" href={`#${item.id}`}>
                          {item.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </aside>

            {/* Contenu */}
            <div className="info__content">
              {/* Section 1 */}
              <section
                id="deficience-intellectuelle"
                className="info__section reveal"
                style={{ "--delay": "0ms" }}
              >
                <h2 className="info__h2">{deficiency?.title}</h2>
                <div className="info__card">
                  {deficiencyParagraphs.map((p, idx) => (
                    <p key={idx} className="info__p">
                      {p}
                    </p>
                  ))}
                </div>
              </section>

              {/* Section 2 */}
              <section
                id="troubles-associes"
                className="info__section reveal"
                style={{ "--delay": "0ms" }}
              >
                <h2 className="info__h2">{associated?.title}</h2>
                {associated?.intro && (
                  <p className="info__p">{associated.intro}</p>
                )}

                <div className="info__grid">
                  {associatedItems.map((it, idx) => (
                    <article key={idx} className="info__miniCard">
                      <h3 className="info__h3">{it?.title}</h3>
                      <p className="info__p info__p--muted">{it?.text}</p>
                    </article>
                  ))}
                </div>
              </section>

              {/* FAQ */}
              <section
                id="faq"
                className="info__section reveal"
                style={{ "--delay": "0ms" }}
              >
                <h2 className="info__h2">{faq?.title}</h2>
                {faq?.lead && <p className="info__p">{faq.lead}</p>}

                <div className="info__stack">
                  {faqItems.map((it, idx) => (
                    <details key={idx} className="info__faq">
                      <summary className="info__faqQ">{it?.q}</summary>
                      <div className="info__faqA">
                        <p className="info__p">{it?.a}</p>
                      </div>
                    </details>
                  ))}
                </div>
              </section>
              {/* Ressources */}
              <section
                id="ressources"
                className="info__section reveal"
                style={{ "--delay": "0ms" }}
              >
                <h2 className="info__h2">
                  {usefulLinks?.title ?? "Ressources"}
                </h2>
                {usefulLinks?.subtitle && (
                  <p className="info__p">{usefulLinks.subtitle}</p>
                )}

                <div className="info__linksStack">
                  {linkSections.map((sec, sIdx) => (
                    <div key={sIdx} className="info__linksGroup">
                      <h3 className="info__h3">{sec?.title}</h3>

                      <div className="info__linksGrid" role="list">
                        {(sec?.items ?? []).map((it, idx) => (
                          <a
                            key={idx}
                            className="info__linkCard"
                            href={it?.href}
                            target="_blank"
                            rel="noreferrer noopener"
                            role="listitem"
                          >
                            <span className="info__linkLabel">{it?.label}</span>
                            {it?.desc && (
                              <span className="info__linkDesc">{it.desc}</span>
                            )}
                            {it?.source && (
                              <span className="info__linkSource">
                                {it.source}
                              </span>
                            )}
                            <span className="info__linkMeta" aria-hidden="true">
                              → Voir la ressource
                            </span>
                          </a>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
