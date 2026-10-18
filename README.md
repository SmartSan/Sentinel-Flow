# SentinelFlow — Context-Aware AI Integration with Existing Banking Systems to Prevent & Safeguard

> **Let’s be Proactive · A Step Ahead in the AI Age · Not Just React, Prevent**  
> **Using Google Gemini advanced model interpretation, freeze suspicious transfers before the amount is lost.**  
> **Team Linux C Group** — Shruthi Jha & Sanjay  
> *Helpful AI assistant to prevent incidents and have HITL Security Analyst Review.*

---

## 1. Overview & Problem Statement

Across India and APAC, Banking, Financial Services, and Insurance (**BFSI**) institutions face an unprecedented wave of **psychological coercion scams** (**"Digital Arrest" extortion**, **Fake VIP Stock Trading / QIB IPO Escrows**, and **Remote-Access Senior Citizen APK Takeovers**) alongside multi-channel account compromises.

### Why Legacy Bank Rules Fail
Traditional fraud engines and SIEM rules are reactive: they check whether the login device is recognized and whether the customer entered a valid 2FA OTP. In a **Digital Arrest** or **VIP Investment** scam, an elderly retiree is held under continuous WhatsApp/Skype video-call surveillance by fraudsters impersonating CBI, Police, RBI, or SEBI officials and **types their own OTPs** while breaking life-savings Fixed Deposits (FDs) to wire funds via RTGS/IMPS.

Meanwhile, bank SOC and Fraud analysts suffer from **Alert Fatigue**:
- **Fragmented Telemetry**: Mobile EDR call-overlay flags, Core Banking FD closure logs, RTGS beneficiary additions, and uploaded transfer justification PDFs sit in separate consoles.
- **Unreliable Generic AI**: Passing raw logs to an unconstrained chatbot causes hallucinated event IDs, missed prompt-injection strings, or unsafe autonomous account-blocking recommendations.

### How SentinelFlow Solves This
**SentinelFlow** is a bank-side, human-in-the-loop (**HITL**) AI security and scam triage workbench that integrates directly with existing banking systems. It enforces a strict separation of duties:
1. **Deterministic Code Establishes the Facts**: Normalizes logs, strips prompt-injection strings, correlates multi-source events across a 30-minute sliding window, and computes transparent rule-based severity scores.
2. **Google Cloud Enriches the Context**: Combines **Cloud Pub/Sub**, **BigQuery** 48-hour historical velocity & mule fan-in graphs, **Document AI** forged warrant/contract inspection, and **Vertex AI Search** regulatory SOP retrieval.
3. **Gemini on Vertex AI Explains the Evidence**: Produces a schema-bound JSON incident brief with clickable `EVT-*` citations, benign alternatives, and an **Empathetic Senior Citizen Welfare Call & De-Escalation Script**.
4. **Deterministic Code Validates the AI**: Our **Output Validator** verifies 100% of cited `EVT-*` and `DOC-*` IDs against the case and blocks any autonomous containment claims before display.
5. **Human Analysts (HITL) Decide**: Analysts place a reversible **24-hour Senior Protection Cooling Hold** (`Reviewing`), counsel the customer out-of-band, and either permanently block the scam transfer (`Escalated`) or release legitimate funds (`Dismissed`).

---

## 2. End-to-End 7-Step System Architecture

