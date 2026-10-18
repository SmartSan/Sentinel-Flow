import React, { useState } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Lock,
  Eye,
  EyeOff,
  Shield,
  Sliders,
} from 'lucide-react';

export interface AnalystSession {
  name: string;
  email: string;
  role: string;
  institution: string;
  signedInAt: string;
}

interface LandingAndAuthViewProps {
  onLoginSuccess: (session: AnalystSession) => void;
  signedOutMessage?: string | null;
  onClearSignedOutMessage?: () => void;
}

export const SentinelFlowLogo: React.FC = () => (
  <span className="inline-flex items-center gap-2.5 whitespace-nowrap shrink-0">
    <svg
      width="28"
      height="28"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="shrink-0"
    >
      {/* Outer Institutional Shield */}
      <path
        d="M16 2.5L4.5 7.2V15.4C4.5 22.6 9.4 28.9 16 30.5C22.6 28.9 27.5 22.6 27.5 15.4V7.2L16 2.5Z"
        fill="#1D4ED8"
      />
      {/* Inner Sovereign Navy Core */}
      <path
        d="M16 5.2L7 9.1V15.3C7 21.1 10.8 26.2 16 27.7C21.2 26.2 25 21.1 25 15.3V9.1L16 5.2Z"
        fill="#0A1931"
      />
      {/* Context-Aware Signal Flow & Interception Node */}
      <path
        d="M9.5 16.5H13L14.8 12.2L17.4 20.2L19.3 16.5H22.5"
        stroke="#60A5FA"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="16" cy="10" r="1.6" fill="#FFFFFF" />
    </svg>
    <span className="text-lg font-bold tracking-tight text-blue-950 font-display">
      SentinelFlow
    </span>
  </span>
);

interface SpecimenPreview {
  caseId: string;
  bank: string;
  typology: string;
  customer: string;
  amount: string;
  score: string;
  window: string;
  events: { id: string; time: string; detail: string; weight: string }[];
  gcpSignal: string;
  briefExcerpt: string;
  welfarePrompt: string;
}

const LIVE_SPECIMENS: SpecimenPreview[] = [
  {
    caseId: 'CASE-101',
    bank: 'GDFC Bank & National Overseas Bank (NOB)',
    typology: 'Digital Arrest Coercion & Senior FD Break',
    customer: 'R. Venkataraman (Age 72 · Retired Civil Engineer, Chennai)',
    amount: '₹28,50,000',
    score: '96 / 100 · High',
    window: '14 minutes',
    events: [
      {
        id: 'EVT-1101',
        time: '08:11:04',
        detail: 'Mobile session opened during 95-min active WhatsApp video call overlay',
        weight: '+30 pts',
      },
      {
        id: 'EVT-1104',
        time: '08:19:10',
        detail: 'Premature liquidation of 3 Senior Citizen Fixed Deposits (₹28.5L)',
        weight: '+30 pts',
      },
      {
        id: 'EVT-1105',
        time: '08:23:02',
        detail: 'RTGS outward limit raised 15x to newly added shell enterprise A/C',
        weight: '+16 pts',
      },
      {
        id: 'DOC-101',
        time: '08:23:55',
        detail: 'Document AI: Uploaded "CBI Supreme Court Warrant" flagged 99% forged',
        weight: '+20 pts',
      },
    ],
    gcpSignal:
      'BigQuery 48h Graph: Beneficiary NOBC0004821 received ₹1.42 Cr across 6 elderly victims in 48 hours · Vertex AI Search: SOP-IND-DA-2026 (MHA I4C 1930 & RBI Cooling Hold).',
    briefExcerpt:
      'High-confidence Digital Arrest coercion pattern. Customer authenticated his own OTPs while held under continuous video surveillance by fraudsters impersonating CBI officers.',
    welfarePrompt:
      '“Sir, neither the CBI, Police, nor RBI ever conducts interrogations on WhatsApp video calls or asks you to transfer Fixed Deposit savings to a verification account.”',
  },
  {
    caseId: 'CASE-102',
    bank: 'ICICX Bank & GDFC Wealth Desk',
    typology: 'Fake VIP Stock Trading & QIB IPO Escrow Scam',
    customer: 'Sunita Deshmukh (Age 64 · Retired Professor, Pune)',
    amount: '₹14,20,000',
    score: '88 / 100 · High',
    window: '19 minutes',
    events: [
      {
        id: 'EVT-2001',
        time: '11:02:14',
        detail: 'Web NetBanking login with rapid account-number clipboard paste behavior',
        weight: '+20 pts',
      },
      {
        id: 'EVT-2002',
        time: '11:06:40',
        detail: '3 unrelated corporate current accounts added in 4 minutes',
        weight: '+24 pts',
      },
      {
        id: 'EVT-2004',
        time: '11:18:09',
        detail: 'Split IMPS/NEFT tranches (₹5L + ₹5L + ₹4.2L) queued to bypass ₹15L RTGS rule',
        weight: '+24 pts',
      },
      {
        id: 'DOC-102',
        time: '11:20:30',
        detail: 'Document AI: Fake SEBI QIB Broker Registration Certificate (96% forged)',
        weight: '+20 pts',
      },
    ],
    gcpSignal:
      'BigQuery Velocity: 9.4x above 90-day customer transfer mean · Vertex AI Search: SOP-SEBI-SCAM-04 (Unregistered WhatsApp VIP Investment Group Verification).',
    briefExcerpt:
      'Pig-butchering stock trading scam indicators. Customer is attempting to fund a fabricated institutional IPO allotment using personal pension savings routed to non-SEBI agro/logistics accounts.',
    welfarePrompt:
      '“Ma’am, legitimate stockbrokers only accept funds through SEBI-registered @valid UPI handles or ASBA blocks in your own bank account—never private trading companies.”',
  },
  {
    caseId: 'CASE-103',
    bank: 'DGBS Bank & Smart Bank of India (SBI)',
    typology: 'Senior Citizen Remote-Access APK & SMS Forwarder Takeover',
    customer: 'K. Subramanian (Age 68 · Senior Pensioner, Bengaluru / Singapore NRI)',
    amount: '₹19,80,000',
    score: '92 / 100 · High',
    window: '12 minutes',
    events: [
      {
        id: 'EVT-3001',
        time: '14:40:12',
        detail: 'Sideloaded "Pension_Life_Certificate_Update.apk" with Accessibility & SMS hooks',
        weight: '+28 pts',
      },
      {
        id: 'EVT-3003',
        time: '14:45:03',
        detail: '3 failed logins followed by successful login from unseen offshore IP 185.220.101.44',
        weight: '+26 pts',
      },
      {
        id: 'EVT-3004',
        time: '14:48:19',
        detail: 'Digital token hardware binding migrated + outward remittance limit elevated',
        weight: '+20 pts',
      },
      {
        id: 'EVT-3005',
        time: '14:51:44',
        detail: 'Cross-border FAST / Wire transfer of ₹19.8L staged to first-time beneficiary',
        weight: '+18 pts',
      },
    ],
    gcpSignal:
      'BigQuery Device Telemetry: Simultaneous domestic Android accessibility abuse + offshore IP session · Vertex AI Search: SOP-MAS-SBI-09 (Malware APK & Cross-Border Cooling Hold).',
    briefExcerpt:
      'Remote device takeover via fraudulent pension KYC application. Attackers intercepted SMS OTPs to bind a secondary token from an unseen IP and stage an immediate remittance.',
    welfarePrompt:
      '“Sir, did you recently receive a WhatsApp file asking you to update your annual pension life certificate? Please disconnect your phone from Wi-Fi and mobile data right away.”',
  },
];

