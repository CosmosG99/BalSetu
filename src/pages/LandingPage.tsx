import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useCases } from '../context/CaseContext';
import {
  ShieldAlert,
  ArrowRight,
  Eye,
  Send,
  Cpu,
  Network,
  ShieldCheck,
  Lock,
  HeartHandshake,
  CheckCircle2,
  PhoneCall,
  Sparkles,
  MapPin,
  Clock,
  ChevronDown,
  ChevronUp,
  Globe,
  AlertTriangle,
  UserCheck,
  Layers,
  HelpCircle,
  Zap,
  Users,
  Compass
} from 'lucide-react';
import { RiskBadge } from '../components/common/RiskBadge';
import { StatusBadge } from '../components/common/StatusBadge';

export const LandingPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Active step for 5-step interactive workflow
  const [activeWorkflowStep, setActiveWorkflowStep] = useState(0);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const workflowSteps = [
    {
      num: '01',
      title: 'NOTICE',
      subtitle: 'Bystander spots child at risk',
      desc: 'A citizen, vendor, auto driver, or passenger notices a child who appears lost, distressed, or travelling alone in a crowded station or terminal.',
      icon: Eye,
      mockTitle: 'Observation Signal Detected',
      mockDesc: 'Platform 4 • Child alone near ticket counter • Crying'
    },
    {
      num: '02',
      title: 'REPORT',
      subtitle: 'Submits 30-second report',
      desc: 'Using a lightweight mobile interface, the bystander submits key details without creating an account. Face blur auto-applied.',
      icon: Send,
      mockTitle: 'Anonymous Report Submitted',
      mockDesc: 'Case ID: RB-2026-10482 • Anonymous = ON • Face Blur = ACTIVE'
    },
    {
      num: '03',
      title: 'TRIAGE',
      subtitle: 'AI prioritizes risk indicators',
      desc: 'Rakshak AI assesses incident urgency (0-100 score), extracts behavioral vulnerability flags, and prepares advisory recommendations.',
      icon: Cpu,
      mockTitle: 'AI Triage Completed',
      mockDesc: 'Assessed Risk: 78/100 (HIGH PRIORITY) • Advisory Only'
    },
    {
      num: '04',
      title: 'CONNECT',
      subtitle: 'Routes to station response cell',
      desc: 'Simulated dispatch matrix alerts local station child help desk, railway response unit, and verified support partners simultaneously.',
      icon: Network,
      mockTitle: 'Smart Routing Dispatched',
      mockDesc: 'Station Protection Desk NOTIFIED • Support Partner PENDING'
    },
    {
      num: '05',
      title: 'RESPOND',
      subtitle: 'Human responder verifies & acts',
      desc: 'Authorized ground personnel verify the situation, perform a physical welfare check, and log audit progress through safe resolution.',
      icon: ShieldCheck,
      mockTitle: 'Ground Intervention Active',
      mockDesc: 'Officer R. Sharma assigned • Ground welfare check in progress'
    }
  ];

  const useCasesList = [
    {
      title: 'Lost / Separated Child',
      scenario: 'Child crying alone near ticket counter after getting separated from family during rush hour.',
      solution: 'Triggers priority station alert and PA announcement coordination.',
      icon: HelpCircle,
      risk: 'HIGH'
    },
    {
      title: 'Unaccompanied Minor Travel',
      scenario: 'Minor carrying heavy luggage asking strangers about long-distance buses without adult supervision.',
      solution: 'Routes alert to bus terminal security and local support desk.',
      icon: UserCheck,
      risk: 'MEDIUM'
    },
    {
      title: 'Child in Distress',
      scenario: 'Visible emotional panic, fear, or crying in concourse.',
      solution: 'Dispatches nearby ground volunteer for immediate gentle inquiry.',
      icon: AlertTriangle,
      risk: 'HIGH'
    },
    {
      title: 'Potential Trafficking Concern',
      scenario: 'Coerced movement of anxious child by non-responsive adult avoiding security checkpoints.',
      solution: 'Triggers critical priority alarm to station rapid response unit.',
      icon: ShieldAlert,
      risk: 'CRITICAL'
    },
    {
      title: 'Possible Physical Abuse / Coercion',
      scenario: 'Bystander notices forceful restraint or physical threats.',
      solution: 'Escalates case directly to station duty supervisor.',
      icon: Lock,
      risk: 'CRITICAL'
    },
    {
      title: 'Bullying / Peer Intimidation',
      scenario: 'Group of youths harassing a younger child near transit exits.',
      solution: 'Directs nearby station staff to clear exit concourse.',
      icon: Users,
      risk: 'LOW'
    }
  ];

  const faqs = [
    {
      q: 'What is Rakshak?',
      a: 'Rakshak is a first-mile child-safety coordination platform designed for transit hubs, railway stations, and bus terminals. It connects bystander observations to a coordinated response network quickly, safely, and anonymously.'
    },
    {
      q: 'Can I report a concern completely anonymously?',
      a: 'Yes. Anonymous reporting is enabled by default. We do not require your name, phone number, email, or account creation to submit a child safety concern.'
    },
    {
      q: 'Does Rakshak use facial recognition to identify children?',
      a: 'No. Rakshak does NOT perform facial identification or public surveillance. Images submitted by bystanders automatically feature face-blur protection and are strictly restricted to authorized ground responders for physical verification.'
    },
    {
      q: 'Who receives the submitted report?',
      a: 'Reports are processed through Rakshak AI triage and dispatched to the designated local station response cell, child help desk, and verified support partners at that specific transit node.'
    },
    {
      q: 'Is Rakshak an official government application?',
      a: 'No. Rakshak is an independent conceptual prototype developed for the Bit N Build Hackathon under Track 2: Bal Suraksha. Integrations displayed are simulated concepts.'
    },
    {
      q: 'What happens after I submit a report?',
      a: 'You receive a unique Case ID (e.g. RB-2026-10482) and QR code. You can track high-level resolution progress anytime without exposing sensitive data.'
    },
    {
      q: 'What information is stored?',
      a: 'Only the incident description, approximate station location, timestamp, and optional evidence media necessary for ground responders to assess the situation.'
    },
    {
      q: 'Can I track my report status?',
      a: 'Yes. Use your unique Case ID on the /track page to view high-level milestone progress (e.g., Report Received → AI Triaged → Responder Assigned → Resolved).'
    }
  ];

  return (
    <div className="space-y-28 pb-20 overflow-x-hidden">
      
      {/* Privacy Guarantee Top Strip */}
      <div className="bg-brand-purple/10 border-b border-brand-purple/25 text-purple-200 text-xs py-2.5 px-4 text-center flex items-center justify-center space-x-2 font-medium">
        <Lock className="w-3.5 h-3.5 text-brand-magenta" />
        <span>Anonymous Reporting • Privacy-First Architecture • Human Verification Required</span>
      </div>

      {/* ============================================================ */}
      {/* 1. CINEMATIC HERO SECTION                                      */}
      {/* ============================================================ */}
      <section className="relative pt-8 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        {/* Glow & Backdrop Accents */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-purple/25 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-brand-magenta/15 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Left Column */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs font-bold text-purple-300 shadow-md">
              <Sparkles className="w-3.5 h-3.5 text-brand-magenta animate-pulse" />
              <span>BAL SURAKSHA • CHILD SAFETY & PROTECTION</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
              Turn a moment of concern <br className="hidden sm:block" />
              into a <span className="bg-gradient-to-r from-brand-purple via-purple-300 to-brand-magenta bg-clip-text text-transparent">moment of protection.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
              Rakshak connects people who notice vulnerable children with a coordinated response ecosystem — quickly, safely and anonymously.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <Link
                to="/report"
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-purple to-brand-magenta text-white font-bold text-sm shadow-glow-purple hover:shadow-glow-magenta hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-2"
              >
                <span>Report a Concern</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/how-it-works"
                className="px-8 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 font-semibold text-sm border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-center space-x-2 text-center"
              >
                <span>See How It Works</span>
              </Link>
            </div>

            <div className="pt-2 flex items-center space-x-3 text-xs text-slate-400 font-mono">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Anonymous reporting
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Privacy-first
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Human verification
              </span>
            </div>

          </div>

          {/* Hero Right Column: Transit Environment Graphic + Floating Case Card */}
          <div className="lg:col-span-5 relative">
            
            <div className="glass-panel p-6 rounded-3xl border border-white/15 shadow-2xl relative space-y-4 overflow-hidden">
              
              {/* Graphic Concourse Simulation */}
              <div className="relative h-64 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-grid-pattern opacity-20" />
                
                {/* Simulated Railway Tracks & Node Lines */}
                <svg className="absolute inset-0 w-full h-full opacity-40">
                  <path d="M 0 100 Q 150 50 300 120 T 450 80" fill="none" stroke="#8B5CF6" strokeWidth="2" strokeDasharray="4 4" />
                  <path d="M 0 180 Q 200 120 450 160" fill="none" stroke="#D946EF" strokeWidth="2" strokeDasharray="4 4" />
                </svg>

                {/* Radar Pulse Circle */}
                <div className="relative w-28 h-28 rounded-full border-2 border-brand-purple/40 flex items-center justify-center animate-pulse">
                  <div className="w-16 h-16 rounded-full bg-brand-purple/20 border border-brand-purple/60 flex items-center justify-center text-brand-purple">
                    <MapPin className="w-8 h-8 animate-bounce" />
                  </div>
                </div>

                <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-lg border border-slate-800 text-[10px] font-mono font-bold text-slate-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  <span>LIVE TRANSIT RADAR • MUMBAI CENTRAL</span>
                </div>
              </div>

              {/* Floating Case Card Overlay */}
              <div className="p-4 rounded-2xl bg-slate-900/95 border border-brand-purple/40 shadow-glow-purple space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-extrabold text-brand-purple">RB-2026-10482</span>
                  <RiskBadge level="HIGH" score={78} size="sm" />
                </div>

                <div className="text-xs font-bold text-white">Child appears lost & distressed</div>
                <div className="text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Mumbai Central Station • Platform 4</span>
                  <StatusBadge status="ROUTED" size="sm" />
                </div>
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ============================================================ */}
      {/* 2. HERO BELOW-FOLD SECTION (SPOT, CONNECT, RESPOND)            */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-center">
        
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Every child deserves a safe way home.</h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            From bystander observation to human ground intervention in three connected pillars.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="glass-panel glass-panel-hover p-8 rounded-3xl border border-white/10 text-left space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">
              <Eye className="w-6 h-6" />
            </div>
            <span className="text-xs font-mono font-bold text-blue-400">01 • SPOT</span>
            <h3 className="text-xl font-bold text-white">Anyone can report a concern</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Bystanders, station vendors, rickshaw drivers, or passengers submit quick anonymous reports without creating an account.
            </p>
          </div>

          <div className="glass-panel glass-panel-hover p-8 rounded-3xl border border-white/10 text-left space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-brand-purple/20 text-brand-purple border border-brand-purple/30 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">
              <Cpu className="w-6 h-6" />
            </div>
            <span className="text-xs font-mono font-bold text-purple-400">02 • CONNECT</span>
            <h3 className="text-xl font-bold text-white">AI helps structure and route</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Rakshak AI assesses risk indicators, prioritizes urgency, and routes the case to the appropriate local station response team.
            </p>
          </div>

          <div className="glass-panel glass-panel-hover p-8 rounded-3xl border border-white/10 text-left space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400">03 • RESPOND</span>
            <h3 className="text-xl font-bold text-white">Authorized responders act</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Station child protection desks and ground personnel verify the situation, perform physical welfare checks, and ensure safe outcome.
            </p>
          </div>

        </div>

      </section>

      {/* ============================================================ */}
      {/* 3. SECTION — THE PROBLEM                                     */}
      {/* ============================================================ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-white/10 space-y-8 shadow-2xl">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-mono font-bold text-brand-magenta uppercase">The First-Mile Gap</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
              "The first signal often comes from someone who isn't part of the system."
            </h2>
          </div>

          {/* Timeline Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center">
            
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-purple-300">Bystander Signal</div>
              <p className="text-xs text-slate-400">Vendor, driver, or passenger notices a child who appears lost or distressed.</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-amber-300">Uncertainty</div>
              <p className="text-xs text-slate-400">Bystander doesn't know who to contact or whether they should intervene.</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-red-400">Critical Delay</div>
              <p className="text-xs text-slate-400">Time passes while the child moves through high-footfall transit concourses.</p>
            </div>

            <div className="p-5 rounded-2xl bg-brand-purple/20 border border-brand-purple/40 space-y-2">
              <div className="text-xs font-bold text-white">Rakshak Solution</div>
              <p className="text-xs text-purple-200">Turns concern into a 30-second report & routed case in real time.</p>
            </div>

          </div>

          <div className="text-center pt-2 font-mono text-xs font-bold text-brand-purple">
            "Rakshak closes that first-mile gap."
          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. SECTION — HOW RAKSHAK WORKS (SMARTSERVE-STYLE WORKFLOW)   */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <div className="text-center space-y-3">
          <span className="text-xs font-mono font-bold text-purple-400 uppercase">Product Workflow</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">How Rakshak Operates</h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Click through the 5 steps to see how a report travels from observation to ground resolution.
          </p>
        </div>

        {/* Workflow Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {workflowSteps.map((s, idx) => {
            const Icon = s.icon;
            const isSelected = activeWorkflowStep === idx;
            return (
              <button
                key={s.num}
                onClick={() => setActiveWorkflowStep(idx)}
                className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-2 ${
                  isSelected
                    ? 'bg-brand-purple/20 border-brand-purple text-white shadow-glow-purple'
                    : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold">{s.num}</span>
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-brand-magenta' : 'text-slate-500'}`} />
                </div>
                <div className="text-xs font-bold text-white">{s.title}</div>
              </button>
            );
          })}
        </div>

        {/* Selected Workflow Detail Card */}
        <div className="glass-panel p-8 rounded-3xl border border-white/10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center shadow-2xl">
          <div className="space-y-4 text-left">
            <span className="text-xs font-mono font-bold text-brand-purple uppercase">
              STEP {workflowSteps[activeWorkflowStep].num} • {workflowSteps[activeWorkflowStep].title}
            </span>
            <h3 className="text-2xl font-extrabold text-white">
              {workflowSteps[activeWorkflowStep].subtitle}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {workflowSteps[activeWorkflowStep].desc}
            </p>

            <Link
              to="/report"
              className="inline-flex items-center space-x-2 text-xs font-bold text-brand-purple hover:text-purple-300 pt-2 transition-colors"
            >
              <span>Test this workflow step in app</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2">
              <span className="font-bold text-white">{workflowSteps[activeWorkflowStep].mockTitle}</span>
              <span className="text-[10px] text-purple-300">Live State Mockup</span>
            </div>
            <p className="text-slate-300 leading-relaxed">{workflowSteps[activeWorkflowStep].mockDesc}</p>
          </div>
        </div>

      </section>

      {/* ============================================================ */}
      {/* 5. SECTION — PRODUCT SHOWCASE MOCKUP                        */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-center">
        
        <div className="space-y-3">
          <span className="text-xs font-mono font-bold text-brand-purple uppercase">SaaS Product Showcase</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">From a 30-second report to a coordinated response</h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Unified command center view designed for station responders and child welfare teams.
          </p>
        </div>

        <div className="relative glass-panel p-4 sm:p-6 rounded-3xl border border-white/15 shadow-2xl overflow-hidden">
          
          {/* Main Mockup Container */}
          <div className="rounded-2xl bg-slate-950 border border-slate-800 p-4 space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="text-xs font-mono text-slate-400 ml-2">RAKSHAK RESPONSE CENTER v1.0</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono">System Online</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-mono">Active Queue</span>
                <div className="text-lg font-bold text-white font-mono">24 Cases</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-mono">High Priority</span>
                <div className="text-lg font-bold text-amber-400 font-mono">7 Alerts</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-mono">Resolved Today</span>
                <div className="text-lg font-bold text-emerald-400 font-mono">83 Children</div>
              </div>
            </div>
          </div>

        </div>

      </section>

      {/* ============================================================ */}
      {/* 6. THREE CORE SYSTEMS                                         */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Core System 1: Community Reporting */}
        <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-white/10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4 text-left">
            <span className="text-xs font-mono font-bold text-blue-400 uppercase">SYSTEM 01</span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">"Anyone can become the first signal."</h3>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2">✓ No app download required (web kiosk & QR enabled)</li>
              <li className="flex items-center gap-2">✓ Anonymous reporting by default</li>
              <li className="flex items-center gap-2">✓ High-footfall transit station location presets</li>
              <li className="flex items-center gap-2">✓ Face-blur evidence photo upload</li>
            </ul>
            <Link
              to="/report"
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-brand-purple text-white font-bold text-xs shadow-sm transition-all"
            >
              <span>See the reporting flow</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-2 font-mono">
            <div className="text-brand-purple font-bold">Community Bystander Flow</div>
            <p>Select Incident → Choose Station → Describe Situation → Optional Photo → Submit in ~30 sec.</p>
          </div>
        </div>

        {/* Core System 2: AI Triage */}
        <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-white/10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="order-2 md:order-1 p-6 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-2 font-mono">
            <div className="text-brand-magenta font-bold">AI Safety Triage Assessment</div>
            <p>Risk Score: 78/100 (HIGH PRIORITY) • Indicators: Unaccompanied, Distress • Wording: Non-definitive trauma-informed advisory.</p>
            <div className="text-purple-300 font-bold pt-1">"AI assists. Humans decide."</div>
          </div>

          <div className="order-1 md:order-2 space-y-4 text-left">
            <span className="text-xs font-mono font-bold text-brand-magenta uppercase">SYSTEM 02</span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">"AI helps responders focus where urgency is highest."</h3>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2">✓ Automatic incident classification & risk scoring</li>
              <li className="flex items-center gap-2">✓ Vulnerability indicator extraction</li>
              <li className="flex items-center gap-2">✓ Multilingual input understanding (EN, HI, MR)</li>
              <li className="flex items-center gap-2">✓ Explainable non-accusatory recommendations</li>
            </ul>
            <Link
              to="/report"
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-slate-800 text-slate-200 font-bold text-xs border border-slate-700 transition-all"
            >
              <span>Explore AI triage</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Core System 3: Response Ecosystem */}
        <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-white/10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4 text-left">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase">SYSTEM 03</span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">"One report. One case. One coordinated timeline."</h3>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2">✓ Unique Case Reference ID generation</li>
              <li className="flex items-center gap-2">✓ Smart routing to local station protection cells</li>
              <li className="flex items-center gap-2">✓ Responder assignment & status updates</li>
              <li className="flex items-center gap-2">✓ Immutable chain-of-custody audit log</li>
            </ul>
            <Link
              to="/responder"
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-slate-800 text-slate-200 font-bold text-xs border border-slate-700 transition-all"
            >
              <span>Explore the Response Center</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-2 font-mono">
            <div className="text-emerald-400 font-bold">Response Dispatch Matrix</div>
            <p>Case ID: RB-2026-10482 → Railway Protection Desk (NOTIFIED) → Duty Officer Assigned → Intervention Logged.</p>
          </div>
        </div>

      </section>

      {/* ============================================================ */}
      {/* 7. WHY IT MATTERS / PROTOTYPE METRICS                          */}
      {/* ============================================================ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        <div className="space-y-2">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase">Performance Benchmarks</span>
          <h2 className="text-3xl font-extrabold text-white">Prototype Design Targets</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-2">
            <div className="text-3xl sm:text-4xl font-extrabold text-brand-purple font-mono">30 sec</div>
            <div className="text-xs font-bold text-white uppercase">Target Reporting Time</div>
          </div>
          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-2">
            <div className="text-3xl sm:text-4xl font-extrabold text-brand-magenta font-mono">1</div>
            <div className="text-xs font-bold text-white uppercase">Unified Case ID</div>
          </div>
          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-2">
            <div className="text-3xl sm:text-4xl font-extrabold text-blue-400 font-mono">3</div>
            <div className="text-xs font-bold text-white uppercase">Core Response Layers</div>
          </div>
          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-2">
            <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 font-mono">24/7</div>
            <div className="text-xs font-bold text-white uppercase">Designed Availability</div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 8. PRIVACY GUARANTEE SECTION                                   */}
      {/* ============================================================ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-white/10 space-y-8 text-center shadow-2xl">
          
          <div className="space-y-3 max-w-2xl mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mx-auto flex items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
              "Safety should never come at the cost of privacy."
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Rakshak is designed around privacy-first child protection — not mass surveillance.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
              <div className="text-xs font-bold text-white">Anonymous by Default</div>
              <p className="text-xs text-slate-400">No account, phone number, or personal details required from bystanders.</p>
            </div>
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
              <div className="text-xs font-bold text-white">Minimal Collection</div>
              <p className="text-xs text-slate-400">Only information needed to help ground responders locate the child is collected.</p>
            </div>
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
              <div className="text-xs font-bold text-white">Human Verification</div>
              <p className="text-xs text-slate-400">AI output is strictly advisory; physical verification is mandatory before action.</p>
            </div>
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
              <div className="text-xs font-bold text-white">Restricted Access</div>
              <p className="text-xs text-slate-400">Media and precise transit coordinates are encrypted and restricted to authorized teams.</p>
            </div>
          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* 9. MULTILINGUAL INDIA SECTION                                 */}
      {/* ============================================================ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        
        <div className="space-y-3">
          <span className="text-xs font-mono font-bold text-brand-purple uppercase">Regional Accessibility</span>
          <h2 className="text-3xl font-extrabold text-white">Built for the way India communicates</h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
            Native support for English, Hindi, and Marathi across core citizen reporting flows.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-2">
            <span className="text-xs font-mono font-bold text-brand-purple">ENGLISH</span>
            <div className="text-sm font-bold text-white">"Report a Child Safety Concern"</div>
            <p className="text-xs text-slate-400">Connects citizens to response ecosystem quickly and anonymously.</p>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-2">
            <span className="text-xs font-mono font-bold text-brand-magenta">HINDI (हिन्दी)</span>
            <div className="text-sm font-bold text-white">"बाल सुरक्षा संबंधी चिंता की रिपोर्ट करें"</div>
            <p className="text-xs text-slate-400">नागरिकों को त्वरित और गुप्त रूप से सुरक्षा नेटवर्क से जोड़ता है।</p>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-2">
            <span className="text-xs font-mono font-bold text-blue-400">MARATHI (मराठी)</span>
            <div className="text-sm font-bold text-white">"बाल सुरक्षेशी संबंधित घटनेची नोंद करा"</div>
            <p className="text-xs text-slate-400">नागरिकांना जलद आणि अनामितपणे प्रतिसाद यंत्रणेशी जोडतो.</p>
          </div>
        </div>

      </section>

      {/* ============================================================ */}
      {/* 10. SIMULATED RESPONSE NETWORK                                */}
      {/* ============================================================ */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        
        <div className="space-y-2">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase">Simulated Network Architecture</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Prototype Response Network</h2>
        </div>

        <div className="glass-panel p-8 rounded-3xl border border-white/10 space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-xs font-mono font-bold">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-white">CITIZEN REPORT</div>
            <span className="text-brand-purple">→</span>
            <div className="p-3 rounded-xl bg-brand-purple text-white shadow-glow-purple">RAKSHAK AI TRIAGE</div>
            <span className="text-brand-purple">→</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-purple-300">Railway Response</div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-magenta-300">Child Protection</div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-emerald-300">Support Partner</div>
            </div>
          </div>

          <p className="text-[11px] text-slate-500">
            Note: All network routing options represented in this application are simulated prototype concepts.
          </p>
        </div>

      </section>

      {/* ============================================================ */}
      {/* 11. USE CASES CARDS                                          */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="text-center space-y-3">
          <span className="text-xs font-mono font-bold text-brand-purple uppercase">Scenarios Covered</span>
          <h2 className="text-3xl font-extrabold text-white">Designed for High-Footfall Transit Hubs</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {useCasesList.map((uc, idx) => {
            const Icon = uc.icon;
            return (
              <div
                key={idx}
                className="glass-panel glass-panel-hover p-6 rounded-3xl border border-white/10 space-y-3 text-left shadow-lg flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-brand-purple/20 text-brand-purple flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <RiskBadge level={uc.risk as any} size="sm" />
                  </div>

                  <h3 className="text-base font-bold text-white">{uc.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{uc.scenario}</p>
                </div>

                <div className="pt-2 border-t border-slate-800/60 text-[11px] text-purple-300 font-mono">
                  Action: {uc.solution}
                </div>
              </div>
            );
          })}
        </div>

      </section>

      {/* ============================================================ */}
      {/* 12. TRUSTED REPORTER CALLOUT                                  */}
      {/* ============================================================ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-3xl bg-gradient-to-r from-purple-950/60 via-slate-900 to-purple-950/60 border border-purple-500/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2 text-left">
            <span className="text-xs font-mono font-bold text-brand-purple uppercase flex items-center gap-1.5">
              <HeartHandshake className="w-4 h-4" />
              Community Network
            </span>
            <h3 className="text-2xl font-extrabold text-white">"Build a network of people who are already there."</h3>
            <p className="text-xs text-slate-300 max-w-xl">
              Station Vendors • Auto Drivers • Transport Workers • Railway Staff • Shopkeepers • NGO Volunteers
            </p>
          </div>

          <Link
            to="/trusted-reporter"
            className="py-3.5 px-6 rounded-2xl bg-brand-purple hover:bg-brand-purple/90 text-white font-bold text-xs shadow-glow-purple whitespace-nowrap transition-all"
          >
            Explore Trusted Reporter
          </Link>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 13. SAFETY RESOURCES CALLOUT                                  */}
      {/* ============================================================ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="glass-panel p-8 rounded-3xl border border-white/10 space-y-4 shadow-xl">
          <h3 className="text-xl font-bold text-white">Child-Friendly Safety Guidance & Bystander Resources</h3>
          <p className="text-xs text-slate-300 max-w-md mx-auto">
            Learn what to do if lost, how to preserve evidence safely, and how to ask for help in public transit areas.
          </p>
          <div className="pt-2">
            <Link
              to="/resources"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-all"
            >
              <span>Explore Safety Resources</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 14. FAQ ACCORDION SECTION                                     */}
      {/* ============================================================ */}
      <section id="faq" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="text-center space-y-3">
          <span className="text-xs font-mono font-bold text-brand-purple uppercase">Frequently Asked Questions</span>
          <h2 className="text-3xl font-extrabold text-white">Everything You Need to Know</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-900/60 transition-all"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 text-left flex items-center justify-between text-sm font-bold text-white hover:bg-slate-800/50 transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-brand-purple" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>

                {isOpen && (
                  <div className="p-5 pt-0 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </section>

      {/* ============================================================ */}
      {/* 15. HUGE FINAL CLOSING CTA SECTION                            */}
      {/* ============================================================ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="p-10 sm:p-16 rounded-3xl bg-gradient-to-r from-purple-950/80 via-slate-900 to-purple-950/80 border border-brand-purple/40 space-y-6 shadow-2xl relative overflow-hidden">
          
          <div className="space-y-3 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Someone has to notice. <br />
              Someone has to connect. <br />
              <span className="text-brand-purple">Someone has to respond.</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Rakshak helps turn that first moment of concern into coordinated action.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              to="/report"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-purple to-brand-magenta text-white font-bold text-sm shadow-glow-purple hover:scale-105 transition-all flex items-center justify-center space-x-2"
            >
              <ShieldAlert className="w-4 h-4 text-amber-300 animate-pulse" />
              <span>Report a Concern</span>
            </Link>
            <Link
              to="/how-it-works"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold text-sm border border-slate-800 transition-all text-center"
            >
              <span>Explore Rakshak</span>
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
};
