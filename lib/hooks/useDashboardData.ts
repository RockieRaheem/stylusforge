import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { tutorialService, UserStats } from '../services/tutorial.service';
import { projectService, Project } from '../services/project.service';

export interface DashboardData {
  stats: UserStats;
  recentProjects: Project[];
  tutorialProgress: {
    completed: number;
    total: number;
    percentage: number;
  };
  loading: boolean;
  error: string | null;
}

export function useDashboardData() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData>({
    stats: {
      totalTutorialsCompleted: 0,
      totalProjectsCreated: 0,
      totalDeployments: 0,
      totalGasSaved: 0,
      currentStreak: 0,
    },
    recentProjects: [],
    tutorialProgress: {
      completed: 0,
      total: 10,
      percentage: 0,
    },
    loading: true,
    error: null,
  });

  useEffect(() => {
    async function fetchDashboardData() {
      if (!user) {
        setData(prev => ({ ...prev, loading: false }));
        return;
      }

      try {
        setData(prev => ({ ...prev, loading: true, error: null }));

        // Fetch user stats
        const stats = await tutorialService.getUserStats(user.uid);

        // Fetch recent projects
        const projects = await projectService.getUserProjects(user.uid, 6);

        // Fetch tutorial progress
        const completedCount = await tutorialService.getCompletedTutorialCount(user.uid);
        const totalTutorials = 10; // Total number of tutorials available
        const percentage = Math.round((completedCount / totalTutorials) * 100);

        setData({
          stats,
          recentProjects: projects,
          tutorialProgress: {
            completed: completedCount,
            total: totalTutorials,
            percentage,
          },
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setData(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to load dashboard data',
        }));
      }
    }

    fetchDashboardData();
  }, [user]);

  const refetch = async () => {
    if (user) {
      setData(prev => ({ ...prev, loading: true }));
      try {
        const stats = await tutorialService.getUserStats(user.uid);
        const projects = await projectService.getUserProjects(user.uid, 6);
        const completedCount = await tutorialService.getCompletedTutorialCount(user.uid);
        const percentage = Math.round((completedCount / 10) * 100);

        setData({
          stats,
          recentProjects: projects,
          tutorialProgress: {
            completed: completedCount,
            total: 10,
            percentage,
          },
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error('Error refetching dashboard data:', error);
        setData(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to refresh data',
        }));
      }
    }
  };

  return { ...data, refetch };
}
