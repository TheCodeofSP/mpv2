import { useContent } from "../content/useContent";
import "./legal.scss";
import SEO from "../seo/SEO.jsx";

export default function Legal() {
  const { t, isLoading, error } = useContent();

  const base = "legalPages.legal";

  if (isLoading) {
    return (
      <div className="legal">
        <div className="legal__content">
          <div className="legal__state reveal">
            <p>Chargement…</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="legal">
        <div className="legal__content">
          <div className="legal__state reveal">
            <p>Erreur : {String(error.message || error)}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        path="legalPages.legal"
        fallbackTitle="Mentions légales"
        fallbackDesc="Informations légales du site."
      />

      <div className="legal">
        <div className="legal__content">
          {/* Header */}
          <header className="legal__header reveal reveal--up" style={{ "--delay": "0ms" }}>
            <h1 className="legal__title">{t(`${base}.title`, "Mentions légales")}</h1>
            <p className="legal__intro">{t(`${base}.intro`, "")}</p>
          </header>

          {/* Publisher */}
          <section className="legal__card reveal" style={{ "--delay": "80ms" }}>
            <h2 className="legal__h2">{t(`${base}.publisher.title`, "Éditeur du site")}</h2>

            <dl className="legal__dl">
              <div className="legal__row">
                <dt>{t(`${base}.publisher.nameLabel`, "Nom")}</dt>
                <dd>{t(`${base}.publisher.nameValue`, "")}</dd>
              </div>

              <div className="legal__row">
                <dt>{t(`${base}.publisher.statusLabel`, "Statut")}</dt>
                <dd>{t(`${base}.publisher.statusValue`, "")}</dd>
              </div>

              <div className="legal__row">
                <dt>{t(`${base}.publisher.emailLabel`, "Email")}</dt>
                <dd>{t(`${base}.publisher.emailValue`, "")}</dd>
              </div>

              <div className="legal__row">
                <dt>{t(`${base}.publisher.addressLabel`, "Adresse")}</dt>
                <dd>{t(`${base}.publisher.addressValue`, "")}</dd>
              </div>

              <div className="legal__row">
                <dt>{t(`${base}.publisher.siretLabel`, "SIRET")}</dt>
                <dd>{t(`${base}.publisher.siretValue`, "")}</dd>
              </div>
            </dl>
          </section>

          {/* Publication */}
          <section className="legal__card reveal" style={{ "--delay": "120ms" }}>
            <h2 className="legal__h2">{t(`${base}.publication.title`, "Responsable de publication")}</h2>
            <p className="legal__p">{t(`${base}.publication.value`, "")}</p>
          </section>

          {/* Hosting */}
          <section className="legal__card reveal" style={{ "--delay": "160ms" }}>
            <h2 className="legal__h2">{t(`${base}.hosting.title`, "Hébergement")}</h2>

            <dl className="legal__dl">
              <div className="legal__row">
                <dt>{t(`${base}.hosting.providerLabel`, "Hébergeur")}</dt>
                <dd>{t(`${base}.hosting.providerValue`, "")}</dd>
              </div>

              <div className="legal__row">
                <dt>{t(`${base}.hosting.addressLabel`, "Adresse")}</dt>
                <dd>{t(`${base}.hosting.addressValue`, "")}</dd>
              </div>
            </dl>
          </section>

          {/* IP */}
          <section className="legal__card reveal" style={{ "--delay": "200ms" }}>
            <h2 className="legal__h2">{t(`${base}.ip.title`, "Propriété intellectuelle")}</h2>
            <p className="legal__p">{t(`${base}.ip.text`, "")}</p>
          </section>
        </div>
      </div>
    </>
  );
}