import { useMemo } from "react";
import { useContent } from "../content/useContent.js";

function normalizePhone(value) {
  return String(value || "").replace(/\s/g, "");
}

export default function LocalBusinessJsonLd() {
  const { node, list } = useContent();

  // Nom (on essaie de le récupérer du contenu, sinon fallback)
  const siteName =
    node("site.name") ||
    node("header.siteName") ||
    "Manon Pontasse – Éducatrice spécialisée";

  // Email / téléphone depuis contact.content.methods
  const methods = list("contact.content.methods");
  const email = methods.find((m) => m.type === "email")?.value || "";
  const phoneRaw = methods.find((m) => m.type === "phone")?.value || "";
  const phone = phoneRaw ? normalizePhone(phoneRaw) : "";

  const url = typeof window !== "undefined" ? window.location.origin : "";
  const sameAs = node("site.sameAs") ?? []; // optionnel si tu ajoutes des réseaux plus tard

  const jsonLd = useMemo(() => {
    return {
      "@context": "https://schema.org",
      "@type": ["LocalBusiness", "ProfessionalService"],
      name: siteName,
      url,
      areaServed: [
        { "@type": "AdministrativeArea", name: "Eurométropole de Strasbourg" },
        { "@type": "City", name: "Strasbourg" },
      ],
      address: {
        "@type": "PostalAddress",
        addressLocality: "Strasbourg",
        addressRegion: "Grand Est",
        addressCountry: "FR",
      },
      // Pas d'adresse précise => on n'ajoute pas streetAddress/postalCode
      email: email || undefined,
      telephone: phone || undefined,
      // Catégorie métier (Google comprend mieux)
      serviceType: "Accompagnement éducatif spécialisé",
      // Optionnel : réseaux sociaux si tu les ajoutes dans le JSON
      sameAs: Array.isArray(sameAs) && sameAs.length ? sameAs : undefined,
    };
  }, [siteName, url, email, phone, sameAs]);

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
