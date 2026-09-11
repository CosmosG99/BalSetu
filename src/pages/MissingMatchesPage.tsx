import React, { useState } from 'react';
import { MissingChildProfile } from '../types';
import { searchPotentialMatches, INITIAL_SYNTHETIC_MISSING_CHILDREN } from '../services/mockMatchService';
import { useLanguage } from '../context/LanguageContext';
import { Users, Search, AlertTriangle, ShieldCheck, Sparkles } from 'lucide-react';

export const MissingMatchesPage: React.FC = () => {
  const { t } = useLanguage();
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<MissingChildProfile[]>(INITIAL_SYNTHETIC_MISSING_CHILDREN);
  const [selectedPhoto] = useState<string>(
    'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80'
  );

  const handleRunSearch = async () => {
    setSearching(true);
    const matches = await searchPotentialMatches(selectedPhoto);
    setResults(matches);
    setSearching(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Users className="w-6 h-6 text-brand-magenta" />
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">{t('matchAssistanceTitle')}</h1>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            {t('matchAssistanceSub')}
          </p>
        </div>

        <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-purple-500/10 dark:bg-magenta-500/20 text-purple-700 dark:text-magenta-300 border border-purple-500/30">
          Sample Case Database
        </span>
      </div>

      {/* Mandatory Warning Banner */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-200 flex items-start space-x-3 text-xs shadow-lg">
        <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="text-amber-900 dark:text-amber-300 block text-sm font-bold">{t('mandatoryWarningTitle')}</strong>
          <p>
            {t('mandatoryWarningBody')}
          </p>
        </div>
      </div>

      {/* Search Input Simulation Box */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-white/10 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-brand-purple" />
            <span>{t('queryImageTitle')}</span>
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">1 face detected</span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex-shrink-0">
            <img src={selectedPhoto} alt="Search query avatar" className="w-full h-full object-cover" />
          </div>

          <div className="space-y-2 flex-1 text-xs">
            <p className="text-slate-600 dark:text-slate-300">
              Query image representation generated. Ready to perform vector similarity lookup against synthetic database.
            </p>
            <button
              onClick={handleRunSearch}
              disabled={searching}
              className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-brand-purple to-brand-magenta text-white font-bold text-xs shadow-glow-purple disabled:opacity-50 transition-all flex items-center space-x-2"
            >
              <Search className={`w-3.5 h-3.5 ${searching ? 'animate-spin' : ''}`} />
              <span>{searching ? 'Calculating Similarities...' : t('runSimilaritySearchBtn')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Results Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
          {t('potentialSimilarityMatches')} ({results.length})
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {results.map((item) => (
            <div
              key={item.id}
              className="glass-panel glass-panel-hover p-5 rounded-2xl border border-slate-200 dark:border-white/10 space-y-3 shadow-lg flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Photo & Similarity Pill */}
                <div className="relative rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-950 h-44">
                  <img src={item.photoUrl} alt={item.syntheticName} className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2 bg-white/90 dark:bg-slate-900/90 text-emerald-600 dark:text-emerald-400 font-mono font-bold text-xs px-2.5 py-1 rounded-full border border-emerald-500/40 shadow-sm">
                    {item.similarityScore}% Match
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-brand-purple">{item.caseRef}</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">{item.gender}, Age {item.age}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">{item.syntheticName}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Last Seen: <span className="text-slate-900 dark:text-slate-200 font-medium">{item.lastKnownLocation}</span></p>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">{item.description}</p>
                </div>
              </div>

              <button className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs border border-slate-300 dark:border-slate-700 transition-colors flex items-center justify-center space-x-1.5 shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-purple" />
                <span>{t('verifySimilarityBtn')}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
