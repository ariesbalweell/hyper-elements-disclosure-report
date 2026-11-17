// Disclosure Report — the delivery email (Email root).
//
// The email that carries the PDF report to the program's security team.
// Shares data.ts, the theme, and the shared components with the report,
// so the two outputs always agree on severity, IDs, and wording.

import {
  Button,
  Column,
  Divider,
  Email,
  Heading,
  LineBreak,
  Link,
  ListItem,
  Row,
  Section,
  Text,
  token,
} from "@hyper-elements/react";
import { finding } from "./data";
import { reportTheme } from "./theme";
import { MetaTable, ReportList, SectionTitle, SeverityBadge } from "./components";

export function DisclosureEmail() {
  return (
    <Email
      theme={reportTheme}
      width={600}
      previewText={`New vulnerability report: ${finding.shortTitle} — Severity ${finding.severity} (CVSS ${finding.cvssScore})`}
      title={`${finding.reportId} — Vulnerability report`}
      lang="en"
      style={{ backgroundColor: "#f4f4f5", gap: 16 }}
    >
      {/* Dark brand band */}
      <Section style={{ backgroundColor: token("colors.ink"), padding: [20, 24] }}>
        <Row>
          <Column style={{ flex: 1 }}>
            <Text style={{ color: "#ffffff", fontWeight: 700, letterSpacing: 2, fontSize: 12, textTransform: "uppercase" }}>
              {finding.program}
            </Text>
          </Column>
          <Column>
            <Text style={{ color: "#a8a29e", fontSize: 12, textAlign: "right" }}>{finding.programTagline}</Text>
          </Column>
        </Row>
      </Section>

      <Column style={{ apply: ["card"], mobile: { padding: 16 } }}>
        <Heading level={1} style={{ mobile: { fontSize: 22 } }}>
          Vulnerability report submitted
        </Heading>

        <Text>
          Hello {finding.program} security team,
        </Text>
        <Text>
          I am reporting a vulnerability I found in the {finding.program} web banking portal.
          The full report is attached as a PDF — the summary below is what it contains.
        </Text>

        <SeverityBadge compact />

        <Column style={{ gap: 8 }}>
          <Heading level={2} style={{ fontSize: 17 }}>
            {finding.title}
          </Heading>
          <Text>{finding.summary}</Text>
        </Column>

        <MetaTable
          rows={[
            ["Report ID", finding.reportId],
            ["Severity", `${finding.severity} (CVSS ${finding.cvssScore})`],
            ["Asset", finding.asset],
            ["Endpoint", finding.endpoint],
            ["Status", finding.status],
            ["Date", finding.reportDate],
          ]}
        />

        <Column style={{ gap: 8 }}>
          <SectionTitle>What is attached</SectionTitle>
          <ReportList type="bullet">
            <ListItem>
              Disclosure Report {finding.reportId} (PDF, 4 pages) — executive summary, severity
              and scope, proof of concept, impact, and remediation.
            </ListItem>
            <ListItem>Proof-of-concept request and response for the affected endpoint.</ListItem>
            <ListItem>Suggested code fix and regression-test notes.</ListItem>
          </ReportList>
        </Column>

        <Button href={`https://northwind.example/security/reports/${finding.reportId}`}>
          Download the report (PDF)
        </Button>

        <Column style={{ gap: 8 }}>
          <SectionTitle>What I ask</SectionTitle>
          <ReportList type="number">
            <ListItem>Confirm receipt of this report.</ListItem>
            <ListItem>Share the triage outcome and an estimated fix timeline.</ListItem>
            <ListItem>Coordinate public disclosure with me once the fix is verified.</ListItem>
          </ReportList>
        </Column>

        <Divider style={{ borderTop: { width: 1, style: "solid", color: token("colors.border") } }} />

        <Text>
          Thank you for running this program.
          <LineBreak />
          {finding.researcher} ({finding.researcherHandle}) —{" "}
          <Link href={`mailto:${finding.researcherEmail}`}>{finding.researcherEmail}</Link>
        </Text>
      </Column>

      <Text style={{ fontSize: 11, color: token("colors.muted"), textAlign: "center" }}>
        Sample email — fictional finding for demonstration purposes.
        <LineBreak />
        Sent from the Disclosure Report template · {finding.program} {finding.programTagline}
      </Text>
    </Email>
  );
}

export default DisclosureEmail;
