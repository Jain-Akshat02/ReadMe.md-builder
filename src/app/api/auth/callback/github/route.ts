import { NextResponse } from "next/server";
import axios from "axios";
import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";
import crypto from "crypto";

export async function GET(request: Request) {
  await dbConnect();

  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "No code returned" }, { status: 400 });
  }

  try {
    // Exchange "code" for "access_token"
    const tokenResponse = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        code,
      },
      { headers: { Accept: "application/json" } }
    );

    const accessToken = tokenResponse.data.access_token;

    const userRes = await axios.get("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const githubUser = userRes.data;

    //Save or update user in DB
    let user = await User.findOne({ githubId: githubUser.id });

    if (!user) {
      user = await User.create({
        githubId: githubUser.id,
        login: githubUser.login,
        name: githubUser.name,
        avatarUrl: githubUser.avatar_url,
        accessToken,
      });
    } else {
      user.accessToken = accessToken; // refresh token
      await user.save();
    }

    // Create session token
    const sessionToken = crypto.randomBytes(32).toString("hex");

    user.sessionToken = sessionToken;
    await user.save();

    // Set cookie with GitHub access token to match /api/me expectations
    const response = NextResponse.redirect("http://localhost:3000/profile");
    response.cookies.set("gh_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("OAuth Error:", error.message);
    return NextResponse.json(
      { error: error.message || "OAuth failed" },
      { status: 500 }
    );
  }
}
