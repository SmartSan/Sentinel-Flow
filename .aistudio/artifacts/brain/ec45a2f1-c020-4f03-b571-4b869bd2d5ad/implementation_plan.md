# SentinelFlow — Bank-Side AI Triage to Prevent Digital Arrest, Trading Scams & Elderly Financial Exploitation

SentinelFlow is a bank-side AI-assisted security and fraud incident triage workbench designed for Indian and APAC financial institutions (**HDFC Bank, ICICI Bank, Indian Overseas Bank (IOB), SBI, and DBS**). It correlates multi-channel login, session coercion, Fixed Deposit (FD) liquidation, and payment telemetry into explainable, evidence-linked incident briefs to intercept **Digital Arrest Scams**, **Fake Institutional Trading Scams**, and **Senior Citizen Account Exploitation** before life savings leave the bank—while keeping human fraud analysts in full control.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> **Updated Focus: Combating Digital Arrest, Trading Scams & Safeguarding Senior Citizens**
> - **Why Traditional Bank Fraud Filters Fail on Digital Arrest & Trading Scams**: In "Digital Arrest" (fake CBI/ED/Customs/Supreme Court video-call extortion) and "VIP Stock/IPO Trading" scams, the elderly victim is psychologically coerced into logging in, entering valid OTPs, breaking their own Fixed Deposits, and authorizing RTGS/NEFT/UPI transfers themselves. Because the credentials and OTPs are genuine, standard rule engines pass the transaction.
> - **How SentinelFlow Solves This on the Bank Side**:
>   1. **Multi-Signal Coercion & Behavioral Correlation**: Correlates authentication events (`login_failed`, `new_source_ip`), mobile session telemetry (`active_video_call_overlay`, `screen_share_active`), wealth actions (`premature_fd_liquidation`, `limit_increase`), and payment anomalies (`rtgs_new_beneficiary_burst`) within a 30-minute window.
>   2. **Document AI Scam Artifact Detection**: Inspects documents uploaded as transfer justification (e.g., forged *"RBI/CBI Digital Arrest Clearance Certificates"* or *"Fake QIB Institutional Trading Allotment Letters"*) to flag scam templates.
>   3. **Gemini Incident Brief + Empathetic De-Escalation Script**: Generates a schema-bound JSON brief with verified `EVT-*` citations, benign alternatives (e.g., genuine medical/property expense), and a **Senior Citizen De-Escalation Conversation Script** so the bank's fraud analyst or branch manager can break the scammer's psychological coercion and save the customer's money.
>   4. **Zero Manual CSV Upload Needed by Default**: Pre-loaded with live Pub/Sub stream simulation and 1-click Indian/APAC Bank Scam Scenarios, plus optional custom CSV & document upload for testing and evaluation.

---

## 1. Overview & Real-Time Bank-Side Scam Prevention Scenarios

### Three Pre-Loaded Bank-Side Scenarios (Protecting Senior Citizens & Retail Investors)

1. **Scenario 1 — HDFC Bank / Indian Overseas Bank (IOB): "Digital Arrest" Coercion & Senior Citizen FD Liquidation**
   - **Victim Profile**: 72-year-old retired pensioner holding ₹34,00,000 in long-term Senior Citizen Fixed Deposits.
   - **Correlated Event Sequence (30-Minute Window)**:
     - `EVT-1001` (`mobile_edr_telemetry`): Customer opens NetBanking/Mobile Banking while an active, long-duration unknown VoIP video call (`whatsapp_video_overlay_active`) is running continuously for $>90$ minutes.
     - `EVT-1002` (`login_failed` $\rightarrow$ `login_success`): Two failed transaction-password attempts (under panic/coercion) followed by login success and an immediate request to raise the daily RTGS transfer limit from ₹2L to ₹30L (`privilege_change`).
     - `EVT-1003` (`core_banking_fd`): Premature breaking of 3 Senior Citizen Fixed Deposits totaling ₹28,50,000—first FD liquidation in 8 years.
     - `EVT-1004` (`rtgs_payment_switch`): Immediate RTGS transfer initiation of ₹28,50,000 to a newly added current account in another state flagged by **BigQuery** for high inward velocity across 14 unrelated retail senders in 48 hours.
     - `DOC-101` (**Document AI**): Customer uploads a PDF titled `"CBI_Supreme_Court_Asset_Verification_Order.pdf"` as high-value RTGS purpose proof; Document AI detects coerced legal-threat keywords and forged government seal metadata.
   - **How SentinelFlow Saves the Money**: Flags **High Severity (Score: 95/100 — Potential Digital Arrest Coercion)**, retrieves the **RBI CFCFRMS / I4C 1930 Digital Arrest Intervention Playbook** via **Vertex AI Search**, and provides the analyst with an empathetic welfare-call script and recommended 24-hour protective cooling hold + Trusted Family Contact verification.

