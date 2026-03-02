import { Link } from "react-router-dom";
import { useMemo } from "react";
import "./footer.scss";
import Logo from "../assets/logo4.png";
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import { useContent } from "../content/useContent.js";
import Signature from "./Signature.jsx";

function normalizePhone(value) {
  return String(value || "").replace(/\s/g, "");
}

export default function Footer() {
  const year = new Date().getFullYear();
  const { node } = useContent();

  const methodsRaw = node("contact.content.methods");
  const methods = useMemo(
    () => (Array.isArray(methodsRaw) ? methodsRaw : []),
    [methodsRaw]
  );

  const email = methods.find((m) => m.type === "email");
  const phone = methods.find((m) => m.type === "phone");
  const location = node("footer.contact.location");

  return (
    <>
      <div className="footer-separator" aria-hidden="true" />

      <footer className="footer" role="contentinfo">
        <div className="footer__inner">
          {/* Branding */}
          <section className="footer__brand reveal" style={{ "--delay": "0ms" }}>
            <img src={Logo} alt="Logo Manon Pontasse" className="footer__logo" />
            <p className="footer__tagline">Éducatrice spécialisée indépendante</p>
            <Signature type="main" align="left" variant="subtle" />
          </section>

          {/* Contact rapide */}
          <section
            className="footer__contact reveal"
            style={{ "--delay": "80ms" }}
          >
            <h3 className="footer__title">Contact</h3>

            <div className="footer__contactList">
              {email?.value && (
                <a className="footer__contactLink" href={`mailto:${email.value}`}>
                  <FiMail />
                  <span>{email.value}</span>
                </a>
              )}

              {phone?.value && (
                <a
                  className="footer__contactLink"
                  href={`tel:${normalizePhone(phone.value)}`}
                >
                  <FiPhone />
                  <span>{phone.value}</span>
                </a>
              )}

              {location && (
                <div className="footer__contactRow">
                  <FiMapPin />
                  <span>{location}</span>
                </div>
              )}
            </div>
          </section>

          {/* Légal */}
          <section className="footer__legal reveal" style={{ "--delay": "160ms" }}>
            <h3 className="footer__title">Informations</h3>

            <div className="footer__links">
              <Link to="/legal">Mentions légales</Link>
              <Link to="/privacy">Confidentialité</Link>
            </div>

            <p className="footer__copy">© {year} – Tous droits réservés</p>
          </section>
        </div>
      </footer>
    </>
  );
}