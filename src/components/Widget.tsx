"use client";

import { useClock, fmtTime, fmtLongDate } from "@/lib/useClock";
import { Glyph } from "@/components/icons";
import { PORTFOLIO } from "@/data/portfolio";

const card = "rounded-xl border border-white/12 bg-[rgba(20,22,30,.45)] px-4 py-3.5 shadow-[0_8px_24px_rgba(0,0,0,.25)] glass-sm";

export default function Widget() {
  const now = useClock();
  return (
    <div className="absolute top-6 right-6 hidden w-60 flex-col gap-2.5 text-white md:flex">
      <div className={card}>
        <div className="text-[40px] font-semibold leading-none tracking-[-1px]">{fmtTime(now)}</div>
        <div className="mt-1.5 text-[13px] opacity-85">{fmtLongDate(now)}</div>
      </div>
      <div className={card}>
        <div className="flex items-center gap-2.5 text-[26px] font-semibold">
          <Glyph.sun className="text-[#ffd43b]" /> <span>24°</span>
        </div>
        <div className="mt-1 text-[13px] opacity-85">{PORTFOLIO.location}</div>
        <div className="mt-2.5 flex items-center gap-1.5 text-[11px] tracking-[.08em] uppercase opacity-90">
          <i className="h-2 w-2 rounded-full bg-[#6ccb5f] animate-pulse-dot" /> Open to work
        </div>
      </div>
    </div>
  );
}
