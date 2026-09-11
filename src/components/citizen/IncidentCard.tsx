import React from 'react';
import { IncidentType } from '../../types';
import { HelpCircle, Frown, UserX, ShieldAlert, AlertTriangle, Users, Compass, Check } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface IncidentCardProps {
  type: IncidentType;
  selected: boolean;
  onToggle: (type: IncidentType) => void;
}

export const IncidentCard: React.FC<IncidentCardProps> = ({ type, selected, onToggle }) => {
  const { t } = useLanguage();

  const configs: Record<IncidentType, { icon: any; titleKey: string; color: string }> = {
    LOST: { icon: HelpCircle, titleKey: 'incLost', color: 'border-blue-500/40 text-blue-600 dark:text-blue-400' },
    DISTRESSED: { icon: Frown, titleKey: 'incDistressed', color: 'border-amber-500/40 text-amber-600 dark:text-amber-400' },
    UNACCOMPANIED: { icon: UserX, titleKey: 'incSolo', color: 'border-purple-500/40 text-purple-600 dark:text-purple-400' },
    TRAFFICKING: { icon: ShieldAlert, titleKey: 'incTrafficking', color: 'border-red-500/50 text-red-600 dark:text-red-400' },
    ABUSE: { icon: AlertTriangle, titleKey: 'incAbuse', color: 'border-red-500/50 text-red-600 dark:text-red-400' },
    BULLYING: { icon: Users, titleKey: 'incBullying', color: 'border-indigo-500/40 text-indigo-600 dark:text-indigo-400' },
    OTHER: { icon: Compass, titleKey: 'incOther', color: 'border-slate-400 text-slate-600 dark:text-slate-400' }
  };

  const config = configs[type];
  const Icon = config.icon;

  return (
    <button
      type="button"
      onClick={() => onToggle(type)}
      className={`relative p-5 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between space-y-3 group ${
        selected
          ? 'bg-purple-500/10 dark:bg-gradient-to-br dark:from-brand-purple/25 dark:to-brand-card border-brand-purple shadow-glow-purple scale-[1.02]'
          : 'bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className={`p-3 rounded-xl bg-slate-100 dark:bg-slate-950/60 border ${config.color} group-hover:scale-110 transition-transform`}>
          <Icon className="w-6 h-6" />
        </div>

        <div
          className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
            selected
              ? 'bg-brand-purple border-brand-purple text-white'
              : 'border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-950 text-transparent'
          }`}
        >
          <Check className="w-4 h-4" />
        </div>
      </div>

      <div>
        <div className={`font-semibold text-sm transition-colors ${selected ? 'text-brand-purple dark:text-white font-bold' : 'text-slate-800 dark:text-slate-200'}`}>
          {t(config.titleKey)}
        </div>
      </div>
    </button>
  );
};
