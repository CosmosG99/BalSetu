import React, { useState, useRef, useEffect } from 'react';
import { useDemo, DEMO_SCENARIOS } from '../../context/DemoContext';
import { useCases } from '../../context/CaseContext';
import { useNavigate } from 'react-router-dom';
import { Sparkles, RotateCcw, Play, ChevronDown, CheckCircle } from 'lucide-react';

export const DemoModeDropdown: React.FC = () => {
  const { loadScenario, resetDemoDataset } = useDemo();
  const { updateReportDraft, submitReport } = useCases();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [loadingScenario, setLoadingScenario] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExecuteScenario = async (scenarioId: string) => {
    setLoadingScenario(scenarioId);
    const data = loadScenario(scenarioId);
    updateReportDraft(data);

    try {
      const createdCase = await submitReport(data);
      setTimeout(() => {
        setLoadingScenario(null);
        setIsOpen(false);
        navigate(`/responder/cases/${createdCase.id}`);
      }, 500);
    } catch (e) {
      setLoadingScenario(null);
    }
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3.5 py-2 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 text-purple-200 border border-purple-500/35 font-bold text-xs flex items-center space-x-2 transition-all shadow-sm"
      >
        <Sparkles className="w-3.5 h-3.5 text-brand-magenta animate-pulse" />
        <span>Demo Mode</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-brand-purple/40 shadow-2xl z-50 p-4 space-y-3 animate-fade-in text-left">
          
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-white uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-brand-purple" />
              <span>Demo Mode</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Sample Cases</span>
          </div>

          <p className="text-[11px] text-slate-400">
            Select a test scenario to auto-generate a sample case and jump into the responder workflow:
          </p>

          {/* Sample Cases List */}
          <div className="space-y-2">
            {DEMO_SCENARIOS.map((sc) => (
              <button
                key={sc.id}
                onClick={() => handleExecuteScenario(sc.id)}
                disabled={loadingScenario !== null}
                className="w-full text-left p-2.5 rounded-xl bg-slate-800/80 hover:bg-brand-purple/20 border border-slate-700 hover:border-brand-purple/50 transition-all flex flex-col space-y-1 relative group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-purple-300">
                    {sc.badge}
                  </span>
                  <Play className="w-3 h-3 text-brand-purple opacity-70 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="text-xs font-bold text-white line-clamp-1">
                  {sc.title.replace(/^SCENARIO \d+: /, '')}
                </div>
                <div className="text-[10px] text-slate-400 font-mono line-clamp-1">
                  {sc.subtitle}
                </div>

                {loadingScenario === sc.id && (
                  <div className="absolute inset-0 bg-slate-950/90 rounded-xl flex items-center justify-center space-x-2 text-xs text-purple-300 font-semibold">
                    <span className="animate-spin">⏳</span>
                    <span>Creating Sample Case...</span>
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Reset Sample Data Button */}
          <div className="pt-2 border-t border-slate-800">
            <button
              onClick={() => {
                resetDemoDataset();
                setIsOpen(false);
              }}
              className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-red-400 text-xs font-semibold border border-slate-700 transition-colors flex items-center justify-center space-x-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Sample Data</span>
            </button>
          </div>

        </div>
      )}
    </div>
  );
};
