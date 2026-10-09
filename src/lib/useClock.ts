"use client";

import { useEffect, useState } from "react";

export function useClock(intervalMs = 1000) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(t);
  }, [intervalMs]);
  return now;
}

export const fmtTime = (d: Date) => d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
export const fmtLongDate = (d: Date) => d.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" });
export const fmtShortDate = (d: Date) => d.toLocaleDateString([], { year: "numeric", month: "numeric", day: "numeric" });
