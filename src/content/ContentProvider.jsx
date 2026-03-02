import { createContext, useContext, useCallback, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";

const ContentContext = createContext(null);

export function ContentProvider({ children }) {
  const [content, setContent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async (signal) => {
    try {
      setIsLoading(true);
      setError(null);

      const cacheMode = import.meta.env.DEV ? "no-store" : "default";

      const res = await fetch("/content.json", { cache: cacheMode, signal });
      if (!res.ok) {
        throw new Error(`Impossible de charger /content.json (${res.status})`);
      }
      const data = await res.json();
      setContent(data);
    } catch (e) {
      // AbortError = normal quand on démonte
      if (e?.name !== "AbortError") setError(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
  }, [load]);

  const reload = useCallback(() => {
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
  }, [load]);

  const value = useMemo(
    () => ({ content, isLoading, error, reload }),
    [content, isLoading, error, reload]
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

ContentProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useRawContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useRawContent doit être utilisé dans ContentProvider");
  return ctx;
}