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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-ivory-300 dark:border-charcoal-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Users className="w-6 h-6 text-forest-700 dark:text-sage-300" />
            <h1 className="text-2xl font-extrabold text-charcoal-900 dark:text-ivory-100">{t('matchAssistanceTitle')}</h1>
          </div>
          <p className="text-xs text-charcoal-600 dark:text-ivory-400">
            {t('matchAssistanceSub')}
          </p>
        </div>

        <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-forest-900/10 dark:bg-sage-400/10 text-forest-800 dark:text-sage-300 border border-forest-800/20 dark:border-sage-400/20">
          Sample Case Database
        </span>
      </div>

      {/* Mandatory Warning Banner */}
      <div className="p-4 rounded-2xl bg-amberGold-500/10 border border-amberGold-500/30 text-charcoal-800 dark:text-ivory-200 flex items-start space-x-3 text-xs shadow-sm">
        <AlertTriangle className="w-5 h-5 text-amberGold-600 dark:text-amberGold-400 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="text-charcoal-900 dark:text-ivory-100 block text-sm font-bold">{t('mandatoryWarningTitle')}</strong>
          <p className="mt-0.5 text-charcoal-700 dark:text-ivory-300">
            {t('mandatoryWarningBody')}
          </p>
        </div>
      </div>

      {/* Search Input Simulation Box */}
      <div className="natural-panel p-6 rounded-3xl space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-charcoal-900 dark:text-ivory-100 uppercase tracking-wider flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-terracotta-600 dark:text-terracotta-400" />
            <span>{t('queryImageTitle')}</span>
          </h3>
          <span className="text-xs text-charcoal-500 dark:text-ivory-400 font-mono">1 face detected</span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="w-24 h-24 rounded-2xl overflow-hidden bg-ivory-200 dark:bg-charcoal-950 border border-ivory-300 dark:border-charcoal-700 flex-shrink-0">
            <img src={selectedPhoto} alt="Search query avatar" className="w-full h-full object-cover" />
          </div>

          <div className="space-y-2 flex-1 text-xs">
            <p className="text-charcoal-700 dark:text-ivory-300">
              Query image representation generated. Ready to perform vector similarity lookup against synthetic database.
            </p>
            <button
              onClick={handleRunSearch}
              disabled={searching}
              className="py-2.5 px-5 rounded-xl bg-forest-900 hover:bg-forest-800 text-ivory-100 font-bold text-xs shadow-sm disabled:opacity-50 transition-all flex items-center space-x-2"
            >
              <Search className={`w-3.5 h-3.5 ${searching ? 'animate-spin' : ''}`} />
              <span>{searching ? 'Calculating Similarities...' : t('runSimilaritySearchBtn')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Results Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-charcoal-800 dark:text-ivory-200 uppercase tracking-wider">
          {t('potentialSimilarityMatches')} ({results.length})
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {results.map((item) => (
            <div
              key={item.id}
              className="natural-panel natural-card-hover p-5 rounded-2xl space-y-3 shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Photo & Similarity Pill */}
                <div className="relative rounded-xl overflow-hidden bg-ivory-200 dark:bg-charcoal-950 h-44">
                  <img src={item.photoUrl} alt={item.syntheticName} className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2 bg-white/90 dark:bg-charcoal-900/90 text-forest-700 dark:text-sage-300 font-mono font-bold text-xs px-2.5 py-1 rounded-full border border-forest-800/30 shadow-sm">
                    {item.similarityScore}% Match
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-forest-700 dark:text-sage-400">{item.caseRef}</span>
                    <span className="text-[11px] text-charcoal-500 dark:text-ivory-400 font-mono">{item.gender}, Age {item.age}</span>
                  </div>
                  <h4 className="text-sm font-bold text-charcoal-900 dark:text-ivory-100 line-clamp-1">{item.syntheticName}</h4>
                  <p className="text-xs text-charcoal-600 dark:text-ivory-400 mt-1">Last Seen: <span className="text-charcoal-900 dark:text-ivory-100 font-medium">{item.lastKnownLocation}</span></p>
                  <p className="text-[11px] text-charcoal-500 dark:text-ivory-400 line-clamp-2 mt-1">{item.description}</p>
                </div>
              </div>

              <button className="w-full py-2 px-3 rounded-xl bg-ivory-200 hover:bg-ivory-300 dark:bg-charcoal-800 dark:hover:bg-charcoal-700 text-charcoal-900 dark:text-ivory-100 font-bold text-xs border border-ivory-400 dark:border-charcoal-700 transition-colors flex items-center justify-center space-x-1.5 shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5 text-forest-700 dark:text-sage-300" />
                <span>{t('verifySimilarityBtn')}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
