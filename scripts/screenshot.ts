// Disclosure Report — screenshots for the README.
//
// Uses Playwright's headless Chromium to screenshot the rendered email
// (full page) and the Gmail client preview from the email emulator.
// The system Chromium (/opt/meta-chromium) refuses to start outside the
// managed browser service, so Playwright's own build is used instead.
//
// Run: npm run shots

import { chromium } from "playwright";
import { fileURLToPath } from "node:url";

const ROOT = new URL("../", import.meta.url);
const shots: Array<[string, string]> = [
  ["out/disclosure-email.html", "assets/email.png"],
  ["out/clients/gmail.html", "assets/email-gmail.png"],
];

const browser = await chromium.launch();
for (const [page, out] of shots) {
  const ctx = await browser.newPage({ viewport: { width: 700, height: 900 } });
  await ctx.goto(new URL(page, ROOT).href);
  await ctx.waitForTimeout(500);
  await ctx.screenshot({ path: new URL(out, ROOT).pathname, fullPage: true });
  console.log(`wrote ${out}`);
  await ctx.close();
}
await browser.close();
console.log("SHOTS OK");
