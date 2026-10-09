/* Base-path aware URLs. On GitHub Pages the site lives under /<repo>, so every
   absolute asset path and the API URL must be prefixed. */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** prefix a public asset path, e.g. asset("/avatar.png") */
export const asset = (p: string) => (p.startsWith("/") ? `${BASE_PATH}${p}` : p);

/** guestbook endpoint: an external API (e.g. a Vercel deployment of this repo) or the local route */
export const GUESTBOOK_API = process.env.NEXT_PUBLIC_GUESTBOOK_API || `${BASE_PATH}/api/guestbook`;
