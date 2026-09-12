import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Activity, AlertCircle, ArrowRight, CheckCircle2, Loader2, Lock, Search } from 'lucide-react';
import { trackCase, iso } from '../api/cases';
import { StatusBadge } from '../components/common/StatusBadge';
import { CaseStatus } from '../types';

type PublicCase = Awaited<ReturnType<typeof trackCase>>;
const statusMap: Record<string, CaseStatus> = { new: 'NEW', under_review: 'UNDER_REVIEW', assigned: 'ASSIGNED', escalated: 'INTERVENTION', resolved: 'RESOLVED', closed: 'RESOLVED' };

export const TrackPage: React.FC = () => {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const [input, setInput] = useState(caseId || '');
  const [result, setResult] = useState<PublicCase | null>(null);
  const [loading, setLoading] = useState(Boolean(caseId));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!caseId) return;
    let active = true;
    setLoading(true); setError(null);
    void trackCase(caseId).then((data) => active && setResult(data)).catch((err) => active && setError(err instanceof Error ? err.message : 'Unable to find this report.')).finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [caseId]);

  const search = (event: React.FormEvent) => {
    event.preventDefault();
    const cleaned = input.trim().toUpperCase();
    if (cleaned) navigate(`/app/track/${cleaned}`);
  };

  return <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-8">
    <div className="text-center space-y-3">
      <div className="w-12 h-12 rounded-2xl bg-teal-700/10 text-teal-700 mx-auto flex items-center justify-center"><Search className="w-6 h-6" /></div>
      <h1 className="text-3xl font-extrabold text-charcoal-800 dark:text-charcoal-100">Track a Report</h1>
      <p className="text-xs text-charcoal-600 dark:text-charcoal-300 max-w-md mx-auto">Enter your case reference to see its privacy-safe progress.</p>
      <form onSubmit={search} className="flex flex-col sm:flex-row items-center gap-2 max-w-lg mx-auto pt-2">
        <input value={input} onChange={(event) => setInput(event.target.value)} placeholder="e.g. RAK-ABC123" className="w-full px-4 py-3.5 bg-white dark:bg-forest-850 border border-charcoal-200 dark:border-white/10 rounded-xl text-sm font-mono" />
        <button type="submit" className="w-full sm:w-auto py-3.5 px-6 rounded-xl bg-teal-700 text-white font-bold text-xs flex items-center justify-center gap-2"><span>TRACK REPORT</span><ArrowRight className="w-4 h-4" /></button>
      </form>
    </div>
    <div className="p-3.5 rounded-xl bg-accentCyan/10 border border-accentCyan/30 text-xs flex items-start gap-2 text-charcoal-700 dark:text-charcoal-200"><Lock className="w-4 h-4 text-accentCyan flex-shrink-0" /><span>For privacy, this view never reveals location, reporter identity, evidence, responder details, internal notes, or AI assessment data.</span></div>
    {loading && <div className="natural-panel p-10 text-center space-y-3"><Loader2 className="w-7 h-7 text-teal-700 animate-spin mx-auto" /><p className="text-xs">Looking up your report…</p></div>}
    {error && !loading && <div className="natural-panel p-8 text-center space-y-3"><AlertCircle className="w-10 h-10 text-amberGold-600 mx-auto" /><h2 className="font-bold">Report not available</h2><p className="text-xs text-charcoal-500">{error}</p></div>}
    {result && !loading && <section className="natural-panel p-6 sm:p-8 rounded-3xl space-y-6 shadow-modal">
      <div className="flex items-start justify-between gap-3 border-b border-charcoal-200 dark:border-charcoal-800 pb-4"><div><span className="text-[10px] text-charcoal-500 font-mono uppercase">Case reference</span><h2 className="text-2xl font-extrabold font-mono">{result.caseId}</h2><p className="text-xs text-charcoal-500 mt-1">Category: {result.category.replace(/_/g, ' ')}</p></div><StatusBadge status={statusMap[result.status] || 'NEW'} size="sm" /></div>
      <div className="space-y-3"><h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2"><Activity className="w-4 h-4 text-teal-700" />Resolution progress</h3>{result.timelinePublic.map((event, index) => <div key={`${event.status}-${index}`} className="p-3 rounded-xl border border-charcoal-200 dark:border-charcoal-800 flex gap-3 text-xs"><CheckCircle2 className="w-4 h-4 text-teal-700 flex-shrink-0" /><div className="flex-1"><div className="font-bold capitalize">{event.status.replace(/_/g, ' ')}</div><p className="text-charcoal-600 dark:text-charcoal-300 mt-1">{event.note}</p></div><time className="text-[10px] text-charcoal-500 whitespace-nowrap">{new Date(iso(event.at)).toLocaleString()}</time></div>)}</div>
    </section>}
  </div>;
};
