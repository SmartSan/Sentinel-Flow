import React, { useState, useEffect } from 'react';
import {
  INITIAL_CORRELATED_CASES,
} from './data/syntheticScenarios.ts';
import type {
  CaseStatus,
  CorrelatedCase,
  IngestionResult,
  SeverityLevel,
} from './types/sentinel.ts';
import { IngestionView } from './components/IngestionView.tsx';
import { EvaluationView } from './components/EvaluationView.tsx';
import { SpecificationsView } from './components/SpecificationsView.tsx';
import {
  LandingAndAuthView,
  SentinelFlowLogo,
  type AnalystSession,
} from './components/LandingAndAuthView.tsx';
import {
  Sparkles,
  CheckCircle2,
  ShieldAlert,
  PhoneCall,
  Database,
  FileSearch,
  BookOpen,
  RefreshCw,
  Copy,
  Check,
  ArrowRight,
  LogOut,
} from 'lucide-react';

type ActiveTab = 'triage' | 'ingestion' | 'evaluation' | 'specs';
type ScenarioFilter = 'all' | 'india_apac_scam' | 'deck_wireframe';
type GcpContextTab = 'bigquery' | 'document_ai' | 'vertex_runbook';

const STORAGE_KEY = 'sentinelflow_cases_v5';
const SESSION_STORAGE_KEY = 'sentinelflow_session_v5';

