import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    const { content } = await req.json();

    if (!content) {
      return NextResponse.json({ error: "No content provided" }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const result = await model.generateContent(
      `You are a professional README.md writer. Improve the following README:\n\n${content}`
    );

    const response = result.response.text();
    return NextResponse.json({ improvedReadme: response });
  } catch (err: any) {
    console.error("Gemini Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
