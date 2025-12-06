'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { projectService, Project } from '../services/project.service';
import { notifyProjectCreated } from '../events/dashboard-events';

interface ProjectContextType {
  currentProject: Project | null;
  projects: Project[];
  isLoading: boolean;
  createProject: (name: string, description?: string) => Promise<Project>;
  loadProject: (projectId: string) => Promise<void>;
  updateCurrentProject: (code: string) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
  refreshProjects: () => Promise<void>;
  setCurrentProject: (project: Project | null) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const { userData } = useAuth();
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load user's projects
  const refreshProjects = async () => {
    if (!userData?.uid) return;
    
    try {
      setIsLoading(true);
      const userProjects = await projectService.getUserProjects(userData.uid);
      setProjects(userProjects);
    } catch (error) {
      console.error('❌ Failed to load projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load projects when user logs in
  useEffect(() => {
    if (userData?.uid) {
      refreshProjects();
    } else {
      setProjects([]);
      setCurrentProject(null);
    }
  }, [userData?.uid]);

  // Create new project
  const createProject = async (name: string, description?: string): Promise<Project> => {
    if (!userData?.uid) throw new Error('User not authenticated');

    const projectId = await projectService.createProject(
      userData.uid,
      name,
      '', // Empty code initially
      'rust',
      description
    );

    const newProject = await projectService.getProject(projectId);
    if (!newProject) throw new Error('Failed to retrieve created project');

    await refreshProjects();
    setCurrentProject(newProject);
    
    notifyProjectCreated({ projectId, projectName: name });
    console.log('✅ Project created:', projectId);
    
    return newProject;
  };

  // Load a specific project
  const loadProject = async (projectId: string) => {
    try {
      setIsLoading(true);
      const project = await projectService.getProject(projectId);
      if (project) {
        setCurrentProject(project);
        console.log('✅ Project loaded:', project.name);
      }
    } catch (error) {
      console.error('❌ Failed to load project:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update current project code
  const updateCurrentProject = async (code: string) => {
    if (!currentProject) return;

    try {
      await projectService.updateProject(currentProject.id, { code });
      setCurrentProject({ ...currentProject, code });
      console.log('✅ Project updated:', currentProject.name);
    } catch (error) {
      console.error('❌ Failed to update project:', error);
      throw error;
    }
  };

  // Delete project
  const deleteProject = async (projectId: string) => {
    try {
      await projectService.deleteProject(projectId);
      await refreshProjects();
      if (currentProject?.id === projectId) {
        setCurrentProject(null);
      }
      console.log('✅ Project deleted:', projectId);
    } catch (error) {
      console.error('❌ Failed to delete project:', error);
      throw error;
    }
  };

  return (
    <ProjectContext.Provider
      value={{
        currentProject,
        projects,
        isLoading,
        createProject,
        loadProject,
        updateCurrentProject,
        deleteProject,
        refreshProjects,
        setCurrentProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
}
