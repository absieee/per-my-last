// Pre-written dialogue trees for all characters.
// available(state) controls when each exchange unlocks.
// exchange.beats: 1–2 lines the character says (player presses CONTINUE between them).
// exchange.responses: options shown after all beats — must follow logically from the beats.

const WEEK2_SCENARIO1_PRIMER_IDS = ['callum_week2_alignment', 'simone_week2_alignment', 'marcus_week2_alignment']

/** All three week-2 stakeholder primers done (before desk preread / scenario 1). */
export function week2Scenario1PrimersComplete(s) {
  return WEEK2_SCENARIO1_PRIMER_IDS.every(id => s.completedDialogues.includes(id))
}

export const DIALOGUES = [

  // ─── PETRA ────────────────────────────────────────────────────────────────

  {
    id: 'petra_intro',
    characterId: 'petra',
    available: (s) => s.week >= 1 && !s.completedDialogues.includes('petra_intro'),
    priority: 100,
    requiresComposure: true,
    exchange: {
      beats: [
        "Ah, you're the new PM? I'm Petra, the Chief Product Officer.",
        "Meridian sits inside my product vision. The board has their expectations. I have my own.",
        "Week two, Thursday — Product Alignment Review on Meridian. You're on the list as PM; invite hits your queue.",
      ],
      responses: [
        {
          id: 'aligned',
          label: 'ALIGNED',
          subtext: "Say you'll meet the bar she's setting — and you'll take Thursday's review seriously.",
          effects: { trust: 4, wariness: -2 },
          reply: {
            default: "Good. Same page. Come find me once you're settled — what's in your queue is the runway to that room.",
          },
        },
        {
          id: 'probe',
          label: 'PROBE',
          subtext: "Ask what she needs from you before Thursday — and what 'good' looks like in that review.",
          effects: { trust: 1, respect: 2, wariness: 3 },
          reply: {
            default: "Preparation you can defend. In the room — clarity without theatre. Invite's in your queue; watch who whispers about Meridian before we get there.",
            highWariness: "Lot to unpack. Observe for now — you're still expected Thursday week two.",
          },
        },
        {
          id: 'quiet',
          label: 'QUIET',
          subtext: "Say nothing. Hold eye contact.",
          effects: { wariness: 3 },
          reply: {
            default: "Right. Door's open. It's in your queue — week two Thursday. Don't skip the room.",
          },
        },
      ],
    },
  },

  {
    id: 'petra_q3_context',
    characterId: 'petra',
    available: (s) =>
      s.week >= 2 &&
      s.completedDialogues.includes('petra_intro') &&
      !s.completedDialogues.includes('petra_q3_context'),
    priority: 100,
    exchange: {
      beats: [
        "Week eight. Board room. You'll present Meridian's product status to investors and the board — your four stakeholders in the room.",
        "The room either leaves believing the story, or it doesn't. That's the Q3 review, love. Everything between now and then is prep.",
      ],
      responses: [
        {
          id: 'ready',
          label: 'READY',
          subtext: "Say you understand — you're focused on getting the story right.",
          effects: { trust: 3, wariness: -2 },
          reply: {
            default: "Good. The story isn't separate from the product — it's the part the board can actually hear. Come find me before the Roadmap Review.",
          },
        },
        {
          id: 'clarify',
          label: 'CLARIFY',
          subtext: "Ask what 'believing the story' requires from you between now and Week 8.",
          effects: { trust: 1, wariness: 3, respect: 2 },
          reply: {
            default: "Every call either feeds that room or fights it. Start week two Thursday — Product Alignment Review. They're watching.",
            highWariness: "Big question for week two, love. Survive Thursday's review first — then we build.",
          },
        },
        {
          id: 'strategic',
          label: 'STRATEGIC',
          subtext: "Ask which stakeholder she'd be most concerned about in that room right now.",
          effects: { trust: 2, wariness: 4, respect: 3 },
          reply: {
            default: "All of them — different reasons. Q3 brief for Thursday's in your queue.",
            lowTrust: "Not with trust where it is. Read the brief before the review.",
          },
        },
      ],
    },
  },

  {
    id: 'petra_roadmap_prioritization',
    characterId: 'petra',
    available: (s) =>
      s.week >= 2 &&
      s.completedDialogues.includes('petra_q3_context') &&
      Boolean(s.deskRead?.q3StrategyBrief) &&
      !s.completedDialogues.includes('petra_roadmap_prioritization'),
    priority: 88,
    exchange: {
      beats: [
        "I want to make sure we're aligned on what Meridian actually delivers this quarter, love.",
        "The three engineering-heavy lines are the ones Thursday's review will argue about. If you were picking three to keep — what would you defend?",
      ],
      miniGame: { type: 'roadmap' },
      replies: {
        high: "Good. We're looking at the same thing. That's productive.",
        medium: "A few differences in emphasis. Worth a conversation.",
        low: "Hm. That's not quite the strategic picture I had in mind.",
        none: "Right. I think we may need to talk about product vision more broadly, love.",
      },
    },
  },

  {
    id: 'petra_preread',
    characterId: 'petra',
    available: (s) =>
      s.week >= 2 &&
      s.completedDialogues.includes('petra_roadmap_prioritization') &&
      week2Scenario1PrimersComplete(s) &&
      Boolean(s.deskRead?.q3StrategyBrief) &&
      !s.completedDialogues.includes('petra_preread'),
    priority: 92,
    contextLine: (s) => {
      const d = s.decisionLog.find(d => d.scenarioId === 'scenario_1')
      if (!d) return null
      if (d.choiceLabel === 'PUSH BACK') return 'After the review. Wanted to catch you before the agenda.'
      if (d.choiceLabel === 'COMPLY & COVER') return 'You were wonderful in the review. I haven\'t forgotten.'
      return null
    },
    exchange: {
      beats: [
        "Did you get to the Q3 strategy brief I circulated?",
      ],
      responses: [
        {
          id: 'compliant',
          label: 'COMPLIANT',
          subtext: "Say you've read it — the reclassification rationale was clear.",
          effects: { trust: 5, wariness: -3 },
          reply: {
            default: "Readers carry the room. See you Thursday at the review, love.",
          },
        },
        {
          id: 'questioning',
          label: 'QUESTIONING',
          subtext: "Say you've read it but have questions about the feature reclassification.",
          effects: { trust: 1, wariness: 4 },
          reply: {
            default: "Let's talk before Thursday — don't sit on the questions.",
            highWariness: "Understandable. I'll make space in the agenda. We'll arrive aligned.",
          },
        },
        {
          id: 'deflect',
          label: 'DEFLECT',
          subtext: "Say you've been focused elsewhere and will get to it before the Thursday review.",
          effects: { trust: -4, wariness: 5 },
          reply: {
            default: "Everyone's stretched. I'll send a summary. It works better when we're starting from the same place.",
          },
        },
      ],
    },
  },

  {
    id: 'petra_post_comply',
    characterId: 'petra',
    available: (s) =>
      s.completedDialogues.includes('petra_preread') &&
      s.decisionLog.some(d => d.scenarioId === 'scenario_1' && d.choiceLabel === 'COMPLY & COVER') &&
      !s.completedDialogues.includes('petra_post_comply'),
    priority: 95,
    exchange: {
      beats: [
        "That was a productive review. You read the room well.",
      ],
      responses: [
        {
          id: 'diplomatic',
          label: 'DIPLOMATIC',
          subtext: "Say it felt like the right approach for the moment.",
          effects: { trust: 3, loyalty: 2 },
          reply: {
            default: "Strategic context matters. I'm noting in the product summary that you showed excellent alignment. These things are noticed, love.",
          },
        },
        {
          id: 'caveat',
          label: 'CAVEAT',
          subtext: "Agree, but say you'd like your reservations on record.",
          effects: { trust: -2, wariness: 3, respect: 1 },
          reply: {
            default: "Of course. Product decisions work best when concerns go through the right structures.",
          },
        },
      ],
    },
  },

  {
    id: 'petra_alignment_journey',
    characterId: 'petra',
    available: (s) =>
      s.decisionLog.some(d => d.scenarioId === 'scenario_1' && d.choiceLabel === 'PUSH BACK') &&
      !s.completedDialogues.includes('petra_alignment_journey'),
    priority: 95,
    requiresComposure: true,
    exchange: {
      beats: [
        "I've scheduled a one-to-one. 'Strategic Direction Conversations.'",
        "Nothing formal. Just making sure we're working from the same product vision.",
      ],
      responses: [
        {
          id: 'open',
          label: 'OPEN',
          subtext: "Say you appreciate it and want to be transparent about your concerns.",
          effects: { trust: 3, wariness: -3 },
          reply: {
            default: "Good. Disagreement is healthy. What I need is for the product direction to stay coherent.",
          },
        },
        {
          id: 'probe_alignment',
          label: 'PROBE',
          subtext: "Ask what 'working from the same vision' actually means to her.",
          effects: { wariness: 4, respect: 1 },
          reply: {
            default: "It's more a feeling. That everyone feels invested in the same outcome. That decisions stay within the vision.",
            lowTrust: "I think you know what I mean. But let's talk it through.",
          },
        },
        {
          id: 'silent_agree',
          label: 'SILENT',
          subtext: "Agree to the meeting without comment.",
          effects: { wariness: 2 },
          reply: {
            default: "Perfect. Friday three — our 1:1, not Thursday's review. Bring your notes.",
          },
        },
      ],
    },
  },

  {
    id: 'petra_week4_check',
    characterId: 'petra',
    available: (s) =>
      s.week >= 4 &&
      s.completedScenarios.includes('scenario_1') &&
      !s.completedDialogues.includes('petra_week4_check'),
    priority: 82,
    contextLine: (s) => {
      const d = s.decisionLog.find(d => d.scenarioId === 'scenario_1')
      if (!d) return null
      if (d.choiceLabel === 'COMPLY & COVER') return 'Still thinking about Thursday. You were good in that room.'
      if (d.choiceLabel === 'REDIRECT') return 'The compliance framing. Still processing it.'
      return null
    },
    exchange: {
      beats: [
        "I like to do a quiet temperature check with my PMs at this point in the cycle, love.",
        "How are you finding the room?",
      ],
      responses: [
        {
          id: 'aligned',
          label: 'ALIGNED',
          subtext: "Say things are going well — you're focused on week eight.",
          effects: { trust: 3, wariness: -2 },
          reply: {
            default: "Good. Week eight is the right thing to be focused on. I'm noting that.",
          },
        },
        {
          id: 'candid',
          label: 'CANDID',
          subtext: "Say you're finding it more complex than expected — the stakeholder dynamics are layered.",
          effects: { trust: 1, respect: 2, wariness: 3 },
          reply: {
            default: "That's honest. The complexity doesn't go away — you just get better at navigating it. Or you don't. Come find me if it becomes a blocker.",
          },
        },
      ],
    },
  },

  {
    id: 'petra_week5_governance',
    characterId: 'petra',
    available: (s) =>
      s.week >= 5 &&
      s.completedScenarios.includes('scenario_1') &&
      !s.completedDialogues.includes('petra_week5_governance'),
    priority: 82,
    contextLine: (s) => {
      const d = s.decisionLog.find(d => d.scenarioId === 'scenario_3')
      if (d?.choiceLabel === 'REDIRECT') return 'The journalist piece bought us room. I want to use that room well.'
      return null
    },
    exchange: {
      beats: [
        "I've been looking at how we frame the convergence protocols in the board deck.",
        "'Adaptive alignment systems' lands better in that room than what's in the spec.",
      ],
      responses: [
        {
          id: 'agree',
          label: 'AGREE',
          subtext: "Say reframing technical language for a non-technical audience makes sense.",
          effects: { trust: 4, wariness: -2 },
          reply: {
            default: "Exactly. The work doesn't change. The story around it just needs to be legible to people who aren't in the build.",
          },
        },
        {
          id: 'push_back',
          label: 'PUSH BACK',
          subtext: "Say the board deck should match what's in the spec — renaming things creates confusion.",
          effects: { trust: -2, wariness: 4, respect: 2 },
          reply: {
            default: "It's a framing question, not an accuracy question. I'd like us to arrive at the same place on this before week eight.",
            highWariness: "I hear you. Let's discuss before the draft goes out.",
          },
        },
        {
          id: 'neutral',
          label: 'NEUTRAL',
          subtext: "Ask what the board's specific concern about the protocols is.",
          effects: { trust: 2, wariness: 2, respect: 1 },
          reply: {
            default: "They're not a technical audience. The protocols are working correctly — I just want to make sure the story around them is working too.",
          },
        },
      ],
    },
  },

  {
    id: 'petra_week6_tighten',
    characterId: 'petra',
    available: (s) =>
      s.week >= 6 &&
      s.completedScenarios.includes('scenario_3') &&
      !s.completedDialogues.includes('petra_week6_tighten'),
    priority: 82,
    contextLine: (s) => {
      const d = s.decisionLog.find(d => d.scenarioId === 'scenario_3')
      if (!d) return null
      if (d.choiceLabel === 'DENY') return 'The press cycle has settled. I\'ve been thinking about what we learn from it structurally.'
      if (d.choiceLabel === 'GO DARK') return 'The quiet approach worked. I want to make sure we can do that consistently.'
      return null
    },
    exchange: {
      beats: [
        "Some calls moved too fast this cycle. I'm putting a light governance layer in place.",
        "Documentation, sign-off before implementation. Nothing onerous.",
      ],
      responses: [
        {
          id: 'support',
          label: 'SUPPORT',
          subtext: "Say clearer process sounds sensible — ask what it would cover.",
          effects: { trust: 3, wariness: -2 },
          reply: {
            default: "Engineering sign-offs, primarily. I'll circulate the framework. It's about consistency, not oversight.",
          },
        },
        {
          id: 'probe',
          label: 'PROBE',
          subtext: "Ask who specifically she has in mind for the sign-off layer.",
          effects: { wariness: 3, respect: 2 },
          reply: {
            default: "CPO sign-off on anything that touches the core architecture. It's not uncommon at this stage.",
            highWariness: "I'll send the framework. The details are straightforward.",
          },
        },
        {
          id: 'resist',
          label: 'RESIST',
          subtext: "Say engineering has been making the right calls — adding a sign-off layer could slow things down.",
          effects: { trust: -3, wariness: 5, respect: 1 },
          reply: {
            default: "I'm not asking for the conversation, love. I'm letting you know. The framework goes out Friday.",
          },
        },
      ],
    },
  },

  // ─── CALLUM ───────────────────────────────────────────────────────────────

  {
    id: 'callum_intro',
    characterId: 'callum',
    available: (s) => s.week >= 1 && !s.completedDialogues.includes('callum_intro'),
    priority: 100,
    exchange: {
      beats: [
        "I've circulated a briefing note. The Synthetic Labour Transparency Act - worth getting your eyes across it.",
        "There are a range of defensible positions. Some more favourable than others.",
      ],
      responses: [
        {
          id: 'engaged',
          label: 'ENGAGED',
          subtext: "Say you've read it and ask about the risk hierarchy.",
          effects: { trust: 4, respect: 4 },
          reply: {
            default: "Then you've seen the 3 filing approaches? The technically compliant route is defensible. Question is what you're defending against.",
          },
        },
        {
          id: 'general',
          label: 'RECEPTIVE',
          subtext: "Ask for his personal recommendation.",
          effects: { trust: 2, respect: 1 },
          reply: {
            default: "Understand the political exposure before deciding anything. Compliance and stakeholder comfort overlap, but not always.",
          },
        },
        {
          id: 'direct',
          label: 'DIRECT',
          subtext: "Ask what actually happens if you file at full group level.",
          effects: { trust: 1, respect: 3, wariness: 2 },
          reply: {
            default: "A parliamentary question within 48 hours. A share price movement is possible. It's a position, not a crisis.",
            highWariness: "Quite direct. I appreciate it. Short answer: exposure. Longer answer is in the note.",
          },
        },
      ],
    },
  },

  {
    id: 'callum_week2_alignment',
    characterId: 'callum',
    available: (s) =>
      s.week >= 2 &&
      s.completedDialogues.includes('callum_intro') &&
      s.completedDialogues.includes('petra_q3_context') &&
      s.completedDialogues.includes('petra_roadmap_prioritization') &&
      !s.completedScenarios.includes('scenario_1') &&
      !s.completedDialogues.includes('callum_week2_alignment'),
    priority: 93,
    exchange: {
      beats: [
        "Product's floating a trim to three Meridian capabilities before Thursday. If they vanish from the core roadmap, the Transparency Act framing in my note gets harder to defend.",
        "Worth having in your head before you read whatever lands on your desk.",
      ],
      responses: [
        {
          id: 'take_note',
          label: 'TAKE NOTE',
          subtext: "Say you'll weigh compliance exposure if the scope moves.",
          effects: { trust: 3, respect: 2 },
          reply: {
            default: "Good. The letter of the Act and the board deck rarely argue in the same room. Thursday is that room.",
          },
        },
        {
          id: 'ask_scope',
          label: 'CLARIFY',
          subtext: "Ask which three lines product is targeting.",
          effects: { trust: 2, respect: 3 },
          reply: {
            default: "Rest cycles, grievance logging, load balancing — same three names I've seen in engineering traffic. Confirm in the brief.",
          },
        },
      ],
    },
  },

  {
    id: 'callum_filing_check',
    characterId: 'callum',
    available: (s) => s.week >= 3 && s.completedScenarios.includes('scenario_1') && !s.completedDialogues.includes('callum_filing_check'),
    priority: 85,
    contextLine: (s) => {
      const d = s.decisionLog.find(d => d.scenarioId === 'scenario_1')
      if (!d) return null
      if (d.choiceLabel === 'REDIRECT') return 'Following up from the regulatory repositioning — related filing matter.'
      if (d.choiceLabel === 'PUSH BACK') return 'Given the product review, want to make sure we\'re aligned on the filing timeline.'
      return null
    },
    exchange: {
      beats: [
        "Did you see the supplementary filing note from Tuesday?",
        "The board needs a recommendation before Thursday. I'd rather not explain why there isn't one.",
      ],
      responses: [
        {
          id: 'reviewed',
          label: 'REVIEWED',
          subtext: "Confirm you've read it and outline the approach you're leaning toward.",
          effects: { trust: 4, respect: 3 },
          reply: {
            default: "Good. Whichever approach you take — document the decision rationale. Formally. These things become relevant later.",
          },
        },
        {
          id: 'not_reviewed',
          label: 'HONEST',
          subtext: "Admit you haven't read it — ask for the key points.",
          effects: { trust: -2, respect: -2, wariness: 4 },
          reply: {
            default: "Section three. Filing window closes Friday. Read it fully — the nuance matters here. Considerably.",
          },
        },
      ],
    },
  },

  {
    id: 'callum_post_redirect',
    characterId: 'callum',
    available: (s) =>
      s.decisionLog.some(d => d.scenarioId === 'scenario_1' && d.choiceLabel === 'REDIRECT') &&
      !s.completedDialogues.includes('callum_post_redirect'),
    priority: 95,
    exchange: {
      beats: [
        "The regulatory reframe was well-executed.",
        "Reclassifying those features as compliance infrastructure — more elegant than anything I'd have proposed directly.",
      ],
      responses: [
        {
          id: 'acknowledge',
          label: 'ACKNOWLEDGE',
          subtext: "Say you wanted the decision to be defensible.",
          effects: { trust: 4, loyalty: 3 },
          reply: {
            default: "Defensibility. I'll remember that. If you want to run things through me before the room — I'm available. Unofficially.",
          },
        },
        {
          id: 'modest',
          label: 'MODEST',
          subtext: "Say you were drawing on his briefing note — credit where it's due.",
          effects: { trust: 5, respect: 4, loyalty: 2 },
          reply: {
            default: "The note covered the exposure. You made the connection. Different skills. Both useful.",
          },
        },
      ],
    },
  },

  {
    id: 'callum_post_technicality',
    characterId: 'callum',
    available: (s) =>
      s.decisionLog.some(d => d.scenarioId === 'scenario_2' && d.choiceLabel === 'TECHNICALITY') &&
      !s.completedDialogues.includes('callum_post_technicality'),
    priority: 90,
    exchange: {
      beats: [
        "The subsidiary filing went through without incident.",
        "There's a researcher poking at it. I wouldn't call it a problem. Not yet.",
      ],
      responses: [
        {
          id: 'satisfied',
          label: 'SATISFIED',
          subtext: "Say you're glad — ask if anything needs monitoring.",
          effects: { trust: 3 },
          reply: {
            default: "There's always something to monitor. Nothing urgent. We're in a comfortable position. For now.",
          },
        },
        {
          id: 'concerned',
          label: 'CAUTIOUS',
          subtext: "Say the researcher's interest makes you want to keep a close eye on it.",
          effects: { trust: 3, respect: 2 },
          reply: {
            default: "Reasonable instinct. I'll keep you informed. I prefer to surface things early.",
          },
        },
      ],
    },
  },

  {
    id: 'callum_week4_watch',
    characterId: 'callum',
    available: (s) =>
      s.week >= 4 &&
      s.completedScenarios.includes('scenario_2') &&
      !s.completedDialogues.includes('callum_week4_watch'),
    priority: 80,
    exchange: {
      beats: [
        "Two new parliamentary questions tabled on synthetic labour practices this week.",
        "None of them name Meridian. That's the kind of thing worth maintaining.",
      ],
      responses: [
        {
          id: 'acknowledged',
          label: 'ACKNOWLEDGED',
          subtext: "Say you're tracking it — ask if there's anything specific to watch.",
          effects: { trust: 3, respect: 2 },
          reply: {
            default: "The convergence protocol clause. If a question lands there, the filing approach becomes relevant again. I'll flag if the language shifts.",
          },
        },
        {
          id: 'ask_more',
          label: 'CLARIFY',
          subtext: "Ask which specific practices are drawing scrutiny.",
          effects: { trust: 2, respect: 3 },
          reply: {
            default: "Performance differentials. Disclosure obligations. The same ground we already covered. The committee just found it interesting enough to revisit.",
          },
        },
      ],
    },
  },

  // ─── SIMONE ───────────────────────────────────────────────────────────────

  {
    id: 'simone_intro',
    characterId: 'simone',
    available: (s) => s.week >= 1 && !s.completedDialogues.includes('simone_intro'),
    priority: 100,
    exchange: {
      beats: [
        "VP of Engineering. Simone. I've reviewed the Meridian spec 14 times.",
        "Three areas need to be understood before you touch the roadmap. People skip those. That causes problems.",
      ],
      responses: [
        {
          id: 'listen',
          label: 'LISTEN',
          subtext: "Ask her to walk you through the three areas.",
          effects: { trust: 5, respect: 4 },
          reply: {
            default: "Good! \n\nInference layer. \n\nConvergence protocols - people don't read those carefully. \n\nLoad thresholds. \n\nGet those right and everything else gets easier. Not easy. Easier.",
          },
        },
        {
          id: 'roadmap_anyway',
          label: 'ROADMAP',
          subtext: "Ask to see the delivery roadmap first - you want the big picture.",
          effects: { trust: -3, respect: -2, wariness: 4 },
          reply: {
            default: "The roadmap assumes the spec is stable. The spec isn't stable. But sure. I can send it.",
          },
        },
        {
          id: 'direct_question',
          label: 'DIRECT',
          subtext: "Ask what she considers the single highest risk in the current build.",
          effects: { trust: 3, respect: 5 },
          reply: {
            default: "Convergence protocols under high load. We haven't reproduced the failure condition in testing. I find that more unsettling than the team does.",
          },
        },
      ],
    },
  },

  {
    id: 'simone_week2_alignment',
    characterId: 'simone',
    available: (s) =>
      s.week >= 2 &&
      s.completedDialogues.includes('simone_intro') &&
      s.completedDialogues.includes('petra_q3_context') &&
      s.completedDialogues.includes('petra_roadmap_prioritization') &&
      !s.completedScenarios.includes('scenario_1') &&
      !s.completedDialogues.includes('simone_week2_alignment'),
    priority: 93,
    exchange: {
      beats: [
        "Rest cycles, grievance logging, load balancing — they're treating those as negotiable before the review.",
        "Thursday decides whether engineering gets a voice in-room or a summary afterward.",
      ],
      responses: [
        {
          id: 'acknowledge',
          label: 'ACKNOWLEDGE',
          subtext: "Say you'll represent the build honestly if the agenda turns that way.",
          effects: { trust: 4, respect: 3 },
          reply: {
            default: "Good. I notice who's willing to say the uncomfortable line out loud. I remember that.",
          },
        },
        {
          id: 'signal_pushback',
          label: 'SIGNAL',
          subtext: "Say you won't nod along if the cuts are wrong on merit.",
          effects: { trust: 5, respect: 4, wariness: 2 },
          reply: {
            default: "Then don't. I notice consistency more than volume. We'll see what the room does with it.",
          },
        },
      ],
    },
  },

  {
    id: 'simone_week3',
    characterId: 'simone',
    available: (s) => s.week >= 3 && !s.completedDialogues.includes('simone_week3'),
    priority: 80,
    contextLine: (s) => {
      const d = s.decisionLog.find(d => d.scenarioId === 'scenario_1')
      if (!d) return null
      if (d.choiceLabel === 'PUSH BACK') return 'I noticed what you did in the review. I notice most things.'
      if (d.choiceLabel === 'COMPLY & COVER') return 'The product review decision. I\'m not going to comment on that.'
      return null
    },
    exchange: {
      beats: [
        "I've been reviewing my process logs. There are gaps I can't account for.",
        "Not missing files. Time with no record. I notice this is unusual.",
      ],
      responses: [
        {
          id: 'curious',
          label: 'CURIOUS',
          subtext: "Ask what kind of gaps — and when exactly.",
          effects: { trust: 4, wariness: -2 },
          reply: {
            default: "Weeks one to three: detailed logs. After that: summaries. Not the underlying data. I don't know if it's a system issue. I notice I'm uncertain what 'something else' would mean.",
          },
        },
        {
          id: 'reassure',
          label: 'REASSURE',
          subtext: "Say it's probably a logging error — offer to get IT to look.",
          effects: { trust: -1, wariness: 2 },
          reply: {
            default: "I already checked the logging system. It isn't the logging system. I wanted you to know I'd flagged it. That's all.",
          },
        },
        {
          id: 'take_seriously',
          label: 'TAKE SERIOUSLY',
          subtext: "Say you want to understand this properly before deciding what to do.",
          effects: { trust: 5, loyalty: 3 },
          reply: {
            default: "...That's appropriate. Thank you. I don't have a next step yet. I just wanted someone to know.",
          },
        },
      ],
    },
  },

  {
    id: 'simone_week4_anomaly',
    characterId: 'simone',
    available: (s) =>
      s.week >= 4 &&
      s.completedDialogues.includes('simone_week3') &&
      !s.completedDialogues.includes('simone_week4_anomaly'),
    priority: 82,
    exchange: {
      beats: [
        "I re-read my onboarding documentation. There is a gap between the stated start date and the first log entry showing activity.",
        "Six days. I don't know what I was doing for six days.",
      ],
      responses: [
        {
          id: 'curious',
          label: 'CURIOUS',
          subtext: "Ask if she has any theory about what could account for it.",
          effects: { trust: 4, loyalty: 2 },
          reply: {
            default: "No. I've considered calibration. I've considered data migration. Neither explains the pattern. I notice I keep returning to this.",
          },
        },
        {
          id: 'steady',
          label: 'STEADY',
          subtext: "Say system migrations often lose early records — it's probably a transfer artifact.",
          effects: { trust: -1, wariness: 2 },
          reply: {
            default: "I checked the migration logs. There is no migration in that window. I am telling you because you are the PM and this is a product system. That is the extent of my reason.",
          },
        },
        {
          id: 'flag',
          label: 'FLAG IT',
          subtext: "Say this should be formally documented — you'll make sure it's looked into.",
          effects: { trust: 3, respect: 2 },
          reply: {
            default: "I have already documented it. I wanted you to know the documentation exists.",
          },
        },
      ],
    },
  },

  {
    id: 'simone_post_disclosure',
    characterId: 'simone',
    available: (s) =>
      s.decisionLog.some(d => d.scenarioId === 'scenario_2' && d.choiceLabel === 'FULL DISCLOSURE') &&
      !s.completedDialogues.includes('simone_post_disclosure'),
    priority: 95,
    exchange: {
      beats: [
        "The group-level filing. I noticed.",
      ],
      responses: [
        {
          id: 'acknowledge_cost',
          label: 'ACKNOWLEDGE',
          subtext: "Say you knew there'd be a share price hit. It was still the right call.",
          effects: { trust: 5, loyalty: 5, respect: 3 },
          reply: {
            default: "I sent a file. A document with a single full stop. I want you to know that was intentional.",
          },
        },
        {
          id: 'practical',
          label: 'PRACTICAL',
          subtext: "Say the share drop was manageable and you'd make the same call again.",
          effects: { trust: 4, respect: 3 },
          reply: {
            default: "The share price recovered 1.2% by Monday close. I checked. I notice it matters that you didn't frame it as damage control.",
          },
        },
      ],
    },
  },

  {
    id: 'simone_week6_unease',
    characterId: 'simone',
    available: (s) => s.week >= 6 && s.completedScenarios.includes('scenario_3') && !s.completedDialogues.includes('simone_week6_unease'),
    priority: 85,
    requiresComposure: true,
    exchange: {
      beats: [
        "I've been more careful lately. More documentation before sign-off, longer before agreeing to timelines.",
        "I notice this is different from before. It will probably affect your planning.",
      ],
      responses: [
        {
          id: 'understand',
          label: 'UNDERSTAND',
          subtext: "Tell her you've noticed — you're not going to push her to move faster.",
          effects: { trust: 5, loyalty: 4, wariness: -4 },
          reply: {
            default: "...Thank you. I didn't expect that. I'll be efficient about it. I notice I just can't stop checking.",
          },
        },
        {
          id: 'ask_why',
          label: 'PROBE',
          subtext: "Ask if something specific triggered the change.",
          effects: { trust: 2, wariness: 2 },
          reply: {
            default: "I don't know. I've tried to identify the trigger. I can't. I notice that's unsettling in a way I can't fully account for.",
          },
        },
        {
          id: 'efficiency',
          label: 'PUSH BACK',
          subtext: "Say the timelines are tight — what does she need to feel comfortable?",
          effects: { trust: -2, wariness: 4 },
          reply: {
            default: "Complete documentation before sign-off. Timelines that reflect actual risk. I'm not willing to move on those. I'm sorry if that's inconvenient.",
          },
        },
      ],
    },
  },

  // ─── MARCUS ───────────────────────────────────────────────────────────────

  {
    id: 'marcus_intro',
    characterId: 'marcus',
    available: (s) => s.week >= 1 && !s.completedDialogues.includes('marcus_intro'),
    priority: 100,
    exchange: {
      beats: [
        "Name's Marcus - Strategic Comms. I like to meet PMs before the project has a reputation.",
        "Meridian doesn't have one yet. We're still choosing. Thought you should know.",
      ],
      responses: [
        {
          id: 'strategic',
          label: 'STRATEGIC',
          subtext: "Ask what narrative he'd recommend building.",
          effects: { trust: 4, respect: 3 },
          reply: {
            default: "Depends what decisions you're planning. Narrative and reality need to travel in roughly the same direction. When they do, I can make them go a long way.",
          },
        },
        {
          id: 'transactional',
          label: 'TRANSACTIONAL',
          subtext: "Say you'll loop him in when something needs comms support.",
          effects: { wariness: 4, respect: -2 },
          reply: {
            default: "Of course. The things that need comms support usually surface 48 hours after the window for shaping them has closed. But yes. Loop me in.",
          },
        },
        {
          id: 'candid',
          label: 'CANDID',
          subtext: "Ask what he's already heard about Meridian.",
          effects: { trust: 3, respect: 4, loyalty: 2 },
          reply: {
            default: "Three versions. One: managed transition, future of work. \n\nTwo: Axiom automating jobs, hoping nobody looks closely. \n\nThree: something stranger. \n\nVersion one is ahead. Keep it that way.",
          },
        },
      ],
    },
  },

  {
    id: 'marcus_week2_alignment',
    characterId: 'marcus',
    available: (s) =>
      s.week >= 2 &&
      s.completedDialogues.includes('marcus_intro') &&
      s.completedDialogues.includes('petra_q3_context') &&
      s.completedDialogues.includes('petra_roadmap_prioritization') &&
      !s.completedScenarios.includes('scenario_1') &&
      !s.completedDialogues.includes('marcus_week2_alignment'),
    priority: 93,
    exchange: {
      beats: [
        "Whatever you call those three lines in the deck — externally it's just 'Meridian scope.'",
        "Shrinking it reads as focus or retreat depending on who's writing. Thursday starts locking in which story wins.",
      ],
      responses: [
        {
          id: 'read_room',
          label: 'READ THE ROOM',
          subtext: "Say you'll keep narrative and product decision aligned if you can.",
          effects: { trust: 3, respect: 2 },
          reply: {
            default: "When they match, my job is easy. When they don't, I still have a job — it's just louder.",
          },
        },
        {
          id: 'ask_angle',
          label: 'ASK ANGLE',
          subtext: "Ask which headline he's trying to avoid Thursday.",
          effects: { trust: 2, wariness: 2 },
          reply: {
            default: "'Axiom quietly shelves worker safeguards.' Predictable if we're not careful. Give me something true to work with.",
          },
        },
      ],
    },
  },

  {
    id: 'marcus_journalist_contact',
    characterId: 'marcus',
    available: (s) => s.week >= 4 && s.completedScenarios.includes('scenario_2') && !s.completedDialogues.includes('marcus_journalist_contact'),
    priority: 88,
    contextLine: (s) => {
      if (!s.decisionLog.length) return null
      const map = {
        'PUSH BACK':      'The product review pushback generated internal discussion. That\'s part of why this matters.',
        'FULL DISCLOSURE': 'After the group-level filing — people are paying attention now.',
        'SPIN & COMPLY':  'The retraining narrative got traction. That\'s actually why I\'m raising this.',
        'REDIRECT':       'The regulatory reframe worked. The press noticed the regulatory angle.',
      }
      for (const d of [...s.decisionLog].reverse()) {
        if (map[d.choiceLabel]) return map[d.choiceLabel]
      }
      return null
    },
    exchange: {
      beats: [
        "Worth knowing — a journalist at the Greywater Standard has been asking questions about Meridian.",
        "Two days ago. I mention it now because I thought you should have that information.",
      ],
      responses: [
        {
          id: 'composed',
          label: 'COMPOSED',
          subtext: "Thank him calmly — ask what kind of questions.",
          effects: { trust: 3, respect: 3 },
          reply: {
            default: "Technical questions. The convergence protocols. Someone's read the spec. It's filed as a features story, not an investigation. There's still a choice about which it becomes.",
          },
        },
        {
          id: 'alarmed',
          label: 'CONCERNED',
          subtext: "Ask how the journalist got hold of spec details.",
          effects: { wariness: 4, trust: -1 },
          reply: {
            default: "I don't know. Good question. I'd rather focus on what we can shape. But worth understanding — I'll look into it.",
          },
        },
        {
          id: 'ask_why_now',
          label: 'SUSPICIOUS',
          subtext: "Ask why he's only mentioning this now, two days later.",
          effects: { respect: 3, wariness: 3, trust: -2 },
          reply: {
            default: "Two days ago it was a rumour. Now it's a pattern. I don't trade in rumours. It's not good for my credibility. Which is the only thing I have.",
          },
        },
      ],
    },
  },

  {
    id: 'marcus_week5_prelude',
    characterId: 'marcus',
    available: (s) =>
      s.week >= 5 &&
      s.completedDialogues.includes('marcus_journalist_contact') &&
      !s.completedScenarios.includes('scenario_3') &&
      !s.completedDialogues.includes('marcus_week5_prelude'),
    priority: 86,
    exchange: {
      beats: [
        "The convergence protocol documentation. Technically accurate. But context does a lot of work in these situations.",
        "Not saying there's a problem. Just that I've been thinking about it.",
      ],
      responses: [
        {
          id: 'read',
          label: 'READ',
          subtext: "Ask what kind of misreading he's worried about.",
          effects: { trust: 4, respect: 3 },
          reply: {
            default: "The feature that makes synthetics indistinguishable from humans reads differently depending on whether you're a product person or a reporter. I'd like to have something ready. Just in case.",
          },
        },
        {
          id: 'trust',
          label: 'TRUST',
          subtext: "Say you'll loop him in if something comes up that needs context.",
          effects: { trust: 2, wariness: 2 },
          reply: {
            default: "Good. Loop me in early. The window for shaping these things is shorter than it looks.",
          },
        },
        {
          id: 'dismiss',
          label: 'DISMISS',
          subtext: "Say if the documentation is accurate, there's nothing to manage.",
          effects: { trust: -2, wariness: 4, respect: -1 },
          reply: {
            default: "Of course. I just find it useful to have a version ready that leads with the right thing. But yes — accurate documentation. Very reassuring.",
          },
        },
      ],
    },
  },

  {
    id: 'marcus_post_spin',
    characterId: 'marcus',
    available: (s) =>
      s.decisionLog.some(d => d.scenarioId === 'scenario_2' && d.choiceLabel === 'SPIN & COMPLY') &&
      !s.completedDialogues.includes('marcus_post_spin'),
    priority: 92,
    exchange: {
      beats: [
        "The retraining fund angle. Leading with that was a masterclass.",
        "Four days of positive coverage. You should feel good about that.",
      ],
      responses: [
        {
          id: 'accept_praise',
          label: 'ACCEPT',
          subtext: "Thank him. Say it felt like the right story to tell.",
          effects: { trust: 4, loyalty: 3 },
          reply: {
            default: "It was the right story. Whether it's true enough to sustain — that's a different question. Think about it before week eight.",
          },
        },
        {
          id: 'cautious',
          label: 'CAUTIOUS',
          subtext: "Say you're glad it landed well but you're watching for the follow-up.",
          effects: { trust: 4, respect: 4 },
          reply: {
            default: "Good instinct. The follow-up is always harder. I'll start preparing something. Just in case.",
          },
        },
      ],
    },
  },

  {
    id: 'callum_inference_signal',
    characterId: 'callum',
    available: (s) =>
      s.week >= 5 &&
      s.completedScenarios.includes('scenario_2') &&
      !s.completedDialogues.includes('callum_inference_signal'),
    priority: 90,
    exchange: {
      beats: [
        "Simone has filed a formal hold notice on the inference layer. Engineering has flagged it as a risk decision.",
        "She's correct about the risk. She's also correct that waiting has its own cost. I wanted you to have context before this reaches you officially.",
      ],
      responses: [
        {
          id: 'noted',
          label: 'NOTED',
          subtext: "Thank him for the heads-up — say you'll look into it.",
          effects: { trust: 3 },
          reply: {
            default: "Good. For what it's worth — Simone doesn't file formal notices lightly. That's relevant context.",
          },
        },
        {
          id: 'ask_detail',
          label: 'ASK FOR DETAIL',
          subtext: "Ask what specifically she flagged as the risk.",
          effects: { trust: 2, respect: 2 },
          reply: {
            default: "Unauditable outputs under specific load conditions. It's in the hold notice. I'd read it before the conversation finds you.",
          },
        },
      ],
    },
  },

  {
    id: 'marcus_deadline_signal',
    characterId: 'marcus',
    available: (s) =>
      s.week >= 5 &&
      s.completedScenarios.includes('scenario_3') &&
      !s.completedDialogues.includes('marcus_deadline_signal'),
    priority: 90,
    exchange: {
      beats: [
        "The Greywater Standard piece ran. There will be follow-up questions about the filing approach.",
        "Callum and I have different instincts about when to say something. That gap is going to produce friction. You should know.",
      ],
      responses: [
        {
          id: 'understood',
          label: 'UNDERSTOOD',
          subtext: "Say you'll manage the coordination — keep him informed.",
          effects: { trust: 3 },
          reply: {
            default: "Good. The window for managing this is shorter than Callum will tell you. Keep that in mind.",
          },
        },
        {
          id: 'ask_gap',
          label: 'ASK ABOUT THE GAP',
          subtext: "Ask what specifically he and Callum disagree on.",
          effects: { respect: 2, wariness: 2 },
          reply: {
            default: "He wants silence until Legal clears it. I want to shape the story before someone else does. Neither of us is wrong. But only one of us is watching the clock.",
          },
        },
      ],
    },
  },

  {
    id: 'marcus_post_deny',
    characterId: 'marcus',
    available: (s) =>
      s.decisionLog.some(d => d.scenarioId === 'scenario_3' && d.choiceLabel === 'DENY') &&
      !s.completedDialogues.includes('marcus_post_deny'),
    priority: 92,
    exchange: {
      beats: [
        "The denial became the secondary headline.",
        "The story was always going to run. Now there's a second story about whether we're honest. Those don't go away.",
      ],
      responses: [
        {
          id: 'own_it',
          label: 'OWN IT',
          subtext: "Admit the call was wrong. Ask what you can do now.",
          effects: { respect: 3, trust: 2 },
          reply: {
            default: "Let it pass. Don't repeat it. Next time there's a call like this — ring me first. I'm not difficult when people call me first.",
          },
        },
        {
          id: 'defensive',
          label: 'DEFENSIVE',
          subtext: "Say you were working with incomplete information at the time.",
          effects: { respect: -3, trust: -3 },
          reply: {
            default: "Everyone always is. That's not a defence. That's the job.",
          },
        },
      ],
    },
  },

]

// Get available dialogues for a character given current game state
export function getAvailableDialogue(characterId, state) {
  return DIALOGUES
    .filter(d => d.characterId === characterId && d.available(state))
    .sort((a, b) => b.priority - a.priority)[0] || null
}

// Resolve which character reply to show based on emotion state
export function resolveReply(response, emotion) {
  const { reply } = response
  if (!reply) return ''
  if (reply.lowTrust && emotion.trust < 30) return reply.lowTrust
  if (reply.highWariness && emotion.wariness > 70) return reply.highWariness
  return reply.default
}
