import { useSEO } from "./useSEO.js";
import { useContent } from "../content/useContent.js";

export default function SEO({ path, fallbackTitle, fallbackDesc }) {
  const { t } = useContent();

  const title = t(`${path}.seo.title`, fallbackTitle);
  const description = t(`${path}.seo.description`, fallbackDesc);

  const url = window.location.origin + window.location.pathname;

  const fullTitle = title.includes("Manon")
    ? title
    : `${title} – Manon Pontasse`;

  useSEO({
    title,
    description,
    canonical: url,
    ogImage: `${window.location.origin}/og-cover.jpg`,
  });

  return null;
}
