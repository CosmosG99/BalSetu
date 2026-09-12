import dotenv from 'dotenv';
dotenv.config();

const groqApiKey = process.env.GROQ_API_KEY?.trim();
const groqModel = process.env.GROQ_MODEL || 'openai/gpt-oss-20b';

if (groqApiKey) {
  console.log(`[RAKSHAK] Groq AI triage configured (model: ${groqModel}, key: ${groqApiKey.slice(0, 8)}...${groqApiKey.slice(-4)})`);
} else {
  console.log('[RAKSHAK] GROQ_API_KEY not set. Using deterministic heuristic triage fallback.');
}

export async function createGroqCompletion(messages) {
  if (!groqApiKey) return null;
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${groqApiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: process.env.GROQ_MODEL || 'openai/gpt-oss-20b', temperature: 0.1, max_tokens: 700, messages })
  });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Groq request failed (${response.status}): ${detail.slice(0, 300)}`);
  }
  const body = await response.json();
  return body.choices?.[0]?.message?.content || null;
}
