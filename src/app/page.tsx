"use client";
import { useEffect, useState } from "react";

export default function HomePage() {
  const handleLogin = async () => {
    try {
      const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_CLIENT_ID}&redirect_uri=http://localhost:3000/api/auth/callback/github&scope=repo`;

      window.location.href = githubAuthUrl;
    } catch (error: any) {
      console.error("Login Error:", error.message);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-gradient-to-tr from-indigo-500/25 via-sky-400/20 to-cyan-300/10 blur-3xl animate-drift" />
        <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-gradient-to-tr from-fuchsia-500/20 via-purple-400/20 to-indigo-400/10 blur-3xl animate-drift-slow" />
        <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_0%,rgba(255,255,255,0.06),transparent)]" />
      </div>

      <section className="mx-auto flex max-w-6xl flex-col items-center px-6 pt-28 pb-10 text-center sm:pt-32">
        <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur">
          <span className="inline-block h-2 w-2 animate-ping rounded-full bg-emerald-400/80" />
          New: Instant README builder for private and public repos
        </span>

        <h1 className="relative mt-3 bg-gradient-to-r from-sky-300 via-white to-violet-300 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-6xl md:text-7xl">
          <span className="block">Build brilliant READMEs</span>
          <span className="mt-2 block text-balance">
            for <CycleWord words={["public", "private", "team", "your"]} interval={2000} />repos
          </span>
        </h1>

        <p className="mt-6 max-w-2xl text-balance text-base leading-relaxed text-slate-300 sm:text-lg">
          Draft, remix, and polish your repository docs with the power of
          <span className="mx-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-sky-200">
            <GeminiLogo /> Gemini
          </span>
          — then ship a standout README that feels crafted, not copy‑pasted.
        </p>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
          <button
            onClick={handleLogin}
            className="group inline-flex items-center justify-center gap-2 rounded-xl border border-sky-400/30 bg-sky-400/10 px-6 py-3 text-sm font-semibold text-sky-100 transition hover:border-sky-300/60 hover:bg-sky-400/20 hover:text-white cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-5 w-5 opacity-90"
            >
              <path d="M12 .5C5.73.5.98 5.24.98 11.5c0 4.85 3.15 8.96 7.52 10.41.55.1.75-.24.75-.53 0-.26-.01-1.12-.02-2.03-3.06.66-3.71-1.3-3.71-1.3-.5-1.27-1.22-1.61-1.22-1.61-.99-.68.08-.67.08-.67 1.1.08 1.68 1.13 1.68 1.13.97 1.66 2.54 1.18 3.15.9.1-.7.38-1.18.69-1.45-2.44-.28-5.01-1.22-5.01-5.43 0-1.2.43-2.18 1.14-2.95-.11-.28-.5-1.41.11-2.95 0 0 .94-.3 3.08 1.13.89-.25 1.85-.38 2.81-.38.96 0 1.92.13 2.81.38 2.14-1.43 3.08-1.13 3.08-1.13.61 1.54.22 2.67.11 2.95.71.77 1.14 1.75 1.14 2.95 0 4.22-2.57 5.15-5.02 5.42.39.34.74 1.01.74 2.04 0 1.47-.01 2.65-.01 3.01 0 .29.2.64.76.53 4.36-1.45 7.51-5.56 7.51-10.41C23.02 5.24 18.27.5 12 .5Z" />
            </svg>
            Login with GitHub
          </button>

          <a
            href="#features"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white/80 backdrop-blur transition hover:border-white/20 hover:bg-white/10 hover:text-white"
          >
            Learn more
            <span className="opacity-70 transition group-hover:translate-x-0.5">→</span>
          </a>
        </div>

        <div className="mt-14 h-px w-40 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </section>
      <section id="features" className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-6 pb-28 pt-4 sm:grid-cols-2 md:grid-cols-3">
        <FeatureCard
          icon={<SparkleIcon />}
          title="Generate in seconds"
          description="Start from a smart template tuned for your tech stack and repo signals."
        />
        <FeatureCard
          icon={<MagicPenIcon />}
          title="Edit with Gemini"
          description="Rewrite sections, add badges, summarize APIs, and keep your voice."
        />
        <FeatureCard
          icon={<ShieldIcon />}
          title="Private-safe by default"
          description="Works for private and public repositories with minimal permissions."
        />
      </section>
      //amimation styles
      <style jsx>{`
        .animate-drift { animation: drift 18s ease-in-out infinite; }
        .animate-drift-slow { animation: drift 26s ease-in-out infinite; }
        @keyframes drift {
          0% { transform: translate3d(0,0,0) rotate(0deg) scale(1); }
          50% { transform: translate3d(8px,-10px,0) rotate(6deg) scale(1.03); }
          100% { transform: translate3d(0,0,0) rotate(0deg) scale(1); }
        }
        @keyframes wordFadeSlide {
          0% { opacity: 0; transform: translateY(6px); filter: blur(2px); }
          12% { opacity: 1; transform: translateY(0); filter: blur(0); }
          88% { opacity: 1; transform: translateY(0); filter: blur(0); }
          100% { opacity: 0; transform: translateY(-6px); filter: blur(2px); }
        }
      `}</style>
    </main>
  );
}

