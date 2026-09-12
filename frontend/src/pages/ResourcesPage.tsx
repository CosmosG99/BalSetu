import React from 'react';
import { Link } from 'react-router-dom';

export const ResourcesPage: React.FC = () => {
  const resourceCards = [
    {
      title: 'What to do if you get separated or lost',
      desc: 'Stay calm. Look for station uniforms, ticket counters, or station vendors wearing Rakshak safety badges.',
      image: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=1200&q=80',
      badge: 'Help'
    },
    {
      title: 'Recognizing unsafe or uncomfortable situations',
      desc: 'If an adult makes you feel scared, demands that you follow them, or tries to hide you from cameras, speak up to bystanders immediately.',
      image: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=1200&q=80',
      badge: null
    },
    {
      title: 'How to ask a trusted adult for help',
      desc: 'Approach station staff, shopkeepers inside the station, or uniformed security workers. Explain that you need help finding family.',
      image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80',
      badge: null
    },
    {
      title: 'Bullying & Peer Harassment',
      desc: 'If group intimidation happens near transit stops, move towards well-lit public concourses and notify station volunteers.',
      image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=1200&q=80',
      badge: null
    },
    {
      title: 'Preserving evidence safely for bystanders',
      desc: 'Never put yourself or a child in danger to record a video or photo. Maintain distance and note location details.',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
      badge: null
    },
    {
      title: 'Emergency Service Coordination',
      desc: 'Rakshak coordinates bystander reports with local ground protection desks across railway and bus networks.',
      image: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80',
      badge: null
    }
  ];

  return (
    <div className="relative max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-20 left-10 h-56 w-56 rounded-full bg-[#d4ebdf] opacity-70 blur-3xl" />
        <div className="absolute top-28 right-20 h-72 w-72 rounded-full bg-[#d9f0e5] opacity-60 blur-3xl" />
      </div>

      <div className="text-center max-w-4xl mx-auto space-y-3">
        <div className="flex items-center justify-center gap-3">
          <img src="/rakshak-mark.svg" alt="Rakshak logo" className="h-9 w-9 object-contain sm:h-10 sm:w-10" />
          <span className="text-xs font-bold tracking-[0.22em] text-[#2d6b5d] uppercase">Rakshak</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-[-0.06em] text-[#102a24] leading-[0.96]">
          Safety Resource Center
        </h1>
        <p className="text-sm sm:text-base text-[#2d6b5d] leading-relaxed">
          Trauma-informed guidance and friendly safety tips for children, parents, and community bystanders.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-5">
        {resourceCards.map((card, idx) => (
          <div
            key={idx}
            className="group overflow-hidden rounded-[24px] border border-[#d7e4de] bg-[#edf4ee] shadow-[0_12px_30px_rgba(16,42,36,0.08)] transition-transform duration-300 hover:-translate-y-1"
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={card.image}
                alt={card.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {card.badge && (
                <div className="absolute left-3 top-3 rounded-xl bg-white/85 backdrop-blur-sm px-2.5 py-1.5 shadow-sm">
                  <span className="text-xs font-bold text-[#102a24]">{card.badge}</span>
                </div>
              )}
            </div>

            <div className="space-y-3 p-4 sm:p-5">
              <h3 className="text-xl font-extrabold tracking-[-0.04em] text-[#102a24] leading-tight">
                {card.title}
              </h3>

              <p className="text-sm leading-relaxed text-[#2d6b5d]">
                {card.desc}
              </p>

              <Link
                to="/report"
                className="inline-flex items-center gap-2 text-sm font-bold text-[#0f8b73] transition-colors hover:text-[#0d7a64]"
              >
                <span>Report a concern now</span>
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
