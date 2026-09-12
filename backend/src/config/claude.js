import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';
dotenv.config();

let anthropicClient = null;

if (process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY.trim() !== '' && process.env.ANTHROPIC_API_KEY !== 'your_anthropic_api_key_here') {
  anthropicClient = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
  });
  console.log('✅ Anthropic Claude API client initialized');
} else {
  console.log('ℹ️ ANTHROPIC_API_KEY not set. Using intelligent heuristic triage engine as fallback.');
}

export default anthropicClient;
