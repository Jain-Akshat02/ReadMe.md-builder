"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "public" | "private">("all");
  const [loadingReadme, setLoadingReadme] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/me");
        setUser(res.data.user);
      } catch (err) {
        console.error("Error fetching user:", err);
        router.push("/"); // not logged in → back home
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
  const generateReadme = async (repo: any) => {
    try {
      setLoadingReadme(repo.name); // indicate which repo is loading
      const res = await axios.post("/api/readme-generator", { repo });
      const readme = res.data.readme;

      // Here you can either download it or open in a modal
      console.log(readme); // for now, just log it
      alert("README generated! Check console.");
    } catch (err:any) {
      console.error(err.message, err);
      alert("Failed to generate README");
    } finally {
      setLoadingReadme(null);
    }
  };

  if (loading) {
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

  // Filter + search logic
  const filteredRepos = user.repos.filter((repo: any) => {
    if (filter === "public" && repo.private) return false;
    if (filter === "private" && !repo.private) return false;
    if (search && !repo.name.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <main className="relative min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      {/* Decorative background accents */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-gradient-to-tr from-indigo-500/25 via-sky-400/20 to-cyan-300/10 blur-3xl animate-drift" />
        <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-gradient-to-tr from-fuchsia-500/20 via-purple-400/20 to-indigo-400/10 blur-3xl animate-drift-slow" />
      </div>

      <section className="mx-auto mt-20 max-w-5xl rounded-lg border border-white/10 bg-white/5 p-8 backdrop-blur-xl shadow-lg">
        <div className="flex flex-col items-center sm:flex-row sm:items-start sm:gap-8">
          <div className="relative">
            <img
              src={user.avatarUrl}
              alt={user.login}
              className="h-28 w-28 rounded-full border-2 border-white/20 shadow-lg"
            />
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
              {user.company && (
                <div className="flex items-center gap-1">
                  <span>🏢</span>
                  <span>{user.company}</span>
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

        {/* Filter Buttons */}
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

        {/* Search */}
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

        {/* Repo list */}
        {user && filteredRepos.length > 0 ? (
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredRepos.map((repo: any) => (
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

      {/* Local styles for animations */}
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
