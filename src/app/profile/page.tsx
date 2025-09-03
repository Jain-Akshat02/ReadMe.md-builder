"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/me");
        setUser(res.data);
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
        src={user.avatar_url}
        alt="avatar"
        className="w-24 h-24 rounded-full mt-4"
      />
      <p className="mt-2">Name: {user.name}</p>
      <p>Public repos: {user.publicRepos}</p>
      <p>Private repos: {user.privateRepos}</p>
      <p>Total repos: {user.totalRepos}</p>

      {/* <ul>
        {user.repos.map((r: any) => (
          <li key={r.name}>
            {r.name} {r.private ? "(Private)" : "(Public)"}
          </li>
        ))}
      </ul> */}
    </main>
  );
}
