import ReactGA from "react-ga4";

const GA_MEASUREMENT_ID = "G-NC0WNJEG3M";

export function initAnalytics() {
  ReactGA.initialize(GA_MEASUREMENT_ID);
}

export function trackPageView(path) {
  ReactGA.send({
    hitType: "pageview",
    page: path,
  });
}

export function trackEvent(action, category = "Engagement", label = "") {
  ReactGA.event({
    category,
    action,
    label,
  });
}