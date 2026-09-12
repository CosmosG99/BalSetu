import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon: any;
  accentColor?: 'forest' | 'terracotta' | 'amber' | 'sage' | 'purple';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  isPositive = true,
  icon: Icon,
  accentColor = 'forest'
}) => {
  const accentStyles = {
    forest: 'bg-forest-900/10 text-forest-900 dark:text-sage-300 border-forest-900/20',
    terracotta: 'bg-terracotta-600/15 text-terracotta-700 dark:text-terracotta-500 border-terracotta-600/30',
    amber: 'bg-amberGold-600/15 text-amberGold-700 dark:text-amberGold-500 border-amberGold-600/30',
    sage: 'bg-sage-600/20 text-forest-950 dark:text-sage-200 border-sage-600/30',
    purple: 'bg-forest-900/10 text-forest-900 dark:text-sage-300 border-forest-900/20'
  };

  return (
    <div className="natural-panel p-5 flex items-center justify-between shadow-subtle">
      <div className="flex items-center space-x-3.5">
        <div className={`p-3 rounded-xl border ${accentStyles[accentColor]}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="space-y-0.5">
          <div className="text-2xl font-extrabold text-charcoal-800 dark:text-ivory-100 font-mono tracking-tight">{value}</div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-500 block">{title}</span>
        </div>
      </div>

      {change && (
        <div className={`flex items-center space-x-1 text-[11px] font-mono font-bold px-2 py-1 rounded-lg ${
          isPositive
            ? 'bg-forest-900/10 text-forest-900 dark:bg-forest-800/30 dark:text-sage-300'
            : 'bg-terracotta-600/10 text-terracotta-700 dark:text-terracotta-500'
        }`}>
          {isPositive ? (
            <TrendingUp className="w-3 h-3" />
          ) : (
            <TrendingDown className="w-3 h-3" />
          )}
          <span>{change}</span>
        </div>
      )}
    </div>
  );
};
