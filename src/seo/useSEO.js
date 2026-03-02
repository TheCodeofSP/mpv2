import { useEffect } from "react";

function setMeta(name, content) {
  if (!content) return;
  let el = document.querySelector(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("name", name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setProperty(property, content) {
  if (!content) return;
  let el = document.querySelector(`meta[property="${property}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("property", property);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setLink(rel, href) {
  if (!href) return;
  let el = document.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export function useSEO({
  title,
  description,
  canonical,
  ogImage,
  ogType = "website",
}) {
  useEffect(() => {
    if (title) document.title = title;

    if (description) {
      setMeta("description", description);
      setProperty("og:description", description);
      setMeta("twitter:description", description);
    }

    if (title) {
      setProperty("og:title", title);
      setMeta("twitter:title", title);
    }

    if (ogType) setProperty("og:type", ogType);
    if (ogImage) {
      setProperty("og:image", ogImage);
      setMeta("twitter:image", ogImage);
      setMeta("twitter:card", "summary_large_image");
    }

    if (canonical) {
      setLink("canonical", canonical);
      setProperty("og:url", canonical);
    }
  }, [title, description, canonical, ogImage, ogType]);
}