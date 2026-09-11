import React, { useState } from 'react';
import { Eye, EyeOff, Lock, ShieldCheck, Image as ImageIcon } from 'lucide-react';

interface EvidenceViewerProps {
  photoUrl?: string;
  isBlurredDefault?: boolean;
}

export const EvidenceViewer: React.FC<EvidenceViewerProps> = ({
  photoUrl,
  isBlurredDefault = true
}) => {
  const [blurred, setBlurred] = useState(isBlurredDefault);
  const [hidden, setHidden] = useState(false);

  if (!photoUrl) {
    return (
      <div className="glass-panel p-5 rounded-2xl border border-white/10 text-center space-y-2">
        <ImageIcon className="w-8 h-8 text-slate-600 mx-auto" />
        <div className="text-xs text-slate-400 font-medium">No Image Evidence Attached</div>
        <p className="text-[11px] text-slate-500">Citizen submitted text description only.</p>
      </div>
    );
  }

  return (
    <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3 shadow-lg">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center space-x-2 text-xs font-bold text-white uppercase tracking-wider">
          <Lock className="w-4 h-4 text-brand-purple" />
          <span>Restricted Evidence Viewer</span>
        </div>
        <span className="text-[10px] text-amber-400 font-mono">Synthetic Media</span>
      </div>

      {!hidden ? (
        <div className="relative rounded-xl overflow-hidden bg-slate-950 max-h-72 flex items-center justify-center border border-slate-800">
          <img
            src={photoUrl}
            alt="Evidence preview"
            className={`w-full h-full object-cover transition-all duration-300 ${blurred ? 'blur-md scale-105' : ''}`}
          />
          {blurred && (
            <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center text-xs font-bold text-white font-mono tracking-widest pointer-events-none">
              FACE BLUR PROTECTED
            </div>
          )}
        </div>
      ) : (
        <div className="p-8 rounded-xl bg-slate-950 border border-slate-800 text-center text-xs text-slate-500 font-medium">
          Evidence Media Hidden
        </div>
      )}

      {/* Control Buttons */}
      <div className="flex items-center justify-between text-xs pt-1">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setBlurred(!blurred)}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold border border-slate-700 flex items-center space-x-1.5 transition-colors"
          >
            {blurred ? <Eye className="w-3.5 h-3.5 text-brand-purple" /> : <EyeOff className="w-3.5 h-3.5 text-amber-400" />}
            <span>{blurred ? 'View Unblurred' : 'Blur Image'}</span>
          </button>
          <button
            onClick={() => setHidden(!hidden)}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-colors"
          >
            <span>{hidden ? 'Show Media' : 'Hide Media'}</span>
          </button>
        </div>

        <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          Restricted Access
        </span>
      </div>
    </div>
  );
};