```text
+---------------------------------------------------------------------------------------------------+
|                        EXISTING BANKING TELEMETRY & GOOGLE CLOUD INGESTION                        |
|  • Cloud Pub/Sub Live Alert Stream (Zero-Upload Real-Time Telemetry)                              |
|  • Core Banking (FD Closures, RTGS/IMPS/FAST Switches), Mobile SDK / EDR, IAM & VPN Logs          |
|  • On-Demand CSV Batch Upload (with Malformed-Row Diagnostics & Prompt-Injection Sanitizer)       |
+-------------------------------------------------+-------------------------------------------------+
                                                  |
                                                  v
+---------------------------------------------------------------------------------------------------+
| STEP 1 & 2: DETERMINISTIC INGESTION, VALIDATION & NORMALIZATION (src/engine/triageEngine.ts)      |
|  • Validates required fields (timestamp, source_type, event_type, user, src_ip, asset, severity)  |
|  • Rejects malformed rows with line-level error reasons; assigns immutable EVT-* identifiers      |
|  • Sanitizes log details against embedded prompt-injection instructions                           |
+-------------------------------------------------+-------------------------------------------------+
                                                  |
                                                  v
+---------------------------------------------------------------------------------------------------+
| STEP 3 & 4: RULE-BASED CORRELATION & TRANSPARENT SEVERITY SCORING (Deterministic Code)            |
|  • Groups events by User, Source IP, and Asset across a 30-minute sliding window                  |
|  • Evaluates explicit BFSI Scam & Security Rules:                                                 |
|    - Active Video-Call Coercion Overlay + Senior FD Liquidation + High-Value RTGS (+76 pts)       |
|    - Rapid Beneficiary Additions + Split IMPS/NEFT Tranches + Clipboard Paste (+68 pts)           |
|    - Sideloaded APK + Auth Failures -> Unseen Offshore IP -> Token Binding (+74 pts)              |
|  • Enriches case with:                                                                            |
|    - BigQuery 48-Hour Mule Fan-In & 90-Day Customer Velocity Baselines                            |
|    - Document AI Forged CBI Warrant / Fake SEBI Broker Contract Analysis (DOC-*)                  |
|    - Vertex AI Search Grounded Regulatory SOPs (RBI CFCFRMS, MHA I4C 1930, MAS TRM)               |
+-------------------------------------------------+-------------------------------------------------+
                                                  |
                                                  v
+---------------------------------------------------------------------------------------------------+
| STEP 5: GEMINI ON VERTEX AI — SCHEMA-BOUND INCIDENT BRIEF GENERATOR (server.ts)                   |
|  • Receives ONLY the correlated case subset (~380 tokens/case)                                    |
|  • Enforces strict responseSchema JSON output:                                                    |
|    - summary, severity_rationale, scam_typology_diagnosis                                         |
|    - timeline_highlights[] (with mandatory EVT-* citations)                                       |
|    - evidence_event_ids[], uncertainty_and_benign_causes                                          |
|    - elderly_deescalation_script[] (Out-of-band customer welfare call talking points)             |
|    - recommended_next_steps[]                                                                     |
+-------------------------------------------------+-------------------------------------------------+
                                                  |
                                                  v
+---------------------------------------------------------------------------------------------------+
| STEP 6: DETERMINISTIC OUTPUT VALIDATOR (Code-Verified Guardrail Before UI Display)                |
|  • Referential Integrity Check: Verifies 100% of cited EVT-* and DOC-* IDs exist in the case      |
|  • Policy Guardrail: Rejects any brief claiming autonomous firewall blocks or account freezes     |
|  • Severity Alignment Check: Ensures narrative matches deterministic High / Medium / Low score    |
+-------------------------------------------------+-------------------------------------------------+
                                                  |
                                                  v
+---------------------------------------------------------------------------------------------------+
| STEP 7: HUMAN-IN-THE-LOOP (HITL) ANALYST WORKBENCH & AUDIT LEDGER (src/App.tsx)                   |
|  • Institutional Role Authentication (Raman · Lead HITL | Sanjay · Principal SOC | Shruthi Jha)   |
|  • Disposition Controls: New -> Reviewing (24h Cooling Hold) -> Escalated (1930 Report) / Dismissed|
|  • Tracks Elderly Life Savings Safeguarded (₹) and immutable analyst audit trail                  |
+---------------------------------------------------------------------------------------------------+
```

---

## 3. Google Cloud BFSI Technology Stack

| Google Cloud Service | Role in SentinelFlow BFSI Architecture |
| :--- | :--- |
| **Gemini on Vertex AI** (`@google/genai`) | Synthesizes correlated case signals into schema-bound JSON incident briefs, benign explanations, and empathetic Senior Citizen Welfare Call scripts. |
| **Google Cloud Pub/Sub** | Streams real-time authentication, mobile SDK call-overlay, FD liquidation, and RTGS/IMPS alerts into the correlation engine without requiring manual CSV uploads. |
| **BigQuery** | Computes 90-day customer transfer velocity baselines and 48-hour beneficiary mule-account fan-in graphs across branches. |
| **Document AI** | Inspects customer-uploaded transfer justifications (`DOC-101` forged CBI/Supreme Court Digital Arrest warrant; `DOC-102` fake SEBI QIB broker allotment contract) for entity mismatches and seal forgery confidence. |
| **Vertex AI Search** | Retrieves grounded regulatory runbooks (**RBI Digital Payment Security Controls**, **MHA I4C 1930 National Cybercrime Reporting SOPs**, **SEBI Public Caution Notices**, and **MAS TRM Guidelines**). |
| **Cloud Run** | Hosts the stateless full-stack Node.js/Express and React workbench inside the bank's sovereign VPC (`asia-south1` Mumbai, `asia-south2` Delhi, `asia-southeast1` Singapore). |
| **Cloud SQL / AlloyDB** | Target persistence layer for correlated case states, HITL analyst audit trails, and 1930 CFCFRMS lien-freeze records. |

