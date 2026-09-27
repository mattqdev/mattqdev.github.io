"use client";
// hooks/useUrlState.js
// Mirrors a piece of UI state into a query param so filters/tabs are
// shareable. Uses window.location + history.replaceState instead of
// useSearchParams, which would need a Suspense boundary under static export.
import { useCallback, useEffect, useState } from "react";

export function useUrlState(key, defaultValue) {
  const [value, setValue] = useState(defaultValue);

  // Read the initial value after mount so the prerendered HTML (default
  // value) matches the first client render.
  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get(key);
    if (fromUrl != null) setValue(fromUrl);
  }, [key]);

  const update = useCallback(
    (next) => {
      setValue(next);
      const url = new URL(window.location.href);
      if (next == null || next === "" || next === defaultValue) {
        url.searchParams.delete(key);
      } else {
        url.searchParams.set(key, next);
      }
      window.history.replaceState(window.history.state, "", url);
    },
    [key, defaultValue]
  );

  return [value, update];
}