2. **Scenario 2 — ICICI Bank / HDFC Bank: Fake WhatsApp/Telegram "VIP QIB Stock Trading & IPO Allotment" Scam**
   - **Victim Profile**: 64-year-old recent retiree transferring retirement corpus into a fraudulent "FII Institutional Block-Trade Portal".
   - **Correlated Event Sequence**:
     - `EVT-2001` (`iam_idp`): Login from a session with active remote screen-sharing / coaching behavior (`paste_velocity_anomaly` on beneficiary IFSC/account fields).
     - `EVT-2002` (`privilege_change`): Cooling-period override request and addition of 3 unrelated shell-enterprise beneficiaries (*"Apex Mercantile Pvt Ltd"*, *"Zenith Agro Traders"*) labeled by the user as *"SEBI IPO Escrow"*.
     - `EVT-2003` (`neft_imps_switch`): Rapid sequence of 3 IMPS/NEFT tranches totaling ₹14,20,000 within 18 minutes.
     - `DOC-201` (**Document AI**): Uploaded "Institutional Allotment Contract" contains a unregistered SEBI broker number and mismatched corporate CIN/GSTIN.
   - **How SentinelFlow Saves the Money**: Correlates the rapid multi-mule beneficiary additions with the Document AI SEBI registry mismatch, enabling the analyst to place the outbound NEFT batch under review and counsel the customer before settlement.

3. **Scenario 3 — DBS Bank / SBI: Cross-Border Voice-Clone & Remote-Access APK Senior Account Takeover**
   - **Victim Profile**: 68-year-old NRI / Senior Wealth Customer targeted via a fake "Pension / Life Certificate (Jeevan Pramaan) KYC Update" APK.
   - **Correlated Event Sequence**:
     - `EVT-3001` & `EVT-3002` (`login_failed`): Repeated failed authentication attempts followed by SMS-forwarding permission elevation (`edr_endpoint`).
     - `EVT-3003` (`login_success`): Login from a previously unseen IP/ASN (`new_source_ip`) while the customer's registered device shows concurrent accessibility-service hijacking.
     - `EVT-3004` (`privilege_change`): Modification of registered email/nominee details and attempted high-value remittance.
   - **How SentinelFlow Saves the Money**: Deterministic rules group the device anomaly, unseen IP login, and profile privilege change into a single high-priority case so the analyst can verify with the customer via registered landline/branch contact.

---

## 2. User Experience & Visual Design

