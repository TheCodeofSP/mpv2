import { Link, useNavigate } from "react-router-dom";
import { useContent } from "../content/useContent.js";
import "./notFound.scss";
import SEO from "../seo/SEO.jsx";

export default function NotFound() {
  const navigate = useNavigate();
  const { t, node, isLoading, error } = useContent();

  const actions = node("notFound.actions") ?? {};
  const home = actions?.home ?? { href: "/", label: "Retour à l’accueil" };
  const contact = actions?.contact ?? {
    href: "/contact",
    label: "Me contacter",
  };
  const backLabel = t("notFound.actions.back.label", "Revenir en arrière");

  if (isLoading) {
    return (
      <div className="nf">
        <div className="nf__content">
          <div className="nf__state reveal">
            <p>Chargement…</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="nf">
        <div className="nf__content">
          <div className="nf__state reveal">
            <p>Erreur : {String(error.message || error)}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        path="notfound"
        fallbackTitle="Page introuvable"
        fallbackDesc="La page que vous recherchez n’existe pas ou a été déplacée."
      />

      <div className="nf">
        <div className="nf__content">
          <div
            className="nf__card reveal reveal--up"
            style={{ "--delay": "0ms" }}
          >
            <p className="nf__code" aria-hidden="true">
              404
            </p>

            <h1 className="nf__title">
              {t("notFound.title", "Page introuvable")}
            </h1>

            <p className="nf__text">
              {t("notFound.text", "Cette page n’existe pas.")}
            </p>

            <div className="nf__actions">
              <Link className="nf__btn nf__btn--primary" to={home.href}>
                {home.label}
              </Link>

              <Link className="nf__btn nf__btn--ghost" to={contact.href}>
                {contact.label}
              </Link>

              <button
                type="button"
                className="nf__btn nf__btn--ghost"
                onClick={() => navigate(-1)}
              >
                {backLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
