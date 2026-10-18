import React from 'react';
import { FileDown, Shield, Database, Cpu, FileSearch, Cloud } from 'lucide-react';

export const SpecificationsView: React.FC = () => {
  const handleExportMarkdownSpec = () => {
    const specContent = `# SentinelFlow — Technical & Product Specification (BFSI Risk & Scam Mitigation)

## 1. Problem Statement & Core Principle
- **Team**: Linux C group (Team Leader: Sanjay T)
- **Problem**: AI-assisted triage of security and fraud alerts into explainable, evidence-backed incident briefs for BFSI risk and fraud mitigation—specifically targeting **Digital Arrest Scams**, **Fake VIP Stock Trading / IPO Scams**, and **Senior Citizen Account Compromise** across Indian and APAC banks (HDFC Bank, ICICI Bank, Indian Overseas Bank, SBI, DBS).
- **Governing Principle**: Rules establish what the data says. Gemini only explains the supplied evidence. A human analyst reviews every case; nothing is blocked, disabled, or isolated automatically.

## 2. Three Real-Time Indian & APAC Banking Use Cases
1. **HDFC Bank / Indian Overseas Bank (IOB) — Digital Arrest Coercion & Senior Citizen FD Liquidation**:
   - Correlates continuous 95-minute WhatsApp video-call overlay telemetry, panic password failures, premature breaking of 3 Senior Citizen Fixed Deposits (₹28.5L), 15x RTGS limit elevation, and a forged CBI/RBI warrant flagged by Document AI.
2. **ICICI Bank / HDFC Bank — Fake WhatsApp/Telegram VIP QIB Stock Trading & IPO Escrow Scam**:
   - Correlates remote screen-coaching / clipboard paste velocity, cooling-period override across 3 shell agro/logistics beneficiaries, and ₹14.2L split IMPS/NEFT tranches with an invalid SEBI broker contract flagged by Document AI.
3. **DBS Bank / SBI — Cross-Border Senior APK Account Takeover (Fake Pension Life Certificate)**:
   - Correlates repeated authentication failures, sideloaded SMS-forwarding APK telemetry, login from an unseen offshore IP, and token privilege modification staging ₹19.8L (SGD 31,500) remittance.

## 3. Google Cloud BFSI Technology Stack
- **Gemini on Vertex AI (@google/genai — gemini-3.8-flash)**: Generates schema-bound JSON incident briefs, uncertainty analysis, and empathetic Senior Citizen De-Escalation Scripts.
- **Cloud Pub/Sub**: Event-driven real-time alert ingestion so analysts never need to upload manual CSVs in daily operation.
- **BigQuery**: 90-day customer transfer velocity baselines and inter-bank Mule Beneficiary fan-in graph analytics.
- **Vertex AI Classification**: Quantitative fraud probability scoring alongside transparent deterministic rule points.
- **Document AI**: Extracts entities and forgery confidence from uploaded transfer justifications (fake CBI warrants, fake SEBI allotment letters).
- **Vertex AI Search / Agent Search**: Grounds analyst recommendations in RBI CFCFRMS, MHA I4C 1930 Helpline, SEBI ASBA, and MAS TRM compliance runbooks.
- **Cloud SQL / AlloyDB & Firestore**: Persistent case ledger, analyst status transitions, and audit trail.
- **Cloud Run**: Stateless container hosting with least-privilege IAM and Cloud Logging/Monitoring.
`;

    const blob = new Blob([specContent], {
      type: 'text/markdown;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'SentinelFlow_BFSI_Technical_Specification.md';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Specification Header */}
      <div className="border border-slate-200 bg-white rounded-xl p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="space-y-1.5 max-w-3xl">
          <div className="text-xs font-medium text-blue-700">
            03. Complete System Specification & Google Cloud BFSI Architecture
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            SentinelFlow Blueprint: Safeguarding Senior Citizens & Combating Digital Arrest Scams
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Full functional, architectural, and responsible-AI specification mapping the AI Builder Cup deck (Team Linux C group — Sanjay T) to real-time fraud and security operations across HDFC Bank, ICICI Bank, Indian Overseas Bank (IOB), SBI, and DBS.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportMarkdownSpec}
          className="px-4 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
        >
          <FileDown className="w-4 h-4" />
          <span>Download Full Spec (.md)</span>
        </button>
      </div>

      {/* Three Real-Time APAC & Indian Bank Scam Scenarios */}
      <div className="border border-slate-200 bg-white rounded-xl p-6 space-y-6">
        <div className="border-b border-slate-200 pb-4">
          <h3 className="text-base font-semibold text-slate-900">
            01. Three Real-Time APAC & Indian Bank Scenarios (Elderly & Retail Protection)
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            How SentinelFlow intercepts psychologically coerced self-authorized scams where standard OTP/password checks fail
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="border border-slate-200 rounded-xl p-5 space-y-3 bg-slate-50/40">
            <div className="text-xs font-mono text-red-700 font-semibold">
              SCENARIO 01 · HDFC BANK & IOB (INDIA)
            </div>
            <h4 className="text-base font-bold text-slate-900">
              "Digital Arrest" Coercion & Senior FD Liquidation
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Scammers impersonate CBI/ED/Supreme Court officials on a continuous 95-minute WhatsApp video call, coercing a 72-year-old pensioner into breaking ₹28.5L in Senior Citizen Fixed Deposits and initiating an RTGS transfer to a "court verification" mule account.
            </p>
            <div className="pt-2 border-t border-slate-200 text-xs space-y-1.5 text-slate-700">
              <div>
                <span className="font-semibold text-slate-900">Correlated Signals:</span> Active video-call overlay (<code className="font-mono">EVT-1101</code>) · Panic password failures (<code className="font-mono">EVT-1102</code>) · Premature FD break (<code className="font-mono">EVT-1104</code>) · 15x RTGS limit elevation (<code className="font-mono">EVT-1105</code>) · Forged CBI PDF (<code className="font-mono">DOC-101</code>).
              </div>
              <div>
                <span className="font-semibold text-emerald-800">Bank-Side Remedy:</span> Places 24h Senior Cooling Hold on ₹28.5L RTGS + equips analyst with De-Escalation Script & Trusted Family Contact alert.
              </div>
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl p-5 space-y-3 bg-slate-50/40">
            <div className="text-xs font-mono text-amber-700 font-semibold">
              SCENARIO 02 · ICICI BANK & HDFC BANK (INDIA)
            </div>
            <h4 className="text-base font-bold text-slate-900">
              Fake WhatsApp "VIP QIB Stock Trading & IPO Escrow" Scam
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              A 64-year-old retiree is coached in a fraudulent "Institutional FII Block Trade" WhatsApp group to bypass beneficiary cooling periods and wire ₹14.2L in split IMPS/NEFT tranches to three newly incorporated agro/mercantile shell companies.
            </p>
            <div className="pt-2 border-t border-slate-200 text-xs space-y-1.5 text-slate-700">
              <div>
                <span className="font-semibold text-slate-900">Correlated Signals:</span> Messaging-to-banking clipboard paste (<code className="font-mono">EVT-2101</code>) · Multi-mule cooling override (<code className="font-mono">EVT-2102</code>) · Structured ₹5L split tranches (<code className="font-mono">EVT-2103</code>) · Invalid SEBI broker contract (<code className="font-mono">DOC-102</code>).
              </div>
              <div>
                <span className="font-semibold text-emerald-800">Bank-Side Remedy:</span> Holds NEFT batch clearing + counsels investor that genuine SEBI IPOs strictly use bank-blocked ASBA.
              </div>
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl p-5 space-y-3 bg-slate-50/40">
            <div className="text-xs font-mono text-blue-700 font-semibold">
              SCENARIO 03 · DBS BANK & SBI (SINGAPORE / INDIA NRI)
            </div>
            <h4 className="text-base font-bold text-slate-900">
              Senior APK Account Takeover (Fake Life Certificate)
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              A 68-year-old senior wealth client installs a malicious "Jeevan Pramaan Pension KYC" APK received over WhatsApp, allowing an offshore attacker to intercept SMS OTPs, authenticate from an unseen IP, re-bind digital tokens, and stage a ₹19.8L remittance.
            </p>
            <div className="pt-2 border-t border-slate-200 text-xs space-y-1.5 text-slate-700">
              <div>
                <span className="font-semibold text-slate-900">Correlated Signals:</span> Repeated login failures (<code className="font-mono">EVT-3101</code>) · Unseen offshore IP login (<code className="font-mono">EVT-3102</code>) · Token & email privilege change (<code className="font-mono">EVT-3103</code>).
              </div>
              <div>
                <span className="font-semibold text-emerald-800">Bank-Side Remedy:</span> Bypasses compromised SMS channel to verify via registered landline and locks core savings in digiVault / Senior Lock.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Google Cloud BFSI Architecture Mapping */}
      <div className="border border-slate-200 bg-white rounded-xl p-6 space-y-5">
        <div className="border-b border-slate-200 pb-4">
          <h3 className="text-base font-semibold text-slate-900">
            02. Google Cloud BFSI Technology Stack Integration
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            How each Google Cloud service contributes to real-time scam detection, document verification, and human-in-the-loop triage
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="border border-slate-200 rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-violet-700">
              <Cpu className="w-4 h-4" />
              <span>Gemini on Vertex AI</span>
            </div>
            <div className="text-xs font-semibold text-slate-900">
              Evidence-Bound Reasoning & De-Escalation Scripts
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Uses <code className="font-mono">gemini-3.8-flash</code> with strict JSON <code className="font-mono">responseSchema</code> to synthesize correlated events, uncertainty, and empathetic elderly intervention talking points.
            </p>
          </div>

          <div className="border border-slate-200 rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-700">
              <Database className="w-4 h-4" />
              <span>BigQuery & Pub/Sub</span>
            </div>
            <div className="text-xs font-semibold text-slate-900">
              Real-Time Event Stream & Mule Graph Analytics
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Pub/Sub ingests live IAM, EDR, FD, and RTGS events without manual CSV uploads. BigQuery computes 90-day customer transfer baselines and 48h mule beneficiary inward fan-in.
            </p>
          </div>

          <div className="border border-slate-200 rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
              <FileSearch className="w-4 h-4" />
              <span>Document AI & Vertex Search</span>
            </div>
            <div className="text-xs font-semibold text-slate-900">
              Scam Artifact Detection & RBI/MAS Runbooks
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Document AI flags forged CBI/RBI Digital Arrest warrants and fake SEBI contracts (<code className="font-mono">DOC-*</code>). Vertex AI Search retrieves RBI 1930 CFCFRMS & MAS TRM SOPs.
            </p>
          </div>

          <div className="border border-slate-200 rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
              <Cloud className="w-4 h-4" />
              <span>Cloud Run, Firestore & Cloud SQL</span>
            </div>
            <div className="text-xs font-semibold text-slate-900">
              Stateless Hosting & Immutable Audit Trail
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Hosted on Cloud Run with least-privilege IAM. Analyst case reviews (<code className="font-mono">Reviewing</code>, <code className="font-mono">Escalated</code>, <code className="font-mono">Dismissed</code>) and Funds Saved metrics persist with full auditability.
            </p>
          </div>
        </div>
      </div>

      {/* Responsible AI, Safety Guardrails & Cost Discipline (Slides 9 & 12) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="border border-slate-200 bg-white rounded-xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
            <Shield className="w-4 h-4" />
            <span>Responsible AI & Safety Invariants (Slide 12)</span>
          </div>
          <h3 className="text-base font-semibold text-slate-900">
            Defense-in-Depth Against Hallucination & Prompt Injection
          </h3>
          <ul className="space-y-2 text-xs text-slate-600 leading-relaxed list-disc pl-4">
            <li>
              <strong className="text-slate-900">Untrusted Log Sanitization:</strong> All uploaded or streamed <code className="font-mono">raw_message</code> fields are stripped of prompt-injection directives before reaching Gemini.
            </li>
            <li>
              <strong className="text-slate-900">100% Code-Verified Citations:</strong> Every <code className="font-mono">EVT-*</code> and <code className="font-mono">DOC-*</code> ID in the Gemini brief is checked in deterministic TypeScript code against the correlated case.
            </li>
            <li>
              <strong className="text-slate-900">Non-Destructive Human Control:</strong> Model output cannot run commands, freeze accounts, or isolate endpoints automatically. Analysts review benign alternatives (e.g. genuine medical emergency) before placing a protective hold.
            </li>
          </ul>
        </div>

        <div className="border border-slate-200 bg-white rounded-xl p-6 space-y-3">
          <div className="text-xs font-semibold text-blue-700">
            Cost & Operational Efficiency (Slide 9)
          </div>
          <h3 className="text-base font-semibold text-slate-900">
            Minimal Context Token Budget & Stateless Cloud Run Execution
          </h3>
          <ul className="space-y-2 text-xs text-slate-600 leading-relaxed list-disc pl-4">
            <li>
              <strong className="text-slate-900">Deterministic Pre-Filtering:</strong> Rules group and filter raw logs first so Gemini is invoked only once per correlated candidate case (~300–520 tokens/case).
            </li>
            <li>
              <strong className="text-slate-900">Pay-Per-Use Cloud Run:</strong> Scales to zero when idle; Cloud Logging records structured status and latency metadata rather than noisy raw events.
            </li>
            <li>
              <strong className="text-slate-900">Measurable ROI for Banks:</strong> Reduces first-stage analyst triage time by ~91% while preventing irreversible multi-lakh RTGS/NEFT losses for senior citizens.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
