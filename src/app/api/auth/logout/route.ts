import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(req: Request) {
  await dbConnect();

  // Read cookie
  const sessionToken = req.headers.get("cookie")
    ?.split("; ")
    .find((c) => c.startsWith("gh_token="))
    ?.split("=")[1];

  if (sessionToken) {
    // clear it from DB
    await User.updateOne({ sessionToken }, { $unset: { sessionToken: 1 } });
  }

  // Clear cookie and redirect to homepage
  const res = NextResponse.redirect("http://localhost:3000/");
  res.cookies.set("gh_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0, // expires immediately
  });

  return res;
}
