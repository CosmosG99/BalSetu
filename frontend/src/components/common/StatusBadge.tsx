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
      bg: 'bg-forest-900/10 dark:bg-forest-800/20',
      text: 'text-forest-900 dark:text-sage-300',
      border: 'border-forest-900/30',
      icon: FileText,
      labelKey: 'statusNew'
    },
    TRIAGED: {
      bg: 'bg-sage-600/15 dark:bg-sage-600/20',
      text: 'text-forest-900 dark:text-sage-300',
      border: 'border-sage-600/30',
      icon: Clock,
      labelKey: 'statusTriaged'
    },
    UNDER_REVIEW: {
      bg: 'bg-amberGold-600/15 dark:bg-amberGold-600/20',
      text: 'text-amberGold-700 dark:text-amberGold-500',
      border: 'border-amberGold-600/30',
      icon: Eye,
      labelKey: 'statusReview'
    },
    ROUTED: {
      bg: 'bg-forest-900/15 dark:bg-forest-800/30',
      text: 'text-forest-900 dark:text-ivory-100',
      border: 'border-forest-900/40',
      icon: Send,
      labelKey: 'statusRouted'
    },
    ASSIGNED: {
      bg: 'bg-sage-600/20 dark:bg-sage-600/30',
      text: 'text-forest-950 dark:text-ivory-100',
      border: 'border-sage-600/40',
      icon: UserCheck,
      labelKey: 'statusAssigned'
    },
    INTERVENTION: {
      bg: 'bg-terracotta-600/15 dark:bg-terracotta-600/20',
      text: 'text-terracotta-700 dark:text-terracotta-500',
      border: 'border-terracotta-600/40',
      icon: ShieldCheck,
      labelKey: 'statusIntervention'
    },
    RESOLVED: {
      bg: 'bg-forest-900/20 dark:bg-forest-800/40',
      text: 'text-forest-900 dark:text-sage-200',
      border: 'border-forest-900/40',
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
