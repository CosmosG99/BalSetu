import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Heart, ExternalLink } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 py-16 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-10">
        
        {/* Column 1: Brand & Disclaimer */}
        <div className="space-y-4 md:col-span-2">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-purple to-brand-magenta p-0.5 shadow-glow-purple">
              <div className="w-full h-full bg-white dark:bg-brand-dark rounded-[10px] flex items-center justify-center">
                <Shield className="w-5 h-5 text-brand-purple" />
              </div>
            </div>
            <div>
              <span className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">{t('appName')}</span>
              <p className="text-[11px] text-slate-500 font-medium">{t('tagline')}</p>
            </div>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm">
            {t('footerTagline')}
          </p>

          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 space-y-1 shadow-sm">
            <div className="font-bold text-amber-600 dark:text-amber-400">⚠️ Hackathon Concept & Simulated Integrations</div>
            <p>
              {t('footerPrototypeNotice')}
            </p>
          </div>
        </div>

        {/* Column 2: Platform Links */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Platform</div>
          <ul className="space-y-2.5 text-xs">
            <li>
              <Link to="/report" className="hover:text-purple-600 dark:hover:text-purple-300 transition-colors">
                {t('btnReportConcern')}
              </Link>
            </li>
            <li>
              <Link to="/track" className="hover:text-purple-600 dark:hover:text-purple-300 transition-colors">
                {t('navTrack')}
              </Link>
            </li>
            <li>
              <Link to="/how-it-works" className="hover:text-purple-600 dark:hover:text-purple-300 transition-colors">
                {t('navHowItWorks')}
              </Link>
            </li>
            <li>
              <Link to="/responder" className="hover:text-purple-600 dark:hover:text-purple-300 transition-colors flex items-center gap-1 text-brand-purple font-semibold">
                <span>{t('btnResponderDashboard')}</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </li>
            <li>
              <Link to="/trusted-reporter" className="hover:text-purple-600 dark:hover:text-purple-300 transition-colors">
                {t('trustedRepHeading')}
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Resources & Safety */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">{t('navResources')}</div>
          <ul className="space-y-2.5 text-xs">
            <li>
              <Link to="/resources" className="hover:text-purple-600 dark:hover:text-purple-300 transition-colors">
                {t('safetyEduHeading')}
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-purple-600 dark:hover:text-purple-300 transition-colors">
                {t('privacyAnonTitle')}
              </Link>
            </li>
            <li>
              <Link to="/impact" className="hover:text-purple-600 dark:hover:text-purple-300 transition-colors">
                {t('navImpact')}
              </Link>
            </li>
            <li>
              <Link to="/admin" className="hover:text-purple-600 dark:hover:text-purple-300 transition-colors">
                {t('btnAdminDashboard')}
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 4: Project Info */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Project</div>
          <ul className="space-y-2.5 text-xs">
            <li>
              <Link to="/about" className="hover:text-purple-600 dark:hover:text-purple-300 transition-colors">
                {t('navAbout')} {t('balSurakshaBadge')}
              </Link>
            </li>
            <li>
              <a href="#faq" className="hover:text-purple-600 dark:hover:text-purple-300 transition-colors">
                {t('faqBadge')}
              </a>
            </li>
            <li>
              <span className="text-slate-500 block">Bit N Build Hackathon</span>
            </li>
          </ul>

          <div className="pt-2 flex items-center space-x-2 text-[11px] text-emerald-600 dark:text-emerald-400">
            <Lock className="w-3.5 h-3.5" />
            <span>{t('heroPrivacyBadge')} • {t('encryptedNotice')}</span>
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-slate-200 dark:border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 space-y-3 sm:space-y-0">
        <div>© 2026 {t('appName')} Team — {t('footerRights')}</div>
        <div className="flex items-center space-x-1">
          <span>Crafted with</span>
          <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
          <span>for Child Protection & Civic Technology</span>
        </div>
      </div>
    </footer>
  );
};
