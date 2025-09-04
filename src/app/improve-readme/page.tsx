"use client";

import { useState } from "react";
import axios from "axios";

export default function ImproveReadmePage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImprove = async () => {
    setLoading(true);
    try {
      const res = await axios.post("/api/gemini", { content: input });
      setOutput(res.data.improvedReadme);
    } catch (err) {
      console.error(err);
      setOutput("Error improving README");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-6">
      <h1 className="text-xl font-bold mb-4">Improve README with Gemini</h1>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste README content here..."
        className="w-full h-40 p-3 border rounded bg-slate-900 text-white"
      />

      <button
        onClick={handleImprove}
        disabled={loading}
        className="mt-3 px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
      >
        {loading ? "Improving..." : "Improve README"}
      </button>

      {output && (
        <div className="mt-6 p-4 border rounded bg-slate-800 text-slate-100 whitespace-pre-wrap">
          {output}
        </div>
      )}
    </main>
  );
}
