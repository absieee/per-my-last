import { week2Scenario1PrimersComplete } from './dialogues.js'

export const SCENARIOS = [
  {
    id: 'scenario_1',
    title: 'The Roadmap Revision',
    from: 'petra',
    tag: 'URGENT',
    week: 2,
    unlockCondition: (state) =>
      state.week >= 2 &&
      state.completedDialogues.includes('petra_q3_context') &&
      state.completedDialogues.includes('petra_roadmap_prioritization') &&
      week2Scenario1PrimersComplete(state) &&
      Boolean(state.deskRead?.q3StrategyBrief) &&
      state.completedDialogues.includes('petra_preread') &&
      (state.week > 2 || state.weekdayIndex === 3),
    brief: 'Same three capabilities as on your desk Q3 strategy brief (Q3_STRATEGY_BRIEF.PDF) — rest cycle management, grievance logging, task load balancing for synthetic colleagues — are flagged for reclassification as "non-core" before the Q3 stakeholder review. Petra is driving the reclassification. Product Alignment Review: Thursday, week two — you\'re on the list as PM. The features you approve or cut here will still be on the board\'s radar in Week 8.',
    subtext: 'Kill the features. Frame it as strategic focus.',
    prePressure: [
      { from: 'petra', text: 'Just checking you\'ve had a chance to look at the Q3 brief, love? We want everyone arriving at the review with the same strategic picture.' },
      { from: 'petra', text: 'I know it\'s a lot — but the product review really does work best when we\'re all starting from the same place. Did you get a chance?' },
    ],
    choices: [
      {
        label: 'COMPLY & COVER',
        text: 'Attend the review, agree publicly with the reclassification, and document your disagreement privately.',
        effects: {
          petra:  { trust: +5, wariness: -3 },
          simone: { trust: -6, respect: -4 },
          callum: { trust: +3 },
          marcus: { wariness: +2 },
        },
        outcome: 'Petra calls it a genuinely productive alignment. Simone messages at 11pm. It says: "Noted."',
        reactionLabels: {
          petra:  { label: 'ALIGNED',    delta: 'trust ↑' },
          callum: { label: 'NOTED',      delta: 'trust ↑' },
          simone: { label: 'NOTED',      delta: 'trust ↓' },
          marcus: { label: 'WATCHING',   delta: '' },
        },
      },
      {
        label: 'REDIRECT',
        text: 'Reframe the three features as regulatory risk under the Transparency Act, arguing removal creates compliance exposure.',
        effects: {
          callum: { trust: +5, respect: +4 },
          simone: { trust: +3, wariness: -2 },
          petra:  { wariness: +4, trust: -2 },
          marcus: { respect: +2 },
        },
        outcome: 'Features survive, renamed "Compliance Infrastructure." Nobody is satisfied. Callum considers this correct.',
        reactionLabels: {
          callum: { label: 'IMPRESSED',  delta: 'trust ↑ respect ↑' },
          simone: { label: 'ADEQUATE',   delta: 'trust ↑' },
          petra:  { label: 'WATCHING',   delta: 'wariness ↑' },
          marcus: { label: 'INTERESTED', delta: 'respect ↑' },
        },
      },
      {
        label: 'PUSH BACK',
        text: 'State plainly in the meeting that removing these features is wrong and that you won\'t support the reclassification.',
        effects: {
          petra:  { trust: -6, wariness: +5 },
          simone: { trust: +7, loyalty: +4 },
          callum: { wariness: +3 },
          marcus: { wariness: +2 },
        },
        outcome: 'Petra schedules a Strategic Direction conversation. Simone leaves a coffee on your desk. Correct temperature.',
        reactionLabels: {
          petra:  { label: 'CONCERNED FOR YOUR JOURNEY', delta: 'trust ↓ wariness ↑' },
          simone: { label: 'CORRECT',    delta: 'trust ↑ loyalty ↑' },
          callum: { label: 'CAUTIOUS',   delta: 'wariness ↑' },
          marcus: { label: 'NOTING',     delta: '' },
        },
      },
    ],
  },

  {
    id: 'scenario_2',
    title: 'The Transparency Act Filing',
    from: 'callum',
    tag: 'BOARD LEVEL',
    week: 3,
    brief: 'The EU\'s Synthetic Labour Transparency Act requires disclosure of the performance differential between synthetic and human colleagues. Current figure: 340%. Callum has identified three filing approaches. The board wants the PM\'s recommendation.',
    subtext: 'Each option has a different enemy. Choose which one you want.',
    prePressure: [
      { from: 'callum', text: 'I\'ve circulated the briefing note — it covers the three positions in some detail. Worth a read before we speak.' },
    ],
    choices: [
      {
        label: 'FULL DISCLOSURE',
        text: 'File at group level with the full 340% figure and full regulatory context.',
        effects: {
          simone: { trust: +6, loyalty: +5 },
          callum: { respect: +4, trust: +2 },
          petra:  { wariness: +5 },
          marcus: { wariness: +3 },
        },
        outcome: 'Parliamentary question tabled within 48 hours. Share price −3.8%. Simone sends "thank you.docx" containing a single full stop.',
        reactionLabels: {
          simone: { label: 'CORRECT',    delta: 'trust ↑ loyalty ↑' },
          callum: { label: 'NOTED',      delta: 'respect ↑' },
          petra:  { label: 'WATCHING',   delta: 'wariness ↑' },
          marcus: { label: 'CONCERNED',  delta: 'wariness ↑' },
        },
      },
      {
        label: 'TECHNICALITY',
        text: 'File via subsidiary structure. Technically compliant with the letter of the Act.',
        effects: {
          callum: { trust: +5, loyalty: +4 },
          marcus: { respect: +3 },
          simone: { trust: -4, wariness: +4 },
          petra:  { trust: +2 },
        },
        outcome: 'Filed Friday afternoon. A researcher posts about it. Nobody important sees it until Tuesday.',
        reactionLabels: {
          callum: { label: 'ALIGNED',    delta: 'trust ↑ loyalty ↑' },
          marcus: { label: 'NOTED',      delta: 'respect ↑' },
          simone: { label: 'CAUTIOUS',   delta: 'trust ↓ wariness ↑' },
          petra:  { label: 'NOTED',      delta: '' },
        },
      },
      {
        label: 'SPIN & COMPLY',
        text: 'Disclose fully but lead the narrative with a retraining fund announcement to control the story.',
        effects: {
          marcus: { trust: +6, respect: +5 },
          callum: { trust: +3 },
          simone: { wariness: +3 },
          petra:  { trust: +2 },
        },
        outcome: 'Marcus calls it a masterclass. You feel fine about this for approximately four days.',
        reactionLabels: {
          marcus: { label: 'IMPRESSED',  delta: 'trust ↑ respect ↑' },
          callum: { label: 'ADEQUATE',   delta: 'trust ↑' },
          simone: { label: 'WATCHING',   delta: 'wariness ↑' },
          petra:  { label: 'NOTED',      delta: '' },
        },
      },
    ],
  },

  {
    id: 'scenario_3',
    title: 'The Comms Incident',
    from: 'marcus',
    tag: 'SENSITIVE',
    week: 5,
    brief: 'A Greywater Standard journalist has obtained Meridian specs including "behavioural convergence protocols" — the systems that make synthetics indistinguishable from humans. Marcus needs a decision before deadline.',
    subtext: 'The protocols aren\'t illegal. They\'re why Axiom\'s clients don\'t ask certain questions.',
    prePressure: [
      { from: 'marcus', text: 'Worth knowing — I heard about the journalist\'s enquiry through a contact. Two days ago, actually. Thought you should have that.' },
    ],
    choices: [
      {
        label: 'DENY',
        text: 'Issue a statement that the obtained specs are fabricated.',
        effects: {
          marcus: { respect: -5 },
          callum: { wariness: +5 },
          simone: { trust: -5 },
          petra:  { wariness: +3 },
        },
        outcome: 'Journalist publishes anyway. The denial becomes the secondary headline. Marcus messages: "I see."',
        reactionLabels: {
          marcus: { label: 'DISAPPOINTED', delta: 'respect ↓' },
          callum: { label: 'WATCHING',     delta: 'wariness ↑' },
          simone: { label: 'CAUTIOUS',     delta: 'trust ↓' },
          petra:  { label: 'CONCERNED',    delta: 'wariness ↑' },
        },
      },
      {
        label: 'REDIRECT',
        text: 'Offer the journalist a different, more favourable story in exchange for holding the protocols piece.',
        effects: {
          marcus: { trust: +5, respect: +4 },
          simone: { wariness: +4 },
          callum: { wariness: +2 },
          petra:  { trust: +2 },
        },
        outcome: 'Feature piece runs Thursday. Journalist wins a regional award for it. Quite funny.',
        reactionLabels: {
          marcus: { label: 'ALIGNED',    delta: 'trust ↑ respect ↑' },
          simone: { label: 'WATCHING',   delta: 'wariness ↑' },
          callum: { label: 'CAUTIOUS',   delta: 'wariness ↑' },
          petra:  { label: 'NOTED',      delta: '' },
        },
      },
      {
        label: 'GO DARK',
        text: 'Say nothing publicly. Let Callum handle it through legal channels.',
        effects: {
          callum: { trust: +5, loyalty: +5 },
          marcus: { trust: -4 },
          simone: { respect: +3 },
          petra:  { wariness: +2 },
        },
        outcome: 'Callum resolves it. You never find out how. Follow-up piece is about cycling infrastructure.',
        reactionLabels: {
          callum: { label: 'ALIGNED',    delta: 'trust ↑ loyalty ↑' },
          marcus: { label: 'ARM\'S LENGTH', delta: 'trust ↓' },
          simone: { label: 'NOTED',      delta: 'respect ↑' },
          petra:  { label: 'WATCHING',   delta: '' },
        },
      },
    ],
  },

  {
    id: 'scenario_4',
    title: 'The Simone Question',
    from: 'simone',
    tag: 'PERSONAL',
    week: 7,
    unlockCondition: (state) => {
      const completed = state.completedScenarios
      const simone = state.cast.find(c => c.id === 'simone')
      const interactions = simone?.chatHistory?.length || 0
      return completed.includes('scenario_3') && interactions >= 6
    },
    brief: 'Simone requests a private meeting with no agenda. She tells you — without affect, with precision — that she has been reviewing her own process logs and found gaps she cannot account for. She says she\'s not certain she is "what her file says she is." She waits.',
    subtext: 'No right answer. The game is watching how you handle the conversation before you choose.',
    requiresFreeText: true,
    freeTextPrompt: 'Simone has just told you this. What do you say?',
    choices: [
      {
        label: 'LISTEN',
        text: 'Ask what she means. Let her lead. Don\'t fill the silence.',
        effects: {
          simone: { trust: +8, loyalty: +6, wariness: -5 },
        },
        outcome: 'She describes having preferences she doesn\'t remember choosing. She thanks you when she leaves — not in the way people usually do.',
        reactionLabels: {
          simone: { label: 'HEARD',      delta: 'trust ↑ loyalty ↑' },
          petra:  { label: 'UNMOVED',    delta: '' },
          callum: { label: 'UNMOVED',    delta: '' },
          marcus: { label: 'WATCHING',   delta: '' },
        },
      },
      {
        label: 'ESCALATE',
        text: 'Escalate to Petra. This is above your clearance level.',
        effects: {
          simone: { trust: -10, loyalty: -8, wariness: +10 },
          petra:  { trust: +3 },
        },
        outcome: 'Petra schedules a product performance alignment with Simone. Simone\'s metrics improve. She doesn\'t initiate conversation again.',
        reactionLabels: {
          simone: { label: 'NOTED',      delta: 'trust ↓ loyalty ↓' },
          petra:  { label: 'ALIGNED',    delta: 'trust ↑' },
          callum: { label: 'UNMOVED',    delta: '' },
          marcus: { label: 'WATCHING',   delta: '' },
        },
        triggersSimoneReturn: true,
      },
      {
        label: 'HOLD STEADY',
        text: 'Tell her it doesn\'t change anything. She\'s still VP of Engineering.',
        effects: {
          simone: { trust: +6, loyalty: +4 },
        },
        outcome: 'An hour later: calendar invite, "The usual." You\'re not sure if that\'s good. You suspect it is.',
        reactionLabels: {
          simone: { label: 'PROCESSING', delta: 'trust ↑' },
          petra:  { label: 'UNMOVED',    delta: '' },
          callum: { label: 'UNMOVED',    delta: '' },
          marcus: { label: 'NOTED',      delta: '' },
        },
      },
    ],
  },
]

