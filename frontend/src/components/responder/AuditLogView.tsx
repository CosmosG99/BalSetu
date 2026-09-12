import React from 'react';
import { AuditLog } from '../../types';
import { ShieldCheck, Clock, UserCheck, Activity } from 'lucide-react';

interface AuditLogViewProps {
  logs: AuditLog[];
}

export const AuditLogView: React.FC<AuditLogViewProps> = ({ logs }) => {
  return (
    <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-white/10 space-y-4 shadow-lg">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center space-x-2 text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
          <Activity className="w-4 h-4 text-brand-purple" />
          <span>Immutable Audit Log & Trail</span>
        </div>
        <span className="text-[10px] text-slate-500 font-mono">Chain of Custody</span>
      </div>

      <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
        {logs.map((log) => (
          <div key={log.id} className="p-3 rounded-xl bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs space-y-1 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-brand-purple text-[11px]">{log.action}</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                {log.timestamp}
              </span>
            </div>
            <p className="text-slate-700 dark:text-slate-300 text-[11px]">{log.details}</p>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono flex items-center space-x-1 pt-0.5">
              <UserCheck className="w-3 h-3 text-slate-400" />
              <span>Performer: {log.performer}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
