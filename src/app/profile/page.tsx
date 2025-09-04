"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/me");
        setUser(res.data.user);
      } catch (error: any) {
        console.error("Fetch user error:", error.message);
      }
    };

    fetchUser();
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Welcome {user.login}</h1>
      <img
        src={user.avatarUrl}
        alt="avatar"
        className="w-24 h-24 rounded-full mt-4"
      />
      <p className="mt-2">Name: {user.name}</p>
      <p>Repos: {user.repos.length}</p>

      <h2 className="text-xl mt-6 mb-2 font-semibold">Your Repositories</h2>
      <ul className="space-y-2">
        {user.repos.map((r: any) => (
          <li key={r.name} className="p-3 border rounded-lg">
            <Link
              href={`/repo/${r.name}`}
              className="text-blue-600 hover:underline"
            >
              {r.name} {r.private ? "(Private)" : "(Public)"}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
