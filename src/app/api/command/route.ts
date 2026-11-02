import { NextResponse } from "next/server";
import { exec, execFile } from "child_process";
import { promisify } from "util";
import os from "os";

export const runtime = "nodejs";

const execAsync = promisify(exec);
const execFileAsync = promisify(execFile);

async function runCommand(command: string) {
  const options = {
    timeout: 10000,
    maxBuffer: 1024 * 1024,
    windowsHide: true,
  };

  if (process.platform === "win32") {
    // Paksa output UTF-8 biar karakter non-ASCII nggak rusak
    const script = `[Console]::OutputEncoding = [System.Text.Encoding]::UTF8; ${command}`;

    return execFileAsync(
      "powershell.exe", // atau "pwsh" kalau lu pakai PowerShell 7
      ["-NoProfile", "-NonInteractive", "-ExecutionPolicy", "Bypass", "-Command", script],
      options
    );
  }

  // Linux / Mac tetap pakai shell default (/bin/sh)
  return execAsync(command, options);
}

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);

// Handle "localhost:3000", "127.0.0.1:3000", dan "[::1]:3000"
function getHostname(hostHeader: string | null): string {
  if (!hostHeader) return "";
  if (hostHeader.startsWith("[")) {
    const end = hostHeader.indexOf("]");
    return end === -1 ? "" : hostHeader.slice(1, end);
  }
  return hostHeader.split(":")[0];
}

function isLocalOrigin(origin: string | null): boolean {
  // Request dari tool kayak curl biasanya nggak bawa Origin
  if (!origin) return true;
  try {
    return LOCAL_HOSTS.has(new URL(origin).hostname.replace(/^\[|\]$/g, ""));
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const hostname = getHostname(request.headers.get("host"));

    if (
      !LOCAL_HOSTS.has(hostname) ||
      !isLocalOrigin(request.headers.get("origin"))
    ) {
      return NextResponse.json({ error: "Local access only." }, { status: 403 });
    }

    const body = await request.json();
    const { command } = body;

    if (
      typeof command !== "string" ||
      !command.trim() ||
      command.length > 2000
    ) {
      return NextResponse.json({ error: "Invalid command." }, { status: 400 });
    }

    const { stdout, stderr } = await execAsync(command, {
      timeout: 10000,
      maxBuffer: 1024 * 1024,
      windowsHide: true,
      // shell default: /bin/sh (Linux/Mac), cmd.exe (Windows)
    });

    return NextResponse.json({
      success: true,
      output: stdout + (stderr ? `\n${stderr}` : ""),
      serverOS: `${os.type()} (${process.platform})`,
    });
  } catch (error: unknown) {
    const err = error as Error & {
      stdout?: string;
      stderr?: string;
      killed?: boolean;
    };

    return NextResponse.json({
      success: false,
      output: err.killed
        ? "Command execution timed out."
        : [err.stdout, err.stderr, err.message].filter(Boolean).join("\n"),
      serverOS: `${os.type()} (${process.platform})`,
    });
  }
}

function getServerInfo() {
  const names: Record<string, string> = {
    win32: "Windows",
    darwin: "macOS",
    linux: "Linux",
  };

  return {
    serverOS: names[process.platform] ?? process.platform,
    release: os.release(),
    arch: os.arch(),
    hostname: os.hostname(),
  };
}

export async function GET(request: Request) {
  const hostname = getHostname(request.headers.get("host"));

  if (!LOCAL_HOSTS.has(hostname)) {
    return NextResponse.json({ error: "Local access only." }, { status: 403 });
  }

  return NextResponse.json(getServerInfo());
}