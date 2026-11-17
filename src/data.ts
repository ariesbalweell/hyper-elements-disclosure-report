// Disclosure Report — sample data.
//
// FICTIONAL DATA ONLY. The program, the researcher, the vulnerability,
// the endpoints, the dates and every detail below are invented for this
// template demonstration. Nothing here refers to a real program, a real
// finding, or any real bug-bounty work.

export const finding = {
  reportId: "NWB-2026-0147",
  program: "Northwind Bank",
  programTagline: "Bug Bounty Program",
  programContact: "security@northwind.example",
  researcher: "R. Alvarez",
  researcherHandle: "@vulnscout",
  researcherEmail: "r.alvarez@example.com",
  title:
    "Insecure Direct Object Reference (IDOR) exposes another customer's account statements",
  shortTitle: "IDOR in account statements",
  severity: "High",
  // 0-based index into ["Low", "Medium", "High", "Critical"] for the cover meter
  severityIndex: 2,
  cvssScore: "7.5",
  cvssVector: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:N/A:N",
  cwe: "CWE-639 — Authorization Bypass Through User-Controlled Key",
  owasp: "OWASP API1:2023 — Broken Object Level Authorization",
  asset: "banking.northwind.example",
  endpoint: "GET /api/v1/statements/{statementId}",
  status: "Fixed & verified",
  reportDate: "17 Nov 2026",

  summary:
    "The account-statements endpoint returns any customer's statement PDF when its numeric ID is changed, without checking that the statement belongs to the signed-in user. A logged-in customer can read another customer's full monthly statement — account number, balance, and every transaction — by incrementing the ID in the URL. The flaw is a missing ownership check on a single endpoint; no authentication bypass is needed.",

  scope: [
    "banking.northwind.example — web banking portal",
    "GET /api/v1/statements/{statementId} — statement download",
    "In scope: authenticated customer accounts (any tier)",
    "Out of scope: internal admin panel, third-party aggregators",
  ],

  timeline: [
    { date: "2 Nov 2026", event: "Discovered during routine testing of the statements page" },
    { date: "3 Nov 2026", event: "Reported to the Northwind security team with PoC" },
    { date: "4 Nov 2026", event: "Acknowledged — triaged as High, assigned to the banking API team" },
    { date: "12 Nov 2026", event: "Fix deployed — ownership check added to the endpoint" },
    { date: "13 Nov 2026", event: "Fix verified by the researcher — cross-account access now returns 403" },
    { date: "17 Nov 2026", event: "Coordinated disclosure — this report published" },
  ],

  pocSteps: [
    "Sign in as Customer A and open the statements page. Download the October statement — the request is GET /api/v1/statements/884101.",
    "Change the ID in the request to 884120, a statement that belongs to Customer B, and replay it with Customer A's session.",
    "The server returns 200 OK with Customer B's statement PDF — no ownership check runs.",
    "Repeat with other IDs: every statement on the platform is reachable the same way.",
  ],

  pocRequest: [
    "GET /api/v1/statements/884120 HTTP/1.1",
    "Host: banking.northwind.example",
    "Authorization: Bearer <session token of Customer A>",
    "Accept: application/pdf",
  ].join("\n"),

  pocResponse: [
    "HTTP/1.1 200 OK",
    "Content-Type: application/pdf",
    "Content-Disposition: attachment; filename=\"statement-884120.pdf\"",
    "",
    "-> Statement of Customer B: account •• 4417,",
    "  balance $18,204.11, 63 transactions.",
  ].join("\n"),

  impact: [
    "Any authenticated customer can read any other customer's monthly statements.",
    "Each statement discloses the full account number, balance, and every transaction — enough for fraud, phishing, and identity theft.",
    "No rate limit or anomaly detection on the endpoint, so statements can be harvested in bulk by iterating IDs.",
    "Regulatory exposure: customer financial records are protected data in every jurisdiction the bank operates in.",
  ],

  remediation:
    "Check ownership on every request before returning a statement: the statement's owner must match the signed-in user. Apply the same check to every endpoint that takes an object ID from the client — this pattern is usually systemic, not a one-off. Add a regression test that requests another customer's statement and expects 403, and log denied attempts so bulk enumeration is visible.",

  remediationCode: [
    "// statements controller — before returning the file",
    "if (statement.ownerId !== session.userId) {",
    "  audit.log('statement.access.denied', {",
    "    statementId, userId: session.userId",
    "  });",
    "  return res.status(403).json({ error: 'forbidden' });",
    "}",
    "return res.download(statement.filePath);",
  ].join("\n"),

  references: [
    "OWASP API Security Top 10 (2023) — API1 Broken Object Level Authorization",
    "CWE-639 — Authorization Bypass Through User-Controlled Key",
    "OWASP Cheat Sheet — Authorization (deny by default, check ownership server-side)",
  ],
};
