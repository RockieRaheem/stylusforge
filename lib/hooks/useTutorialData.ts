import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { tutorialService, TutorialProgress } from '../services/tutorial.service';

export function useTutorialData() {
  const { user } = useAuth();
  const [progressMap, setProgressMap] = useState<Map<number, TutorialProgress>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTutorialProgress() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const progress = await tutorialService.getAllUserProgress(user.uid);
        setProgressMap(progress);
      } catch (err) {
        console.error('Error fetching tutorial progress:', err);
        setError('Failed to load tutorial progress');
      } finally {
        setLoading(false);
      }
    }

    fetchTutorialProgress();
  }, [user]);

  const isTutorialCompleted = (tutorialId: number): boolean => {
    const progress = progressMap.get(tutorialId);
    return progress?.assignmentCompleted || false;
  };

  const getTutorialProgress = (tutorialId: number): TutorialProgress | null => {
    return progressMap.get(tutorialId) || null;
  };

  const completeTutorial = async (tutorialId: number) => {
    if (!user) return;
    
    try {
      await tutorialService.completeTutorial(user.uid, tutorialId);
      // Refetch progress
      const progress = await tutorialService.getAllUserProgress(user.uid);
      setProgressMap(progress);
    } catch (err) {
      console.error('Error completing tutorial:', err);
      throw err;
    }
  };

  const updateProgress = async (
    tutorialId: number,
    updates: Partial<TutorialProgress>
  ) => {
    if (!user) return;

    try {
      await tutorialService.updateTutorialProgress(user.uid, tutorialId, updates);
      // Refetch progress
      const progress = await tutorialService.getAllUserProgress(user.uid);
      setProgressMap(progress);
    } catch (err) {
      console.error('Error updating progress:', err);
      throw err;
    }
  };

  const saveUserCode = async (tutorialId: number, code: string) => {
    if (!user) return;

    try {
      await tutorialService.saveUserCode(user.uid, tutorialId, code);
    } catch (err) {
      console.error('Error saving user code:', err);
      throw err;
    }
  };

  const getCompletedCount = (): number => {
    return Array.from(progressMap.values()).filter(p => p.assignmentCompleted).length;
  };

  return {
    progressMap,
    loading,
    error,
    isTutorialCompleted,
    getTutorialProgress,
    completeTutorial,
    updateProgress,
    saveUserCode,
    getCompletedCount,
  };
}
