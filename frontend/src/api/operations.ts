import { AnalyticsData } from '../types';
import { request } from './client';

export async function getAnalytics(): Promise<AnalyticsData> {
  const [overview, priority, category, location, resolution] = await Promise.all([
    request<any>('/api/admin/stats/overview', {}, true), request<any>('/api/admin/stats/by-priority', {}, true),
    request<any>('/api/admin/stats/by-category', {}, true), request<any>('/api/admin/stats/by-location', {}, true),
    request<any>('/api/admin/stats/resolution-times', {}, true)
  ]);
  const entries = (value: Record<string, number>, key: string) => Object.entries(value).map(([name, count]) => ({ [key]: name.replace(/_/g, ' '), count }));
  return {
    totalReports: overview.totalCases, activeCases: overview.activeCases, highPriorityCount: (priority.byPriority.high || 0) + (priority.byPriority.critical || 0), resolvedCount: overview.resolvedCases,
    avgResponseTimeMin: resolution.averageResolutionMinutes,
    casesByCategory: entries(category.byCategory, 'category') as AnalyticsData['casesByCategory'],
    casesByLocation: entries(location.byLocation, 'location') as AnalyticsData['casesByLocation'],
    casesByStatus: [],
    priorityDistribution: entries(priority.byPriority, 'priority').map((item: any) => ({ ...item, color: '#149B84' })),
    timelineSeries: []
  };
}

export async function resetDemo() { return request('/api/demo/reset', { method: 'POST' }, true); }

export async function runMatching(reportId: string) { return request<any>(`/api/matching/run/${encodeURIComponent(reportId)}`, { method: 'POST' }, true); }
export async function verifyMatch(matchId: string, status: 'confirmed' | 'rejected') { return request(`/api/matching/${encodeURIComponent(matchId)}/verify`, { method: 'POST', body: JSON.stringify({ status }) }, true); }

export async function registerReporter(input: { name: string; phone: string; type: 'volunteer' | 'transit_worker'; zone: string }) {
  return request<any>('/api/reporters/register', { method: 'POST', body: JSON.stringify(input) });
}
