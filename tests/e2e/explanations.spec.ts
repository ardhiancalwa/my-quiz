import { test, expect } from "@playwright/test";
test("legacy results can load clearer explanations without changing scores", async ({
  page,
  request,
}, info) => {
  const session = await (
    await request.post("/api/session", {
      data: { mode: "practice", ids: ["grammar-1"], count: 1 },
    })
  ).json();
  const result = await (
    await request.post("/api/submit", {
      data: { token: session.token, answers: { "grammar-1": "A" } },
    })
  ).json();
  const explanation = result.reviews[0].explanation;
  result.reviews[0].explanation = {
    why: explanation.why,
    incorrect: explanation.incorrect,
    concept: explanation.concept,
    tip: explanation.tip,
  };
  result.reviews[0].question.version = 1;
  await page.goto("/progres");
  await page.locator("input[type=file]").setInputFiles({
    name: "legacy.json",
    mimeType: "application/json",
    buffer: Buffer.from(
      JSON.stringify({
        version: 1,
        history: [result],
        bookmarks: ["grammar-1"],
        active: null,
      }),
    ),
  });
  await expect(page.getByRole("status")).toContainText("berhasil digabungkan");
  await page.goto(`/hasil/${result.id}`);
  await page.locator("summary").first().click();
  await page.route("**/api/session", (route) =>
    route.fulfill({
      status: 503,
      contentType: "application/json",
      body: JSON.stringify({ error: "Tes koneksi terputus" }),
    }),
  );
  await page.getByRole("button", { name: "Perbarui pembahasan" }).click();
  await expect(
    page.getByRole("alert").filter({ hasText: "Tes koneksi terputus" }),
  ).toBeVisible();
  await expect(page.getByText("0 dari 1 soal benar")).toBeVisible();
  await page.unroute("**/api/session");
  await page.getByRole("button", { name: "Perbarui pembahasan" }).click();
  await expect(
    page.getByRole("heading", {
      name: "Cara menentukannya, langkah demi langkah",
    }),
  ).toBeVisible();
  await expect(page.locator(".reasoning-steps li")).toHaveCount(3);
  await expect(page.getByText("0 dari 1 soal benar")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Tips & trik untuk soal serupa" }),
  ).toBeVisible();
  await expect(page.locator(".distractor-explanation").first()).toContainText(
    "bentuk aktif",
  );
  await expect(
    page.getByRole("button", { name: "Perbarui pembahasan" }),
  ).toHaveCount(0);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({
    path: `docs/screenshots/explanation-${info.project.name}.png`,
    fullPage: true,
  });
  await page.reload();
  await page.locator("summary").first().click();
  await expect(page.locator(".reasoning-steps li")).toHaveCount(3);
  await page.goto("/progres");
  await expect(page.getByText("Latihan mandiri", { exact: true })).toHaveCount(
    1,
  );
});

test("explains error segments, listening clues and negative reading questions", async ({
  page,
  request,
}) => {
  const session = await (
    await request.post("/api/session", {
      data: {
        mode: "practice",
        ids: ["grammar-16", "listening-1", "reading-9"],
        count: 3,
      },
    })
  ).json();
  const result = await (
    await request.post("/api/submit", {
      data: { token: session.token, answers: {} },
    })
  ).json();
  await page.goto("/progres");
  await page.locator("input[type=file]").setInputFiles({
    name: "review.json",
    mimeType: "application/json",
    buffer: Buffer.from(
      JSON.stringify({
        version: 1,
        history: [result],
        bookmarks: [],
        active: null,
      }),
    ),
  });
  await expect(page.getByRole("status")).toContainText("berhasil digabungkan");
  await page.goto(`/hasil/${result.id}`);
  await expect(page.locator("details")).toHaveCount(3);
  for (const detail of await page.locator("details").all())
    await detail.locator("summary").click();
  await expect(
    page.getByRole("heading", { name: "Mengapa bagian lain tidak dipilih?" }),
  ).toBeVisible();
  await expect(page.locator(".corrected-sentence")).toContainText(
    "The librarian has arranged",
  );
  await expect(
    page.getByRole("heading", { name: "Bukti dari percakapan" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Bukti dari bacaan" }),
  ).toBeVisible();
  await expect(
    page.getByText("Klaim yang perlu ditolak", { exact: false }),
  ).toBeVisible();
  await expect(
    page.locator(".distractor-explanation").filter({ hasText: "lokasi lama" }),
  ).toHaveCount(1);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});
