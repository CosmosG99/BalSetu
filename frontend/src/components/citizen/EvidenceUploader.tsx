import React, { useRef, useState } from 'react';
import { Camera, ShieldAlert, Eye, EyeOff, Trash2, Lock, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface EvidenceUploaderProps {
  photoUrl?: string;
  isBlurred?: boolean;
  isAnonymous: boolean;
  onChangePhoto: (url?: string) => void;
  onChangeBlurred: (blurred: boolean) => void;
  onChangeAnonymous: (anonymous: boolean) => void;
}

export const EvidenceUploader: React.FC<EvidenceUploaderProps> = ({
  photoUrl,
  isBlurred = true,
  isAnonymous,
  onChangePhoto,
  onChangeBlurred,
  onChangeAnonymous
}) => {
  const { t } = useLanguage();
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (file?: File) => {
    setError(null);
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) { setError('Choose a JPG, PNG, or WebP image.'); return; }
    if (file.size > 10 * 1024 * 1024) { setError('Image must be 10MB or smaller.'); return; }
    const reader = new FileReader();
    reader.onload = () => onChangePhoto(typeof reader.result === 'string' ? reader.result : undefined);
    reader.onerror = () => setError('The image could not be read. Please try another file.');
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      
      {/* Critical Safety Notice */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-200 flex items-start space-x-3 text-xs">
        <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-amber-900 dark:text-amber-300 block">Safety Disclaimer</span>
          <p>{t('photoWarning')}</p>
        </div>
      </div>

      {/* Photo Uploader Block */}
      <div className="space-y-3">
        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
          {t('photoTitle')}
        </label>

        {!photoUrl ? (
          <div className="border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-2xl p-4 sm:p-6 text-center space-y-3 bg-white/70 dark:bg-slate-900/50 hover:border-brand-purple/50 transition-all">
            <div className="w-12 h-12 rounded-full bg-brand-purple/10 dark:bg-brand-purple/20 text-brand-purple mx-auto flex items-center justify-center">
              <Camera className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">{t('clickToUpload')}</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">PNG, JPG up to 10MB</p>
            </div>
            <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" capture="environment" className="hidden" onChange={(event) => handleFile(event.target.files?.[0])} />
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 transition-all inline-flex items-center justify-center space-x-2 min-h-[44px]"
            >
              <Camera className="w-3.5 h-3.5 text-brand-purple" />
              <span>Upload Photo</span>
            </button>
            {error && <p className="text-[11px] text-red-600">{error}</p>}
          </div>
        ) : (
          <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-950 flex-shrink-0">
                <img
                  src={photoUrl}
                  alt="Uploaded evidence preview"
                  className={`w-full h-full object-cover transition-all ${isBlurred ? 'blur-md scale-110' : ''}`}
                />
                {isBlurred && (
                  <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center text-[10px] text-white font-mono font-bold">
                    BLURRED
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <div className="text-xs font-semibold text-slate-900 dark:text-white">Evidence attached from this device</div>
                <button
                  type="button"
                  onClick={() => onChangeBlurred(!isBlurred)}
                  className="text-[11px] text-brand-purple hover:text-purple-700 dark:hover:text-purple-300 flex items-center space-x-1 font-medium transition-colors"
                >
                  {isBlurred ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  <span>{isBlurred ? t('previewUnblurred') : t('applyFaceBlur')}</span>
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onChangePhoto(undefined)}
              className="p-2.5 text-slate-400 hover:text-red-500 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors self-end sm:self-auto"
              title="Remove image"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Anonymous Toggle */}
      <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 flex items-center justify-center">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-900 dark:text-white block">{t('anonymousToggle')}</span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">{t('anonymousDesc')}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onChangeAnonymous(!isAnonymous)}
          className={`w-12 h-6 rounded-full transition-colors p-1 relative ${
            isAnonymous ? 'bg-brand-purple' : 'bg-slate-300 dark:bg-slate-800'
          }`}
        >
          <div
            className={`w-4 h-4 rounded-full bg-white transition-transform ${
              isAnonymous ? 'translate-x-6' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      <div className="p-3 rounded-xl bg-slate-100/80 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 flex items-center space-x-2">
        <ShieldCheck className="w-4 h-4 text-brand-purple flex-shrink-0" />
        <span>{t('evidenceRestrictedNotice')}</span>
      </div>

    </div>
  );
};
