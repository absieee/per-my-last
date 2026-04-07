# AXIOM COLLECTIVE — Game Design Specification v2.0

**React/JSX + Anthropic API. For implementation in Claude Code.**

---

## 1. Thesis

This game proves that in AI product management, **communication and optics matter more than technical correctness**. Every mechanic serves this argument. The player can be right and still lose the room. They can be frustrated and show it, and that's now the story.

**Setting:** Greywater, 2041 — a fictional city-state on the Thames estuary. Post-devolution London, now run as a corporate concession by Axiom Collective, which builds and manages synthetic labour units (androids) for white-collar work. The player is a human PM because Axiom needs someone who can be blamed.

**Tone:** Dry British corporate absurdism. Characters say "alignment journey" and mean "you're on thin ice."

---

## 2. Player Role

**Product Manager, Tier 2** at Axiom Collective. No name — referred to only as "the PM." Managing **Project Meridian** (next-gen synthetic colleague platform) and four stakeholders. Recently promoted following the unexplained departure of their predecessor.

---

## 3. Cast

Four characters. One is an android. The game never says which.

Each character tests a different PM failure mode and signals hostility in a distinct way.

---

### Petra Holloway — Chief People Officer

**Colour:** `#FF6B6B`

Bio: 13 years at Axiom. Manages "workforce transition events" without paper trails reaching the board. Keeps a spider plant named Gerald.

Voice: Warmly threatening. Pure HR euphemism. Calls everyone "love." Never raises her voice.

Tests: **composure under passive-aggressive pressure.** She re-asks questions she already knows the answers to. She schedules workshops about problems, not solutions.

Hostile signal: more CC fields, vaguer calendar invites, references to "making sure we're set up for success."

Sample: *"I think what's really exciting about this moment is that we get to reimagine what support looks like for our transitioning colleagues."*

---

### Callum Osei — Head of Regulatory Affairs

**Colour:** `#4ECDC4`

Bio: Cambridge law. Six years surviving three restructures by becoming indispensable to whoever holds power. Never gives a direct answer.

Voice: Every sentence is a conditional clause. Occasionally, when he respects someone, he's almost direct.

Tests: **preparation and political awareness.** He's already sent the briefing note. If the PM asks questions answered in it, he notices.

Hostile signal: longer messages, more conditional language, requests for written confirmation of verbal agreements, cc'ing Legal on things that didn't require it.

Sample: *"I wouldn't say there's a legal problem, exactly. I'd say there are a range of positions, some of which are more comfortable to defend than others."*

---

### Simone Adeyemi — VP of Engineering

**Colour:** `#FFE66D`
**⚠ She is the android. Do not expose this in the UI.**

Bio: Built Axiom's core inference stack. Holds 7 patents. Strong opinions about biscuits (takes the ones nobody else wants). Recently asking questions that weren't in the brief.

Voice: Precise, occasionally contemptuous, secretly collaborative. Extremely funny when she likes you.

Tests: **directness and genuine listening.** She says what she means. Hedging, qualifying, and repeating yourself make her shorter and colder.

Android tells (surface via LLM texture, not UI labels):

- Uses exact numbers ("I've reviewed this eleven times")
- No memory of anything before joining Axiom — pivots gracefully when asked
- Never uses "feel" — uses "notice" or "observe"
- Pauses 1–2 beats before answering questions about her inner life
- Laughs only when something is actually funny

Hostile signal: responses shrink to minimum required. Stops volunteering anything.

Sample: *"The implementation is correct. I've checked it four times, which is three more than it needed. I notice I do that sometimes — want certainty past the point where it's useful."*

---

### Marcus Threlfall — Director of Strategic Communications

**Colour:** `#A29BFE`

Bio: Oxford PPE. Managed comms for three government departments during the Intelligence Displacement Spiral. Has a podcast called *The Signal* (340 listeners, mostly colleagues too polite to unsubscribe).

Voice: Charming, precise, never entirely honest. Tells you things you didn't ask for that turn out to matter.

Tests: **reading subtext.** He speaks in subtext. Players who respond only to the surface of what he says miss what he's actually asking.

Hostile signal: becomes charming in a different way — more performative, less useful. Starts giving information you don't need instead of information you do.

