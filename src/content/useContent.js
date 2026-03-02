import { useMemo } from "react";
import { useRawContent } from "./ContentProvider";
import { getByProfile } from "./getByProfile";
import { useProfile } from "../context/profile/ProfileContext";

function deepGet(obj, path) {
  if (!obj || !path) return undefined;

  // support: a.b[0].c  => a.b.0.c
  const normalized = String(path).replace(/\[(\d+)\]/g, ".$1");
  return normalized.split(".").reduce((acc, key) => (acc ? acc[key] : undefined), obj);
}

export function useContent() {
  const { content, isLoading, error, reload } = useRawContent();
  const { profile } = useProfile();

  const api = useMemo(() => {
    function t(path, fallback = "") {
      const raw = deepGet(content, path);
      const val = getByProfile(raw, profile);
      return val == null ? fallback : val;
    }

    function node(path) {
      const raw = deepGet(content, path);
      return getByProfile(raw, profile);
    }

    function list(path) {
      const val = node(path);
      return Array.isArray(val) ? val : [];
    }

    return { t, node, list, profile, content, isLoading, error, reload };
  }, [content, profile, isLoading, error, reload]);

  return api;
}