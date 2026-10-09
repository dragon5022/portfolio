"use client";

import dynamic from "next/dynamic";

/* The whole desktop depends on window size, localStorage and the clock,
   so it is rendered on the client only (avoids hydration mismatches). */
const OS = dynamic(() => import("@/components/OS"), {
  ssr: false,
  loading: () => <div className="fixed inset-0 bg-black" />,
});

export default function OSLoader() {
  return <OS />;
}
