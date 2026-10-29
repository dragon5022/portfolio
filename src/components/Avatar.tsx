"use client";

import { useState } from "react";
import { useOS, initials } from "@/lib/store";
import { asset } from "@/lib/paths";
import { Glyph } from "@/components/icons";

type Person = { name: string; avatar: string | null };

/** `person` defaults to the portfolio owner; pass the visitor's profile, or null for an anonymous placeholder */
export default function Avatar({ size = 40, className = "", person }: { size?: number; className?: string; person?: Person | null }) {
  const { state } = useOS();
  const p = person === undefined ? state.user : person;
  const [broken, setBroken] = useState<string | null>(null);
  return (
    <span
      className={`inline-grid shrink-0 place-items-center overflow-hidden rounded-full bg-linear-135 from-[#4cc2ff] to-[#7a5cff] font-bold text-white ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.38 }}
      aria-label={p?.name ?? "Guest"}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- remote GitHub avatars, any host */}
      {p?.avatar && broken !== p.avatar ? <img src={asset(p.avatar)} alt={p.name} onError={() => setBroken(p.avatar)} className="h-full w-full object-cover" />
        : p ? initials(p.name) : <Glyph.user style={{ width: "50%", height: "50%" }} />}
    </span>
  );
}
