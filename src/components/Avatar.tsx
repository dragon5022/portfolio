"use client";

import { useOS } from "@/lib/store";
import { asset } from "@/lib/paths";

export default function Avatar({ size = 40, className = "" }: { size?: number; className?: string }) {
  const { state, initials } = useOS();
  const { avatar, name } = state.user;
  return (
    <span
      className={`inline-grid shrink-0 place-items-center overflow-hidden rounded-full bg-linear-135 from-[#4cc2ff] to-[#7a5cff] font-bold text-white ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.38 }}
      aria-label={name}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- remote GitHub avatars, any host */}
      {avatar ? <img src={asset(avatar)} alt={name} className="h-full w-full object-cover" /> : initials}
    </span>
  );
}
