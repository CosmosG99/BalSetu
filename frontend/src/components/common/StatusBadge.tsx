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
      bg: 'bg-purple-500/15 dark:bg-purple-500/20',
      text: 'text-purple-700 dark:text-purple-300',
      border: 'border-purple-500/30',
      icon: FileText,
      labelKey: 'statusNew'
    },
    TRIAGED: {
      bg: 'bg-indigo-500/15 dark:bg-indigo-500/20',
      text: 'text-indigo-700 dark:text-indigo-300',
      border: 'border-indigo-500/30',
      icon: Clock,
      labelKey: 'statusTriaged'
    },
    UNDER_REVIEW: {
      bg: 'bg-amber-500/15 dark:bg-amber-500/20',
      text: 'text-amber-700 dark:text-amber-300',
      border: 'border-amber-500/30',
      icon: Eye,
      labelKey: 'statusReview'
    },
    ROUTED: {
      bg: 'bg-blue-500/15 dark:bg-blue-500/20',
      text: 'text-blue-700 dark:text-blue-300',
      border: 'border-blue-500/30',
      icon: Send,
      labelKey: 'statusRouted'
    },
    ASSIGNED: {
      bg: 'bg-cyan-500/15 dark:bg-cyan-500/20',
      text: 'text-cyan-700 dark:text-cyan-300',
      border: 'border-cyan-500/30',
      icon: UserCheck,
      labelKey: 'statusAssigned'
    },
    INTERVENTION: {
      bg: 'bg-red-500/15 dark:bg-red-500/20',
      text: 'text-red-700 dark:text-red-300',
      border: 'border-red-500/30',
      icon: ShieldCheck,
      labelKey: 'statusIntervention'
    },
    RESOLVED: {
      bg: 'bg-emerald-500/15 dark:bg-emerald-500/20',
      text: 'text-emerald-700 dark:text-emerald-300',
      border: 'border-emerald-500/30',
      icon: CheckCircle2,
      labelKey: 'statusResolved'
    }
  };

  const config = configs[status] || configs.NEW;
  const Icon = config.icon;
  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5 space-x-1' : 'text-xs px-2.5 py-1 space-x-1.5 font-semibold';

  return (
    <span className={`inline-flex items-center rounded-md border ${config.bg} ${config.text} ${config.border} ${sizeClasses}`}>
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      <span>{t(config.labelKey)}</span>
    </span>
  );
};
