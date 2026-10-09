import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;

/* Colourful app icons (filled artwork, Fluent-inspired) */
const art = (inner: string) =>
  function ArtIcon(props: P) {
    return <svg viewBox="0 0 48 48" aria-hidden="true" {...props} dangerouslySetInnerHTML={{ __html: inner }} />;
  };

/* Mono UI glyphs (stroke artwork, Feather-style) */
const glyph = (inner: string) =>
  function GlyphIcon({ className = "", ...props }: P) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className={`stroke-icon ${className}`} {...props} dangerouslySetInnerHTML={{ __html: inner }} />
    );
  };

export const AppIcons = {
  about: art(`<defs><linearGradient id="g-about" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5eb0ff"/><stop offset="1" stop-color="#1a6fd6"/></linearGradient></defs><rect x="6" y="6" width="36" height="36" rx="10" fill="url(#g-about)"/><circle cx="24" cy="19" r="6.5" fill="#fff"/><path d="M12.5 37c1.5-6.5 6-10 11.5-10s10 3.5 11.5 10z" fill="#fff" opacity=".95"/>`),
  projects: art(`<defs><linearGradient id="g-fold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd76a"/><stop offset="1" stop-color="#f4b31c"/></linearGradient></defs><path d="M4 12a4 4 0 0 1 4-4h11l4 4h17a4 4 0 0 1 4 4v3H4z" fill="#e0a416"/><rect x="4" y="16" width="40" height="24" rx="4" fill="url(#g-fold)"/><path d="M14 30h20" stroke="#8a5d00" stroke-width="2.5" stroke-linecap="round" opacity=".55"/><path d="M14 35h12" stroke="#8a5d00" stroke-width="2.5" stroke-linecap="round" opacity=".55"/>`),
  skills: art(`<defs><linearGradient id="g-sk" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#b98cff"/><stop offset="1" stop-color="#6a3fd9"/></linearGradient></defs><rect x="6" y="6" width="36" height="36" rx="10" fill="url(#g-sk)"/><path d="M14 31V19M22 31V15M30 31V22" stroke="#fff" stroke-width="4" stroke-linecap="round"/><path d="M12 36h24" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".7"/>`),
  terminal: art(`<rect x="4" y="8" width="40" height="32" rx="6" fill="#1b1b1f"/><rect x="4.75" y="8.75" width="38.5" height="30.5" rx="5.5" fill="none" stroke="#3a3a44" stroke-width="1.5"/><path d="M13 18l7 6-7 6" stroke="#4cc2ff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M23 30h11" stroke="#ddd" stroke-width="3" stroke-linecap="round"/>`),
  vscode: art(`<path d="M34 4l9 4.3v31.4L34 44 15 27.6l-7.3 5.6L4 31.3V16.7l3.7-1.9L15 20.4z" fill="#2489ca"/><path d="M34 4l9 4.3v31.4L34 44V4z" fill="#1f9cf0"/><path d="M34 13.5v21L21.8 24z" fill="#0f6cb8" opacity=".55"/><path d="M15 20.4L34 4v9.5L21.8 24 34 34.5V44L15 27.6z" fill="#3caeff" opacity=".85"/>`),
  resume: art(`<path d="M10 6h20l10 10v26a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" fill="#f3f4f6"/><path d="M30 6l10 10H32a2 2 0 0 1-2-2z" fill="#c9ccd3"/><rect x="13" y="22" width="22" height="2.6" rx="1.3" fill="#d13438"/><rect x="13" y="28" width="22" height="2.6" rx="1.3" fill="#9aa0a6"/><rect x="13" y="34" width="14" height="2.6" rx="1.3" fill="#9aa0a6"/>`),
  contact: art(`<defs><linearGradient id="g-mail" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#37c6ff"/><stop offset="1" stop-color="#0a6fd8"/></linearGradient></defs><rect x="4" y="10" width="40" height="28" rx="6" fill="url(#g-mail)"/><path d="M8 15l16 12 16-12" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`),
  settings: art(`<circle cx="24" cy="24" r="18" fill="#6e6e78"/><circle cx="24" cy="24" r="7" fill="#e6e6ec"/><g stroke="#e6e6ec" stroke-width="5" stroke-linecap="round"><path d="M24 4v6M24 38v6M4 24h6M38 24h6M9.9 9.9l4.2 4.2M33.9 33.9l4.2 4.2M9.9 38.1l4.2-4.2M33.9 14.1l4.2-4.2"/></g>`),
  explorer: art(`<path d="M4 12a4 4 0 0 1 4-4h11l4 4h17a4 4 0 0 1 4 4v3H4z" fill="#e0a416"/><rect x="4" y="16" width="40" height="24" rx="4" fill="#ffd05a"/><rect x="8" y="20" width="32" height="16" rx="2" fill="#fff" opacity=".35"/>`),
  edge: art(`<defs><linearGradient id="g-edge" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#38d0a8"/><stop offset="1" stop-color="#0c74d8"/></linearGradient></defs><circle cx="24" cy="24" r="19" fill="url(#g-edge)"/><path d="M12 26c1-8 7-12 13-12 7 0 11 4 11 9 0 3-2 4-5 4H21c0 4 4 7 10 7 3 0 5-.7 6-1.4C34 37 29 40 23 40c-7 0-11-5-11-14z" fill="#fff" opacity=".9"/>`),
  notepad: art(`<rect x="9" y="5" width="30" height="38" rx="3" fill="#f7f7f9"/><path d="M9 8a3 3 0 0 1 3-3h24a3 3 0 0 1 3 3v4H9z" fill="#3f8fe0"/><path d="M15 20h18M15 26h18M15 32h12" stroke="#5c6470" stroke-width="2.5" stroke-linecap="round"/>`),
  java: art(`<path d="M17 33c-4 1-2 3 0 3.3 6 1 15 .6 18-1.6-2 .8-8 1.2-12 .6" fill="#5382a1"/><path d="M19 28.5c-3.5.9-1.8 2.7.2 3 5 .8 11 .5 13.5-1.4-2 .7-6.8 1.1-10.5.5" fill="#5382a1"/><path d="M26 6c3 3 3 6-1 9.5-3.5 3-4 5-1.5 8-4-2.7-4.3-6.3-.6-9.6C26 11 27.5 9 26 6z" fill="#f89820"/><path d="M31 12c2 2.2.6 4.5-2.4 7-2.3 1.9-3 3.2-2 5.3-2.6-2.2-2-4.4.6-6.7C30 15.3 31.6 14 31 12z" fill="#f89820"/><path d="M14 38c-3 1.4-1.4 3 3.6 3.7 8 1.1 18 .8 22-2-4 1.2-11 1.7-17 1.2-3.2-.3-5.3-.9-8.6-2.9z" fill="#5382a1"/><path d="M35 27c4-1.6 6.5 1.6 3 4-2 1.5-5 2-7.6 2.2 3-.6 5.7-1.8 5.8-3.4.1-1.2-1.2-1.6-1.2-2.8z" fill="#5382a1"/>`),
  python: art(`<path d="M23.6 4c-9.4 0-8.8 4.1-8.8 4.1v4.2h9v1.3H11.3S5 12.9 5 22.7s5.5 9.5 5.5 9.5h3.3v-4.6s-.2-5.5 5.4-5.5h8.9s5.3.1 5.3-5.1V8.5S34.2 4 23.6 4zm-4.9 2.9a1.6 1.6 0 1 1 0 3.3 1.6 1.6 0 0 1 0-3.3z" fill="#3b78c4"/><path d="M24.4 44c9.4 0 8.8-4.1 8.8-4.1v-4.2h-9v-1.3h12.5S43 35.1 43 25.3s-5.5-9.5-5.5-9.5h-3.3v4.6s.2 5.5-5.4 5.5h-8.9s-5.3-.1-5.3 5.1v8.5S13.8 44 24.4 44zm4.9-2.9a1.6 1.6 0 1 1 0-3.3 1.6 1.6 0 0 1 0 3.3z" fill="#ffd43b"/>`),
  portfolio: art(`<defs><linearGradient id="g-pf" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff9a5c"/><stop offset="1" stop-color="#e0407a"/></linearGradient></defs><rect x="5" y="9" width="38" height="30" rx="6" fill="url(#g-pf)"/><rect x="9" y="13" width="30" height="18" rx="3" fill="#fff" opacity=".92"/><path d="M12 29l7-8 5 5 4-4 7 7z" fill="#e0407a" opacity=".85"/><circle cx="31" cy="18" r="2.5" fill="#ff9a5c"/><rect x="18" y="35" width="12" height="2.5" rx="1.2" fill="#fff" opacity=".8"/>`),
  web: art(`<defs><linearGradient id="g-web" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4cc2ff"/><stop offset="1" stop-color="#2a5bd7"/></linearGradient></defs><circle cx="24" cy="24" r="18" fill="url(#g-web)"/><g fill="none" stroke="#fff" stroke-width="2" opacity=".9"><circle cx="24" cy="24" r="18"/><ellipse cx="24" cy="24" rx="8" ry="18"/><path d="M6 24h36M9 15h30M9 33h30"/></g>`),
  game: art(`<defs><linearGradient id="g-game" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6ccb5f"/><stop offset="1" stop-color="#1f8a4c"/></linearGradient></defs><path d="M14 14h20a10 10 0 0 1 10 10v2a9 9 0 0 1-15.5 6.2L26 30h-4l-2.5 2.2A9 9 0 0 1 4 26v-2a10 10 0 0 1 10-10z" fill="url(#g-game)"/><path d="M13 20v8M9 24h8" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/><circle cx="33" cy="21" r="2" fill="#fff"/><circle cx="37" cy="25" r="2" fill="#fff"/><circle cx="29" cy="25" r="2" fill="#fff"/><circle cx="33" cy="29" r="2" fill="#fff"/>`),
  ai: art(`<defs><linearGradient id="g-ai" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#c084fc"/><stop offset="1" stop-color="#6d28d9"/></linearGradient></defs><rect x="6" y="6" width="36" height="36" rx="10" fill="url(#g-ai)"/><path d="M24 11l2.6 7.4L34 21l-7.4 2.6L24 31l-2.6-7.4L14 21l7.4-2.6z" fill="#fff"/><path d="M33 29l1.3 3.7L38 34l-3.7 1.3L33 39l-1.3-3.7L28 34l3.7-1.3z" fill="#fff" opacity=".85"/><path d="M14 30l.9 2.1L17 33l-2.1.9L14 36l-.9-2.1L11 33l2.1-.9z" fill="#fff" opacity=".7"/>`),
  whatsapp: art(`<circle cx="24" cy="24" r="20" fill="#25d366"/><path d="M24 11.5a12.5 12.5 0 0 0-10.8 18.8L11.5 36.5l6.4-1.7A12.5 12.5 0 1 0 24 11.5z" fill="#fff"/><path d="M24 14a10 10 0 0 0-8.5 15.3l.3.4-1 3.8 3.9-1 .4.2A10 10 0 1 0 24 14z" fill="#25d366"/><path d="M19.6 19.3c.3-.6.6-.6.9-.6h.7c.2 0 .5 0 .8.6.3.7 1 2.4 1.1 2.6.1.2.2.4 0 .6l-.5.7-.4.5c-.2.1-.3.3-.1.6.2.3.9 1.5 1.9 2.4 1.3 1.2 2.4 1.6 2.8 1.8.3.2.5.1.7-.1l1-1.2c.2-.3.4-.3.7-.2l2.5 1.2c.3.1.5.2.6.4.1.2.1 1-.2 1.8-.3.9-1.8 1.7-2.5 1.8-.6.1-1.4.1-2.3-.2-.5-.2-1.2-.4-2.1-.8-3.7-1.6-6.1-5.3-6.3-5.6-.2-.3-1.5-2-1.5-3.8s.9-2.7 1.3-3.1z" fill="#fff"/>`),
  guestbook: art(`<defs><linearGradient id="g-gb" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffd76a"/><stop offset="1" stop-color="#f0763b"/></linearGradient></defs><path d="M8 10a4 4 0 0 1 4-4h24a4 4 0 0 1 4 4v20a4 4 0 0 1-4 4H20l-8 7v-7h0a4 4 0 0 1-4-4z" fill="url(#g-gb)"/><path d="M15 16h18M15 22h12" stroke="#fff" stroke-width="2.6" stroke-linecap="round" opacity=".95"/><path d="M33 26l1.3 2.7 3 .4-2.2 2.1.5 3-2.6-1.4-2.6 1.4.5-3-2.2-2.1 3-.4z" fill="#fff"/>`),
  github: art(`<circle cx="24" cy="24" r="20" fill="#24292f"/><path transform="translate(12 12) scale(1)" fill="#fff" d="M12 .5A12 12 0 0 0 8.2 23.9c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.4-4-1.4-.6-1.4-1.4-1.8-1.4-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.7 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .5z"/>`),
  linkedin: art(`<rect x="4" y="4" width="40" height="40" rx="8" fill="#0a66c2"/><path fill="#fff" d="M16.5 20h5v16h-5zM19 12.5a2.9 2.9 0 1 1 0 5.8 2.9 2.9 0 0 1 0-5.8zM24.5 20h4.8v2.2c.7-1.3 2.4-2.6 4.9-2.6 5.2 0 6.2 3.4 6.2 7.9V36h-5v-7.6c0-1.8 0-4.2-2.6-4.2s-3 2-3 4v7.8h-5z"/>`),
};

