import React from 'react';
import { BookOpen, HelpCircle, Shield, HeartHandshake, Lock, PhoneCall, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ResourcesPage: React.FC = () => {
  const resourceCards = [
    {
      title: 'What to do if you get separated or lost',
      desc: 'Stay calm. Look for station uniforms, ticket counters, or station vendors wearing Rakshak safety badges.',
      category: 'Lost Child Guidance',
      icon: HelpCircle,
      badgeColor: 'bg-accentBlue/10 text-accentBlue border-accentBlue/30',
      iconBg: 'bg-accentBlue text-white'
    },
    {
      title: 'Recognizing unsafe or uncomfortable situations',
      desc: 'If an adult makes you feel scared, demands that you follow them, or tries to hide you from cameras, speak up to bystanders immediately.',
      category: 'Safety Awareness',
      icon: Shield,
      badgeColor: 'bg-accentPurple/10 text-accentPurple border-accentPurple/30',
      iconBg: 'bg-accentPurple text-white'
    },
    {
      title: 'How to ask a trusted adult for help',
      desc: 'Approach station staff, shopkeepers inside the station, or uniformed security workers. Explain that you need help finding family.',
      category: 'Trusted Contacts',
      icon: HeartHandshake,
      badgeColor: 'bg-teal-700/10 text-teal-700 dark:text-teal-300 border-teal-700/30',
      iconBg: 'bg-teal-700 text-white'
    },
    {
      title: 'Bullying & Peer Harassment',
      desc: 'If group intimidation happens near transit stops, move towards well-lit public concourses and notify station volunteers.',
      category: 'Peer Safety',
      icon: MessageCircle,
      badgeColor: 'bg-accentOrange/10 text-accentOrange border-accentOrange/30',
      iconBg: 'bg-accentOrange text-white'
    },
    {
      title: 'Preserving evidence safely for bystanders',
      desc: 'Never put yourself or a child in danger to record a video or photo. Maintain distance and note location details.',
      category: 'Bystander Guidance',
      icon: Lock,
      badgeColor: 'bg-accentViolet/10 text-accentViolet border-accentViolet/30',
      iconBg: 'bg-accentViolet text-white'
    },
    {
      title: 'Emergency Service Coordination',
      desc: 'Rakshak coordinates bystander reports with local ground protection desks across railway and bus networks.',
      category: 'System Overview',
      icon: PhoneCall,
      badgeColor: 'bg-accentPink/10 text-accentPink border-accentPink/30',
      iconBg: 'bg-accentPink text-white'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-accentPurple/10 text-accentPurple border border-accentPurple/30 text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Resources & Education</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-charcoal-800 dark:text-charcoal-100">Safety Resource Center</h1>
        <p className="text-sm text-charcoal-600 dark:text-charcoal-300">
          Trauma-informed guidance and friendly safety tips for children, parents, and community bystanders.
        </p>
      </div>

      {/* Grid of Resource Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resourceCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="natural-panel natural-card-hover p-6 rounded-3xl space-y-4 shadow-card flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-2xl ${card.iconBg} flex items-center justify-center font-bold shadow-md`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border ${card.badgeColor}`}>
                    {card.category}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-charcoal-800 dark:text-charcoal-100 leading-snug">{card.title}</h3>
                <p className="text-xs text-charcoal-600 dark:text-charcoal-300 leading-relaxed">{card.desc}</p>
              </div>

              <div className="pt-2">
                <Link
                  to="/report"
                  className="text-xs font-bold text-teal-700 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300 flex items-center space-x-1 transition-colors"
                >
                  <span>Report a concern now</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
