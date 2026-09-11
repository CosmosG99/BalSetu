import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Heart, HeartHandshake, ExternalLink } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-950 border-t border-white/10 text-slate-400 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-10">
        
        {/* Column 1: Brand & Prototype Disclaimer */}
        <div className="space-y-4 md:col-span-2">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-purple to-brand-magenta p-0.5 shadow-glow-purple">
              <div className="w-full h-full bg-brand-dark rounded-[10px] flex items-center justify-center">
                <Shield className="w-5 h-5 text-brand-purple" />
              </div>
            </div>
            <div>
              <span className="text-xl font-extrabold text-white tracking-tight">RAKSHAK</span>
              <p className="text-[11px] text-slate-500 font-medium">Protect. Connect. Respond.</p>
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
            Rakshak is a first-mile child-safety coordination platform concept developed for the Bit N Build Hackathon under Track 2: Bal Suraksha (Support Ecosystems). Designed to turn bystander observation into instant protection.
          </p>

          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <div className="font-bold text-amber-400">⚠️ Hackathon Concept & Simulated Integrations</div>
            <p>
              This project is an independent prototype and is not officially affiliated with or endorsed by Indian Railways, Railway Protection Force (RPF), CHILDLINE, Police, or government databases. All data and profiles are 100% synthetic.
            </p>
          </div>
        </div>

        {/* Column 2: Platform Links */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-white uppercase tracking-wider">Platform</div>
          <ul className="space-y-2.5 text-xs">
            <li>
              <Link to="/report" className="hover:text-purple-300 transition-colors">
                Report a Concern
              </Link>
            </li>
            <li>
              <Link to="/track" className="hover:text-purple-300 transition-colors">
                Track Case Status
              </Link>
            </li>
            <li>
              <Link to="/how-it-works" className="hover:text-purple-300 transition-colors">
                How It Works
              </Link>
            </li>
            <li>
              <Link to="/responder" className="hover:text-purple-300 transition-colors flex items-center gap-1 text-brand-purple font-semibold">
                <span>Response Center Portal</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </li>
            <li>
              <Link to="/trusted-reporter" className="hover:text-purple-300 transition-colors">
                Trusted Reporter Network
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Resources & Safety */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-white uppercase tracking-wider">Resources</div>
          <ul className="space-y-2.5 text-xs">
            <li>
              <Link to="/resources" className="hover:text-purple-300 transition-colors">
                Safety Resource Center
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-purple-300 transition-colors">
                Privacy Architecture
              </Link>
            </li>
            <li>
              <Link to="/impact" className="hover:text-purple-300 transition-colors">
                Impact & Metrics
              </Link>
            </li>
            <li>
              <Link to="/admin" className="hover:text-purple-300 transition-colors">
                Admin Analytics
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 4: Project Info */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-white uppercase tracking-wider">Project</div>
          <ul className="space-y-2.5 text-xs">
            <li>
              <Link to="/about" className="hover:text-purple-300 transition-colors">
                About Bal Suraksha
              </Link>
            </li>
            <li>
              <a href="#faq" className="hover:text-purple-300 transition-colors">
                FAQ
              </a>
            </li>
            <li>
              <span className="text-slate-500 block">Bit N Build Hackathon</span>
            </li>
          </ul>

          <div className="pt-2 flex items-center space-x-2 text-[11px] text-emerald-400">
            <Lock className="w-3.5 h-3.5" />
            <span>Privacy First • Zero Data Harvesting</span>
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 space-y-3 sm:space-y-0">
        <div>© 2026 RAKSHAK Team — Built for Bit N Build Hackathon • Bal Suraksha • Track 2.</div>
        <div className="flex items-center space-x-1">
          <span>Crafted with</span>
          <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
          <span>for Child Protection & Civic Technology</span>
        </div>
      </div>
    </footer>
  );
};
