'use client';

import { useState } from 'react';
import { X, Code, Trash2, FileCode, Calendar } from 'lucide-react';
import { Project } from '@/lib/services/project.service';

interface ProjectBrowserProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onDeleteProject: (projectId: string) => Promise<void>;
  onCreateNew: () => void;
}

export default function ProjectBrowser({ 
  isOpen, 
  onClose, 
  projects, 
  onSelectProject,
  onDeleteProject,
  onCreateNew 
}: ProjectBrowserProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDelete = async (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation();
    
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }

    try {
      setDeletingId(projectId);
      await onDeleteProject(projectId);
    } catch (error) {
      console.error('Failed to delete project:', error);
      alert('Failed to delete project');
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    if (days < 365) return `${Math.floor(days / 30)} months ago`;
    return `${Math.floor(days / 365)} years ago`;
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#0d1117] border border-[#30363d] rounded-xl shadow-2xl max-w-4xl w-full max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#21262d]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#58a6ff]/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-[#58a6ff]">folder_open</span>
            </div>
            <div>
              <h2 className="text-white text-lg font-semibold">My Projects</h2>
              <p className="text-[#8b949e] text-sm">{projects.length} project{projects.length !== 1 ? 's' : ''} total</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#8b949e] hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Projects List */}
        <div className="flex-1 overflow-y-auto p-6">
          {projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-20 h-20 rounded-full bg-[#21262d] flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-[#8b949e] text-4xl">code_off</span>
              </div>
              <h3 className="text-white text-lg font-semibold mb-2">No projects yet</h3>
              <p className="text-[#8b949e] text-sm mb-6 max-w-sm">
                Create your first Stylus smart contract project to get started
              </p>
              <button
                onClick={() => {
                  onClose();
                  onCreateNew();
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#238636] hover:bg-[#2ea043] rounded-lg text-white font-medium transition-all"
              >
                <span className="material-symbols-outlined text-lg">add</span>
                Create First Project
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => {
                    onSelectProject(project);
                    onClose();
                  }}
                  className="group border border-[#30363d] rounded-lg p-5 hover:border-[#58a6ff] transition-all cursor-pointer bg-gradient-to-br from-[#161b22] to-[#0d1117] hover:shadow-lg hover:shadow-[#58a6ff]/10"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <FileCode size={16} className="text-[#58a6ff] flex-shrink-0" />
                        <h3 className="text-white font-semibold truncate group-hover:text-[#58a6ff] transition-colors">
                          {project.name}
                        </h3>
                      </div>
                      {project.description && (
                        <p className="text-[#8b949e] text-sm line-clamp-2 mb-2">
                          {project.description}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={(e) => handleDelete(e, project.id)}
                      disabled={deletingId === project.id}
                      className="text-[#8b949e] hover:text-[#f85149] transition-colors ml-2 disabled:opacity-50"
                      title="Delete project"
                    >
                      {deletingId === project.id ? (
                        <div className="w-4 h-4 border-2 border-[#8b949e]/30 border-t-[#8b949e] rounded-full animate-spin"></div>
                      ) : (
                        <Trash2 size={16} />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-[#8b949e]">
                    <div className="flex items-center gap-1">
                      <Code size={14} />
                      <span className="capitalize">{project.language}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span>{formatDate(project.updatedAt)}</span>
                    </div>
                    {project.isDeployed && (
                      <div className="flex items-center gap-1 text-[#3fb950]">
                        <span className="material-symbols-outlined text-sm">check_circle</span>
                        <span>Deployed</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {projects.length > 0 && (
          <div className="border-t border-[#21262d] p-4">
            <button
              onClick={() => {
                onClose();
                onCreateNew();
              }}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-[#30363d] rounded-lg text-[#8b949e] hover:text-white hover:border-[#58a6ff] hover:bg-[#58a6ff]/5 transition-all"
            >
              <span className="material-symbols-outlined text-lg">add</span>
              Create New Project
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
