import React from 'react';
import { RoutingRecommendation } from '../../types';
import { Network, Train, ShieldCheck, HeartHandshake, CheckCircle2, Clock } from 'lucide-react';

interface SmartRoutingCardProps {
  routing: RoutingRecommendation[];
  location: string;
}

export const SmartRoutingCard: React.FC<SmartRoutingCardProps> = ({ routing, location }) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'RAILWAY':
        return Train;
      case 'CHILD_PROTECTION':
        return ShieldCheck;
      default:
        return HeartHandshake;
    }
  };

  return (
    <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-white/10 space-y-4 shadow-lg">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-brand-purple/10 dark:bg-brand-purple/20 text-brand-purple flex items-center justify-center">
            <Network className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Simulated Smart Response Routing</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Automated triage matrix matching for transit node</p>
          </div>
        </div>

        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-500/10 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/30">
          Simulated Network Integration
        </span>
      </div>

      {/* Explanation Banner */}
      <p className="text-xs text-slate-600 dark:text-slate-300">
        Routing recommendations use incident category, approximate transit coordinates (<span className="text-brand-purple font-mono font-semibold">{location.split(' ')[0]}</span>), and assessed priority score.
      </p>

      {/* Routing Cards List */}
      <div className="space-y-2">
        {routing.map((item, idx) => {
          const Icon = getCategoryIcon(item.category);
          const isNotified = item.status === 'NOTIFIED' || item.status === 'ACCEPTED';
          return (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 text-xs shadow-sm"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-brand-purple border border-slate-200 dark:border-slate-700">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">{item.organization}</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">Category: {item.category}</div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  {item.priority}
                </span>
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center space-x-1 ${
                    isNotified
                      ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                      : 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                  }`}
                >
                  {isNotified ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3 animate-spin" />}
                  <span>{item.status}</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
