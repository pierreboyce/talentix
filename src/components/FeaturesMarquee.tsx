import React from 'react';

const features = [
  { text: 'AI CV analysis', emoji: '📄' },
  { text: 'Free features', emoji: '✨' },
  { text: 'Job ChatBot', emoji: '🤖' },
  { text: 'Scoring system', emoji: '🏆' },
  { text: 'First job guarantee', emoji: '💼' },
  { text: 'Interview help', emoji: '💬' },
  { text: 'Community Forum', emoji: '👥' },
  { text: 'Real Job Vacancies', emoji: '✅' },
];

const half = Math.ceil(features.length / 2);
const topRowFeatures = features.slice(0, half);
const bottomRowFeatures = features.slice(half);

const MarqueeRow = ({ features, reverse = false }: { features: typeof topRowFeatures, reverse?: boolean }) => (
  <div 
    className={`flex ${reverse ? 'animate-marquee-reverse' : 'animate-marquee'} py-4`}
    style={{ gap: '32px' }}
  >
    {[...features, ...features, ...features].map((feature, index) => (
      <div key={`${reverse ? 'r' : 'f'}-${index}`} className="flex-shrink-0" style={{ margin: '0 16px' }}>
        <div 
          className="bg-white border border-gray-200 rounded-full shadow-lg hover:bg-gray-100 hover:shadow-xl transition-all duration-200"
          style={{ padding: '16px 32px' }}
        >
          <div className="flex items-center gap-2">
            <span className="text-xs">{feature.emoji}</span>
            <span className="text-gray-700 whitespace-nowrap text-xs font-bold font-fredoka">{feature.text}</span>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default function FeaturesMarquee() {
  return (
    <div className="w-full overflow-hidden relative" style={{ backgroundColor: '#fff2cc', paddingTop: '48px', paddingBottom: '48px' }}>
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-yellow-25 to-transparent"></div>
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-yellow-25 to-transparent"></div>
      </div>
      
      {/* Top fade */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-white via-white/80 to-transparent z-5"></div>
      
      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white via-white/80 to-transparent z-5"></div>

      <div>
        <div className="overflow-hidden" style={{ marginBottom: '16px' }}>
          <MarqueeRow features={topRowFeatures} />
        </div>
        <div className="overflow-hidden">
          <MarqueeRow features={bottomRowFeatures} reverse />
        </div>
      </div>

      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-33.333%); }
        }
        @keyframes marquee-reverse {
          0% { transform: translateX(-33.333%); }
          100% { transform: translateX(0%); }
        }
        .animate-marquee {
          animation: marquee 60s linear infinite;
        }
        .animate-marquee-reverse {
          animation: marquee-reverse 60s linear infinite;
        }
      `}</style>
    </div>
  );
} 