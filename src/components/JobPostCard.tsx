import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export interface JobPostCardProps {
  companyName: string;
  companyLogo: string;
  jobTitle: string;
  description: string;
  applyLink: string;
}

export default function JobPostCard({
  companyName,
  companyLogo,
  jobTitle,
  description,
  applyLink,
}: JobPostCardProps) {
  return (
    <div className="bg-white border-2 border-black overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 max-w-sm mx-auto float" style={{ borderRadius: '24px', margin: '1rem' }}>
      {/* Post Header - Yellow background */}
      <div className="flex items-center gap-3 p-4 border-b-2 border-black" style={{ backgroundColor: '#fde047' }}>
        {companyLogo.startsWith('/') ? (
          <Image src={companyLogo} alt={`${companyName} logo`} width={32} height={32} className="rounded-lg" />
        ) : (
          <div className="text-2xl">{companyLogo}</div>
        )}
        <h3 
          className="font-bold text-gray-800 text-lg"
          style={{ fontFamily: "'Fredoka', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
        >
          {companyName}
        </h3>
      </div>

      {/* Job Title Section */}
      <div className="text-center" style={{ backgroundColor: '#ffffff', padding: '24px 32px 8px 32px' }}>
        <h4 
          className="font-bold text-gray-900 mb-2" 
          style={{ 
            fontSize: '18px',
            fontFamily: "'Fredoka', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          }}
        >
          {jobTitle}
        </h4>
        <p className="text-gray-600 leading-relaxed" style={{ fontSize: '12px' }}>
          {description}
        </p>
      </div>

      {/* Apply Button */}
      <div className="flex justify-center" style={{ backgroundColor: '#ffffff', padding: '16px 32px 24px 32px' }}>
        <Link 
          href={applyLink} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="inline-block text-center text-black font-bold hover:opacity-90 transition-opacity"
          style={{ 
            backgroundColor: '#fbbf24', 
            borderRadius: '25px',
            padding: '16px 40px',
            fontSize: '16px',
            fontFamily: "'Fredoka', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          }}
        >
          Apply Now
        </Link>
      </div>
    </div>
  );
} 