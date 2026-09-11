import React, { useState } from 'react';
import { Copy, Check, QrCode, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

interface QRCardProps {
  caseId: string;
  size?: number;
}

export const QRCard: React.FC<QRCardProps> = ({ caseId, size = 160 }) => {
  const [copied, setCopied] = useState(false);
  const trackUrl = `${window.location.origin}/track/${caseId}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(trackUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Generate deterministic synthetic SVG QR grid based on caseId string hash
  const generateGrid = () => {
    const grid = [];
    let hash = 0;
    for (let i = 0; i < caseId.length; i++) {
      hash = (hash << 5) - hash + caseId.charCodeAt(i);
      hash |= 0;
    }
    const cols = 15;
    for (let r = 0; r < cols; r++) {
      const row = [];
      for (let c = 0; c < cols; c++) {
        // Standard QR corners
        const isCorner =
          (r < 4 && c < 4) || (r < 4 && c >= cols - 4) || (r >= cols - 4 && c < 4);
        if (isCorner) {
          const isOuterBorder = r === 0 || r === 3 || c === 0 || c === 3 || r === cols - 1 || r === cols - 4 || c === cols - 1 || c === cols - 4;
          const isInnerSpot = (r === 1.5 && c === 1.5) || (r === 1.5 && c === cols - 2.5) || (r === cols - 2.5 && c === 1.5);
          row.push(isOuterBorder || isInnerSpot);
        } else {
          const val = Math.abs(Math.sin((r + 1) * (c + 1) * hash)) > 0.45;
          row.push(val);
        }
      }
      grid.push(row);
    }
    return grid;
  };

  const grid = generateGrid();

  return (
    <div className="glass-panel p-5 rounded-2xl border border-white/10 flex flex-col items-center text-center space-y-4 max-w-xs mx-auto shadow-xl">
      <div className="flex items-center space-x-2 text-brand-purple font-semibold text-xs uppercase tracking-wider">
        <QrCode className="w-4 h-4" />
        <span>Scan or Save QR Code</span>
      </div>

      <div className="bg-white p-3 rounded-xl shadow-inner inline-block">
        <svg width={size} height={size} viewBox="0 0 15 15" className="shape-rendering-crisp">
          {grid.map((row, r) =>
            row.map((cell, c) => (
              <rect
                key={`${r}-${c}`}
                x={c}
                y={r}
                width="1"
                height="1"
                fill={cell ? '#0F172A' : '#FFFFFF'}
              />
            ))
          )}
        </svg>
      </div>

      <div className="w-full space-y-2">
        <div className="text-xs text-slate-400 font-mono bg-slate-900/60 p-2 rounded-lg border border-slate-800 break-all select-all flex items-center justify-between">
          <span className="truncate mr-2">{caseId}</span>
          <button
            onClick={copyToClipboard}
            className="text-brand-purple hover:text-white p-1 transition-colors"
            title="Copy Track URL"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        <Link
          to={`/track/${caseId}`}
          className="w-full inline-flex items-center justify-center space-x-2 py-2 px-3 bg-brand-purple/20 hover:bg-brand-purple/30 text-purple-200 border border-brand-purple/40 rounded-xl text-xs font-medium transition-all"
        >
          <span>Open Tracking Page</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
