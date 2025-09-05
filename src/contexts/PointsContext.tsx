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

  // Load points from localStorage when user changes
  useEffect(() => {
    if (user?.id) {
      const pointsKey = `talentix-points-${user.id}`;
      const savedPoints = localStorage.getItem(pointsKey);
      if (savedPoints) {
        setPointsState(parseInt(savedPoints, 10));
      } else {
        // For new users, ensure they start with 0 points
        setPointsState(0);
        localStorage.setItem(pointsKey, '0');
      }
    } else {
      // User logged out, reset to 0
      setPointsState(0);
    }
  }, [user?.id]);

  // Save points to localStorage whenever they change (user-specific)
  useEffect(() => {
    if (user?.id) {
      const pointsKey = `talentix-points-${user.id}`;
      localStorage.setItem(pointsKey, points.toString());
    }
  }, [points, user?.id]);

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
