import express from 'express'
import cors from 'cors'
import { GoogleGenerativeAI } from '@google/generative-ai'

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

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Proxy running on :${PORT} (Gemini)`))
