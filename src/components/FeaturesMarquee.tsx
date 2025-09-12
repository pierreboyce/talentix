import React from 'react';

const features = [
  { text: 'Free Features', emoji: '✨', bgColor: 'from-white to-yellow-50', textColor: 'text-gray-800' },
  { text: 'AI Job ChatBot', emoji: '🤖', bgColor: 'from-white to-orange-50', textColor: 'text-gray-800' },
  { text: 'Scoring System', emoji: '🏆', bgColor: 'from-white to-amber-50', textColor: 'text-gray-800' },
  { text: 'AI Interview Prep', emoji: '🗣️', bgColor: 'from-white to-yellow-50', textColor: 'text-gray-800' },
  { text: 'Community Forum', emoji: '👥', bgColor: 'from-white to-orange-50', textColor: 'text-gray-800' },
  { text: 'Real Job Vacancies', emoji: '✅', bgColor: 'from-white to-lime-50', textColor: 'text-gray-800' },
  { text: 'First Job Guarantee', emoji: '💼', bgColor: 'from-white to-amber-50', textColor: 'text-gray-800' },
  { text: 'AI CV Analysis', emoji: '📄', bgColor: 'from-white to-yellow-50', textColor: 'text-gray-800' },
];

const half = Math.ceil(features.length / 2);
const topRowFeatures = features.slice(0, half);
const bottomRowFeatures = features.slice(half);

const MarqueeRow = ({ features, reverse = false }: { features: typeof topRowFeatures, reverse?: boolean }) => (
  <div 
    className={`flex ${reverse ? 'animate-marquee-reverse' : 'animate-marquee'} py-4`}
    style={{ gap: '20px' }}
  >
    {[...features, ...features, ...features].map((feature, index) => (
      <div key={`${reverse ? 'r' : 'f'}-${index}`} className="flex-shrink-0" style={{ margin: '0 8px' }}>
        <div 
          className={`bg-gradient-to-br ${feature.bgColor} rounded-2xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 hover:animate-bounce cursor-pointer group relative overflow-hidden`}
          style={{ 
            padding: '20px 24px',
            minWidth: '200px',
            minHeight: '80px',
            boxShadow: '0 8px 25px rgba(255, 215, 0, 0.2), 0 4px 15px rgba(0, 0, 0, 0.1)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {/* Sparkle confetti effect on hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute top-2 right-2 text-sm animate-bounce" style={{ animationDelay: '0.1s' }}>🎉</div>
            <div className="absolute bottom-2 left-2 text-sm animate-bounce" style={{ animationDelay: '0.3s' }}>🚀</div>
            <div className="absolute top-2 left-2 text-xs animate-pulse" style={{ animationDelay: '0.2s' }}>⭐</div>
          </div>
          
          {/* Golden glow effect on hover */}
          <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-yellow-200/40 via-yellow-100/20 to-yellow-200/40"></div>
          
          {/* Centered content */}
          <div className="flex flex-col items-center justify-center text-center relative z-10 gap-2">
            <span 
              className="text-2xl block group-hover:animate-spin"
              style={{ 
                filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.1))',
                transition: 'transform 0.3s ease'
              }}
            >
              {feature.emoji}
            </span>
            
            <span className={`${feature.textColor} font-black text-xl tracking-tight text-center leading-tight`}
              style={{ 
                fontFamily: "'Fredoka', sans-serif",
                textShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              {feature.text}
            </span>
          </div>
          
          {/* Golden shine sweep effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-300/30 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
        </div>
      </div>
    ))}
  </div>
);

export default function FeaturesMarquee() {
  return (
    <div className="w-full overflow-hidden relative" style={{ 
      background: 'linear-gradient(135deg, #ffd700 0%, #fff8dc 50%, #fffef7 100%)', 
      paddingTop: '40px', 
      paddingBottom: '40px' 
    }}>
      {/* Subtle floating elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-8 left-16 w-3 h-3 bg-yellow-400/40 rounded-full animate-float blur-sm"></div>
        <div className="absolute top-12 right-20 w-4 h-4 bg-amber-400/30 rounded-full animate-float-delayed blur-sm"></div>
        <div className="absolute bottom-12 left-20 w-2 h-2 bg-orange-400/50 rounded-full animate-float blur-sm"></div>
        <div className="absolute bottom-8 right-16 w-3 h-3 bg-yellow-500/35 rounded-full animate-float-delayed blur-sm"></div>
      </div>
      
      {/* Smooth golden gradient overlays */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-yellow-300/40 via-yellow-200/20 to-transparent"></div>
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-yellow-300/40 via-yellow-200/20 to-transparent"></div>
      </div>
      
      {/* Lighter fade effects */}
      <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-white via-cream-50/40 to-transparent z-5"></div>
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white via-cream-50/40 to-transparent z-5"></div>

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
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
            opacity: 0.7;
          }
          50% { 
            transform: translateY(-20px) rotate(180deg); 
            opacity: 1;
          }
        }
        @keyframes float-delayed {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg) scale(1); 
            opacity: 0.5;
          }
          50% { 
            transform: translateY(-30px) rotate(-180deg) scale(1.2); 
            opacity: 0.8;
          }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
        .animate-marquee-reverse {
          animation: marquee-reverse 25s linear infinite;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
} 