import { NextResponse } from "next/server";

export async function GET() {
  const clientId = process.env.NEXT_PUBLIC_CLIENT_ID;
  const redirectUri = "https://read-me-md-builder.vercel.app/api/auth/callback/github";
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=repo`;

  return NextResponse.redirect(githubAuthUrl);
}
