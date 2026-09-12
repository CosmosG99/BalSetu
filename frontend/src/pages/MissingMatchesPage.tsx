import React, { useState } from 'react';
import { MissingChildProfile } from '../types';
import { runMatching, verifyMatch } from '../api/operations';
import { useCases } from '../context/CaseContext';
import { useLanguage } from '../context/LanguageContext';
import { Users, Search, AlertTriangle, ShieldCheck, Sparkles, Cpu } from 'lucide-react';

export const MissingMatchesPage: React.FC = () => {
  const { t } = useLanguage();
  const { cases } = useCases();
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<(MissingChildProfile & { matchId: string })[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [selectedPhoto] = useState<string>(
    'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80'
  );

  const handleRunSearch = async () => {
    if (!selectedCaseId) { setError('Select a case before running a matching search.'); return; }
    setSearching(true); setError(null);
    try {
      const response = await runMatching(selectedCaseId);
      setResults(response.candidates.map((match: any) => {
        const record = match.missingChildRecord || {};
        return { matchId: match.id, id: record.id || match.missingChildRecordId, caseRef: record.id || match.missingChildRecordId, syntheticName: 'Potential match record', age: record.ageApprox || 0, gender: 'Protected', photoUrl: record.photoUrl || selectedPhoto, lastKnownLocation: record.lastSeenLocation?.addressText || 'Protected responder record', missingSince: '', description: 'Human verification is required before any action.', similarityScore: Math.round((match.similarityScore || 0) * 100) };
      }));
    } catch (err) { setError(err instanceof Error ? err.message : 'Matching could not be completed.'); }
    finally { setSearching(false); }
  };

  const handleVerify = async (matchId: string) => {
    try { await verifyMatch(matchId, 'confirmed'); setResults((items) => items.filter((item) => item.matchId !== matchId)); }
    catch (err) { setError(err instanceof Error ? err.message : 'Verification could not be saved.'); }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-charcoal-200 dark:border-charcoal-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Cpu className="w-6 h-6 text-accentPurple" />
            <h1 className="text-2xl font-extrabold text-charcoal-800 dark:text-charcoal-100">{t('matchAssistanceTitle')}</h1>
          </div>
          <p className="text-xs text-charcoal-600 dark:text-charcoal-400">
            {t('matchAssistanceSub')}
          </p>
        </div>

        <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-accentPurple/10 text-accentPurple border border-accentPurple/30">
          AI-Assisted Similarity Match
        </span>
      </div>

      {/* Mandatory Warning Banner */}
      <div className="p-4 rounded-2xl bg-amberGold-600/10 border border-amberGold-600/30 text-charcoal-800 dark:text-charcoal-100 flex items-start space-x-3 text-xs shadow-xs">
        <AlertTriangle className="w-5 h-5 text-amberGold-600 dark:text-amberGold-400 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="text-charcoal-900 dark:text-charcoal-100 block text-sm font-bold">{t('mandatoryWarningTitle')}</strong>
          <p className="mt-0.5 text-charcoal-600 dark:text-charcoal-300">
            {t('mandatoryWarningBody')}
          </p>
        </div>
      </div>

      {/* Search Input Simulation Box */}
      <div className="natural-panel p-6 rounded-3xl space-y-4 shadow-modal border border-accentPurple/30">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-charcoal-800 dark:text-charcoal-100 uppercase tracking-wider flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-accentPurple" />
            <span>{t('queryImageTitle')}</span>
          </h3>
          <span className="text-xs text-accentPurple font-mono font-bold bg-accentPurple/10 px-2 py-0.5 rounded border border-accentPurple/20">
            1 Face Vector Pattern Extracted
          </span>
        </div>

        <select value={selectedCaseId} onChange={(event) => setSelectedCaseId(event.target.value)} className="w-full p-3 rounded-xl border border-charcoal-200 dark:border-charcoal-800 bg-white dark:bg-charcoal-950 text-xs">
          <option value="">Select a responder case</option>
          {cases.map((caseItem) => <option key={caseItem.id} value={caseItem.id}>{caseItem.id} — {caseItem.report.location}</option>)}
        </select>
        {error && <p className="text-xs text-terracotta-600">{error}</p>}

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="w-24 h-24 rounded-2xl overflow-hidden bg-ivory-200 dark:bg-charcoal-950 border border-accentPurple/40 flex-shrink-0 shadow-subtle">
            <img src={selectedPhoto} alt="Search query avatar" className="w-full h-full object-cover" />
          </div>

          <div className="space-y-2 flex-1 text-xs">
            <p className="text-charcoal-700 dark:text-charcoal-300 leading-relaxed">
              Query image representation generated. Ready to perform similarity lookup against the current responder record set.
            </p>
            <button
              onClick={handleRunSearch}
              disabled={searching}
              className="py-2.5 px-5 rounded-xl bg-accentPurple hover:bg-accentPurple/90 text-white font-bold text-xs shadow-card disabled:opacity-50 transition-all flex items-center space-x-2 cursor-pointer"
            >
              <Search className={`w-3.5 h-3.5 ${searching ? 'animate-spin' : ''}`} />
              <span>{searching ? 'Calculating Similarities...' : t('runSimilaritySearchBtn')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Results Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-charcoal-800 dark:text-charcoal-100 uppercase tracking-wider">
          {t('potentialSimilarityMatches')} ({results.length})
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {results.map((item) => {
            const isHighConfidence = (item.similarityScore ?? 0) >= 85;

            return (
              <div
                key={item.id}
                className={`natural-panel natural-card-hover p-5 rounded-2xl space-y-3 shadow-card flex flex-col justify-between border ${
                  isHighConfidence ? 'border-accentGreen/40' : 'border-amberGold-600/30'
                }`}
              >
                <div className="space-y-3">
                  {/* Photo & Similarity Pill */}
                  <div className="relative rounded-xl overflow-hidden bg-ivory-200 dark:bg-charcoal-950 h-44 border border-charcoal-200 dark:border-charcoal-800">
                    <img src={item.photoUrl} alt={item.syntheticName} className="w-full h-full object-cover" />
                    <div className={`absolute top-2 right-2 font-mono font-bold text-xs px-2.5 py-1 rounded-full border shadow-sm ${
                      isHighConfidence
                        ? 'bg-accentGreen text-white border-accentGreen'
                        : 'bg-amberGold-600 text-white border-amberGold-600'
                    }`}>
                      {item.similarityScore}% Match
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-teal-700 dark:text-teal-400">{item.caseRef}</span>
                      <span className="text-[11px] text-charcoal-500 font-mono">{item.gender}, Age {item.age}</span>
                    </div>
                    <h4 className="text-sm font-bold text-charcoal-800 dark:text-charcoal-100 line-clamp-1">{item.syntheticName}</h4>
                    <p className="text-xs text-charcoal-600 dark:text-charcoal-400 mt-1">Last Seen: <span className="text-charcoal-800 dark:text-charcoal-100 font-medium">{item.lastKnownLocation}</span></p>
                    <p className="text-[11px] text-charcoal-500 line-clamp-2 mt-1">{item.description}</p>
                  </div>
                </div>

                <button onClick={() => handleVerify(item.matchId)} className="w-full py-2 px-3 rounded-xl bg-ivory-100 hover:bg-ivory-200 dark:bg-charcoal-850 dark:hover:bg-charcoal-800 text-charcoal-800 dark:text-charcoal-100 font-bold text-xs border border-charcoal-200 dark:border-charcoal-700 transition-colors flex items-center justify-center space-x-1.5 shadow-xs cursor-pointer">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-700 dark:text-teal-400" />
                  <span>{t('verifySimilarityBtn')}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
