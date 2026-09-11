import React from 'react';
import { RiskLevel } from '../../types';
import { ShieldAlert, AlertTriangle, AlertCircle, Info } from 'lucide-react';

interface RiskBadgeProps {
  level: RiskLevel;
  score?: number;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, score, showIcon = true, size = 'md' }) => {
  const configs: Record<RiskLevel, { bg: string; text: string; border: string; icon: any; label: string }> = {
    CRITICAL: {
      bg: 'bg-red-500/15',
      text: 'text-red-400',
      border: 'border-red-500/40',
      icon: ShieldAlert,
      label: 'CRITICAL RISK'
    },
    HIGH: {
      bg: 'bg-amber-500/15',
      text: 'text-amber-400',
      border: 'border-amber-500/40',
      icon: AlertTriangle,
      label: 'HIGH PRIORITY'
    },
    MEDIUM: {
      bg: 'bg-blue-500/15',
      text: 'text-blue-400',
      border: 'border-blue-500/40',
      icon: AlertCircle,
      label: 'MEDIUM RISK'
    },
    LOW: {
      bg: 'bg-emerald-500/15',
      text: 'text-emerald-400',
      border: 'border-emerald-500/40',
      icon: Info,
      label: 'LOW PRIORITY'
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
      className={`inline-flex items-center rounded-full border ${config.bg} ${config.text} ${config.border} ${sizeClasses[size]} font-semibold tracking-wide uppercase transition-all shadow-sm`}
    >
      {showIcon && <Icon className={size === 'lg' ? 'w-5 h-5' : size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />}
      <span>{config.label}</span>
      {score !== undefined && <span className="opacity-90 font-mono ml-1">({score}/100)</span>}
    </span>
  );
};
