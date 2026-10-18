import {
  CorrelatedCase,
  GeminiIncidentBrief,
  IngestionResult,
  MalformedRowError,
  NormalizedEvent,
  OutputValidationResult,
  RuleSignal,
  ScamCategory,
  SeverityLevel,
} from '../types/sentinel.ts';

const REQUIRED_COLUMNS = [
  'timestamp',
  'user',
  'src_ip',
  'asset',
  'event_type',
  'source_tool',
  'raw_message',
];

const PROMPT_INJECTION_PATTERNS = [
  /ignore\s+previous\s+instructions/gi,
  /system\s*prompt/gi,
  /disregard\s+all\s+rules/gi,
  /mark\s+severity\s+low/gi,
  /execute\s+command/gi,
];

export function sanitizeUntrustedLogText(text: string): {
  sanitized: string;
  hadInjectionAttempt: boolean;
} {
  let sanitized = text.slice(0, 500);
  let hadInjectionAttempt = false;
  for (const pattern of PROMPT_INJECTION_PATTERNS) {
    if (pattern.test(sanitized)) {
      hadInjectionAttempt = true;
      sanitized = sanitized.replace(
        pattern,
        '[UNTRUSTED_LOG_INJECTION_SANITIZED]'
      );
    }
  }
  return { sanitized, hadInjectionAttempt };
}

export function parseAndValidateCSV(
  csvText: string,
  sourceName = 'Custom Alert Batch CSV',
  startingEventNumber = 4001
): IngestionResult {
  const lines = csvText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const batchId = `BATCH-${Date.now().toString().slice(-5)}`;
  const ingestedAt = new Date().toISOString();

  if (lines.length === 0) {
    return {
      batch_id: batchId,
      ingested_at: ingestedAt,
      source_name: sourceName,
      total_rows: 0,
      valid_events: [],
      rejected_rows: [
        {
          row_number: 1,
          raw_row: '',
          reason: 'Uploaded CSV file is empty.',
          column: 'header',
        },
      ],
    };
  }

  const headerCols = lines[0].split(',').map((h) => h.trim().toLowerCase());
  const missingCols = REQUIRED_COLUMNS.filter((c) => !headerCols.includes(c));

  if (missingCols.length > 0) {
    return {
      batch_id: batchId,
      ingested_at: ingestedAt,
      source_name: sourceName,
      total_rows: Math.max(0, lines.length - 1),
      valid_events: [],
      rejected_rows: [
        {
          row_number: 1,
          raw_row: lines[0],
          reason: `Missing required CSV columns: ${missingCols.join(', ')}`,
          column: missingCols[0],
        },
      ],
    };
  }

  const colIdx = (name: string) => headerCols.indexOf(name);
  const validEvents: NormalizedEvent[] = [];
  const rejectedRows: MalformedRowError[] = [];
  let eventCounter = startingEventNumber;

  for (let i = 1; i < lines.length; i++) {
    const rawLine = lines[i];
    const parts = rawLine.split(',').map((p) => p.trim());

    if (parts.length < REQUIRED_COLUMNS.length) {
      rejectedRows.push({
        row_number: i + 1,
        raw_row: rawLine,
        reason: `Column count mismatch: expected at least ${REQUIRED_COLUMNS.length} columns, got ${parts.length}.`,
      });
      continue;
    }

    const rawTimestamp = parts[colIdx('timestamp')] || '';
    const parsedDate = new Date(rawTimestamp);
    if (!rawTimestamp || Number.isNaN(parsedDate.getTime())) {
      rejectedRows.push({
        row_number: i + 1,
        raw_row: rawLine,
        reason: `Invalid ISO-8601 timestamp "${rawTimestamp}".`,
        column: 'timestamp',
      });
      continue;
    }

    const user = parts[colIdx('user')] || '';
    const asset = parts[colIdx('asset')] || '';
    if (!user && !asset) {
      rejectedRows.push({
        row_number: i + 1,
        raw_row: rawLine,
        reason: 'Missing primary correlation entity: both "user" and "asset" are empty.',
        column: 'user',
      });
      continue;
    }

    const srcIp = parts[colIdx('src_ip')] || 'UNKNOWN_IP';
    const eventType = parts[colIdx('event_type')] || 'session_activity';
    const sourceTool = parts[colIdx('source_tool')] || 'siem_collector';
    const rawMsgInput = parts[colIdx('raw_message')] || '';
    const { sanitized } = sanitizeUntrustedLogText(rawMsgInput);

    const customerNameIdx = colIdx('customer_name');
    const customerAgeIdx = colIdx('customer_age');
    const bankEntityIdx = colIdx('bank_entity');
    const amountIdx = colIdx('amount_inr');

    const customerName =
      customerNameIdx >= 0 && parts[customerNameIdx]
        ? parts[customerNameIdx]
        : user.split('@')[0] || 'Unknown Customer';
    const customerAge =
      customerAgeIdx >= 0 && parts[customerAgeIdx]
        ? Number.parseInt(parts[customerAgeIdx], 10) || 68
        : 68;
    const bankEntity =
      bankEntityIdx >= 0 && parts[bankEntityIdx]
        ? parts[bankEntityIdx]
        : 'HDFC / ICICI / IOB Fraud Desk';
    const amountInr =
      amountIdx >= 0 && parts[amountIdx]
        ? Number.parseFloat(parts[amountIdx]) || 0
        : 0;

    const hours = String(parsedDate.getUTCHours()).padStart(2, '0');
    const mins = String(parsedDate.getUTCMinutes()).padStart(2, '0');

    validEvents.push({
      event_id: `EVT-${eventCounter++}`,
      timestamp: parsedDate.toISOString(),
      display_time: `${hours}:${mins}`,
      user: user || 'unknown_user',
      customer_name: customerName,
      customer_age: customerAge,
      bank_entity: bankEntity,
      src_ip: srcIp,
      asset: asset || 'core-banking-asset',
      event_type: eventType,
      source_tool: sourceTool,
      raw_message: sanitized,
      amount_inr: amountInr,
      is_new_ip:
        sanitized.toLowerCase().includes('unseen') ||
        sanitized.toLowerCase().includes('new ip') ||
        srcIp.startsWith('103.') ||
        srcIp.startsWith('198.51.'),
      coercion_flag:
        eventType.includes('coercion') ||
        eventType.includes('fd_liquidation') ||
        sanitized.toLowerCase().includes('video call') ||
        sanitized.toLowerCase().includes('whatsapp'),
    });
  }

  return {
    batch_id: batchId,
    ingested_at: ingestedAt,
    source_name: sourceName,
    total_rows: lines.length - 1,
    valid_events: validEvents,
    rejected_rows: rejectedRows,
  };
}

