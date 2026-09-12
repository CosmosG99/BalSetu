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

  const configs: Record<IncidentType, { icon: any; titleKey: string }> = {
    LOST: { icon: HelpCircle, titleKey: 'incLost' },
    DISTRESSED: { icon: Frown, titleKey: 'incDistressed' },
    UNACCOMPANIED: { icon: UserX, titleKey: 'incSolo' },
    TRAFFICKING: { icon: ShieldAlert, titleKey: 'incTrafficking' },
    ABUSE: { icon: AlertTriangle, titleKey: 'incAbuse' },
    BULLYING: { icon: Users, titleKey: 'incBullying' },
    OTHER: { icon: Compass, titleKey: 'incOther' }
  };

  const config = configs[type];
  const Icon = config.icon;

  return (
    <button
      type="button"
      onClick={() => onToggle(type)}
      className={`relative p-4 sm:p-5 rounded-2xl border text-center transition-all duration-200 flex flex-col items-center justify-center space-y-3 group ${
        selected
          ? 'bg-forest-900/10 dark:bg-forest-800/30 border-forest-900 dark:border-sage-500 shadow-subtle'
          : 'bg-white dark:bg-charcoal-900 border-charcoal-200 dark:border-charcoal-800 hover:border-charcoal-300 dark:hover:border-charcoal-700 hover:bg-ivory-50 dark:hover:bg-charcoal-850'
      }`}
    >
      <div className={`p-3 rounded-2xl transition-transform group-hover:scale-105 ${
        selected
          ? 'bg-forest-900 text-white'
          : 'bg-ivory-100 dark:bg-charcoal-800 text-forest-900 dark:text-sage-300 border border-charcoal-200 dark:border-charcoal-700'
      }`}>
        <Icon className="w-6 h-6" />
      </div>

      <div className="space-y-1">
        <div className={`font-bold text-xs sm:text-sm transition-colors ${
          selected ? 'text-forest-900 dark:text-ivory-100' : 'text-charcoal-800 dark:text-charcoal-300'
        }`}>
          {t(config.titleKey)}
        </div>
      </div>

      <div
        className={`absolute top-3 right-3 w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
          selected
            ? 'bg-forest-900 border-forest-900 text-white'
            : 'border-charcoal-300 dark:border-charcoal-700 bg-ivory-100 dark:bg-charcoal-950 text-transparent'
        }`}
      >
        <Check className="w-3.5 h-3.5" />
      </div>
    </button>
  );
};
