// Disclosure Report — shared components.
//
// Used by both the PDF report (Document root) and the delivery email
// (Email root), so they only use elements both roots support.
// Svg lives in report.tsx only — email clients cannot draw it.

import {
  Column,
  Divider,
  Heading,
  LineBreak,
  List,
  ListItem,
  Row,
  Span,
  Table,
  TableCell,
  TableRow,
  Text,
  token,
} from "@hyper-elements/react";
import type { ReactNode } from "react";
import { finding } from "./data";

// Red severity badge: "HIGH" + CVSS score, on a dark-red block.
// Fixed widths keep the badge compact instead of stretching across the row.
export function SeverityBadge({ compact = false }: { compact?: boolean }) {
  return (
    <Row style={{ gap: 8 }}>
      <Column
        style={{
          backgroundColor: token("colors.severity"),
          padding: compact ? [4, 10] : [6, 14],
          borderRadius: 4,
          gap: 0,
          width: compact ? 86 : 104,
        }}
      >
        <Text
          style={{
            color: "#ffffff",
            fontWeight: 700,
            fontSize: compact ? 12 : 15,
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          {finding.severity}
        </Text>
      </Column>
      <Column
        style={{
          backgroundColor: token("colors.severityLight"),
          padding: compact ? [4, 10] : [6, 14],
          borderRadius: 4,
          gap: 0,
          width: compact ? 118 : 146,
          border: { width: 1, style: "solid", color: token("colors.severity") },
        }}
      >
        <Text style={{ color: token("colors.severityDark"), fontWeight: 700, fontSize: compact ? 12 : 15 }}>
          CVSS {finding.cvssScore}
        </Text>
      </Column>
    </Row>
  );
}

// Section heading with a short red rule underneath.
export function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <Column style={{ gap: 6 }}>
      <Heading level={2}>{children}</Heading>
      <Divider style={{ borderTop: { width: 2, style: "solid", color: token("colors.severity") }, width: 48 }} />
    </Column>
  );
}

// Two-column label/value table.
export function MetaTable({ rows }: { rows: [string, ReactNode][] }) {
  return (
    <Table
      style={{
        cellPadding: [7, 12],
        rowBorder: { width: 1, style: "solid", color: token("colors.border") },
      }}
    >
      {rows.map(([label, value]) => (
        <TableRow key={label}>
          <TableCell style={{ width: 150, color: token("colors.muted"), fontSize: 12 }}>
            {label}
          </TableCell>
          <TableCell>{value}</TableCell>
        </TableRow>
      ))}
    </Table>
  );
}

// List with a right-side compensation for the PDF layout engine: a List
// lays its items out as if the marker column cost no width, so a line
// that exactly fills the row renders ~24px past the right edge and its
// last characters are clipped. Narrowing the List by 28px removes the
// overflow without changing the look. (Paragraphs and tables wrap fine;
// only List items are affected.)
export function ReportList({
  type = "bullet",
  start,
  children,
}: {
  type?: "bullet" | "number";
  start?: number;
  children: ReactNode;
}) {
  return (
    <Column style={{ padding: [0, 28, 0, 0] }}>
      <List type={type} start={start}>
        {children}
      </List>
    </Column>
  );
}

// Dark code block: mono text, one Text per line.
export function CodeBlock({ code }: { code: string }) {
  const lines = code.split("\n");
  return (
    <Column style={{ apply: ["code"] }}>
      <Text
        style={{
          fontFamily: "Courier, monospace",
          fontSize: 11.5,
          lineHeight: 1.55,
          color: token("colors.codeText"),
        }}
      >
        {lines.map((line, i) => (
          <Span key={i}>
            {line === "" ? "\u00a0" : line}
            {i < lines.length - 1 ? <LineBreak /> : null}
          </Span>
        ))}
      </Text>
    </Column>
  );
}