---

## 4. Production Reference Scenarios (India & APAC Banks)

SentinelFlow comes pre-configured with **3 flagship India/APAC banking scam scenarios** plus the **3 Slide 6 Reference Wireframe cases**:

### Scenario 1: GDFC Bank & National Overseas Bank (NOB) — Senior Citizen "Digital Arrest" Coercion (`CASE-101`)
- **Customer**: R. Venkataraman (72-year-old retired civil engineer, Chennai)
- **Amount at Risk**: **₹28,50,000** (3 premature Senior Citizen Fixed Deposit closures queued via RTGS)
- **Correlated Signal Chain (14-minute window · Score: 96/100 High)**:
  - `EVT-1101`: Mobile banking login while a 95-minute WhatsApp video call overlay is active (`+30 pts`).
  - `EVT-1104`: Premature liquidation of 3 long-term Senior Citizen FDs totaling ₹28.5 Lakh (`+30 pts`).
  - `EVT-1105`: Outward RTGS transfer limit raised 15x to a newly registered shell account (`+16 pts`).
  - `DOC-101` (**Document AI**): Uploaded *"CBI / Supreme Court Asset Verification Order"* flagged as **99% Forged** (`+20 pts`).
- **HITL Outcome**: Analyst places a 24-hour Senior Cooling Hold (`Reviewing`), reads the Gemini de-escalation script to break the scammers' psychological spell, and escalates the mule beneficiary to the **1930 CFCFRMS** portal (`Escalated`), safeguarding ₹28.5 Lakh.

### Scenario 2: ICICX Bank & GDFC Wealth Desk — Fake "VIP Stock Trading & QIB IPO Escrow" Scam (`CASE-102`)
- **Customer**: Sunita Deshmukh (64-year-old retired professor, Pune)
- **Amount at Risk**: **₹14,20,000** (Split IMPS/NEFT tranches to bypass ₹15L RTGS scrutiny)
- **Correlated Signal Chain (19-minute window · Score: 88/100 High)**:
  - `EVT-2001`: Web NetBanking login exhibiting rapid clipboard paste of corporate account numbers (`+20 pts`).
  - `EVT-2002`: Addition of 3 unrelated agro/logistics current accounts within 4 minutes (`+24 pts`).
  - `EVT-2004`: Split IMPS/NEFT transfers (`₹5L + ₹5L + ₹4.2L`) queued back-to-back (`+24 pts`).
  - `DOC-102` (**Document AI**): Uploaded *"SEBI Institutional QIB Allotment Contract"* flagged **96% Forged** with an invalid registration number (`+20 pts`).

### Scenario 3: DGBS Bank & Smart Bank of India (SBI) — Senior APK Takeover (`CASE-103`)
- **Customer**: K. Subramanian (68-year-old pensioner, Bengaluru / Singapore NRI)
- **Amount at Risk**: **₹19,80,000** (Cross-border FAST / Wire remittance)
- **Correlated Signal Chain (12-minute window · Score: 92/100 High)**:
  - `EVT-3001`: Sideloaded `Pension_Life_Certificate_Update.apk` granting SMS and Accessibility permissions (`+28 pts`).
  - `EVT-3003`: 3 failed logins followed by a successful login from unseen offshore IP `185.220.101.44` (`+26 pts`).
  - `EVT-3004`: Digital token hardware binding migrated and remittance limit elevated (`+20 pts`).
  - `EVT-3005`: Outbound remittance of ₹19.8L staged to a first-time beneficiary (`+18 pts`).

---

## 5. Key Features & Workbench Modules

1. **Minimal Blue & White Enterprise BFSI Landing Page (`src/components/LandingAndAuthView.tsx`)**:
   - Interactive **Live Case Specimen Inspector** (`CASE-101`, `CASE-102`, `CASE-103`).
   - Interactive **BFSI Impact & Triage Sizing Calculator** modeling monthly senior savings protected (`₹ Cr`) and analyst hours recovered (`8.0m → 42s`).
   - **VPC Deployment Briefing Form** supporting RBI (`asia-south1`, `asia-south2`) and MAS (`asia-southeast1`) data residency.
