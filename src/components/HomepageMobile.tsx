'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { Building2, ShoppingBag, Store, Coffee, Star, Search, FileText, Users, Camera, Trophy, Settings, BarChart3, Edit3, MessageCircle, BookOpen } from 'lucide-react';

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

      {/* Features Section - Mobile Carousel */}
      <section className="py-12 px-4 bg-gradient-to-br from-yellow-100 via-orange-50 to-yellow-100">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Fredoka, sans-serif' }}>
            🛠️ What We Offer
          </h2>
        </div>
        
        {/* Horizontal Scrolling Carousel */}
        <div 
          style={{
            display: 'flex',
            overflowX: 'auto',
            gap: '16px',
            paddingBottom: '16px',
            scrollSnapType: 'x mandatory',
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
            WebkitOverflowScrolling: 'touch'
          }}
          className="scrollbar-hide"
        >
          {/* Job Search Card */}
          <div 
            style={{
              flexShrink: 0,
              width: '280px',
              background: 'linear-gradient(135deg, #dbeafe 0%, #2563eb 100%)',
              borderRadius: '20px',
              padding: '24px',
              boxShadow: '0 8px 25px rgba(37, 99, 235, 0.3)',
              border: '3px solid #2563eb',
              scrollSnapAlign: 'start',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '2rem', opacity: '0.3' }}>🔍</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
              }}>
                <Search style={{ width: '24px', height: '24px', color: '#2563eb' }} />
              </div>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 2px 0', fontFamily: 'Fredoka, sans-serif' }}>
                  Job Search
                </h3>
                <p style={{ fontSize: '12px', color: '#dbeafe', margin: '0' }}>
                  🎯 Find opportunities
                </p>
              </div>
            </div>
            <p style={{ fontSize: '14px', color: '#ffffff', lineHeight: '1.5', marginBottom: '16px' }}>
              Search through thousands of job opportunities from top UK companies with smart filters! 🚀
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{
                padding: '6px 12px',
                backgroundColor: '#ffffff',
                color: '#2563eb',
                fontSize: '11px',
                fontWeight: '700',
                borderRadius: '20px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
              }}>
                🏢 35+ Companies
              </span>
              <span style={{ fontSize: '12px', color: '#ffffff', fontWeight: '600' }}>
                Explore Now →
              </span>
            </div>
          </div>

          {/* CV Reviewer Card */}
          <div 
            style={{
              flexShrink: 0,
              width: '280px',
              background: 'linear-gradient(135deg, #dcfce7 0%, #16a34a 100%)',
              borderRadius: '20px',
              padding: '24px',
              boxShadow: '0 8px 25px rgba(22, 163, 74, 0.3)',
              border: '3px solid #16a34a',
              scrollSnapAlign: 'start',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '2rem', opacity: '0.3' }}>📄</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
              }}>
                <FileText style={{ width: '24px', height: '24px', color: '#16a34a' }} />
              </div>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 2px 0', fontFamily: 'Fredoka, sans-serif' }}>
                  CV Reviewer
                </h3>
                <p style={{ fontSize: '12px', color: '#dcfce7', margin: '0' }}>
                  🤖 AI analysis
                </p>
              </div>
            </div>
            <p style={{ fontSize: '14px', color: '#ffffff', lineHeight: '1.5', marginBottom: '16px' }}>
              Get instant AI-powered feedback on your CV with personalized improvement suggestions! ✨
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{
                padding: '6px 12px',
                backgroundColor: '#ffffff',
                color: '#16a34a',
                fontSize: '11px',
                fontWeight: '700',
                borderRadius: '20px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
              }}>
                🧠 AI Powered
              </span>
              <span style={{ fontSize: '12px', color: '#ffffff', fontWeight: '600' }}>
                Review Now →
              </span>
            </div>
          </div>

          {/* Interview Prep Card */}
          <div 
            style={{
              flexShrink: 0,
              width: '280px',
              background: 'linear-gradient(135deg, #fef3c7 0%, #d97706 100%)',
              borderRadius: '20px',
              padding: '24px',
              boxShadow: '0 8px 25px rgba(217, 119, 6, 0.3)',
              border: '3px solid #d97706',
              scrollSnapAlign: 'start',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '2rem', opacity: '0.3' }}>🎤</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
              }}>
                <Users style={{ width: '24px', height: '24px', color: '#d97706' }} />
              </div>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 2px 0', fontFamily: 'Fredoka, sans-serif' }}>
                  Interview Prep
                </h3>
                <p style={{ fontSize: '12px', color: '#fef3c7', margin: '0' }}>
                  🎯 Practice questions
                </p>
              </div>
            </div>
            <p style={{ fontSize: '14px', color: '#ffffff', lineHeight: '1.5', marginBottom: '16px' }}>
              Practice with AI-generated interview questions tailored to your industry and role! 💪
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{
                padding: '6px 12px',
                backgroundColor: '#ffffff',
                color: '#d97706',
                fontSize: '11px',
                fontWeight: '700',
                borderRadius: '20px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
              }}>
                🎤 Practice
              </span>
              <span style={{ fontSize: '12px', color: '#ffffff', fontWeight: '600' }}>
                Start Now →
              </span>
            </div>
          </div>

          {/* Video Interview Card */}
          <div 
            style={{
              flexShrink: 0,
              width: '280px',
              background: 'linear-gradient(135deg, #fce7f3 0%, #ec4899 100%)',
              borderRadius: '20px',
              padding: '24px',
              boxShadow: '0 8px 25px rgba(236, 72, 153, 0.3)',
              border: '3px solid #ec4899',
              scrollSnapAlign: 'start',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '2rem', opacity: '0.3' }}>🎬</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
              }}>
                <Camera style={{ width: '24px', height: '24px', color: '#ec4899' }} />
              </div>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 2px 0', fontFamily: 'Fredoka, sans-serif' }}>
                  Video Interview
                </h3>
                <p style={{ fontSize: '12px', color: '#fce7f3', margin: '0' }}>
                  🎥 Practice on camera
                </p>
              </div>
            </div>
            <p style={{ fontSize: '14px', color: '#ffffff', lineHeight: '1.5', marginBottom: '16px' }}>
              Practice video interviews with AI questions and get comfortable being on camera! 📹
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{
                padding: '6px 12px',
                backgroundColor: '#ffffff',
                color: '#ec4899',
                fontSize: '11px',
                fontWeight: '700',
                borderRadius: '20px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
              }}>
                📹 Record & Review
              </span>
              <span style={{ fontSize: '12px', color: '#ffffff', fontWeight: '600' }}>
                Practice Now →
              </span>
            </div>
          </div>

          {/* Talentix Points Card */}
          <div 
            style={{
              flexShrink: 0,
              width: '280px',
              background: 'linear-gradient(135deg, #fef3c7 0%, #fbbf24 100%)',
              borderRadius: '20px',
              padding: '24px',
              boxShadow: '0 8px 25px rgba(251, 191, 36, 0.3)',
              border: '3px solid #fbbf24',
              scrollSnapAlign: 'start',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '2rem', opacity: '0.3' }}>🏆</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
              }}>
                <Trophy style={{ width: '24px', height: '24px', color: '#fbbf24' }} />
              </div>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', margin: '0 0 2px 0', fontFamily: 'Fredoka, sans-serif' }}>
                  Talentix Points
                </h3>
                <p style={{ fontSize: '12px', color: '#6b7280', margin: '0' }}>
                  🎯 Track progress
                </p>
              </div>
            </div>
            <p style={{ fontSize: '14px', color: '#4b5563', lineHeight: '1.5', marginBottom: '16px' }}>
              Earn points for completing activities and unlock achievements as you progress! 🚀
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{
                padding: '6px 12px',
                backgroundColor: '#ffffff',
                color: '#fbbf24',
                fontSize: '11px',
                fontWeight: '700',
                borderRadius: '20px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
              }}>
                🎉 Earn Points
              </span>
              <span style={{ fontSize: '12px', color: '#1f2937', fontWeight: '600' }}>
                View Progress →
              </span>
            </div>
          </div>

          {/* Settings Card */}
          <div 
            style={{
              flexShrink: 0,
              width: '280px',
              background: 'linear-gradient(135deg, #e0e7ff 0%, #8b5cf6 100%)',
              borderRadius: '20px',
              padding: '24px',
              boxShadow: '0 8px 25px rgba(139, 92, 246, 0.3)',
              border: '3px solid #8b5cf6',
              scrollSnapAlign: 'start',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '2rem', opacity: '0.3' }}>⚙️</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
              }}>
                <Settings style={{ width: '24px', height: '24px', color: '#8b5cf6' }} />
              </div>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 2px 0', fontFamily: 'Fredoka, sans-serif' }}>
                  Settings
                </h3>
                <p style={{ fontSize: '12px', color: '#e0e7ff', margin: '0' }}>
                  🔧 Customize experience
                </p>
              </div>
            </div>
            <p style={{ fontSize: '14px', color: '#ffffff', lineHeight: '1.5', marginBottom: '16px' }}>
              Personalize your Talentix experience with custom preferences and account settings! ⚙️
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{
                padding: '6px 12px',
                backgroundColor: '#ffffff',
                color: '#8b5cf6',
                fontSize: '11px',
                fontWeight: '700',
                borderRadius: '20px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
              }}>
                🔧 Customize
              </span>
              <span style={{ fontSize: '12px', color: '#ffffff', fontWeight: '600' }}>
                Manage →
              </span>
            </div>
          </div>

          {/* Job Tracker Card */}
          <div 
            style={{
              flexShrink: 0,
              width: '280px',
              background: 'linear-gradient(135deg, #d1fae5 0%, #10b981 100%)',
              borderRadius: '20px',
              padding: '24px',
              boxShadow: '0 8px 25px rgba(16, 185, 129, 0.3)',
              border: '3px solid #10b981',
              scrollSnapAlign: 'start',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '2rem', opacity: '0.3' }}>📊</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
              }}>
                <BarChart3 style={{ width: '24px', height: '24px', color: '#10b981' }} />
              </div>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 2px 0', fontFamily: 'Fredoka, sans-serif' }}>
                  Job Tracker
                </h3>
                <p style={{ fontSize: '12px', color: '#d1fae5', margin: '0' }}>
                  📈 Track applications
                </p>
              </div>
            </div>
            <p style={{ fontSize: '14px', color: '#ffffff', lineHeight: '1.5', marginBottom: '16px' }}>
              Keep track of all your job applications and follow up on opportunities systematically! 📋
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{
                padding: '6px 12px',
                backgroundColor: '#ffffff',
                color: '#10b981',
                fontSize: '11px',
                fontWeight: '700',
                borderRadius: '20px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
              }}>
                📊 Organize
              </span>
              <span style={{ fontSize: '12px', color: '#ffffff', fontWeight: '600' }}>
                Track Now →
              </span>
            </div>
          </div>

          {/* Cover Letter Card */}
          <div 
            style={{
              flexShrink: 0,
              width: '280px',
              background: 'linear-gradient(135deg, #ddd6fe 0%, #7c3aed 100%)',
              borderRadius: '20px',
              padding: '24px',
              boxShadow: '0 8px 25px rgba(124, 58, 237, 0.3)',
              border: '3px solid #7c3aed',
              scrollSnapAlign: 'start',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '2rem', opacity: '0.3' }}>✍️</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
              }}>
                <Edit3 style={{ width: '24px', height: '24px', color: '#7c3aed' }} />
              </div>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 2px 0', fontFamily: 'Fredoka, sans-serif' }}>
                  Cover Letter
            </h3>
                <p style={{ fontSize: '12px', color: '#ddd6fe', margin: '0' }}>
                  ✍️ AI-powered writing
                </p>
              </div>
            </div>
            <p style={{ fontSize: '14px', color: '#ffffff', lineHeight: '1.5', marginBottom: '16px' }}>
              Generate compelling cover letters tailored to each job application with AI assistance! ✨
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{
                padding: '6px 12px',
                backgroundColor: '#ffffff',
                color: '#7c3aed',
                fontSize: '11px',
                fontWeight: '700',
                borderRadius: '20px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
              }}>
                ✍️ Generate
              </span>
              <span style={{ fontSize: '12px', color: '#ffffff', fontWeight: '600' }}>
                Write Now →
              </span>
            </div>
          </div>
          
          {/* AI Chat Card */}
          <div 
            style={{
              flexShrink: 0,
              width: '280px',
              background: 'linear-gradient(135deg, #fef7cd 0%, #eab308 100%)',
              borderRadius: '20px',
              padding: '24px',
              boxShadow: '0 8px 25px rgba(234, 179, 8, 0.3)',
              border: '3px solid #eab308',
              scrollSnapAlign: 'start',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '2rem', opacity: '0.3' }}>🤖</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
              }}>
                <MessageCircle style={{ width: '24px', height: '24px', color: '#eab308' }} />
              </div>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', margin: '0 0 2px 0', fontFamily: 'Fredoka, sans-serif' }}>
                  AI Chat
            </h3>
                <p style={{ fontSize: '12px', color: '#6b7280', margin: '0' }}>
                  🤖 Get instant help
                </p>
              </div>
            </div>
            <p style={{ fontSize: '14px', color: '#4b5563', lineHeight: '1.5', marginBottom: '16px' }}>
              Chat with our AI assistant for personalized career advice and job search tips! 💬
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{
                padding: '6px 12px',
                backgroundColor: '#ffffff',
                color: '#eab308',
                fontSize: '11px',
                fontWeight: '700',
                borderRadius: '20px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
              }}>
                🤖 Chat Now
              </span>
              <span style={{ fontSize: '12px', color: '#1f2937', fontWeight: '600' }}>
                Ask Away →
              </span>
            </div>
          </div>
          
          {/* Career Guidance Card */}
          <div 
            style={{
              flexShrink: 0,
              width: '280px',
              background: 'linear-gradient(135deg, #fed7d7 0%, #e53e3e 100%)',
              borderRadius: '20px',
              padding: '24px',
              boxShadow: '0 8px 25px rgba(229, 62, 62, 0.3)',
              border: '3px solid #e53e3e',
              scrollSnapAlign: 'start',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '2rem', opacity: '0.3' }}>📚</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
              }}>
                <BookOpen style={{ width: '24px', height: '24px', color: '#e53e3e' }} />
              </div>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 2px 0', fontFamily: 'Fredoka, sans-serif' }}>
                  Career Guidance
            </h3>
                <p style={{ fontSize: '12px', color: '#fed7d7', margin: '0' }}>
                  📚 Expert advice
                </p>
              </div>
            </div>
            <p style={{ fontSize: '14px', color: '#ffffff', lineHeight: '1.5', marginBottom: '16px' }}>
              Access expert career advice, industry insights, and professional development resources! 🎯
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{
                padding: '6px 12px',
                backgroundColor: '#ffffff',
                color: '#e53e3e',
                fontSize: '11px',
                fontWeight: '700',
                borderRadius: '20px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
              }}>
                📚 Learn More
              </span>
              <span style={{ fontSize: '12px', color: '#ffffff', fontWeight: '600' }}>
                Explore →
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* Testimonials - Mobile */}
      <section className="py-12 px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Fredoka, sans-serif' }}>
            💬 What schools say
          </h2>
        </div>
        <div className="max-w-sm mx-auto">
          <div style={{ background: '#1a1a2e', border: '4px solid #FFD23F', boxShadow: '6px 6px 0 #FF6B9D', borderRadius: '18px', padding: '22px' }}>
            <p style={{ margin: 0, color: '#ffffff', lineHeight: 1.6, fontFamily: 'Fredoka, sans-serif' }}>
              "I would definitely recommend Talentix to other schools, you're really inclusive, you really tailored it to our students. I haven't seen them more engaged."
            </p>
            <p style={{ margin: '16px 0 0', fontWeight: 800, color: '#FFD23F', fontFamily: 'Fredoka, sans-serif' }}>Emma Seffens</p>
            <p style={{ margin: '2px 0 0', color: '#cbd5e1', fontSize: '0.9rem', fontFamily: 'Fredoka, sans-serif' }}>Careers Officer, Endeavour Academy Bexley</p>
          </div>
          <div style={{ marginTop: '20px', background: '#1a1a2e', border: '4px solid #4ECDC4', boxShadow: '6px 6px 0 #FFD23F', borderRadius: '18px', padding: '20px', textAlign: 'center' }}>
            <span style={{ display: 'inline-block', background: '#4ECDC4', color: '#1a1a2e', fontWeight: 800, padding: '3px 12px', borderRadius: '999px', fontFamily: 'Fredoka, sans-serif', fontSize: '0.85rem' }}>SEN-adapted workshops</span>
            <p style={{ margin: '10px 0 0', color: '#cbd5e1', lineHeight: 1.6, fontSize: '0.92rem', fontFamily: 'Fredoka, sans-serif' }}>
              Every session is delivered by DBS-checked, SEN-trained facilitators and adapted for SEN and SEND learners.
            </p>
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
            © 2026 Talentix. Helping you get your first job! 🎯
          </p>
        </div>
      </footer>
    </div>
  );
}

