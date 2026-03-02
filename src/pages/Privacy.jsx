import { useContent } from "../content/useContent";
import "./privacy.scss";
import SEO from "../seo/SEO.jsx";

export default function Privacy() {
  const { t, list, isLoading, error } = useContent();

  const base = "legalPages.privacy";

  if (isLoading) {
    return (
      <div className="privacy">
        <div className="privacy__content">
          <div className="privacy__state reveal">
            <p>Chargement…</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="privacy">
        <div className="privacy__content">
          <div className="privacy__state reveal">
            <p>Erreur : {String(error.message || error)}</p>
          </div>
        </div>
      </div>
    );
  }

  const collected = list(`${base}.dataCollected.items`);
  const rights = list(`${base}.rights.items`);

  const contactText = t(`${base}.contact.text`, "");
  const contactEmail = t(`${base}.contact.email`, "");

  return (
    <>
      <SEO
        path="legalPages.privacy"
        fallbackTitle="Confidentialité"
        fallbackDesc="Politique de confidentialité."
      />

      <div className="privacy">
        <div className="privacy__content">
          {/* Header */}
          <header className="privacy__header reveal reveal--up" style={{ "--delay": "0ms" }}>
            <h1 className="privacy__title">{t(`${base}.title`, "Confidentialité")}</h1>
            <p className="privacy__intro">{t(`${base}.intro`, "")}</p>
          </header>

          {/* Données collectées */}
          <section className="privacy__card reveal" style={{ "--delay": "80ms" }}>
            <h2 className="privacy__h2">{t(`${base}.dataCollected.title`, "Données collectées")}</h2>
            <p className="privacy__p">{t(`${base}.dataCollected.lead`, "")}</p>

            {collected.length > 0 && (
              <ul className="privacy__list">
                {collected.map((it, i) => (
                  <li key={i}>{it}</li>
                ))}
              </ul>
            )}
          </section>

          {/* Utilisation */}
          <section className="privacy__card reveal" style={{ "--delay": "120ms" }}>
            <h2 className="privacy__h2">{t(`${base}.use.title`, "Utilisation")}</h2>
            <p className="privacy__p">{t(`${base}.use.text`, "")}</p>
          </section>

          {/* Conservation */}
          <section className="privacy__card reveal" style={{ "--delay": "160ms" }}>
            <h2 className="privacy__h2">{t(`${base}.retention.title`, "Durée de conservation")}</h2>
            <p className="privacy__p">{t(`${base}.retention.text`, "")}</p>
          </section>

          {/* Partage */}
          <section className="privacy__card reveal" style={{ "--delay": "200ms" }}>
            <h2 className="privacy__h2">{t(`${base}.sharing.title`, "Partage")}</h2>
            <p className="privacy__p">{t(`${base}.sharing.text`, "")}</p>
          </section>

          {/* Droits */}
          <section className="privacy__card reveal" style={{ "--delay": "240ms" }}>
            <h2 className="privacy__h2">{t(`${base}.rights.title`, "Vos droits")}</h2>
            <p className="privacy__p">{t(`${base}.rights.lead`, "")}</p>

            {rights.length > 0 && (
              <ul className="privacy__list">
                {rights.map((it, i) => (
                  <li key={i}>{it}</li>
                ))}
              </ul>
            )}
          </section>

          {/* Contact */}
          {(contactText || contactEmail) && (
            <section className="privacy__card privacy__card--contact reveal" style={{ "--delay": "280ms" }}>
              <p className="privacy__p">
                {contactText} {contactEmail && <strong>{contactEmail}</strong>}
              </p>
            </section>
          )}
        </div>
      </div>
    </>
  );
}