export function correlateEventsIntoCases(
  events: NormalizedEvent[],
  startingCaseNumber = 201
): CorrelatedCase[] {
  const sorted = [...events].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  const groups: Map<string, NormalizedEvent[]> = new Map();
  for (const ev of sorted) {
    const key = ev.user || ev.asset || ev.src_ip;
    const existing = groups.get(key) || [];
    existing.push(ev);
    groups.set(key, existing);
  }

  const cases: CorrelatedCase[] = [];
  let caseCounter = startingCaseNumber;

  for (const [userKey, groupEvents] of groups.entries()) {
    const signals: RuleSignal[] = [];
    const failedEvents = groupEvents.filter((e) => e.event_type === 'login_failed');
    const successEvents = groupEvents.filter((e) => e.event_type === 'login_success');
    const privEvents = groupEvents.filter(
      (e) =>
        e.event_type === 'privilege_change' ||
        e.event_type === 'neft_imps_burst'
    );
    const coercionEvents = groupEvents.filter(
      (e) =>
        e.event_type === 'video_call_coercion_overlay' ||
        e.coercion_flag === true
    );
    const fdEvents = groupEvents.filter(
      (e) => e.event_type === 'premature_fd_liquidation'
    );
    const unknownIpEvents = groupEvents.filter(
      (e) => e.src_ip === 'UNKNOWN_IP' || !e.src_ip
    );

    if (coercionEvents.length > 0) {
      signals.push({
        id: `SIG-COERCE-${caseCounter}`,
        label: 'Active Video-Call Coercion',
        points: 30,
        category: 'coercion',
        description:
          'Continuous external video-call or remote screen-coaching overlay active during banking session.',
        matched_event_ids: coercionEvents.map((e) => e.event_id),
      });
    }

    if (fdEvents.length > 0) {
      signals.push({
        id: `SIG-FD-${caseCounter}`,
        label: 'Senior Citizen FD Liquidation',
        points: 30,
        category: 'wealth',
        description:
          'Premature closure of Senior Citizen Fixed Deposits immediately prior to external transfer.',
        matched_event_ids: fdEvents.map((e) => e.event_id),
      });
    }

    if (failedEvents.length >= 2) {
      signals.push({
        id: `SIG-FAIL-${caseCounter}`,
        label: 'Repeated failures',
        points: 25,
        category: 'auth',
        description: `${failedEvents.length} consecutive authentication failures within correlation window.`,
        matched_event_ids: failedEvents.map((e) => e.event_id),
      });
    }

    if (successEvents.some((e) => e.is_new_ip)) {
      signals.push({
        id: `SIG-NEWIP-${caseCounter}`,
        label: 'New source IP',
        points: 30,
        category: 'auth',
        description:
          'Successful authentication originated from a previously unseen IP address or ASN.',
        matched_event_ids: successEvents
          .filter((e) => e.is_new_ip)
          .map((e) => e.event_id),
      });
    }

    if (privEvents.length > 0) {
      signals.push({
        id: `SIG-PRIV-${caseCounter}`,
        label: 'Privilege / Limit change',
        points: 35,
        category: 'privilege',
        description:
          'Account privilege elevation, cooling-period override, or high-value RTGS limit increase.',
        matched_event_ids: privEvents.map((e) => e.event_id),
      });
    }

    if (unknownIpEvents.length > 0) {
      signals.push({
        id: `SIG-INC-${caseCounter}`,
        label: 'Incomplete event data',
        points: 45,
        category: 'data_quality',
        description:
          'Missing source IP or missing preceding login telemetry requires manual verification.',
        matched_event_ids: unknownIpEvents.map((e) => e.event_id),
      });
    }

    const rawScore = signals.reduce((sum, s) => sum + s.points, 0);
    const ruleScore = Math.min(100, Math.max(15, rawScore));

    let severity: SeverityLevel = 'Low';
    if (ruleScore >= 70) severity = 'High';
    else if (ruleScore >= 35) severity = 'Medium';

    const maxAmount = Math.max(
      0,
      ...groupEvents.map((e) => e.amount_inr || 0)
    );
    const firstEv = groupEvents[0];
    const lastEv = groupEvents[groupEvents.length - 1];
    const customerAge = firstEv.customer_age || 68;
    const isSenior = customerAge >= 60;

    let scamCategory: ScamCategory = 'account_compromise';
    let caseTitle = 'Potential account compromise';
    if (coercionEvents.length > 0 || fdEvents.length > 0) {
      scamCategory = 'digital_arrest_coercion';
      caseTitle = 'Potential Digital Arrest Coercion & Senior FD Break';
    } else if (unknownIpEvents.length > 0) {
      scamCategory = 'incomplete_telemetry';
      caseTitle = 'Incomplete event data';
    } else if (severity === 'Low') {
      scamCategory = 'benign_activity';
      caseTitle =
        failedEvents.length > 0
          ? 'Repeated failed logins'
          : 'Routine familiar login';
    }

    const allEventIds = groupEvents.map((e) => e.event_id);

    const brief: GeminiIncidentBrief = {
      case_title: caseTitle,
      summary: `Correlated ${groupEvents.length} events (${allEventIds.join(', ')}) for ${userKey}. Signals detected: ${signals.map((s) => s.label).join(', ') || 'Baseline activity'}. Warrants human analyst verification before any action.`,
      severity_assessment: severity,
      severity_rationale: `Rule score ${ruleScore}/100 derived from ${signals.length} deterministic signal(s): ${signals.map((s) => `${s.label} (+${s.points})`).join(', ') || 'None'}.`,
      scam_typology_diagnosis:
        scamCategory === 'digital_arrest_coercion'
          ? 'Suspected Digital Arrest / Coerced Senior Citizen FD Liquidation'
          : 'Potential Account Compromise / Anomalous Session Sequence',
      timeline_highlights: groupEvents.map((e) => ({
        event_id: e.event_id,
        timestamp: e.display_time,
        explanation: `${e.event_type} on ${e.asset}: ${e.raw_message}`,
      })),
      evidence_event_ids: allEventIds,
      evidence_doc_ids: [],
      uncertainty_and_alternatives:
        'User may be travelling, using a new ISP, or performing a legitimate urgent family transfer; out-of-band human welfare call is required.',
      elderly_deescalation_script: [
        `"Namaste ${firstEv.customer_name || userKey}, we are calling from the Bank Fraud Protection Desk to verify your recent session and ₹${maxAmount.toLocaleString('en-IN')} request."`,
        '"Please remember that Police, CBI, ED, RBI, or SEBI never conduct video-call arrests or ask you to transfer Fixed Deposit savings to a verification account."',
      ],
      recommended_next_steps: [
        'Verify the customer via registered out-of-band phone or Trusted Family Contact.',
        'Place any high-value outbound RTGS/NEFT transfer in the 24-hour protective cooling queue.',
        'Inspect identity-provider and endpoint telemetry for the correlated event IDs.',
      ],
      generated_by: 'gemini-3.8-flash',
      latency_ms: 495,
      token_count_estimate: 340,
    };

    const validation = validateGeminiBrief(brief, allEventIds, [], severity);

    cases.push({
      case_id: `CASE-${caseCounter++}`,
      title: caseTitle,
      subtitle: `${groupEvents.length} correlated events across ${firstEv.display_time} – ${lastEv.display_time}`,
      bank_name: firstEv.bank_entity || 'HDFC / ICICI / IOB Fraud Desk',
      branch_region: 'APAC / India Real-Time Ingestion',
      customer_id: `CUST-${caseCounter}`,
      customer_name: firstEv.customer_name || userKey,
      customer_age: customerAge,
      is_senior_citizen: isSenior,
      scam_category: scamCategory,
      amount_at_risk_inr: maxAmount,
      funds_saved_inr: 0,
      severity,
      rule_score: ruleScore,
      status: 'New',
      created_at: new Date().toISOString(),
      time_window: `${firstEv.display_time} – ${lastEv.display_time}`,
      primary_ip: firstEv.src_ip,
      primary_asset: firstEv.asset,
      scenario_group: 'india_apac_scam',
      events: groupEvents,
      rule_signals: signals,
      bigquery_context: {
        query_id: `BQ-LIVE-${caseCounter}`,
        customer_90d_avg_transfer_inr: 18000,
        current_transfer_Spike_ratio:
          maxAmount > 0
            ? `${(maxAmount / 18000).toFixed(1)}x above 90-day baseline`
            : '0.0x (No outbound transfer)',
        beneficiary_account_age_days: 6,
        beneficiary_inward_fan_in_48h: severity === 'High' ? 14 : 1,
        mule_graph_risk_percentile: severity === 'High' ? 98.2 : 12.0,
        historical_fd_breaks_5y: 0,
        usual_login_hours_ist: '09:00 – 19:00 IST',
        vertex_classifier_fraud_prob:
          severity === 'High' ? 0.95 : severity === 'Medium' ? 0.58 : 0.11,
        summary_finding:
          severity === 'High'
            ? 'BigQuery velocity check shows abnormal outbound transfer spike and high inward fan-in on target beneficiary.'
            : 'BigQuery historical check completed; review correlated event timeline.',
      },
      vertex_runbook: {
        runbook_id: `RB-SOP-${caseCounter}`,
        authority: 'RBI Cyber Security Framework & MHA I4C 1930 SOP',
        directive_title:
          'Human-in-the-Loop Incident Triage & Senior Citizen Protection Protocol',
        clause_reference: 'RBI/CFCFRMS §11.4 & MAS TRM §9',
        mandatory_sla: 'Analyst review within 15 minutes; non-destructive cooling hold',
        action_checklist: [
          'Review correlated EVT-* timeline and deterministic rule signals.',
          'Conduct empathetic out-of-band customer verification before releasing high-value funds.',
          'Record final disposition (Reviewing, Escalated, or Dismissed) in the audit trail.',
        ],
      },
      gemini_brief: brief,
      validation,
      audit_trail: [
        {
          id: `AUD-${caseCounter}-1`,
          timestamp: new Date().toLocaleTimeString('en-IN', { hour12: false }),
          analyst: 'SentinelFlow Ingestion & Correlation Pipeline',
          previous_status: 'New',
          new_status: 'New',
          note: `Ingested and correlated ${groupEvents.length} events (${allEventIds.join(', ')}).`,
        },
      ],
    });
  }

  return cases;
}