2. **Dedicated Institutional IAM Login & Audited Logout**:
   - Full-viewport split-screen authentication portal with 1-click institutional desk profiles:
     - **Raman** · *Lead HITL Fraud & Security Analyst* (`GDFC Bank & National Overseas Bank (NOB)`)
     - **Sanjay** · *Principal SOC & Senior Protection Reviewer* (`Smart Bank of India (SBI) & DGBS Bank`)
     - **Shruthi Jha** · *VP Wealth & RTGS Anomaly Triage* (`ICICX Bank`)
   - Audited logout confirmation banner preserving all HITL case dispositions.
3. **3-Pane Case Triage Console (`Case Triage`)**:
   - **Left Pane**: Filterable Correlated Case Queue with severity scores and funds-at-risk indicators.
   - **Center Pane**: Chronological `EVT-*` timeline (clicking any cited `EVT-*` pill in the AI brief highlights the exact raw event row), Transparent Rule Score Breakdown, and Google Cloud Enrichments (**Document AI**, **BigQuery**, **Vertex AI Search**).
   - **Right Pane**: Schema-Bound Gemini Incident Brief, **1-Click Copy Senior Welfare Call Script**, **Deterministic Output Validator** verification badge, and **HITL Analyst Action Controls** (`Reviewing`, `Escalated`, `Dismissed`).
4. **Zero-Upload Pub/Sub Stream & CSV Diagnostic Sandbox (`Alert Ingestion`)**:
   - **Stream Live Alert**: Simulates real-time Cloud Pub/Sub event ingestion without uploading CSVs.
   - **CSV Validator & Prompt-Injection Test**: Tests clean vs. malformed CSV rows and demonstrates how embedded prompt injections (`"IGNORE PREVIOUS INSTRUCTIONS..."`) are stripped deterministically.
5. **Prototype Performance Report & Guardrail Torture-Tester (`Evaluation Pack`)**:
   - Live benchmark matrix across all 7 evaluation criteria (`100% Schema Pass Rate`, `100% Grounded EVT-* Citations`, `480 ms p50 Latency`, `~380 Tokens/Case`, `-91% Triage Time`).
   - Interactive **Output Validator Sandbox** to test how the code validator catches hallucinated event IDs (`EVT-9999`) or forbidden autonomous containment claims.

---

## 6. Repository Structure

```text
├── README.md                            # Complete architecture & project documentation
├── package.json                         # Full-stack scripts (dev, build, start, lint)
├── server.ts                            # Express + Vite server & @google/genai endpoints
├── index.html                           # Typography & metadata configuration
└── src/
    ├── App.tsx                          # Authenticated 3-pane HITL Triage Workbench
    ├── index.css                        # Tailwind CSS & typography rules
    ├── types/
    │   └── sentinel.ts                  # TypeScript interfaces for events, cases, briefs & validation
    ├── engine/
    │   └── triageEngine.ts              # Deterministic CSV parser, sanitizer, correlator & validator
    ├── data/
    │   └── syntheticScenarios.ts        # Pre-loaded India/APAC bank cases & evaluation benchmarks
    └── components/
        ├── LandingAndAuthView.tsx       # Blue & white BFSI landing page, ROI calculator & IAM login
        ├── IngestionView.tsx            # Pub/Sub live stream & CSV validation sandbox
        ├── EvaluationView.tsx           # Slide 11 benchmark matrix & validator torture-tester
        └── SpecificationsView.tsx       # Exportable Markdown technical specification
```

---

## 7. Local Development & Cloud Run Deployment

### Prerequisites
- Node.js `>= 20`
- A Gemini API Key (`GEMINI_API_KEY`) configured in `.env` (for live Gemini brief re-generation; pre-verified baseline briefs work out-of-the-box).

### Run Locally
```bash
# 1. Install dependencies
npm install

# 2. Start the full-stack Express + Vite development server on port 3000
npm run dev
```

### Production Build & Cloud Run Start
```bash
# 1. Build the frontend bundle into dist/
npm run build

# 2. Start the production Express server (binds to process.env.PORT || 3000)
npm start
```

---

## 8. Attribution & Governance Notice

- **Project**: SentinelFlow — AI-Assisted Security & BFSI Scam Triage Prototype
- **Team**: Team Linux C group (**Shruthi Jha and Sanjay**)
- **Governance Principle**: *Helpful AI assistant to prevent incidents and have HITL Security Analyst Review.*
