
import { NextResponse } from "next/server";
import { execFile } from "child_process";
import { promisify } from "util";
import { isIP } from "net";

const execFileAsync = promisify(execFile);

export async function POST(request: Request) {
  try {
    const { host } = await request.json();

    if (typeof host !== "string" || !host.trim()) {
      return NextResponse.json(
        { error: "Host is required." },
        { status: 400 }
      );
    }

    const target = host.trim();

    // Validate IP address or hostname
    const validHostname =
      /^(?=.{1,253}$)[a-zA-Z0-9]+([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]+([a-zA-Z0-9-]*[a-zA-Z0-9])?)*$/;

    if (!isIP(target) && !validHostname.test(target)) {
      return NextResponse.json(
        { error: "Invalid hostname or IP address." },
        { status: 400 }
      );
    }

    const isWindows = process.platform === "win32";

    const args = isWindows
      ? ["-n", "4", target]
      : ["-c", "4", target];

    const { stdout, stderr } = await execFileAsync(
      "ping",
      args,
      {
        timeout: 10000,
        maxBuffer: 1024 * 1024,
      }
    );

    return NextResponse.json({
      success: true,
      output: stdout || stderr,
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      output:
        error.stdout ||
        error.stderr ||
        error.message ||
        "Ping failed.",
    });
  }
}
