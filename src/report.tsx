// Disclosure Report — the PDF report (Document root).
//
// A4, four pages: cover, severity & scope, proof of concept, impact &
// remediation. Renders to print HTML with render() and to PDF with
// renderPdf() from @hyper-elements/react/pdf.

import {
  Column,
  Divider,
  Document,
  Heading,
  ListItem,
  PageFooter,
  PageHeader,
  PageNumber,
  Rect,
  Row,
  Span,
  Svg,
  Table,
  TableCell,
  TableRow,
  Text,
  token,
} from "@hyper-elements/react";
import { finding } from "./data";
import { reportTheme } from "./theme";
import { CodeBlock, MetaTable, ReportList, SectionTitle, SeverityBadge } from "./components";

const SEVERITY_SCALE = ["Low", "Medium", "High", "Critical"];

// Four-segment severity meter drawn with Svg (Document-only element).
function SeverityMeter() {
  const segW = 117;
  const gap = 4;
  return (
    <Column style={{ gap: 6 }}>
      <Svg width={480} height={14} viewBox="0 0 480 14">
        {SEVERITY_SCALE.map((_, i) => (
          <Rect
            key={i}
            x={i * (segW + gap)}
            y={0}
            width={segW}
            height={14}
            rx={3}
            style={{ fill: i <= finding.severityIndex ? token("colors.severity") : "#e7e5e4" }}
          />
        ))}
      </Svg>
      <Row style={{ gap: 4 }}>
        {SEVERITY_SCALE.map((label, i) => (
          <Column key={label} style={{ flex: 1, gap: 0 }}>
            <Text
              style={{
                fontSize: 10,
                textAlign: "center",
                color: i === finding.severityIndex ? token("colors.severityDark") : token("colors.muted"),
                fontWeight: i === finding.severityIndex ? 700 : 400,
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              {label}
            </Text>
          </Column>
        ))}
      </Row>
    </Column>
  );
}

function ReportHeader() {
  return (
    <PageHeader>
      <Column style={{ gap: 4 }}>
        <Row style={{ justifyContent: "space-between" }}>
          <Text style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", fontWeight: 700 }}>
            {finding.program} — Security Disclosure
          </Text>
          <Text style={{ fontSize: 10, color: token("colors.muted") }}>{finding.reportId}</Text>
        </Row>
        <Divider style={{ borderTop: { width: 1, style: "solid", color: token("colors.border") } }} />
      </Column>
    </PageHeader>
  );
}

function ReportFooter() {
  return (
    <PageFooter>
      <Column style={{ gap: 4 }}>
        <Divider style={{ borderTop: { width: 1, style: "solid", color: token("colors.border") } }} />
        <Row style={{ justifyContent: "space-between" }}>
          <Text style={{ fontSize: 9, color: token("colors.muted") }}>
            Sample data — fictional finding for demonstration purposes.
          </Text>
          <Text style={{ fontSize: 9, color: token("colors.muted") }}>
            Page <PageNumber /> of <PageNumber total />
          </Text>
        </Row>
      </Column>
    </PageFooter>
  );
}

export function DisclosureReport() {
  return (
    <Document
      theme={reportTheme}
      size="A4"
      orientation="portrait"
      margin={48}
      title={`${finding.reportId} — ${finding.shortTitle}`}
      lang="en"
      style={{ gap: 0 }}
    >
      <ReportHeader />

      {/* ——— Page 1 · Cover ——— */}
      <Document.Page>
        <Column style={{ gap: 20 }}>
          <Column style={{ gap: 6 }}>
            <Text style={{ fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: token("colors.muted"), fontWeight: 700 }}>
              {finding.program} · {finding.programTagline}
            </Text>
            <Heading level={1}>{finding.title}</Heading>
          </Column>

          <SeverityBadge />
          <SeverityMeter />

          <MetaTable
            rows={[
              ["Report ID", finding.reportId],
              ["Researcher", `${finding.researcher} (${finding.researcherHandle})`],
              ["Date", finding.reportDate],
              ["Status", finding.status],
              ["Asset", finding.asset],
              ["Endpoint", finding.endpoint],
            ]}
          />

          <Column style={{ gap: 8 }}>
            <SectionTitle>Executive summary</SectionTitle>
            <Text>{finding.summary}</Text>
          </Column>

          <Text style={{ fontSize: 11, color: token("colors.muted") }}>
            This report was prepared for the {finding.program} security team under its coordinated
            disclosure policy. All data in this document is fictional and shown for demonstration
            purposes only.
          </Text>
        </Column>
      </Document.Page>

      {/* ——— Page 2 · Severity & scope ——— */}
      <Document.Page>
        <Column style={{ gap: 20 }}>
          <Column style={{ gap: 8 }}>
            <SectionTitle>Severity summary</SectionTitle>
            <Table
              style={{
                cellPadding: [7, 12],
                rowBorder: { width: 1, style: "solid", color: token("colors.border") },
              }}
            >
              <TableRow header>
                <TableCell>Field</TableCell>
                <TableCell>Value</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Severity</TableCell>
                <TableCell>
                  <Span style={{ fontWeight: 700, color: token("colors.severity") }}>
                    {finding.severity}
                  </Span>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>CVSS 3.1 score</TableCell>
                <TableCell>{finding.cvssScore}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>CVSS vector</TableCell>
                <TableCell>{finding.cvssVector}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Weakness</TableCell>
                <TableCell>{finding.cwe}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>OWASP</TableCell>
                <TableCell>{finding.owasp}</TableCell>
              </TableRow>
            </Table>
          </Column>

          <Column style={{ gap: 8 }}>
            <SectionTitle>Affected scope</SectionTitle>
            <ReportList type="bullet">
              {finding.scope.map((item) => (
                <ListItem key={item}>{item}</ListItem>
              ))}
            </ReportList>
          </Column>

          <Column style={{ gap: 8 }}>
            <SectionTitle>Timeline</SectionTitle>
            <Table
              style={{
                cellPadding: [7, 12],
                rowBorder: { width: 1, style: "solid", color: token("colors.border") },
              }}
            >
              <TableRow header>
                <TableCell>Date</TableCell>
                <TableCell>Event</TableCell>
              </TableRow>
              {finding.timeline.map((step) => (
                <TableRow key={step.date}>
                  <TableCell style={{ width: 110 }}>{step.date}</TableCell>
                  <TableCell>{step.event}</TableCell>
                </TableRow>
              ))}
            </Table>
          </Column>
        </Column>
      </Document.Page>

      {/* ——— Page 3 · Proof of concept ——— */}
      <Document.Page>
        <Column style={{ gap: 20 }}>
          <Column style={{ gap: 8 }}>
            <SectionTitle>Proof of concept</SectionTitle>
            <Text>
              The vulnerability reproduces with an ordinary customer account — no special tooling
              or elevated privileges are needed. Statement IDs are sequential, so any statement
              can be reached by changing one number.
            </Text>
            <ReportList type="number">
              {finding.pocSteps.map((step) => (
                <ListItem key={step.slice(0, 24)}>{step}</ListItem>
              ))}
            </ReportList>
          </Column>

          <Column style={{ gap: 8 }}>
            <Heading level={3}>Request — Customer A asks for Customer B's statement</Heading>
            <CodeBlock code={finding.pocRequest} />
          </Column>

          <Column style={{ gap: 8 }}>
            <Heading level={3}>Response — the server complies</Heading>
            <CodeBlock code={finding.pocResponse} />
            <Text style={{ fontSize: 11, color: token("colors.muted") }}>
              The full statement PDF is attached to the original report. The excerpt above is
              truncated to the identifying fields.
            </Text>
          </Column>
        </Column>
      </Document.Page>

      {/* ——— Page 4 · Impact & remediation ——— */}
      <Document.Page>
        <Column style={{ gap: 20 }}>
          <Column style={{ gap: 8 }}>
            <SectionTitle>Impact</SectionTitle>
            <ReportList type="bullet">
              {finding.impact.map((item) => (
                <ListItem key={item.slice(0, 24)}>{item}</ListItem>
              ))}
            </ReportList>
          </Column>

          <Column style={{ gap: 8 }}>
            <SectionTitle>Remediation</SectionTitle>
            <Text>{finding.remediation}</Text>
            <Heading level={3}>Suggested fix</Heading>
            <CodeBlock code={finding.remediationCode} />
          </Column>

          <Column style={{ gap: 8 }}>
            <SectionTitle>References</SectionTitle>
            <ReportList type="bullet">
              {finding.references.map((ref) => (
                <ListItem key={ref.slice(0, 24)}>{ref}</ListItem>
              ))}
            </ReportList>
          </Column>

          <Text style={{ fontSize: 11, color: token("colors.muted") }}>
            Disclosure note: this document is a template sample. The program, the researcher, the
            vulnerability and every detail in it are fictional, created to demonstrate the
            Disclosure Report template.
          </Text>
        </Column>
      </Document.Page>

      <ReportFooter />
    </Document>
  );
}

export default DisclosureReport;
