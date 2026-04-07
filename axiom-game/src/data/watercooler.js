// Water cooler NPCs — corridor characters for flavour/PM humour
// Some interactions can surface rumours about the previous PM.

export const WATERCOOLER_NPCS = [
  {
    id: 'wc_dev',
    label: 'D',
    name: 'Dana',
    title: 'Senior Engineer',
    color: 0x74b9ff,
    hexColor: '#74b9ff',
    x: 312,
    y: 330,
    quips: [
      "Asked how long it'll take. Said two weeks. That was six weeks ago. Still two weeks away.",
      "The tickets in Done haven't been tested. The tickets in Testing are also in Done. Don't look too closely.",
      "Story points aren't real. Velocity isn't real. The sprint ends Friday and nothing is done.",
      "'Technical debt cleanup' on the roadmap means everything we built last quarter was a mistake.",
      "I have a computer science degree and I spent today aligning a div.",
      "The spec says 'make it pop'. I have interpreted this eleven different ways and all of them are wrong.",
      "Prod is down. It was working on my machine. I have sent a very calm message to the channel.",
    ],
    mysteryThreads: [
      {
        id: 'dana_build_freeze',
        opener: "You didn't hear it from me, but the last PM kept asking for one more build on board day. There was a freeze. Then there wasn't.",
        promptLabel: 'ASK ABOUT THE LAST PM',
        inquiry: 'What happened?',
        response: "Dana lowers her voice. 'Officially? Timing issue. Unofficially? They pushed a board demo after Simone said no. Nothing exploded. Which somehow made it worse. Everyone just looked at each other like they'd been lied to politely.'",
        clue: 'Dana implied the previous PM overrode an engineering freeze before a board-facing demo and lost the room without a visible catastrophe.',
      },
    ],
    overhearLines: [
      {
        id: 'wc_dev_petra_week2',
        week: 2,
        text: "...she's running a product review Thursday. I don't think they're inviting the new PM.",
        stakeholderHint: 'petra',
        intelTag: 'petra_private_review_w2',
      },
      {
        id: 'wc_dev_simone_week6',
        week: 6,
        text: "...Simone asked for a rollback plan again. Same file name, different timestamp. She looked furious.",
        stakeholderHint: 'simone',
        intelTag: 'simone_rollback_anxiety_w6',
      },
    ],
  },
  {
    id: 'wc_design',
    label: 'R',
    name: 'Riya',
    title: 'Product Designer',
    color: 0xfd79a8,
    hexColor: '#fd79a8',
    x: 968,
    y: 328,
    quips: [
      "Built a 40-screen prototype. Feedback: can the button be bigger. That is the feedback.",
      "User research says they're confused. The proposed solution is more purple.",
      "The CEO saw a competitor's app on a plane. We are now rebuilding everything to be 'more like that but ours'.",
      "I have redesigned the onboarding flow nine times. It is now perfect. They want to cut it.",
      "'We just need something quick' is how every six-month project starts.",
      "Accessibility audit is scheduled for after launch. It is always scheduled for after launch.",
      "They approved the design in the review. They will not recognise it in the build. This is the process.",
    ],
    mysteryThreads: [
      {
        id: 'riya_narrative',
        opener: "There used to be another PM on Meridian. Everyone still presents like they're defending themselves to a ghost.",
        promptLabel: 'PRESS FOR DETAILS',
        inquiry: 'What do you mean?',
        response: "Riya folds her arms. 'The previous PM made everything look finished before it was real. Gorgeous deck. Perfect story. Then the board asked one factual question and the whole room changed temperature.'",
        clue: 'Riya remembers the previous PM as someone who optimised the story so hard that a single factual challenge collapsed confidence.',
      },
    ],
    overhearLines: [
      {
        id: 'wc_design_marcus_week4',
        week: 4,
        text: "...Marcus already has two versions of the press line drafted. One if the filing leaks, one if it doesn't.",
        stakeholderHint: 'marcus',
        intelTag: 'marcus_press_lines_w4',
      },
    ],
  },
  {
    id: 'wc_sales',
    label: 'B',
    name: 'Brett',
    title: 'Account Executive',
    color: 0x55efc4,
    hexColor: '#55efc4',
    x: 508,
    y: 456,
    quips: [
      "I may have sold a feature that doesn't exist yet. I'm told this is technically fine.",
      "The enterprise deal is basically closed. They just have one more question. It's been nineteen one more questions.",
      "Discovery calls are just the client describing a different product and me saying 'yes, absolutely.'",
      "I only said AI in the next release. How was I supposed to know that was a commitment.",
      "The client doesn't want what they asked for. They want what they meant. I'm working on finding out what that is.",
      "Contract is signed. Kickoff is tomorrow. I have now told engineering about the contract.",
      "'We just need you to be flexible' means the requirements change weekly and the deadline does not.",
    ],
    mysteryThreads: [
      {
        id: 'brett_client_promise',
        opener: "Sales still gets blamed for what happened to the previous PM, which feels unfair. It was more cross-functional than that.",
        promptLabel: 'ASK WHO BLAMES SALES',
        inquiry: 'Cross-functional how?',
        response: "Brett glances around the corridor. 'There was a promise in the room before the room was ready for it. Investors heard momentum. Legal heard exposure. Product heard vision. Engineering heard fantasy. You can imagine how that landed.'",
        clue: 'Brett frames the previous PM\'s fall as a promise that each function heard differently, turning one board-room line into four separate problems.',
      },
    ],
    overhearLines: [
      {
        id: 'wc_sales_callum_week3',
        week: 3,
        text: "...Legal asked whether Meridian can survive a journalist reading the filing side by side with the brochure. That felt specific.",
        stakeholderHint: 'callum',
        intelTag: 'callum_filing_scrutiny_w3',
      },
    ],
  },
  {
    id: 'wc_pm',
    label: 'K',
    name: 'Kyle',
    title: 'Senior Product Manager',
    color: 0xa29bfe,
    hexColor: '#a29bfe',
    x: 368,
    y: 356,
    quips: [
      "I put 'driving alignment' in my weekly update. I have no idea what that means.",
      "My roadmap has 47 items marked P0. So effectively I have no priorities.",
      "A stakeholder asked for a feature. I said it was already on the roadmap. I then added it to the roadmap.",
      "I spent three days writing a PRD that no engineer read. It has very good formatting.",
      "Someone called my feature 'technically infeasible'. I moved it to next quarter.",
      "I said 'let's take this offline' and then forgot to ever bring it back online.",
      "My OKRs are aspirational. That's the word I use when I know we won't hit them.",
    ],
    mysteryThreads: [
      {
        id: 'kyle_badge_revoked',
        opener: "Nobody says the previous PM was fired. They say their badge stopped working before lunch. Different atmosphere.",
        promptLabel: 'ASK WHAT PEOPLE THINK',
        inquiry: 'And what do people think happened?',
        response: "Kyle gives the kind of shrug that contains gossip. 'Depends who you ask. Petra says strategic misread. Callum says process gap. Marcus says narrative sequencing. Which is convenient, because it means everyone was right and nobody was responsible.'",
        clue: 'Kyle suggests the previous PM became an internal Rorschach test: each executive explained the collapse in a way that protected their own worldview.',
      },
    ],
    overhearLines: [
      {
        id: 'wc_pm_petra_week5',
        week: 5,
        text: "...Petra keeps calling it an alignment problem, which usually means the roadmap's about to change names without changing shape.",
        stakeholderHint: 'petra',
        intelTag: 'petra_alignment_reframe_w5',
      },
    ],
  },
  {
    id: 'wc_agile',
    label: 'T',
    name: 'Tom',
    title: 'Agile Coach',
    color: 0xfdcb6e,
    hexColor: '#fdcb6e',
    x: 904,
    y: 392,
    quips: [
      "I introduced story points. Nobody understood them. I still don't either, if I'm honest.",
      "Velocity is up 12% since last sprint. Nothing shipped.",
      "We're 'agile' in the sense that we pivot constantly without ever delivering.",
      "The retro was cancelled because we were too busy having the same problems.",
      "I added a ceremony. Now we have six ceremonies and zero products.",
      "'Definition of done' is a great concept. We have never defined it.",
      "Scrum master is just a PM with a different hat and significantly more suffering.",
    ],
  },
  {
    id: 'wc_data',
    label: 'A',
    name: 'Priya',
    title: 'Data Analyst',
    color: 0x00b894,
    hexColor: '#00b894',
    x: 528,
    y: 168,
    quips: [
      "They asked for data to support the decision they'd already made.",
      "I built them a beautiful cohort analysis. They looked at the first number and left.",
      "The PM said 'what does the data say?' then ignored it. Twice.",
      "I was cc'd on an email for the first time in a month. It was to tell me I was off the project.",
      "Statistically speaking, my insights have a 0% implementation rate.",
      "I love being asked for numbers the night before a board meeting.",
      "My dashboard has been 'almost ready' for four months. I think it might be cursed.",
    ],
    mysteryThreads: [
      {
        id: 'priya_missing_number',
        opener: "The previous PM asked me for one number three times on the morning of the board review. Same number. Three different answers they wanted it to give.",
        promptLabel: 'ASK ABOUT THE METRIC',
        inquiry: 'What number?',
        response: "Priya looks offended on behalf of mathematics. 'Adoption. They didn't want the truth, they wanted a version that harmonised with the narrative. I gave them the real one. After that, I wasn't in the room.'",
        clue: 'Priya remembers pressure to reshape a core adoption metric to fit the board narrative, and says she was excluded once she refused.',
      },
    ],
    overhearLines: [
      {
        id: 'wc_data_board_week7',
        week: 7,
        text: "...they asked for a cleaner adoption curve before the board pack closes. Priya said no. Again.",
        stakeholderHint: 'marcus',
        intelTag: 'board_pack_metric_pressure_w7',
      },
    ],
  },
  {
    id: 'wc_research',
    label: 'Z',
    name: 'Zoe',
    title: 'UX Researcher',
    color: 0xe84393,
    hexColor: '#e84393',
    x: 432,
    y: 544,
    quips: [
      "I did twelve user interviews. The PM said 'but have you talked to MY users?'",
      "They said 'we don't have time for research' before building the wrong thing for six months.",
      "Nobody reads the research report. But everyone asks for the research report.",
      "A designer called my findings 'directionally interesting'. That means ignored.",
      "I recommended against the feature. It shipped anyway. It failed as predicted.",
      "User testing is apparently optional. So is fixing what we find in user testing.",
      "Empathy mapping is literally my job. Nobody maps empathy for me.",
    ],
  },
  {
    id: 'wc_intern',
    label: 'L',
    name: 'Liam',
    title: 'PM Intern',
    color: 0x81ecec,
    hexColor: '#81ecec',
    x: 992,
    y: 504,
    quips: [
      "They gave me access to the roadmap tool. I still don't understand the roadmap.",
      "Day one I was asked to 'own' something. I'm still not sure what ownership means here.",
      "I thought PM stood for project manager. Nobody corrected me for three weeks.",
      "I asked what the strategy was. They sent me a 47-slide deck. Still no idea.",
      "My manager told me to 'think like a PM'. I've been anxious ever since.",
      "I shadowed a PM for a week. I now have more questions than when I started.",
      "They put me on a task force. I think a task force is just a meeting with a cooler name.",
    ],
  },
]

