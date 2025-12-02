import { useState, useEffect } from 'react';

interface TutorialProgress {
  userId: string;
  tutorialId: number;
  completedSections: number[];
  assignmentCompleted: boolean;
  userCode: string;
  completedAt?: string;
}

export function useTutorialProgress(userId: string | null) {
  const [progress, setProgress] = useState<TutorialProgress[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProgress = async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/tutorials/progress?userId=${userId}`);
      if (!response.ok) throw new Error('Failed to fetch progress');
      
      const data = await response.json();
      setProgress(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const saveProgress = async (tutorialId: number, data: Partial<TutorialProgress>) => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/tutorials/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, tutorialId, ...data }),
      });
      
      if (!response.ok) throw new Error('Failed to save progress');
      
      const savedProgress = await response.json();
      setProgress(prev => {
        const existingIndex = prev.findIndex(p => p.tutorialId === tutorialId);
        if (existingIndex >= 0) {
          const newProgress = [...prev];
          newProgress[existingIndex] = savedProgress;
          return newProgress;
        }
        return [...prev, savedProgress];
      });
      
      return savedProgress;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getTutorialProgress = (tutorialId: number): TutorialProgress | undefined => {
    return progress.find(p => p.tutorialId === tutorialId);
  };

  const isCompleted = (tutorialId: number): boolean => {
    const tutProgress = getTutorialProgress(tutorialId);
    return tutProgress?.assignmentCompleted || false;
  };

  useEffect(() => {
    fetchProgress();
  }, [userId]);

  return {
    progress,
    loading,
    error,
    fetchProgress,
    saveProgress,
    getTutorialProgress,
    isCompleted,
  };
}