export type AppIconName = keyof typeof AppIcons;

export const Glyph = {
  search: glyph(`<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>`),
  chevronRight: glyph(`<polyline points="9 18 15 12 9 6"/>`),
  chevronDown: glyph(`<polyline points="6 9 12 15 18 9"/>`),
  chevronUp: glyph(`<polyline points="18 15 12 9 6 15"/>`),
  power: glyph(`<path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/>`),
  globe: glyph(`<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>`),
  arrowRight: glyph(`<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>`),
  arrowLeft: glyph(`<line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>`),
  arrowUp: glyph(`<line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/>`),
  refresh: glyph(`<polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>`),
  sun: glyph(`<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>`),
  moon: glyph(`<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>`),
  wifi: glyph(`<path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01"/>`),
  bluetooth: glyph(`<path d="M6.5 6.5l11 11L12 23V1l5.5 5.5-11 11"/>`),
  plane: glyph(`<path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>`),
  focus: glyph(`<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>`),
  battery: glyph(`<rect x="2" y="7" width="18" height="10" rx="2"/><line x1="22" y1="11" x2="22" y2="13"/><rect x="4" y="9" width="14" height="6" rx="1" fill="currentColor" stroke="none"/>`),
  volume: glyph(`<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>`),
  bell: glyph(`<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"/>`),
  taskview: glyph(`<rect x="3" y="5" width="12" height="10" rx="1.5"/><path d="M9 19h12V9"/>`),
  gear: glyph(`<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>`),
  mail: glyph(`<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 6l-10 7L2 6"/>`),
  pin: glyph(`<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>`),
  external: glyph(`<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>`),
  download: glyph(`<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>`),
  printer: glyph(`<polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>`),
  home: glyph(`<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>`),
  star: glyph(`<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>`),
  file: glyph(`<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>`),
  files: glyph(`<path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/>`),
  gitBranch: glyph(`<line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/>`),
  bug: glyph(`<path d="M8 2l1.88 1.88M14.12 3.88 16 2M9 7.13v-1a3.003 3.003 0 1 1 6 0v1"/><path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6z"/><path d="M12 20v-9M6.53 9C4.6 8.8 3 7.1 3 5M6 13H2M3 21c0-2.1 1.7-3.9 3.8-4M20.97 5c0 2.1-1.6 3.8-3.5 4M22 13h-4M17.2 17c2.1.1 3.8 1.9 3.8 4"/>`),
  blocks: glyph(`<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>`),
  check: glyph(`<polyline points="20 6 9 17 4 12"/>`),
  send: glyph(`<line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>`),
  briefcase: glyph(`<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>`),
  grad: glyph(`<path d="M22 10L12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>`),
  palette: glyph(`<circle cx="13.5" cy="6.5" r="1.5"/><circle cx="17.5" cy="10.5" r="1.5"/><circle cx="8.5" cy="7.5" r="1.5"/><circle cx="6.5" cy="12.5" r="1.5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.9 0 1.7-.7 1.7-1.7 0-.4-.2-.8-.4-1.1-.3-.3-.4-.7-.4-1.1 0-.9.7-1.7 1.7-1.7H16c3.3 0 6-2.7 6-6 0-4.9-4.5-8.4-10-8.4z"/>`),
  monitor: glyph(`<rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>`),
  user: glyph(`<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>`),
  info: glyph(`<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>`),
  grid: glyph(`<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>`),
  list: glyph(`<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>`),
  x: glyph(`<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>`),
  plus: glyph(`<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>`),
  lock: glyph(`<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>`),
  more: glyph(`<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>`),
  monitorOff: glyph(`<path d="M17 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10M8 21h8M12 17v4"/>`),
};

/* Window caption glyphs */
export const Caption = {
  minimize: glyph(`<line x1="5" y1="12" x2="19" y2="12"/>`),
  maximize: glyph(`<rect x="4" y="4" width="16" height="16" rx="2"/>`),
  restore: glyph(`<rect x="3" y="7" width="14" height="14" rx="2"/><path d="M7 7V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-2"/>`),
  close: glyph(`<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>`),
};

export const WindowsLogo = (props: P) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <rect x="3" y="3" width="8.5" height="8.5" rx="1" /><rect x="12.5" y="3" width="8.5" height="8.5" rx="1" />
    <rect x="3" y="12.5" width="8.5" height="8.5" rx="1" /><rect x="12.5" y="12.5" width="8.5" height="8.5" rx="1" />
  </svg>
);