- **Key User Flows**:
  1. **Zero-Upload Live Bank Stream & One-Click Scam Scenario Bar**:
     - Opens directly with pre-correlated cases from the **Indian & APAC Banking Live Telemetry Stream (Pub/Sub)**.
     - One-click preset buttons let reviewers switch between **Digital Arrest Scam (HDFC / IOB)**, **Fake VIP Trading Scam (ICICI)**, **Senior APK Account Takeover (DBS / SBI)**, or the **5 Labeled Benchmark Scenarios**, alongside an optional **Custom CSV & Document Upload** drawer.
  2. **Single-Screen 3-Pane Bank Fraud & Security Triage Workspace**:
     - **Left Pane (Prioritized Case Queue & "Funds at Risk / Saved" Summary)**:
       - Top KPI strip showing **Active Cases**, **Elderly Customers Protected**, and **Total Funds Safeguarded (₹)** (`tabular-nums`).
       - Filterable case list (`All`, `High`, `Medium`, `Low`; `New`, `Reviewing`, `Escalated`, `Dismissed`) showing Case ID, Scam/Incident Pattern, Customer Age/Segment tag, Amount at Risk (₹), and Severity.
     - **Center Pane (Deterministic Rule Signals, Chronological Timeline & GCP Enrichment)**:
       - *Deterministic Rule Signals*: Clearly badged rule triggers (`Senior Citizen 65+`, `Premature FD Break`, `Active Video-Call Coercion`, `New Source IP`, `Privilege / Limit Change`, `Document AI Scam Artifact`).
       - *Chronological Event Timeline (`EVT-1001..N`)*: Step-by-step sequence showing exact timestamps, source tool (`mobile_edr`, `core_banking_fd`, `rtgs_switch`, `iam_idp`), and expandable normalized details.
       - *Google Cloud Intelligence Tabs*:
         - **BigQuery Analytics**: 90-day customer transfer baseline vs. current spike + Mule Beneficiary Graph velocity.
         - **Document AI Inspector (`DOC-*`)**: Extracted text, forged seal warnings, and SEBI/RBI verification mismatches from customer-submitted PDFs.
         - **Vertex AI Search Runbook**: Matched RBI CFCFRMS, MHA I4C 1930 Helpline, and Bank Senior-Care SOPs.
     - **Right Pane (Validated Gemini Brief, Elderly De-Escalation Playbook & Analyst Controls)**:
       - *Gemini Incident Brief (AI-Generated & Code-Validated)*:
         - **Summary**: Cautious, evidence-backed synthesis (e.g., *"Potential digital arrest coercion targeting 72-year-old customer"*).
         - **Evidence Citations**: Interactive clickable `EVT-*` and `DOC-*` badges that highlight the corresponding event in the center timeline.
         - **Uncertainty & Benign Alternatives**: Explicit check for legitimate explanations (e.g., *"Customer may be liquidating FD for urgent hospitalization or family wedding; verify empathetically without accusation"*).
         - **Elderly Safeguarding & De-Escalation Script**: Actionable talking points for the bank analyst to break psychological coercion (e.g., *"Reassure customer that Police/CBI/RBI never conduct video-call arrests or demand RTGS verification deposits"*).
         - **Recommended Next Steps**: Non-destructive verification steps (e.g., *"Initiate 24-hour cooling hold pending branch/welfare verification; contact registered Trusted Family Contact; file I4C 1930 alert if coercion confirmed"*).
       - *Deterministic Output Validator Audit*: Verifies JSON schema compliance, 100% `EVT-*` grounding, and non-destructive wording.
       - *Human Analyst Action Bar*: Buttons for `Reviewing (Welfare Call & Cooling Hold)`, `Escalated (Confirm Scam & Safeguard Funds)`, and `Dismissed (Verified Safe — Release Transfer)` with analyst audit notes.
  3. **Evaluation Pack & Benchmarking View**:
     - Interactive benchmark runner testing the 5 labeled synthetic scenarios + the 3 Indian/APAC scam scenarios, reporting live **Correlation Correctness**, **Detection Precision/Recall**, **Evidence Grounding (%)**, **Unsupported Claims (0)**, **Validator Schema Reliability**, **Triage Time Saved**, and **p50/p95 Latency & Token Cost**.

