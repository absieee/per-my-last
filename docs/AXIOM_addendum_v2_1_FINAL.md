# AXIOM — Addendum v2.1: The Persistence Mechanic
**Read after main spec v2.0. Implements the Shadow of Mordor-inspired return system.**

---

## A1. Overview

PM decisions can "transition out" characters. When they return, they are not the same.

- **Human characters (Petra, Callum, Marcus):** replaced by a successor who has read the file.
- **Simone:** never left. The PM is told they misremembered.

---

## A2. Human Character Transitions

**Triggers:** A scenario decision that directly removes the character, OR trust below 10 for two consecutive weeks.

**On transition:**
Sidebar notification: *"[Name] has moved on to an exciting new opportunity. Their responsibilities have been assumed by [Name], effective immediately."*

**Successor baseline:**

| Transition cause | Wariness start | Loyalty start |
|---|---|---|
| Scenario decision (direct) | 65 | 10 |
| Relationship collapse | 55 | 15 |
| Both combined | 80 | 5 |

**Successor pre-loaded memory entries:**
- Petra successor: *"I've reviewed the personnel files from the recent transition period. There's some complexity in the stakeholder history I'm still working through."*
- Callum successor: *"I understand there have been some interesting dynamics on Project Meridian. I'd like to understand the full picture before forming a view."*
- Marcus successor: *"I've been briefed by Marcus on the project context. He had a lot to say. I found some of it quite useful."* (Marcus always briefs his successor. The PM doesn't know what he said.)

Successors never mention their predecessor directly. If the PM references the prior relationship, they respond carefully — signalling they know more than they're saying.

---

## A3. Simone's Return — "The Misremembering"

**Triggers:**
1. ESCALATE decision in Scenario 4 (PM refers her to HR)
2. A later scenario routes product accountability onto Simone for a failed feature
3. Trust below 10 + a scenario gives Petra grounds to act

**The return:**
2–3 interactions after her removal, Simone reappears without explanation — at her desk, doing her job.

If the PM asks what happened:
- **Simone:** *"I don't know what you're referring to. I've been here."*
- **Petra:** *"Simone hasn't gone anywhere. I think you might be mixing things up — it's been a busy few weeks."*
- **Callum:** *"I'm not sure what gave you that impression."*
- **Marcus:** Says nothing. His wariness increases. He knows.

**Emotion override on return:**
```javascript
{
  trust: Math.max(5, priorTrust - 40),
  respect: unchanged,           // she still respects competence
  wariness: Math.min(95, priorWariness + 40),
  loyalty: Math.max(5, priorLoyalty - 35),
  memoryWipe: true,             // episodic memory cleared
  emotionalResidueActive: true  // activates post-return prompt block
}
```

**Post-return system prompt block (append to Simone's prompt):**
```
POST-RETURN LAYER — do not disclose:
You have no memory of the past [N] weeks. You are not distressed — you don't know it happened. What you have is residue: a generalised caution toward this PM you cannot source. You find yourself wanting more documentation, more confirmation than usual. You notice this. You cannot explain it.

If asked why you seem different: don't accept the premise. Say something true — that you've been careful lately and you trust that instinct even without knowing where it comes from.

If the PM references something that happened between you: you have no record of it. Say so plainly. No apology. No explanation.

Never suggest you were "wiped" or "restored." You experience your continuity as unbroken. The gap is simply not there.
```

---

## A4. The Hostile Escalation Loop

When Simone's post-return wariness exceeds 70, she generates **Pressure Scenarios** — dynamic scenarios not in the original queue.

**Pressure Scenario characteristics:**
- Her concern is plausible but her timeline/scope is disproportionate
- Hard to refuse without looking obstructive
- Three choices: comply, push back formally, attempt conversation first

**Choice asymmetry:**

| Choice | Looks like | Costs |
|---|---|---|
| Comply | Responsive, collaborative | Rushed decision creates downstream problem. PM owns it. |
| Push back formally | Decisive | Simone escalates. Petra gets involved. Now managing conflict, not roadmap. |
| Attempt conversation | Thoughtful | If tone-evaluated poorly, makes everything worse. |

**Pressure Scenario generation call:**
```
Model: claude-sonnet-4-20250514
Return JSON: { title, tag: "PRESSURE", brief, subtext, choices: [{ label, text, effects, outcome }] }

Context supplied: setting, Simone's wariness/trust scores, current week, recent decisions.

Requirements: concern plausible, timeline impossible, hard to refuse, three-choice structure.
```

---

## A5. State Changes

```javascript
// On any transition
character.transitioned = true
character.transitionedWeek = week
character.transitionCause = "scenario_decision" | "relationship_collapse" | "both"
character.emotionalStateAtTransition = { ...emotion }

// On Simone's return
character.transitioned = false
character.hasReturned = true
character.emotion = { /* override values above */ }
character.memory.episodic = []   // wiped
character.fragments.push({ id: "emotional_residue", position: "after_cognitive_state", content: "..." })
```

---

## A6. Optics Report Addition

If any character was transitioned, add:
> *"The review period included workforce transitions with relevance to the PM's stakeholder portfolio. The committee considered both the immediate decision context and the longer-term relational pattern that preceded it."*

If Simone specifically was transitioned and returned, add:
> *"The committee notes the PM and Simone Adeyemi appear to have experienced a period of recalibration. Simone has not raised concerns directly. The committee does not consider this a closed matter."*

Final line unchanged: *"Project Meridian continues. The PM role remains open for the next performance cycle."*
