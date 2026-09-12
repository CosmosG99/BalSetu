import React, { useState, useRef, useEffect } from 'react';
import { useDemo, DEMO_SCENARIOS } from '../../context/DemoContext';
import { useCases } from '../../context/CaseContext';
import { useNavigate } from 'react-router-dom';
import { Sparkles, RotateCcw, Play, ChevronDown } from 'lucide-react';

export const DemoModeDropdown: React.FC = () => {
  const { loadScenario, resetDemoDataset } = useDemo();
  const { updateReportDraft, submitReport } = useCases();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [loadingScenario, setLoadingScenario] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3.5 py-2 rounded-xl bg-teal-700/10 hover:bg-teal-700/20 dark:bg-teal-500/20 dark:hover:bg-teal-500/30 text-teal-700 dark:text-teal-300 border border-teal-700/20 dark:border-teal-500/30 font-bold text-xs flex items-center space-x-2 transition-all shadow-sm"
      >
        <Sparkles className="w-3.5 h-3.5 text-teal-700 dark:text-teal-400" />
        <span>Demo Mode</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white dark:bg-charcoal-900 border border-charcoal-200 dark:border-charcoal-800 shadow-modal z-50 p-4 space-y-3 animate-fade-in text-left">
          
          <div className="flex items-center justify-between border-b border-charcoal-200/80 dark:border-charcoal-800 pb-2">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-charcoal-800 dark:text-charcoal-100 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-teal-700 dark:text-teal-400" />
              <span>Demo Mode</span>
            </div>
            <span className="text-[10px] text-charcoal-500 font-mono">Sample Cases</span>
          </div>

          <p className="text-[11px] text-charcoal-600 dark:text-charcoal-400">
            Select a test scenario to auto-generate a sample case and jump into the responder workflow:
          </p>

          <div className="space-y-2">
            {DEMO_SCENARIOS.map((sc) => (
              <button
                key={sc.id}
                onClick={() => handleExecuteScenario(sc.id)}
                disabled={loadingScenario !== null}
                className="w-full text-left p-2.5 rounded-xl bg-ivory-100 dark:bg-charcoal-850 hover:bg-teal-700/10 dark:hover:bg-teal-500/20 border border-charcoal-200 dark:border-charcoal-800 hover:border-teal-700/30 transition-all flex flex-col space-y-1 relative group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-teal-700 dark:text-teal-400">
                    {sc.badge}
                  </span>
                  <Play className="w-3 h-3 text-teal-700 dark:text-teal-400 opacity-70 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="text-xs font-bold text-charcoal-800 dark:text-charcoal-100 line-clamp-1">
                  {sc.title.replace(/^SCENARIO \d+: /, '')}
                </div>
                <div className="text-[10px] text-charcoal-600 dark:text-charcoal-400 font-mono line-clamp-1">
                  {sc.subtitle}
                </div>

                {loadingScenario === sc.id && (
                  <div className="absolute inset-0 bg-white/95 dark:bg-charcoal-900/95 rounded-xl flex items-center justify-center space-x-2 text-xs text-teal-700 dark:text-teal-300 font-semibold">
                    <span className="animate-spin">⏳</span>
                    <span>Creating Sample Case...</span>
                  </div>
                )}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-charcoal-200/80 dark:border-charcoal-800">
            <button
              onClick={() => {
                resetDemoDataset();
                setIsOpen(false);
              }}
              className="w-full py-2 px-3 rounded-xl bg-ivory-100 dark:bg-charcoal-800 hover:bg-ivory-200 dark:hover:bg-charcoal-700 text-charcoal-800 dark:text-charcoal-300 hover:text-coral-600 dark:hover:text-coral-400 text-xs font-semibold border border-charcoal-200 dark:border-charcoal-700 transition-colors flex items-center justify-center space-x-1.5"
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
