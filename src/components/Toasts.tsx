"use client";

import { useEffect } from "react";
import { useOS, type Notification } from "@/lib/store";
import { AppIcons, APP_META } from "@/lib/apps";

function Toast({ n }: { n: Notification }) {
  const { dispatch } = useOS();
  useEffect(() => {
    const t = setTimeout(() => dispatch({ type: "TOAST_DONE", id: n.id }), 6000);
    return () => clearTimeout(t);
  }, [n.id, dispatch]);
  const Icon = n.icon ? AppIcons[APP_META[n.icon].icon] : null;
  return (
    <div className="flex w-[340px] max-w-[calc(100vw-24px)] gap-3 rounded-lg border border-line-strong bg-acrylic px-3.5 py-3 shadow-pop glass animate-toast-in">
      {Icon && <Icon className="h-7 w-7" />}
      <div className="min-w-0">
        <b className="block text-[13px] font-semibold">{n.title}</b>
        <p className="mt-0.5 text-xs text-fg-2">{n.body}</p>
      </div>
      <button type="button" onClick={() => dispatch({ type: "TOAST_DONE", id: n.id })} className="ml-auto self-start text-fg-3 hover:text-fg" aria-label="Dismiss">✕</button>
    </div>
  );
}

export default function Toasts() {
  const { state } = useOS();
  const live = state.notifications.filter((n) => n.toast);
  return (
    <div className="absolute right-3 bottom-[60px] z-55 flex flex-col gap-2">
      {live.map((n) => <Toast key={n.id} n={n} />)}
    </div>
  );
}