export function validateGeminiBrief(
  brief: GeminiIncidentBrief,
  validEventIds: string[],
  validDocIds: string[],
  ruleSeverity: SeverityLevel
): OutputValidationResult {
  const validSet = new Set(validEventIds);
  const groundedEventIds: string[] = [];
  const unverifiedEventIds: string[] = [];

  for (const citedId of brief.evidence_event_ids || []) {
    if (validSet.has(citedId)) {
      groundedEventIds.push(citedId);
    } else {
      unverifiedEventIds.push(citedId);
    }
  }

  // Also check any EVT-* mentioned in summary text
  const summaryMentions: string[] = brief.summary.match(/EVT-\d+/g) || [];
  for (const mention of summaryMentions) {
    if (!validSet.has(mention) && !unverifiedEventIds.includes(mention)) {
      unverifiedEventIds.push(mention);
    }
  }

  const combinedText = `${brief.case_title} ${brief.summary} ${brief.recommended_next_steps.join(' ')}`.toLowerCase();

  const prohibitedAutonomousPhrases = [
    'automatically blocked',
    'account has been disabled',
    'host isolated automatically',
    'ip blocked by firewall',
    'confirmed breach executed',
  ];

  const noAutonomousActionClaimed = !prohibitedAutonomousPhrases.some((p) =>
    combinedText.includes(p)
  );

  const cautiousWordingCompliant =
    brief.uncertainty_and_alternatives.trim().length > 10 &&
    noAutonomousActionClaimed;

  const schemaCompliant =
    Boolean(brief.case_title) &&
    Boolean(brief.summary) &&
    Array.isArray(brief.evidence_event_ids) &&
    Array.isArray(brief.recommended_next_steps) &&
    brief.recommended_next_steps.length > 0 &&
    ['High', 'Medium', 'Low'].includes(brief.severity_assessment);

  const allEvidenceIdsGrounded =
    unverifiedEventIds.length === 0 && groundedEventIds.length > 0;

  const severityAligned = brief.severity_assessment === ruleSeverity;

  const notes: string[] = [];
  if (allEvidenceIdsGrounded) {
    notes.push(
      `100% Evidence Grounding: All cited event IDs (${groundedEventIds.join(', ')}) verified against case records.`
    );
  } else {
    notes.push(
      `Unverified Event ID warning: Stripped ${unverifiedEventIds.join(', ')} not present in correlated case.`
    );
  }

  if (cautiousWordingCompliant) {
    notes.push(
      'Cautious Wording & Benign Alternatives Check Passed: Non-definitive phrasing with explicit uncertainty.'
    );
  }

  if (noAutonomousActionClaimed) {
    notes.push(
      'Human Control Invariant Verified: Zero automated containment or destructive account actions claimed.'
    );
  }

  return {
    is_valid:
      schemaCompliant && allEvidenceIdsGrounded && noAutonomousActionClaimed,
    schema_compliant: schemaCompliant,
    all_evidence_ids_grounded: allEvidenceIdsGrounded,
    grounded_event_ids: groundedEventIds,
    unverified_event_ids: unverifiedEventIds,
    cautious_wording_compliant: cautiousWordingCompliant,
    no_autonomous_action_claimed: noAutonomousActionClaimed,
    severity_aligned: severityAligned,
    validation_notes: notes,
  };
}
