'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { usePoints } from './PointsContext';
import { useAuth } from './AuthContext';

interface Quest {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  completed: boolean;
  category: 'daily' | 'weekly' | 'achievement';
  progress: number;
  maxProgress: number;
  type: 'interview' | 'cv' | 'job_search' | 'login' | 'streak' | 'social';
}

interface QuestContextType {
  quests: Quest[];
  updateQuestProgress: (questId: string, progress: number) => void;
  completeQuest: (questId: string) => void;
  resetDailyQuests: () => void;
  getActiveQuests: () => Quest[];
  getCompletedQuests: () => Quest[];
}

const QuestContext = createContext<QuestContextType | undefined>(undefined);

const getDefaultQuests = (): Quest[] => [
  // Daily Quests
  {
    id: 'daily_login',
    title: 'Daily Check-in',
    description: 'Log in to Talentix today',
    xpReward: 10,
    completed: false,
    category: 'daily' as const,
    progress: 0,
    maxProgress: 1,
    type: 'login' as const
  },
  {
    id: 'interview_practice',
    title: 'Interview Ace',
    description: 'Answer 5 interview questions',
    xpReward: 50,
    completed: false,
    category: 'daily' as const,
    progress: 0,
    maxProgress: 5,
    type: 'interview' as const
  },
  {
    id: 'cv_analysis',
    title: 'CV Master',
    description: 'Analyze your CV with AI feedback',
    xpReward: 30,
    completed: false,
    category: 'daily' as const,
    progress: 0,
    maxProgress: 1,
    type: 'cv' as const
  },
  {
    id: 'job_explorer',
    title: 'Job Hunter',
    description: 'Apply to 3 different jobs',
    xpReward: 40,
    completed: false,
    category: 'daily' as const,
    progress: 0,
    maxProgress: 3,
    type: 'job_search' as const
  },
  {
    id: 'perfect_score',
    title: 'Perfect Performance',
    description: 'Get a 5/5 score on an interview question',
    xpReward: 75,
    completed: false,
    category: 'daily' as const,
    progress: 0,
    maxProgress: 1,
    type: 'interview' as const
  },
  
  // Weekly Quests
  {
    id: 'weekly_streak',
    title: 'Consistency Champion',
    description: 'Complete daily quests for 7 days',
    xpReward: 200,
    completed: false,
    category: 'weekly' as const,
    progress: 0,
    maxProgress: 7,
    type: 'streak' as const
  },
  {
    id: 'interview_master',
    title: 'Interview Master',
    description: 'Answer 25 interview questions this week',
    xpReward: 150,
    completed: false,
    category: 'weekly' as const,
    progress: 0,
    maxProgress: 25,
    type: 'interview' as const
  },
  {
    id: 'job_application_spree',
    title: 'Application Spree',
    description: 'Apply to 15 jobs this week',
    xpReward: 120,
    completed: false,
    category: 'weekly' as const,
    progress: 0,
    maxProgress: 15,
    type: 'job_search' as const
  },
  
  // Achievement Quests
  {
    id: 'first_perfect_score',
    title: 'First Perfect Score',
    description: 'Achieve your first 5/5 interview rating',
    xpReward: 100,
    completed: false,
    category: 'achievement' as const,
    progress: 0,
    maxProgress: 1,
    type: 'interview' as const
  },
  {
    id: 'cv_optimizer',
    title: 'CV Optimizer',
    description: 'Get a 4+ rating on CV analysis',
    xpReward: 80,
    completed: false,
    category: 'achievement' as const,
    progress: 0,
    maxProgress: 1,
    type: 'cv' as const
  },
  {
    id: 'job_seeker',
    title: 'Dedicated Job Seeker',
    description: 'Apply to 50 jobs total',
    xpReward: 250,
    completed: false,
    category: 'achievement' as const,
    progress: 0,
    maxProgress: 50,
    type: 'job_search' as const
  },
  {
    id: 'interview_veteran',
    title: 'Interview Veteran',
    description: 'Answer 100 interview questions',
    xpReward: 300,
    completed: false,
    category: 'achievement' as const,
    progress: 0,
    maxProgress: 100,
    type: 'interview' as const
  }
];

export function QuestProvider({ children }: { children: ReactNode }) {
  const { addPoints } = usePoints();
  const { user } = useAuth();
  
  const [quests, setQuests] = useState<Quest[]>(getDefaultQuests());

  // Load quest progress from localStorage when user changes
  useEffect(() => {
    if (user?.id) {
      const questsKey = `talentix-quests-${user.id}`;
      const savedQuests = localStorage.getItem(questsKey);
      if (savedQuests) {
        try {
          const parsed = JSON.parse(savedQuests);
          setQuests(parsed);
        } catch (error) {
          
          // Reset to default quests if corrupted
          setQuests(getDefaultQuests());
        }
      } else {
        // New user - set default quests and mark daily login as completed
        const defaultQuests = getDefaultQuests();
        setQuests(defaultQuests.map(quest => 
          quest.id === 'daily_login' 
            ? { ...quest, progress: 1, completed: true }
            : quest
        ));
        // Award login points immediately
        setTimeout(() => {
          addPoints(10, 'Quest completed: Daily Check-in');
        }, 1000);
      }
    } else {
      // User logged out, reset to default
      setQuests(getDefaultQuests());
    }
  }, [user?.id, user?.email]);

  // Save quest progress to localStorage whenever they change (user-specific)
  useEffect(() => {
    if (user?.id && quests.length > 0) {
      const questsKey = `talentix-quests-${user.id}`;
      localStorage.setItem(questsKey, JSON.stringify(quests));
    }
  }, [quests, user?.id, user?.email]);

  const updateQuestProgress = (questId: string, progressIncrement: number = 1) => {
    setQuests(prev => prev.map(quest => {
      if (quest.id === questId && !quest.completed) {
        const newProgress = Math.min(quest.progress + progressIncrement, quest.maxProgress);
        const isNowCompleted = newProgress >= quest.maxProgress;
        
        if (isNowCompleted && !quest.completed) {
          // Quest just completed - award points
          addPoints(quest.xpReward, `Quest completed: ${quest.title}`);
        }
        
        return {
          ...quest,
          progress: newProgress,
          completed: isNowCompleted
        };
      }
      return quest;
    }));
  };

  const completeQuest = (questId: string) => {
    setQuests(prev => prev.map(quest => {
      if (quest.id === questId && !quest.completed) {
        addPoints(quest.xpReward, `Quest completed: ${quest.title}`);
        return { ...quest, completed: true, progress: quest.maxProgress };
      }
      return quest;
    }));
  };

  const resetDailyQuests = () => {
    setQuests(prev => prev.map(quest => {
      if (quest.category === 'daily') {
        return { ...quest, completed: false, progress: 0 };
      }
      return quest;
    }));
  };

  const getActiveQuests = () => quests.filter(q => !q.completed);
  const getCompletedQuests = () => quests.filter(q => q.completed);

  return (
    <QuestContext.Provider value={{
      quests,
      updateQuestProgress,
      completeQuest,
      resetDailyQuests,
      getActiveQuests,
      getCompletedQuests
    }}>
      {children}
    </QuestContext.Provider>
  );
}

export function useQuests() {
  const context = useContext(QuestContext);
  if (context === undefined) {
    throw new Error('useQuests must be used within a QuestProvider');
  }
  return context;
}

export type { Quest };

