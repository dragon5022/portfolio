"use client";

import { useEffect } from "react";
import { OSProvider, useOS } from "@/lib/store";
import BootScreen from "@/components/BootScreen";
import LockScreen from "@/components/LockScreen";
import Desktop from "@/components/Desktop";
import { ShutdownScreen, BsodScreen } from "@/components/SystemScreens";

function Shell() {
  const { state, dispatch } = useOS();
  const { phase } = state;

  useEffect(() => {
    if (phase === "boot") {
      const t = setTimeout(() => dispatch({ type: "PHASE", phase: "lock" }), 2600);
      return () => clearTimeout(t);
    }
    if (phase === "restart") {
      const t = setTimeout(() => dispatch({ type: "PHASE", phase: "boot" }), 2200);
      return () => clearTimeout(t);
    }
  }, [phase, dispatch]);

  switch (phase) {
    case "boot": return <BootScreen />;
    case "lock": return <LockScreen />;
    case "desktop": return <Desktop />;
    case "shutdown": return <ShutdownScreen mode="shutdown" />;
    case "restart": return <ShutdownScreen mode="restart" />;
    case "bsod": return <BsodScreen />;
  }
}

export default function OS() {
  return (
    <OSProvider>
      <Shell />
    </OSProvider>
  );
}
