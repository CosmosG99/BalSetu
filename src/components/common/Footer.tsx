import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, EyeOff, Heart, HeartHandshake } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-950 border-t border-white/10 text-slate-400 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Column 1: Brand & Disclaimer */}
        <div className="space-y-4 md:col-span-2">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-brand-purple flex items-center justify-center text-white">
              <Shield className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">RAKSHAK</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed max-w-md">
            Rakshak is a first-mile child-safety coordination prototype developed for Bit N Build Hackathon under Track 2: Bal Suraksha (Support Ecosystems). Designed to turn bystander concern into immediate, coordinated protection.
          </p>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <div className="font-semibold text-amber-400 flex items-center space-x-1">
              <span>⚠️ Prototype & Synthetic Data Disclaimer</span>
            </div>
            <p>
              This application is an independent hackathon concept prototype. It is NOT officially connected to or endorsed by Indian Railways, Railway Protection Force (RPF), CHILDLINE, TrackChild, Police, or any government body. All reports, locations, and missing-child records are simulated.
            </p>
          </div>
        </div>

        {/* Column 2: Navigation Links */}
        <div className="space-y-3">
          <div className="text-sm font-semibold text-white uppercase tracking-wider">Quick Navigation</div>
          <ul className="space-y-2 text-xs">
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
              <Link to="/resources" className="hover:text-purple-300 transition-colors">
                Safety Resources
              </Link>
            </li>
            <li>
              <Link to="/trusted-reporter" className="hover:text-purple-300 transition-colors flex items-center gap-1 text-brand-purple font-medium">
                <HeartHandshake className="w-3.5 h-3.5" />
                <span>Join Trusted Reporter Network</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Response Portals */}
        <div className="space-y-3">
          <div className="text-sm font-semibold text-white uppercase tracking-wider">Response Portals</div>
          <ul className="space-y-2 text-xs">
            <li>
              <Link to="/responder" className="hover:text-purple-300 transition-colors">
                Responder Command Center
              </Link>
            </li>
            <li>
              <Link to="/responder/map" className="hover:text-purple-300 transition-colors">
                Transit Incident Map
              </Link>
            </li>
            <li>
              <Link to="/responder/matches" className="hover:text-purple-300 transition-colors">
                Missing Child Match Assistance
              </Link>
            </li>
            <li>
              <Link to="/admin" className="hover:text-purple-300 transition-colors">
                Admin Analytics Dashboard
              </Link>
            </li>
          </ul>

          <div className="pt-2 flex items-center space-x-2 text-[11px] text-emerald-400">
            <Lock className="w-3.5 h-3.5" />
            <span>Privacy First • Zero Personal Data Required</span>
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 space-y-3 sm:space-y-0">
        <div>© 2026 RAKSHAK Team — Bit N Build Hackathon Prototype.</div>
        <div className="flex items-center space-x-1">
          <span>Crafted with</span>
          <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
          <span>for Child Protection & Civic Well-being</span>
        </div>
      </div>
    </footer>
  );
};
