// Disclosure Report — fonts for the PDF build.
//
// renderPdf() loads no fonts itself, and the standard PDF fonts measure
// text slightly differently from how they draw it, which clipped the last
// characters of full lines in lists. Giving renderPdf() real font files
// makes layout and rendering measure with the same metrics.
//
// Liberation Sans / Mono are metric-compatible with Arial / Courier and
// SIL OFL licensed; the files are vendored in fonts/ so the build works
// on any machine. The template names "Helvetica" and "Courier", so the
// files are registered under those family names.

import { readFile } from "node:fs/promises";

const FONTS_DIR = new URL("../fonts/", import.meta.url);

type PdfFontInput = {
  family: string;
  src: Uint8Array;
  weight?: number;
  style?: "normal" | "italic";
};

export async function pdfFonts(): Promise<PdfFontInput[]> {
  const load = async (file: string) =>
    new Uint8Array(await readFile(new URL(file, FONTS_DIR)));
  return [
    { family: "Helvetica", src: await load("LiberationSans-Regular.ttf"), weight: 400 },
    { family: "Helvetica", src: await load("LiberationSans-Bold.ttf"), weight: 700 },
    { family: "Helvetica", src: await load("LiberationSans-Italic.ttf"), weight: 400, style: "italic" },
    { family: "Helvetica", src: await load("LiberationSans-BoldItalic.ttf"), weight: 700, style: "italic" },
    { family: "Courier", src: await load("LiberationMono-Regular.ttf"), weight: 400 },
    { family: "Courier", src: await load("LiberationMono-Bold.ttf"), weight: 700 },
    { family: "Courier", src: await load("LiberationMono-Italic.ttf"), weight: 400, style: "italic" },
    { family: "Courier", src: await load("LiberationMono-BoldItalic.ttf"), weight: 700, style: "italic" },
  ];
}
