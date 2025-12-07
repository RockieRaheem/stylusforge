import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { tutorialService, UserStats } from '../services/tutorial.service';
import { projectService, Project } from '../services/project.service';
import { deploymentHistoryService, Deployment } from '../services/deployment-history.service';
import { DASHBOARD_EVENTS, onDashboardEvent } from '../events/dashboard-events';

export interface DashboardData {
  stats: UserStats;
  recentProjects: Project[];
  recentDeployments: Deployment[];
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
    recentDeployments: [],
    tutorialProgress: {
      completed: 0,
      total: 10,
      percentage: 0,
    },
    loading: true,
    error: null,
  });

  const fetchDashboardData = useCallback(async () => {
    if (!user) {
      console.log('⏭️ Dashboard: No user, skipping fetch');
      setData(prev => ({ ...prev, loading: false }));
      return;
    }

    try {
      console.log('🔄 Dashboard: Fetching data for user:', user.uid);
      setData(prev => ({ ...prev, loading: true, error: null }));
      
      const stats = await tutorialService.getUserStats(user.uid);
      console.log('📊 Dashboard: Stats fetched:', stats);
      
      const projects = await projectService.getUserProjects(user.uid, 6);
      console.log('📁 Dashboard: Projects fetched:', projects.length);
      
      const deployments = await deploymentHistoryService.getUserDeployments(user.uid, 5);
      console.log('🚀 Dashboard: Deployments fetched:', deployments.length);
      
      const completedCount = await tutorialService.getCompletedTutorialCount(user.uid);
      const totalTutorials = 10;
      const percentage = Math.round((completedCount / totalTutorials) * 100);

      setData({
        stats,
        recentProjects: projects,
        recentDeployments: deployments,
        tutorialProgress: {
          completed: completedCount,
          total: totalTutorials,
          percentage,
        },
        loading: false,
        error: null,
      });
      
      console.log('✅ Dashboard: Data updated successfully');
    } catch (error) {
      console.error('❌ Dashboard: Error fetching data:', error);
      setData(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to load dashboard data',
      }));
    }
  }, [user]);

  useEffect(() => {
    fetchDashboardData();

    const handleFocus = () => fetchDashboardData();
    const unsubscribeRefresh = onDashboardEvent(DASHBOARD_EVENTS.REFRESH_NEEDED, () => fetchDashboardData());
    const unsubscribeDeployment = onDashboardEvent(DASHBOARD_EVENTS.DEPLOYMENT_SUCCESS, () => fetchDashboardData());
    const unsubscribeTutorial = onDashboardEvent(DASHBOARD_EVENTS.TUTORIAL_COMPLETED, () => fetchDashboardData());
    const unsubscribeProject = onDashboardEvent(DASHBOARD_EVENTS.PROJECT_CREATED, () => fetchDashboardData());

    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
      unsubscribeRefresh();
      unsubscribeDeployment();
      unsubscribeTutorial();
      unsubscribeProject();
    };
  }, [fetchDashboardData]);

  const refetch = useCallback(async () => {
    await fetchDashboardData();
  }, [fetchDashboardData]);

  return { ...data, refetch };
}
