/* Public GitHub lookups for the visitor's sign-in (unauthenticated: GitHub allows 60 requests/hour per visitor IP). */

export interface GitHubProfile {
  login: string;
  name: string; // display name, falls back to the login
  avatar: string;
  url: string;
  bio?: string;
  company?: string;
  location?: string;
  blog?: string;
  followers?: number;
  following?: number;
  publicRepos?: number;
  joined?: string; // ISO
  /** false when GitHub could not be reached at sign-in and only the username is known */
  verified: boolean;
}

export interface GitHubRepo { name: string; url: string; description: string | null; language: string | null; stars: number; updated: string }

const API = "https://api.github.com";

/** GitHub's username rules: letters, digits and single hyphens, no leading/trailing hyphen, at most 39 chars */
export const isGitHubLogin = (s: string) => /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i.test(s);

async function gh<T>(path: string): Promise<T | null> {
  const res = await fetch(`${API}${path}`, { headers: { Accept: "application/vnd.github+json" } });
  if (res.status === 404) return null;
  if ((res.status === 403 || res.status === 429) && res.headers.get("x-ratelimit-remaining") === "0") throw new Error("GitHub's hourly lookup limit was reached. Try again later.");
  if (!res.ok) throw new Error(`GitHub error (${res.status}).`);
  return (await res.json()) as T;
}

type ApiUser = {
  login: string; type: string; name: string | null; avatar_url: string; html_url: string; bio: string | null; company: string | null;
  location: string | null; blog: string | null; followers: number; following: number; public_repos: number; created_at: string;
};

/** null when no such user (or the name belongs to an organization); throws when GitHub cannot be reached */
export async function lookupProfile(login: string): Promise<GitHubProfile | null> {
  const u = await gh<ApiUser>(`/users/${encodeURIComponent(login)}`);
  if (!u || u.type !== "User") return null;
  return {
    login: u.login, name: u.name?.trim() || u.login, avatar: u.avatar_url, url: u.html_url,
    bio: u.bio?.trim() || undefined, company: u.company?.trim() || undefined, location: u.location?.trim() || undefined, blog: u.blog?.trim() || undefined,
    followers: u.followers, following: u.following, publicRepos: u.public_repos, joined: u.created_at, verified: true,
  };
}

/** a profile built from the username alone, for when GitHub is unreachable or rate-limited */
export const basicProfile = (login: string): GitHubProfile => ({
  login, name: login, avatar: `https://github.com/${login}.png?size=200`, url: `https://github.com/${login}`, verified: false,
});

type ApiRepo = { name: string; html_url: string; description: string | null; language: string | null; stargazers_count: number; pushed_at: string; fork: boolean };
const repoCache = new Map<string, Promise<GitHubRepo[] | null>>();

/** most recently pushed public repos (forks excluded); null when the user does not exist */
export function fetchRepos(login: string): Promise<GitHubRepo[] | null> {
  const key = login.toLowerCase();
  let p = repoCache.get(key);
  if (!p) {
    p = gh<ApiRepo[]>(`/users/${encodeURIComponent(login)}/repos?sort=pushed&per_page=12&type=owner`).then((list) =>
      list && list.filter((r) => !r.fork).slice(0, 6).map((r) => ({ name: r.name, url: r.html_url, description: r.description, language: r.language, stars: r.stargazers_count, updated: r.pushed_at })));
    p.catch(() => repoCache.delete(key)); // retry after a failure
    repoCache.set(key, p);
  }
  return p;
}

export const fmtMonth = (iso: string) => new Date(iso).toLocaleDateString([], { month: "short", year: "numeric" });
