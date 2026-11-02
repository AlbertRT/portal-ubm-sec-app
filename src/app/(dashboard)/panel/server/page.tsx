"use client";

import { useState, useEffect } from "react";

type ServerInfo = {
  serverOS: string;
  release: string;
  arch: string;
  hostname: string;
};

export default function Page() {
  const [host, setHost] = useState("127.0.0.1");
  const [command, setCommand] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const [serverInfo, setServerInfo] = useState<ServerInfo | null>(null);

  useEffect(() => {
    fetch("/api/command")
      .then((res) => res.json())
      .then((data) => {
        if (data.serverOS) setServerInfo(data);
      })
      .catch(() => setServerInfo(null));
  }, []);

  async function handlePing() {
    setLoading(true);
    setOutput("Pinging server...");

    try {
      const response = await fetch("/api/ping", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ host }),
      });

      const data = await response.json();
      setOutput(data.output || data.error || "No output.");
    } catch {
      setOutput("Failed to connect to server.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCommand() {
    setLoading(true);
    setOutput("Executing command...");

    try {
      const response = await fetch("/api/command", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ host, command }),
      });

      const data = await response.json();
      setOutput(data.output || data.error || "No output.");
    } catch {
      setOutput("Failed to execute command.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full p-10">
      {/* Header */}
      <div className="w-full h-10 bg-linear-to-b from-gray-300 to-gray-200 flex items-center justify-between px-3 font-bold border border-gray-400">
        <p>Manage Server</p>
        <p className="font-mono text-sm font-normal">
          {serverInfo ? `${serverInfo.serverOS} (${serverInfo.arch})` : "..."}
        </p>
      </div>

      {/* Server Configuration */}
      <div className="border border-gray-400 p-4 mt-4">
        <p className="font-bold mb-3">Server Configuration</p>

        <div className="flex items-center gap-3">
          <label className="w-32">Server Address</label>
          <input
            className="border border-gray-400 px-2 py-1 flex-1"
            value={host}
            onChange={(e) => setHost(e.target.value)}
            placeholder="127.0.0.1"
          />
          <button
            onClick={handlePing}
            disabled={loading}
            className="border border-gray-500 bg-linear-to-b from-gray-200 to-gray-300 px-5 py-1 hover:from-gray-300 hover:to-gray-400 disabled:opacity-50"
          >
            {loading ? "Please wait..." : "Ping Server"}
          </button>
        </div>
      </div>

      {/* Command Execution */}
      <div className="border border-gray-400 p-4 mt-4">
        <p className="font-bold mb-3">Shell</p>

        <div className="flex gap-3">
          <input
            className="border border-gray-400 px-2 py-1 flex-1 font-mono"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            placeholder="Enter test command..."
          />
          <button
            onClick={handleCommand}
            disabled={loading || !command.trim()}
            className="border border-gray-500 bg-linear-to-b from-gray-200 to-gray-300 px-5 py-1 hover:from-gray-300 hover:to-gray-400 disabled:opacity-50"
          >
            Execute
          </button>
        </div>
      </div>

      {/* Output */}
      <div className="border border-gray-400 mt-4">
        <div className="h-9 bg-linear-to-b from-gray-300 to-gray-200 flex items-center px-3 font-bold border-b border-gray-400">
          Shell Output
        </div>

        <pre className="bg-black text-green-400 p-4 min-h-48 font-mono text-sm whitespace-pre-wrap overflow-auto">
          {output || "Waiting for command execution..."}
        </pre>
      </div>
    </div>
  );
}
