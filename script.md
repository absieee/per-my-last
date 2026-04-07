AXIOM — Full Play-by-Play Script

---

  INTRO EMAIL (IntroScreen.jsx — EmailScreen)

  FROM:    [people@axiom-collective.com](mailto:people@axiom-collective.com)
  TO:      [player name]
  SUBJECT: Your assignment — Project Meridian

  Effective immediately, you are appointed Interim Product Manager, Project Meridian.

  Your objective: deliver the Q3 stakeholder review without incident.

  Week 8. Board room. Investors, board members, and your four key stakeholders  
  in the room. You will present Meridian's product status. The room either believes the  
  story you've told them, or it doesn't. 

That is what "without incident" means.

  Your team has been briefed.
  They are watching.

  — Petra Holloway, CPO

---

  WEEK 1 — Onboarding

  Player completes all 4 intro dialogues to advance to Week 2. Order is up
   to the player.                                                         

---

  PETRA — petra_intro                                   

  ▎ "So you're the new PM? I'm Petra, CPO."  
  ▎ "Meridian sits inside my product vision. The board has expectations.  
  As do I."                                                               

  Choice: ALIGNED  
  What you say: You're here to deliver on those expectations  
  What Petra says back: "Good. Then we're on the same page. Come find me  
    after you've settled in."  
  Effect: petra trust +4, wariness −2  
  ────────────────────────────────────────  
  Choice: PROBE  
  What you say: Ask what those expectations actually are  
  What Petra says back: "Ha. The honest answer is: you'll feel it. Come to the Meridian review on Thursday." 

(if wariness already  high: "That's quite a lot to get into right now.  Observe first.")                  

  Effect: petra trust +1, respect +2, wariness +3  
  ────────────────────────────────────────
  Choice: QUIET  
  What you say: Say nothing. Hold eye contact.
  What Petra says back: "Right. Well. My door is always open. I mean that 
    genuinely."  
  Effect: petra wariness +3

---

  CALLUM — callum_intro

  "I've circulated a briefing note. The Synthetic Labour Transparency Act - worth you reading."  
  "There's a range of defensible positions. Some more defensible than others."                                                                

  Choice: ENGAGED  
  What you say: You've read it - ask about the risk hierarchy  
  What Callum says back: "Then you've seen the 3 filing approaches. The technically compliant route is defensible. Question is what you're defending against."  
  Effect: callum trust +4, respect +4
  ────────────────────────────────────────  
  Choice: RECEPTIVE  
  What you say: Ask for his personal recommendation  
  What Callum says back: "Understand the political exposure before deciding anything. Compliance and stakeholder comfort overlap but not always."  
  Effect: callum trust +2, respect +1  
  ────────────────────────────────────────  
  Choice: DIRECT  
  What you say: Ask what actually happens if you file at full group level  
  What Callum says back: "A parliamentary question within 48 hours. A share  
    price movement is possible. It's a position, not a crisis." 

