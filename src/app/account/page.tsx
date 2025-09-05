'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Chatbot from '../../components/Chatbot';

export default function Account() {
  const [user, setUser] = useState<{ username: string; email: string; location: string; score: number; createdAt: string } | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '', location: '' });

  useEffect(() => {
    const username = localStorage.getItem('talentix_user');
    if (username) {
      const userData = JSON.parse(localStorage.getItem(`talentix_user_${username}`) || '{}');
      setUser(userData);
      setFormData({ username: userData.username, email: userData.email, location: userData.location });
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    // In a real app, you'd make an API call here.
    const updatedUser = { ...user, ...formData };
    localStorage.setItem(`talentix_user_${formData.username}`, JSON.stringify(updatedUser));
    if (user && user.username !== formData.username) {
      localStorage.removeItem(`talentix_user_${user.username}`);
    }
    localStorage.setItem('talentix_user', formData.username);
    setUser(updatedUser as any);
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading user profile...</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 text-gray-800">
      <main className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Account Settings</h1>
        
        <div className="bg-white p-8 rounded-xl border border-gray-200 minimalist-card">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <h2 className="font-semibold text-lg text-gray-800">Profile</h2>
              <p className="text-sm text-gray-500">Update your personal information.</p>
            </div>
            <div className="md:col-span-2 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-lg disabled:bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-lg disabled:bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-lg disabled:bg-gray-100"
                />
              </div>
              <div className="text-right">
                {isEditing ? (
                  <>
                    <button onClick={() => setIsEditing(false)} className="btn-secondary-outline py-2 mr-2">Cancel</button>
                    <button onClick={handleSave} className="btn-primary-yellow py-2">Save</button>
                  </>
                ) : (
                  <button onClick={() => setIsEditing(true)} className="btn-primary-yellow py-2">Edit</button>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Additional sections like 'Notifications', 'Password', 'Delete Account' can be added here */}
      </main>
    </div>
  );
} 