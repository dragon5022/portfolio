"use client";

import type { ReactNode, AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";

/* Small shared UI primitives used across the apps (Fluent-ish) */

export const Card = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <div className={`rounded-lg border border-line bg-surface px-4 py-3.5 ${className}`}>{children}</div>
);

const btnBase = "inline-flex h-8 items-center gap-2 rounded px-3.5 text-[13px] font-medium no-underline transition-colors [&>svg]:text-[15px]";
const btnVariant = { default: "border border-line-strong bg-surface-2 text-fg hover:bg-surface-3", primary: "bg-accent text-accent-text hover:brightness-110" };

export function Btn({ variant = "default", className = "", ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: keyof typeof btnVariant }) {
  return <button type="button" className={`${btnBase} ${btnVariant[variant]} ${className}`} {...rest} />;
}
export function LinkBtn({ variant = "default", className = "", ...rest }: AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: keyof typeof btnVariant }) {
  return <a target="_blank" rel="noreferrer" className={`${btnBase} ${btnVariant[variant]} ${className}`} {...rest} />;
}

const CHIP: Record<string, string> = {
  java: "border-java/30 bg-java/15 text-[#ffb35c] [html[data-theme=light]_&]:text-[#a85a00]",
  python: "border-python-blue/35 bg-python-blue/18 text-[#7fb3ff] [html[data-theme=light]_&]:text-[#1f4e8c]",
  web: "border-[#4cc2ff]/35 bg-[#4cc2ff]/15 text-[#7fd4ff] [html[data-theme=light]_&]:text-[#0b5fa5]",
  game: "border-[#6ccb5f]/35 bg-[#6ccb5f]/15 text-[#8be07f] [html[data-theme=light]_&]:text-[#1f7a3c]",
  ai: "border-[#c084fc]/35 bg-[#c084fc]/15 text-[#d4a8ff] [html[data-theme=light]_&]:text-[#6d28d9]",
};

export const Chip = ({ children, lang }: { children: ReactNode; lang?: "java" | "python" | "web" | "game" | "ai" }) => {
  const cls = (lang && CHIP[lang]) || "border-line bg-surface-3 text-fg-2";
  return <span className={`inline-block rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${cls}`}>{children}</span>;
};

export const H2 = ({ children }: { children: ReactNode }) => <h2 className="mb-1 text-2xl font-semibold tracking-tight">{children}</h2>;
export const H3 = ({ children }: { children: ReactNode }) => <h3 className="mt-6 mb-2.5 text-[15px] font-semibold">{children}</h3>;
export const P = ({ children }: { children: ReactNode }) => <p className="mb-3 leading-relaxed text-fg-2">{children}</p>;
export const Page = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <div className={`selectable px-4 py-5 sm:px-7 sm:py-6 ${className}`}>{children}</div>
);