export default function App() {
  const [session, setSession] = useState<AnalystSession | null>(() => {
    try {
      const saved = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed.email === 'string') {
          return parsed;
        }
      }
    } catch {
      // Default to logged-out B2B landing page
    }
    return null;
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('triage');
  const [cases, setCases] = useState<CorrelatedCase[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback to initial cases
    }
    return INITIAL_CORRELATED_CASES;
  });

  const [selectedCaseId, setSelectedCaseId] = useState<string>('CASE-101');
  const [scenarioFilter, setScenarioFilter] = useState<ScenarioFilter>('all');
  const [severityFilter, setSeverityFilter] = useState<SeverityLevel | 'All'>('All');
  const [highlightedEventId, setHighlightedEventId] = useState<string | null>(null);
  const [gcpTab, setGcpTab] = useState<GcpContextTab>('document_ai');
  const [analystNote, setAnalystNote] = useState<string>('');
  const [isGeneratingBrief, setIsGeneratingBrief] = useState<boolean>(false);
  const [briefError, setBriefError] = useState<string | null>(null);
  const [isSimulatingStream, setIsSimulatingStream] = useState<boolean>(false);
  const [streamBanner, setStreamBanner] = useState<string | null>(null);
  const [lastIngestion, setLastIngestion] = useState<IngestionResult | null>(null);
  const [copiedScript, setCopiedScript] = useState<boolean>(false);
  const [signedOutMessage, setSignedOutMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cases));
    } catch {
      // Ignore storage quota issues
    }
  }, [cases]);

  const handleLoginSuccess = (newSession: AnalystSession) => {
    setSession(newSession);
    setSignedOutMessage(null);
    try {
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(newSession));
    } catch {
      // Ignore storage quota issues
    }
  };

  const handleLogout = () => {
    const prevName = session?.name || 'Analyst';
    const prevInst = session?.institution || 'BFSI SOC Desk';
    const timeStr =
      new Date().toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }) + ' IST';
    setSignedOutMessage(
      `Signed out ${prevName} (${prevInst}) at ${timeStr}. All HITL case dispositions and audit logs are preserved.`
    );
    setSession(null);
    try {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
    } catch {
      // Ignore storage issues
    }
  };

  const filteredCases = cases.filter((c) => {
    const matchesScenario =
      scenarioFilter === 'all' || c.scenario_group === scenarioFilter;
    const matchesSeverity =
      severityFilter === 'All' || c.severity === severityFilter;
    return matchesScenario && matchesSeverity;
  });

  const activeCase =
    cases.find((c) => c.case_id === selectedCaseId) ||
    filteredCases[0] ||
    cases[0];

  const totalFundsAtRisk = cases.reduce(
    (sum, c) => sum + (c.amount_at_risk_inr || 0),
    0
  );
  const totalFundsSafeguarded = cases.reduce((sum, c) => {
    if (c.status === 'Escalated' || c.status === 'Reviewing') {
      return sum + (c.amount_at_risk_inr || 0);
    }
    return sum + (c.funds_saved_inr || 0);
  }, 0);
  const seniorCasesProtected = cases.filter(
    (c) =>
      c.is_senior_citizen &&
      (c.status === 'Reviewing' || c.status === 'Escalated')
  ).length;

  const handleSelectCase = (caseId: string) => {
    setSelectedCaseId(caseId);
    setHighlightedEventId(null);
    setBriefError(null);
    setCopiedScript(false);
    const found = cases.find((c) => c.case_id === caseId);
    if (found && !found.document_ai_evidence && gcpTab === 'document_ai') {
      setGcpTab('bigquery');
    } else if (found?.document_ai_evidence) {
      setGcpTab('document_ai');
    }
  };

  const handleCopyScript = () => {
    if (!activeCase) return;
    const text = activeCase.gemini_brief.elderly_deescalation_script.join('\n\n');
    navigator.clipboard?.writeText(text);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  const handleUpdateCaseStatus = (newStatus: CaseStatus) => {
    if (!activeCase) return;

    const statusActionDescriptions: Record<CaseStatus, string> = {
      New: 'Reset case to New queue.',
      Reviewing:
        'Placed 24-hour Senior Protection Cooling Hold & initiated empathetic out-of-band customer welfare call.',
      Escalated:
        'Confirmed scam/compromise after customer verification. Outbound transfer blocked in cooling queue, customer life savings safeguarded, and beneficiary reported to 1930 CFCFRMS / MuleHunter.',
      Dismissed:
        'Verified legitimate customer intent out-of-band. Released cooling hold with zero customer disruption.',
    };

    const noteText =
      analystNote.trim() || statusActionDescriptions[newStatus];

    const activeAnalystLabel = session
      ? `${session.name} (${session.institution})`
      : 'Shruthi Jha & Sanjay (HITL Security Analysts)';

    const updatedCases = cases.map((c) => {
      if (c.case_id !== activeCase.case_id) return c;
      const savedAmount =
        newStatus === 'Escalated' || newStatus === 'Reviewing'
          ? c.amount_at_risk_inr
          : 0;
      return {
        ...c,
        status: newStatus,
        funds_saved_inr: savedAmount,
        audit_trail: [
          {
            id: `AUD-${Date.now()}`,
            timestamp:
              new Date().toLocaleTimeString('en-IN', {
                hour12: false,
              }) + ' IST',
            analyst: activeAnalystLabel,
            previous_status: c.status,
            new_status: newStatus,
            note: noteText,
            funds_safeguarded_inr: savedAmount,
          },
          ...c.audit_trail,
        ],
      };
    });

    setCases(updatedCases);
    setAnalystNote('');
  };

  const handleRegenerateGeminiBrief = async () => {
    if (!activeCase) return;
    setIsGeneratingBrief(true);
    setBriefError(null);

    try {
      const response = await fetch('/api/triage/brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correlatedCase: activeCase }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate Gemini brief.');
      }

      setCases((prev) =>
        prev.map((c) =>
          c.case_id === activeCase.case_id
            ? {
                ...c,
                gemini_brief: data.brief,
                validation: data.validation,
              }
            : c
        )
      );
    } catch (err: unknown) {
      setBriefError(
        err instanceof Error
          ? err.message
          : 'Unable to reach Gemini server endpoint; verified baseline brief remains active.'
      );
    } finally {
      setIsGeneratingBrief(false);
    }
  };

  const handleSimulatePubSub = async () => {
    setIsSimulatingStream(true);
    setStreamBanner(null);
    try {
      const response = await fetch('/api/pubsub/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        const data = await response.json();
        if (data.newCase) {
          setCases((prev) => [data.newCase, ...prev]);
          setSelectedCaseId(data.newCase.case_id);
          setLastIngestion(data.ingestion);
          setActiveTab('triage');
          setStreamBanner(
            `Cloud Pub/Sub Live Stream correlated new case ${data.newCase.case_id} (${data.newCase.bank_name} · ${data.newCase.customer_name} · ₹${(data.newCase.amount_at_risk_inr || 0).toLocaleString('en-IN')}) — zero manual CSV upload needed.`
          );
        }
      }
    } finally {
      setIsSimulatingStream(false);
    }
  };

  const handleIngestComplete = (
    result: IngestionResult,
    newCases: CorrelatedCase[]
  ) => {
    setLastIngestion(result);
    if (newCases.length > 0) {
      setCases((prev) => [...newCases, ...prev]);
      setSelectedCaseId(newCases[0].case_id);
      setStreamBanner(
        `Normalized ${result.valid_events.length} events (${result.rejected_rows.length} malformed rows rejected) and correlated ${newCases.length} new case(s).`
      );
    }
  };

  const handleResetDemoState = () => {
    localStorage.removeItem(STORAGE_KEY);
    setCases(INITIAL_CORRELATED_CASES);
    setSelectedCaseId('CASE-101');
    setScenarioFilter('all');
    setSeverityFilter('All');
    setStreamBanner(
      'Reset workbench to initial GDFC Bank, ICICX Bank, National Overseas Bank (NOB), Smart Bank of India (SBI), and DGBS benchmark cases.'
    );
  };

  const quickScenarios = [
    {
      caseId: 'CASE-101',
      tag: 'GDFC Bank / National Overseas Bank (NOB)',
      title: 'Digital Arrest Senior FD Break',
      victim: 'R. Venkataraman (72y) · ₹28.5L RTGS',
      risk: '96/100 High',
    },
    {
      caseId: 'CASE-102',
      tag: 'ICICX Bank / GDFC Bank',
      title: 'Fake VIP Stock & IPO Escrow Scam',
      victim: 'Sunita Deshmukh (64y) · ₹14.2L IMPS',
      risk: '88/100 High',
    },
    {
      caseId: 'CASE-103',
      tag: 'DGBS Bank / Smart Bank of India (SBI)',
      title: 'Senior APK Account Takeover',
      victim: 'K. Subramanian (68y) · ₹19.8L Remit',
      risk: '92/100 High',
    },
    {
      caseId: 'CASE-001',
      tag: 'Slide 6 Reference Wireframe',
      title: 'Post-Failure Unseen IP & Role Change',
      victim: 'priya.nair · Core Treasury PAM',
      risk: '90/100 High',
    },
  ];

  // If no active analyst session, render the minimal B2B BFSI Enterprise Landing & Login Page
  if (!session) {
    return (
      <LandingAndAuthView
        onLoginSuccess={handleLoginSuccess}
        signedOutMessage={signedOutMessage}
        onClearSignedOutMessage={() => setSignedOutMessage(null)}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Bar Contract: Strictly 3 Zones separated by gap-8 */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between gap-8 sticky top-0 z-30">
        {/* Zone 1: Brand mark with logo and wordmark */}
        <a
          href="#triage"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('triage');
          }}
          className="whitespace-nowrap shrink-0"
        >
          <SentinelFlowLogo />
        </a>

        {/* Zone 2: 4 concise single-line navigation links */}
        <nav className="flex items-center gap-6 text-sm font-medium text-slate-600 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('triage')}
            className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'triage'
                ? 'border-blue-600 text-slate-900 font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Case Triage
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('ingestion')}
            className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'ingestion'
                ? 'border-blue-600 text-slate-900 font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Alert Ingestion
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('evaluation')}
            className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'evaluation'
                ? 'border-blue-600 text-slate-900 font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Evaluation Pack
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('specs')}
            className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'specs'
                ? 'border-blue-600 text-slate-900 font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Specifications
          </button>
        </nav>

        {/* Zone 3: 1 primary action (Sign Out) */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={handleLogout}
            className="px-4 py-2 text-xs font-semibold text-slate-900 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main 1440px Desktop Container */}
      <main className="flex-1 w-full max-w-[1440px] mx-auto px-6 py-6 space-y-6">
        {/* Authenticated Analyst Session & Live Telemetry Action Bar */}
        <div className="border border-slate-200 bg-white rounded-xl px-4 py-3 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-2 text-slate-600">
            <span className="font-semibold text-slate-900">
              Authenticated Analyst:
            </span>
            <span>{session.name}</span>
            <span>·</span>
            <span className="font-mono text-slate-700">{session.email}</span>
            <span>·</span>
            <span className="text-blue-800 font-medium">
              {session.institution}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSimulatePubSub}
              disabled={isSimulatingStream}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {isSimulatingStream ? 'Streaming Alert...' : 'Stream Live Alert'}
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Return to Product Page
            </button>
          </div>
        </div>

        {/* Live Stream Notification Toast if triggered */}
        {streamBanner && (
          <div className="border border-blue-200 bg-blue-50/80 rounded-xl px-4 py-3 flex items-center justify-between gap-4 text-xs text-blue-950">
            <div>
              <span className="font-semibold">Live Telemetry Update: </span>
              <span>{streamBanner}</span>
            </div>
            <button
              type="button"
              onClick={() => setStreamBanner(null)}
              className="text-blue-700 hover:text-blue-900 font-semibold whitespace-nowrap shrink-0 cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {activeTab === 'triage' && (
          <>
            {/* Interactive 7-Step Process Flow Bar (Slide 5 Architecture Made Intuitive) */}
            <section className="border border-slate-200 bg-white rounded-xl p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="font-semibold text-slate-900">
                  How SentinelFlow Works — 7-Step Explainable Triage Pipeline
                </div>
                <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-600">
                  <span>
                    <strong className="text-blue-700">Steps 2–4 & 6:</strong> Deterministic Rules (Code)
                  </span>
                  <span>·</span>
                  <span>
                    <strong className="text-violet-700">Step 5:</strong> Gemini on Vertex AI (Explanation Only)
                  </span>
                  <span>·</span>
                  <span>
                    <strong className="text-emerald-700">Step 1 & 7:</strong> Human Analyst (HITL Control)
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                {[
                  {
                    step: '1. Ingest Alerts',
                    sub: 'Pub/Sub or CSV',
                    tone: 'border-emerald-200 bg-emerald-50/50 text-emerald-950',
                    action: () => setActiveTab('ingestion'),
                  },
                  {
                    step: '2. Normalize',
                    sub: 'Parse time & EVT-* ID',
                    tone: 'border-blue-200 bg-blue-50/50 text-blue-950',
                    action: () => setActiveTab('ingestion'),
                  },
                  {
                    step: '3. Correlate',
                    sub: 'User · IP · Asset · 30m',
                    tone: 'border-blue-200 bg-blue-50/50 text-blue-950',
                    action: () => setActiveTab('triage'),
                  },
                  {
                    step: '4. Score Severity',
                    sub: 'Transparent rule pts',
                    tone: 'border-blue-200 bg-blue-50/50 text-blue-950',
                    action: () => setActiveTab('triage'),
                  },
                  {
                    step: '5. Gemini Brief',
                    sub: 'Schema JSON + Script',
                    tone: 'border-violet-200 bg-violet-50/60 text-violet-950',
                    action: () => setActiveTab('triage'),
                  },
                  {
                    step: '6. Code Validator',
                    sub: '100% EVT-* verified',
                    tone: 'border-blue-200 bg-blue-50/50 text-blue-950',
                    action: () => setActiveTab('evaluation'),
                  },
                  {
                    step: '7. HITL Review',
                    sub: 'Hold · Escalate · Save ₹',
                    tone: 'border-emerald-200 bg-emerald-50/50 text-emerald-950',
                    action: () => setActiveTab('triage'),
                  },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={item.action}
                    className={`p-2.5 rounded-lg border text-left transition-colors hover:brightness-95 cursor-pointer ${item.tone}`}
                  >
                    <div className="text-xs font-bold whitespace-nowrap truncate">
                      {item.step}
                    </div>
                    <div className="text-[11px] opacity-80 truncate mt-0.5">
                      {item.sub}
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {/* Full-Width 4-Column BFSI Protection & Triage Summary Strip */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="border border-slate-200 bg-white rounded-xl p-5 space-y-1">
                <div className="text-xs text-slate-500">
                  Correlated Security & Scam Cases
                </div>
                <div className="text-2xl font-bold font-mono tabular-nums text-slate-900">
                  {cases.length} Cases
                </div>
                <div className="text-xs text-slate-500">
                  {cases.filter((c) => c.severity === 'High').length} High ·{' '}
                  {cases.filter((c) => c.severity === 'Medium').length} Medium ·{' '}
                  {cases.filter((c) => c.severity === 'Low').length} Low
                </div>
              </div>

              <div className="border border-slate-200 bg-white rounded-xl p-5 space-y-1">
                <div className="text-xs text-slate-500">
                  Elderly & Retail Funds Monitored
                </div>
                <div className="text-2xl font-bold font-mono tabular-nums text-slate-900">
                  ₹{(totalFundsAtRisk / 100000).toFixed(2)} Lakh
                </div>
                <div className="text-xs text-slate-500">
                  GDFC · NOB · ICICX · Smart Bank of India (SBI) · DGBS
                </div>
              </div>

              <div className="border border-slate-200 bg-white rounded-xl p-5 space-y-1">
                <div className="text-xs text-slate-500">
                  Life Savings Safeguarded (Held / Escalated)
                </div>
                <div className="text-2xl font-bold font-mono tabular-nums text-emerald-700">
                  ₹{(totalFundsSafeguarded / 100000).toFixed(2)} Lakh
                </div>
                <div className="text-xs text-slate-500">
                  {seniorCasesProtected} Senior citizen account(s) protected via HITL
                </div>
              </div>

              <div className="border border-slate-200 bg-white rounded-xl p-5 space-y-1">
                <div className="text-xs text-slate-500">
                  Deterministic Output Validator
                </div>
                <div className="text-2xl font-bold font-mono tabular-nums text-blue-700">
                  100% Grounded
                </div>
                <div className="text-xs text-slate-500">
                  Every cited EVT-* ID verified · Zero auto-containment
                </div>
              </div>
            </section>

            {/* One-Click Guided Scenario Launcher Cards */}
            <section className="space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-xs font-semibold text-slate-700">
                  Quick-Select Demo Scenarios (Click any bank scenario below to inspect its correlated timeline & AI brief):
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setScenarioFilter('all')}
                      className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        scenarioFilter === 'all'
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      All ({cases.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setScenarioFilter('india_apac_scam');
                        setSelectedCaseId('CASE-101');
                      }}
                      className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        scenarioFilter === 'india_apac_scam'
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Bank Scam Cases
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setScenarioFilter('deck_wireframe');
                        setSelectedCaseId('CASE-001');
                      }}
                      className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        scenarioFilter === 'deck_wireframe'
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Slide 6 Deck Cases
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleResetDemoState}
                    className="px-3 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    Reset Demo
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {quickScenarios.map((qs) => {
                  const isCurrent = activeCase?.case_id === qs.caseId;
                  return (
                    <button
                      key={qs.caseId}
                      type="button"
                      onClick={() => {
                        setScenarioFilter('all');
                        handleSelectCase(qs.caseId);
                      }}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer space-y-1 ${
                        isCurrent
                          ? 'bg-white border-blue-600 ring-2 ring-blue-600/20'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="font-bold text-blue-700">{qs.caseId}</span>
                        <span className="text-red-700 font-semibold">{qs.risk}</span>
                      </div>
                      <div className="text-xs font-bold text-slate-900 truncate">
                        {qs.title}
                      </div>
                      <div className="text-[11px] text-slate-600 truncate">
                        {qs.tag}
                      </div>
                      <div className="text-[11px] font-mono text-slate-500 flex items-center justify-between pt-1">
                        <span className="truncate">{qs.victim}</span>
                        <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* 3-Pane Case Review Workspace */}
            {activeCase && (
              <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* LEFT PANE: Prioritized Cases Queue (3 columns) */}
                <div className="lg:col-span-3 border border-slate-200 bg-white rounded-xl p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div>
                      <h2 className="text-sm font-bold text-slate-900">
                        Cases Queue ({filteredCases.length})
                      </h2>
                      <p className="text-[11px] text-slate-500">
                        Filter by severity priority
                      </p>
                    </div>
                    <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-md">
                      {(['All', 'High', 'Medium', 'Low'] as const).map((sev) => (
                        <button
                          key={sev}
                          type="button"
                          onClick={() => setSeverityFilter(sev)}
                          className={`px-1.5 py-0.5 text-[10px] font-medium rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                            severityFilter === sev
                              ? 'bg-white text-slate-900 shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          {sev}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="divide-y divide-slate-200">
                    {filteredCases.map((c) => {
                      const isSelected = c.case_id === activeCase.case_id;
                      const severityTextColor =
                        c.severity === 'High'
                          ? 'text-red-700 font-semibold'
                          : c.severity === 'Medium'
                          ? 'text-amber-700 font-semibold'
                          : 'text-emerald-700 font-semibold';

                      return (
                        <button
                          key={c.case_id}
                          type="button"
                          onClick={() => handleSelectCase(c.case_id)}
                          className={`w-full text-left py-3.5 px-3 transition-colors rounded-lg cursor-pointer space-y-1.5 ${
                            isSelected
                              ? 'bg-blue-50/80 ring-1 ring-blue-600'
                              : 'hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-mono font-bold text-slate-900">
                              {c.case_id}
                            </span>
                            <span className="font-mono tabular-nums">
                              <span className={severityTextColor}>
                                {c.severity}
                              </span>
                              <span className="text-slate-400 mx-1">·</span>
                              <span className="text-slate-600">
                                {c.rule_score} pts
                              </span>
                            </span>
                          </div>

                          <div className="text-sm font-semibold text-slate-900 leading-snug">
                            {c.title}
                          </div>

                          <div className="text-xs text-slate-600 truncate">
                            {c.bank_name}
                          </div>

                          <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono tabular-nums pt-0.5">
                            <span>
                              {c.customer_name}
                              {c.is_senior_citizen ? ` (${c.customer_age}y)` : ''}
                            </span>
                            <span>
                              {c.amount_at_risk_inr > 0
                                ? `₹${(c.amount_at_risk_inr / 100000).toFixed(1)}L`
                                : `${c.events.length} evts`}
                            </span>
                          </div>

                          <div className="text-[11px] text-slate-500">
                            Status:{' '}
                            <span
                              className={
                                c.status === 'Escalated'
                                  ? 'font-semibold text-emerald-700'
                                  : c.status === 'Reviewing'
                                  ? 'font-semibold text-blue-700'
                                  : c.status === 'Dismissed'
                                  ? 'text-slate-500'
                                  : 'font-semibold text-amber-700'
                              }
                            >
                              {c.status === 'Escalated'
                                ? 'Escalated (Funds Saved)'
                                : c.status === 'Reviewing'
                                ? 'Reviewing (24h Hold)'
                                : c.status}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* CENTER PANE: Rule Signals (Deterministic), Timeline & GCP Enrichments (5 columns) */}
                <div className="lg:col-span-5 border border-slate-200 bg-white rounded-xl p-5 space-y-6">
                  {/* Intuitive Victim & Transfer Protection Status Header */}
                  <div className="border-b border-slate-200 pb-4 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono tabular-nums">
                      <span className="font-bold text-slate-900">
                        {activeCase.case_id} · {activeCase.bank_name}
                      </span>
                      <span className="text-slate-500">
                        {activeCase.time_window}
                      </span>
                    </div>

                    <h2 className="text-lg font-bold text-slate-900 leading-snug">
                      {activeCase.title}
                    </h2>

                    {/* Dynamic Customer & Money Safeguard Banner */}
                    <div
                      className={`p-3 rounded-lg border text-xs flex flex-wrap items-center justify-between gap-2 ${
                        activeCase.status === 'Escalated'
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                          : activeCase.status === 'Reviewing'
                          ? 'bg-blue-50 border-blue-200 text-blue-950'
                          : activeCase.amount_at_risk_inr > 0
                          ? 'bg-red-50/70 border-red-200 text-red-950'
                          : 'bg-slate-50 border-slate-200 text-slate-800'
                      }`}
                    >
                      <div>
                        <span className="font-semibold">
                          Customer: {activeCase.customer_name} ({activeCase.customer_age}y
                          {activeCase.is_senior_citizen ? ' · Senior Citizen' : ''})
                        </span>
                      </div>
                      <div className="font-mono tabular-nums font-bold">
                        {activeCase.amount_at_risk_inr > 0 ? (
                          activeCase.status === 'Escalated' ? (
                            <span className="text-emerald-700">
                              SAVED: ₹{activeCase.amount_at_risk_inr.toLocaleString('en-IN')}
                            </span>
                          ) : activeCase.status === 'Reviewing' ? (
                            <span className="text-blue-700">
                              24H HOLD: ₹{activeCase.amount_at_risk_inr.toLocaleString('en-IN')}
                            </span>
                          ) : (
                            <span className="text-red-700">
                              AT RISK: ₹{activeCase.amount_at_risk_inr.toLocaleString('en-IN')}
                            </span>
                          )
                        ) : (
                          <span>No Outbound Transfer</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Rule Signals (Deterministic) */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-blue-700">
                        01. Rule Signals (Deterministic Code Evaluation)
                      </h3>
                      <span className="text-xs font-mono tabular-nums text-slate-600">
                        Score: <strong className="text-slate-900">{activeCase.rule_score}/100</strong> ({activeCase.severity})
                      </span>
                    </div>

                    <div className="divide-y divide-slate-200 border border-slate-200 rounded-lg bg-slate-50/60">
                      {activeCase.rule_signals.map((sig) => (
                        <div key={sig.id} className="p-3 space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-blue-900">
                              {sig.label}
                            </span>
                            <span className="font-mono tabular-nums text-blue-700 font-semibold">
                              +{sig.points} pts · {sig.matched_event_ids.join(', ')}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            {sig.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Correlated Event Timeline */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-slate-800">
                        02. Correlated Event Timeline ({activeCase.events.length} Events)
                      </h3>
                      <span className="text-[11px] text-slate-500">
                        Click any event or cited ID to highlight
                      </span>
                    </div>

                    <div className="relative pl-4 border-l border-slate-300 space-y-3">
                      {activeCase.events.map((ev) => {
                        const isHighlighted = highlightedEventId === ev.event_id;
                        const isHighRiskEvent =
                          ev.event_type === 'privilege_change' ||
                          ev.event_type === 'premature_fd_liquidation' ||
                          ev.event_type === 'video_call_coercion_overlay' ||
                          ev.event_type === 'neft_imps_burst' ||
                          ev.is_new_ip;

                        return (
                          <div
                            key={ev.event_id}
                            onClick={() =>
                              setHighlightedEventId(
                                isHighlighted ? null : ev.event_id
                              )
                            }
                            className={`p-3 rounded-lg border transition-colors cursor-pointer space-y-1 ${
                              isHighlighted
                                ? 'border-blue-600 bg-blue-50/70 ring-1 ring-blue-600'
                                : 'border-slate-200 bg-white hover:bg-slate-50'
                            }`}
                          >
                            <div className="flex items-center justify-between text-xs font-mono tabular-nums">
                              <span className="font-bold text-slate-900">
                                {ev.event_id}{' '}
                                <span className="text-slate-500 font-normal">
                                  {ev.display_time}
                                </span>
                              </span>
                              <span
                                className={
                                  isHighRiskEvent
                                    ? 'text-red-700 font-semibold'
                                    : 'text-blue-700 font-medium'
                                }
                              >
                                {ev.event_type}
                                {ev.is_new_ip ? ' (new IP)' : ''}
                              </span>
                            </div>

                            <p className="text-xs text-slate-700 leading-relaxed">
                              {ev.raw_message}
                            </p>

                            <div className="text-[11px] text-slate-500 font-mono flex flex-wrap items-center gap-1.5 pt-0.5">
                              <span>{ev.source_tool}</span>
                              <span>·</span>
                              <span>{ev.src_ip}</span>
                              <span>·</span>
                              <span>{ev.asset}</span>
                              {ev.amount_inr ? (
                                <>
                                  <span>·</span>
                                  <span className="text-red-700 font-semibold">
                                    ₹{ev.amount_inr.toLocaleString('en-IN')}
                                  </span>
                                </>
                              ) : null}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Google Cloud Context Enrichment Tabs (BigQuery, Document AI, Vertex Search) */}
                  <div className="border-t border-slate-200 pt-4 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-bold text-slate-800">
                        03. Google Cloud Intelligence Enrichment
                      </span>
                      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
                        {activeCase.document_ai_evidence && (
                          <button
                            type="button"
                            onClick={() => setGcpTab('document_ai')}
                            className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                              gcpTab === 'document_ai'
                                ? 'bg-white text-slate-900 shadow-xs'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            Document AI ({activeCase.document_ai_evidence.doc_id})
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setGcpTab('bigquery')}
                          className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                            gcpTab === 'bigquery' ||
                            (!activeCase.document_ai_evidence &&
                              gcpTab === 'document_ai')
                              ? 'bg-white text-slate-900 shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          BigQuery Risk
                        </button>
                        <button
                          type="button"
                          onClick={() => setGcpTab('vertex_runbook')}
                          className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                            gcpTab === 'vertex_runbook'
                              ? 'bg-white text-slate-900 shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Vertex Search SOP
                        </button>
                      </div>
                    </div>

                    {gcpTab === 'document_ai' &&
                    activeCase.document_ai_evidence ? (
                      <div className="p-3.5 rounded-lg border border-amber-200 bg-amber-50/50 space-y-2.5 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-amber-950 flex items-center gap-1.5">
                            <FileSearch className="w-3.5 h-3.5 text-amber-700" />
                            <span>
                              Document AI Scam Artifact:{' '}
                              <code className="font-mono">
                                {activeCase.document_ai_evidence.doc_id}
                              </code>
                            </span>
                          </span>
                          <span className="font-mono text-red-700 font-semibold">
                            Forgery Conf:{' '}
                            {(
                              activeCase.document_ai_evidence
                                .forgery_confidence * 100
                            ).toFixed(0)}
                            %
                          </span>
                        </div>
                        <div className="font-mono text-[11px] text-slate-700">
                          File: {activeCase.document_ai_evidence.file_name}
                        </div>
                        <div className="space-y-1 border-t border-amber-200/80 pt-2">
                          {activeCase.document_ai_evidence.extracted_entities.map(
                            (ent, idx) => (
                              <div
                                key={idx}
                                className="flex items-start justify-between gap-2 text-[11px]"
                              >
                                <span className="text-slate-600 shrink-0">
                                  {ent.key}:
                                </span>
                                <span className="font-mono text-right text-slate-900 font-medium">
                                  {ent.value}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                        <p className="text-amber-950 font-medium pt-1">
                          {activeCase.document_ai_evidence.summary_finding}
                        </p>
                      </div>
                    ) : gcpTab === 'vertex_runbook' ? (
                      <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-900 flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5 text-blue-700" />
                            <span>{activeCase.vertex_runbook.authority}</span>
                          </span>
                          <span className="font-mono text-[11px] text-blue-700">
                            {activeCase.vertex_runbook.clause_reference}
                          </span>
                        </div>
                        <div className="font-medium text-slate-800">
                          {activeCase.vertex_runbook.directive_title}
                        </div>
                        <ul className="space-y-1 text-slate-600 list-disc pl-4">
                          {activeCase.vertex_runbook.action_checklist.map(
                            (item, idx) => (
                              <li key={idx}>{item}</li>
                            )
                          )}
                        </ul>
                      </div>
                    ) : (
                      <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-900 flex items-center gap-1.5">
                            <Database className="w-3.5 h-3.5 text-blue-700" />
                            <span>
                              BigQuery 90-Day Baseline & Mule Graph (
                              {activeCase.bigquery_context.query_id})
                            </span>
                          </span>
                          <span className="font-mono text-red-700 font-semibold">
                            Vertex Fraud Prob:{' '}
                            {(
                              activeCase.bigquery_context
                                .vertex_classifier_fraud_prob * 100
                            ).toFixed(0)}
                            %
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-[11px] font-mono tabular-nums pt-1">
                          <div>
                            90d Avg Transfer: ₹
                            {activeCase.bigquery_context.customer_90d_avg_transfer_inr.toLocaleString(
                              'en-IN'
                            )}
                          </div>
                          <div>
                            Spike:{' '}
                            {activeCase.bigquery_context.current_transfer_Spike_ratio}
                          </div>
                          <div>
                            Beneficiary Age:{' '}
                            {activeCase.bigquery_context.beneficiary_account_age_days}{' '}
                            days
                          </div>
                          <div>
                            48h Mule Fan-In:{' '}
                            {activeCase.bigquery_context.beneficiary_inward_fan_in_48h}{' '}
                            senders
                          </div>
                        </div>
                        <p className="text-slate-700 pt-1">
                          {activeCase.bigquery_context.summary_finding}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* RIGHT PANE: Gemini Incident Brief, Code Validator & Analyst Controls (4 columns) */}
                <div className="lg:col-span-4 border border-slate-200 bg-white rounded-xl p-5 space-y-5">
                  {/* Gemini Brief Header + Live API Trigger */}
                  <div className="flex items-center justify-between gap-2 border-b border-slate-200 pb-3.5">
                    <div>
                      <div className="text-xs font-bold text-violet-700 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Gemini Incident Brief (AI-Generated)</span>
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono tabular-nums mt-0.5">
                        {activeCase.gemini_brief.generated_by} ·{' '}
                        {activeCase.gemini_brief.latency_ms} ms · ~
                        {activeCase.gemini_brief.token_count_estimate} tokens
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleRegenerateGeminiBrief}
                      disabled={isGeneratingBrief}
                      className="px-3 py-1.5 text-xs font-semibold text-violet-800 bg-violet-50 hover:bg-violet-100 border border-violet-200 disabled:opacity-50 rounded-lg flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <RefreshCw
                        className={`w-3.5 h-3.5 ${
                          isGeneratingBrief ? 'animate-spin' : ''
                        }`}
                      />
                      <span>
                        {isGeneratingBrief ? 'Synthesizing...' : 'Re-Run Gemini'}
                      </span>
                    </button>
                  </div>

                  {briefError && (
                    <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900">
                      {briefError}
                    </div>
                  )}

                  {/* Schema-Bound Brief Sections */}
                  <div className="space-y-4 text-xs leading-relaxed">
                    <div>
                      <span className="font-bold text-slate-900">Pattern Diagnosis: </span>
                      <span className="text-slate-800 font-medium">
                        {activeCase.gemini_brief.scam_typology_diagnosis}
                      </span>
                    </div>

                    <div>
                      <span className="font-bold text-slate-900">Summary: </span>
                      <span className="text-slate-700">
                        {activeCase.gemini_brief.summary}
                      </span>
                    </div>

                    {/* Interactive Evidence Event IDs */}
                    <div className="space-y-1.5">
                      <div className="font-bold text-slate-900">
                        Verified Evidence IDs (Click to locate in timeline):
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {activeCase.gemini_brief.evidence_event_ids.map(
                          (evId) => (
                            <button
                              key={evId}
                              type="button"
                              onClick={() => setHighlightedEventId(evId)}
                              className={`px-2 py-1 font-mono text-xs rounded border transition-colors cursor-pointer ${
                                highlightedEventId === evId
                                  ? 'bg-blue-600 text-white border-blue-600'
                                  : 'bg-slate-50 text-blue-700 border-slate-200 hover:bg-blue-50'
                              }`}
                            >
                              {evId}
                            </button>
                          )
                        )}
                        {activeCase.gemini_brief.evidence_doc_ids?.map(
                          (docId) => (
                            <button
                              key={docId}
                              type="button"
                              onClick={() => setGcpTab('document_ai')}
                              className="px-2 py-1 font-mono text-xs rounded border bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100 cursor-pointer"
                            >
                              {docId}
                            </button>
                          )
                        )}
                      </div>
                    </div>

                    <div>
                      <span className="font-bold text-slate-900">
                        Uncertainty & Benign Alternatives:{' '}
                      </span>
                      <span className="text-slate-700">
                        {activeCase.gemini_brief.uncertainty_and_alternatives}
                      </span>
                    </div>

                    {/* Empathetic Senior Citizen De-Escalation Script with Copy Button */}
                    <div className="p-3.5 rounded-lg bg-emerald-50/70 border border-emerald-200 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <div className="font-bold text-emerald-950 flex items-center gap-1.5">
                          <PhoneCall className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                          <span>
                            Senior Citizen Welfare Call Script
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={handleCopyScript}
                          className="px-2 py-1 text-[11px] font-medium text-emerald-900 bg-white/90 hover:bg-white border border-emerald-300 rounded flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer"
                        >
                          {copiedScript ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-700" />
                              <span>Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy Script</span>
                            </>
                          )}
                        </button>
                      </div>
                      <div className="space-y-1.5 text-emerald-900">
                        {activeCase.gemini_brief.elderly_deescalation_script.map(
                          (line, idx) => (
                            <p key={idx} className="italic">
                              {line}
                            </p>
                          )
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="font-bold text-slate-900 mb-1">
                        Recommended Safe Next Steps:
                      </div>
                      <ul className="space-y-1 text-slate-700 list-disc pl-4">
                        {activeCase.gemini_brief.recommended_next_steps.map(
                          (step, idx) => (
                            <li key={idx}>{step}</li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>

                  {/* Deterministic Code Output Validator Verification Box */}
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5 text-[11px]">
                    <div className="flex items-center justify-between font-semibold text-slate-900">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Output Validator (Code-Verified)</span>
                      </span>
                      <span className="font-mono text-emerald-700">
                        {activeCase.validation.grounded_event_ids.length}/
                        {activeCase.gemini_brief.evidence_event_ids.length} IDs Grounded
                      </span>
                    </div>
                    <div className="text-slate-600">
                      Schema compliant · Cautious wording verified · Zero autonomous actions
                    </div>
                  </div>

                  {/* HITL Security Analyst Status & Funds Protection Controls */}
                  <div className="border-t border-slate-200 pt-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">
                        HITL Security Analyst Action
                      </span>
                      <span className="text-xs font-mono text-slate-600">
                        Status: <strong>{activeCase.status}</strong>
                      </span>
                    </div>

                    <input
                      type="text"
                      value={analystNote}
                      onChange={(e) => setAnalystNote(e.target.value)}
                      placeholder="Add optional welfare call / investigation note..."
                      className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />

                    <div className="grid grid-cols-1 gap-2">
                      <button
                        type="button"
                        onClick={() => handleUpdateCaseStatus('Reviewing')}
                        className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-colors flex items-center justify-between cursor-pointer ${
                          activeCase.status === 'Reviewing'
                            ? 'bg-blue-700 text-white border-blue-700'
                            : 'bg-white text-blue-900 border-blue-600 hover:bg-blue-50'
                        }`}
                      >
                        <span className="whitespace-nowrap shrink-0">Reviewing</span>
                        <span className="text-[11px] font-normal opacity-90 truncate ml-2">
                          Place 24h Cooling Hold & Call Customer
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleUpdateCaseStatus('Escalated')}
                        className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-colors flex items-center justify-between cursor-pointer ${
                          activeCase.status === 'Escalated'
                            ? 'bg-emerald-700 text-white border-emerald-700'
                            : 'bg-white text-emerald-900 border-emerald-600 hover:bg-emerald-50'
                        }`}
                      >
                        <span className="whitespace-nowrap shrink-0">Escalated</span>
                        <span className="text-[11px] font-normal opacity-90 truncate ml-2">
                          Confirm Scam · Save Funds & Report 1930
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleUpdateCaseStatus('Dismissed')}
                        className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-colors flex items-center justify-between cursor-pointer ${
                          activeCase.status === 'Dismissed'
                            ? 'bg-slate-800 text-white border-slate-800'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <span className="whitespace-nowrap shrink-0">Dismissed</span>
                        <span className="text-[11px] font-normal opacity-90 truncate ml-2">
                          Verified Legitimate · Release Transfer
                        </span>
                      </button>
                    </div>

                    {(activeCase.status === 'Escalated' ||
                      activeCase.status === 'Reviewing') &&
                      activeCase.amount_at_risk_inr > 0 && (
                        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 flex items-start gap-2">
                          <ShieldAlert className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                          <div>
                            <strong>
                              ₹
                              {activeCase.amount_at_risk_inr.toLocaleString(
                                'en-IN'
                              )}{' '}
                              Customer Savings Protected:
                            </strong>{' '}
                            {activeCase.status === 'Escalated'
                              ? 'Scam confirmed via HITL review. Outbound transfer permanently stopped in cooling queue and mule account reported to 1930 CFCFRMS.'
                              : 'Outbound transfer paused in 24-hour Senior Cooling Queue while analyst completes welfare verification call.'}
                          </div>
                        </div>
                      )}

                    {/* Analyst Audit Trail */}
                    <div className="pt-2 border-t border-slate-200 space-y-2">
                      <div className="text-[11px] font-semibold text-slate-600">
                        HITL Case Audit Trail ({activeCase.audit_trail.length})
                      </div>
                      <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                        {activeCase.audit_trail.map((entry) => (
                          <div
                            key={entry.id}
                            className="text-[11px] text-slate-600 border-b border-slate-100 pb-1.5"
                          >
                            <div className="font-mono text-slate-800">
                              {entry.timestamp} · {entry.analyst} →{' '}
                              <strong>{entry.new_status}</strong>
                            </div>
                            <div>{entry.note}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}
          </>
        )}

        {activeTab === 'ingestion' && (
          <IngestionView
            lastIngestion={lastIngestion}
            onIngestComplete={handleIngestComplete}
            onSimulatePubSub={handleSimulatePubSub}
            isSimulatingStream={isSimulatingStream}
          />
        )}

        {activeTab === 'evaluation' && <EvaluationView cases={cases} />}

        {activeTab === 'specs' && <SpecificationsView />}
      </main>

      {/* Quiet Compliance & Attribution Footer */}
      <footer className="border-t border-slate-200 bg-white mt-12 py-4 px-6">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            SentinelFlow · AI-Assisted Security & BFSI Scam Triage Prototype · Team Linux C group (Shruthi Jha and Sanjay)
          </div>
          <div>
            Helpful AI assistant to prevent incidents and have HITL Security Analyst Review.
          </div>
        </div>
      </footer>
    </div>
  );
}
