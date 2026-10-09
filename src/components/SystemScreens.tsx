"use client";

import { useEffect, useState } from "react";
import { useOS } from "@/lib/store";
import { Spinner } from "@/components/BootScreen";
import { Glyph } from "@/components/icons";

export function ShutdownScreen({ mode }: { mode: "shutdown" | "restart" }) {
  const { dispatch } = useOS();
  const [off, setOff] = useState(false);
  useEffect(() => {
    if (mode !== "shutdown") return;
    const t = setTimeout(() => setOff(true), 2200);
    return () => clearTimeout(t);
  }, [mode]);

  if (off) {
    return (
      <button type="button" onClick={() => dispatch({ type: "PHASE", phase: "boot" })} className="fixed inset-0 z-200 flex flex-col items-center justify-center gap-4 bg-black text-white/40 hover:text-white/80">
        <Glyph.power className="text-4xl" />
        <span className="text-sm">Click anywhere to power on</span>
      </button>
    );
  }
  return (
    <div className="fixed inset-0 z-200 flex flex-col items-center justify-center gap-8 bg-black text-[15px] text-white">
      <Spinner />
      <p>{mode === "restart" ? "Restarting…" : "Shutting down…"}</p>
    </div>
  );
}

export function BsodScreen() {
  const { dispatch } = useOS();
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setPct((p) => Math.min(100, p + Math.ceil(Math.random() * 9))), 180);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    if (pct >= 100) {
      const t = setTimeout(() => { dispatch({ type: "CLOSE_ALL" }); dispatch({ type: "PHASE", phase: "restart" }); }, 800);
      return () => clearTimeout(t);
    }
  }, [pct, dispatch]);

  return (
    <div className="fixed inset-0 z-200 grid place-items-center bg-[#0078d7] p-5 text-white">
      <div className="max-w-[760px] text-lg leading-relaxed">
        <div className="mb-5 text-[120px] font-light leading-none">:(</div>
        <p>Your portfolio ran into a problem and needs to restart. We&apos;re just collecting some error info, and then we&apos;ll restart for you.</p>
        <p className="mt-4">{pct}% complete</p>
        <div className="mt-8 flex gap-5 text-[13px]">
          <div className="h-24 w-24 shrink-0 bg-white [background-image:repeating-linear-gradient(90deg,#000_0_8px,transparent_8px_16px),repeating-linear-gradient(0deg,#000_0_8px,transparent_8px_16px)] [background-blend-mode:difference] opacity-90" />
          <div>
            <p>For more information about this issue and possible fixes, open the Contact app after restart.</p>
            <p className="mt-2 text-xs opacity-85">If you call a support person, give them this info:<br />Stop code: DEVELOPER_TOO_AWESOME<br />What failed: CoffeeOverflow.sys</p>
          </div>
        </div>
      </div>
    </div>
  );
}
