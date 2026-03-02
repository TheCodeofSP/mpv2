const PROFILE_KEYS = new Set([
  "visitor",
  "accompagne",
  "accompagnant",
  "partenaire_social",
]);

function isPlainObject(v) {
  return v !== null && typeof v === "object" && !Array.isArray(v);
}

function looksProfiledObject(obj) {
  // au moins une clé profil connue
  return Object.keys(obj).some((k) => PROFILE_KEYS.has(k));
}

export function getByProfile(value, profile) {
  if (value == null) return value;

  // primitives
  if (typeof value !== "object") return value;

  // arrays: map récursif
  if (Array.isArray(value)) {
    return value.map((v) => getByProfile(v, profile));
  }

  // objets non "plain" (Date, etc.)
  if (!isPlainObject(value)) return value;

  // objet profilé
  if (looksProfiledObject(value)) {
    if (profile && Object.prototype.hasOwnProperty.call(value, profile)) {
      return getByProfile(value[profile], profile);
    }
    if (Object.prototype.hasOwnProperty.call(value, "visitor")) {
      return getByProfile(value.visitor, profile);
    }
    // fallback: premier profil dispo (rare)
    const firstKey = Object.keys(value).find((k) => PROFILE_KEYS.has(k));
    return firstKey ? getByProfile(value[firstKey], profile) : value;
  }

  // objet normal: descente récursive
  const out = {};
  for (const [k, v] of Object.entries(value)) {
    out[k] = getByProfile(v, profile);
  }
  return out;
}