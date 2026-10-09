"use client";

import { useState, type FormEvent } from "react";
import { PORTFOLIO } from "@/data/portfolio";
import { useOS } from "@/lib/store";
import { AppIcons, Glyph } from "@/components/icons";
import { Btn, H2, P, Page } from "./ui";

const field = "w-full rounded border border-line-strong border-b-fg-3 bg-surface px-2.5 py-2 text-fg outline-none focus:border-b-2 focus:border-b-accent";

export default function Contact() {
  const { notify, dispatch } = useOS();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const body = `${form.message}\n\n— ${form.name} (${form.email})`;
    window.location.href = `mailto:${PORTFOLIO.email}?subject=${encodeURIComponent(form.subject || "Hello from your portfolio")}&body=${encodeURIComponent(body)}`;
    setSent(true);
    notify("Mail client opened", "Your message draft is ready to send.", "contact");
  };

  const links = [
    { label: "Email", sub: PORTFOLIO.email, href: `mailto:${PORTFOLIO.email}`, icon: <Glyph.mail className="text-xl text-accent" /> },
    { label: "WhatsApp", sub: PORTFOLIO.whatsappDisplay, href: `https://wa.me/${PORTFOLIO.whatsapp.replace(/\D/g, "")}`, icon: <AppIcons.whatsapp className="h-5 w-5" /> },
    { label: "GitHub", sub: PORTFOLIO.github.replace("https://", ""), href: PORTFOLIO.github, icon: <AppIcons.github className="h-5 w-5" /> },
    ...(PORTFOLIO.linkedin ? [{ label: "LinkedIn", sub: PORTFOLIO.linkedin.replace("https://www.", ""), href: PORTFOLIO.linkedin, icon: <AppIcons.linkedin className="h-5 w-5" /> }] : []),
  ];

  return (
    <Page>
      <H2>Let&apos;s talk</H2>
      <P>Open to full-stack and backend roles, contract work, game and app projects, and AI tooling. Email or WhatsApp me and I usually reply within a day.</P>
      <div className="grid gap-5 md:grid-cols-[1fr_260px]">
        <form onSubmit={submit}>
          <div className="grid gap-x-3 sm:grid-cols-2">
            <label className="mt-3 mb-1.5 block text-xs text-fg-2">Your name<input required value={form.name} onChange={set("name")} className={`${field} mt-1.5`} /></label>
            <label className="mt-3 mb-1.5 block text-xs text-fg-2">Your email<input required type="email" value={form.email} onChange={set("email")} className={`${field} mt-1.5`} /></label>
          </div>
          <label className="mt-3 mb-1.5 block text-xs text-fg-2">Subject<input value={form.subject} onChange={set("subject")} placeholder="Job opportunity, collaboration, hello…" className={`${field} mt-1.5 placeholder:text-fg-3`} /></label>
          <label className="mt-3 mb-1.5 block text-xs text-fg-2">Message<textarea required value={form.message} onChange={set("message")} className={`${field} mt-1.5 min-h-[130px] resize-y`} /></label>
          <div className="mt-4 flex items-center gap-3">
            <Btn type="submit" variant="primary"><Glyph.send /> Send message</Btn>
            <span className="text-xs text-fg-3">Opens your mail client</span>
          </div>
          {sent && <div className="mt-3.5 rounded-lg border border-[rgba(108,203,95,.35)] bg-[rgba(108,203,95,.12)] px-3.5 py-3 text-[13px]">Thanks! If your mail app didn&apos;t open, write to {PORTFOLIO.email} directly.</div>}
        </form>
        <div>
          {links.map((l) => (
            <a key={l.label} href={l.href} target="_blank" rel="noreferrer" className="mb-2 flex items-center gap-3 rounded-lg border border-line bg-surface px-3 py-2.5 text-fg hover:bg-surface-2">
              {l.icon}<span><span className="block text-[13px]">{l.label}</span><small className="text-[11px] text-fg-3">{l.sub}</small></span>
            </a>
          ))}
          <button type="button" onClick={() => dispatch({ type: "GUESTBOOK", open: true })} className="mb-2 flex w-full items-center gap-3 rounded-lg border border-line bg-surface px-3 py-2.5 text-left text-fg hover:bg-surface-2">
            <AppIcons.guestbook className="h-5 w-5" /><span><span className="block text-[13px]">Guestbook</span><small className="text-[11px] text-fg-3">Leave a public review or message</small></span>
          </button>
          <div className="mt-4 rounded-lg border border-line bg-surface px-3.5 py-3 text-xs text-fg-2">
            <b className="mb-1 block text-fg">{PORTFOLIO.location}</b>Available for remote work in any time zone. Fastest reply on WhatsApp.
          </div>
        </div>
      </div>
    </Page>
  );
}
