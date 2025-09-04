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
    return NextResponse.json({
      user: {
        login: userRes.data.login,
        name: userRes.data.name,
        avatarUrl: userRes.data.avatar_url,
        repos: repos.map((r: any) => ({ name: r.name, private: r.private })),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
