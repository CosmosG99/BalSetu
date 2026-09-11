import React from 'react';
import { TimelineEvent } from '../../types';
import { CheckCircle2, Circle, Clock, User, ShieldCheck } from 'lucide-react';

interface CaseTimelineProps {
  timeline: TimelineEvent[];
}

export const CaseTimeline: React.FC<CaseTimelineProps> = ({ timeline }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
          <Clock className="w-4 h-4 text-brand-purple" />
          <span>Case Timeline & Accountability</span>
        </h4>
        <span className="text-[10px] text-slate-500 font-mono">Live Audit Record</span>
      </div>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
        {timeline.map((event, idx) => (
          <div key={event.id || idx} className="relative flex items-start space-x-3 group">
            
            {/* Timeline Dot Indicator */}
            <div
              className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                event.completed
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'bg-slate-900 text-slate-600 border border-slate-800'
              }`}
            >
              {event.completed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Circle className="w-3 h-3" />}
            </div>

            {/* Content Box */}
            <div className="space-y-0.5 flex-1">
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold ${event.completed ? 'text-white' : 'text-slate-500'}`}>
                  {event.title}
                </span>
                <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  {event.timestamp}
                </span>
              </div>
              <p className="text-xs text-slate-400">{event.description}</p>
              <div className="text-[10px] text-slate-500 flex items-center space-x-1 font-mono pt-0.5">
                <User className="w-3 h-3 text-brand-purple" />
                <span>Actor: {event.actor}</span>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};
