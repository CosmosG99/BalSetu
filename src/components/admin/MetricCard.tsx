import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon: any;
  accentColor?: 'purple' | 'amber' | 'critical' | 'emerald' | 'blue';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  isPositive = true,
  icon: Icon,
  accentColor = 'purple'
}) => {
  const accentStyles = {
    purple: 'bg-brand-purple/15 text-brand-purple border-brand-purple/30',
    amber: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    critical: 'bg-red-500/15 text-red-400 border-red-500/30',
    emerald: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    blue: 'bg-blue-500/15 text-blue-400 border-blue-500/30'
  };

  return (
    <div className="glass-panel p-5 rounded-2xl border border-white/10 flex items-start justify-between shadow-lg">
      <div className="space-y-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</span>
        <div className="text-3xl font-extrabold text-white font-mono">{value}</div>
        {change && (
          <div className="flex items-center space-x-1 text-xs font-medium">
            {isPositive ? (
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5 text-red-400" />
            )}
            <span className={isPositive ? 'text-emerald-400' : 'text-red-400'}>{change}</span>
            <span className="text-slate-500 text-[11px]">vs previous cycle</span>
          </div>
        )}
      </div>

      <div className={`p-3 rounded-2xl border ${accentStyles[accentColor]} shadow-sm`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
};
