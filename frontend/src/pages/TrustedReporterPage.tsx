import React, { useState } from 'react';
import { HeartHandshake, CheckCircle2, ShieldCheck, Zap, MapPin, Award, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { registerReporter } from '../api/operations';

export const TrustedReporterPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [role, setRole] = useState('Station Vendor');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [station, setStation] = useState('Mumbai Central');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await registerReporter({ name, phone, type: role === 'NGO Volunteer' ? 'volunteer' : 'transit_worker', zone: station });
      setSubmitted(true);
    } catch (err) { setError(err instanceof Error ? err.message : 'Unable to register your application.'); }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-purple to-brand-magenta text-white mx-auto flex items-center justify-center shadow-glow-purple">
          <HeartHandshake className="w-7 h-7" />
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white">Become a Verified Community Reporter</h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
          Empowering station vendors, auto/rickshaw drivers, railway workers, and NGO volunteers to turn daily vigilance into instant protection.
        </p>
      </div>

      {/* Benefits Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-white/10 space-y-2 shadow-sm">
          <Zap className="w-6 h-6 text-brand-purple mx-auto" />
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase">1-Tap Fast Reporting</h4>
          <p className="text-[11px] text-slate-600 dark:text-slate-400">Pre-saved station locations and gate presets for sub-10 second reporting.</p>
        </div>
        <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-white/10 space-y-2 shadow-sm">
          <Award className="w-6 h-6 text-brand-magenta mx-auto" />
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase">Verification Badge</h4>
          <p className="text-[11px] text-slate-600 dark:text-slate-400">Higher priority routing weighting for verified station personnel.</p>
        </div>
        <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-white/10 space-y-2 shadow-sm">
          <Lock className="w-6 h-6 text-emerald-600 dark:text-emerald-400 mx-auto" />
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase">Protected Identity</h4>
          <p className="text-[11px] text-slate-600 dark:text-slate-400">Your profile is kept strictly confidential within the responder network.</p>
        </div>
      </div>

      {/* Form or Success State */}
      {!submitted ? (
        <form onSubmit={handleSubmit} className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-white/10 space-y-6 shadow-2xl">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-3">
            Reporter Network Application
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <label className="text-slate-700 dark:text-slate-300 font-bold block mb-1">Your Role / Occupation</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-brand-purple shadow-sm"
              >
                <option value="Station Vendor">Station Vendor / Shopkeeper</option>
                <option value="Auto/Rickshaw Driver">Auto / Rickshaw Driver</option>
                <option value="Transport Worker">Transport Worker / Bus Conductor</option>
                <option value="Railway Staff">Railway Staff / Cleaner</option>
                <option value="NGO Volunteer">NGO Volunteer / Social Worker</option>
              </select>
            </div>

            <div>
              <label className="text-slate-700 dark:text-slate-300 font-bold block mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rajesh Kumar"
                className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-brand-purple shadow-sm"
              />
            </div>

            <div>
              <label className="text-slate-700 dark:text-slate-300 font-bold block mb-1">Phone Number</label>
              <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="e.g. +91 98765 43210" className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-brand-purple shadow-sm" />
            </div>

            <div>
              <label className="text-slate-700 dark:text-slate-300 font-bold block mb-1">Primary Station / Transit Location</label>
              <input
                type="text"
                required
                value={station}
                onChange={(e) => setStation(e.target.value)}
                placeholder="e.g. Mumbai Central Platform 4 Vendor Stall #12"
                className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-brand-purple shadow-sm"
              />
            </div>
          </div>

          {error && <p className="text-xs text-red-600">{error}</p>}

          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-brand-purple to-brand-magenta text-white font-bold text-xs shadow-glow-purple hover:scale-[1.01] transition-all"
          >
            Submit Application & Receive Digital Badge
          </button>
        </form>
      ) : (
        <div className="glass-panel p-8 rounded-3xl border border-slate-200 dark:border-white/10 text-center space-y-4 shadow-2xl animate-fade-in">
          <CheckCircle2 className="w-12 h-12 text-emerald-600 dark:text-emerald-400 mx-auto" />
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">Application Received!</h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto">
            Thank you <strong className="text-purple-700 dark:text-purple-300">{name}</strong>. Your profile as a <strong className="text-slate-900 dark:text-white">{role}</strong> at <strong className="text-slate-900 dark:text-white">{station}</strong> has been registered in the prototype database.
          </p>
          <div className="pt-2">
            <Link
              to="/report"
              className="py-3 px-6 rounded-xl bg-brand-purple text-white font-bold text-xs shadow-glow-purple inline-block"
            >
              Test Trusted Reporter Flow
            </Link>
          </div>
        </div>
      )}

      <div className="text-center text-xs text-slate-500">
        Note: Public anonymous reporting always remains available for everyone without an account.
      </div>

    </div>
  );
};
