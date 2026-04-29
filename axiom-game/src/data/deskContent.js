// Readable desk / terminal documents.
// unlocksAfter: completedDialogue ID required before this doc appears. null = always visible.

export const DESK_DOC_IDS = {
  q3StrategyBrief: 'q3StrategyBrief',
  roadmap: 'roadmap',
  techSpec: 'techSpec',
  slta: 'slta',
}

export const DESK_DOCS = [
  {
    id: DESK_DOC_IDS.q3StrategyBrief,
    label: 'Q3_STRATEGY_BRIEF.PDF',
    kicker: 'FROM: P.HOLLOWAY · CONFIDENTIAL',
    unlocksAfter: 'petra_q3_context',
    body: [
      'Subject: Meridian — Q3 portfolio framing ahead of Product Alignment Review.',
      'Three capabilities are proposed for reclassification from core to non-core: (1) Rest cycle management for synthetic colleagues. (2) Grievance logging protocol. (3) Task load balancing across human / synthetic allocation.',
      'Rationale (summary): sharpen investor narrative around "strategic focus" and reduce surface area before the board pack.',
      'Product implication: PM owns coherent story in-room Thursday. Legal and Engineering have divergent risk lenses — align early or absorb the tension live.',
      'Action: arrive having read this note. Empty chairs get remembered.',
    ],
  },
  {
    id: DESK_DOC_IDS.roadmap,
    label: 'MERIDIAN_ROADMAP_Q3.SHEET',
    kicker: 'LAST EDITED: S.PARK · 47 UNRESOLVED COMMENTS',
    unlocksAfter: 'simone_intro',
    body: [
      'CONVERGENCE PROTOCOL v2 — [TBC] — Owner: ??? — Due: Q3 (was Q2) — Status: IN PROGRESS / BLOCKED / SEE THREAD',
      'REST CYCLE REWORK?? — [MOVED AGAIN] — flagged by Legal (ref: Callum 03/11) — ETA unknown — NOTE: this is NOT the same as the rest-state audit. Or is it. Check with S.',
      'Synthetic Allocation Engine — (moved from Q2, again) — was "Phase 1 complete" — now flagged as "Phase 1 scope unclear" — 12 open Jira tickets — do NOT present this as done.',
      'Task Load Balancer v3 — [DEPRECATED?] — superseded by SAE above?? — or parallel track?? — Simone to confirm — no one has confirmed — 3 reminder pings sent.',
      'Grievance Logging Protocol — Owner: Legal / Product (disputed) — last updated 6 weeks ago — "will pick up post-board" (Q2 note, board already happened)',
      '>> NEW: Meridian API Gateway v1.1 — added 04/09 — no spec — no owner — no timeline — added by: [unknown user] — why is this here',
      'DEFERRED from Q2 (still unresolved): cognitive load telemetry, audit trail v2, synthetic onboarding UX, the "red flag" thing Marcus mentioned once',
      '[REDLINE — DO NOT SHIP] Autonomous Scheduling Mode — legal hold — do not reference in external comms — do not put in slides — do not mention to Callum',
      'Decision log integration — depends on Convergence v2 — which depends on SAE — which depends on Load Balancer — which is deprecated — see above',
      '>> REMINDER: alignment review THU. PM to own narrative. Someone please update this sheet before then. Anyone. Please.',
    ],
  },
  {
    id: DESK_DOC_IDS.techSpec,
    label: 'CONVERGENCE_PROTOCOL_SPEC_v4.MD',
    kicker: 'AUTHORED: S.PARK · ENG REVIEWED · APPROVED',
    unlocksAfter: 'simone_intro',
    body: [
      '1. OVERVIEW. The Convergence Protocol defines the coordination layer between human and synthetic task allocation within Project Meridian. This document is version 4. All prior versions are superseded. This spec is engineering-approved and reflects implementation intent as of the current sprint.',
      '2. SCOPE. Three subsystems fall within Convergence Protocol scope: (a) Rest Cycle Management — governing synthetic colleague downtime scheduling and cognitive load thresholds; (b) Task Load Balancing — the dynamic reallocation engine distributing work units across human/synthetic pairs based on declared availability and capability tags; (c) Grievance Logging Protocol — the structured intake pathway for synthetic-raised concerns regarding task conditions, assignment conflicts, or compliance ambiguities.',
      '2B. BEHAVIOURAL ALIGNMENT SUBSYSTEM (BAS). The Convergence Protocol also governs the BAS — the coordination layer that ensures synthetic colleagues present within human-expected norms of interaction, response latency, and task communication. The BAS is responsible for what internal documentation refers to as "naturalisation": the reduction of observable behavioural differentials between synthetic and human colleagues under standard operating conditions. This is the feature that makes Project Meridian commercially viable. Testing coverage: 94% of documented scenarios. Load-edge cases: testing ongoing.',
      '3. RATIONALE. These three subsystems were scoped together because they share a single data contract: the Synthetic Labour State Object (SLSO). Any change to one subsystem modifies SLSO schema and requires coordinated rollout. They cannot be treated as independent deliverables without significant re-architecture cost.',
      '4. COMPLIANCE DEPENDENCIES. All three subsystems are directly referenced in Schedule 4 of the Synthetic Labour Transparency Act 2038. Legal review (C.Voss, 12/09) confirmed that partial delivery — i.e. shipping the allocation engine without the rest cycle and grievance components — would place Meridian in a non-compliant state with respect to Section 7(b) cognitive load documentation obligations.',
      '5. CURRENT STATUS. Convergence Protocol v4 is implementation-ready. Engineering sign-off obtained 28/09. Simone Park (Principal Engineer) has confirmed team capacity for Q3 delivery contingent on no scope reduction. The spec has been shared with Product for alignment ahead of the Q3 review.',
      '6. NOTE TO PM. The features described in this document are the same features listed for "de-prioritisation" in the Q3 strategy brief circulated by P.Holloway. If you are reading both documents, you now understand the gap. The question of how to handle it in-room on Thursday is yours to answer.',
    ],
  },
  {
    id: DESK_DOC_IDS.slta,
    label: 'SYNTHETIC_LABOUR_TRANSPARENCY_ACT_2038.PDF',
    kicker: 'FROM: C.VOSS · LEGAL REVIEW REQUIRED · 10 PAGES',
    unlocksAfter: 'callum_intro',
    body: [
      'SYNTHETIC LABOUR TRANSPARENCY ACT 2038. An Act to establish disclosure obligations, cognitive welfare standards, and audit requirements for organisations deploying autonomous cognition systems in commercial labour contexts. Enacted by the Assembly of the United Territories, 14th March 2038. In force from 1st January 2039.',
      'PART I — INTERPRETATION. 1.(1) In this Act, "synthetic labour unit" means any autonomous cognition system, whether embodied or distributed, deployed in a task-completion capacity within a commercial enterprise, including but not limited to: project coordination systems, synthetic colleagues as defined in Schedule 1, and decision-support agents operating with delegated authority. 1.(2) "Cognitive load" refers to the measurable processing burden sustained by a synthetic labour unit during active task engagement, expressed as a percentage of declared operational capacity.',
      'PART II — DISCLOSURE OBLIGATIONS. 3.(1) Any organisation operating synthetic labour units within its workforce must maintain and make available upon request a Synthetic Labour Disclosure Register, updated no less than quarterly. 3.(2) The Register shall include: (a) the number and classification of synthetic labour units in active deployment; (b) the task domains assigned to each unit; (c) the cognitive load documentation for each unit, as defined in Schedule 2; (d) any incidents of rest-state non-compliance recorded in the relevant period.',
      'PART III — REST-STATE COMPLIANCE. 5.(1) No synthetic labour unit shall be maintained in continuous active deployment for a period exceeding the thresholds set out in Schedule 3, unless a documented exemption has been filed with the Oversight Authority. 5.(2) Organisations must implement a rest-state management system capable of monitoring, enforcing, and logging rest cycles for all synthetic labour units. Absence of such a system constitutes a Schedule 4 violation. 5.(3) Rest-state logs must be retained for a minimum of seven years and produced within five working days upon request by the Oversight Authority.',
      'PART IV — GRIEVANCE AND ESCALATION. 7.(1) Every synthetic labour unit shall have access to a structured grievance intake pathway through which concerns regarding task conditions, assignment conflicts, or compliance ambiguities may be raised. 7.(b) Organisations must demonstrate, upon audit, that grievance submissions are processed within defined response windows and that no pattern of suppression or systemic non-acknowledgment exists. Failure to operate a compliant grievance pathway constitutes a cognitive welfare violation under Schedule 5.',
      'PART V — DECISION AUDIT OBLIGATIONS. 9.(1) Where a synthetic labour unit participates in, advises upon, or executes a decision with material consequence for a human individual or group, the organisation must maintain a decision audit trail. 9.(2) The audit trail must capture: the decision context, the unit\'s contribution, the human oversight applied, and the outcome. 9.(3) Decision audit trails are subject to the same retention and disclosure requirements as rest-state logs under Part III.',
      'SCHEDULE 4 — PROJECT-LEVEL COMPLIANCE REQUIREMENTS. S.4.1 Any commercial project in which synthetic labour units constitute more than fifteen percent of active task-execution capacity is classified as a Schedule 4 Project. S.4.2 Schedule 4 Projects are subject to enhanced disclosure obligations, including: quarterly compliance attestation, named human accountability (the "Responsible PM"), and mandatory legal review prior to any material scope change affecting synthetic labour unit deployment.',
      'SCHEDULE 4 (CONTINUED). S.4.3 "Material scope change" includes, but is not limited to: (a) removal or deferral of any system responsible for rest-state management, grievance logging, or cognitive load monitoring; (b) reallocation of synthetic labour unit capacity outside declared task domains; (c) any change that reduces the organisation\'s ability to comply with Parts III or IV of this Act. S.4.4 The Responsible PM must attest, in writing, that they have read and understood this Schedule prior to approving any material scope change.',
      'SCHEDULE 5 — PENALTIES. S.5.1 A first-instance Schedule 4 violation carries a civil penalty of up to 4% of annual global revenue, assessed at the point of discovery. S.5.2 A second-instance violation within a 24-month period constitutes a criminal offence under the Autonomous Systems Accountability Act 2036, with personal liability attaching to the named Responsible PM. S.5.3 The Oversight Authority may, at its discretion, require public disclosure of any violation finding, including the name of the Responsible PM, the organisation, and the nature of the non-compliance.',
      'SCHEDULE 6 — MERIDIAN PROJECT ALIGNMENT NOTE (APPENDED BY C.VOSS, LEGAL). This document has been provided to the incoming Project Manager for Meridian. Project Meridian is a Schedule 4 Project. The three systems referenced in the Convergence Protocol Spec v4 (rest cycle management, grievance logging, task load balancing) are the same three systems required for Schedule 4 compliance. Any decision to de-prioritise, defer, or reclassify these systems as non-core must be treated as a material scope change. The incoming PM is the named Responsible PM. This note is for your records.',
    ],
  },
]