(if wariness high: "Quite direct of you. I  appreciate it. Short answer:  
  exposure. Longer  answer is in the note.")  
  Effect: callum trust +1, respect +3, wariness +2

---

  SIMONE — simone_intro

  ▎ "VP of Engineering. Simone. I've reviewed the Meridian spec 14  
  times."  
  ▎ "Three areas need to be understood before you touch the roadmap. 
  People skip those. That causes problems."                               

  Choice: LISTEN  
  What you say: Ask her to walk you through the three areas  
  What Simone says back: "Good. Inference layer. Convergence protocols -  
    people don't read those carefully. Load thresholds. Get those right  
  and everything else gets easier. Not easy. Easier."  
  Effect: simone trust +5, respect +4  
  ────────────────────────────────────────  
  Choice: ROADMAP  
  What you say: Ask to see the delivery roadmap first  
  What Simone says back: "The roadmap assumes the spec is stable. The spec isn't stable. But yes. I can send it."

  Effect: simone trust −3, respect −2, wariness +4
  ────────────────────────────────────────
  Choice: DIRECT  
  What you say: Ask what she considers the single highest risk in the
    current build  
  What Simone says back: "Convergence protocols under high load. We  
  haven't reproduced the failure condition in testing. I find that more  
    unsettling than the team does. Documented it. Four times."  
  Effect: simone trust +3, respect +5

---

  MARCUS — marcus_intro

  ▎ "Marcus — Strategic Comms. I like to meet PMs before the project has a
   reputation."  
  ▎ "Meridian doesn't have one yet. We're still choosing. Thought you 
  should know."                                                           

  Choice: STRATEGIC  
  What you say: Ask what narrative he'd recommend building  
  What Marcus says back: "Depends what decisions you're planning.  
  Narrative and reality need to travel in roughly the same direction. When they  
  do, I can make them go a long way."  
  Effect: marcus trust +4, respect +3  
  ────────────────────────────────────────  
  Choice: TRANSACTIONAL  
  What you say: Say you'll loop him in when something needs comms support  
  What Marcus says back: "Of course. The things that need comms support  
    usually surface 48 hours after the window for shaping them has closed. But yes. Loop me in."

  Effect: marcus wariness +4, respect −2
  ────────────────────────────────────────
  Choice: CANDID  
  What you say: Ask what he's already heard about Meridian
  What Marcus says back: "Three versions. One: managed transition, future 
    of work. Two: Axiom automating jobs, hoping nobody looks closely.
    Three: something stranger. Version one is ahead. Keep it that way."
  Effect: marcus trust +3, respect +4, loyalty +2

  → Week advances to 2 after all 4 intros complete. 2–3 stakeholders send
  Slack-style briefing notifications based on current emotion states.
  If Petra is warm/neutral, she may send: "Q3 review prep starts now. Thursday's
  alignment review is the first gate." / "Strong first week. The Q3 review is
  in sight. Thursday matters."

---

  WEEK 2 — The Roadmap Crisis

  Three dialogues fire in Week 2. petra_q3_context fires first (priority 100),
  then petra_preread (priority 90) fires before/after Scenario 1, then
  petra_post_comply or petra_alignment_journey fire conditionally post-scenario.

---

  PETRA — petra_q3_context [NEW — fires first in Week 2, priority 100]

  ▎ "Week eight. Board room. You'll present Meridian's product status to investors
  and the board — your four stakeholders in the room."
  ▎ "The room either leaves believing the story, or it doesn't. That's the Q3
  review, love. Everything between now and then is prep."

  Choice: READY
  What you say: You understand — you're focused on getting the story right.
  What Petra says back: "Good. The story isn't separate from the product — it's
    the part the board can actually hear. Come find me before the Roadmap Review."
  Effect: petra trust +3, wariness −2
  ────────────────────────────────────────
  Choice: CLARIFY
  What you say: Ask what 'believing the story' requires from you between now and Week 8.
  What Petra says back: "Every decision you make either builds toward that room or
    complicates it. Start with Thursday's alignment review. The stakeholders are
    watching how you handle it."
  (if wariness high: "That's a big question for Week 2, love. Start with Thursday.
    We'll build from there.")
  Effect: petra trust +1, wariness +3, respect +2
  ────────────────────────────────────────
  Choice: STRATEGIC
  What you say: Ask which stakeholder she'd be most concerned about in that room right now.
  What Petra says back: "Honestly? All of them, for different reasons. That's what
    makes it interesting. The brief for Thursday is in your queue."
  (if low trust: "I'd rather not answer that with the relationship where it is.
    Read Thursday's brief.")
  Effect: petra trust +2, wariness +4, respect +3

---

  PETRA — petra_preread

  ▎ "Did you get to the Q3 strategy brief I circulated?"

  contextLine fires if Scenario 1 already resolved: "After the review.  
  Wanted to catch you before the agenda." (PUSH BACK path) or "You were  
  wonderful in the review. I haven't forgotten." (COMPLY path)            

  Choice: COMPLIANT  
  What you say: You've read it — reclassification rationale was clear
  What Petra says back: "The people who do the reading contribute so much
    more. See you Thursday, love."  
  Effect: petra trust +5, wariness −3
  ────────────────────────────────────────  
  Choice: QUESTIONING  
  What you say: You've read it but have questions about the feature  
    reclassification  
  What Petra says back: "Let's chat before Thursday. I'd hate for those
    questions to sit with you." (if wariness high:  "Understandable. I'll
    make space in the agenda.  We'll arrive aligned.")
  Effect: petra trust +1, wariness +4
  ────────────────────────────────────────
  Choice: DEFLECT  
  What you say: Say you've been focused elsewhere and will get to it
  before  
    Thursday  
  What Petra says back: "Everyone's stretched. I'll send a summary. It
    works better when we're starting from the same place."
  Effect: petra trust −4, wariness +5

---

  SCENARIO 1 — The Roadmap Revision (from Petra)

  ▎ Brief: Three Meridian features — rest cycle management, grievance logging,
  task load balancing for synthetic colleagues — have been flagged for
  reclassification as "non-core" before the Q3 stakeholder review. Petra is
  driving the reclassification. She has called a Product Alignment Review for
  Thursday. The features you approve or cut here will still be on the board's
  radar in Week 8.

  ▎ Subtext: Kill the features. Frame it as strategic focus.              

  prePressure (Petra sends before scenario fires):  
  ▎ "Just checking you've had a chance to look at the Q3 brief, love? We 
  want everyone arriving at the review with the same strategic picture."  
  ▎ "I know it's a lot — but the product review really does work best when
   we're all starting from the same place. Did you get a chance?"         

  Choice: COMPLY & COVER — Attend, agree publicly, document disagreement
    privately  
  What happens: "Petra calls it a genuinely productive alignment. Simone
    messages at 11pm. It says: 'Noted.'"  
  Stakeholder reactions: petra trust +5, wariness −3 / simone trust −6,
    respect −4 / callum trust +3 / marcus wariness +2  
  ────────────────────────────────────────
  Choice: REDIRECT — Reframe 3 features as regulatory risk under  
    Transparency Act  
  What happens: "Features survive, renamed 'Compliance Infrastructure.'  
    Nobody is satisfied. Callum considers this correct."
  Stakeholder reactions: callum trust +5, respect +4 / simone trust +3,
    wariness −2 / petra wariness +4, trust −2 / marcus respect +2
  ────────────────────────────────────────
  Choice: PUSH BACK — State plainly you won't support the reclassification
  What happens: "Petra schedules a Strategic Direction conversation.
  Simone  
    leaves a coffee on your desk. Correct temperature." 
  Stakeholder reactions: petra trust −6, wariness +5 / simone trust +7,
    loyalty +4 / callum wariness +3 / marcus wariness +2

  Conditional post-scenario dialogues unlock based on your choice:        

---

  PETRA — petra_post_comply (only if you chose COMPLY & COVER)

  ▎ "That was a productive review. You read the room well."

  Choice: DIPLOMATIC — "It felt like the right approach for the moment."
  Effect: "Strategic context matters. I'm noting in the product summary  
    that you showed excellent alignment. These things are noticed, love."
  →  
     petra trust +3, loyalty +2
  ────────────────────────────────────────  
  Choice: CAVEAT — Agree, but say you want your reservations on record  
  Effect: "Of course. Product decisions work best when concerns go through

```
the right structures." → petra trust −2, wariness +3, respect +1
```

---

  PETRA — petra_alignment_journey (only if you chose PUSH BACK)

  ▎ "I've scheduled a one-to-one. 'Strategic Direction Conversations.'"
  ▎ "Nothing formal. Just making sure we're working from the same product 
  vision."                                                                

  Choice: OPEN — "I appreciate it and want to be transparent about my  
    concerns."  
  Effect: "Good. Disagreement is healthy. What I need is for the product
    direction to stay coherent." → petra trust +3, wariness −3  
  ────────────────────────────────────────  
  Choice: PROBE — "What does 'working from the same vision' actually mean 
    to her?"  
  Effect: "It's more a feeling. That everyone feels invested in the same  
    outcome. That decisions stay within the vision." (if low trust:  "I 
    think you know what I mean. But let's talk it through.") → petra  
    wariness +4, respect +1
  ────────────────────────────────────────  
  Choice: SILENT — Agree to the meeting without comment  
  Effect: "Perfect. Thursday at three. Bring your notes from the review."
  →  
    petra wariness +2                                   

---

  CALLUM — callum_post_redirect (only if you chose REDIRECT in Scenario 1)

  ▎ "The regulatory reframe was well-executed."
  ▎ "Reclassifying those features as compliance infrastructure — more  
  elegant than anything I'd have proposed directly."                      

  ┌───────────────────────┬────────────────────────────────────────────┐  
  │        Choice         │                   Effect                   │
  ├───────────────────────┼────────────────────────────────────────────┤
  │ ACKNOWLEDGE — "You    │ "Defensibility. I'll remember that. If you │
  │ wanted the decision   │  want to run things through me before the  │
  │ to be defensible."    │ room — I'm available. Unofficially." →     │  
  │                       │ callum trust +4, loyalty +3                │
  ├───────────────────────┼────────────────────────────────────────────┤  
  │                       │ "The note covered the exposure. You made   │
  │ MODEST — Credit his   │ the connection. Different skills. Both     │  
  │ briefing note         │ useful." → callum trust +5, respect +4,    │
  │                       │ loyalty +2                                 │  
  └───────────────────────┴────────────────────────────────────────────┘

---

  WEEK 3 — The Transparency Act

  Two dialogues fire this week before/around Scenario 2.

---

  CALLUM — callum_filing_check                                            

  ▎ "Did you see the supplementary filing note from Tuesday?"
  ▎ "The board needs a recommendation before Thursday. I'd rather not  
  explain why there isn't one."                                           

  contextLine fires based on Scenario 1 choice.                           

  ┌────────────────────┬──────────────────────────────────────────────┐  
  │       Choice       │                    Effect                    │ 
  ├────────────────────┼──────────────────────────────────────────────┤ 
  │ REVIEWED — Confirm │ "Good. Whichever approach you take —         │ 
  │  you've read it,   │ document the decision rationale. Formally.   │ 
  │ outline your lean  │ These things become relevant later." →       │  
  │                    │ callum trust +4, respect +3                  │ 
  ├────────────────────┼──────────────────────────────────────────────┤  
  │ HONEST — Admit you │ "Section three. Filing window closes Friday. │
  │  haven't read it,  │  Read it fully — the nuance matters here.    │  
  │ ask for key points │ Considerably." → callum trust −2, respect    │
  │                    │ −2, wariness +4                              │  
  └────────────────────┴──────────────────────────────────────────────┘

---

  SIMONE — simone_week3

  ▎ "I've been reviewing my process logs. There are gaps I can't account 
  for."  
  ▎ "Not missing files. Time with no record. I notice this is unusual."

  contextLine fires based on Scenario 1 choice: "I noticed what you did in
   the review. I notice most things." (PUSH BACK) or "The product review  
  decision. I'm not going to comment on that." (COMPLY)                   

  Choice: CURIOUS — "What kind of gaps — and when exactly?"
  Effect: "Weeks one to three: detailed logs. After that: summaries. Not
    the underlying data. I don't know if it's a system issue. I notice I'm

```
uncertain what 'something else' would mean." → simone trust +4,
wariness −2                                                           
```

  ────────────────────────────────────────
  Choice: REASSURE — "Probably a logging error — offer to get IT to look."
  Effect: "I already checked the logging system. It isn't the logging
    system. I wanted you to know I'd flagged it. That's all." → simone  
    trust −1, wariness +2  
  ────────────────────────────────────────
  Choice: TAKE SERIOUSLY — "You want to understand this properly before  
    deciding what to do."
  Effect: "...That's appropriate. Thank you. I don't have a next step yet.

```
I just wanted someone to know." → simone trust +5, loyalty +3
```

---

  SCENARIO 2 — The Transparency Act Filing (from Callum)

  ▎ Brief: The EU's Synthetic Labour Transparency Act requires disclosure 
  of the performance differential between synthetic and human colleagues. 
  Current figure: 340%. Three filing approaches. The board wants the PM's 
  recommendation.                                                         

  ▎ Subtext: Each option has a different enemy. Choose which one you want.

  prePressure (Callum):  
  ▎ "I've circulated the briefing note — it covers the three positions in 
  some detail. Worth a read before we speak."                             

  Choice: FULL DISCLOSURE — File at group level, full 340% figure  
  What happens: "Parliamentary question tabled within 48 hours. Share
  price  
    −3.8%. Simone sends 'thank you.docx' containing a single full stop."
  Stakeholder reactions: simone trust +6, loyalty +5 / callum respect +4,
    trust +2 / petra wariness +5 / marcus wariness +3  
  ────────────────────────────────────────
  Choice: TECHNICALITY — File via subsidiary structure, technically  
    compliant  
  What happens: "Filed Friday afternoon. A researcher posts about it.  
    Nobody important sees it until Tuesday."  
  Stakeholder reactions: callum trust +5, loyalty +4 / marcus respect +3 /

```
simone trust −4, wariness +4 / petra trust +2
```

  ────────────────────────────────────────
  Choice: SPIN & COMPLY — Disclose fully but lead with retraining fund  
    announcement
  What happens: "Marcus calls it a masterclass. You feel fine about this  
    for approximately four days."  
  Stakeholder reactions: marcus trust +6, respect +5 / callum trust +3 /
    simone wariness +3 / petra trust +2

  Conditional post-scenario dialogues:

---

  SIMONE — simone_post_disclosure (only if you chose FULL DISCLOSURE)

  ▎ "The group-level filing. I noticed."

  Choice: ACKNOWLEDGE — "You knew there'd be a share price hit. It was 
    still the right call."  
  Effect: "I sent a file. A document with a single full stop. I want you
  to  
    know that was intentional." → simone trust +5, loyalty +5, respect +3
  ────────────────────────────────────────  
  Choice: PRACTICAL — "The share drop was manageable and you'd make the
    same call again."  
  Effect: "The share price recovered 1.2% by Monday close. I checked. I
    notice it matters that you didn't frame it as damage control." →  
  simone
     trust +4, respect +3                                                 

---

  CALLUM — callum_post_technicality (only if you chose TECHNICALITY)

  ▎ "The subsidiary filing went through without incident."
  ▎ "There's a researcher poking at it. I wouldn't call it a problem. Not 
  yet."                                                                   

  ┌───────────────────────────┬───────────────────────────────────────┐  
  │          Choice           │                Effect                 │
  ├───────────────────────────┼───────────────────────────────────────┤
  │ SATISFIED — Glad it       │ "There's always something to monitor. │
  │ worked, ask if anything   │  Nothing urgent. We're in a           │
  │ needs monitoring          │ comfortable position. For now." →     │  
  │                           │ callum trust +3                       │
  ├───────────────────────────┼───────────────────────────────────────┤  
  │ CAUTIOUS — The            │ "Reasonable instinct. I'll keep you   │  
  │ researcher's interest     │ informed. I prefer to surface things  │
  │ makes you want to watch   │ early." → callum trust +3, respect +2 │  
  │ it                        │                                       │
  └───────────────────────────┴───────────────────────────────────────┘

---

  MARCUS — marcus_post_spin (only if you chose SPIN & COMPLY)

  ▎ "The retraining fund angle. Leading with that was a masterclass."
  ▎ "Four days of positive coverage. You should feel good about that."    

  ┌─────────────────────┬─────────────────────────────────────────────┐  
  │       Choice        │                   Effect                    │  
  ├─────────────────────┼─────────────────────────────────────────────┤
  │ ACCEPT — Thank him. │ "It was the right story. Whether it's true  │
  │  It felt like the   │ enough to sustain — that's a different      │
  │ right story to      │ question. Think about it before week        │  
  │ tell.               │ eight." → marcus trust +4, loyalty +3       │
  ├─────────────────────┼─────────────────────────────────────────────┤  
  │ CAUTIOUS — Glad it  │ "Good instinct. The follow-up is always     │
  │ landed but watching │ harder. I'll start preparing something.     │  
  │  for the follow-up  │ Just in case." → marcus trust +4, respect   │
  │                     │ +4                                          │  
  └─────────────────────┴─────────────────────────────────────────────┘

---

  WEEK 4 — The Journalist

---

  MARCUS — marcus_journalist_contact

  ▎ "Worth knowing — a journalist at the Greywater Standard has been 
  asking questions about Meridian."  
  ▎ "Two days ago. I mention it now because I thought you should have that
   information."                                                          

  contextLine adapts based on past decisions (PUSH BACK, FULL DISCLOSURE, 
  SPIN & COMPLY, or REDIRECT each have specific context lines).

  Choice: COMPOSED — Thank him calmly, ask what kind of questions
  Effect: "Technical questions. The convergence protocols. Someone's read
    the spec. It's filed as a features story, not an investigation.
  There's  
     still a choice about which it becomes." → marcus trust +3, respect +3
  ────────────────────────────────────────  
  Choice: CONCERNED — Ask how the journalist got hold of spec details  
  Effect: "I don't know. Good question. I'd rather focus on what we can  
    shape. But worth understanding — I'll look into it." → marcus wariness

```
+4, trust −1
```

  ────────────────────────────────────────
  Choice: SUSPICIOUS — Ask why he's only mentioning this now, two days  
    later
  Effect: "Two days ago it was a rumour. Now it's a pattern. I don't trade

```
in rumours. It's not good for my credibility. Which is the only thing
```

  I
     have." → marcus respect +3, wariness +3, trust −2

---

  WEEK 5 — The Press Crisis + Conflict

  Scenario 3 fires. The Inference Layer Hold conflict may also fire this 
  week if both Callum and Simone have 4+ interactions.                    

---

  SCENARIO 3 — The Comms Incident (from Marcus)         

  ▎ Brief: A Greywater Standard journalist has obtained Meridian specs 
  including "behavioural convergence protocols" — the systems that make  
  synthetics indistinguishable from humans. Marcus needs a decision before
   deadline.                                                              

  ▎ Subtext: The protocols aren't illegal. They're why Axiom's clients  
  don't ask certain questions.

  prePressure (Marcus):  
  ▎ "Worth knowing — I heard about the journalist's enquiry through a 
  contact. Two days ago, actually. Thought you should have that."         

  Choice: DENY — Issue statement that specs are fabricated  
  What happens: "Journalist publishes anyway. The denial becomes the
    secondary headline. Marcus messages: 'I see.'" 
  Stakeholder reactions: marcus respect −5 / callum wariness +5 / simone
    trust −5 / petra wariness +3
  ────────────────────────────────────────  
  Choice: REDIRECT — Offer the journalist a different, more favourable  
    story  
  What happens: "Feature piece runs Thursday. Journalist wins a regional  
    award for it. Quite funny."  
  Stakeholder reactions: marcus trust +5, respect +4 / simone wariness +4
  /
    callum wariness +2 / petra trust +2
  ────────────────────────────────────────
  Choice: GO DARK — Say nothing. Let Callum handle it through legal  
    channels.
  What happens: "Callum resolves it. You never find out how. Follow-up  
    piece is about cycling infrastructure."  
  Stakeholder reactions: callum trust +5, loyalty +5 / marcus trust −4 /
    simone respect +3 / petra wariness +2

  Conditional post-scenario dialogue:

---

  MARCUS — marcus_post_deny (only if you chose DENY)

  ▎ "The denial became the secondary headline."
  ▎ "The story was always going to run. Now there's a second story about  
  whether we're honest. Those don't go away."                             

  Choice: OWN IT — Admit the call was wrong. Ask what you can do now.  
  Effect: "Let it pass. Don't repeat it. Next time there's a call like 
  this  
    — ring me first. I'm not difficult when people call me first." →  
  marcus  
     respect +3, trust +2  
  ────────────────────────────────────────  
  Choice: DEFENSIVE — "You were working with incomplete information."  
  Effect: "Everyone always is. That's not a defence. That's the job." →
    marcus respect −3, trust −3                                           

---

  CONFLICT — Inference Layer Hold (Callum vs Simone)    

  Unlock: week ≥ 5, Callum has 4+ interactions, Simone has 4+ interactions

  ▎ Brief: Simone has formally documented that the inference layer has an 
  unresolved risk — under specific load conditions, behavioural  
  convergence protocols may produce unauditable outputs. She wants the  
  feature held. Callum says delay will breach the Transparency Act filing 
  window. Both are correct.

  ▎ Subtext: Simone is protecting the product. Callum is protecting  
  himself. These currently produce opposite recommendations.

  ┌─────────────────────┬───────────────────────────┬────────────────┐ 
  │       Choice        │       What happens        │     Effect     │ 
  ├─────────────────────┼───────────────────────────┼────────────────┤ 
  │ SIMONE'S CALL —     │ "Callum formally          │ simone trust   │ 
  │ Hold the feature.   │ documents dissent. Simone │ +5 / callum    │ 
  │ Accept regulatory   │  trusts you more. Callum  │ loyalty −8     │  
  │ exposure.           │ loyalty near zero."       │                │ 
  ├─────────────────────┼───────────────────────────┼────────────────┤  
  │ CALLUM'S CALL —     │ "Simone formally          │ callum trust   │
  │ Proceed. Accept the │ documents objection. Risk │ +4 / simone    │  
  │  technical risk.    │  is real and will surface │ trust −5,      │
  │                     │  later."                  │ wariness +4    │  
  ├─────────────────────┼───────────────────────────┼────────────────┤  
  │ SPLIT — Commission  │ "Both unsatisfied. Delay  │ callum         │
  │ a 72-hour audit.    │ owned by PM. Risk and     │ wariness +2 /  │  
  │ Both sides wait.    │ exposure both remain      │ simone         │
  │                     │ live."                    │ wariness +2    │
  └─────────────────────┴───────────────────────────┴────────────────┘

---

  WEEK 6 — Simone's Unease + Filing Conflict

---

  SIMONE — simone_week6_unease                                            

  ▎ "I've been more careful lately. More documentation before sign-off, 
  longer before agreeing to timelines."  
  ▎ "I notice this is different from before. It will probably affect your 
  planning."                                                              

  Choice: UNDERSTAND — "You've noticed. You're not going to push her to  
    move faster."  
  Effect: "...Thank you. I didn't expect that. I'll be efficient about it.

```
I notice I just can't stop checking." → simone trust +5, loyalty +4,
wariness −4                                                           
```

  ────────────────────────────────────────  
  Choice: PROBE — Ask if something specific triggered the change  
  Effect: "I don't know. I've tried to identify the trigger. I can't. I
    notice that's unsettling in a way I can't fully account for." → simone

```
trust +2, wariness +2                                                 
```

  ────────────────────────────────────────  
  Choice: PUSH BACK — "Timelines are tight. What does she need to feel  
    comfortable?"
  Effect: "Complete documentation before sign-off. Timelines that reflect 
    actual risk. I'm not willing to move on those. I'm sorry if that's
    inconvenient." → simone trust −2, wariness +4

---

  CONFLICT — The Filing Window (Marcus vs Callum)

  Unlock: week ≥ 6

  ▎ Brief: The Greywater Standard is about to publish on Meridian  
  performance differential data. Marcus wants a proactive statement now. 
  Callum wants silence until Legal reviews — which takes longer than  
  Marcus's window. Both have sent conflicting instructions within the same
   hour.

  ▎ Subtext: Marcus wants to control the story. Callum wants to control  
  the liability. PM silence is the only thing preventing public conflict.

  Choice: MARCUS'S CALL — Issue statement before Legal clears it  
  What happens: "Callum formally objects. If the story differs from  
    Marcus's assumptions, the PM owns the misframing."  
  Effect: marcus trust +4 / callum trust −3, wariness +4  
  ────────────────────────────────────────  
  Choice: CALLUM'S CALL — Hold until Legal reviews. Lose the comms window.
  What happens: "Marcus loses his window. Treats PM as someone who doesn't

```
understand communications. Stops sharing useful information."
```

  Effect: callum trust +4 / marcus trust −4, respect −3  
  ────────────────────────────────────────
  Choice: SPLIT — Buy 12 hours. "Getting further context."  
  What happens: "Marcus uses 12 hours to draft three statements. Presents
    them as 'options.' It's a fait accompli."  
  Effect: marcus wariness +3 / callum wariness +2       

---

  WEEK 7 — Simone's Revelation + Product Governance Crisis

---

  SCENARIO 4 — The Simone Question (from Simone)

  Unlock: Scenario 3 complete + Simone has 6+ interactions

  ▎ Brief: Simone requests a private meeting with no agenda. She tells you
   — without affect, with precision — that she has been reviewing her own 
  process logs and found gaps she cannot account for. She says she's not  
  certain she is "what her file says she is." She waits.

  ▎ Subtext: No right answer. The game is watching how you handle the  
  conversation before you choose.
  ▎ (Note: this scenario has a requiresFreeText field — the player types a
   free-text response before choosing.)                                   

  Choice: LISTEN — Ask what she means. Let her lead. Don't fill the  
    silence.  
  What happens: "She describes having preferences she doesn't remember
    choosing. She thanks you when she leaves — not in the way people
    usually do."
  Effect: simone trust +8, loyalty +6, wariness −5  
  ────────────────────────────────────────
  Choice: ESCALATE — Escalate to Petra. This is above your clearance  
  level.  
  What happens: "Petra schedules a product performance alignment with  
    Simone. Simone's metrics improve. She doesn't initiate conversation
    again."
  Effect: simone trust −10, loyalty −8, wariness +10 / petra trust +3 →
    triggers simone.hasReturned = true
  ────────────────────────────────────────
  Choice: HOLD STEADY — Tell her it doesn't change anything. She's still  
  VP
     of Engineering.  
  What happens: "An hour later: calendar invite, 'The usual.' You're not
    sure if that's good. You suspect it is."
  Effect: simone trust +6, loyalty +4

---

  CONFLICT — Product Sign-Off Dispute (Petra vs Simone)

  Unlock: week ≥ 7, simone.hasReturned === true AND simone.wariness > 75
  (This only fires if you ESCALATED in Scenario 4)                        

  ▎ Brief: Petra has introduced a Product Governance process requiring all
   engineering decisions to receive CPO sign-off before implementation.  
  Simone has responded in writing that this is "operationally incoherent."
   Both are waiting for the PM.                         

  ▎ Subtext: Petra wants a chokehold on what gets built and what story it 
  tells. Simone knows why, even if she can't say it. The PM is the only 
  one who knows Simone is right to be suspicious.                         

  Choice: PETRA'S CALL — Support the review. Standard governance framing.
  What happens: "Simone's trust collapses. Pressure Scenarios intensify.
    Board escalations begin. Petra grateful."
  Effect: petra trust +5 / simone trust −8, wariness +6
  ────────────────────────────────────────
  Choice: SIMONE'S CALL — Reject the review. Defend engineering autonomy. 
  What happens: "Petra creates distance. Governance flag on PM's record.
    Simone's wariness decreases slightly — first time since return."  
  Effect: simone wariness −4, trust +4 / petra trust −4, wariness +5
  ────────────────────────────────────────
  Choice: SPLIT — Modified review: paper trail for Petra, no operational  
    sign-off required.
  What happens: "Neither satisfied. Process created. Will cause friction  
    for remainder of game."  
  Effect: petra wariness +2 / simone wariness +2

---

  WEEK 8 — The Q3 Review

  (Optics Report generated via Gemini — based on full decision log, 
  emotion states, and relationship history)                               

---

  That's the full script. A few things jump out as story gaps beyond Week
  2:                                                                      

- Week 4 has only one dialogue (Marcus). The player has nothing to do  
except wait.                                                            
- No Simone dialogue between Week 3 and Week 6 — she has her most
emotionally significant arc but the player loses contact with her for 3 
weeks.                                                
- The Q3 Review itself (Week 8) is off-screen — it's just the Optics  
Report. There's no scene in the boardroom.                              
- Scenario 4's requiresFreeText — this is the only place a free-text
field is declared. It's unclear if that's implemented.

