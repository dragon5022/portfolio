"use client";

import { useEffect, useRef, useState } from "react";
import { useOS } from "@/lib/store";
import { useClock, fmtTime, fmtLongDate } from "@/lib/useClock";
import { Glyph } from "@/components/icons";
import { PORTFOLIO } from "@/data/portfolio";
import Avatar from "@/components/Avatar";

type Stage = "clock" | "signin" | "unlocking";

export default function LockScreen() {
  const { state, dispatch, notify } = useOS();
  const now = useClock();
  const [stage, setStage] = useState<Stage>("clock");
  const unlocking = useRef(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  const unlock = () => {
    if (unlocking.current) return;
    unlocking.current = true;
    setStage("unlocking");
    setTimeout(() => {
      dispatch({ type: "PHASE", phase: "desktop" });
      setTimeout(() => notify("Welcome to my desktop", "Double-click an icon or open the Start menu. Try typing `help` in Terminal.", "about"), 900);
    }, 550);
  };

  /* first key / click reveals the sign-in card; Enter on the card unlocks */
  useEffect(() => {
    if (stage === "unlocking") return;
    const onKey = (e: KeyboardEvent) => {
      if (stage === "clock") setStage("signin");
      else if (e.key === "Enter") unlock();
    };
    const onPointer = () => { if (stage === "clock") setStage("signin"); };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointer);
    return () => { window.removeEventListener("keydown", onKey); window.removeEventListener("pointerdown", onPointer); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  /* focus the button only once the card is visible, after the revealing key event has finished */
  useEffect(() => {
    if (stage !== "signin") return;
    const t = setTimeout(() => btnRef.current?.focus(), 150);
    return () => clearTimeout(t);
  }, [stage]);

  const blur = stage !== "clock";

  return (
    <div className="fixed inset-0 z-90 grid grid-rows-[auto_1fr_auto] overflow-hidden p-6 text-white md:p-7">
      <div className={`wp-${state.wallpaper} absolute inset-0 -z-10 transition-[filter,transform] duration-500 ${blur ? "scale-[1.06] blur-2xl brightness-[.55]" : ""}`} />

      <div className="flex items-center justify-between text-[13px] font-medium opacity-90">
        <span>{PORTFOLIO.location}</span>
        <span className="flex gap-3.5 text-base"><Glyph.globe /><Glyph.power /></span>
      </div>

      {/* clock */}
      <div className={`self-end pb-[6vh] transition-all duration-500 ${blur ? "pointer-events-none -translate-y-10 opacity-0" : ""}`}>
        <div className="text-[clamp(64px,11vw,120px)] font-semibold leading-none tracking-[-2px] [text-shadow:0_4px_30px_rgba(0,0,0,.4)]">{fmtTime(now)}</div>
        <div className="mt-2.5 text-[clamp(18px,3vw,32px)] font-medium [text-shadow:0_2px_20px_rgba(0,0,0,.4)]">{fmtLongDate(now)}</div>
      </div>

      {/* sign-in card: always the portfolio owner */}
      <div className={`absolute inset-0 flex flex-col items-center justify-center text-center transition-opacity duration-300 ${stage === "signin" ? "opacity-100" : "pointer-events-none opacity-0"}`}>
        <Avatar size={112} className="shadow-[0_8px_30px_rgba(0,0,0,.4)] text-4xl" />
        <h1 className="mt-4 mb-1 text-3xl font-semibold">{PORTFOLIO.name}</h1>
        <p className="mb-6 opacity-80">@{PORTFOLIO.handle} · {PORTFOLIO.title}</p>
        <button
          type="button" ref={btnRef} onClick={unlock}
          className="inline-flex h-10 items-center gap-2 rounded bg-white/22 px-5 text-sm font-medium backdrop-blur-sm hover:bg-white/32 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
        >
          Sign in <Glyph.arrowRight />
        </button>
        <p className="mt-3 text-xs opacity-70">or press Enter</p>
      </div>

      <div className={`justify-self-center text-center text-[13px] opacity-85 animate-bob transition-opacity ${blur ? "opacity-0" : ""}`}>
        <Glyph.chevronDown className="mx-auto text-xl" />
        <p className="mt-0.5">Press Enter to sign in</p>
      </div>
    </div>
  );
}
