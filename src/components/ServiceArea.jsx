import { FiMapPin, FiHome, FiUsers, FiVideo } from "react-icons/fi";
import { useId, useMemo, useState } from "react";
import { useContent } from "../content/useContent.js";
import { MapContainer, TileLayer, Marker, Popup, Polygon } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./serviceArea.scss";
import { useEffect } from "react";
import { useMap } from "react-leaflet";

function modalityIcon(label) {
  const s = String(label || "").toLowerCase();

  if (s.includes("visio") || s.includes("vidéo") || s.includes("video")) {
    return FiVideo;
  }
  if (
    s.includes("structure") ||
    s.includes("établissement") ||
    s.includes("organisme")
  ) {
    return FiUsers;
  }
  if (s.includes("domicile") || s.includes("chez")) {
    return FiHome;
  }

  return FiMapPin;
}

const zoneMarkerIcon = L.divIcon({
  className: "service-area__leafletMarker",
  html: `<span class="service-area__leafletMarkerInner"></span>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

function FitZoneBounds({ zonePolygon = [], zoneCities = [] }) {
  const map = useMap();

  useEffect(() => {
    const polygonPoints = Array.isArray(zonePolygon) ? zonePolygon : [];
    const cityPoints = Array.isArray(zoneCities)
      ? zoneCities
          .map((city) => [city.lat, city.lng])
          .filter(([lat, lng]) => Number.isFinite(lat) && Number.isFinite(lng))
      : [];

    const allPoints = [...polygonPoints, ...cityPoints];

    if (allPoints.length > 0) {
      map.fitBounds(allPoints, {
        padding: [24, 24],
      });
    }
  }, [map, zonePolygon, zoneCities]);

  return null;
}

export default function ServiceArea({
  variant = "default",
  showMap = false,
  mapMode = "embed",
  mapQuery = "Strasbourg, France",
  zoneCities = [],
  zonePolygon = [],
  zoneCenter = [48.5734, 7.7521],
  zoneZoom = 11,
  showCityList = false,
  collapsibleCityList = false,
  defaultCityListOpen = false,
  cityListLabel = "Voir la liste des communes",
  cityListCloseLabel = "Masquer la liste des communes",
  mapNote = "Carte indicative de la zone d’intervention.",
}) {
  const [isCityListOpen, setIsCityListOpen] = useState(defaultCityListOpen);
  const { t, node } = useContent();
  const uid = useId();

  const title = t("home.serviceArea.title", "");
  const text = t("home.serviceArea.text", "");
  const note = t("home.serviceArea.note", "");

  const modalitiesList = useMemo(() => {
    const raw = node("home.serviceArea.modalities");
    return Array.isArray(raw) ? raw : [];
  }, [node]);

  const sortedZoneCities = useMemo(() => {
    if (!Array.isArray(zoneCities)) return [];

    return [...zoneCities].sort((a, b) =>
      String(a?.name || "").localeCompare(String(b?.name || ""), "fr", {
        sensitivity: "base",
      }),
    );
  }, [zoneCities]);

  const featuredCities = useMemo(() => {
    return sortedZoneCities.filter((city) => city?.highlight);
  }, [sortedZoneCities]);
  if (!title && !text && !showMap) return null;

  const titleId = `service-area-title-${uid}`;

  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(
    mapQuery,
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
          <ul
            className="service-area__chips"
            aria-label="Modalités d’intervention"
          >
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

        {note && <p className="service-area__note">{note}</p>}

        {showMap && mapMode === "embed" && (
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

        {showMap && mapMode === "zone" && (
          <div className="service-area__mapWrap">
            <MapContainer
              center={zoneCenter}
              zoom={zoneZoom}
              scrollWheelZoom={false}
              className="service-area__map service-area__map--leaflet"
            >
              <FitZoneBounds
                zonePolygon={zonePolygon}
                zoneCities={zoneCities}
              />

              <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {Array.isArray(zonePolygon) && zonePolygon.length > 0 && (
                <Polygon
                  positions={zonePolygon}
                  pathOptions={{
                    weight: 2,
                    opacity: 1,
                    fillOpacity: 0.18,
                  }}
                />
              )}

              {featuredCities.map((city) => (
                <Marker
                  key={city.name}
                  position={[city.lat, city.lng]}
                  icon={zoneMarkerIcon}
                >
                  <Popup>{city.name}</Popup>
                </Marker>
              ))}
            </MapContainer>
            {showCityList && sortedZoneCities.length > 0 && (
              <div className="service-area__cityListWrap">
                {collapsibleCityList ? (
                  <>
                    <button
                      type="button"
                      className="service-area__cityToggle"
                      onClick={() => setIsCityListOpen((open) => !open)}
                      aria-expanded={isCityListOpen}
                      aria-controls={`service-area-city-list-${uid}`}
                    >
                      {isCityListOpen ? cityListCloseLabel : cityListLabel}
                    </button>

                    {isCityListOpen && (
                      <ul
                        id={`service-area-city-list-${uid}`}
                        className="service-area__cityList"
                        aria-label="Communes d’intervention"
                      >
                        {sortedZoneCities.map((city) => (
                          <li
                            key={city.name}
                            className="service-area__cityItem"
                          >
                            {city.name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <ul
                    id={`service-area-city-list-${uid}`}
                    className="service-area__cityList"
                    aria-label="Communes d’intervention"
                  >
                    {sortedZoneCities.map((city) => (
                      <li key={city.name} className="service-area__cityItem">
                        {city.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
            <p className="service-area__mapNote">{mapNote}</p>
          </div>
        )}
      </div>
    </section>
  );
}
