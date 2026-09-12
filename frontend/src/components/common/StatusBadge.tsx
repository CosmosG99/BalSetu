import React from 'react';
import { CaseStatus } from '../../types';
import { Clock, Eye, Send, UserCheck, ShieldCheck, CheckCircle2, FileText } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface StatusBadgeProps {
  status: CaseStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const { t } = useLanguage();

  const configs: Record<CaseStatus, { bg: string; text: string; border: string; icon: any; labelKey: string }> = {
    NEW: {
      bg: 'bg-teal-700/10 dark:bg-teal-500/20',
      text: 'text-teal-700 dark:text-teal-300',
      border: 'border-teal-700/30',
      icon: FileText,
      labelKey: 'statusNew'
    },
    TRIAGED: {
      bg: 'bg-mint-200/40 dark:bg-teal-800/30',
      text: 'text-teal-800 dark:text-teal-300',
      border: 'border-mint-200/60',
      icon: Clock,
      labelKey: 'statusTriaged'
    },
    UNDER_REVIEW: {
      bg: 'bg-amberGold-600/15 dark:bg-amberGold-600/25',
      text: 'text-amberGold-700 dark:text-amberGold-400',
      border: 'border-amberGold-600/35',
      icon: Eye,
      labelKey: 'statusReview'
    },
    ROUTED: {
      bg: 'bg-teal-700/15 dark:bg-teal-500/25',
      text: 'text-teal-800 dark:text-teal-200',
      border: 'border-teal-700/40',
      icon: Send,
      labelKey: 'statusRouted'
    },
    ASSIGNED: {
      bg: 'bg-mint-200/50 dark:bg-teal-700/30',
      text: 'text-teal-900 dark:text-teal-100',
      border: 'border-mint-200/70',
      icon: UserCheck,
      labelKey: 'statusAssigned'
    },
    INTERVENTION: {
      bg: 'bg-coral-600/15 dark:bg-coral-600/25',
      text: 'text-coral-600 dark:text-coral-400',
      border: 'border-coral-600/40',
      icon: ShieldCheck,
      labelKey: 'statusIntervention'
    },
    RESOLVED: {
      bg: 'bg-teal-700/20 dark:bg-teal-500/30',
      text: 'text-teal-800 dark:text-teal-200',
      border: 'border-teal-700/40',
      icon: CheckCircle2,
      labelKey: 'statusResolved'
    }
  };

  const config = configs[status] || configs.NEW;
  const Icon = config.icon;
  const sizeClasses = size === 'sm' ? 'text-[10px] px-2 py-0.5 space-x-1 font-semibold' : 'text-xs px-2.5 py-1 space-x-1.5 font-bold';

  return (
    <span className={`inline-flex items-center rounded-md border ${config.bg} ${config.text} ${config.border} ${sizeClasses}`}>
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      <span>{t(config.labelKey)}</span>
    </span>
  );
};
