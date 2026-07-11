import { createServerFn } from "@tanstack/react-start";

/**
 * Returns the Google Maps browser API key.
 * The key lives in a server-side secret and is handed to the client only at
 * runtime so the Maps JS SDK can load. (Maps keys are inherently public once
 * the map renders; restrict it by referrer/domain in the Google console.)
 */
export const getMapsApiKey = createServerFn({ method: "GET" }).handler(async () => {
  return { key: process.env.GOOGLE_API_KEY ?? "" };
});
