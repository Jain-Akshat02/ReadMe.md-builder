import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: NextRequest) {
  // read token from cookies

  const token = req.cookies.get("gh_token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }

  try {
    const userRes = await axios.get("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const reposRes = await axios.get("https://api.github.com/user/repos", {
      headers: { Authorization: `Bearer ${token}` },
      params: { per_page: 100 },
    });

    const repos = reposRes.data;
    const publicRepos = repos.filter((r: any) => !r.private).length;
    const privateRepos = repos.filter((r: any) => r.private).length;
    return NextResponse.json({
      user: {
        login: userRes.data.login,
        name: userRes.data.name,
        avatarUrl: userRes.data.avatar_url,
        bio: userRes.data.bio,
        company: userRes.data.company,
        location: userRes.data.location,
        followers: userRes.data.followers,
        following: userRes.data.following,
        publicRepos,
        privateRepos,
        repos: repos.map((r: any) => ({
          name: r.name,
          private: r.private,
          description: r.description,
          stars: r.stargazers_count,
          forks: r.forks_count,
          language: r.language,
          updatedAt: r.updated_at,
          htmlUrl: r.html_url,
        })),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

//stars: r.stargazers_count,
// forks: r.forks_count,
