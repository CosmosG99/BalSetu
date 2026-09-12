import React, { useState } from 'react';
import { useDemo, DEMO_SCENARIOS } from '../../context/DemoContext';
import { useCases } from '../../context/CaseContext';
import { useNavigate } from 'react-router-dom';
import { Play, RotateCcw, Sparkles, ChevronUp, ChevronDown, CheckCircle } from 'lucide-react';

export const DemoModeBar: React.FC = () => {
  const { loadScenario, resetDemoDataset } = useDemo();
  const { updateReportDraft, submitReport } = useCases();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [loadingScenario, setLoadingScenario] = useState<string | null>(null);

  const handleExecuteScenario = async (scenarioId: string) => {
    setLoadingScenario(scenarioId);
    const data = loadScenario(scenarioId);
    updateReportDraft(data);

    // Auto-create report & jump straight into AI Triage / Case Detail for 3-minute hackathon evaluation
    try {
      const createdCase = await submitReport(data);
      setTimeout(() => {
        setLoadingScenario(null);
        navigate(`/responder/cases/${createdCase.id}`);
      }, 600);
    } catch (e) {
      setLoadingScenario(null);
    }
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-4xl">
      <div className="bg-slate-900/95 backdrop-blur-xl border border-brand-purple/40 rounded-2xl shadow-2xl overflow-hidden transition-all">
        {/* Top Header Strip */}
        <div className="bg-gradient-to-r from-purple-950/80 via-slate-900 to-purple-950/80 px-4 py-2 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center space-x-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-magenta opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-purple"></span>
            </span>
            <span className="text-xs font-bold tracking-wider text-purple-300 uppercase flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand-magenta" />
              Hackathon Judge Demo Control
            </span>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <button
              onClick={() => resetDemoDataset()}
              className="text-slate-400 hover:text-red-400 flex items-center space-x-1 transition-colors px-2 py-0.5 rounded-lg hover:bg-slate-800"
              title="Reset synthetic database to initial state"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Data</span>
            </button>
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="text-slate-400 hover:text-white p-1"
            >
              {collapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Expandable Scenario Buttons */}
        {!collapsed && (
          <div className="p-3 grid grid-cols-1 sm:grid-cols-3 gap-2.5 bg-slate-900/80">
            {DEMO_SCENARIOS.map((sc) => (
              <button
                key={sc.id}
                onClick={() => handleExecuteScenario(sc.id)}
                disabled={loadingScenario !== null}
                className="group relative text-left p-3 rounded-xl bg-slate-800/80 hover:bg-brand-purple/20 border border-slate-700 hover:border-brand-purple/50 transition-all flex flex-col justify-between space-y-1 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-purple/30 text-purple-200 font-semibold">
                    {sc.badge}
                  </span>
                  <Play className="w-3.5 h-3.5 text-brand-purple opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </div>
                <div className="text-xs font-bold text-slate-100 group-hover:text-white line-clamp-1">
                  {sc.title.replace(/^SCENARIO \d+: /, '')}
                </div>
                <div className="text-[11px] text-slate-400 line-clamp-1">{sc.subtitle}</div>
                {loadingScenario === sc.id && (
                  <div className="absolute inset-0 bg-slate-950/90 rounded-xl flex items-center justify-center space-x-2 text-xs text-brand-purple font-semibold">
                    <span className="animate-spin text-base">⏳</span>
                    <span>Creating Demo Case...</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
