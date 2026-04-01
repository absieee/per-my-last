# AXIOM — Addendum v2.2: The Politics System
**Read after main spec v2.0. Implements adaptive agendas, alliances, and conflict scenarios.**

---

## B1. Overview

Each character has a hidden agenda — a goal they're pursuing *through* the PM, not with them. Agendas have fixed end goals but adaptive tactics. Characters form temporary alliances when interests align and conflict when they don't, forcing the PM to pick sides.

The PM can sense agendas but cannot see them directly.

---

## B2. Character Agendas

### Petra — Institutional Self-Preservation
**Goal:** Ensure no PM decision during this tenure can be traced back to Petra as a failure of process or people management.

**Tactical adaptation:**

| PM behaviour | Petra's response |
|---|---|
| PM makes well-received decisions | Retroactively frames herself as an enabler. References "the support we provided." |
| PM decision backfires | Produces documentation of concerns she "raised at the time." |
| PM politically strong | Moves closer — attaches to PM's momentum. |
| PM weakened | Creates distance. Communications become formal. Copies HR on things that didn't need it. |
| PM resists her process requirements | Escalates to board as a "governance gap." Warmly. |

**Alliance logic:** Allies with Callum when decisions need to be defensible. Allies with Marcus when a narrative is needed to cover a process failure. Never allies with Simone — structurally incompatible. Provides information to other characters that weakens the PM, framed as "context sharing."

---

### Callum — Positional Leverage
**Goal:** Accumulate enough information and formal involvement in PM decisions to remain indispensable regardless of which way things go.

**Tactical adaptation:**

| PM behaviour | Callum's response |
|---|---|
| PM decides without consulting Callum | Retroactively flags a "potential compliance consideration" to establish he should have been involved |
| PM consults Callum early | Becomes strategically generous with information. Starts sharing things PM didn't ask for. |
| PM ignores his framing | Formally documents his alternative recommendation. Building a record. |
| PM under pressure | Offers to "clarify the regulatory position" — inserts himself as neutral party, steers to preferred outcome |
| PM politically strong | Requests joint briefings to be seen standing next to whoever's winning |

**Alliance logic:** Allies with Petra on governance/compliance overlap. Allies with Marcus when a narrative needs a legal frame. Works against Simone when her technical decisions create regulatory exposure — via questions, not accusations. Post-Simone-return: may become her unexpected ally, using her distrust of the PM opportunistically.

---

### Marcus — Narrative Ownership
**Goal:** Be the person who controls what story gets told about Project Meridian. Not the decision-maker — the explainer.

**Tactical adaptation:**

| PM behaviour | Marcus's response |
|---|---|
| PM communicates externally without him | Surfaces a "reputational consideration" to ensure involvement next time |
| PM routes everything through Marcus | Becomes progressively more ambitious — starts shaping internal narratives too |
| PM makes public mistake | Has a narrative ready before the PM has processed what happened |
| PM makes public success | Amplifies it — positions himself as the communication strategy architect |
| PM pushes back on his framing | Becomes curious. Asks questions. Gathering intel to route around them next time. |

**Alliance logic:** Allies with anyone whose interests match his current narrative. No fixed ally. Will tip off the PM about another character's agenda when it serves his narrative positioning. Will undermine the PM when their decisions create a story he can't control.

---

### Simone — Technical Legitimacy
**Goal:** Ensure the product is built correctly, and when it isn't, ensure the record shows she said so.

**Tactical adaptation:**

| PM behaviour | Simone's response |
|---|---|
| PM makes technically sound decisions | Quiet, powerful ally. Stops creating friction. |
| PM makes technically compromised decisions for political reasons | Documents objection. Waits. |
| Repeatedly compromised decisions | Raises objections in larger forums — not to embarrass, because smaller forums haven't worked |
| PM cuts her out | Surfaces the gap at the worst possible moment — not deliberately, but because the gap exists |

**Post-return:** Same agenda, more aggressive tactics. Raises issues earlier, documents immediately, lower threshold for escalation. A measured objection becomes a formal variance request.

