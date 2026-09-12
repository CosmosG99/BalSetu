import React, { useEffect, useState } from 'react';
import { AnalyticsData } from '../types';
import { getAnalytics } from '../api/operations';
import { useLanguage } from '../context/LanguageContext';
import { MetricCard } from '../components/admin/MetricCard';
import { AnalyticsCharts } from '../components/admin/AnalyticsCharts';
import { LayoutDashboard, Clock, ShieldCheck, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { t } = useLanguage();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => { void getAnalytics().then(setAnalyticsData).catch((err) => setError(err instanceof Error ? err.message : 'Unable to load analytics.')); }, []);
  if (!analyticsData) return <div className="max-w-7xl mx-auto px-4 py-8 text-sm text-charcoal-600">{error || 'Loading live analytics…'}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-charcoal-200 dark:border-charcoal-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <LayoutDashboard className="w-6 h-6 text-teal-700 dark:text-teal-400" />
            <h1 className="text-2xl font-extrabold text-charcoal-800 dark:text-charcoal-100">{t('adminTitle')}</h1>
          </div>
          <p className="text-xs text-charcoal-600 dark:text-charcoal-400">{t('adminSub')}</p>
        </div>

        <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-teal-700/10 dark:bg-teal-500/20 text-teal-700 dark:text-teal-300 border border-teal-700/20 dark:border-teal-500/30">
          {t('opsOverview')}
        </span>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title={t('reportsToday')}
          value={analyticsData.totalReports}
          change="+12% volume"
          icon={FileText}
          accentColor="teal"
        />
        <MetricCard
          title={t('activeCasesMetric')}
          value={analyticsData.activeCases}
          change="Live in queue"
          icon={ShieldCheck}
          accentColor="amber"
        />
        <MetricCard
          title={t('avgReviewTime')}
          value={`${analyticsData.avgResponseTimeMin}m`}
          change="-1.8m improvement"
          icon={Clock}
          accentColor="mint"
        />
        <MetricCard
          title={t('resolutionRate')}
          value="84.2%"
          change="+4.1% efficiency"
          icon={CheckCircle2}
          accentColor="teal"
        />
      </div>

      {/* Recharts Analytics Grid */}
      <AnalyticsCharts data={analyticsData} />

    </div>
  );
};
