const PROXY = 'http://localhost:3001/api/chat'

export async function callClaude({ system, messages, model = 'claude-sonnet-4-6', max_tokens = 1024 }) {
  const res = await fetch(PROXY, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ system, messages, model, max_tokens }),
  })
  if (!res.ok) throw new Error(`Proxy error ${res.status}`)
  const data = await res.json()
  return data.content
}
