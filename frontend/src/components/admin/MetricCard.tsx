import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon: any;
  accentColor?: 'teal' | 'coral' | 'amber' | 'mint' | 'forest';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  isPositive = true,
  icon: Icon,
  accentColor = 'teal'
}) => {
  const accentStyles = {
    teal: 'bg-teal-700/10 text-teal-700 dark:text-teal-400 border-teal-700/20',
    coral: 'bg-coral-600/15 text-coral-600 dark:text-coral-400 border-coral-600/30',
    amber: 'bg-amberGold-600/15 text-amberGold-700 dark:text-amberGold-400 border-amberGold-600/30',
    mint: 'bg-mint-200/40 text-teal-800 dark:text-teal-300 border-mint-200/50',
    forest: 'bg-teal-700/10 text-teal-700 dark:text-teal-400 border-teal-700/20'
  };

  return (
    <div className="natural-panel p-5 flex items-center justify-between shadow-subtle">
      <div className="flex items-center space-x-3.5">
        <div className={`p-3 rounded-xl border ${accentStyles[accentColor] || accentStyles.teal}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="space-y-0.5">
          <div className="text-2xl font-extrabold text-charcoal-800 dark:text-charcoal-100 font-mono tracking-tight">{value}</div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-600 dark:text-charcoal-400 block">{title}</span>
        </div>
      </div>

      {change && (
        <div className={`flex items-center space-x-1 text-[11px] font-mono font-bold px-2 py-1 rounded-lg ${
          isPositive
            ? 'bg-teal-700/10 text-teal-700 dark:bg-teal-500/20 dark:text-teal-300'
            : 'bg-coral-600/10 text-coral-600 dark:text-coral-400'
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
