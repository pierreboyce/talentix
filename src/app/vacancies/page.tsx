'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Chatbot from '../../components/Chatbot';

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  description: string;
  requirements: string[];
  benefits: string[];
  companyLogo: string;
}

export default function Vacancies() {
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('All');
  const [userName, setUserName] = useState('');
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);

  useState(() => {
    const savedUser = localStorage.getItem('talentix_user');
    if (savedUser) {
      setUserName(savedUser);
    }
  });

  const generateJobs = (searchLocation: string) => {
    const jobTemplates = [
      {
        title: "Crew Member",
        company: "McDonald's",
        salary: "£8.50 - £9.50/hour",
        type: "Part-time",
        description: "Join our team at McDonald's! We're looking for enthusiastic crew members to help serve our customers. Perfect for teenagers looking for their first job with flexible hours.",
        requirements: ["Friendly attitude", "Team player", "Reliable", "16+ years old", "Flexible schedule"],
        benefits: ["Employee discount", "Flexible hours", "Training provided", "Career progression", "Free meals on shift"],
        companyLogo: "🍔"
      },
      {
        title: "Customer Service Assistant",
        company: "Tesco",
        salary: "£9.00 - £10.00/hour",
        type: "Part-time",
        description: "Help customers find what they need and provide excellent service at Tesco. Great opportunity to develop customer service skills in a busy retail environment.",
        requirements: ["Good communication skills", "Basic math skills", "Flexible schedule", "16+ years old", "Customer service focus"],
        benefits: ["Staff discount", "Regular hours", "Training provided", "Pension scheme", "Holiday pay"],
        companyLogo: "🛒"
      },
      {
        title: "Barista",
        company: "Costa Coffee",
        salary: "£8.75 - £9.75/hour",
        type: "Part-time",
        description: "Learn to make amazing coffee and serve customers in a friendly environment at Costa Coffee. Training provided for coffee making skills!",
        requirements: ["Enthusiastic", "Customer service skills", "Willing to learn", "16+ years old", "Team work"],
        benefits: ["Free coffee", "Training provided", "Tips included", "Flexible hours", "Weekend bonuses"],
        companyLogo: "☕"
      },
      {
        title: "Sales Assistant",
        company: "Primark",
        salary: "£8.50 - £9.50/hour",
        type: "Part-time",
        description: "Help customers find the perfect outfit and keep our store looking great at Primark. Fashion lovers welcome!",
        requirements: ["Fashion interest", "Customer service", "Team work", "16+ years old", "Flexible availability"],
        benefits: ["Staff discount", "Fashion industry experience", "Regular hours", "Training provided", "Career opportunities"],
        companyLogo: "👕"
      },
      {
        title: "Cinema Assistant",
        company: "Cineworld",
        salary: "£8.25 - £9.25/hour",
        type: "Part-time",
        description: "Work in the exciting world of cinema at Cineworld! Sell tickets, serve snacks, and help create amazing movie experiences.",
        requirements: ["Love of movies", "Customer service", "Evening availability", "16+ years old", "Team player"],
        benefits: ["Free movie tickets", "Evening work", "Tips included", "Fun environment", "Training provided"],
        companyLogo: "🎬"
      },
      {
        title: "Retail Assistant",
        company: "Boots",
        salary: "£8.75 - £9.75/hour",
        type: "Part-time",
        description: "Help customers find health and beauty products at Boots. Great for those interested in healthcare and retail.",
        requirements: ["Interest in health/beauty", "Good communication", "Reliable", "16+ years old", "Customer service"],
        benefits: ["Staff discount", "Healthcare knowledge", "Regular hours", "Training provided", "Career development"],
        companyLogo: "💊"
      },
      {
        title: "Kitchen Porter",
        company: "Nando's",
        salary: "£8.50 - £9.50/hour",
        type: "Part-time",
        description: "Join the kitchen team at Nando's! Help with food preparation, cleaning, and maintaining kitchen standards.",
        requirements: ["Kitchen interest", "Reliable", "16+ years old", "Team work", "Evening availability"],
        benefits: ["Free meals", "Kitchen experience", "Flexible hours", "Training provided", "Fun team"],
        companyLogo: "🍗"
      },
      {
        title: "Customer Service Representative",
        company: "ASDA",
        salary: "£9.00 - £10.00/hour",
        type: "Part-time",
        description: "Provide excellent customer service at ASDA. Help customers with queries, product information, and general assistance.",
        requirements: ["Excellent communication", "Problem-solving", "16+ years old", "Customer service", "Reliable"],
        benefits: ["Staff discount", "Regular hours", "Training provided", "Career progression", "Pension scheme"],
        companyLogo: "🛒"
      },
      {
        title: "Barista",
        company: "Starbucks",
        salary: "£8.75 - £9.75/hour",
        type: "Part-time",
        description: "Create amazing coffee experiences at Starbucks! Learn to make various drinks and provide excellent customer service.",
        requirements: ["Coffee enthusiasm", "Customer service", "16+ years old", "Team work", "Flexible schedule"],
        benefits: ["Free drinks", "Training provided", "Tips included", "Career opportunities", "Flexible hours"],
        companyLogo: "☕"
      },
      {
        title: "Sales Assistant",
        company: "H&M",
        salary: "£8.50 - £9.50/hour",
        type: "Part-time",
        description: "Help customers find the latest fashion trends at H&M. Keep the store organized and provide excellent service.",
        requirements: ["Fashion interest", "Customer service", "16+ years old", "Team work", "Flexible availability"],
        benefits: ["Staff discount", "Fashion industry experience", "Regular hours", "Training provided", "Career development"],
        companyLogo: "👗"
      },
      {
        title: "Kitchen Assistant",
        company: "Pizza Express",
        salary: "£8.50 - £9.50/hour",
        type: "Part-time",
        description: "Join the kitchen team at Pizza Express! Help with food preparation, cooking, and maintaining kitchen standards.",
        requirements: ["Kitchen interest", "Reliable", "16+ years old", "Team work", "Evening availability"],
        benefits: ["Free meals", "Kitchen experience", "Flexible hours", "Training provided", "Fun environment"],
        companyLogo: "🍕"
      },
      {
        title: "Customer Service Assistant",
        company: "Sainsbury's",
        salary: "£9.00 - £10.00/hour",
        type: "Part-time",
        description: "Help customers with their shopping experience at Sainsbury's. Provide excellent service and maintain store standards.",
        requirements: ["Good communication", "Customer service", "16+ years old", "Reliable", "Flexible schedule"],
        benefits: ["Staff discount", "Regular hours", "Training provided", "Career progression", "Pension scheme"],
        companyLogo: "🛒"
      }
    ];

    return jobTemplates.map((template, index) => ({
      id: index + 1,
      ...template,
      location: searchLocation || "Your Area"
    }));
  };

  const searchJobs = () => {
    if (!location.trim()) return;

    const generatedJobs = generateJobs(location);
    setFilteredJobs(generatedJobs);
    
    // Add points for searching jobs
    const currentScore = parseInt(localStorage.getItem('talentix_score') || '0');
    const newScore = currentScore + 10;
    localStorage.setItem('talentix_score', newScore.toString());
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchJobs();
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 text-gray-800">
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Find Your First Job</h1>
          <p className="text-lg text-gray-600">Browse part-time jobs from top companies near you.</p>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 minimalist-card mb-8 flex flex-col sm:flex-row items-center gap-4">
          <div className="w-full sm:w-1/2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., London, Manchester"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
            />
          </div>
          <div className="w-full sm:w-1/2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
            <select
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
            >
              <option>All</option>
              <option>Retail</option>
              <option>Food & Beverage</option>
              <option>Customer Service</option>
              {/* Add more types as needed */}
            </select>
          </div>
        </div>

        {/* Job Listings */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredJobs.map((job) => (
            <div key={job.id} className="bg-white p-6 rounded-xl border border-gray-200 minimalist-card flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{job.companyLogo}</span>
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{job.company}</h3>
                  <p className="text-sm text-gray-500">{job.location}</p>
                </div>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">{job.title}</h4>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">{job.description}</p>
              <div className="text-sm text-gray-500 mb-4">{job.salary}</div>
              <button className="btn-primary-yellow w-full py-2 mt-auto">Apply Now</button>
            </div>
          ))}
        </div>
      </main>

      {/* Floating Chatbot */}
      {userName && <Chatbot userName={userName} />}
    </div>
  );
} 