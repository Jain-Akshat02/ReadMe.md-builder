import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

if (!process.env.GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY environment variable is not set");
}

export async function POST(req: Request) {
  try {
    const { repo } = await req.json();

    if (!repo || !repo.name) {
      return NextResponse.json({ error: "Repository data is required" }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "GEMINI_API_KEY environment variable is not configured" }, { status: 500 });
    }

    const prompt = `
    ROLE: You are an expert technical writer.

    GOAL: Produce a professional README.md (GitHub-flavored Markdown) that MUST:
    - Use emoji-prefixed, bold headings for EVERY top-level section.
    - Start with the project title line as: "# 📘 **${repo.name}**".
    - Include relevant emojis throughout (tasteful, not spammy).
    - Be skimmable: short paragraphs, bullet lists, and code fences for commands.
    - Contain only pure Markdown (NO triple-backtick wrapper around the whole output).

    REPOSITORY DETAILS:
    - Name: ${repo.name}
    - Description: ${repo.description || "No description provided"}
    - Visibility: ${repo.private ? "Private" : "Public"}
    - Stars: ${repo.stars}
    - Forks: ${repo.forks}
    - Language: ${repo.language || "Not specified"}
    - Last updated: ${repo.updatedAt}

    REQUIRED SECTION SCAFFOLD (use exactly these headings with emoji + bold):
    1) # 📘 **${repo.name}**
       - One-line tagline beneath the title.
    2) 🚀 **Overview**
    3) 🧱 **Features**
    4) 🛠️ **Installation**
    5) ▶️ **Usage**
    6) 🧪 **Testing** (include if applicable; otherwise add a brief note)
    7) 📦 **Configuration** (env vars/settings)
    8) 🤝 **Contributing**
    9) 📄 **License** (add placeholder if unknown)
    10) 🏷️ **Badges** (provide example badge Markdown)

    IMPORTANT:
    - The first line MUST be exactly the title format above with emoji + bold.
    - All section headings MUST begin with an emoji and bold text as shown.
    - Output ONLY the Markdown content. Do not surround the entire output in code fences.
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);

    const readme = result.response.text();

    return NextResponse.json({ readme });
  } catch (error: any) {
    console.error("README generation error:", error);
    console.error("Error details:", error.message, error.stack);
    return NextResponse.json({ 
      error: error.message || "Failed to generate README",
      details: error.toString()
    }, { status: 500 });
  }
}
