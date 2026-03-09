import { useMemo, useState, useEffect, useRef } from "react";
import { useContent } from "../content/useContent.js";
import { useProfile, PROFILES } from "../context/profile/ProfileContext.jsx";
import Toast from "../components/Toast.jsx";

import "./contact.scss";
import {
  FiMail,
  FiPhone,
  FiCheckCircle,
  FiAlertCircle,
  FiCopy,
} from "react-icons/fi";

import SEO from "../seo/SEO.jsx";
import ServiceArea from "../components/ServiceArea.jsx";
import Signature from "../components/Signature.jsx";

import {
  serviceAreaCities,
  serviceAreaPolygon,
  serviceAreaCenter,
  serviceAreaZoom,
} from "../components/serviceAreaMapData.js";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/mreawewv";

function normalizePhone(value) {
  return String(value || "").replace(/\s/g, "");
}

// ✅ deepGet local (lecture BRUTE dans content.json)
function deepGet(obj, path) {
  if (!obj || !path) return undefined;
  return path.split(".").reduce((acc, k) => (acc ? acc[k] : undefined), obj);
}

export default function Contact() {
  const { profile: globalProfile } = useProfile();
  const { node, list, t, content, isLoading, error } = useContent();

  const intro = node("contact.intro") ?? {};
  const methods = list("contact.content.methods");
  const form = node("contact.content.form") ?? {};
  const labels = form?.fields ?? {};

  const selects = form?.selects ?? {};
  const profileSelect = selects?.profile ?? {};
  const topicSelect = selects?.topic ?? {};

  const safeMethods = useMemo(
    () => (Array.isArray(methods) ? methods : []),
    [methods],
  );
  const emailMethod = safeMethods.find((m) => m.type === "email");

  const submitLabel = t(
    "contact.content.form.submit.label",
    "Envoyer ma demande",
  );
  const responseTime = t("contact.content.form.helper.responseTime", "");

  const profileOptionsRaw = node(
    profileSelect?.optionsPath || "home.profileSelector.options",
  );
  const safeProfileOptions = useMemo(() => {
    const arr = Array.isArray(profileOptionsRaw) ? profileOptionsRaw : [];
    return arr.filter((opt) => opt?.key);
  }, [profileOptionsRaw]);

  const [values, setValues] = useState({
    profile: "",
    topic: "",
    name: "",
    email: "",
    phone: "",
    message: "",
    consent: false,
    _gotcha: "",
  });

  useEffect(() => {
    if (globalProfile && globalProfile !== PROFILES.VISITOR) {
      setValues((v) => (v.profile ? v : { ...v, profile: globalProfile }));
    }
  }, [globalProfile]);

  const currentProfile = values.profile || globalProfile || PROFILES.VISITOR;
  const isTu = currentProfile === PROFILES.ACCOMPAGNE;

  const topicsByProfileRaw =
    deepGet(content, "contact.content.form.selects.topic.optionsByProfile") ??
    {};

  const topicOptions = useMemo(() => {
    const list0 =
      topicsByProfileRaw?.[currentProfile] ?? topicsByProfileRaw?.visitor ?? [];
    return Array.isArray(list0) ? list0 : [];
  }, [topicsByProfileRaw, currentProfile]);

  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const [copied, setCopied] = useState("");

  // ✅ IMPORTANT : fermer le toast = remettre status à idle
  const closeToast = () => setStatus({ type: "idle", message: "" });

  // ✅ refs focus premier champ en erreur
  const fieldRefs = useRef({
    profile: null,
    topic: null,
    name: null,
    email: null,
    phone: null,
    message: null,
    consent: null,
  });

  const copy = useMemo(() => {
    return {
      chooseProfile: isTu
        ? "Choisis ton profil."
        : "Veuillez choisir votre profil.",
      chooseTopic: isTu
        ? "Précise ta demande."
        : "Veuillez préciser votre demande.",
      enterName: isTu ? "Indique ton nom." : "Veuillez renseigner votre nom.",
      enterEmail: isTu
        ? "Indique ton email."
        : "Veuillez renseigner votre email.",
      invalidEmail: "Email invalide.",
      shortMsg: isTu
        ? "Ton message est trop court (min. 10 caractères)."
        : "Votre message est trop court (min. 10 caractères).",
      consent: isTu
        ? "Merci de confirmer ton accord."
        : "Merci de confirmer votre accord.",
      globalError: isTu
        ? "Merci de corriger les champs signalés."
        : "Merci de corriger les champs signalés.",
      success: isTu
        ? "Ton message est envoyé. Je te répondrai dès que possible."
        : "Votre message est envoyé. Je vous répondrai dès que possible.",
      formTitle: isTu
        ? "Parlons de ta situation"
        : "Parlons de votre situation",
      namePh: isTu ? "Ton nom" : "Votre nom",
    };
  }, [isTu]);

  const errors = useMemo(() => {
    const e = {};

    if (!values.profile) e.profile = copy.chooseProfile;
    if (!values.topic) e.topic = copy.chooseTopic;

    if (!values.name.trim()) e.name = copy.enterName;

    if (!values.email.trim()) e.email = copy.enterEmail;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
      e.email = copy.invalidEmail;
    }

    if (!values.message.trim() || values.message.trim().length < 10) {
      e.message = copy.shortMsg;
    }

    if (!values.consent) e.consent = copy.consent;

    return e;
  }, [values, copy]);

  const onChange = (key) => (e) => {
    const next = key === "consent" ? e.target.checked : e.target.value;

    // si on édite après une erreur, on reset le toast
    if (status.type === "error") setStatus({ type: "idle", message: "" });

    setValues((v) => {
      if (key === "profile") return { ...v, profile: next, topic: "" };
      return { ...v, [key]: next };
    });
  };

  const onBlur = (key) => () => setTouched((t0) => ({ ...t0, [key]: true }));
  const showError = (key) => Boolean(touched[key] && errors[key]);

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(text);
      setTimeout(() => setCopied(""), 1200);
    } catch {
      // non bloquant
    }
  };

  const focusFirstError = () => {
    const order = ["profile", "topic", "name", "email", "message", "consent"];
    const firstKey = order.find((k) => errors[k]);
    if (!firstKey) return;

    const el = fieldRefs.current[firstKey];
    if (el && typeof el.focus === "function") {
      el.focus();
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    setTouched({
      profile: true,
      topic: true,
      name: true,
      email: true,
      phone: true,
      message: true,
      consent: true,
    });

    const isValid = Object.keys(errors).length === 0;

    if (!isValid) {
      setStatus({ type: "error", message: copy.globalError });
      focusFirstError();
      return;
    }

    try {
      setStatus({ type: "idle", message: "" });

      const data = new FormData();
      data.append("profile", values.profile);
      data.append("topic", values.topic);
      data.append("name", values.name);
      data.append("email", values.email);
      if (values.phone) data.append("phone", values.phone);
      data.append("message", values.message);
      data.append("_gotcha", values._gotcha || "");

      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });

      if (res.ok) {
        setStatus({ type: "success", message: copy.success });
        setValues({
          profile: values.profile,
          topic: "",
          name: "",
          email: "",
          phone: "",
          message: "",
          consent: false,
          _gotcha: "",
        });
        setTouched({});
        return;
      }

      const payload = await res.json().catch(() => null);
      const msg =
        payload?.errors?.map((e) => e.message).join(", ") ||
        "Oops ! Problème lors de l’envoi. Réessayez.";

      setStatus({ type: "error", message: msg });
    } catch {
      setStatus({
        type: "error",
        message: "Impossible d’envoyer le message. Vérifiez votre connexion.",
      });
    }
  };

  if (isLoading) {
    return (
      <main className="contact">
        <div className="contact__container">
          <p>Chargement…</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="contact">
        <div className="contact__container">
          <p>Erreur : {String(error.message || error)}</p>
        </div>
      </main>
    );
  }

  return (
    <>
      <SEO
        path="contact"
        fallbackTitle="Manon Pontasse - Contact"
        fallbackDesc="Contactez une éducatrice spécialisée en déficience intellectuelle."
      />

      {/* ✅ UN SEUL TOAST : composant Toast */}
      <Toast
        open={status.type !== "idle"}
        type={
          status.type === "success"
            ? "success"
            : status.type === "error"
              ? "error"
              : "info"
        }
        title={status.type === "success" ? "Message envoyé" : "Erreur"}
        message={status.message}
        onClose={closeToast}
        duration={status.type === "success" ? 3500 : 6000}
      />

      <div className="contact__container">
        {/* HERO */}
        <header className="contact__hero">
          <h1 className="contact__title">{intro?.title ?? "Me contacter"}</h1>
          {intro?.subtitle && (
            <p className="contact__kicker">{intro.subtitle}</p>
          )}
          {intro?.lead && <p className="contact__lead">{intro.lead}</p>}
        </header>

        <div className="contact__layout">
          {/* Colonne gauche */}
          <aside className="contact__side">
            <div className="contact__sideCard">
              <h2 className="contact__h2">Coordonnées</h2>

              <div className="contact__methods">
                {safeMethods.map((m, idx) => {
                  const isEmail = m.type === "email";
                  const isPhone = m.type === "phone";
                  const Icon = isEmail
                    ? FiMail
                    : isPhone
                      ? FiPhone
                      : FiCheckCircle;

                  const href = isEmail
                    ? `mailto:${m.value}`
                    : isPhone
                      ? `tel:${normalizePhone(m.value)}`
                      : undefined;

                  return (
                    <div key={idx} className="contact__method">
                      <div className="contact__methodIcon" aria-hidden="true">
                        <Icon />
                      </div>

                      <div className="contact__methodBody">
                        <p className="contact__methodLabel">{m.label}</p>
                        {href ? (
                          <a className="contact__methodValue" href={href}>
                            {m.value}
                          </a>
                        ) : (
                          <p className="contact__methodValue">{m.value}</p>
                        )}
                      </div>

                      <button
                        type="button"
                        className="contact__copy"
                        onClick={() => handleCopy(m.value)}
                        aria-label={`Copier ${m.label}`}
                        title="Copier"
                      >
                        <FiCopy />
                        <span className="contact__copyText">
                          {copied === m.value ? "Copié" : "Copier"}
                        </span>
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="contact__note">
                <p>En cas d’urgence, contactez les services adaptés:</p>
                <ul>
                  <li>15 – SAMU</li>
                  <li>18 – Pompiers</li>
                  <li>112 – Numéro d’urgence européen</li>
                  <li>3114 – Soutien psychologique (24h/24)</li>
                </ul>
              </div>
            </div>
            <ServiceArea
              variant="highlight"
              showMap
              mapMode="zone"
              zoneCities={serviceAreaCities}
              zonePolygon={serviceAreaPolygon}
              zoneCenter={serviceAreaCenter}
              zoneZoom={serviceAreaZoom}
              showCityList
              collapsibleCityList
              defaultCityListOpen={false}
              cityListLabel="Voir les communes desservies"
              cityListCloseLabel="Masquer les communes desservies"
              mapNote="Carte indicative de la zone d’intervention à Strasbourg, dans l’Eurométropole Sud et jusqu’au secteur d’Erstein."
            />{" "}
          </aside>

          {/* Colonne droite */}
          <section className="contact__main">
            <div className="contact__card contact__card--reveal">
              <h2 className="contact__h2">
                {t("contact.ui.formTitle", copy.formTitle)}
              </h2>

              <form className="contact__form" onSubmit={onSubmit} noValidate>
                <input
                  type="text"
                  name="_gotcha"
                  value={values._gotcha}
                  onChange={onChange("_gotcha")}
                  className="sr-only"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                />

                <div className="contact__grid">
                  {/* Profil */}
                  <div className="contact__field">
                    <label className="contact__label" htmlFor="profile">
                      {profileSelect?.label ?? "Je suis…"}
                    </label>

                    <select
                      id="profile"
                      ref={(el) => (fieldRefs.current.profile = el)}
                      className={`contact__select ${showError("profile") ? "has-error" : ""}`}
                      value={values.profile}
                      onChange={onChange("profile")}
                      onBlur={onBlur("profile")}
                      aria-invalid={showError("profile") ? "true" : "false"}
                      aria-describedby={
                        showError("profile") ? "err-profile" : undefined
                      }
                    >
                      <option value="">
                        {profileSelect?.placeholder ?? "Choisir…"}
                      </option>
                      {safeProfileOptions.map((opt) => (
                        <option key={opt.key} value={opt.key}>
                          {opt.label}
                        </option>
                      ))}
                    </select>

                    {showError("profile") && (
                      <p className="contact__error" id="err-profile">
                        {errors.profile}
                      </p>
                    )}
                  </div>

                  {/* Topic */}
                  <div className="contact__field">
                    <label className="contact__label" htmlFor="topic">
                      {topicSelect?.label ?? "Ma demande concerne…"}
                    </label>

                    <select
                      id="topic"
                      ref={(el) => (fieldRefs.current.topic = el)}
                      className={`contact__select ${showError("topic") ? "has-error" : ""}`}
                      value={values.topic}
                      onChange={onChange("topic")}
                      onBlur={onBlur("topic")}
                      aria-invalid={showError("topic") ? "true" : "false"}
                      aria-describedby={
                        showError("topic") ? "err-topic" : undefined
                      }
                    >
                      <option value="">
                        {topicSelect?.placeholder ?? "Choisir…"}
                      </option>
                      {topicOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>

                    {showError("topic") && (
                      <p className="contact__error" id="err-topic">
                        {errors.topic}
                      </p>
                    )}
                  </div>

                  {/* Nom */}
                  <div className="contact__field">
                    <label className="contact__label" htmlFor="name">
                      {labels?.name ?? "Nom"}
                    </label>
                    <input
                      id="name"
                      ref={(el) => (fieldRefs.current.name = el)}
                      className={`contact__input ${showError("name") ? "has-error" : ""}`}
                      type="text"
                      value={values.name}
                      onChange={onChange("name")}
                      onBlur={onBlur("name")}
                      autoComplete="name"
                      placeholder={copy.namePh}
                      aria-invalid={showError("name") ? "true" : "false"}
                      aria-describedby={
                        showError("name") ? "err-name" : undefined
                      }
                    />
                    {showError("name") && (
                      <p className="contact__error" id="err-name">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="contact__field">
                    <label className="contact__label" htmlFor="email">
                      {labels?.email ?? "Email"}
                    </label>
                    <input
                      id="email"
                      ref={(el) => (fieldRefs.current.email = el)}
                      className={`contact__input ${showError("email") ? "has-error" : ""}`}
                      type="email"
                      value={values.email}
                      onChange={onChange("email")}
                      onBlur={onBlur("email")}
                      autoComplete="email"
                      placeholder="vous@exemple.fr"
                      aria-invalid={showError("email") ? "true" : "false"}
                      aria-describedby={
                        showError("email") ? "err-email" : undefined
                      }
                    />
                    {showError("email") && (
                      <p className="contact__error" id="err-email">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Tel */}
                  <div className="contact__field contact__field--full">
                    <label className="contact__label" htmlFor="phone">
                      {labels?.phone ?? "Téléphone"}{" "}
                      <span className="contact__optional">(optionnel)</span>
                    </label>
                    <input
                      id="phone"
                      ref={(el) => (fieldRefs.current.phone = el)}
                      className="contact__input"
                      type="tel"
                      value={values.phone}
                      onChange={onChange("phone")}
                      onBlur={onBlur("phone")}
                      autoComplete="tel"
                      placeholder="06 00 00 00 00"
                    />
                  </div>

                  {/* Message */}
                  <div className="contact__field contact__field--full">
                    <label className="contact__label" htmlFor="message">
                      {labels?.message ?? "Message"}
                    </label>
                    <textarea
                      id="message"
                      ref={(el) => (fieldRefs.current.message = el)}
                      className={`contact__textarea ${showError("message") ? "has-error" : ""}`}
                      value={values.message}
                      onChange={onChange("message")}
                      onBlur={onBlur("message")}
                      rows={6}
                      placeholder={
                        isTu
                          ? "Ex : ce que tu vis, ce dont tu as besoin… même quelques lignes suffisent."
                          : "Ex : difficultés rencontrées, besoins, questions… même quelques lignes suffisent."
                      }
                      aria-invalid={showError("message") ? "true" : "false"}
                      aria-describedby={
                        showError("message") ? "err-message" : undefined
                      }
                    />
                    {showError("message") && (
                      <p className="contact__error" id="err-message">
                        {errors.message}
                      </p>
                    )}
                  </div>

                  {/* Consent */}
                  <div className="contact__field contact__field--full">
                    <label
                      className={`contact__consent ${showError("consent") ? "has-error" : ""}`}
                    >
                      <input
                        ref={(el) => (fieldRefs.current.consent = el)}
                        type="checkbox"
                        checked={values.consent}
                        onChange={onChange("consent")}
                        onBlur={onBlur("consent")}
                        aria-invalid={showError("consent") ? "true" : "false"}
                        aria-describedby={
                          showError("consent") ? "err-consent" : undefined
                        }
                      />
                      <span>
                        {form?.consent ?? "J’accepte d’être recontacté(e)."}
                      </span>
                    </label>

                    {showError("consent") && (
                      <p className="contact__error" id="err-consent">
                        {errors.consent}
                      </p>
                    )}
                  </div>
                </div>

                <div className="contact__actions">
                  <button className="contact__btn" type="submit">
                    {submitLabel}
                  </button>

                  {emailMethod?.value && (
                    <a
                      className="contact__alt"
                      href={`mailto:${emailMethod.value}`}
                    >
                      Préférer un contact direct par email
                    </a>
                  )}

                  {responseTime && (
                    <p className="contact__hint">{responseTime}</p>
                  )}
                </div>
              </form>
            </div>
          </section>
        </div>

        <Signature type="emotional" variant="subtle" />
      </div>
    </>
  );
}
