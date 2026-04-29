import express from 'express'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { GoogleGenerativeAI } from '@google/generative-ai'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const app = express()
app.use(cors())
app.use(express.json())

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

// Map our internal model names to Gemini equivalents
const MODEL_MAP = {
  'claude-sonnet-4-6':        'gemini-2.0-flash',
  'claude-haiku-4-5-20251001': 'gemini-2.0-flash-lite',
}

function toGeminiMessages(messages) {
  return messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }))
}

async function callWithRetry(fn, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn()
    } catch (err) {
      const is429 = err?.status === 429 || err?.message?.includes('429')
      if (is429 && i < retries - 1) {
        const delay = (i + 1) * 8000 // 8s, 16s
        console.log(`Rate limited. Retrying in ${delay / 1000}s...`)
        await new Promise(r => setTimeout(r, delay))
      } else {
        throw err
      }
    }
  }
}

app.post('/api/chat', async (req, res) => {
  const { system, messages, model, max_tokens } = req.body
  const geminiModel = MODEL_MAP[model] || 'gemini-2.0-flash'

  try {
    const text = await callWithRetry(async () => {
      const generativeModel = genAI.getGenerativeModel({
        model: geminiModel,
        systemInstruction: system,
        generationConfig: { maxOutputTokens: max_tokens || 1024 },
      })
      const history = toGeminiMessages(messages.slice(0, -1))
      const lastMessage = messages[messages.length - 1]
      const chat = generativeModel.startChat({ history })
      const result = await chat.sendMessage(lastMessage.content)
      return result.response.text()
    })

    res.json({ content: text })
  } catch (err) {
    console.error(err)
    const status = err?.status === 429 ? 429 : 500
    res.status(status).json({ error: err.message })
  }
})

// ─── Dialogue sync: HTML editor → dialogues.js ──────────────────────────────

const DIALOGUES_PATH = path.resolve(__dirname, 'src/data/dialogues.js')

function findDialogueBlock(src, id) {
  const idx = src.search(new RegExp(`id:\\s*['"]${id}['"]`))
  if (idx === -1) return null
  const start = src.lastIndexOf('\n  {\n', idx)
  if (start === -1) return null
  const nextBlock = src.indexOf('\n  {\n', idx)
  const arrayEnd = src.indexOf('\n]\n', idx)
  let end = src.length
  if (nextBlock !== -1 && (arrayEnd === -1 || nextBlock < arrayEnd)) end = nextBlock
  else if (arrayEnd !== -1) end = arrayEnd
  return { start, end }
}

function replaceInBlock(block, oldVal, newVal) {
  if (oldVal === newVal || !oldVal) return block
  // Try double-quoted form first, then single-quoted
  const dqOld = JSON.stringify(oldVal)
  const dqNew = JSON.stringify(newVal)
  if (block.includes(dqOld)) return block.replace(dqOld, dqNew)
  const sqOld = `'${oldVal.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`
  const sqNew = `'${newVal.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`
  if (block.includes(sqOld)) return block.replace(sqOld, sqNew)
  return block
}

app.post('/api/sync-dialogues', (req, res) => {
  const { dialogues } = req.body || {}
  if (!Array.isArray(dialogues) || dialogues.length === 0) {
    return res.json({ ok: true, patched: 0 })
  }
  try {
    let src = fs.readFileSync(DIALOGUES_PATH, 'utf8')
    let patched = 0
    for (const d of dialogues) {
      const bounds = findDialogueBlock(src, d.id)
      if (!bounds) { console.warn(`sync: dialogue '${d.id}' not found`); continue }
      let block = src.slice(bounds.start, bounds.end)
      const { old: oldEx, new: newEx } = d
      // Beats
      if (oldEx?.beats && newEx?.beats) {
        for (let i = 0; i < newEx.beats.length; i++) {
          block = replaceInBlock(block, oldEx.beats[i], newEx.beats[i])
        }
      }
      // Responses: subtext + reply variants
      if (oldEx?.responses && newEx?.responses) {
        for (let i = 0; i < newEx.responses.length; i++) {
          const o = oldEx.responses[i]; const n = newEx.responses[i]
          if (!o || !n) continue
          block = replaceInBlock(block, o.subtext, n.subtext)
          for (const k of ['default', 'highWariness', 'lowTrust']) {
            if (o.reply?.[k] !== undefined) block = replaceInBlock(block, o.reply[k], n.reply?.[k])
          }
        }
      }
      // MiniGame replies
      if (oldEx?.replies && newEx?.replies) {
        for (const k of Object.keys(newEx.replies)) {
          block = replaceInBlock(block, oldEx.replies[k], newEx.replies[k])
        }
      }
      src = src.slice(0, bounds.start) + block + src.slice(bounds.end)
      patched++
    }
    fs.writeFileSync(DIALOGUES_PATH, src)
    console.log(`sync-dialogues: patched ${patched} dialogue(s)`)
    res.json({ ok: true, patched })
  } catch (err) {
    console.error('sync-dialogues error:', err)
    res.status(500).json({ ok: false, error: err.message })
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Proxy running on :${PORT} (Gemini)`))
