import { test, expect } from "@playwright/test";
test("valid progress import, keyboard cancellation and local reset", async ({
  page,
  request,
}) => {
  const response = await request.post("/api/session", {
    data: { mode: "practice", section: "grammar", count: 5 },
  });
  const session = await response.json();
  const graded = await request.post("/api/submit", {
    data: { token: session.token, answers: {} },
  });
  const result = await graded.json();
  const transfer = {
    name: "backup.json",
    mimeType: "application/json",
    buffer: Buffer.from(
      JSON.stringify({
        version: 1,
        history: [result],
        bookmarks: ["grammar-1"],
        active: null,
      }),
    ),
  };
  await page.goto("/progres");
  await page.locator("input[type=file]").setInputFiles(transfer);
  await expect(page.getByRole("status")).toContainText("berhasil digabungkan");
  await expect(
    page.getByText("Latihan mandiri", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Hapus seluruh progres lokal" })
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(
    page.getByText("Latihan mandiri", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Hapus seluruh progres lokal" })
    .click();
  await page
    .getByRole("button", { name: "Hapus progres", exact: true })
    .click();
  await expect(page.getByText("Latihan mandiri", { exact: true })).toHaveCount(
    0,
  );
  await expect(page.getByRole("status")).toContainText("telah dihapus");
  await page.locator("input[type=file]").setInputFiles(transfer);
  await expect(
    page.getByText("Latihan mandiri", { exact: true }),
  ).toBeVisible();
});
test("landing, layout and a complete persisted practice session", async ({
  page,
}, info) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Kenali polanya",
  );
  await page.screenshot({
    path: `docs/screenshots/home-${info.project.name}.png`,
    fullPage: true,
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.goto("/latihan?section=grammar");
  await page.getByLabel("Jumlah soal").selectOption("5");
  await page.getByRole("button", { name: "Mulai sesi latihan" }).click();
  await expect(page).toHaveURL("/sesi");
  await page.getByRole("radio").first().check();
  await page.getByRole("button", { name: "Simpan bookmark" }).click();
  await page.reload();
  await expect(page.getByRole("radio").first()).toBeChecked();
  await expect(
    page.getByRole("button", { name: "Hapus bookmark" }),
  ).toBeVisible();
  await page.screenshot({
    path: `docs/screenshots/session-${info.project.name}.png`,
    fullPage: true,
  });
  await page.getByRole("button", { name: "Akhiri latihan" }).click();
  await page.getByRole("button", { name: "Ya, kirim" }).click();
  await expect(page).toHaveURL(/\/hasil\//);
  await expect(
    page.getByRole("heading", { name: "Sekarang, pahami alasannya." }),
  ).toBeVisible();
  await page.locator("summary").first().click();
  await expect(
    page.getByRole("heading", { name: "Mengapa jawaban ini benar?" }).first(),
  ).toBeVisible();
  await page.goto("/progres");
  await expect(
    page.getByText("Latihan mandiri", { exact: true }),
  ).toBeVisible();
  await page.screenshot({
    path: `docs/screenshots/progress-${info.project.name}.png`,
    fullPage: true,
  });
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Ekspor JSON" }).click();
  await (
    await download
  ).saveAs(`test-results/progress-${info.project.name}.json`);
  await page.locator("input[type=file]").setInputFiles({
    name: "invalid.json",
    mimeType: "application/json",
    buffer: Buffer.from('{"version":999}'),
  });
  await expect(page.getByRole("status")).toContainText("File tidak valid");
  await expect(
    page.getByText("Latihan mandiri", { exact: true }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});
test("real listening audio plays and transcript is absent during practice", async ({
  page,
}) => {
  await page.goto("/latihan?section=listening");
  await page.getByRole("button", { name: "Mulai sesi latihan" }).click();
  await expect(page).toHaveURL("/sesi");
  const media = page.locator("audio");
  await media.evaluate(async (audio: HTMLAudioElement) => {
    await audio.play();
  });
  await expect
    .poll(() => media.evaluate((audio: HTMLAudioElement) => audio.currentTime))
    .toBeGreaterThan(0);
  await expect(page.getByText("Transcript", { exact: true })).toHaveCount(0);
  expect(
    await media.evaluate((audio: HTMLAudioElement) => audio.error),
  ).toBeNull();
});
test("exam deadline survives refresh and sections advance without revealing answers", async ({
  page,
}) => {
  await page.goto("/simulasi");
  await page.getByLabel("Saya sudah mendengar audio dengan jelas.").check();
  await page
    .getByRole("button", { name: "Mulai simulasi", exact: true })
    .click();
  await expect(page).toHaveURL("/sesi");
  const before = await page.locator(".timer").innerText();
  await page.reload();
  await expect(page.locator(".timer")).not.toContainText("Memuat");
  const after = await page.locator(".timer").innerText();
  expect(after.trim() <= before.trim()).toBe(true);
  await page.getByRole("button", { name: "Putar audio satu kali" }).click();
  await expect(
    page.getByRole("button", { name: "Audio sudah dimulai" }),
  ).toBeDisabled();
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Audio sudah dimulai" }),
  ).toBeDisabled();
  for (let i = 0; i < 3; i++) {
    await page.getByRole("button", { name: "Kirim bagian ini" }).click();
    await page.getByRole("button", { name: "Ya, kirim" }).click();
    if (i < 2)
      await expect(
        page.getByText(`SIMULASI · BAGIAN ${i + 2}/3`, { exact: false }),
      ).toBeVisible();
  }
  await expect(page).toHaveURL(/\/hasil\//);
  await expect(page.getByText("0 dari 140 soal benar")).toBeVisible();
});
test("API rejects invalid input, mismatched IDs and tampered tokens", async ({
  request,
}) => {
  expect(
    (
      await request.post("/api/session", {
        data: { mode: "exam", count: 9000 },
      })
    ).status(),
  ).toBe(400);
  const response = await request.post("/api/session", {
    data: { mode: "practice", section: "grammar", count: 5 },
  });
  expect(response.ok()).toBe(true);
  const session = await response.json();
  expect(session.questions[0]).not.toHaveProperty("correct");
  expect(session.questions[0]).not.toHaveProperty("explanation");
  expect(
    (
      await request.post("/api/submit", {
        data: { token: session.token + "x", answers: {} },
      })
    ).status(),
  ).toBe(400);
  expect(
    (
      await request.post("/api/submit", {
        data: { token: session.token, answers: { "reading-50": "A" } },
      })
    ).status(),
  ).toBe(400);
});
