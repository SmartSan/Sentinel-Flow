export type SeverityLevel = 'High' | 'Medium' | 'Low';

export type CaseStatus = 'New' | 'Reviewing' | 'Escalated' | 'Dismissed';

export type ScamCategory =
  | 'digital_arrest_coercion'
  | 'vip_trading_scam'
  | 'senior_apk_takeover'
  | 'account_compromise'
  | 'benign_activity'
  | 'incomplete_telemetry';

export interface NormalizedEvent {
  event_id: string;
  timestamp: string;
  display_time: string;
  user: string;
  customer_name?: string;
  customer_age?: number;
  bank_entity?: string;
  src_ip: string;
  asset: string;
  event_type: string;
  source_tool: string;
  raw_message: string;
  amount_inr?: number;
  is_new_ip?: boolean;
  coercion_flag?: boolean;
  scenario_id?: string;
  scenario_label?: 'benign' | 'suspicious' | 'ambiguous';
}

export interface MalformedRowError {
  row_number: number;
  raw_row: string;
  reason: string;
  column?: string;
}

export interface IngestionResult {
  batch_id: string;
  ingested_at: string;
  source_name: string;
  total_rows: number;
  valid_events: NormalizedEvent[];
  rejected_rows: MalformedRowError[];
}

export interface RuleSignal {
  id: string;
  label: string;
  points: number;
  category: 'coercion' | 'auth' | 'wealth' | 'privilege' | 'data_quality';
  description: string;
  matched_event_ids: string[];
}

export interface BigQueryRiskContext {
  query_id: string;
  customer_90d_avg_transfer_inr: number;
  current_transfer_Spike_ratio: string;
  beneficiary_account_age_days: number;
  beneficiary_inward_fan_in_48h: number;
  mule_graph_risk_percentile: number;
  historical_fd_breaks_5y: number;
  usual_login_hours_ist: string;
  vertex_classifier_fraud_prob: number;
  summary_finding: string;
}

export interface DocumentAIEvidence {
  doc_id: string;
  file_name: string;
  document_type: string;
  extracted_entities: {
    key: string;
    value: string;
    flagged: boolean;
  }[];
  forgery_confidence: number;
  scam_template_match: string;
  summary_finding: string;
}

export interface VertexSearchRunbook {
  runbook_id: string;
  authority: string;
  directive_title: string;
  clause_reference: string;
  mandatory_sla: string;
  action_checklist: string[];
}

export interface TimelineHighlight {
  event_id: string;
  timestamp: string;
  explanation: string;
}

export interface GeminiIncidentBrief {
  case_title: string;
  summary: string;
  severity_assessment: SeverityLevel;
  severity_rationale: string;
  scam_typology_diagnosis: string;
  timeline_highlights: TimelineHighlight[];
  evidence_event_ids: string[];
  evidence_doc_ids: string[];
  uncertainty_and_alternatives: string;
  elderly_deescalation_script: string[];
  recommended_next_steps: string[];
  generated_by: 'gemini-3.8-flash' | 'deterministic-fallback';
  latency_ms: number;
  token_count_estimate: number;
}

export interface OutputValidationResult {
  is_valid: boolean;
  schema_compliant: boolean;
  all_evidence_ids_grounded: boolean;
  grounded_event_ids: string[];
  unverified_event_ids: string[];
  cautious_wording_compliant: boolean;
  no_autonomous_action_claimed: boolean;
  severity_aligned: boolean;
  validation_notes: string[];
}

export interface AuditTrailEntry {
  id: string;
  timestamp: string;
  analyst: string;
  previous_status: CaseStatus;
  new_status: CaseStatus;
  note: string;
  funds_safeguarded_inr?: number;
}

export interface CorrelatedCase {
  case_id: string;
  title: string;
  subtitle: string;
  bank_name: string;
  branch_region: string;
  customer_id: string;
  customer_name: string;
  customer_age: number;
  is_senior_citizen: boolean;
  scam_category: ScamCategory;
  amount_at_risk_inr: number;
  funds_saved_inr: number;
  severity: SeverityLevel;
  rule_score: number;
  status: CaseStatus;
  created_at: string;
  time_window: string;
  primary_ip: string;
  primary_asset: string;
  events: NormalizedEvent[];
  rule_signals: RuleSignal[];
  bigquery_context: BigQueryRiskContext;
  document_ai_evidence?: DocumentAIEvidence;
  vertex_runbook: VertexSearchRunbook;
  gemini_brief: GeminiIncidentBrief;
  validation: OutputValidationResult;
  audit_trail: AuditTrailEntry[];
  scenario_group: 'india_apac_scam' | 'deck_wireframe' | 'eval_pack';
  expected_label?: 'benign' | 'suspicious' | 'ambiguous';
}

export interface EvaluationScenarioResult {
  scenario_id: string;
  name: string;
  bank_context: string;
  expected_label: 'benign' | 'suspicious' | 'ambiguous';
  predicted_severity: SeverityLevel;
  expected_case_events: string[];
  actual_correlated_events: string[];
  correlation_correct: boolean;
  detection_correct: boolean;
  evidence_grounding_ratio: number;
  unsupported_claims_count: number;
  schema_valid: boolean;
  manual_baseline_sec: number;
  assisted_triage_sec: number;
  latency_ms: number;
  token_count: number;
}
