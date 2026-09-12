import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HowItWorksPage: React.FC = () => {
  const narrativeSteps = [
    {
      num: '01',
      title: 'NOTICE',
      subtitle: 'Bystander Observation',
      desc: 'A citizen, railway staff member, station vendor, auto driver, or bystander notices a child who appears lost, distressed, travelling alone, or at risk.',
      image:
        'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=1200&q=80',
      accentClass: 'border-[#9ad7c8] bg-[#dff5ea] text-[#0f8b73]',
      numColor: 'text-[#0f8b73]'
    },
    {
      num: '02',
      title: 'REPORT',
      subtitle: '30-Second Anonymous Submission',
      desc: 'Using a fast mobile interface, the reporter submits incident type, approximate location, description, and optional photo with face-blur protection.',
      image:
        'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80',
      accentClass: 'border-[#9bd9d5] bg-[#dff5f1] text-[#0e7a6d]',
      numColor: 'text-[#0e7a6d]'
    },
    {
      num: '03',
      title: 'ASSESS',
      subtitle: 'Advisory AI Triage',
      desc: 'Rakshak AI assesses trauma risk indicators (0–100 score), prioritizes urgent cases, and generates human-readable advisory explanations.',
      image:
        'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
      accentClass: 'border-[#c9c5ff] bg-[#ecebff] text-[#4c5bd4]',
      numColor: 'text-[#4c5bd4]'
    },
    {
      num: '04',
      title: 'ROUTE',
      subtitle: 'Smart Dispatch Matrix',
      desc: 'Notifications dispatch simultaneously to platform RPF protection cells, child welfare desks, and verified support partners.',
      image:
        'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80',
      accentClass: 'border-[#efd3a0] bg-[#f9efd7] text-[#b86e1a]',
      numColor: 'text-[#b86e1a]'
    },
    {
      num: '05',
      title: 'RESPOND',
      subtitle: 'Safe Ground Resolution',
      desc: 'On-duty human responders conduct a physical ground check, update the live audit trail, and facilitate safe reunion or shelter handoff.',
      image:
        'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1200&q=80',
      accentClass: 'border-[#afd9b7] bg-[#e5f5e6] text-[#2a8d63]',
      numColor: 'text-[#2a8d63]'
    }
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-4 text-center">
        <h1 className="text-3xl font-extrabold tracking-[-0.06em] text-[#102a24] sm:text-4xl lg:text-[4rem] lg:leading-[0.96]">
          How Rakshak turns a concern into coordinated action.
        </h1>

        <p className="text-sm text-[#2d6b5d] sm:text-base">
          An end-to-end humanitarian technology bridge connecting public observations to ground responders.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            to="/report"
            className="flex items-center gap-2 rounded-xl bg-[#0f8b73] px-6 py-3 text-[11px] font-bold uppercase tracking-[0.12em] text-white shadow-[0_8px_20px_rgba(15,139,115,0.25)] transition-transform hover:-translate-y-0.5"
          >
            <span>Report a Concern</span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            to="/responder"
            className="flex items-center gap-2 rounded-xl border border-[#b5d6c7] bg-[#edf6f0] px-6 py-3 text-[11px] font-bold uppercase tracking-[0.12em] text-[#1d4f45] transition-transform hover:-translate-y-0.5"
          >
            <span>Explore Responder Portal</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="mt-10 space-y-4">
        {narrativeSteps.map((step) => (
          <div
            key={step.num}
            className="flex flex-col gap-4 rounded-[26px] border border-[#d7e4de] bg-[#edf4ee] p-4 shadow-[0_12px_30px_rgba(16,42,36,0.06)] md:flex-row md:items-center"
          >
            <div className="relative h-40 w-full overflow-hidden rounded-[22px] md:w-72">
              <img
                src={step.image}
                alt={step.title}
                className="h-full w-full object-cover"
              />
              <div className={`absolute left-3 top-3 rounded-xl border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${step.accentClass}`}>
                {step.title}
              </div>
            </div>

            <div className="flex flex-1 items-start justify-between gap-4">
              <div className="space-y-2">
                <h2 className="text-2xl font-extrabold tracking-[-0.05em] text-[#102a24] sm:text-3xl">
                  {step.title}
                </h2>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2d6b5d]">
                  {step.subtitle}
                </p>
                <p className="max-w-2xl text-sm leading-relaxed text-[#2d6b5d] sm:text-base">
                  {step.desc}
                </p>
              </div>

              <div className={`hidden min-w-[72px] text-right text-5xl font-black leading-none sm:block ${step.numColor}`}>
                {step.num}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-[28px] border border-[#d7e4de] bg-[#edf4ee] p-6 text-center shadow-[0_12px_30px_rgba(16,42,36,0.06)] sm:p-8">
        <h2 className="text-2xl font-extrabold tracking-[-0.05em] text-[#102a24] sm:text-3xl">
          Inside the Responder Command Center
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-[#2d6b5d] sm:text-base">
          Explore the live operational dashboard used by platform responders and child protection desks to triage, assign, and resolve active cases.
        </p>

        <div className="mt-5">
          <Link
            to="/responder"
            className="inline-flex items-center gap-2 rounded-xl bg-[#0f8b73] px-6 py-3 text-[11px] font-bold uppercase tracking-[0.12em] text-white transition-transform hover:-translate-y-0.5"
          >
            <span>Explore Full Responder Portal</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
