import { NextResponse } from "next/server";

export async function GET() {
  const clientId = process.env.CLIENT_ID;
  const redirectUri = "http://localhost:3000/api/auth/callback/github";
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=repo`;

  return NextResponse.redirect(githubAuthUrl);
}