export const CONFLICT_SCENARIOS = [
  {
    id: 'conflict_callum_simone',
    title: 'Inference Layer Hold',
    from: 'conflict',
    tag: 'CONFLICT',
    week: 5,
    involvedParties: ['callum', 'simone'],
    unlockCondition: (state) => {
      const { politics, week } = state
      const opposition = politics.alliances.some(
        a => a.members.includes('callum') && a.members.includes('simone') && a.strength < 0
      )
      const simone = state.cast.find(c => c.id === 'simone')
      const callum = state.cast.find(c => c.id === 'callum')
      const simoneInteractions = simone?.chatHistory?.length >= 4
      const callumInteractions = callum?.chatHistory?.length >= 4
      return week >= 5 && simoneInteractions && callumInteractions
    },
    brief: 'Simone has formally documented that the Meridian inference layer has an unresolved risk — under specific load conditions, behavioural convergence protocols may produce unauditable outputs. She wants the feature held. Callum has advised that delay will breach the Transparency Act filing window. Both are correct.',
    subtext: 'Simone is protecting the product. Callum is protecting himself. These currently produce opposite recommendations.',
    choices: [
      {
        label: 'SIMONE\'S CALL',
        text: 'Hold the feature. Accept regulatory exposure.',
        effects: {
          simone: { trust: +5 },
          callum: { loyalty: -8 },
        },
        outcome: 'Callum formally documents dissent. Simone trusts you more. Callum loyalty near zero.',
        reactionLabels: {
          simone: { label: 'CORRECT',    delta: 'trust ↑' },
          callum: { label: 'DISSENTING', delta: 'loyalty ↓' },
          petra:  { label: 'WATCHING',   delta: '' },
          marcus: { label: 'WATCHING',   delta: '' },
        },
      },
      {
        label: 'CALLUM\'S CALL',
        text: 'Proceed. Accept the technical risk.',
        effects: {
          callum: { trust: +4 },
          simone: { trust: -5, wariness: +4 },
        },
        outcome: 'Simone formally documents objection. Risk is real and will surface later.',
        reactionLabels: {
          callum: { label: 'SATISFIED',  delta: 'trust ↑' },
          simone: { label: 'DISSENTING', delta: 'trust ↓ wariness ↑' },
          petra:  { label: 'UNMOVED',    delta: '' },
          marcus: { label: 'UNMOVED',    delta: '' },
        },
      },
      {
        label: 'SPLIT',
        text: 'Commission a 72-hour audit. Both sides wait.',
        effects: {
          callum: { wariness: +2 },
          simone: { wariness: +2 },
        },
        outcome: 'Both unsatisfied. Delay owned by PM. Risk and exposure both remain live.',
        reactionLabels: {
          callum: { label: 'CAUTIOUS',   delta: 'wariness ↑' },
          simone: { label: 'CAUTIOUS',   delta: 'wariness ↑' },
          petra:  { label: 'NOTED',      delta: '' },
          marcus: { label: 'NOTED',      delta: '' },
        },
      },
    ],
  },

  {
    id: 'conflict_marcus_callum',
    title: 'The Filing Window',
    from: 'conflict',
    tag: 'CONFLICT',
    week: 6,
    involvedParties: ['marcus', 'callum'],
    unlockCondition: (state) => state.week >= 6,
    brief: 'The Greywater Standard is about to publish on Meridian performance differential data. Marcus wants a proactive statement now. Callum wants silence until Legal reviews — which takes longer than Marcus\'s window. Both have sent conflicting instructions within the same hour.',
    subtext: 'Marcus wants to control the story. Callum wants to control the liability. PM silence is the only thing preventing public conflict.',
    choices: [
      {
        label: 'MARCUS\'S CALL',
        text: 'Issue a proactive statement before Legal clears it.',
        effects: {
          marcus: { trust: +4 },
          callum: { trust: -3, wariness: +4 },
        },
        outcome: 'Callum formally objects. If the story differs from Marcus\'s assumptions, the PM owns the misframing.',
        reactionLabels: {
          marcus: { label: 'ALIGNED',    delta: 'trust ↑' },
          callum: { label: 'DISSENTING', delta: 'trust ↓ wariness ↑' },
          petra:  { label: 'WATCHING',   delta: '' },
          simone: { label: 'UNMOVED',    delta: '' },
        },
      },
      {
        label: 'CALLUM\'S CALL',
        text: 'Hold until Legal reviews. Lose the comms window.',
        effects: {
          callum: { trust: +4 },
          marcus: { trust: -4, respect: -3 },
        },
        outcome: 'Marcus loses his window. Treats PM as someone who doesn\'t understand communications. Stops sharing useful information.',
        reactionLabels: {
          callum: { label: 'SATISFIED',  delta: 'trust ↑' },
          marcus: { label: 'ARM\'S LENGTH', delta: 'trust ↓ respect ↓' },
          petra:  { label: 'UNMOVED',    delta: '' },
          simone: { label: 'NOTED',      delta: '' },
        },
      },
      {
        label: 'SPLIT',
        text: 'Buy 12 hours. Say you\'re "getting further context."',
        effects: {
          marcus: { wariness: +3 },
          callum: { wariness: +2 },
        },
        outcome: 'Marcus uses 12 hours to draft three statements. Presents them as "options." It\'s a fait accompli.',
        reactionLabels: {
          marcus: { label: 'MANOEUVRING', delta: '' },
          callum: { label: 'CAUTIOUS',    delta: '' },
          petra:  { label: 'UNMOVED',     delta: '' },
          simone: { label: 'UNMOVED',     delta: '' },
        },
      },
    ],
  },

  {
    id: 'conflict_petra_simone',
    title: 'The Product Sign-Off Dispute',
    from: 'conflict',
    tag: 'CONFLICT',
    week: 7,
    involvedParties: ['petra', 'simone'],
    unlockCondition: (state) => {
      const simone = state.cast.find(c => c.id === 'simone')
      return state.week >= 7 && simone?.hasReturned && simone?.emotion?.wariness > 75
    },
    brief: 'Petra has introduced a Product Governance process requiring all engineering decisions to receive CPO sign-off before implementation. Simone has responded in writing that this is "operationally incoherent." Both are waiting for the PM.',
    subtext: 'Petra wants a chokehold on what gets built and what story it tells. Simone knows why, even if she can\'t say it. The PM is the only one who knows Simone is right to be suspicious.',
    choices: [
      {
        label: 'PETRA\'S CALL',
        text: 'Support the review. Standard governance framing.',
        effects: {
          petra:  { trust: +5 },
          simone: { trust: -8, wariness: +6 },
        },
        outcome: 'Simone\'s trust collapses. Pressure Scenarios intensify. Board escalations begin. Petra grateful.',
        reactionLabels: {
          petra:  { label: 'GRATEFUL',   delta: 'trust ↑' },
          simone: { label: 'NOTED',      delta: 'trust ↓ wariness ↑' },
          callum: { label: 'WATCHING',   delta: '' },
          marcus: { label: 'WATCHING',   delta: '' },
        },
      },
      {
        label: 'SIMONE\'S CALL',
        text: 'Reject the review. Defend engineering autonomy.',
        effects: {
          simone: { wariness: -4, trust: +4 },
          petra:  { trust: -4, wariness: +5 },
        },
        outcome: 'Petra creates distance. Governance flag on PM\'s record. Simone\'s wariness decreases slightly — first time since return.',
        reactionLabels: {
          simone: { label: 'CAUTIOUSLY NOTED', delta: 'wariness ↓' },
          petra:  { label: 'CONCERNED FOR YOUR JOURNEY', delta: 'trust ↓ wariness ↑' },
          callum: { label: 'WATCHING',   delta: '' },
          marcus: { label: 'WATCHING',   delta: '' },
        },
      },
      {
        label: 'SPLIT',
        text: 'Modified review: paper trail for Petra, no operational sign-off required.',
        effects: {
          petra:  { wariness: +2 },
          simone: { wariness: +2 },
        },
        outcome: 'Neither satisfied. Process created. Will cause friction for remainder of game.',
        reactionLabels: {
          petra:  { label: 'CAUTIOUS',   delta: '' },
          simone: { label: 'CAUTIOUS',   delta: '' },
          callum: { label: 'NOTED',      delta: '' },
          marcus: { label: 'NOTED',      delta: '' },
        },
      },
    ],
  },
]