- **Visual Identity & Theme**:
  - **Aesthetic Direction**: High-trust, daylight-first Enterprise BFSI Fraud & Security Workbench (`references/3_saas_dashboard.md`) designed for clarity under high-pressure SOC and fraud-desk operations.
  - **Color Palette & Mood (60-30-10 Discipline)**:
    - *60% Neutral Canvas*: Crisp Alabaster Slate (`#F8FAFC`) background and Pure White (`#FFFFFF`) work panels.
    - *30% Structural Surfaces*: Deep Slate (`#0F172A`) headings, Muted Slate (`#475569`) prose, and `1px solid #E2E8F0` borders.
    - *10% Semantic Accents*: Deterministic Rule Blue (`#2563EB`) for rule logic and GCP telemetry; Gemini Synthesis Violet (`#7C3AED`) for the AI Brief & De-Escalation Playbook; Semantic Risk & Protection colors always paired with text labels—High Risk Crimson (`#DC2626`), Medium Caution Amber (`#D97706`), Funds Safeguarded / Verified Emerald (`#16A34A`).
  - **Typography & Hierarchy (2+1 Font Rule)**:
    - *Display & Navigation*: `Plus Jakarta Sans` (SemiBold 600 / Bold 700).
    - *Body Prose*: `Public Sans` (Regular 400 / Medium 500) for clear reading of de-escalation scripts and incident summaries.
    - *Monospace & Tabular Telemetry*: `JetBrains Mono` (`tabular-nums`) for all `EVT-*` IDs, INR/SGD currency values (`₹28,50,000`), timestamps, IPs, and latency metrics.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Combining Cyber Security Telemetry with Behavioral Coercion & Wealth Signals**
  - *Chosen Approach*: Extend SentinelFlow's normalized event schema to support both classic cyber events (`login_failed`, `login_success`, `privilege_change`) and bank-side scam signals (`video_call_coercion`, `premature_fd_break`, `mule_beneficiary_addition`, `forged_document_upload`).
  - *Why*: Directly addresses Digital Arrest and Trading Scams where the customer's credentials are valid, while remaining 100% backward-compatible with the presentation deck's CSV schema and evaluation rubric.

- **Decision 2: Human-in-the-Loop "Safeguard & Counsel" Workflow Instead of Blind Auto-Blocking**
  - *Chosen Approach*: Never automatically freeze an elderly customer's account via AI output alone (which could block a real medical emergency). Instead, surface a prioritized case with an empathetic **Welfare Call & De-Escalation Script** so a human analyst can confirm whether the customer is under duress and record the funds saved.
  - *Why*: Upholds SentinelFlow's core principle (*"Rules establish what the data says; Gemini explains the supplied evidence; a human analyst reviews every case"*).

---

## 4. Technical Architecture & Google Cloud Integration Strategy *(Technical Reference)*

