import { callClaude } from './proxy.js'
import { buildSystemPrompt } from './buildSystemPrompt.js'

export async function characterReply(character, playerMessage, week) {
  const system = buildSystemPrompt(character, week)

  // Last 4 exchanges as messages array
  const messages = [
    ...character.chatHistory.slice(-8).map(m => ({
      role: m.role,
      content: m.content,
    })),
    { role: 'user', content: playerMessage },
  ]

  return callClaude({
    system,
    messages,
    model: 'claude-sonnet-4-6',
    max_tokens: 300,
  })
}
