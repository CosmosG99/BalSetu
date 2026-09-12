import React from 'react';
import { mockBackend } from '../services/mockBackend';
import { useLanguage } from '../context/LanguageContext';
import { MetricCard } from '../components/admin/MetricCard';
import { AnalyticsCharts } from '../components/admin/AnalyticsCharts';
import { LayoutDashboard, Clock, ShieldCheck, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { t } = useLanguage();
  const analyticsData = mockBackend.getAnalytics();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-ivory-300 dark:border-charcoal-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <LayoutDashboard className="w-6 h-6 text-forest-700 dark:text-sage-300" />
            <h1 className="text-2xl font-extrabold text-charcoal-900 dark:text-ivory-100">{t('adminTitle')}</h1>
          </div>
          <p className="text-xs text-charcoal-600 dark:text-ivory-400">{t('adminSub')}</p>
        </div>

        <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-forest-900/10 dark:bg-sage-400/10 text-forest-800 dark:text-sage-300 border border-forest-800/20 dark:border-sage-400/20">
          {t('opsOverview')}
        </span>
      </div>

      {/* Data Disclaimer */}
      <div className="p-3.5 rounded-2xl bg-white/90 dark:bg-charcoal-900/90 border border-ivory-300 dark:border-charcoal-800 text-xs text-charcoal-600 dark:text-ivory-400 flex items-center space-x-2 shadow-sm">
        <AlertCircle className="w-4 h-4 text-amberGold-600 dark:text-amberGold-400 flex-shrink-0" />
        <span>{t('syntheticDataNotice')}</span>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title={t('reportsToday')}
          value={analyticsData.totalReports}
          change="+12% volume"
          icon={FileText}
          accentColor="forest"
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
          accentColor="sage"
        />
        <MetricCard
          title={t('resolutionRate')}
          value="84.2%"
          change="+4.1% efficiency"
          icon={CheckCircle2}
          accentColor="forest"
        />
      </div>

      {/* Recharts Analytics Grid */}
      <AnalyticsCharts data={analyticsData} />

    </div>
  );
};

