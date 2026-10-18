import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import {
  correlateEventsIntoCases,
  parseAndValidateCSV,
  validateGeminiBrief,
} from './src/engine/triageEngine.ts';
import type {
  CorrelatedCase,
  GeminiIncidentBrief,
} from './src/types/sentinel.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getGeminiClient(): GoogleGenAI {
  return new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '4mb' }));

  // Health check endpoints for Google Cloud Run container readiness
  app.get(['/healthz', '/api/health'], (_req, res) => {
    res.status(200).json({ status: 'ok', service: 'SentinelFlow', timestamp: new Date().toISOString() });
  });

  // 1. Server-side Gemini Incident Brief Generator + Deterministic Output Validator
  app.post('/api/triage/brief', async (req, res) => {
    const startTime = Date.now();
    try {
      const targetCase = req.body.correlatedCase as CorrelatedCase | undefined;
      if (!targetCase || !Array.isArray(targetCase.events)) {
        res.status(400).json({ error: 'Valid correlatedCase with events array is required.' });
        return;
      }

      const validEventIds = targetCase.events.map((e) => e.event_id);
      const validDocIds = targetCase.document_ai_evidence
        ? [targetCase.document_ai_evidence.doc_id]
        : [];

      const minimalEventContext = targetCase.events.map((e) => ({
        event_id: e.event_id,
        timestamp: e.display_time,
        user: e.user,
        src_ip: e.src_ip,
        asset: e.asset,
        event_type: e.event_type,
        source_tool: e.source_tool,
        amount_inr: e.amount_inr || 0,
        sanitized_message: e.raw_message,
      }));

      const promptPayload = {
        case_id: targetCase.case_id,
        bank_name: targetCase.bank_name,
        customer_name: targetCase.customer_name,
        customer_age: targetCase.customer_age,
        is_senior_citizen: targetCase.is_senior_citizen,
        amount_at_risk_inr: targetCase.amount_at_risk_inr,
        deterministic_rule_severity: targetCase.severity,
        deterministic_rule_score: targetCase.rule_score,
        rule_signals: targetCase.rule_signals.map((s) => ({
          label: s.label,
          points: s.points,
          description: s.description,
          matched_event_ids: s.matched_event_ids,
        })),
        bigquery_risk_context: targetCase.bigquery_context,
        document_ai_evidence: targetCase.document_ai_evidence || null,
        vertex_ai_search_runbook: targetCase.vertex_runbook,
        normalized_events: minimalEventContext,
      };

      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Draft a structured, evidence-linked BFSI security and fraud incident brief for the following correlated case:\n${JSON.stringify(promptPayload, null, 2)}`,
        config: {
          systemInstruction:
            'You are SentinelFlow, an AI-assisted security and fraud incident triage engine for Indian and APAC banks (GDFC Bank, ICICX Bank, National Overseas Bank (NOB), Smart Bank of India (SBI), DGBS Bank). ' +
            'Rules establish what the data says; you ONLY explain the supplied evidence. ' +
            'CRITICAL CONSTRAINTS:\n' +
            '1. Cite ONLY real event IDs present in normalized_events (e.g., EVT-1101) and real document IDs if present (e.g., DOC-101). Never invent event IDs.\n' +
            '2. Use cautious, non-definitive wording such as "Potential Digital Arrest Coercion", "Potential VIP Trading Scam", or "Potential account compromise" — never claim a confirmed breach.\n' +
            '3. Explicitly state uncertainty and benign alternatives (e.g. urgent medical/family transfer, travel, or syslog truncation).\n' +
            '4. Include an empathetic, practical Senior Citizen De-Escalation Conversation Script (2-3 spoken lines) to help the bank fraud analyst break psychological coercion (such as fake CBI/RBI Digital Arrest video calls or fake SEBI VIP IPO groups) and safeguard the customer’s life savings.\n' +
            '5. Recommend only safe, non-destructive human-in-the-loop verification steps; never claim that accounts, hosts, or IPs were blocked automatically.',
          temperature: 0.2,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              case_title: {
                type: Type.STRING,
                description: 'Cautious title summarizing the candidate incident.',
              },
              summary: {
                type: Type.STRING,
                description: 'Concise 2-3 sentence evidence-linked summary referencing specific EVT-* IDs.',
              },
              severity_assessment: {
                type: Type.STRING,
                description: 'Allowed severity matching deterministic rule evaluation: High, Medium, or Low.',
              },
              severity_rationale: {
                type: Type.STRING,
                description: 'Why the deterministic rule signals and telemetry warrant this priority.',
              },
              scam_typology_diagnosis: {
                type: Type.STRING,
                description: 'Specific fraud/security pattern diagnosis (e.g. Digital Arrest Coercion, Fake VIP QIB Trading Scam, Account Compromise).',
              },
              timeline_highlights: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    event_id: { type: Type.STRING },
                    timestamp: { type: Type.STRING },
                    explanation: { type: Type.STRING },
                  },
                  required: ['event_id', 'timestamp', 'explanation'],
                },
              },
              evidence_event_ids: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Exact EVT-* IDs from the input events that substantiate this brief.',
              },
              evidence_doc_ids: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Exact DOC-* IDs from document_ai_evidence if present.',
              },
              uncertainty_and_alternatives: {
                type: Type.STRING,
                description: 'Explicit missing context and plausible benign explanations.',
              },
              elderly_deescalation_script: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: '2-3 empathetic spoken lines for the bank analyst to counsel the customer and break scammer coercion.',
              },
              recommended_next_steps: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: '3-4 non-destructive verification and safeguarding actions for the human analyst.',
              },
            },
            required: [
              'case_title',
              'summary',
              'severity_assessment',
              'severity_rationale',
              'scam_typology_diagnosis',
              'timeline_highlights',
              'evidence_event_ids',
              'evidence_doc_ids',
              'uncertainty_and_alternatives',
              'elderly_deescalation_script',
              'recommended_next_steps',
            ],
          },
        },
      });

      const latencyMs = Date.now() - startTime;
      const rawText = response.text || '{}';
      const parsed = JSON.parse(rawText);

      // Filter any unverified event IDs while recording them in the validator audit
      const rawEvidenceIds: string[] = Array.isArray(parsed.evidence_event_ids)
        ? parsed.evidence_event_ids
        : validEventIds;

      const candidateBrief: GeminiIncidentBrief = {
        case_title: parsed.case_title || targetCase.title,
        summary: parsed.summary || targetCase.gemini_brief.summary,
        severity_assessment: ['High', 'Medium', 'Low'].includes(
          parsed.severity_assessment
        )
          ? parsed.severity_assessment
          : targetCase.severity,
        severity_rationale:
          parsed.severity_rationale || targetCase.gemini_brief.severity_rationale,
        scam_typology_diagnosis:
          parsed.scam_typology_diagnosis ||
          targetCase.gemini_brief.scam_typology_diagnosis,
        timeline_highlights: Array.isArray(parsed.timeline_highlights)
          ? parsed.timeline_highlights.filter((t: { event_id: string }) =>
              validEventIds.includes(t.event_id)
            )
          : targetCase.gemini_brief.timeline_highlights,
        evidence_event_ids: rawEvidenceIds.filter((id) =>
          validEventIds.includes(id)
        ),
        evidence_doc_ids: Array.isArray(parsed.evidence_doc_ids)
          ? parsed.evidence_doc_ids.filter((id: string) =>
              validDocIds.includes(id)
            )
          : validDocIds,
        uncertainty_and_alternatives:
          parsed.uncertainty_and_alternatives ||
          targetCase.gemini_brief.uncertainty_and_alternatives,
        elderly_deescalation_script:
          Array.isArray(parsed.elderly_deescalation_script) &&
          parsed.elderly_deescalation_script.length > 0
            ? parsed.elderly_deescalation_script
            : targetCase.gemini_brief.elderly_deescalation_script,
        recommended_next_steps:
          Array.isArray(parsed.recommended_next_steps) &&
          parsed.recommended_next_steps.length > 0
            ? parsed.recommended_next_steps
            : targetCase.gemini_brief.recommended_next_steps,
        generated_by: 'gemini-3.8-flash',
        latency_ms: latencyMs,
        token_count_estimate: Math.round(
          (JSON.stringify(promptPayload).length + rawText.length) / 4
        ),
      };

      const validation = validateGeminiBrief(
        { ...candidateBrief, evidence_event_ids: rawEvidenceIds },
        validEventIds,
        validDocIds,
        targetCase.severity
      );

      res.json({
        brief: candidateBrief,
        validation,
        latency_ms: latencyMs,
      });
    } catch (error: unknown) {
      const errMessage =
        error instanceof Error ? error.message : 'Failed to generate Gemini incident brief.';
      res.status(500).json({ error: errMessage });
    }
  });

  // 2. CSV Alert Ingestion, Normalization & Correlation Endpoint
  app.post('/api/triage/ingest', (req, res) => {
    try {
      const { csvText, sourceName } = req.body as {
        csvText?: string;
        sourceName?: string;
      };
      if (typeof csvText !== 'string') {
        res.status(400).json({ error: 'csvText string is required.' });
        return;
      }

      const ingestionResult = parseAndValidateCSV(
        csvText,
        sourceName || 'Uploaded Security Alert CSV',
        4001
      );
      const correlatedCases =
        ingestionResult.valid_events.length > 0
          ? correlateEventsIntoCases(ingestionResult.valid_events, 201)
          : [];

      res.json({
        ingestion: ingestionResult,
        cases: correlatedCases,
      });
    } catch (error: unknown) {
      const errMessage =
        error instanceof Error ? error.message : 'CSV ingestion failed.';
      res.status(500).json({ error: errMessage });
    }
  });

  // 3. Simulated Cloud Pub/Sub Live Bank Stream Endpoint (Zero-Upload Real-Time Demo)
  app.post('/api/pubsub/simulate', (_req, res) => {
    const presetPool = [
      {
        bank: 'National Overseas Bank (NOB) — Mylapore Branch',
        user: 'natarajan.k74@senior-nob.in',
        name: 'K. Natarajan',
        age: 74,
        ip: '103.88.19.204',
        asset: 'nob-netbanking-rtgs-engine',
        amount: 2150000,
        scamType: 'digital_arrest',
      },
      {
        bank: 'GDFC Bank — Koramangala Senior Wealth',
        user: 'meera.krishnan69@gdfc-wealth.in',
        name: 'Meera Krishnan',
        age: 69,
        ip: '45.112.66.18',
        asset: 'gdfc-fd-liquidation-gateway',
        amount: 3200000,
        scamType: 'digital_arrest',
      },
      {
        bank: 'Smart Bank of India (SBI) — Indiranagar Senior Pension Desk',
        user: 'raghavan.v71@smartbank-sbi.in',
        name: 'V. Raghavan',
        age: 71,
        ip: '115.99.201.14',
        asset: 'sbi-pension-fd-rtgs-hub',
        amount: 1850000,
        scamType: 'digital_arrest',
      },
    ];

    const pick = presetPool[Math.floor(Math.random() * presetPool.length)];
    const now = new Date();
    const t1 = new Date(now.getTime() - 7 * 60000).toISOString();
    const t2 = new Date(now.getTime() - 5 * 60000).toISOString();
    const t3 = new Date(now.getTime() - 3 * 60000).toISOString();
    const t4 = new Date(now.getTime() - 1 * 60000).toISOString();

    const syntheticCsv = [
      'timestamp,user,src_ip,asset,event_type,source_tool,raw_message,customer_name,customer_age,bank_entity,amount_inr',
      `${t1},${pick.user},${pick.ip},${pick.asset},video_call_coercion_overlay,mobile_edr_telemetry,Pub/Sub Live Alert: Continuous unknown WhatsApp video call active (82m) during banking login,${pick.name},${pick.age},${pick.bank},0`,
      `${t2},${pick.user},${pick.ip},${pick.asset},login_failed,iam_idp,Pub/Sub Live Alert: 2 failed transaction PIN attempts under high-stress typing cadence,${pick.name},${pick.age},${pick.bank},0`,
      `${t3},${pick.user},${pick.ip},${pick.asset},premature_fd_liquidation,core_banking_fd,Pub/Sub Live Alert: Premature closure of Senior Citizen FD totaling INR ${pick.amount},${pick.name},${pick.age},${pick.bank},${pick.amount}`,
      `${t4},${pick.user},${pick.ip},${pick.asset},privilege_change,rtgs_payment_switch,Pub/Sub Live Alert: RTGS limit elevated and INR ${pick.amount} queued to newly added mule beneficiary,${pick.name},${pick.age},${pick.bank},${pick.amount}`,
    ].join('\n');

    const startEvt = 5000 + Math.floor(Math.random() * 4000);
    const startCase = 300 + Math.floor(Math.random() * 600);
    const ingestion = parseAndValidateCSV(
      syntheticCsv,
      `Cloud Pub/Sub Topic: projects/bfsi-soc/topics/${pick.scamType}-telemetry`,
      startEvt
    );
    const correlated = correlateEventsIntoCases(
      ingestion.valid_events,
      startCase
    );

    res.json({
      topic: `projects/sentinel-bfsi-apac/topics/live-fraud-telemetry`,
      ingestion,
      newCase: correlated[0],
    });
  });

  const isProduction =
    process.env.NODE_ENV === 'production' ||
    Boolean(process.env.K_SERVICE) ||
    Boolean(process.env.CLOUD_RUN_JOB);

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SentinelFlow server running on http://0.0.0.0:${PORT} (Production: ${isProduction})`);
  });
}

startServer();
