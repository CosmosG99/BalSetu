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
      bg: 'bg-coral-600/15 dark:bg-coral-600/25',
      text: 'text-coral-600 dark:text-coral-400',
      border: 'border-coral-600/40',
      icon: ShieldAlert,
      labelKey: 'riskCritical'
    },
    HIGH: {
      bg: 'bg-amberGold-600/15 dark:bg-amberGold-600/25',
      text: 'text-amberGold-700 dark:text-amberGold-400',
      border: 'border-amberGold-600/40',
      icon: AlertTriangle,
      labelKey: 'riskHigh'
    },
    MEDIUM: {
      bg: 'bg-teal-700/10 dark:bg-teal-500/20',
      text: 'text-teal-700 dark:text-teal-300',
      border: 'border-teal-700/30',
      icon: AlertCircle,
      labelKey: 'riskMedium'
    },
    LOW: {
      bg: 'bg-mint-200/40 dark:bg-teal-800/30',
      text: 'text-teal-800 dark:text-teal-300',
      border: 'border-mint-200/60',
      icon: Info,
      labelKey: 'riskLow'
    }
  };

  const config = configs[level] || configs.MEDIUM;
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 space-x-1 font-mono font-bold',
    md: 'text-xs px-3 py-1 space-x-1.5 font-bold',
    lg: 'text-sm px-4 py-1.5 space-x-2 font-extrabold'
  };

  return (
    <span
      className={`inline-flex items-center rounded-lg border ${config.bg} ${config.text} ${config.border} ${sizeClasses[size]} uppercase tracking-wider transition-colors shadow-sm`}
    >
      {showIcon && <Icon className={size === 'lg' ? 'w-4 h-4' : size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />}
      <span>{t(config.labelKey)}</span>
      {score !== undefined && <span className="opacity-90 font-mono ml-1">({score}/100)</span>}
    </span>
  );
};