function CycleWord({ words, interval = 2500 }: { words: string[]; interval?: number }) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (!words || words.length === 0) return;
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, interval);
    return () => clearInterval(id);
  }, [words, interval]);
  return (
    <span className="relative inline-flex h-[1.1em] min-w-[9ch] items-center align-middle">
      <span
        key={index}
        className="text-sky-300 will-change-transform"
        style={{ animation: `wordFadeSlide ${interval}ms ease-in-out` }}
      >
        {words[index]}
      </span>
    </span>
  );
}

function GeminiLogo() {
  return (
    <span className="relative inline-flex items-center">
      <svg
        width="16"
        height="16"
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-[0_0_6px_rgba(56,189,248,0.35)]"
        aria-hidden
      >
        <defs>
          <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7dd3fc" />
            <stop offset="50%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#a78bfa" />
          </linearGradient>
          <radialGradient id="g2" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="70%" stopColor="#93c5fd" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.15" />
          </radialGradient>
        </defs>
        <g>
          <path d="M32 3 L6 24 L32 61 L58 24 Z" fill="url(#g1)" />
          <path d="M32 10 L13 25 L32 52 L51 25 Z" fill="url(#g2)" />
        </g>
      </svg>
    </span>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur transition hover:border-white/20 hover:bg-white/10">
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-tr from-sky-400/10 to-fuchsia-400/10 blur-2xl transition group-hover:scale-110" />
      <div className="relative flex items-start gap-3">
        <div className="mt-1 rounded-lg border border-white/10 bg-white/10 p-2 text-sky-200">
          {icon}
        </div>
        <div>
          <h3 className="text-base font-semibold text-white">{title}</h3>
          <p className="mt-1 text-sm leading-relaxed text-slate-300">{description}</p>
        </div>
      </div>
    </div>
  );
}

function SparkleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M12 2.75c.2 0 .39.1.5.27l2.1 3.21c.08.13.21.21.36.24l3.79.74c.42.08.59.62.28.93l-2.72 2.74c-.1.1-.15.25-.13.39l.6 3.88c.07.43-.38.76-.76.56l-3.43-1.8a.55.55 0 0 0-.5 0l-3.43 1.8c-.38.2-.83-.13-.76-.56l.6-3.88c.02-.14-.03-.29-.13-.39L4.97 8.14a.61.61 0 0 1 .28-.93l3.79-.74c.15-.03.28-.11.36-.24l2.1-3.21c.11-.17.3-.27.5-.27Z" />
    </svg>
  );
}

function MagicPenIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M3 17.25V21h3.75l11.06-11.06-3.75-3.75L3 17.25Zm17.71-10.21a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83Z" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M12 2 4.5 5v6.5c0 4.35 3.07 8.4 7.5 9.5 4.43-1.1 7.5-5.15 7.5-9.5V5L12 2Z" />
    </svg>
  );
}