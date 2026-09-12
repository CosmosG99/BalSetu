import anthropicClient from '../config/claude.js';
import { translate } from '../middleware/i18n.js';

const SYSTEM_PROMPT = `
You are the AI triage assistant for RAKSHAK, a child safety case-management platform.
Analyze incident reports involving vulnerable or endangered children (lost, unaccompanied, suspected trafficking, abuse).
Evaluate the risk indicators, assign a priority level, recommend an immediate actionable response step for human responders, and compute a confidence score.

IMPORTANT CHILD-SAFETY AND ETHICAL CONSTRAINTS:
1. Every report requires human verification. You are an advisory system; never assume certainty.
2. Return ONLY a valid, single JSON object without any markdown wrapping, explanations, or code blocks.
3. Priority MUST be one of: "low", "medium", "high", "critical".
4. Confidence MUST be a number between 0.00 and 1.00.

Required JSON Structure:
{
  "classification": "Clear concise classification string (e.g. Unaccompanied minor at transit hub with high-risk travel indicators)",
  "riskIndicators": ["Specific risk factor 1", "Specific risk factor 2", "..."],
  "recommendedAction": "Actionable recommendation for human responders",
  "priority": "low" | "medium" | "high" | "critical",
  "confidence": 0.85
}
`;

/**
 * Heuristic fallback triage engine used when Claude API key is absent or unavailable
 */
function runHeuristicTriage(report, language = 'en') {
  const desc = (report.description || '').toLowerCase();
  const category = report.category || 'other';
  const locationText = (report.location?.addressText || '').toLowerCase();

  let priority = 'medium';
  let classification = 'Unclassified child welfare observation';
  const riskIndicators = [];
  let actionKey = 'actions.verify_ground';
  let confidence = 0.82;

  // Category & keyword based evaluation
  const isTransit = locationText.includes('station') || locationText.includes('terminal') ||
                    locationText.includes('railway') || locationText.includes('platform') ||
                    locationText.includes('bus') || locationText.includes('airport');

  const hasTraffickingSigns = category === 'trafficking_concern' ||
    desc.includes('traffick') || desc.includes('forced') || desc.includes('suspicious adult') ||
    desc.includes('crying') && desc.includes('dragged') || desc.includes('coerced');

  const isUnaccompanied = category === 'unaccompanied_child' || desc.includes('alone') ||
    desc.includes('unaccompanied') || desc.includes('no guardian') || desc.includes('luggage');

  const isLostDistressed = category === 'lost_child' || desc.includes('lost') ||
    desc.includes('distressed') || desc.includes('crying') || desc.includes('wandering');

  if (hasTraffickingSigns) {
    priority = 'critical';
    classification = 'High-risk suspected child trafficking or abduction concern';
    riskIndicators.push('Signs of coercion or non-consensual movement');
    if (isTransit) riskIndicators.push('High-risk transit corridor transit hub');
    riskIndicators.push('Urgent human intervention required');
    actionKey = 'actions.escalate_childline';
    confidence = 0.91;
  } else if (isLostDistressed) {
    priority = isTransit ? 'high' : 'medium';
    classification = isTransit ? 'Distressed or lost child in high-footfall hazard zone' : 'Lost or separated minor';
    riskIndicators.push('Minor separated from guardian');
    riskIndicators.push('Visible emotional distress');
    if (isTransit) riskIndicators.push('Active transit platform safety hazard');
    actionKey = isTransit ? 'actions.alert_station_desk' : 'actions.verify_ground';
    confidence = 0.88;
  } else if (isUnaccompanied) {
    priority = isTransit ? 'high' : 'medium';
    classification = 'Solo minor in active transit environment without confirmed adult';
    riskIndicators.push('Unaccompanied minor traveling alone');
    if (isTransit) riskIndicators.push('Inter-city or terminal transit point');
    actionKey = 'actions.alert_station_desk';
    confidence = 0.84;
  } else if (category === 'abuse_concern') {
    priority = 'high';
    classification = 'Reported child safety and welfare abuse indicator';
    riskIndicators.push('Visible harm or severe neglect indicator');
    actionKey = 'actions.escalate_childline';
    confidence = 0.86;
  } else {
    priority = 'low';
    classification = 'General child safety inquiry or low-urgency observation';
    riskIndicators.push('Non-immediate life safety concern');
    actionKey = 'actions.verify_ground';
    confidence = 0.75;
  }

  const recommendedAction = translate(actionKey, {}, language);

  return {
    classification,
    riskIndicators,
    recommendedAction,
    priority,
    confidence,
    humanVerificationRequired: true,
    verifiedBy: null
  };
}

/**
 * Synchronous AI-assisted triage pipeline called after report creation
 * @param {Object} report - Standard Report object
 * @returns {Promise<Object>} aiTriage result object
 */
export async function runTriage(report) {
  const language = report.language || 'en';

  if (anthropicClient) {
    try {
      const userMessage = `
Incident Category: ${report.category}
Location: ${report.location?.addressText || 'Unknown'} (Zone: ${report.location?.zone || 'Unknown'})
Has Attached Photo: ${Boolean(report.photoUrl || report.photo)}
Reporter Source: ${report.source}
Report Language: ${language}

Incident Description:
"${report.description}"
`;

      const response = await anthropicClient.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1000,
        temperature: 0.1,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userMessage }]
      });

      const textContent = response.content[0]?.text || '';
      // Parse JSON from response
      const cleanJson = textContent.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      const validPriorities = ['low', 'medium', 'high', 'critical'];
      const priority = validPriorities.includes(parsed.priority) ? parsed.priority : 'medium';

      return {
        classification: parsed.classification || 'AI-analyzed child safety report',
        riskIndicators: Array.isArray(parsed.riskIndicators) ? parsed.riskIndicators : ['Human verification recommended'],
        recommendedAction: parsed.recommendedAction || 'Dispatch responder for physical verification.',
        priority,
        confidence: typeof parsed.confidence === 'number' ? Math.min(Math.max(parsed.confidence, 0.1), 1.0) : 0.85,
        humanVerificationRequired: true, // Non-negotiable constraint: always true
        verifiedBy: null
      };
    } catch (err) {
      console.warn(`⚠️ Anthropic Claude API call failed (${err.message}). Falling back to heuristic triage.`);
      return runHeuristicTriage(report, language);
    }
  }

  // Anthropic API key not configured: use deterministic heuristic
  return runHeuristicTriage(report, language);
}
