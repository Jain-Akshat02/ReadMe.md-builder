"use client";
import axios from "axios";

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
    <main className="flex items-center justify-center min-h-screen">
      <button
        onClick={handleLogin}
        className="px-6 py-3 text-white rounded-lg cursor-pointer border-2 border-white bg-blue-600 hover:bg-blue-700 transition"
      >
        Login with GitHub
      </button>
    </main>
  );
}
