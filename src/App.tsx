import React, { useState } from "react";
import * as yaml from "js-yaml";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

function App() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [theme, setTheme] = useState("dark");

  const convertToJSON = () => {
    try {
      const obj = yaml.load(input);
      setOutput(JSON.stringify(obj, null, 2));
      setError("");
    } catch (e) {
      setError("❌ Invalid YAML input");
    }
  };

  const convertToYAML = () => {
    try {
      const obj = JSON.parse(input);
      setOutput(yaml.dump(obj));
      setError("");
    } catch (e) {
      setError("❌ Invalid JSON input");
    }
  };

  const formatJSON = () => {
    try {
      const obj = JSON.parse(input);
      setOutput(JSON.stringify(obj, null, 2));
      setError("");
    } catch (e) {
      setError("❌ Invalid JSON input");
    }
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
    setError("");
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
  };

  const downloadOutput = () => {
    const blob = new Blob([output], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = output.trim().startsWith("{") ? "output.json" : "output.yaml";
    link.click();
  };

  const toggleTheme = () => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.remove("dark");
      root.classList.add("light");
      setTheme("light");
    } else {
      root.classList.remove("light");
      root.classList.add("dark");
      setTheme("dark");
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-extrabold text-white">🔁 YAML ⇄ JSON Vibe Formatter</h1>
          <button className="text-sm border border-zinc-600 rounded px-2 py-1 hover:bg-zinc-700" onClick={toggleTheme}>
            Toggle {theme === "dark" ? "Light" : "Dark"} Mode
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-2 text-zinc-300">Input</label>
            <textarea
              rows={16}
              className="w-full p-3 rounded border font-mono shadow-sm border-zinc-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>

          <div>
            <label className="block font-semibold mb-2 text-zinc-300">Output</label>
            <div className="rounded border border-zinc-700 bg-zinc-800 p-3 overflow-auto max-h-[400px]">
              <SyntaxHighlighter language={output.trim().startsWith("{") ? "json" : "yaml"} style={vscDarkPlus} wrapLines>
                {output || ""}
              </SyntaxHighlighter>
            </div>
          </div>
        </div>

        {error && <div className="text-red-500 text-center font-medium">{error}</div>}

        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-500 transition" onClick={convertToJSON}>Convert to JSON</button>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-500 transition" onClick={convertToYAML}>Convert to YAML</button>
          <button className="bg-zinc-700 text-white px-4 py-2 rounded hover:bg-zinc-600 transition" onClick={formatJSON}>Format JSON</button>
          <button className="bg-zinc-800 text-zinc-300 px-4 py-2 rounded hover:bg-zinc-700 transition" onClick={clearAll}>Clear</button>
          <button className="border border-purple-400 text-purple-300 px-4 py-2 rounded hover:bg-purple-500 hover:text-white transition" onClick={copyOutput}>Copy</button>
          <button className="border border-indigo-400 text-indigo-300 px-4 py-2 rounded hover:bg-indigo-500 hover:text-white transition" onClick={downloadOutput}>Download</button>
        </div>
      </div>
    </div>
  );
}

export default App;
