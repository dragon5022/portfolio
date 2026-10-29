"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useOS } from "@/lib/store";
import { useClock, fmtTime, fmtLongDate } from "@/lib/useClock";
import { AppIcons, Glyph } from "@/components/icons";
import { PORTFOLIO } from "@/data/portfolio";
import Avatar from "@/components/Avatar";
import { Spinner } from "@/components/BootScreen";
import { basicProfile, isGitHubLogin, lookupProfile, type GitHubProfile } from "@/lib/github";

type Stage = "clock" | "signin" | "unlocking";

export default function LockScreen() {
  const { state, dispatch, notify } = useOS();
  const now = useClock();
  const [stage, setStage] = useState<Stage>("clock");
  const [login, setLogin] = useState(state.visitor?.login ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pending = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);

  /* visitors sign in with their GitHub username; it is checked against the public GitHub API */
  const signIn = async (e: FormEvent) => {
    e.preventDefault();
    if (pending.current) return;
    const name = login.trim().replace(/^@/, "");
    if (!name) { setError("Enter your GitHub username."); return; }
    if (!isGitHubLogin(name)) { setError("That is not a valid GitHub username."); return; }
    pending.current = true;
    setBusy(true); setError(null);
    let profile: GitHubProfile | null;
    try { profile = await lookupProfile(name); }
    catch { profile = basicProfile(name); } // GitHub unreachable or rate-limited: let them in with just the username
    if (!profile) {
      pending.current = false;
      setBusy(false); setError(`No GitHub user called "${name}".`);
      setTimeout(() => inputRef.current?.focus(), 0);
      return;
    }
    const visitor = profile;
    dispatch({ type: "VISITOR", visitor });
    setStage("unlocking");
    setTimeout(() => {
      dispatch({ type: "PHASE", phase: "desktop" });
      setTimeout(() => notify(`Welcome, ${visitor.name}`, "Double-click an icon or open the Start menu. Try `whoami` in Terminal.", "about"), 900);
    }, 1200);
  };

  /* first key / click reveals the sign-in card; Escape hides it again */
  useEffect(() => {
    if (stage === "unlocking") return;
    const onKey = (e: KeyboardEvent) => {
      if (stage === "clock") setStage("signin");
      else if (e.key === "Escape" && !busy) { setStage("clock"); setError(null); inputRef.current?.blur(); }
    };
    const onPointer = () => { if (stage === "clock") setStage("signin"); };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointer);
    return () => { window.removeEventListener("keydown", onKey); window.removeEventListener("pointerdown", onPointer); };
  }, [stage, busy]);

  /* focus the field only once the card is visible, after the revealing key event has finished */
  useEffect(() => {
    if (stage !== "signin") return;
    const t = setTimeout(() => inputRef.current?.focus(), 150);
    return () => clearTimeout(t);
  }, [stage]);

  const blur = stage !== "clock";
  const v = state.visitor;
  const known = v && (stage === "unlocking" || login.trim().replace(/^@/, "").toLowerCase() === v.login.toLowerCase()) ? v : null;

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

      {/* sign-in card: the visitor signs in with their GitHub username */}
      <div className={`absolute inset-0 flex flex-col items-center justify-center px-6 text-center transition-opacity duration-300 ${blur ? "opacity-100" : "pointer-events-none opacity-0"}`}>
        <Avatar size={112} person={known} className="shadow-[0_8px_30px_rgba(0,0,0,.4)] text-4xl" />
        {stage === "unlocking" && v ? (
          <>
            <h1 className="mt-4 mb-1 text-3xl font-semibold">Welcome, {v.name}</h1>
            <p className="mb-7 opacity-80">@{v.login}</p>
            <Spinner />
          </>
        ) : (
          <>
            <h1 className="mt-4 mb-1 text-3xl font-semibold">Sign in with GitHub</h1>
            <p className="mb-6 max-w-[360px] opacity-80">Enter your GitHub username to visit {PORTFOLIO.name}&apos;s portfolio.</p>
            <form onSubmit={signIn} className="w-full max-w-[300px]">
              <div className="flex h-10 items-center overflow-hidden rounded border border-white/25 border-b-white/60 bg-white/12 backdrop-blur-sm focus-within:border-b-2 focus-within:border-b-accent">
                <AppIcons.github className="ml-2.5 h-5 w-5 shrink-0" />
                <input
                  ref={inputRef} value={login} onChange={(e) => { setLogin(e.target.value); setError(null); }}
                  placeholder="GitHub username" aria-label="GitHub username" aria-invalid={Boolean(error)} aria-describedby="signin-status"
                  autoComplete="username" autoCapitalize="none" autoCorrect="off" spellCheck={false} maxLength={40} readOnly={busy}
                  className="h-full min-w-0 flex-1 bg-transparent px-2.5 text-base text-white outline-none placeholder:text-white/55 sm:text-sm"
                />
                <button type="submit" disabled={busy} title="Sign in" aria-label="Sign in" className="grid h-full w-10 shrink-0 place-items-center hover:bg-white/15 disabled:opacity-60">
                  <Glyph.arrowRight />
                </button>
              </div>
            </form>
            <p id="signin-status" role="status" className="mt-3 min-h-4 text-xs">
              {error ? <span className="text-[#ffb4b4]">{error}</span> : busy ? <span className="opacity-80">Checking GitHub…</span> : <span className="opacity-70">Only your public GitHub profile is used.</span>}
            </p>
          </>
        )}
      </div>

      <div className={`justify-self-center text-center text-[13px] opacity-85 animate-bob transition-opacity ${blur ? "opacity-0" : ""}`}>
        <Glyph.chevronDown className="mx-auto text-xl" />
        <p className="mt-0.5">Press Enter to sign in</p>
      </div>
    </div>
  );
}
