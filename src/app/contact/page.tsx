'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle, Heart, Star, Sparkles } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitted(true);
    setIsSubmitting(false);
    
    // Reset after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 text-6xl opacity-10 animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}>💌</div>
        <div className="absolute top-32 right-20 text-5xl opacity-15 animate-pulse" style={{ animationDelay: '1s', animationDuration: '4s' }}>📞</div>
        <div className="absolute bottom-40 left-16 text-7xl opacity-8 animate-bounce" style={{ animationDelay: '2s', animationDuration: '5s' }}>🎉</div>
        <div className="absolute bottom-20 right-12 text-4xl opacity-20 animate-pulse" style={{ animationDelay: '0.5s', animationDuration: '3s' }}>✨</div>
        <div className="absolute top-1/2 left-1/4 text-3xl opacity-10 animate-bounce" style={{ animationDelay: '1.5s', animationDuration: '4s' }}>💫</div>
        <div className="absolute top-1/3 right-1/3 text-5xl opacity-12 animate-pulse" style={{ animationDelay: '2.5s', animationDuration: '3s' }}>🚀</div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center animate-pulse">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <h1 
              className="text-5xl font-black bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent"
              style={{ fontFamily: 'Fredoka, sans-serif' }}
            >
              Let's Chat! 💬
            </h1>
          </div>
          <p 
            className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
            style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: '500' }}
          >
            Got questions? Ideas? Just want to say hi? We'd love to hear from you! 
            Our friendly team is here to help make your career journey amazing! ✨
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Contact Form */}
          <div 
            className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border-4 border-white/50 relative overflow-hidden"
            style={{ boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)' }}
          >
            {/* Form decorative elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-r from-yellow-300 to-orange-300 rounded-full opacity-20 animate-pulse" />
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-r from-purple-300 to-pink-300 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />

            <div className="relative z-10">
              <h2 
                className="text-3xl font-black text-gray-800 mb-6 flex items-center gap-3"
                style={{ fontFamily: 'Fredoka, sans-serif' }}
              >
                <Sparkles className="w-8 h-8 text-yellow-500" />
                Drop us a line!
              </h2>

              {isSubmitted ? (
                <div className="text-center py-12">
                  <div className="text-8xl mb-4 animate-bounce">🎉</div>
                  <h3 
                    className="text-2xl font-black text-green-600 mb-2"
                    style={{ fontFamily: 'Fredoka, sans-serif' }}
                  >
                    Message sent successfully!
                  </h3>
                  <p className="text-gray-600" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                    We'll get back to you super soon! 💌
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label 
                        className="block text-sm font-bold text-gray-700 mb-2"
                        style={{ fontFamily: 'Fredoka, sans-serif' }}
                      >
                        Your Name 👋
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border-3 border-gray-200 rounded-2xl focus:border-purple-400 focus:outline-none transition-all duration-300 text-gray-700"
                        style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: '500' }}
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label 
                        className="block text-sm font-bold text-gray-700 mb-2"
                        style={{ fontFamily: 'Fredoka, sans-serif' }}
                      >
                        Email Address 📧
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border-3 border-gray-200 rounded-2xl focus:border-purple-400 focus:outline-none transition-all duration-300 text-gray-700"
                        style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: '500' }}
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label 
                      className="block text-sm font-bold text-gray-700 mb-2"
                      style={{ fontFamily: 'Fredoka, sans-serif' }}
                    >
                      Subject 🎯
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border-3 border-gray-200 rounded-2xl focus:border-purple-400 focus:outline-none transition-all duration-300 text-gray-700"
                      style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: '500' }}
                      placeholder="How can we help you?"
                    />
                  </div>
                  
                  <div>
                    <label 
                      className="block text-sm font-bold text-gray-700 mb-2"
                      style={{ fontFamily: 'Fredoka, sans-serif' }}
                    >
                      Message 💭
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 border-3 border-gray-200 rounded-2xl focus:border-purple-400 focus:outline-none transition-all duration-300 text-gray-700 resize-none"
                      style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: '500' }}
                      placeholder="Tell us what's on your mind..."
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-black py-4 px-6 rounded-2xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    style={{ fontFamily: 'Fredoka, sans-serif' }}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Message 🚀
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Contact Info & Fun Elements */}
          <div className="space-y-8">
            {/* Contact Cards */}
            <div className="space-y-4">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-3 border-white/50 hover:scale-105 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-black text-gray-800" style={{ fontFamily: 'Fredoka, sans-serif' }}>Email Us</h3>
                    <p className="text-gray-600" style={{ fontFamily: 'Fredoka, sans-serif' }}>hello@talentix.co.uk</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-3 border-white/50 hover:scale-105 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-black text-gray-800" style={{ fontFamily: 'Fredoka, sans-serif' }}>Call Us</h3>
                    <p className="text-gray-600" style={{ fontFamily: 'Fredoka, sans-serif' }}>+44 20 1234 5678</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-3 border-white/50 hover:scale-105 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-black text-gray-800" style={{ fontFamily: 'Fredoka, sans-serif' }}>Visit Us</h3>
                    <p className="text-gray-600" style={{ fontFamily: 'Fredoka, sans-serif' }}>London, UK</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Fun Stats */}
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-3xl p-8 text-white relative overflow-hidden">
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/20 rounded-full" />
              <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-white/10 rounded-full" />
              
              <div className="relative z-10">
                <h3 
                  className="text-2xl font-black mb-6 flex items-center gap-2"
                  style={{ fontFamily: 'Fredoka, sans-serif' }}
                >
                  <Heart className="w-6 h-6" />
                  Why people love us!
                </h3>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-black mb-2" style={{ fontFamily: 'Fredoka, sans-serif' }}>10K+</div>
                    <div className="text-sm opacity-90" style={{ fontFamily: 'Fredoka, sans-serif' }}>Happy Users 😊</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-black mb-2" style={{ fontFamily: 'Fredoka, sans-serif' }}>24/7</div>
                    <div className="text-sm opacity-90" style={{ fontFamily: 'Fredoka, sans-serif' }}>Support 🚀</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-black mb-2" style={{ fontFamily: 'Fredoka, sans-serif' }}>98%</div>
                    <div className="text-sm opacity-90" style={{ fontFamily: 'Fredoka, sans-serif' }}>Success Rate ⭐</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-black mb-2" style={{ fontFamily: 'Fredoka, sans-serif' }}>1M+</div>
                    <div className="text-sm opacity-90" style={{ fontFamily: 'Fredoka, sans-serif' }}>Jobs Found 💼</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Response Time Promise */}
            <div className="bg-gradient-to-r from-pink-400 to-purple-500 rounded-2xl p-6 text-white text-center">
              <div className="text-4xl mb-3">⚡</div>
              <h3 
                className="text-lg font-black mb-2"
                style={{ fontFamily: 'Fredoka, sans-serif' }}
              >
                Lightning Fast Responses!
              </h3>
              <p 
                className="text-sm opacity-90"
                style={{ fontFamily: 'Fredoka, sans-serif' }}
              >
                We typically respond within 2 hours during business days
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

