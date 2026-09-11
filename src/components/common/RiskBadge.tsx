import React from 'react';
import { RiskLevel } from '../../types';
import { ShieldAlert, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface RiskBadgeProps {
  level: RiskLevel;
  score?: number;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, score, showIcon = true, size = 'md' }) => {
  const { t } = useLanguage();

  const configs: Record<RiskLevel, { bg: string; text: string; border: string; icon: any; labelKey: string }> = {
    CRITICAL: {
      bg: 'bg-red-500/15 dark:bg-red-500/20',
      text: 'text-red-700 dark:text-red-400',
      border: 'border-red-500/40',
      icon: ShieldAlert,
      labelKey: 'riskCritical'
    },
    HIGH: {
      bg: 'bg-amber-500/15 dark:bg-amber-500/20',
      text: 'text-amber-700 dark:text-amber-400',
      border: 'border-amber-500/40',
      icon: AlertTriangle,
      labelKey: 'riskHigh'
    },
    MEDIUM: {
      bg: 'bg-blue-500/15 dark:bg-blue-500/20',
      text: 'text-blue-700 dark:text-blue-400',
      border: 'border-blue-500/40',
      icon: AlertCircle,
      labelKey: 'riskMedium'
    },
    LOW: {
      bg: 'bg-emerald-500/15 dark:bg-emerald-500/20',
      text: 'text-emerald-700 dark:text-emerald-400',
      border: 'border-emerald-500/40',
      icon: Info,
      labelKey: 'riskLow'
    }
  };

  const config = configs[level] || configs.MEDIUM;
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 space-x-1',
    md: 'text-sm px-3 py-1 space-x-1.5',
    lg: 'text-base px-4 py-1.5 space-x-2 font-bold'
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border ${config.bg} ${config.text} ${config.border} ${sizeClasses[size]} font-semibold tracking-wide uppercase transition-colors shadow-sm`}
    >
      {showIcon && <Icon className={size === 'lg' ? 'w-5 h-5' : size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />}
      <span>{t(config.labelKey)}</span>
      {score !== undefined && <span className="opacity-90 font-mono ml-1">({score}/100)</span>}
    </span>
  );
};
