import { createHash } from "node:crypto";
const windows = new Map<string, { count: number; end: number }>();
export function allowRequest(request: Request, now = Date.now()) {
  const key = createHash("sha256")
    .update(
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local",
    )
    .digest("hex");
  for (const [key, value] of windows) if (value.end <= now) windows.delete(key);
  // shortcut: per-instance abuse protection; configure Vercel Firewall rate limits before scaling publicly.
  let window = windows.get(key);
  if (!window) {
    if (windows.size >= 10000) return false;
    window = { count: 0, end: now + 60000 };
    windows.set(key, window);
  }
  window.count++;
  return window.count <= 60;
}
