import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "No code returned" }, { status: 400 });
  }

  try {
    // Step 1: Exchange "code" for "access_token"
    const tokenResponse = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        code,
      },
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    const accessToken = tokenResponse.data.access_token;

    const response = NextResponse.redirect("http://localhost:3000/profile");
    response.cookies.set("gh_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "OAuth failed" },
      { status: 500 }
    );
  }
}
