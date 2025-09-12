'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface PointsContextType {
  points: number;
  addPoints: (amount: number, reason?: string) => void;
  setPoints: (amount: number) => void;
  showPointsNotification: boolean;
  pointsNotification: {
    amount: number;
    reason: string;
  } | null;
  clearNotification: () => void;
}

const PointsContext = createContext<PointsContextType | undefined>(undefined);

export function PointsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [points, setPointsState] = useState(0); // Default starting points
  const [showPointsNotification, setShowPointsNotification] = useState(false);
  const [pointsNotification, setPointsNotification] = useState<{
    amount: number;
    reason: string;
  } | null>(null);

  // Helper to compute a stable storage key for a user
  const getPointsKeyForUser = (): string | null => {
    if (!user) return null;
    // Prefer email for stability across OAuth logins
    if (user.email && user.email.length > 0) {
      return `talentix-points-email-${user.email.toLowerCase()}`;
    }
    // Fallback to id if no email available
    if ((user as any).id) {
      return `talentix-points-${(user as any).id}`;
    }
    return null;
  };

  // Load points from localStorage when user changes
  useEffect(() => {
    if (!user) return;

    // Determine stable key and migrate from old id-based key if necessary
    const stableKey = getPointsKeyForUser();
    if (!stableKey) return;

    // Migration: if we previously stored by id and now have email, move the value
    const oldIdKey = (user as any).id ? `talentix-points-${(user as any).id}` : null;
    if (oldIdKey && oldIdKey !== stableKey) {
      const oldVal = localStorage.getItem(oldIdKey);
      const newVal = localStorage.getItem(stableKey);
      if (oldVal && !newVal) {
        localStorage.setItem(stableKey, oldVal);
      }
    }

    // No automatic migration - new users start with 0 points

    const saved = localStorage.getItem(stableKey);
    if (saved != null) {
      setPointsState(parseInt(saved, 10));
    } else {
      setPointsState(0);
      localStorage.setItem(stableKey, '0');
    }
    // Don't reset points when user logs out - keep them for when they sign back in
  }, [user?.id, user?.email]);

  // Save points to localStorage whenever they change (user-specific)
  useEffect(() => {
    const key = getPointsKeyForUser();
    if (key) {
      localStorage.setItem(key, points.toString());
    }
  }, [points, user?.id, user?.email]);

  const addPoints = (amount: number, reason: string = 'Activity completed') => {
    setPointsState(prev => prev + amount);
    
    // Show notification
    setPointsNotification({ amount, reason });
    setShowPointsNotification(true);
    
    // Auto-hide notification after 3 seconds
    setTimeout(() => {
      setShowPointsNotification(false);
    }, 3000);
  };

  const setPoints = (amount: number) => {
    setPointsState(amount);
  };

  const clearNotification = () => {
    setShowPointsNotification(false);
    setPointsNotification(null);
  };

  return (
    <PointsContext.Provider value={{
      points,
      addPoints,
      setPoints,
      showPointsNotification,
      pointsNotification,
      clearNotification
    }}>
      {children}
    </PointsContext.Provider>
  );
}

export function usePoints() {
  const context = useContext(PointsContext);
  if (context === undefined) {
    throw new Error('usePoints must be used within a PointsProvider');
  }
  return context;
}
