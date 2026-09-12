import React from 'react';
import { Sparkles } from 'lucide-react';

export const ImpactPage: React.FC = () => {
  const metrics = [
    {
      label: 'Faster First-Mile Reporting',
      val: '< 30s',
      desc: 'Zero account creation friction enables instant observation submission.',
      image:
        'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80',
      accent: 'text-[#0f8b73]'
    },
    {
      label: 'AI-Assisted Advisory Triage',
      val: '0-100',
      desc: 'Instant trauma risk scoring and indicator detection to guide human responders.',
      image:
        'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
      accent: 'text-[#4c5bd4]'
    },
    {
      label: 'Community Participation',
      val: '100%',
      desc: 'Default privacy and face-blur protection ensures safe bystander reporting.',
      image:
        'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=1200&q=80',
      accent: 'text-[#0f8b73]'
    },
    {
      label: 'Successful Ground Resolution',
      val: '24/7',
      desc: 'Continuous coordination connecting bystanders to verified station protection cells.',
      image:
        'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1200&q=80',
      accent: 'text-[#0f8b73]'
    }
  ];

  return (
    <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <div className="absolute inset-x-0 top-0 -z-10 overflow-hidden">
        <div className="absolute left-0 top-0 h-40 w-40 rounded-full bg-[#d6eadf] opacity-70 blur-3xl" />
        <div className="absolute right-0 top-20 h-48 w-48 rounded-full bg-[#d6eadf] opacity-60 blur-3xl" />
      </div>

      <div className="mx-auto max-w-4xl space-y-3 text-center">
        <h1 className="text-3xl font-extrabold tracking-[-0.06em] text-[#102a24] sm:text-4xl lg:text-[4rem] lg:leading-[0.96]">
          Small moments of awareness
          <span className="block">can create meaningful</span>
          <span className="block text-[#0f8b73]">protection.</span>
        </h1>

        <p className="mx-auto max-w-3xl text-sm text-[#2d6b5d] sm:text-base">
          Quantifying first-mile child protection efficiency across high-footfall transit hubs.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric, idx) => (
          <div
            key={idx}
            className="overflow-hidden rounded-[24px] border border-[#d7e4de] bg-[#edf4ee] shadow-[0_12px_30px_rgba(16,42,36,0.08)]"
          >
            <div className="relative h-44 overflow-hidden">
              <img
                src={metric.image}
                alt={metric.label}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="space-y-3 p-4 sm:p-5">
              <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#2d6b5d]">
                <span className="inline-flex h-2 w-2 rounded-full bg-[#0f8b73]" />
                <span>Rakshak</span>
              </div>

              <div className={`text-3xl font-extrabold tracking-[-0.06em] sm:text-4xl ${metric.accent}`}>
                {metric.val}
              </div>

              <h3 className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#102a24]">
                {metric.label}
              </h3>

              <p className="text-sm leading-relaxed text-[#2d6b5d]">{metric.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
