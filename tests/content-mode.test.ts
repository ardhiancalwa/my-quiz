import { afterEach, describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});
describe("content mode for a local production build", () => {
  it("serves the complete bundled bank when preview is explicitly configured", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("CONTENT_MODE", "demo");
    vi.stubEnv("DATABASE_URL", "");
    vi.resetModules();
    const content = await import("../src/lib/content");
    expect(content.isDemo).toBe(true);
    expect(await content.getBank()).toHaveLength(720);
    expect(await content.getExamPackages()).toHaveLength(3);
    expect(await content.getExamBank("original-demo-3")).toHaveLength(140);
  });
  it("does not silently expose draft content in unconfigured production", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("CONTENT_MODE", "");
    vi.stubEnv("DATABASE_URL", "");
    vi.resetModules();
    const content = await import("../src/lib/content");
    expect(content.isDemo).toBe(false);
    await expect(content.getBank()).rejects.toThrow(
      "Database belum dikonfigurasi.",
    );
    await expect(content.getExamPackages()).rejects.toThrow();
    await expect(content.getExamBank()).rejects.toThrow();
  });
});
