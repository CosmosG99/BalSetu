import React from 'react';
import { useCases } from '../../context/CaseContext';
import { WifiOff, HardDriveDownload } from 'lucide-react';

export const OfflineBanner: React.FC = () => {
  const { isOffline, savedOfflineDraft } = useCases();

  if (!isOffline && !savedOfflineDraft) return null;

  return (
    <div className="bg-amber-500/15 border-b border-amber-500/30 text-amber-200 px-4 py-2 text-xs flex items-center justify-center space-x-2 font-medium">
      <WifiOff className="w-4 h-4 text-amber-400 animate-pulse" />
      <span>
        {savedOfflineDraft
          ? 'Draft saved locally — ready to sync when connection is restored.'
          : 'Low connectivity detected. Reports will be saved locally.'}
      </span>
      <span className="bg-amber-500/20 text-amber-300 font-mono text-[10px] px-2 py-0.5 rounded border border-amber-500/40">
        Offline Mode Active
      </span>
    </div>
  );
};