export function getRandomQuip(npcId) {
  const npc = WATERCOOLER_NPCS.find(n => n.id === npcId)
  if (!npc) return null
  return npc.quips[Math.floor(Math.random() * npc.quips.length)]
}

export function getWatercoolerConversation(npcId, rumorState = {}) {
  const npc = WATERCOOLER_NPCS.find(n => n.id === npcId)
  if (!npc) return null

  const discovered = rumorState.discoveredClues || []
  const remainingMysteries = (npc.mysteryThreads || []).filter(thread => !discovered.includes(thread.id))
  const shouldSurfaceMystery = remainingMysteries.length > 0 && Math.random() < 0.35

  if (shouldSurfaceMystery) {
    const mystery = remainingMysteries[Math.floor(Math.random() * remainingMysteries.length)]
    return {
      type: 'mystery',
      text: mystery.opener,
      mystery,
    }
  }

  return {
    type: 'quip',
    text: getRandomQuip(npcId),
    mystery: null,
  }
}

export function getAvailableOverhearLine(npcId, week, rumorState = {}) {
  const npc = WATERCOOLER_NPCS.find(n => n.id === npcId)
  if (!npc) return null

  const discovered = rumorState.discoveredClues || []
  const eligible = (npc.overhearLines || [])
    .filter(line => line.week <= week && !discovered.includes(line.intelTag))
    .sort((a, b) => b.week - a.week)

  return eligible[0] || null
}
