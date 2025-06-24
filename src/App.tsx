import React, { useState } from "react";
import * as yaml from "js-yaml";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

function App() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"json" | "yaml" | "diff">("json");
  const [input2, setInput2] = useState("");
  const [diffOutput, setDiffOutput] = useState<React.ReactNode[]>([]);

  const handleFormat = () => {
    try {
      if (activeTab === "json") {
        const obj = JSON.parse(input);
        setOutput(JSON.stringify(obj, null, 2));
      } else if (activeTab === "yaml") {
        const obj = yaml.load(input);
        setOutput(yaml.dump(obj));
      }
      setError("");
    } catch (e) {
      setError(`❌ Invalid ${activeTab.toUpperCase()} input`);
    }
  };

  const handleDiff = () => {
    try {
      const obj1 = JSON.parse(input);
      const obj2 = JSON.parse(input2);
      const allKeys = new Set([...Object.keys(obj1), ...Object.keys(obj2)]);
      const lines: React.ReactNode[] = [];

      allKeys.forEach((key) => {
        const val1 = JSON.stringify(obj1[key]);
        const val2 = JSON.stringify(obj2[key]);

        if (val1 === val2) {
          lines.push(<div key={key} className="text-zinc-300">"{key}": {val1}</div>);
        } else {
          lines.push(<div key={`${key}-remove`} className="text-red-400">- "{key}": {val1}</div>);
          lines.push(<div key={`${key}-add`} className="text-green-400">+ "{key}": {val2}</div>);
        }
      });

      setDiffOutput(lines.length ? lines : [<div key="no-diff" className="text-green-400">✅ No differences</div>]);
      setError("");
    } catch (e) {
      setError("❌ Invalid JSON in one or both inputs");
    }
  };

  const clearAll = () => {
    setInput("");
    setInput2("");
    setOutput("");
    setDiffOutput([]);
    setError("");
  };

  const copyOutput = () => {
    const textOutput = activeTab === "diff"
      ? diffOutput.map((line) => (typeof line === 'string' ? line : ''))
      : output;
    navigator.clipboard.writeText(textOutput.toString());
  };

  const downloadOutput = () => {
    const blob = new Blob([
      activeTab === "diff" ? diffOutput.map((line) => (typeof line === 'string' ? line : '')).join("\n") : output
    ], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${activeTab}-output.txt`;
    link.click();
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="text-4xl font-extrabold text-white text-center">YAML & JSON Vibe Formatter</h1>

        <div className="flex justify-center space-x-4 pt-2">
          {['json', 'yaml', 'diff'].map(tab => (
            <button
              key={tab}
              className={`px-4 py-2 rounded capitalize ${activeTab === tab ? "bg-purple-600 text-white" : "bg-zinc-700 text-zinc-300"}`}
              onClick={() => setActiveTab(tab as any)}
            >
              {tab === 'diff' ? 'Compare JSON' : `Format ${tab}`}
            </button>
          ))}
        </div>

        {activeTab !== 'diff' && (
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
                <SyntaxHighlighter language={activeTab} style={vscDarkPlus} wrapLines>
                  {output || ""}
                </SyntaxHighlighter>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'diff' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-2 text-zinc-300">JSON A</label>
              <textarea
                rows={16}
                className="w-full p-3 rounded border font-mono shadow-sm border-zinc-700"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </div>
            <div>
              <label className="block font-semibold mb-2 text-zinc-300">JSON B</label>
              <textarea
                rows={16}
                className="w-full p-3 rounded border font-mono shadow-sm border-zinc-700"
                value={input2}
                onChange={(e) => setInput2(e.target.value)}
              />
            </div>
          </div>
        )}

        {activeTab === 'diff' && (
          <div>
            <label className="block font-semibold mb-2 text-zinc-300 mt-4">Differences</label>
            <div className="rounded border border-zinc-700 bg-zinc-800 p-3 overflow-auto max-h-[400px] font-mono text-sm space-y-1">
              {diffOutput}
            </div>
          </div>
        )}

        {error && <div className="text-red-500 text-center font-medium">{error}</div>}

        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <button
            className="bg-zinc-700 text-white px-4 py-2 rounded hover:bg-zinc-600 transition"
            onClick={activeTab === 'diff' ? handleDiff : handleFormat}
          >
            {activeTab === 'diff' ? 'Compare' : 'Format'}
          </button>
          <button className="bg-zinc-800 text-zinc-300 px-4 py-2 rounded hover:bg-zinc-700 transition" onClick={clearAll}>Clear</button>
          <button className="border border-purple-400 text-purple-300 px-4 py-2 rounded hover:bg-purple-500 hover:text-white transition" onClick={copyOutput}>Copy</button>
          <button className="border border-indigo-400 text-indigo-300 px-4 py-2 rounded hover:bg-indigo-500 hover:text-white transition" onClick={downloadOutput}>Download</button>
        </div>
      </div>
    </div>
  );
}

export default App;
