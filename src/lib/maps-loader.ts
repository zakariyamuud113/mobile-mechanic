/// <reference types="google.maps" />
import { getMapsApiKey } from "./maps.functions";

declare global {
  interface Window {
    google: typeof google;
  }
}

let loadPromise: Promise<typeof google> | null = null;

/** Loads the Google Maps JS SDK once, fetching the key from the server. */
export function loadGoogleMaps(): Promise<typeof google> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Google Maps can only load in the browser"));
  }
  if (window.google?.maps) return Promise.resolve(window.google);
  if (loadPromise) return loadPromise;

  loadPromise = (async () => {
    const { key } = await getMapsApiKey();
    if (!key) throw new Error("Missing Google Maps API key");

    await new Promise<void>((resolve, reject) => {
      const existing = document.getElementById("google-maps-sdk");
      if (existing) {
        existing.addEventListener("load", () => resolve());
        existing.addEventListener("error", () => reject(new Error("Maps SDK failed")));
        return;
      }
      const script = document.createElement("script");
      script.id = "google-maps-sdk";
      script.async = true;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=marker`;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Maps SDK failed to load"));
      document.head.appendChild(script);
    });

    return window.google;
  })();

  return loadPromise;
}