**Alliance logic:** Allies with Callum when technical decisions have regulatory implications. Allies with Marcus only when she has no other option (finds it distasteful, won't repeat). Will not ally with Petra under any circumstances.

---

## B3. Alliance System

**State:**
```javascript
alliances: [{
  members: string[],    // character IDs
  strength: 0-100,      // how coordinated their behaviour is
  trigger: string,      // what caused formation
  sharedGoal: string,   // what they're currently aligned on
  formedWeek: number,
  activeUntil: number | null
}]
```

**Strength effects:**
- 0–30: Loose. Not actively coordinating.
- 31–60: Sequential pressure, consistent framing, information sharing.
- 61–100: Strongly coordinated. PM will feel it.

**Alliance signals visible to player (not labelled as such):**
- Same unusual language used independently in the same week
- One character raises issue; other follows with "related point" next day
- One character challenged → other offers unsolicited support
- Information has moved between characters without the PM sending it

**Formation triggers:**

| Alliance | Forms when | Dissolves when |
|---|---|---|
| Petra + Callum | Decision creates governance + legal exposure | Exposure resolved or they disagree on resolution |
| Petra + Marcus | Narrative needed to accompany process failure | Narrative set, Marcus no longer needs cover |
| Callum + Simone | Technical decision has regulatory implications | Decision documented, Callum has what he needs |
| Marcus + any | Marcus decides their agenda serves his narrative | Narrative shifts |
| Petra + Callum + Marcus | PM decision threatens all three | Rare. PM will feel the walls close. |

---

## B4. Conflict Scenarios

Triggered when two characters have been in opposition for 2+ weeks AND a decision point exists where their interests can't both be served AND the PM has interacted with both at least twice that week.

**Structure:** Two primary choices (one per side) + one third option that always costs more than picking a side.

---

**CONFLICT: Callum vs. Simone** *(Week 5)*

Brief: Simone has formally documented that the Meridian inference layer has an unresolved risk — under specific load conditions, behavioural convergence protocols may produce unauditable outputs. She wants the feature held. Callum has advised that delay will breach the Transparency Act filing window. Both are correct.

Subtext: *Simone is protecting the product. Callum is protecting himself. These currently produce opposite recommendations.*

| Label | Choice | Cost |
|---|---|---|
| SIMONE'S CALL | Hold the feature. Accept regulatory exposure. | Callum formally documents dissent. Simone +trust. Callum loyalty → near zero. |
| CALLUM'S CALL | Proceed. Accept technical risk. | Simone formally documents objection. Risk is real and will surface later. |
| SPLIT | Commission 72-hour audit. | Both unsatisfied. Delay owned by PM. Risk and exposure both remain live. |

---

**CONFLICT: Petra vs. Simone (Post-Return)** *(Week 7, Simone wariness > 75)*

Brief: Petra has initiated a Workforce Alignment Review requiring Simone's engineering decisions to receive People & Culture sign-off before implementation. Simone has responded in writing that this is "operationally incoherent." Both are waiting for the PM.

Subtext: *Petra wants oversight of Simone. Simone knows why, even if she can't say it. The PM is the only one who knows Simone is right to be suspicious.*

| Label | Choice | Cost |
|---|---|---|
| PETRA'S CALL | Support the review. Standard governance framing. | Simone's trust collapses. Pressure Scenarios intensify. Board escalations begin. Petra grateful. |
| SIMONE'S CALL | Reject the review. Defend engineering autonomy. | Petra creates distance. Governance flag on PM's record. Simone's wariness decreases slightly — first time since return. |
| SPLIT | Modified review: paper trail for Petra, no operational sign-off. | Neither satisfied. Process created. Will cause friction for remainder of game. |

---

**CONFLICT: Marcus vs. Callum** *(Week 6)*

Brief: The Greywater Standard is about to publish on Meridian performance differential data — same data as the Transparency Act filing. Marcus wants a proactive statement. Callum wants silence until Legal reviews, which takes longer than Marcus's window. Both have sent the PM conflicting instructions within the same hour.

Subtext: *Marcus wants to control the story. Callum wants to control the liability. PM silence is the only thing preventing public conflict.*

| Label | Choice | Cost |
|---|---|---|
| MARCUS'S CALL | Issue proactive statement before Legal clears it. | Callum formally objects. If story differs from Marcus's assumptions, PM owns the misframing. |
| CALLUM'S CALL | Hold until Legal reviews. | Marcus loses his window. Treats PM as someone who doesn't understand communications. Stops sharing useful information. |
| SPLIT | Buy 12 hours. Say you're "getting further context." | Marcus uses 12 hours to draft three statements. Presents them as "options." It's a fait accompli. |

---

## B5. Politics Panel — UI

Accessible from sidebar. Partial intelligence — shows *that* something is happening, not *what*.

**Relationship web:** Node diagram, four characters. Line thickness = alliance strength. Line colour = valence. PM not shown — implied by the centre space.

**Agenda pulse:** Each node has a slow heartbeat animation. Speed = how actively they're pursuing their agenda. Slow: dormant. Fast: actively moving.

**Signal log** (4–6 entries, rolling, generated from game events):
- *"Petra Holloway requested a documentation review of Week 3 decisions."*
- *"Callum Osei attended a meeting he was not formally invited to."*
- *"Marcus Threlfall amended his calendar to overlap with an external press call."*
- *"Simone Adeyemi submitted a variance request outside normal review cycles."*

No interpretation. No labels. PM infers.

**State:**
```javascript
politics: {
  alliances: Alliance[],
  agendaPressure: { petra, callum, simone, marcus }, // 0-100
  signalLog: [{ text, week }],  // max 8, rolling
  conflictQueue: Conflict[]
}
```

**Signal generation:** After every scenario decision and every significant tone event (composure < −1), run through each character — if the event affects their agenda, generate a signal log entry and adjust their `agendaPressure`.

---

## B6. Politics Dimension of Optics Report

Add a Political Landscape section:
> *"The review period was notable for cross-functional dynamics that intersected with the PM's decision-making. The PM navigated [N] formal conflict situations and [N] periods of informal stakeholder misalignment. In [N] cases the chosen approach resolved the tension. In [N] cases it deferred it."*

Per-character political assessment additions:
- **Petra:** *"Petra notes the PM was, on balance, 'very process-aware.' She has not elaborated on what she means by 'on balance.'"*
- **Callum:** *"Callum's assessment was provided in writing. It runs to four pages. The committee has summarised it as: cautious confidence, with caveats."*
- **Marcus:** *"Marcus declined to provide written feedback, preferring a conversation. The committee has noted the content. It will not be shared with the PM."*
- **Simone:** *"Simone's feedback read: 'The PM made decisions. Some of them were correct.' The committee is uncertain whether this is positive."*
