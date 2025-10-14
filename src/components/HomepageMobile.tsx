'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { Building2, ShoppingBag, Store, Coffee, Star } from 'lucide-react';

export default function HomepageMobile() {
  const { user } = useAuth();

  const featuredJobs = [
    {
      id: 1,
      company: "McDonald's",
      title: "Crew Member",
      location: "Multiple Locations",
      type: "Part-time",
      salary: "£8.50 - £10.00/hour",
      icon: "Building2",
      color: "#ef4444",
      bgColor: "#fef2f2",
      url: "https://people.mcdonalds.co.uk/careers"
    },
    {
      id: 2,
      company: "Boots",
      title: "Sales Assistant",
      location: "High Street Stores",
      type: "Part-time",
      salary: "£8.00 - £9.50/hour",
      icon: "ShoppingBag",
      color: "#3b82f6",
      bgColor: "#eff6ff",
      url: "https://jobs.boots.com/"
    },
    {
      id: 3,
      company: "Tesco",
      title: "Customer Assistant",
      location: "Local Stores",
      type: "Part-time",
      salary: "£8.50 - £11.00/hour",
      icon: "Store",
      color: "#10b981",
      bgColor: "#f0fdf4",
      url: "https://www.tesco-careers.com/"
    },
    {
      id: 4,
      company: "Costa Coffee",
      title: "Barista",
      location: "Coffee Shops",
      type: "Part-time",
      salary: "£8.50 - £10.50/hour",
      icon: "Coffee",
      color: "#f59e0b",
      bgColor: "#fefbf3",
      url: "https://careers.costa.co.uk/"
    }
  ];

  const renderIcon = (iconName: string) => {
    const iconData = {
      'Building2': { icon: Building2, color: '#ef4444', bgColor: '#fef2f2' },
      'ShoppingBag': { icon: ShoppingBag, color: '#3b82f6', bgColor: '#eff6ff' },
      'Store': { icon: Store, color: '#10b981', bgColor: '#f0fdf4' },
      'Coffee': { icon: Coffee, color: '#f59e0b', bgColor: '#fefbf3' }
    };
    
    const IconComponent = iconData[iconName as keyof typeof iconData]?.icon;
    const iconColor = iconData[iconName as keyof typeof iconData]?.color || '#6b7280';
    
    return IconComponent ? <IconComponent size={24} color={iconColor} /> : null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-yellow-50 to-orange-50">
      {/* Hero Section - Mobile Optimized */}
      <section className="pt-6 pb-12 px-4">
        <div className="text-center">
          <div className="mb-6">
            <span className="text-6xl">🚀</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Fredoka, sans-serif' }}>
            Get Your First Job,{' '}
            <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              The Smart Way
            </span>
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
            Talentix helps teenagers land their first job with AI-powered tools, real opportunities, and expert guidance.
          </p>
          
          {!user ? (
            <div className="space-y-4">
              <button
                onClick={() => window.dispatchEvent(new Event('talentix-show-signup-modal'))}
                className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 text-white font-bold py-4 px-6 rounded-2xl shadow-lg transform transition-all duration-300 hover:scale-105"
                style={{ fontFamily: 'Fredoka, sans-serif' }}
              >
                🎯 Start Your Journey - Free!
              </button>
              <button
                onClick={() => window.dispatchEvent(new Event('talentix-show-signin-modal'))}
                className="w-full bg-white/80 backdrop-blur-sm text-gray-800 font-semibold py-3 px-6 rounded-2xl border-2 border-gray-200 shadow-sm"
                style={{ fontFamily: 'Fredoka, sans-serif' }}
              >
                Already have an account? Sign In
              </button>
            </div>
          ) : (
            <Link href="/dashboard">
              <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 px-6 rounded-2xl shadow-lg transform transition-all duration-300 hover:scale-105">
                🏠 Go to Dashboard
              </button>
            </Link>
          )}
        </div>
      </section>

      {/* Featured Jobs - Mobile Grid */}
      <section className="py-12 px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Fredoka, sans-serif' }}>
            🌟 Featured Jobs
          </h2>
          <p className="text-gray-600">Real opportunities waiting for you!</p>
        </div>
        
        <div className="grid grid-cols-1 gap-4 max-w-sm mx-auto">
          {featuredJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center space-x-3 mb-3">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: job.bgColor }}
                >
                  {renderIcon(job.icon)}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                    {job.company}
                  </h3>
                  <p className="text-sm text-gray-600">{job.title}</p>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <p className="text-sm text-gray-700">📍 {job.location}</p>
                <p className="text-sm text-gray-700">💰 {job.salary}</p>
                <p className="text-sm text-gray-700">⏰ {job.type}</p>
              </div>
              
              <a
                href={job.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-3 rounded-xl transition-all duration-300 hover:shadow-lg"
                style={{ fontFamily: 'Fredoka, sans-serif' }}
              >
                Apply Now 🚀
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section - Mobile */}
      <section className="py-12 px-4 bg-white/50">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Fredoka, sans-serif' }}>
            🛠️ What We Offer
          </h2>
        </div>
        
        <div className="space-y-6 max-w-sm mx-auto">
          <div className="bg-gradient-to-r from-purple-400 to-purple-600 rounded-2xl p-6 text-white">
            <div className="text-3xl mb-3">📄</div>
            <h3 className="font-bold text-lg mb-2" style={{ fontFamily: 'Fredoka, sans-serif' }}>
              AI CV Reviewer
            </h3>
            <p className="text-purple-100">
              Get instant feedback on your CV with our AI-powered analysis tool.
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-blue-400 to-blue-600 rounded-2xl p-6 text-white">
            <div className="text-3xl mb-3">🎭</div>
            <h3 className="font-bold text-lg mb-2" style={{ fontFamily: 'Fredoka, sans-serif' }}>
              Interview Practice
            </h3>
            <p className="text-blue-100">
              Practice with AI-powered mock interviews and improve your skills.
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-green-400 to-green-600 rounded-2xl p-6 text-white">
            <div className="text-3xl mb-3">💼</div>
            <h3 className="font-bold text-lg mb-2" style={{ fontFamily: 'Fredoka, sans-serif' }}>
              Job Opportunities
            </h3>
            <p className="text-green-100">
              Access real job listings from top UK employers looking for young talent.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials - Mobile */}
      <section className="py-12 px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Fredoka, sans-serif' }}>
            💬 What Students Say
          </h2>
        </div>
        
        <div className="space-y-6 max-w-sm mx-auto">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center space-x-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-gray-100 mb-4 leading-relaxed">
              "Talentix helped me get my first job at McDonald's! The interview practice was amazing."
            </p>
            <div>
              <p className="font-bold text-white">Sarah Johnson</p>
              <p className="text-gray-400 text-sm">@sarah_j_2024</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center space-x-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-gray-100 mb-4 leading-relaxed">
              "The CV reviewer pointed out things I never noticed. Got my dream job at Boots!"
            </p>
            <div>
              <p className="font-bold text-white">Mike Thompson</p>
              <p className="text-gray-400 text-sm">@mike_t_jobs</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center space-x-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-gray-100 mb-4 leading-relaxed">
              "Amazing platform! The career guidance section taught me so much about job searching."
            </p>
            <div>
              <p className="font-bold text-white">Emma Davis</p>
              <p className="text-gray-400 text-sm">@emma_career</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section - Mobile */}
      <section className="py-12 px-4 bg-gradient-to-b from-yellow-100 to-orange-100">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Fredoka, sans-serif' }}>
            💬 Get In Touch!
          </h2>
        </div>
        
        <div className="space-y-4 max-w-sm mx-auto">
          <a
            href="mailto:enquiries@talentix.co.uk"
            className="block bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="text-4xl mb-3">📧</div>
            <h3 className="font-bold text-lg text-gray-900 mb-2" style={{ fontFamily: 'Fredoka, sans-serif' }}>
              Email Us
            </h3>
            <p className="text-gray-600 font-medium">enquiries@talentix.co.uk</p>
          </a>
        </div>
      </section>

      {/* Footer - Mobile */}
      <footer className="py-8 px-4 bg-gray-900 text-white">
        <div className="text-center space-y-4">
          <div className="text-2xl font-bold" style={{ fontFamily: 'Fredoka, sans-serif' }}>
            🚀 Talentix
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link href="/privacy" className="text-gray-300 hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-300 hover:text-white">
              Terms of Service
            </Link>
            <Link href="/contact" className="text-gray-300 hover:text-white">
              Contact Us
            </Link>
          </div>
          <p className="text-gray-400 text-sm">
            © 2024 Talentix. Helping you get your first job! 🎯
          </p>
        </div>
      </footer>
    </div>
  );
}