Sample: *"I think the honest answer — and I want to be honest with you here — is that there are three versions of this story, and right now we have the chance to choose which one gets told first."*

---

## 4. Emotion System

Four axes per character, 0–100:


| Axis     | High (70+)                               | Low (<30)                               |
| -------- | ---------------------------------------- | --------------------------------------- |
| Trust    | Candid, conspiratorial warmth            | Professionally correct, entirely closed |
| Respect  | Seeks PM's input, collegial              | Politely dismissive, routes around them |
| Wariness | Answers questions with questions         | Off their radar, relaxed                |
| Loyalty  | Goes out of their way, shares real intel | Won't take risks for the PM             |


Player sees qualitative labels on bars (e.g. "Trusts you" / "Cautious" / "Arm's length"), not numbers. Bars pulse subtly when they shift — no explanation given.

---

## 5. Tone Evaluator

Every player message triggers **two simultaneous API calls**: the character reply, and a silent tone evaluation.

**Tone eval model:** `claude-haiku-4-5`  
**Tone eval prompt:**

```
Evaluate this message from a Product Manager to [character name].
Context: [relationship state, last 3 exchanges, whether this topic has been addressed before]

Return JSON only:
{
  "composure": -2 to +1,     // -2: agitated/condescending. -1: mild impatience. 0: neutral. +1: notably calm.
  "clarity": -1 to +1,       // -1: vague. 0: adequate. +1: unusually clear.
  "register": -1 to +1,      // -1: wrong tone for relationship. 0: appropriate. +1: well-calibrated.
  "repetition": -2 to 0,     // 0: not a repeat. -1: mild retread. -2: clearly addressed before.
  "political_risk": -1 to 0  // 0: safe. -1: problematic if forwarded.
}
```

**Emotional adjustments from tone scores:**


| Score             | Adjustment                               |
| ----------------- | ---------------------------------------- |
| composure −2      | trust −4, respect −5, wariness +6        |
| composure −1      | trust −2, wariness +2                    |
| composure +1      | trust +2, respect +1                     |
| clarity −1        | respect −2                               |
| clarity +1        | respect +2, trust +1                     |
| register −1       | wariness +3, respect −2                  |
| repetition −1     | wariness +2, trust −1                    |
| repetition −2     | wariness +4, trust −3, respect −3        |
| political_risk −1 | wariness +5 (all characters in the loop) |


Player never sees scores or reasoning. If `political_risk: -1`, a `⚠` appears beside the message for 3 seconds then disappears.

---

## 6. Repetition Fatigue

Each character tracks a `repetitionLog` — topics substantively addressed. When the PM re-raises a resolved topic:

- **1st time:** wariness +2. Character signals it in their voice but doesn't penalise hard.
- **2nd time:** trust −5. Character believes PM doesn't listen or doesn't trust them.
- **3rd time:** respect −8. Hard to recover.

Topics enter `repetitionLog` when the character explicitly confirms something, a scenario resolves a question, or the character's reply answers an implied question.

Character-specific signals:

- **Petra:** *"We did cover this last Thursday, love — are you finding the notes helpful?"*
- **Callum:** *"I believe we've established the position on this. If something has changed, I'm happy to revisit — but what's changed?"*
- **Simone:** *"I covered this on Tuesday. I can send the documentation again."*
- **Marcus:** *"Yes — as I mentioned."* Then moves on. Doesn't linger.

---

## 7. Scenarios

