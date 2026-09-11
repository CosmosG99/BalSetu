import { ReportInput, AiTriageResult, RiskLevel } from '../types';

export const analyzeReportWithAI = async (report: ReportInput): Promise<AiTriageResult> => {
  // Simulate AI latency for realistic demo processing steps
  await new Promise((resolve) => setTimeout(resolve, 800));

  const types = report.incidentTypes;
  let baseScore = 30;
  const categories: string[] = [];
  const indicators: string[] = [];
  const explanations: string[] = [];

  if (types.includes('TRAFFICKING')) {
    baseScore += 45;
    categories.push('Potential Trafficking Risk');
    indicators.push('Movement with unknown non-guardian adult observed');
    explanations.push('Report includes indicators suggestive of potential illegal transport or coercion.');
  }

  if (types.includes('LOST')) {
    baseScore += 25;
    categories.push('Lost / Separated Child');
    indicators.push('Child appears unaccompanied in high-density transit area');
    explanations.push('Child appears to be without a known parent or guardian nearby.');
  }

  if (types.includes('DISTRESSED')) {
    baseScore += 20;
    categories.push('Visible Emotional Distress');
    indicators.push('Crying, panic, or withdrawal symptoms reported');
    explanations.push('Description indicates visible signs of fear or distress requiring care.');
  }

  if (types.includes('UNACCOMPANIED')) {
    baseScore += 20;
    categories.push('Solo Minor Travel');
    indicators.push('Child travelling long-distance without adult oversight');
    explanations.push('Minor detected in transit hub without confirmed supervision.');
  }

  if (types.includes('ABUSE')) {
    baseScore += 35;
    categories.push('Physical or Verbal Risk');
    indicators.push('Possible physical harm or forceful restraint noticed');
    explanations.push('Bystander observed potential aggressive behavior towards child.');
  }

  if (types.includes('BULLYING')) {
    baseScore += 15;
    categories.push('Peer Harassment');
    indicators.push('Group intimidation or coercion observed');
    explanations.push('Public harassment incident reported.');
  }

  // Text analysis heuristic on description
  const descLower = (report.description || '').toLowerCase();
  if (descLower.includes('crying') || descLower.includes('scared') || descLower.includes('fear')) {
    baseScore += 8;
    if (!indicators.includes('Crying, panic, or withdrawal symptoms reported')) {
      indicators.push('Behavioral distress keywords detected in description');
    }
  }
  if (descLower.includes('platform') || descLower.includes('track') || descLower.includes('night')) {
    baseScore += 7;
    indicators.push('High-risk physical hazard proximity (rail tracks / late hours)');
  }

  const finalScore = Math.min(Math.max(baseScore, 25), 98);

  let riskLevel: RiskLevel = 'LOW';
  if (finalScore >= 80) riskLevel = 'CRITICAL';
  else if (finalScore >= 65) riskLevel = 'HIGH';
  else if (finalScore >= 45) riskLevel = 'MEDIUM';

  let recommendation = "Human verification recommended.";
  if (riskLevel === 'CRITICAL') {
    recommendation = "Immediate ground-level responder dispatch and human verification advised.";
  } else if (riskLevel === 'HIGH') {
    recommendation = "Priority human verification & local station authority alert recommended.";
  }

  if (categories.length === 0) {
    categories.push('General Child Safety Concern');
  }
  if (indicators.length === 0) {
    indicators.push('General welfare observation submitted by citizen');
    explanations.push('Bystander noted situation requiring verification.');
  }

  return {
    riskScore: finalScore,
    riskLevel,
    categories,
    indicators,
    recommendation,
    explanations
  };
};
