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

  const configs: Record<
    IncidentType,
    {
      icon: any;
      titleKey: string;
      accentBorder: string;
      accentBg: string;
      accentIconBg: string;
      accentIconColor: string;
      accentTextColor: string;
    }
  > = {
    LOST: {
      icon: HelpCircle,
      titleKey: 'incLost',
      accentBorder: 'border-accentBlue',
      accentBg: 'bg-accentBlue/10 dark:bg-accentBlue/20',
      accentIconBg: 'bg-accentBlue text-white',
      accentIconColor: 'text-accentBlue',
      accentTextColor: 'text-accentBlue dark:text-accentBlue'
    },
    DISTRESSED: {
      icon: Frown,
      titleKey: 'incDistressed',
      accentBorder: 'border-amberGold-600',
      accentBg: 'bg-amberGold-600/10 dark:bg-amberGold-600/20',
      accentIconBg: 'bg-amberGold-600 text-white',
      accentIconColor: 'text-amberGold-600',
      accentTextColor: 'text-amberGold-700 dark:text-amberGold-400'
    },
    UNACCOMPANIED: {
      icon: UserX,
      titleKey: 'incSolo',
      accentBorder: 'border-accentCyan',
      accentBg: 'bg-accentCyan/10 dark:bg-accentCyan/20',
      accentIconBg: 'bg-accentCyan text-white',
      accentIconColor: 'text-accentCyan',
      accentTextColor: 'text-accentCyan dark:text-accentCyan'
    },
    TRAFFICKING: {
      icon: ShieldAlert,
      titleKey: 'incTrafficking',
      accentBorder: 'border-accentCoral',
      accentBg: 'bg-accentCoral/10 dark:bg-accentCoral/20',
      accentIconBg: 'bg-accentCoral text-white',
      accentIconColor: 'text-accentCoral',
      accentTextColor: 'text-accentCoral dark:text-accentCoral'
    },
    ABUSE: {
      icon: AlertTriangle,
      titleKey: 'incAbuse',
      accentBorder: 'border-accentOrange',
      accentBg: 'bg-accentOrange/10 dark:bg-accentOrange/20',
      accentIconBg: 'bg-accentOrange text-white',
      accentIconColor: 'text-accentOrange',
      accentTextColor: 'text-accentOrange dark:text-accentOrange'
    },
    BULLYING: {
      icon: Users,
      titleKey: 'incBullying',
      accentBorder: 'border-accentPink',
      accentBg: 'bg-accentPink/10 dark:bg-accentPink/20',
      accentIconBg: 'bg-accentPink text-white',
      accentIconColor: 'text-accentPink',
      accentTextColor: 'text-accentPink dark:text-accentPink'
    },
    OTHER: {
      icon: Compass,
      titleKey: 'incOther',
      accentBorder: 'border-accentPurple',
      accentBg: 'bg-accentPurple/10 dark:bg-accentPurple/20',
      accentIconBg: 'bg-accentPurple text-white',
      accentIconColor: 'text-accentPurple',
      accentTextColor: 'text-accentPurple dark:text-accentPurple'
    }
  };

  const config = configs[type];
  const Icon = config.icon;

  return (
    <button
      type="button"
      onClick={() => onToggle(type)}
      className={`relative p-4 sm:p-5 rounded-2xl border text-center transition-all duration-200 flex flex-col items-center justify-center space-y-3 group cursor-pointer ${
        selected
          ? `${config.accentBg} ${config.accentBorder} shadow-subtle scale-[1.02]`
          : 'bg-white dark:bg-charcoal-900 border-charcoal-200 dark:border-charcoal-800 hover:border-charcoal-300 dark:hover:border-charcoal-700 hover:bg-ivory-50 dark:hover:bg-charcoal-850'
      }`}
    >
      <div className={`p-3 rounded-2xl transition-transform group-hover:scale-105 shadow-xs ${
        selected
          ? config.accentIconBg
          : `bg-ivory-100 dark:bg-charcoal-800 ${config.accentIconColor} border border-charcoal-200 dark:border-charcoal-700`
      }`}>
        <Icon className="w-6 h-6" />
      </div>

      <div className="space-y-1">
        <div className={`font-bold text-xs sm:text-sm transition-colors ${
          selected ? config.accentTextColor : 'text-charcoal-800 dark:text-charcoal-300'
        }`}>
          {t(config.titleKey)}
        </div>
      </div>

      <div
        className={`absolute top-3 right-3 w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
          selected
            ? `${config.accentIconBg} ${config.accentBorder} text-white`
            : 'border-charcoal-300 dark:border-charcoal-700 bg-ivory-100 dark:bg-charcoal-950 text-transparent'
        }`}
      >
        <Check className="w-3.5 h-3.5" />
      </div>
    </button>
  );
};
