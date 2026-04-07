import { callClaude } from './proxy.js'

export async function generatePressureScenario(simone, week, recentDecisions) {
  const prompt = `Generate a pressure scenario for an Axiom Collective corporate game set in Greywater, 2041.

Context:
- Simone Adeyemi, VP of Engineering, has recently returned after a period away with no memory of it.
- She is suspicious of the PM (wariness: ${simone.emotion.wariness}/100, trust: ${simone.emotion.trust}/100).
- Current week: ${week}
- Recent PM decisions: ${recentDecisions.map(d => d.choiceLabel).join(', ') || 'none recorded'}

Requirements:
- Simone's concern must be plausible and technically grounded
- The timeline/scope she demands must be disproportionate — hard to refuse without looking obstructive
- Three choices: comply, push back formally, attempt conversation first
- Comply looks collaborative but creates a downstream problem the PM owns
- Push back formally causes Simone to escalate (Petra gets involved)
- Attempt conversation: if tone is poor, makes everything worse

Return JSON only:
{
  "id": "pressure_1",
  "title": "string",
  "tag": "PRESSURE",
  "from": "simone",
  "brief": "string (2-3 sentences, corporate voice)",
  "subtext": "string (italic — what's actually happening)",
  "choices": [
    {
      "label": "COMPLY",
      "text": "string",
      "effects": { "simone": { "wariness": -5 }, "petra": {} },
      "outcome": "string (1-2 sentences)"
    },
    {
      "label": "PUSH BACK",
      "text": "string",
      "effects": { "simone": { "wariness": 8 }, "petra": { "wariness": 5 } },
      "outcome": "string"
    },
    {
      "label": "TALK FIRST",
      "text": "string",
      "effects": { "simone": { "wariness": -2 } },
      "outcome": "string"
    }
  ]
}`

  const raw = await callClaude({
    system: 'You are a game designer. Return only valid JSON. No other text.',
    messages: [{ role: 'user', content: prompt }],
    model: 'claude-sonnet-4-6',
    max_tokens: 800,
  })

  try {
    const jsonMatch = raw.match(/\{[\s\S]*\}/)
    const scenario = JSON.parse(jsonMatch?.[0] || '{}')
    // Add reaction labels (generic for pressure scenarios)
    scenario.choices = scenario.choices?.map(c => ({
      ...c,
      reactionLabels: {
        simone: { label: c.label === 'COMPLY' ? 'NOTED' : c.label === 'PUSH BACK' ? 'ESCALATING' : 'CAUTIOUS', delta: '' },
        petra:  { label: 'WATCHING', delta: '' },
        callum: { label: 'UNMOVED', delta: '' },
        marcus: { label: 'UNMOVED', delta: '' },
      },
    }))
    return scenario
  } catch {
    return null
  }
}
