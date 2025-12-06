'use client';

import { useState, useEffect } from 'react';
import { useProject } from '@/lib/context/ProjectContext';
import { useRouter } from 'next/navigation';
import CreateProjectModal from '@/components/CreateProjectModal';
import ProjectBrowser from '@/components/ProjectBrowser';
import { FolderOpen } from 'lucide-react';

interface IDEProjectWrapperProps {
  children: React.ReactNode;
  onProjectLoad?: (projectId: string, projectName: string, code: string) => void;
  onProjectSave?: (code: string) => Promise<void>;
}

export default function IDEProjectWrapper({ children, onProjectLoad, onProjectSave }: IDEProjectWrapperProps) {
  const {
    currentProject,
    projects,
    isLoading,
    createProject,
    loadProject,
    deleteProject,
    setCurrentProject,
  } = useProject();
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showBrowser, setShowBrowser] = useState(false);
  const [hasShownWelcome, setHasShownWelcome] = useState(false);
  const router = useRouter();

  // Show welcome modal if user has no projects and hasn't seen it
  useEffect(() => {
    if (!isLoading && projects.length === 0 && !hasShownWelcome && !currentProject) {
      setShowCreateModal(true);
      setHasShownWelcome(true);
    }
  }, [isLoading, projects.length, hasShownWelcome, currentProject]);

  // Load project code when project changes
  useEffect(() => {
    if (currentProject && onProjectLoad) {
      onProjectLoad(currentProject.id, currentProject.name, currentProject.code);
    }
  }, [currentProject?.id]);

  const handleCreateProject = async (name: string, description: string) => {
    const project = await createProject(name, description);
    if (onProjectLoad) {
      onProjectLoad(project.id, project.name, project.code);
    }
  };

  const handleSelectProject = async (project: any) => {
    await loadProject(project.id);
  };

  return (
    <>
      {/* Project Indicator - Shows current project */}
      {currentProject && (
        <div className="absolute top-[35px] left-0 right-0 bg-[#2d2d30] border-b border-[#3e3e42] px-4 py-2 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <FolderOpen size={14} className="text-[#58a6ff]" />
            <span className="text-[#cccccc] text-xs font-medium">{currentProject.name}</span>
            {currentProject.description && (
              <span className="text-[#8b949e] text-xs">· {currentProject.description}</span>
            )}
          </div>
          <button
            onClick={() => setShowBrowser(true)}
            className="text-[#8b949e] hover:text-[#cccccc] text-xs px-2 py-1 rounded hover:bg-[#3e3e42] transition-colors"
          >
            Switch Project
          </button>
        </div>
      )}

      {children}

      {/* Modals */}
      <CreateProjectModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateProject}
      />

      <ProjectBrowser
        isOpen={showBrowser}
        onClose={() => setShowBrowser(false)}
        projects={projects}
        onSelectProject={handleSelectProject}
        onDeleteProject={deleteProject}
        onCreateNew={() => {
          setShowBrowser(false);
          setShowCreateModal(true);
        }}
      />
    </>
  );
}
