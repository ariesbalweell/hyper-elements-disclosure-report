// Disclosure Report — build script (the validation gate).
//
// 1. validate() both templates (report + email, the email with the
//    email-clients plugin). Any error fails the build (exit 1).
// 2. renderPdf() the report -> out/disclosure-report.pdf
// 3. render() the report -> out/disclosure-report.html (print HTML)
// 4. render() the email -> out/disclosure-email.html + .txt
// 5. renderInEmailClients() the email -> out/clients/*.html (best effort)
// 6. outline() both, printed for a layout sanity check.
//
// Run: npm run build

import { mkdir, writeFile } from "node:fs/promises";
import {
  ElementsError,
  formatDiagnostics,
  outline,
  render,
  validate,
} from "@hyper-elements/react";
import { renderPdf } from "@hyper-elements/react/pdf";
import { emailClients, renderInEmailClients } from "@hyper-elements/email-clients";
import { DisclosureReport } from "../src/report";
import { DisclosureEmail } from "../src/email";
import { pdfFonts } from "./fonts";

const OUT = new URL("../out/", import.meta.url);

function fail(message: string, diagnostics?: unknown): never {
  console.error(`\nBUILD FAILED: ${message}`);
  if (diagnostics) console.error(formatDiagnostics(diagnostics as never));
  process.exit(1);
}

async function main() {
  await mkdir(OUT, { recursive: true });

  // ——— 1 · validate (build gate) ———
  console.log("== validate: report ==");
  const reportCheck = validate(<DisclosureReport />);
  console.log(formatDiagnostics(reportCheck.diagnostics) || "(no diagnostics)");
  if (!reportCheck.valid) fail("report validation failed", reportCheck.diagnostics);

  console.log("== validate: email (+ email-clients plugin) ==");
  const emailCheck = validate(<DisclosureEmail />, {
    plugins: [await emailClients()],
  });
  console.log(formatDiagnostics(emailCheck.diagnostics) || "(no diagnostics)");
  if (!emailCheck.valid) fail("email validation failed", emailCheck.diagnostics);

  // ——— 2 · PDF (with vendored fonts so layout measures what it draws) ———
  console.log("== renderPdf: report ==");
  const { pdf, diagnostics: pdfDiagnostics } = await renderPdf(<DisclosureReport />, {
    fonts: await pdfFonts(),
  });
  console.log(formatDiagnostics(pdfDiagnostics) || "(no diagnostics)");
  await writeFile(new URL("disclosure-report.pdf", OUT), pdf);
  console.log(`wrote out/disclosure-report.pdf (${pdf.length} bytes)`);

  // ——— 3 · print HTML ———
  const reportHtml = await render(<DisclosureReport />);
  console.log(formatDiagnostics(reportHtml.diagnostics) || "(no diagnostics)");
  await writeFile(new URL("disclosure-report.html", OUT), reportHtml.html);
  console.log(`wrote out/disclosure-report.html (${reportHtml.html.length} bytes)`);

  // ——— 4 · email HTML + text ———
  console.log("== render: email ==");
  const email = await render(<DisclosureEmail />);
  console.log(formatDiagnostics(email.diagnostics) || "(no diagnostics)");
  await writeFile(new URL("disclosure-email.html", OUT), email.html);
  await writeFile(new URL("disclosure-email.txt", OUT), email.text);
  console.log(`wrote out/disclosure-email.html (${email.html.length} bytes)`);
  console.log(`wrote out/disclosure-email.txt (${email.text.length} bytes)`);

  // ——— 5 · email-client previews (best effort) ———
  console.log("== renderInEmailClients: email ==");
  try {
    const { previews } = await renderInEmailClients(<DisclosureEmail />);
    await mkdir(new URL("clients/", OUT), { recursive: true });
    for (const preview of previews) {
      await writeFile(new URL(`clients/${preview.filename}`, OUT), preview.html);
    }
    console.log(`wrote ${previews.length} client previews to out/clients/`);
  } catch (e) {
    console.warn("WARNING: email-client emulator failed (non-fatal):", (e as Error).message);
  }

  // ——— 6 · outline ———
  console.log("== outline: report ==");
  console.log(outline(<DisclosureReport />));
  console.log("== outline: email ==");
  console.log(outline(<DisclosureEmail />));

  console.log("\nBUILD OK");
}

main().catch((e) => {
  if (e instanceof ElementsError) fail("render error", e.diagnostics);
  console.error(e);
  process.exit(1);
});
