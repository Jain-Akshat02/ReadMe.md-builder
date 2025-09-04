import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { repo } = await req.json();

    const prompt = `
    Generate a detailed, well-structured GitHub README.md file for this repository:

    Name: ${repo.name}
    Description: ${repo.description || "No description provided"}
    Visibility: ${repo.private ? "Private" : "Public"}
    Stars: ${repo.stars}
    Forks: ${repo.forks}
    Language: ${repo.language || "Not specified"}
    Last updated: ${repo.updatedAt}

    The README should include:
    - A project overview
    - Installation/setup instructions
    - Usage examples
    - Contributing guidelines
    - License section (if appropriate)
    - Badges if relevant
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);

    const readme = result.response.text();

    return NextResponse.json({ readme });
  } catch (error) {
    console.error("README generation error:", error);
    return NextResponse.json({ error: "Failed to generate README" }, { status: 500 });
  }
}
