//to push to github

import { NextRequest, NextResponse } from "next/server";
import axios from "axios";


export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("gh_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const owner = searchParams.get("owner");
    const repo = searchParams.get("repo");

    if (!owner || !repo) {
      return NextResponse.json({ error: "Missing owner or repo" }, { status: 400 });
    }

    try {
      const ghRes = await axios.get(`https://api.github.com/repos/${owner}/${repo}/readme`, {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json" },
      });

      const encoded = ghRes.data.content as string;
      const sha = ghRes.data.sha as string;
      const content = Buffer.from(encoded, "base64").toString("utf-8");

      return NextResponse.json({ exists: true, content, sha });
    } catch (err: any) {
      if (err.response?.status === 404) {
        return NextResponse.json({ exists: false });
      }
      throw err;
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
export async function PUT(req: NextRequest) {
  try {
    const token = req.cookies.get("gh_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }

    const body = await req.json();
    const { owner, repo, content, sha, message } = body || {};
    if (!owner || !repo || typeof content !== "string") {
      return NextResponse.json({ error: "Missing owner, repo, or content" }, { status: 400 });
    }

    const encoded = Buffer.from(content, "utf-8").toString("base64");
    const payload: any = {
      message: message || "chore: update README.md via readme-builder",
      content: encoded,
    };
    if (sha) payload.sha = sha;

    const ghRes = await axios.put(
      `https://api.github.com/repos/${owner}/${repo}/contents/README.md`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json",
        },
      }
    );

    return NextResponse.json({ ok: true, content: ghRes.data.content, commit: ghRes.data.commit });
  } catch (error: any) {
    const message = error.response?.data || error.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