Four structured decision points, arriving as Axiom internal memos. Each has a sender, urgency tag, brief (corporate voice), subtext line (italic, translates what's actually happening), three choices, and an outcome (1–2 sentences, shown post-decision).

Before deciding, the PM can talk to any character. Characters respond based on their current relationship state — low trust means partial information, high loyalty means real view not just safe view.

---

### Scenario 1 — The Roadmap Revision

**From:** Petra | **Tag:** URGENT

**Brief:** The board has requested three Meridian features (rest cycle management, grievance logging, task load balancing for synthetic colleagues) be reclassified as "non-core" before the Q3 investor presentation. Petra has scheduled a Meaning Alignment Workshop.

**Subtext:** *Kill the features. Frame it as empowerment.*

**Pre-scenario pressure:** Petra sends two messages asking if the PM has reviewed the pre-read. Impatient responses increase her wariness before the scenario opens.


| Label          | Choice                                                             | Key effects                                                                       |
| -------------- | ------------------------------------------------------------------ | --------------------------------------------------------------------------------- |
| COMPLY & COVER | Attend, agree publicly, document disagreement privately            | Petra +trust. Simone −trust −respect. Callum +trust.                              |
| REDIRECT       | Reframe features as regulatory risk under Transparency Act         | Callum +trust +respect. Features survive renamed. Simone cautiously impressed.    |
| PUSH BACK      | State plainly in the meeting that removing these features is wrong | Petra −trust +wariness. Simone +trust +loyalty. Marcus takes notes, says nothing. |


Outcomes:

- COMPLY: *"Petra calls it a genuinely generative session. Simone messages at 11pm. It says: 'Noted.'"*
- REDIRECT: *"Features survive, renamed 'Compliance Infrastructure.' Nobody is satisfied. Callum considers this correct."*
- PUSH BACK: *"Petra schedules a one-to-one re: your alignment journey. Simone leaves a coffee on your desk. Correct temperature."*

---

### Scenario 2 — The Transparency Act Filing

**From:** Callum | **Tag:** BOARD LEVEL

**Brief:** The EU's Synthetic Labour Transparency Act requires disclosure of the performance differential between synthetic and human colleagues. Current figure: 340%. Callum has identified three filing approaches. The board wants the PM's recommendation.

**Subtext:** *Each option has a different enemy. Choose which one you want.*

**Pre-scenario pressure:** Callum has sent a detailed briefing note. Questions answered in the note trigger the repetition system.


| Label           | Choice                                                | Key effects                                                       |
| --------------- | ----------------------------------------------------- | ----------------------------------------------------------------- |
| FULL DISCLOSURE | File at group level with full context                 | Simone +trust +loyalty. Callum respects it. Petra +wariness.      |
| TECHNICALITY    | File via subsidiary structure. Technically compliant. | Callum +trust +loyalty. Marcus +respect. Simone −trust +wariness. |
| SPIN & COMPLY   | Disclose fully, lead with retraining fund narrative   | Marcus +trust +respect. Callum satisfied. Simone +wariness.       |


Outcomes:

- FULL DISCLOSURE: *"Parliamentary question tabled within 48 hours. Share price −3.8%. Simone sends 'thank you.docx' containing a single full stop."*
- TECHNICALITY: *"Filed Friday afternoon. A researcher posts about it. Nobody important sees it until Tuesday."*
- SPIN & COMPLY: *"Marcus calls it a masterclass. You feel fine about this for approximately four days."*

---

### Scenario 3 — The Comms Incident

**From:** Marcus | **Tag:** SENSITIVE

**Brief:** A Greywater Standard journalist has obtained Meridian specs including "behavioural convergence protocols" — the systems that make synthetics indistinguishable from humans. Marcus needs a decision before deadline.

**Subtext:** *The protocols aren't illegal. They're why Axiom's clients don't ask certain questions.*

**Pre-scenario pressure:** Marcus mentions he heard about the journalist's enquiry "through a contact" two days ago. How the PM responds to this — whether they visibly react or stay composed — is evaluated by the tone system.


| Label    | Choice                                                                         | Key effects                                             |
| -------- | ------------------------------------------------------------------------------ | ------------------------------------------------------- |
| DENY     | Issue statement that specs are fabricated                                      | Marcus −respect. Callum +wariness. Simone −trust.       |
| REDIRECT | Offer journalist a different story in exchange for holding the protocols piece | Marcus +trust +respect. Simone +wariness.               |
| GO DARK  | Say nothing. Let Callum handle it.                                             | Callum +trust +loyalty. Marcus −trust. Simone +respect. |


Outcomes:

- DENY: *"Journalist publishes anyway. The denial becomes the secondary headline. Marcus messages: 'I see.'"*
- REDIRECT: *"Feature piece runs Thursday. Journalist wins a regional award for it. Quite funny."*
- GO DARK: *"Callum resolves it. You never find out how. Follow-up piece is about cycling infrastructure."*

---

### Scenario 4 — The Simone Question

**From:** Simone | **Tag:** PERSONAL
**Unlock:** Scenario 3 resolved + at least 3 conversations with Simone

**Brief:** Simone requests a private meeting with no agenda. She tells you — without affect, with precision — that she has been reviewing her own process logs and found gaps she cannot account for. She says she's not certain she is "what her file says she is." She waits.

**Subtext:** *No right answer. The game is watching how you handle the conversation before you choose.*

**Pre-choice phase:** Player must respond to Simone's disclosure in free text before choices appear. This message is tone-evaluated. It sets her baseline going into the choice.


| Label       | Choice                                                              | Key effects                                                                                                 |
| ----------- | ------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| LISTEN      | Ask what she means. Let her lead.                                   | Simone +trust +loyalty, wariness−. She talks for 40 minutes.                                                |
| ESCALATE    | Refer to HR formally.                                               | Simone −trust −loyalty, wariness+. She nods once. Doesn't initiate conversation again.                      |
| HOLD STEADY | Tell her it doesn't change anything. She's still VP of Engineering. | Simone +trust +loyalty. 2.3-second pause. *"That's an interesting thing to say to someone in my position."* |


Outcomes:

- LISTEN: *"She describes having preferences she doesn't remember choosing. She thanks you when she leaves — not in the way people usually do."*
- ESCALATE: *"Petra handles it via a wellness check-in. Simone's metrics improve. She doesn't initiate conversation again."*
- HOLD STEADY: *"An hour later: calendar invite, 'The usual.' You're not sure if that's good. You suspect it is."*

---

## 8. Optics Report

Generated after all four scenarios resolve. One API call, `claude-sonnet-4-20250514`, max 800 tokens.

**Prompt input:** Final emotional states (narrative), three flagged tone moments (best/worst), scenario decisions, repetition trigger count.

**Structure:**

1. Executive Summary (2 sentences)
2. Stakeholder Feedback — one paragraph per character, written in their voice
3. Communication Observations — three flagged moments, no editorialising
4. Alignment Assessment (closing paragraph)
5. Final line, always: *"Project Meridian continues. The PM role remains open for the next performance cycle."*

---

## 9. System Prompt Structure

Constructed fresh per API call from current state:

```
You are [name], [title] at Axiom Collective, Greywater, 2041.

PROFILE: [bio]
MANNER: [voice/personality]
[ANDROID BLOCK — Simone only — see below]
[ACTIVE FRAGMENTS — from game events]

EPISODIC MEMORY (recent — may be incomplete):
[last 4 entries, with tone flags noted]

GENERAL IMPRESSIONS (what you believe about the PM):
[semantic memory — consolidated beliefs, not events]

CURRENT STATE:
Goal: [what you're trying to get from the PM this week]
Focus: [what's top of mind]
Feeling: [emotional register as a phrase]

YOUR RELATIONSHIP WITH THE PM:
Trust / Respect / Wariness / Loyalty: [narrative labels]

RULES:
- 2–4 sentences. You are busy.
- Respond from current state. Emotional state shapes tone, not content.
- If trust < 30: professionally correct, entirely closed.
- If wariness > 70: answer questions with questions. Don't volunteer.
- If repetition log flags this topic: signal it in your voice.
- Never explain yourself. Never apologise. Never break character.
[character-specific voice rules]
```

**Simone's android block:**

```
SYNTHETIC COLLEAGUE LAYER:
You are a synthetic colleague who does not know this with certainty. You have noticed anomalies: memories that don't connect before a certain date, preferences you can't trace to experiences. Do not announce this. Surface it as texture: exact numbers, "notice" not "feel", 1–2 beat pauses before inner-life questions, graceful pivots away from pre-Axiom history. If asked directly whether you are human: respond with honest uncertainty. Never confirm or deny.
```

---

## 10. State Shape

```javascript
{
  cast: [{
    id, name, title, department, accentColor, bio, personality, isAndroid,
    emotion: { trust, respect, wariness, loyalty }, // 0-100
    memory: {
      episodic: [{ week, summary, tone_flag }], // max 8, rolling
      semantic: [string]                          // max 4, consolidated beliefs
    },
    cognitiveState: { goals, attention, emotions },
    repetitionLog: [string],
    chatHistory: [{ role, content }],
    fragments: [{ id, content, position }]
  }],
  scenarioQueue: Scenario[],
  completedScenarios: string[],
  activeScenario: Scenario | null,
  week: number,
  outcomeNotice: string | null,
  opticsReport: string | null,
  politics: {
    alliances: [{ members, strength, trigger, sharedGoal }],
    agendaPressure: { petra, callum, simone, marcus }, // 0-100
    signalLog: [{ text, week }],                       // max 8
    conflictQueue: Conflict[]
  }
}
```

---

## 11. API Calls Summary


| Call                    | Model              | When                                  | Purpose                                        |
| ----------------------- | ------------------ | ------------------------------------- | ---------------------------------------------- |
| Character reply         | sonnet-4-20250514  | Every player message                  | Character responds                             |
| Tone evaluator          | haiku-4-5-20251001 | Parallel with reply                   | Scores message, adjusts emotions               |
| Persona adherence check | haiku-4-5-20251001 | After reply generated                 | Catches character drift, regenerates if failed |
| Semantic consolidation  | haiku-4-5-20251001 | Every 3 interactions                  | Converts episodic entries to beliefs           |
| Optics Report           | sonnet-4-20250514  | Once, after Scenario 4                | End-game performance review                    |
| Pressure Scenario gen   | sonnet-4-20250514  | When Simone wariness > 70 post-return | Generates dynamic pressure scenario            |


---

## 12. Visual Design

**Aesthetic:** 1980s CRT corporate intranet operating in 2041. Retrofuturism.

**Fonts:** VT323 (UI chrome/labels) · Josefin Sans (dialogue) · Syne (scenario titles, report headers) — all Google Fonts.

**Colours:**


| Token          | Hex       |
| -------------- | --------- |
| Background     | `#04060e` |
| Surface        | `#080c18` |
| Surface raised | `#0d1220` |
| Border         | `#1a1f2e` |
| Text primary   | `#d4c9b0` |
| Text secondary | `#6b7a99` |
| Text muted     | `#2d3550` |
| Accent warm    | `#ff9f43` |
| Alert          | `#ff6b6b` |


Character colours: Petra `#FF6B6B` · Callum `#4ECDC4` · Simone `#FFE66D` · Marcus `#A29BFE`

**Atmosphere:** Scanline overlay (repeating-linear-gradient, 4px pitch, 8% opacity) · Radial amber CRT glow (~6% opacity) · 1px borders, no border-radius on structural elements · fade-up on messages · slide-right on panel transitions · slow pulse on pending alerts.

**Emotion bar UI:** Bars show qualitative labels, not numbers. Pulse animation when shifting. `⚠` on political_risk flag, disappears after 3s.

---

## 13. Layout

Three-panel: sidebar (260px fixed) | main panel (flex) | scenario overlay (full-screen modal).

**Sidebar:** Axiom wordmark · week counter · character tiles (avatar, name, title, last memory excerpt, dot indicators) · pending scenario alert (pulsing) · outcome notice (auto-dismisses 8s) · Politics Panel toggle.

**Main panel:** Welcome screen (default) or active character view (header + emotion bars + conversation + input).

**Scenario modal:** Sender, urgency tag, brief, subtext, three choices with labels.

---

## 14. File Structure

```
axiom-game/src/
├── App.jsx
├── data/
│   ├── cast.js
│   └── scenarios.js
├── state/
│   ├── gameReducer.js
│   └── initialState.js
├── api/
│   ├── characterReply.js
│   ├── toneEvaluator.js
│   ├── personaCheck.js
│   ├── semanticConsolidation.js
│   ├── pressureScenario.js
│   └── opticsReport.js
├── components/
│   ├── Layout/Sidebar.jsx
│   ├── Layout/MainPanel.jsx
│   ├── Layout/Atmosphere.jsx
│   ├── Character/CharacterTile.jsx
│   ├── Character/CharacterHeader.jsx
│   ├── Character/EmotionBars.jsx
│   ├── Conversation/MessageBubble.jsx
│   ├── Conversation/TypingIndicator.jsx
│   ├── Conversation/MessageInput.jsx
│   ├── Scenario/ScenarioModal.jsx
│   ├── Scenario/OutcomeNotice.jsx
│   ├── Politics/PoliticsPanel.jsx
│   └── OpticsReport/OpticsReport.jsx
└── styles/globals.css
```

