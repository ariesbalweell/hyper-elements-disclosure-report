// Disclosure Report — shared theme.
//
// One theme drives both outputs (the PDF report and the delivery email).
// Palette is deliberately narrow: warm paper, warm ink, one red accent
// reserved for severity. Typography is Helvetica/Arial so the PDF renders
// with react-pdf's built-in Helvetica and the email stays client-safe.

import { defineTheme } from "@hyper-elements/react";

export const reportTheme = defineTheme({
  colors: {
    background: "#fafaf9",
    foreground: "#1c1917",
    primary: "#b91c1c",
    primaryForeground: "#ffffff",
    muted: "#57534e",
    border: "#e7e5e4",
    severity: "#b91c1c",
    severityDark: "#7f1d1d",
    severityLight: "#fef2f2",
    ink: "#1c1917",
    paper: "#fafaf9",
    card: "#ffffff",
    code: "#1c1917",
    codeText: "#f5f5f4",
  },
  fonts: {
    body: "Helvetica, Arial, sans-serif",
    heading: "Helvetica, Arial, sans-serif",
    mono: "Courier, monospace",
  },
  fontSizes: {
    body: 13,
  },
  lineHeights: {
    body: 1.6,
  },
  elements: {
    Heading: {
      by: {
        level: {
          1: { fontSize: 28, lineHeight: 1.2, mobile: { fontSize: 24 } },
          2: { fontSize: 19, lineHeight: 1.3, mobile: { fontSize: 17 } },
          3: { fontSize: 15, lineHeight: 1.4 },
        },
      },
    },
    Button: {
      borderRadius: 6,
      hover: { backgroundColor: "#7f1d1d" },
    },
  },
  styles: {
    card: {
      backgroundColor: "#ffffff",
      padding: 24,
      gap: 12,
      borderRadius: 8,
      border: { width: 1, style: "solid", color: "{colors.border}" },
    },
    code: {
      backgroundColor: "#1c1917",
      padding: 16,
      gap: 0,
      borderRadius: 6,
    },
  },
});
