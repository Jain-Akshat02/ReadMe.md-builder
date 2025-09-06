"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";


// Type definitions
interface Repository {
  name: string;
  description?: string;
  private: boolean;
  stars: number;
  forks: number;
  language?: string;
  updatedAt: string;
  htmlUrl: string;
}

interface User {
  login: string;
  name?: string;
  bio?: string;
  location?: string;
  followers: number;
  following: number;
  avatarUrl: string;
  repos: Repository[];
  publicRepos: number;
  privateRepos: number;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "public" | "private">("all");
  const [loadingReadme, setLoadingReadme] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewContent, setPreviewContent] = useState<string>("");
  const [originalContent, setOriginalContent] = useState<string>("");
  const [previewRepo, setPreviewRepo] = useState<Repository | null>(null);
  const [previewSha, setPreviewSha] = useState<string | null>(null);



  const [previewMode, setPreviewMode] = useState<"current" | "generated">("generated");
  const [saving, setSaving] = useState(false);
  const [improving, setImproving] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/me");
        setUser(res.data.user);
      } catch (err) {
        console.error("Error fetching user:", err);
        router.push("/");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    await axios.get("/api/auth/logout");
    router.push("/");
  };
  const generateReadme = async (repo: Repository) => {
    if (!user) return;
    setPreviewRepo(repo);
    setIsPreviewOpen(true);
    setPreviewContent("");
    setOriginalContent("");
    setPreviewSha(null);
    try {
      setLoadingReadme(repo.name);
      const owner = user.login;
      
      // get existing readme
      try {
        const current = await axios.get(`/api/readme?owner=${owner}&repo=${repo.name}`);
        if (current.data.exists) {
          setOriginalContent(current.data.content || "");
          setPreviewContent(current.data.content || "");
          setPreviewSha(current.data.sha || null);
          setPreviewMode("current");
        } else {
          const gen = await axios.post("/api/readme-generator", { repo });
          const readme = gen.data.readme || "";
          setOriginalContent("");
          setPreviewContent(readme);
          setPreviewMode("generated");
        }
      } catch (readmeError: unknown) {
        const errorMessage = readmeError instanceof Error ? readmeError.message : 'Unknown error';
        console.warn("Error checking existing README, generating new one:", errorMessage);
        const gen = await axios.post("/api/readme-generator", { repo });
        const readme = gen.data.readme || "";
        setOriginalContent("");
        setPreviewContent(readme);
        setPreviewMode("generated");
      }
    } catch (err: unknown) {
      console.error("Error generating README:", err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      const errorDetails = (err as any)?.response?.data?.error || errorMessage;
      console.error("Error details:", errorDetails);
      alert(`Failed to generate README: ${errorDetails}`);
      setIsPreviewOpen(false);
    } finally {
      setLoadingReadme(null);
    }
  };
  

  const improveCurrentReadme = async () => {
    if (!previewContent) return;
    try {
      setImproving(true);
      const res = await axios.post("/api/gemeni", { content: previewContent });
      const improved = res.data.improvedReadme || previewContent;
      setPreviewContent(improved);
      setPreviewMode("generated");
    } catch (e: unknown) {
      console.error("Failed to improve README:", e);
      alert("Failed to improve README");
    } finally {
      setImproving(false);
    }
  };

  const saveReadme = async () => {
    if (!previewRepo || !user) return;
    try {
      setSaving(true);
      const owner = user.login;
      await axios.put("/api/readme", {
        owner,
        repo: previewRepo.name,
        content: previewContent,
        sha: previewSha || undefined,
        message: previewSha ? "chore: update README.md" : "chore: add README.md",
      });
      alert("README saved to repository");
      setIsPreviewOpen(false);
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : 'Unknown error';
      const msg = (e as any)?.response?.data?.error || errorMessage;
      alert(`Failed to save README: ${msg}`);
    } finally {
      setSaving(false);
    }
  };

  const filteredRepos = user?.repos?.filter((repo: Repository) => {
    if (filter === "public" && repo.private) return false;
    if (filter === "private" && !repo.private) return false;
    if (search && !repo.name.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    return true;
  }) || [];

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-200">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-slate-600 border-t-sky-400"></div>
          <p className="text-lg font-medium animate-pulse">
            Loading your profile...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-gradient-to-tr from-indigo-500/25 via-sky-400/20 to-cyan-300/10 blur-3xl animate-drift" />
        <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-gradient-to-tr from-fuchsia-500/20 via-purple-400/20 to-indigo-400/10 blur-3xl animate-drift-slow" />
      </div>

      <section className="mx-auto mt-20 max-w-5xl rounded-lg border border-white/10 bg-white/5 p-8 backdrop-blur-xl shadow-lg">
        <div className="flex flex-col items-center sm:flex-row sm:items-start sm:gap-8">
          <div className="relative">
            
            <img src={user.avatarUrl} alt="" className="h-28 w-28 rounded-full border-2 border-white/20 shadow-lg"/>
          </div>

          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-3xl font-bold text-white mb-2">
              {user.name || user.login}
            </h1>
            <p className="text-slate-400 text-lg mb-1">@{user.login}</p>
            {user.bio && (
              <p className="text-slate-300 text-sm max-w-md mb-4">{user.bio}</p>
            )}
            <div className="flex flex-wrap gap-4 text-sm text-slate-400">
              {user.location && (
                <div className="flex items-center gap-1">
                  <span>📍</span>
                  <span>{user.location}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <span></span>
                <span>{user.followers} followers</span>
              </div>
              <div className="flex items-center gap-1">
                <span></span>
                <span>{user.following} following</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="mt-6 sm:mt-0 rounded-md border border-fuchsia-400/30 bg-fuchsia-400/10 px-4 py-2 text-sm font-medium text-fuchsia-100 transition-colors duration-200 hover:border-fuchsia-300/60 hover:bg-fuchsia-400/20 hover:text-white cursor-pointer"
          >
            Logout
          </button>
        </div>
        <div className="mt-8 flex flex-wrap gap-3 justify-center sm:justify-start">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-md border text-sm font-medium transition-colors duration-200 ${
              filter === "all"
                ? "border-indigo-400 bg-indigo-400/20 text-white"
                : "border-white/10 hover:border-white/20 hover:bg-white/5"
            }`}
          >
            All ({user.repos.length})
          </button>
          <button
            onClick={() => setFilter("public")}
            className={`px-4 py-2 rounded-md border text-sm font-medium transition-colors duration-200 ${
              filter === "public"
                ? "border-sky-400 bg-sky-400/20 text-white"
                : "border-white/10 hover:border-white/20 hover:bg-white/5"
            }`}
          >
            Public ({user.publicRepos})
          </button>
          <button
            onClick={() => setFilter("private")}
            className={`px-4 py-2 rounded-md border text-sm font-medium transition-colors duration-200 ${
              filter === "private"
                ? "border-fuchsia-400 bg-fuchsia-400/20 text-white"
                : "border-white/10 hover:border-white/20 hover:bg-white/5"
            }`}
          >
            Private ({user.privateRepos})
          </button>
        </div>
        <div className="mt-8 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-slate-400 ml-143">🔍</span>
          </div>
          <input
            type="text"
            placeholder="Search repositories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-96 pl-10 pr-4 py-2.5 rounded-md border border-white/10 bg-white/5 text-slate-200 placeholder-slate-400 focus:outline-none focus:border-sky-400/50 transition-colors duration-200 ml-143"
          />
        </div>
        {user && filteredRepos.length > 0 ? (
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredRepos.map((repo: Repository) => (
              <div
                key={repo.name}
                className="rounded-lg border border-white/10 bg-white/5 p-5 transition-colors duration-200 hover:border-white/20 hover:bg-white/10"
              >
                <div className="flex items-start justify-between mb-3">
                  <h2 className="text-lg font-semibold text-white truncate">
                    {repo.name}
                  </h2>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      repo.private
                        ? "bg-fuchsia-400/20 text-fuchsia-300 border border-fuchsia-400/30"
                        : "bg-sky-400/20 text-sky-300 border border-sky-400/30"
                    }`}
                  >
                    {repo.private ? "Private" : "Public"}
                  </span>
                </div>

                {repo.description && (
                  <p className="text-sm text-slate-400 mb-4 line-clamp-2">
                    {repo.description}
                  </p>
                )}

                <div className="flex items-center gap-4 text-slate-300 text-sm mb-4">
                  <div className="flex items-center gap-1">
                    <span>⭐</span>
                    <span className="font-medium">{repo.stars}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>🍴</span>
                    <span className="font-medium">{repo.forks}</span>
                  </div>
                  {repo.language && (
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded bg-sky-400"></div>
                      <span className="font-medium">{repo.language}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 mt-2">
                  <span>
                    Updated {new Date(repo.updatedAt).toLocaleDateString()}
                  </span>
                  <div className="flex items-center gap-2">
                    <a
                      href={repo.htmlUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sky-300 hover:text-sky-300 transition-colors duration-200 text-sm"
                    >
                      View
                    </a>
                    <button
                      onClick={() => generateReadme(repo)}
                      disabled={loadingReadme === repo.name}
                      className={`px-2 py-1 rounded text-xs font-medium transition-colors duration-200 ${
                        loadingReadme === repo.name
                          ? "bg-gray-500 cursor-not-allowed"
                          : "bg-indigo-500 text-white hover:bg-indigo-400"
                      }`}
                      style={{ minWidth: "unset" }}
                    >
                      {loadingReadme === repo.name
                        ? "Generating..."
                        : "Generate Readme"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-12 text-center">
            <p className="text-slate-400 text-lg">No repositories found</p>
            <p className="text-slate-500 text-sm mt-2">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </section>

      {/* preview section */}


      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-4xl rounded-lg border border-white/10 bg-slate-900/95 backdrop-blur p-6 text-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">README Preview — {previewRepo?.name}</h3>
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="rounded-md border border-white/10 px-2 py-1 hover:bg-white/10"
              >
                Close
              </button>
            </div>

            <div className="mb-3 flex items-center gap-2 text-sm">
              <span className={`px-2 py-1 rounded border ${
                previewMode === "current" ? "border-sky-400 text-sky-300" : "border-white/10 text-slate-400"
              }`}>Current</span>
              <span className={`px-2 py-1 rounded border ${
                previewMode === "generated" ? "border-indigo-400 text-indigo-300" : "border-white/10 text-slate-400"
              }`}>Generated</span>
            </div>

            <textarea
              className="w-full h-80 rounded-md border border-white/10 bg-slate-950/60 p-3 font-mono text-sm text-slate-200 focus:outline-none focus:border-sky-400/50"
              value={previewContent}
              onChange={(e) => setPreviewContent(e.target.value)}
            />

            <div className="mt-4 flex flex-wrap gap-2 justify-end">
              {originalContent && (
                <button
                  onClick={() => {
                    setPreviewContent(originalContent);
                    setPreviewMode("current");
                  }}
                  className="rounded-md border border-white/10 px-3 py-2 text-sm hover:bg-white/10"
                >
                  Use Current
                </button>
              )}
              <button
                onClick={improveCurrentReadme}
                disabled={improving}
                className="rounded-md border border-sky-400/40 text-sky-200 px-3 py-2 text-sm hover:bg-sky-500/10 disabled:opacity-60"
              >
                {improving ? "Improving..." : "Improve"}
              </button>
              <button
                onClick={saveReadme}
                disabled={saving}
                className="rounded-md border border-fuchsia-400/40 text-fuchsia-200 px-3 py-2 text-sm hover:bg-fuchsia-500/10 disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save to GitHub"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/*this styling was done by AI - */}
      {/* Akshat Jain */ }

      <style jsx>{`
        .animate-drift {
          animation: drift 18s ease-in-out infinite;
        }
        .animate-drift-slow {
          animation: drift 26s ease-in-out infinite;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        @keyframes drift {
          0% {
            transform: translate3d(0, 0, 0) rotate(0deg) scale(1);
          }
          50% {
            transform: translate3d(8px, -10px, 0) rotate(6deg) scale(1.03);
          }
          100% {
            transform: translate3d(0, 0, 0) rotate(0deg) scale(1);
          }
        }
        @keyframes pulse-glow {
          0%,
          100% {
            box-shadow: 0 0 20px rgba(56, 189, 248, 0.3);
          }
          50% {
            box-shadow: 0 0 30px rgba(56, 189, 248, 0.5);
          }
        }
        .pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
      `}</style>
    </main>
  );
}
