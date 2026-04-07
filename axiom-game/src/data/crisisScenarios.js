// Crisis scenarios — injected when a stakeholder hits trust < 20 AND wariness > 75.
// Each fires once per character per run. The "Reigns death state" equivalent.

export const CRISIS_SCENARIOS = {
  petra: {
    id: 'crisis_petra',
    title: 'Formal Alignment Review',
    from: 'petra',
    tag: 'URGENT · BOARD CC\'D',
    unlockCondition: () => true,
    brief: 'Petra has scheduled a formal Alignment Review and copied three board members. The meeting invite subject line reads: "PM Strategic Alignment — Exploratory Conversation." The product direction document does not exist yet. She says she\'ll circulate it by end of day.',
    subtext: 'This is what Petra looks like when she\'s done being warm about it.',
    choices: [
      {
        label: 'ATTEND & COMPLY',
        text: 'Accept the review. Attend. Give Petra everything she needs to close the matter her way.',
        effects: {
          petra:  { trust: +8, wariness: -12 },
          callum: { wariness: +3 },
          simone: { trust: -4 },
          marcus: { wariness: +2 },
        },
        outcome: 'Petra sends a follow-up email thanking you for your "openness to the process." It is copied to everyone.',
        reactionLabels: {
          petra:  { label: 'SATISFIED',      delta: 'trust ↑↑' },
          callum: { label: 'OBSERVING',      delta: 'wariness ↑' },
          simone: { label: 'NOTED',          delta: 'trust ↓' },
          marcus: { label: 'WATCHING',       delta: '' },
        },
      },
      {
        label: 'REQUEST MEDIATION',
        text: 'Ask for an independent mediator before attending. Frame it as wanting the process to be fair to both parties.',
        effects: {
          petra:  { trust: -3, wariness: +5, respect: +2 },
          callum: { trust: +3, respect: +2 },
          simone: { trust: +2 },
          marcus: { respect: +3 },
        },
        outcome: 'Petra reschedules. The board members are quietly removed from the CC. Nothing is resolved. Nothing escalates.',
        reactionLabels: {
          petra:  { label: 'RECALIBRATING',  delta: 'wariness ↑' },
          callum: { label: 'IMPRESSED',      delta: 'trust ↑' },
          simone: { label: 'NEUTRAL',        delta: '' },
          marcus: { label: 'INTRIGUED',      delta: 'respect ↑' },
        },
      },
      {
        label: 'ESCALATE ABOVE',
        text: 'Forward the invite to the CEO with a brief note questioning whether this review is appropriate.',
        effects: {
          petra:  { trust: -15, wariness: +20 },
          callum: { wariness: +8 },
          simone: { trust: +4, respect: +3 },
          marcus: { wariness: +5 },
        },
        outcome: 'The CEO replies in three words: "Will look into." Petra does not respond for four days. Her spider plant is moved to a different desk.',
        reactionLabels: {
          petra:  { label: 'COLD',           delta: 'trust ↓↓' },
          callum: { label: 'CONCERNED',      delta: 'wariness ↑' },
          simone: { label: 'RESPECT',        delta: 'trust ↑' },
          marcus: { label: 'FASCINATED',     delta: '' },
        },
      },
    ],
  },

  callum: {
    id: 'crisis_callum',
    title: 'Regulatory Exposure Notice',
    from: 'callum',
    tag: 'LEGAL · DOCUMENTED',
    unlockCondition: () => true,
    brief: 'Callum has formally logged a "potential regulatory exposure" attributable to PM decision-making on Project Meridian. The document runs to eleven pages. Section four is titled "A Timeline of Concerns Raised."',
    subtext: 'He has been building this record for weeks. This is not a surprise to him.',
    choices: [
      {
        label: 'ACCEPT THE FRAME',
        text: 'Acknowledge the document. Agree to a remediation plan on Callum\'s terms.',
        effects: {
          callum: { trust: +6, wariness: -10 },
          petra:  { trust: +3 },
          simone: { wariness: +3 },
          marcus: { wariness: +2 },
        },
        outcome: 'Callum adds a closing section to the document: "PM demonstrated appropriate responsiveness to compliance guidance." It is still eleven pages.',
        reactionLabels: {
          callum: { label: 'SATISFIED',      delta: 'trust ↑↑' },
          petra:  { label: 'PLEASED',        delta: 'trust ↑' },
          simone: { label: 'WATCHFUL',       delta: '' },
          marcus: { label: 'NOTING',         delta: '' },
        },
      },
      {
        label: 'CHALLENGE IT',
        text: 'Request a meeting to challenge the characterisation of specific decisions in section four.',
        effects: {
          callum: { trust: -2, wariness: +4, respect: +4 },
          petra:  { wariness: +3 },
          simone: { trust: +3, respect: +2 },
          marcus: { respect: +3 },
        },
        outcome: 'Callum revises three footnotes. The document is now thirteen pages. He considers this progress.',
        reactionLabels: {
          callum: { label: 'RECALIBRATING',  delta: 'respect ↑' },
          petra:  { label: 'NOTING',         delta: '' },
          simone: { label: 'APPROVES',       delta: 'trust ↑' },
          marcus: { label: 'INTERESTED',     delta: 'respect ↑' },
        },
      },
    ],
  },

  simone: {
    id: 'crisis_simone',
    title: 'Sprint Failure — Public Escalation',
    from: 'simone',
    tag: 'ESCALATED · ENGINEERING',
    unlockCondition: () => true,
    brief: 'Simone has raised sprint failures in an all-hands forum, naming three PM decisions as contributing factors. She did not warn you. She did not soften it. The engineering team attended. So did the board observer.',
    subtext: 'She said in the debrief that she had "flagged this through smaller forums." She had.',
    choices: [
      {
        label: 'ACKNOWLEDGE PUBLICLY',
        text: 'Send an all-staff message acknowledging the PM decisions Simone named and committing to a sprint review process.',
        effects: {
          simone: { trust: +8, wariness: -8 },
          petra:  { trust: -3, wariness: +4 },
          callum: { wariness: +4 },
          marcus: { wariness: +3 },
        },
        outcome: 'Simone does not respond directly. The next sprint review has correct documentation for the first time.',
        reactionLabels: {
          simone: { label: 'ADEQUATE',       delta: 'trust ↑↑' },
          petra:  { label: 'CONCERNED',      delta: 'wariness ↑' },
          callum: { label: 'CAUTIOUS',       delta: 'wariness ↑' },
          marcus: { label: 'MANAGING',       delta: '' },
        },
      },
      {
        label: 'CONTAIN IT',
        text: 'Ask Marcus to help frame the all-hands as a "productive engineering review" before it becomes a media item.',
        effects: {
          marcus: { trust: +4, loyalty: +2 },
          simone: { trust: -8, wariness: +10 },
          petra:  { wariness: +2 },
          callum: { wariness: +4 },
        },
        outcome: 'Marcus produces a three-paragraph internal summary. Simone reads it. Her response is a single full stop, sent at 23:41.',
        reactionLabels: {
          marcus: { label: 'USEFUL',         delta: 'trust ↑' },
          simone: { label: 'DONE',           delta: 'trust ↓↓' },
          petra:  { label: 'WATCHING',       delta: '' },
          callum: { label: 'WARY',           delta: 'wariness ↑' },
        },
      },
      {
        label: 'ESCALATE ABOVE',
        text: 'Request a board-level review of the sprint process, framing Simone\'s escalation as a governance failure.',
        effects: {
          simone: { trust: -15, wariness: +20 },
          petra:  { trust: +2, wariness: +5 },
          callum: { wariness: +8 },
          marcus: { wariness: +5 },
        },
        outcome: 'The board schedules a review. Simone submits forty-seven pages of documentation. Yours is due Friday.',
        reactionLabels: {
          simone: { label: 'WAR',            delta: 'trust ↓↓' },
          petra:  { label: 'CONCERNED',      delta: 'wariness ↑' },
          callum: { label: 'TROUBLED',       delta: 'wariness ↑' },
          marcus: { label: 'FASCINATED',     delta: '' },
        },
      },
    ],
  },

  marcus: {
    id: 'crisis_marcus',
    title: 'Off-The-Record Becomes On-The-Record',
    from: 'marcus',
    tag: 'MEDIA · URGENT',
    unlockCondition: () => true,
    brief: 'Something you said in what you understood to be a private conversation has been attributed — not quoted, attributed — in a piece running tomorrow about Meridian\'s approach to synthetic labour performance metrics. Marcus has sent one message: "We should talk before 6pm."',
    subtext: 'He knows what\'s in the piece. He has not told you yet.',
    choices: [
      {
        label: 'CALL MARCUS NOW',
        text: 'Call him immediately. Let him lead. Agree to whatever framing he proposes.',
        effects: {
          marcus: { trust: +8, wariness: -10 },
          petra:  { wariness: +2 },
          callum: { wariness: +3 },
          simone: { wariness: +2 },
        },
        outcome: 'The piece runs. The attribution is softened to "a source close to the project." Marcus adds a statement. The story lasts one news cycle.',
        reactionLabels: {
          marcus: { label: 'GRATEFUL',       delta: 'trust ↑↑' },
          petra:  { label: 'WATCHING',       delta: '' },
          callum: { label: 'NOTED',          delta: '' },
          simone: { label: 'OBSERVING',      delta: '' },
        },
      },
      {
        label: 'NO COMMENT',
        text: 'Tell Marcus you are issuing no comment and will not engage with the piece.',
        effects: {
          marcus: { trust: -5, wariness: +8 },
          callum: { trust: +2, respect: +2 },
          petra:  { wariness: +3 },
          simone: { wariness: +2 },
        },
        outcome: 'The piece runs with the original attribution. Marcus manages the aftermath without consulting you. You are not sure what he said.',
        reactionLabels: {
          marcus: { label: 'NOTED',          delta: 'trust ↓' },
          callum: { label: 'APPROVES',       delta: 'trust ↑' },
          petra:  { label: 'WATCHING',       delta: '' },
          simone: { label: 'NEUTRAL',        delta: '' },
        },
      },
    ],
  },
}
