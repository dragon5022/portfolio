"use client";

import { PORTFOLIO, LANG_META } from "@/data/portfolio";
import { useOS } from "@/lib/store";
import { AppIcons, Glyph } from "@/components/icons";
import Avatar from "@/components/Avatar";
import { Btn, Card, Chip, H2, H3, LinkBtn, P, Page } from "./ui";

export default function About() {
  const { state, openApp } = useOS();
  const count = (lang: keyof typeof LANG_META) => PORTFOLIO.projects.filter((p) => p.lang === lang).length;

  const areas = [
    { icon: AppIcons.web, title: "Web platforms", text: `Next.js, React and WebGL sites for studios, startups and media. ${count("web")} featured.`, chips: ["Next.js", "React", "Three.js"], lang: "web" as const },
    { icon: AppIcons.game, title: "Apps & mobile games", text: `Real-money casino and card games, React Native and Unity apps. ${count("game")} featured, 12 shipped.`, chips: ["Unity", "React Native", "Pix"], lang: "game" as const },
    { icon: AppIcons.ai, title: "AI tooling", text: "Creator of the AI Token Router: 40–70% fewer tokens on any LLM API.", chips: ["LLM APIs", "Semantic cache", "Routing"], lang: "ai" as const },
    { icon: AppIcons.java, title: "Java", text: `Spring Boot services, Kafka pipelines, JVM tuning. ${count("java")} featured.`, chips: ["Spring Boot", "Hibernate", "Kafka"], lang: "java" as const },
    { icon: AppIcons.python, title: "Python", text: `FastAPI backends, data pipelines, automation and MLOps. ${count("python")} featured.`, chips: ["FastAPI", "Pandas", "pytest"], lang: "python" as const },
  ];

  return (
    <Page>
      <div className="mb-5 flex items-center gap-5">
        <Avatar size={84} className="ring-4 ring-surface-2" />
        <div>
          <H2>{state.user.name}</H2>
          <div className="font-medium text-accent">{PORTFOLIO.title}</div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-fg-3"><Glyph.pin /> {PORTFOLIO.location}</div>
        </div>
      </div>

      <P>{PORTFOLIO.tagline}</P>
      {PORTFOLIO.bio.map((p) => <P key={p.slice(0, 20)}>{p}</P>)}

      <div className="my-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {PORTFOLIO.highlights.map((h) => (
          <Card key={h.label} className="px-3.5 py-3"><b className="block text-[22px] font-semibold">{h.value}</b><span className="text-xs text-fg-3">{h.label}</span></Card>
        ))}
      </div>

      <H3>What I build</H3>
      <div className="grid gap-2.5 sm:grid-cols-2">
        {areas.map((a) => (
          <Card key={a.title} className="flex gap-3.5">
            <a.icon className="h-10 w-10 shrink-0" />
            <div>
              <b className="mb-1 block">{a.title}</b>
              <small className="text-fg-2">{a.text}</small>
              <div className="mt-2 flex flex-wrap gap-1.5">{a.chips.map((c) => <Chip key={c} lang={a.lang}>{c}</Chip>)}</div>
            </div>
          </Card>
        ))}
      </div>

      <H3>Timeline</H3>
      <ol className="relative ml-2 border-l border-line-strong pl-5">
        {PORTFOLIO.timeline.map((t) => (
          <li key={t.date} className="relative mb-3.5">
            <i className="absolute top-1.5 -left-[25px] h-2.5 w-2.5 rounded-full bg-accent ring-4 ring-mica" />
            <small className="block text-[11px] text-fg-3">{new Date(t.date).toLocaleDateString([], { month: "short", year: "numeric" })}</small>
            <span className="text-[13px]">{t.text}</span>
          </li>
        ))}
      </ol>

      <div className="mt-6 flex flex-wrap gap-2">
        <Btn variant="primary" onClick={() => openApp("portfolio")}><AppIcons.portfolio className="h-4 w-4" /> See my portfolio</Btn>
        <LinkBtn href={PORTFOLIO.github}><AppIcons.github className="h-4 w-4" /> GitHub</LinkBtn>
        <LinkBtn href={`https://wa.me/${PORTFOLIO.whatsapp.replace(/\D/g, "")}`}><AppIcons.whatsapp className="h-4 w-4" /> WhatsApp</LinkBtn>
        {PORTFOLIO.linkedin && <LinkBtn href={PORTFOLIO.linkedin}><AppIcons.linkedin className="h-4 w-4" /> LinkedIn</LinkBtn>}
      </div>
    </Page>
  );
}