### Architecture & End-to-End Scam Interception Flow

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                INDIAN & APAC BANK TELEMETRY SOURCES (HDFC / ICICI / IOB / DBS)              │
│  [Mobile Banking Coercion SDK]   [Core Banking FD & Limits]   [RTGS/NEFT/UPI Switch & Docs] │
└──────────────┬───────────────────────────────┬──────────────────────────────┬───────────────┘
               │                               │                              │
               ▼                               ▼                              ▼
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                   GOOGLE CLOUD RUN SERVICE (Express + React Workbench)                      │
│                                                                                             │
│  ┌────────────────────────────┐   ┌────────────────────────────┐   ┌─────────────────────┐  │
│  │ 1. Cloud Pub/Sub Stream    │   │ 2. BigQuery Risk & Mule    │   │ 3. Document AI      │  │
│  │    & CSV Normalizer        │   │    Graph Analytics         │   │    Scam Inspector   │  │
│  │ • Auto-stream + CSV upload │   │ • 90-day senior baseline   │   │ • Fake CBI/RBI/SEBI │  │
│  │ • Assigns EVT-1001..N      │   │ • Beneficiary mule fan-in  │   │   letter detection  │  │
│  └─────────────┬──────────────┘   └─────────────┬──────────────┘   └──────────┬──────────┘  │
│                └────────────────────────────────┼─────────────────────────────┘             │
│                                                 ▼                                           │
│  ┌───────────────────────────────────────────────────────────────────────────────────────┐  │
│  │ 4. Deterministic Correlation & Senior Vulnerability Scoring Engine                    │  │
│  │ • Groups by user, src_ip, asset, time window (30m)                                    │  │
│  │ • Flags: Video-Call Coercion + FD Break + Limit Change + Unseen Mule RTGS             │  │
│  └──────────────────────────────────────────────┬────────────────────────────────────────┘  │
│                                                 │                                           │
│                                                 ▼                                           │
│  ┌───────────────────────────────────────────────────────────────────────────────────────┐  │
│  │ 5. Vertex AI Search (RBI CFCFRMS / MHA I4C 1930 / MAS TRM Policy Retrieval)           │  │
│  └──────────────────────────────────────────────┬────────────────────────────────────────┘  │
│                                                 │                                           │
│                                                 ▼                                           │
│  ┌───────────────────────────────────────────────────────────────────────────────────────┐  │
│  │ 6. Gemini on Vertex AI (@google/genai — gemini-3.8-flash)                             │  │
│  │ • Drafts Schema-Bound JSON Brief: Timeline, Evidence IDs, Benign Alternatives,        │  │
│  │   Empathetic Elderly De-Escalation Script & Non-Destructive Next Steps                │  │
│  └──────────────────────────────────────────────┬────────────────────────────────────────┘  │
│                                                 │                                           │
│                                                 ▼                                           │
│  ┌───────────────────────────────────────────────────────────────────────────────────────┐  │
│  │ 7. Deterministic Output Validator (100% EVT-* Grounding & Cautious Language Check)    │  │
│  └──────────────────────────────────────────────┬────────────────────────────────────────┘  │
│                                                 │                                           │
│                                                 ▼                                           │
│  ┌───────────────────────────────────────────────────────────────────────────────────────┐  │
│  │ 8. Analyst Case Screen + Firestore / Cloud SQL Audit Ledger & "Funds Saved" Tracker   │  │
│  └───────────────────────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```

### Interactive Component & State Mapping

- **Case Triage Workspace**:
  - *Scenario Selector Bar* (`All Active Cases`, `Digital Arrest Scam (HDFC/IOB)`, `VIP Trading Scam (ICICI)`, `Senior APK Takeover (DBS/SBI)`, `Deck Evaluation Pack`) $\rightarrow$ Filters or loads the corresponding correlated event cases immediately with zero CSV upload needed.
  - *Interactive Timeline & GCP Context Tabs* $\rightarrow$ Inspects `EVT-*` events, BigQuery Mule Graph metrics, Document AI fake warrant/contract analysis (`DOC-*`), and Vertex AI Search RBI/1930 compliance SOPs.
  - *Generate / Re-Verify Gemini Brief Button* $\rightarrow$ Calls `POST /api/triage/brief` using `@google/genai` (`gemini-3.8-flash`), runs the deterministic Output Validator, and renders the incident brief plus the **Elderly Welfare Call & De-Escalation Script**.
  - *Analyst Status & Safeguard Controls* (`Reviewing — Place 24h Cooling Hold`, `Escalated — Scam Confirmed & Funds Saved`, `Dismissed — Legitimate Transfer`) $\rightarrow$ Updates case state, logs the analyst's audit note, and increments the **Total Elderly Savings Protected (₹)** counter when a scam is intercepted.
- **Live Ingestion & CSV Workbench**:
  - Allows simulating live Pub/Sub alert arrivals, downloading sample CSVs, or uploading custom CSV files to test normalization and malformed-row rejection.
- **Evaluation & Benchmarking Suite**:
  - Runs automated evaluations across both the 5 deck scenarios and the 3 elderly scam scenarios, reporting live precision/recall, 100% evidence grounding verification, schema reliability, and p50/p95 latency.
