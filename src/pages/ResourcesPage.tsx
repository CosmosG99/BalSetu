import React from 'react';
import { BookOpen, HelpCircle, Shield, HeartHandshake, Lock, PhoneCall, Sparkles, MessageCircle, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ResourcesPage: React.FC = () => {
  const resourceCards = [
    {
      title: 'What to do if you get separated or lost',
      desc: 'Stay calm. Look for station uniforms, ticket counters, or station vendors wearing Rakshak badges.',
      category: 'Lost Child Guidance',
      icon: HelpCircle,
      color: 'from-blue-500 to-indigo-600'
    },
    {
      title: 'Recognizing unsafe or uncomfortable situations',
      desc: 'If an adult makes you feel scared, demands that you follow them, or tries to hide you from cameras, speak up to bystanders immediately.',
      category: 'Safety Awareness',
      icon: Shield,
      color: 'from-purple-500 to-magenta-500'
    },
    {
      title: 'How to ask a trusted adult for help',
      desc: 'Approach station staff, shopkeepers inside the station, or uniformed security workers. Explain that you need help finding family.',
      category: 'Trusted Contacts',
      icon: HeartHandshake,
      color: 'from-emerald-500 to-teal-500'
    },
    {
      title: 'Bullying & Peer Harassment',
      desc: 'If group intimidation happens near transit stops, move towards well-lit public concourses and notify station volunteers.',
      category: 'Peer Safety',
      icon: MessageCircle,
      color: 'from-amber-500 to-red-500'
    },
    {
      title: 'Preserving evidence safely for bystanders',
      desc: 'Never put yourself or a child in danger to record a video or photo. Maintain distance and note location details.',
      category: 'Bystander Guidance',
      icon: Lock,
      color: 'from-indigo-500 to-purple-600'
    },
    {
      title: 'Emergency Service Coordination',
      desc: 'Rakshak coordinates bystander reports with local ground protection desks across railway and bus networks.',
      category: 'System Overview',
      icon: PhoneCall,
      color: 'from-magenta-500 to-purple-600'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5 text-brand-magenta" />
          <span>Child & Bystander Education</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white">Safety Resource Center</h1>
        <p className="text-sm text-slate-300">
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
              className="glass-panel glass-panel-hover p-6 rounded-3xl border border-white/10 space-y-4 shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${card.color} text-white flex items-center justify-center font-bold shadow-md`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-purple-300 bg-slate-900 px-2.5 py-1 rounded-full border border-slate-800">
                    {card.category}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white leading-snug">{card.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{card.desc}</p>
              </div>

              <div className="pt-2">
                <Link
                  to="/report"
                  className="text-xs font-bold text-brand-purple hover:text-purple-300 flex items-center space-x-1 transition-colors"
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
