import { FiMapPin, FiHome, FiUsers, FiVideo } from "react-icons/fi";
import { useId, useMemo } from "react";
import { useContent } from "../content/useContent.js";
import "./serviceArea.scss";

function modalityIcon(label) {
  const s = String(label || "").toLowerCase();

  if (s.includes("visio") || s.includes("vidéo") || s.includes("video")) return FiVideo;
  if (s.includes("structure") || s.includes("établissement") || s.includes("organisme"))
    return FiUsers;
  if (s.includes("domicile") || s.includes("chez")) return FiHome;

  return FiMapPin;
}

export default function ServiceArea({
  variant = "default", // default | compact | highlight
  showMap = false,
  mapQuery = "Strasbourg, France",
}) {
  const { t, node } = useContent();
  const uid = useId();

  const title = t("home.serviceArea.title", "");
  const text = t("home.serviceArea.text", "");

  const modalitiesList = useMemo(() => {
    const raw = node("home.serviceArea.modalities");
    return Array.isArray(raw) ? raw : [];
  }, [node]);

  if (!title && !text && !showMap) return null;

  const titleId = `service-area-title-${uid}`;

  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(
    mapQuery
  )}&output=embed`;

  return (
    <section
      className={`service-area service-area--${variant}`}
      aria-labelledby={title ? titleId : undefined}
    >
      <div className="service-area__card reveal" style={{ "--delay": "0ms" }}>
        <div className="service-area__head">
          <span className="service-area__icon" aria-hidden="true">
            <FiMapPin />
          </span>
          {title && (
            <h2 id={titleId} className="service-area__title">
              {title}
            </h2>
          )}
        </div>

        {text && <p className="service-area__text">{text}</p>}

        {modalitiesList.length > 0 && (
          <ul className="service-area__chips" aria-label="Modalités d’intervention">
            {modalitiesList.map((m, i) => {
              const Icon = modalityIcon(m);
              return (
                <li key={`${m}-${i}`} className="service-area__chip">
                  <span className="service-area__chipIcon" aria-hidden="true">
                    <Icon />
                  </span>
                  <span className="service-area__chipText">{m}</span>
                </li>
              );
            })}
          </ul>
        )}

        {showMap && (
          <div className="service-area__mapWrap">
            <iframe
              className="service-area__map"
              title={`Carte – ${mapQuery}`}
              src={mapSrc}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
            <p className="service-area__mapNote">
              Carte indicative (pas d’adresse exacte).
            </p>
          </div>
        )}
      </div>
    </section>
  );
}