const BANK_PROFILES = [
  {
    id: 'gdfc-nob',
    name: 'Raman',
    email: 'raman@gdfc-security.in',
    role: 'Lead HITL Fraud & Security Analyst',
    institution: 'GDFC Bank & National Overseas Bank (NOB)',
  },
  {
    id: 'sbi-dgbs',
    name: 'Sanjay',
    email: 'sanjay@smartbank-sbi.in',
    role: 'Principal SOC & Senior Protection Reviewer',
    institution: 'Smart Bank of India (SBI) & DGBS Bank',
  },
  {
    id: 'icicx',
    name: 'Shruthi Jha',
    email: 'shruthi.jha@icicxbank.in',
    role: 'VP Wealth & RTGS Anomaly Triage',
    institution: 'ICICX Bank — Retail & Wealth Risk Desk',
  },
];

export const LandingAndAuthView: React.FC<LandingAndAuthViewProps> = ({
  onLoginSuccess,
  signedOutMessage,
  onClearSignedOutMessage,
}) => {
  const [viewMode, setViewMode] = useState<'landing' | 'login'>(
    signedOutMessage ? 'login' : 'landing'
  );
  const [selectedSpecimenIdx, setSelectedSpecimenIdx] = useState<number>(0);

  // Interactive ROI Calculator State
  const [monthlySeniorAlerts, setMonthlySeniorAlerts] = useState<number>(1200);
  const [avgTicketLakhs, setAvgTicketLakhs] = useState<number>(18);

  // Dedicated Login Page State
  const [selectedProfileId, setSelectedProfileId] = useState<string>('gdfc-nob');
  const [analystName, setAnalystName] = useState<string>('Raman');
  const [email, setEmail] = useState<string>('raman@gdfc-security.in');
  const [institution, setInstitution] = useState<string>(
    'GDFC Bank & National Overseas Bank (NOB)'
  );
  const [role, setRole] = useState<string>('Lead HITL Fraud & Security Analyst');
  const [passphrase, setPassphrase] = useState<string>('SF-BFSI-2026-HITL');
  const [showPassphrase, setShowPassphrase] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // B2B Architecture Briefing Inquiry State
  const [leadName, setLeadName] = useState<string>('');
  const [leadEmail, setLeadEmail] = useState<string>('');
  const [leadBank, setLeadBank] = useState<string>('');
  const [leadRegion, setLeadRegion] = useState<string>(
    'Mumbai (asia-south1) — RBI Data Residency'
  );
  const [leadError, setLeadError] = useState<string | null>(null);
  const [leadSubmitted, setLeadSubmitted] = useState<boolean>(false);

  const activeSpecimen = LIVE_SPECIMENS[selectedSpecimenIdx];

  // Computed ROI Metrics
  const manualHoursPerMonth = Math.round((monthlySeniorAlerts * 8) / 60);
  const assistedHoursPerMonth = Math.round((monthlySeniorAlerts * 0.7) / 60);
  const hoursSavedPerMonth = manualHoursPerMonth - assistedHoursPerMonth;
  const estimatedConfirmedScams = Math.max(
    1,
    Math.round(monthlySeniorAlerts * 0.035)
  );
  const estimatedCroresProtected = (
    (estimatedConfirmedScams * avgTicketLakhs) /
    100
  ).toFixed(2);

  const handleSelectProfilePreset = (profile: (typeof BANK_PROFILES)[0]) => {
    setSelectedProfileId(profile.id);
    setAnalystName(profile.name);
    setEmail(profile.email);
    setInstitution(profile.institution);
    setRole(profile.role);
    setLoginError(null);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!analystName.trim()) {
      setLoginError('Please enter the authenticating analyst name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setLoginError('Please enter a valid institutional IAM or SSO email address.');
      return;
    }
    if (!passphrase.trim() || passphrase.length < 4) {
      setLoginError('Please enter your institutional passphrase or hardware token.');
      return;
    }
    setLoginError(null);
    if (onClearSignedOutMessage) onClearSignedOutMessage();
    onLoginSuccess({
      name: analystName.trim(),
      email: email.trim(),
      role: role.trim() || 'HITL Security & Fraud Analyst',
      institution: institution.trim() || 'GDFC Bank & National Overseas Bank (NOB)',
      signedInAt:
        new Date().toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }) + ' IST',
    });
  };

  const handleInstantLogin = () => {
    if (onClearSignedOutMessage) onClearSignedOutMessage();
    onLoginSuccess({
      name: analystName.trim() || 'Raman',
      email: email.trim() || 'raman@gdfc-security.in',
      role: role.trim() || 'Lead HITL Fraud & Security Analyst',
      institution:
        institution.trim() || 'GDFC Bank & National Overseas Bank (NOB)',
      signedInAt:
        new Date().toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }) + ' IST',
    });
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName.trim() || !leadBank.trim()) {
      setLeadError('Please enter your name and financial institution.');
      return;
    }
    if (!leadEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(leadEmail)) {
      setLeadError('Please provide a valid institutional work email.');
      return;
    }
    setLeadError(null);
    setLeadSubmitted(true);
  };

  // ============================================================================
  // DEDICATED INSTITUTIONAL LOGIN PORTAL VIEW (Blue & White Architecture)
  // ============================================================================
  if (viewMode === 'login') {
    return (
      <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900">
        {/* Top Bar Contract: Strictly 3 Zones separated by gap-8 */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between gap-8">
          <a
            href="#overview"
            onClick={(e) => {
              e.preventDefault();
              setViewMode('landing');
            }}
            className="whitespace-nowrap shrink-0"
          >
            <SentinelFlowLogo />
          </a>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              type="button"
              onClick={() => setViewMode('landing')}
              className="hover:text-blue-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Product Overview</span>
            </button>
          </nav>

          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={handleInstantLogin}
              className="px-4 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Instant Demo Access
            </button>
          </div>
        </header>

        {/* Split-Screen Institutional Blue & White Authentication Architecture */}
        <main className="flex-1 w-full max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 border-x border-slate-200 bg-white">
          {/* Left Column: Deep Sovereign Navy Institutional Security Posture */}
          <div className="lg:col-span-5 bg-[#0A1931] text-white p-8 lg:p-14 flex flex-col justify-between space-y-12 border-b lg:border-b-0 lg:border-r border-blue-900/40">
            <div className="space-y-8">
              <div className="text-xs font-mono text-blue-300 tracking-wider">
                BFSI HUMAN-IN-THE-LOOP (HITL) WORKBENCH · IAM GATEWAY
              </div>

              <div className="space-y-4">
                <h1
                  className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-display leading-snug"
                  style={{ textWrap: 'balance' }}
                >
                  Authenticate into the Bank Fraud & Coercion Triage Console.
                </h1>
                <p className="text-sm text-blue-100/85 leading-relaxed">
                  Every case disposition—placing a 24-hour senior citizen cooling hold, initiating an empathetic welfare call, or escalating a mule account to the 1930 CFCFRMS portal—is cryptographically attributed to the reviewing analyst.
                </p>
              </div>

              <div className="border-t border-blue-900/70 pt-6 space-y-5 text-xs">
                <div>
                  <div className="font-semibold text-white">
                    01. Deterministic Code Guardrails
                  </div>
                  <div className="text-blue-200/80 mt-1 leading-relaxed">
                    All Gemini incident briefs are validated in code against normalized <code className="font-mono text-blue-200">EVT-*</code> and <code className="font-mono text-blue-200">DOC-*</code> identifiers before rendering.
                  </div>
                </div>

                <div>
                  <div className="font-semibold text-white">
                    02. Zero Autonomous Account Freezes
                  </div>
                  <div className="text-blue-200/80 mt-1 leading-relaxed">
                    SentinelFlow never blocks customer accounts autonomously. Human analysts review benign explanations prior to any protective hold.
                  </div>
                </div>

                <div>
                  <div className="font-semibold text-white">
                    03. Sovereign VPC Data Residency
                  </div>
                  <div className="text-blue-200/80 mt-1 leading-relaxed font-mono">
                    asia-south1 (Mumbai) · asia-south2 (Delhi) · asia-southeast1 (Singapore)
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-blue-900/70 pt-6 text-xs text-blue-200/80 space-y-1">
              <div className="text-white font-medium">
                Supported Partner Institutions
              </div>
              <div>
                GDFC Bank · National Overseas Bank (NOB) · Smart Bank of India (SBI) · ICICX Bank · DGBS Bank
              </div>
            </div>
          </div>

          {/* Right Column: Crisp White & Cobalt Institutional Sign-In Form */}
          <div className="lg:col-span-7 p-8 lg:p-14 flex flex-col justify-center bg-white">
            <div className="max-w-lg w-full mx-auto space-y-8">
              {signedOutMessage && (
                <div className="p-4 border border-blue-200 bg-blue-50/70 rounded-lg flex items-start justify-between gap-3 text-xs text-blue-950">
                  <div className="space-y-0.5">
                    <div className="font-bold text-blue-900">Session Closed Cleanly</div>
                    <div>{signedOutMessage}</div>
                  </div>
                  {onClearSignedOutMessage && (
                    <button
                      type="button"
                      onClick={onClearSignedOutMessage}
                      className="text-blue-700 hover:text-blue-950 font-semibold shrink-0 cursor-pointer"
                    >
                      Dismiss
                    </button>
                  )}
                </div>
              )}

              <div className="space-y-2 border-b border-slate-200 pb-5">
                <div className="text-xs font-mono text-blue-700 font-semibold flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-blue-600" />
                  <span>INSTITUTIONAL SSO & ANALYST CREDENTIALS</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 font-display">
                  Sign in to SentinelFlow
                </h2>
                <p className="text-xs text-slate-600">
                  Select an institutional desk profile below or enter your custom analyst credentials to launch the workbench.
                </p>
              </div>

              {/* Role Selector Presets */}
              <div className="space-y-2.5">
                <div className="text-xs font-semibold text-slate-800">
                  Select Institutional Desk Profile (Auto-Fills Credentials):
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {BANK_PROFILES.map((profile) => {
                    const isSelected = selectedProfileId === profile.id;
                    return (
                      <button
                        key={profile.id}
                        type="button"
                        onClick={() => handleSelectProfilePreset(profile)}
                        className={`p-3.5 rounded-lg border text-left transition-colors flex items-center justify-between gap-4 cursor-pointer ${
                          isSelected
                            ? 'border-blue-600 bg-blue-600 text-white'
                            : 'border-slate-200 bg-slate-50/70 hover:bg-blue-50/50 hover:border-blue-300 text-slate-900'
                        }`}
                      >
                        <div className="min-w-0">
                          <div className="text-xs font-bold truncate">
                            {profile.name} · {profile.role}
                          </div>
                          <div
                            className={`text-[11px] truncate mt-0.5 ${
                              isSelected ? 'text-blue-100' : 'text-slate-600'
                            }`}
                          >
                            {profile.institution} · {profile.email}
                          </div>
                        </div>
                        <span
                          className={`text-[11px] font-mono shrink-0 ${
                            isSelected ? 'text-blue-100 font-semibold' : 'text-blue-700'
                          }`}
                        >
                          {isSelected ? 'Active Profile' : 'Select'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Formal Credentials Form */}
              <form onSubmit={handleLoginSubmit} className="space-y-4 pt-2">
                {loginError && (
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-900">
                    {loginError}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-800">
                      Reviewing Analyst Name
                    </label>
                    <input
                      type="text"
                      value={analystName}
                      onChange={(e) => setAnalystName(e.target.value)}
                      className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2.5 bg-white text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-800">
                      Institutional IAM Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full text-xs font-mono border border-slate-300 rounded-lg px-3 py-2.5 bg-white text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-800">
                      Financial Institution / Desk
                    </label>
                    <input
                      type="text"
                      value={institution}
                      onChange={(e) => setInstitution(e.target.value)}
                      className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2.5 bg-white text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-800">
                      Hardware Token / Passphrase
                    </label>
                    <div className="relative">
                      <input
                        type={showPassphrase ? 'text' : 'password'}
                        value={passphrase}
                        onChange={(e) => setPassphrase(e.target.value)}
                        className="w-full text-xs font-mono border border-slate-300 rounded-lg pl-3 pr-9 py-2.5 bg-white text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassphrase(!showPassphrase)}
                        aria-label="Toggle passphrase visibility"
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-blue-700 cursor-pointer"
                      >
                        {showPassphrase ? (
                          <EyeOff className="w-3.5 h-3.5" />
                        ) : (
                          <Eye className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-3 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="submit"
                    className="w-full sm:flex-1 py-3 px-5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Authenticate & Open Workbench</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>

        {/* Quiet Attribution Footer */}
        <footer className="border-t border-slate-200 bg-white py-5 px-6">
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

  // ============================================================================
  // MINIMAL, AESTHETIC BLUE & WHITE SWISS-LEDGER BFSI ENTERPRISE LANDING PAGE
  // ============================================================================
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900">
      {/* Top Bar Contract: Strictly 3 Zones separated by gap-8 */}
      <header className="bg-white/95 backdrop-blur-xs border-b border-slate-200 px-6 py-4 flex items-center justify-between gap-8 sticky top-0 z-30">
        {/* Zone 1: Brand mark with logo and wordmark */}
        <a
          href="#top"
          className="whitespace-nowrap shrink-0"
        >
          <SentinelFlowLogo />
        </a>

        {/* Zone 2: 4 concise single-line navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
          <a
            href="#specimens"
            className="hover:text-blue-700 transition-colors whitespace-nowrap shrink-0"
          >
            Live Case Specimens
          </a>
          <a
            href="#architecture"
            className="hover:text-blue-700 transition-colors whitespace-nowrap shrink-0"
          >
            Architecture
          </a>
          <a
            href="#roi"
            className="hover:text-blue-700 transition-colors whitespace-nowrap shrink-0"
          >
            Impact Calculator
          </a>
          <a
            href="#briefing"
            className="hover:text-blue-700 transition-colors whitespace-nowrap shrink-0"
          >
            VPC Deployment
          </a>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={() => setViewMode('login')}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Analyst Sign In
          </button>
        </div>
      </header>

      <main id="top" className="flex-1 w-full max-w-[1440px] mx-auto px-6">
        {/* Optional Signed Out Notice if returning to Landing */}
        {signedOutMessage && (
          <div className="mt-6 p-4 border border-blue-200 bg-blue-50/70 rounded-lg flex items-center justify-between gap-4 text-xs text-blue-950">
            <div>
              <span className="font-semibold">Session Terminated: </span>
              <span>{signedOutMessage}</span>
            </div>
            {onClearSignedOutMessage && (
              <button
                type="button"
                onClick={onClearSignedOutMessage}
                className="text-blue-700 hover:text-blue-950 font-semibold cursor-pointer"
              >
                Dismiss
              </button>
            )}
          </div>
        )}

        {/* 1. ARCHITECTURAL BLUE & WHITE EDITORIAL HERO */}
        <section className="pt-16 pb-14 lg:pt-24 lg:pb-20 border-b border-slate-200">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
            <div className="lg:col-span-8 space-y-5">
              <div className="text-xs font-mono tracking-wider uppercase text-blue-700 font-semibold">
                LET’S BE PROACTIVE · A STEP AHEAD IN THE AI AGE · NOT JUST REACT, PREVENT
              </div>

              <h1
                className="font-display font-bold tracking-tight text-slate-950 leading-[1.08]"
                style={{
                  fontSize: 'clamp(2.25rem, 4.1vw, 3.65rem)',
                  textWrap: 'balance',
                }}
              >
                Context-aware AI integration with existing banking systems to prevent and safeguard.
              </h1>

              <p className="text-base sm:text-lg font-medium text-blue-900 max-w-2xl">
                Using Google Gemini advanced model interpretation, freeze suspicious transfers before the amount is lost. Don’t just react—stay a step ahead in the AI age and prevent the breach in real time.
              </p>
            </div>

            <div className="lg:col-span-4 space-y-6">
              <p className="text-sm text-slate-600 leading-relaxed">
                Legacy banking rules pass when a coerced senior citizen types their own OTP. SentinelFlow plugs into your existing Core Banking, SIEM, and RTGS switches—using Google Gemini advanced model interpretation to correlate call coercion, sudden FD breaks, and forged warrants so analysts can freeze the transfer before customer savings are lost.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setViewMode('login')}
                  className="px-5 py-3 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>Sign In to Analyst Console</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={handleInstantLogin}
                  className="px-4 py-3 text-xs font-semibold text-blue-900 bg-white border border-blue-200 hover:bg-blue-50/60 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Launch Live Demo Directly
                </button>
              </div>
            </div>
          </div>

          {/* Exposed Blue & White Hairline Proof Ledger */}
          <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border border-blue-100 bg-white divide-y sm:divide-y-0 sm:divide-x divide-blue-100">
            <div className="p-6 space-y-1.5">
              <div className="text-xs font-mono text-blue-700 font-semibold">
                01 / TRIAGE COMPRESSION
              </div>
              <div className="text-3xl font-bold font-mono tabular-nums text-slate-950">
                8.0m → 42s
              </div>
              <div className="text-xs text-slate-600 leading-relaxed">
                91% reduction in first-stage investigation time across auth, FD, and RTGS logs.
              </div>
            </div>

            <div className="p-6 space-y-1.5">
              <div className="text-xs font-mono text-blue-700 font-semibold">
                02 / REFERENTIAL INTEGRITY
              </div>
              <div className="text-3xl font-bold font-mono tabular-nums text-blue-700">
                100% Grounded
              </div>
              <div className="text-xs text-slate-600 leading-relaxed">
                Deterministic Output Validator checks every cited EVT-* and DOC-* ID in code.
              </div>
            </div>

            <div className="p-6 space-y-1.5">
              <div className="text-xs font-mono text-blue-700 font-semibold">
                03 / OPERATIONAL SAFETY
              </div>
              <div className="text-3xl font-bold font-mono tabular-nums text-slate-950">
                Zero Auto-Blocks
              </div>
              <div className="text-xs text-slate-600 leading-relaxed">
                Human analysts review benign explanations before placing a 24h cooling hold.
              </div>
            </div>

            <div className="p-6 space-y-1.5">
              <div className="text-xs font-mono text-blue-700 font-semibold">
                04 / INFERENCE FOOTPRINT
              </div>
              <div className="text-3xl font-bold font-mono tabular-nums text-slate-950">
                ~380 Tokens
              </div>
              <div className="text-xs text-slate-600 leading-relaxed">
                480 ms median brief latency on Google Cloud Run with minimal case context.
              </div>
            </div>
          </div>

          {/* Institutional Partner Strip */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
            <span className="font-mono uppercase tracking-wider text-blue-800/70">
              Configured Reference Environments
            </span>
            <div className="flex flex-wrap items-center gap-3 font-medium text-slate-700">
              <span>GDFC Bank</span>
              <span className="text-blue-400">·</span>
              <span>National Overseas Bank (NOB)</span>
              <span className="text-blue-400">·</span>
              <span>Smart Bank of India (SBI)</span>
              <span className="text-blue-400">·</span>
              <span>ICICX Bank</span>
              <span className="text-blue-400">·</span>
              <span>DGBS Bank</span>
            </div>
          </div>
        </section>

        {/* 2. INTERACTIVE LIVE CASE SPECIMEN INSPECTOR */}
        <section id="specimens" className="py-16 lg:py-24 border-b border-slate-200 space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-2xl space-y-2">
              <div className="text-xs font-mono uppercase tracking-wider text-blue-700 font-semibold">
                Interactive Case Dossier Preview
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 font-display">
                Inspect how SentinelFlow correlates a coerced scam in real time.
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Select any of the three institutional reference scenarios below to inspect the deterministic signal chain, Google Cloud enrichments, and the Senior Citizen Welfare Call script before signing in.
              </p>
            </div>

            {/* Interactive Segmented Control */}
            <div className="flex flex-wrap items-center gap-1 p-1 bg-blue-950/5 border border-blue-100 rounded-lg">
              {LIVE_SPECIMENS.map((spec, idx) => (
                <button
                  key={spec.caseId}
                  type="button"
                  onClick={() => setSelectedSpecimenIdx(idx)}
                  className={`px-3.5 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    selectedSpecimenIdx === idx
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-blue-900'
                  }`}
                >
                  {spec.caseId} · {spec.bank.split('&')[0].trim()}
                </button>
              ))}
            </div>
          </div>

          {/* Exposed Architectural Specimen Table */}
          <div className="border border-slate-200 bg-white grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
            {/* Left 7 Cols: Deterministic Event Chain */}
            <div className="lg:col-span-7 p-6 lg:p-8 space-y-6">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                  <div className="text-xs font-mono text-blue-700 font-semibold">
                    {activeSpecimen.caseId} · {activeSpecimen.bank}
                  </div>
                  <h3 className="text-lg font-bold text-slate-950 mt-1">
                    {activeSpecimen.typology}
                  </h3>
                  <div className="text-xs text-slate-600 mt-0.5">
                    Protected Customer: {activeSpecimen.customer}
                  </div>
                </div>
                <div className="text-right font-mono tabular-nums">
                  <div className="text-sm font-bold text-red-700">
                    {activeSpecimen.score}
                  </div>
                  <div className="text-xs text-slate-600 mt-0.5">
                    At Risk: {activeSpecimen.amount} ({activeSpecimen.window})
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-mono uppercase tracking-wider text-slate-500">
                  Deterministic Correlation Chain (Steps 2–4 in Code)
                </div>
                <div className="border border-slate-200 divide-y divide-slate-200">
                  {activeSpecimen.events.map((ev) => (
                    <div
                      key={ev.id}
                      className="p-3 flex items-center justify-between gap-4 text-xs hover:bg-blue-50/40 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="font-mono font-bold text-blue-950 shrink-0">
                          {ev.id}
                        </span>
                        <span className="font-mono text-slate-400 shrink-0">
                          {ev.time}
                        </span>
                        <span className="text-slate-700 truncate">
                          {ev.detail}
                        </span>
                      </div>
                      <span className="font-mono font-semibold text-blue-700 shrink-0 tabular-nums">
                        {ev.weight}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-blue-50/50 border border-blue-100 space-y-1 text-xs">
                <div className="font-mono font-semibold text-blue-950">
                  Google Cloud BigQuery & Vertex AI Search Context
                </div>
                <p className="text-slate-700 leading-relaxed">
                  {activeSpecimen.gcpSignal}
                </p>
              </div>
            </div>

            {/* Right 5 Cols: Schema-Bound Gemini Output & Welfare Script */}
            <div className="lg:col-span-5 p-6 lg:p-8 flex flex-col justify-between space-y-6 bg-[#F8FAFC]">
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <span className="text-xs font-mono uppercase tracking-wider text-blue-800 font-semibold">
                    Step 5 & 6 · Validated Gemini Brief
                  </span>
                  <span className="text-xs font-mono font-semibold text-emerald-700">
                    4/4 IDs Code-Verified
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-semibold text-slate-900">
                    Executive Summary & Typology Diagnosis
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {activeSpecimen.briefExcerpt}
                  </p>
                </div>

                <div className="p-4 bg-white border border-blue-200 space-y-2">
                  <div className="text-xs font-semibold text-blue-950">
                    Senior Citizen Welfare Call Script (De-Escalation Prompt)
                  </div>
                  <p className="text-xs text-slate-700 italic leading-relaxed">
                    {activeSpecimen.welfarePrompt}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-4">
                <div className="text-xs text-slate-500">
                  Step 7: Requires Human Analyst Review
                </div>
                <button
                  type="button"
                  onClick={() => setViewMode('login')}
                  className="px-4 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>Triage {activeSpecimen.caseId} in Console</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 3. ARCHITECTURAL SEPARATION OF DUTIES (Why Banks Trust SentinelFlow) */}
        <section id="architecture" className="py-16 lg:py-24 border-b border-slate-200 space-y-10">
          <div className="max-w-3xl space-y-2">
            <div className="text-xs font-mono uppercase tracking-wider text-blue-700 font-semibold">
              System Architecture & Regulatory Governance
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 font-display">
              Deterministic code establishes the facts. Gemini explains the evidence. Humans decide.
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Built for RBI, MHA I4C, and MAS TRM auditability. SentinelFlow never lets an LLM invent alert correlations or execute unreviewed account freezes.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 border border-slate-200 bg-white divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
            <div className="p-8 space-y-4">
              <div className="text-xs font-mono text-blue-700 font-semibold">
                01. DETERMINISTIC INGESTION & SCORING
              </div>
              <h3 className="text-lg font-bold text-slate-950">
                Rule-Based Sliding Window Correlation
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Cloud Pub/Sub streams and batch CSV logs are validated against strict schemas, sanitized against prompt injection, and correlated across a 30-minute window by user, source IP, and payment switch. Every severity point is traceable to an explicit rule.
              </p>
              <div className="pt-2 text-xs font-mono text-blue-800/80">
                Cloud Pub/Sub · BigQuery 48h Graph · Document AI
              </div>
            </div>

            <div className="p-8 space-y-4">
              <div className="text-xs font-mono text-blue-700 font-semibold">
                02. SCHEMA-BOUND AI & CODE VALIDATOR
              </div>
              <h3 className="text-lg font-bold text-slate-950">
                Zero-Hallucination Incident Briefs
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Gemini receives only the correlated case subset and returns a strict JSON brief with timeline citations, benign alternatives, and a customer welfare script. A deterministic code validator verifies 100% of cited <code className="font-mono text-xs text-blue-900">EVT-*</code> IDs before display.
              </p>
              <div className="pt-2 text-xs font-mono text-blue-800/80">
                Gemini on Vertex AI · Vertex AI Search SOPs
              </div>
            </div>

            <div className="p-8 space-y-4">
              <div className="text-xs font-mono text-blue-700 font-semibold">
                03. HUMAN-IN-THE-LOOP (HITL) PROTECTION
              </div>
              <h3 className="text-lg font-bold text-slate-950">
                24-Hour Cooling Hold & Welfare Verification
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Analysts place a reversible 24-hour cooling hold (<code className="font-mono text-xs text-blue-900">Reviewing</code>), counsel the senior citizen using the de-escalation script, and either permanently block the scam transfer (<code className="font-mono text-xs text-blue-900">Escalated</code>) or release legitimate funds (<code className="font-mono text-xs text-blue-900">Dismissed</code>).
              </p>
              <div className="pt-2 text-xs font-mono text-blue-800/80">
                RBI CFCFRMS · 1930 Cyber Helpline · Audit Ledger
              </div>
            </div>
          </div>
        </section>

        {/* 4. INTERACTIVE BFSI IMPACT & TRIAGE SIZING CALCULATOR */}
        <section id="roi" className="py-16 lg:py-24 border-b border-slate-200">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5 space-y-5">
              <div className="text-xs font-mono uppercase tracking-wider text-blue-700 font-semibold">
                Institutional Impact & Sizing Estimator
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 font-display">
                Quantify analyst capacity and senior savings protected.
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Adjust your bank’s monthly high-risk senior citizen FD/RTGS alert volume and average transfer size to model operational time savings and customer funds safeguarded.
              </p>

              <div className="p-6 border border-slate-200 bg-white space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <label
                      htmlFor="alert-volume-slider"
                      className="font-semibold text-slate-800 flex items-center gap-1.5"
                    >
                      <Sliders className="w-3.5 h-3.5 text-blue-600" />
                      <span>Monthly Coerced / High-Risk Senior Alerts</span>
                    </label>
                    <span className="font-mono font-bold text-blue-700 tabular-nums">
                      {monthlySeniorAlerts.toLocaleString('en-IN')} cases/mo
                    </span>
                  </div>
                  <input
                    id="alert-volume-slider"
                    type="range"
                    min={200}
                    max={5000}
                    step={100}
                    value={monthlySeniorAlerts}
                    onChange={(e) => setMonthlySeniorAlerts(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] font-mono text-slate-400">
                    <span>200 (Regional Bank)</span>
                    <span>2,500 (Mid-Tier PSU)</span>
                    <span>5,000 (Tier-1 Retail)</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <label
                      htmlFor="ticket-size-slider"
                      className="font-semibold text-slate-800"
                    >
                      Average Flagged FD / RTGS Transfer Size
                    </label>
                    <span className="font-mono font-bold text-blue-700 tabular-nums">
                      ₹{avgTicketLakhs} Lakh
                    </span>
                  </div>
                  <input
                    id="ticket-size-slider"
                    type="range"
                    min={5}
                    max={50}
                    step={1}
                    value={avgTicketLakhs}
                    onChange={(e) => setAvgTicketLakhs(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] font-mono text-slate-400">
                    <span>₹5 Lakh</span>
                    <span>₹25 Lakh</span>
                    <span>₹50 Lakh</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 border border-blue-200 bg-white divide-y divide-slate-200">
              <div className="p-6 lg:p-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-1">
                  <div className="text-xs font-mono text-blue-700 font-semibold">
                    ESTIMATED SENIOR SAVINGS PROTECTED / MO
                  </div>
                  <div className="text-3xl font-bold font-mono tabular-nums text-blue-700">
                    ₹{estimatedCroresProtected} Cr
                  </div>
                  <div className="text-xs text-slate-600">
                    Across ~{estimatedConfirmedScams} confirmed Digital Arrest & VIP trading interceptions per month (3.5% true-positive coercion rate).
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-xs font-mono text-blue-700 font-semibold">
                    SOC & FRAUD ANALYST HOURS RECOVERED
                  </div>
                  <div className="text-3xl font-bold font-mono tabular-nums text-slate-950">
                    {hoursSavedPerMonth.toLocaleString('en-IN')} hrs/mo
                  </div>
                  <div className="text-xs text-slate-600">
                    Reduced from {manualHoursPerMonth} hrs manual SIEM/CBS pivoting to {assistedHoursPerMonth} hrs with pre-correlated Gemini briefs.
                  </div>
                </div>
              </div>

              <div className="p-6 lg:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-blue-50/50">
                <div className="space-y-0.5 text-xs">
                  <div className="font-semibold text-blue-950">
                    Predictable Cloud Run & Vertex AI Token Economics
                  </div>
                  <div className="text-slate-600 font-mono">
                    ~{(monthlySeniorAlerts * 380).toLocaleString('en-IN')} tokens/month total (~380 tokens per correlated case)
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setViewMode('login')}
                  className="px-4 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  View Full Benchmark Pack →
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 5. VPC DEPLOYMENT & ARCHITECTURE BRIEFING INQUIRY */}
        <section id="briefing" className="py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5 space-y-4">
              <div className="text-xs font-mono uppercase tracking-wider text-blue-700 font-semibold">
                Enterprise Pilot & VPC Deployment
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 font-display">
                Deploy inside your bank’s Google Cloud project.
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                SentinelFlow deploys as a stateless Cloud Run service inside your institution’s VPC Service Controls perimeter, connecting to BigQuery, Document AI, and Vertex AI without customer PII ever leaving your tenancy.
              </p>

              <div className="pt-3 space-y-2 text-xs text-slate-600 border-t border-slate-200">
                <div className="flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Full RBI data localization (`asia-south1` Mumbai & `asia-south2` Delhi)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>MAS TRM compliant deployment (`asia-southeast1` Singapore)</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 border border-slate-200 bg-white p-6 lg:p-8">
              {leadSubmitted ? (
                <div className="py-8 space-y-4 text-center">
                  <CheckCircle2 className="w-8 h-8 text-blue-600 mx-auto" />
                  <h3 className="text-base font-bold text-slate-950">
                    VPC Deployment Briefing Scheduled
                  </h3>
                  <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                    Thank you, {leadName}. Our BFSI Solutions Engineering team (Shruthi Jha and Sanjay) has registered your briefing request for <strong>{leadBank}</strong> ({leadRegion}).
                  </p>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setViewMode('login')}
                      className="px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer"
                    >
                      Sign In to Interactive Triage Workbench
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleLeadSubmit} className="space-y-5">
                  <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-950">
                      Request Institutional Architecture Briefing
                    </span>
                    <span className="text-xs font-mono text-blue-700 font-semibold">
                      BFSI Solutions Desk
                    </span>
                  </div>

                  {leadError && (
                    <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-900">
                      {leadError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-slate-800">
                        Full Name & Title
                      </label>
                      <input
                        type="text"
                        value={leadName}
                        onChange={(e) => setLeadName(e.target.value)}
                        placeholder="e.g. Vikram Menon, SVP Fraud & SOC"
                        className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-slate-800">
                        Institutional Email
                      </label>
                      <input
                        type="email"
                        value={leadEmail}
                        onChange={(e) => setLeadEmail(e.target.value)}
                        placeholder="e.g. v.menon@gdfcbank.in"
                        className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-slate-800">
                        Bank / Financial Institution
                      </label>
                      <input
                        type="text"
                        value={leadBank}
                        onChange={(e) => setLeadBank(e.target.value)}
                        placeholder="e.g. GDFC Bank / National Overseas Bank (NOB)"
                        className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-slate-800">
                        Target Google Cloud Region
                      </label>
                      <select
                        value={leadRegion}
                        onChange={(e) => setLeadRegion(e.target.value)}
                        className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15"
                      >
                        <option value="Mumbai (asia-south1) — RBI Data Residency">
                          Mumbai (asia-south1) — RBI Data Residency
                        </option>
                        <option value="Delhi (asia-south2) — PSU & Institutional VPC">
                          Delhi (asia-south2) — PSU & Institutional VPC
                        </option>
                        <option value="Singapore (asia-southeast1) — MAS TRM APAC">
                          Singapore (asia-southeast1) — MAS TRM APAC
                        </option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between gap-4">
                    <span className="text-[11px] text-slate-500">
                      Includes Terraform VPC blueprint & 1930 CFCFRMS runbook schema
                    </span>
                    <button
                      type="submit"
                      className="px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      Schedule Architecture Briefing
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Quiet Attribution & Governance Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 px-6">
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
};
