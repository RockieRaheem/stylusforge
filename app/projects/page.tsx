'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/context/AuthContext';
import { projectService } from '@/lib/services/project.service';
import { Loader2, FolderCode, Calendar, Trash2, FileCode, ExternalLink, ArrowLeft, Search, Filter } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description?: string;
  code: string;
  language: string;
  createdAt: any;
  updatedAt: any;
  userId: string;
  deploymentId?: string;
}

export default function ProjectsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'name' | 'oldest'>('recent');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadProjects();
    }
  }, [user]);

  const loadProjects = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const userProjects = await projectService.getUserProjects(user.uid);
      setProjects(userProjects);
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }

    setDeletingId(projectId);
    try {
      await projectService.deleteProject(projectId);
      setProjects(prev => prev.filter(p => p.id !== projectId));
    } catch (error) {
      console.error('Failed to delete project:', error);
      alert('Failed to delete project. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleOpenProject = (projectId: string) => {
    router.push(`/ide?projectId=${projectId}`);
  };

  const filteredAndSortedProjects = projects
    .filter(project => 
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'oldest') {
        return a.createdAt?.toMillis() - b.createdAt?.toMillis();
      } else {
        return b.updatedAt?.toMillis() - a.updatedAt?.toMillis();
      }
    });

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getCodePreview = (code: string) => {
    const lines = code.split('\n').slice(0, 3);
    return lines.join('\n');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#58a6ff] mx-auto mb-4" />
          <p className="text-[#8b949e]">Loading your projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d1117]">
      {/* Header */}
      <div className="border-b border-[#30363d] bg-[#161b22]">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Link 
                href="/dashboard"
                className="p-2 hover:bg-[#30363d] rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-[#8b949e]" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                  <FolderCode className="h-8 w-8 text-[#58a6ff]" />
                  My Projects
                </h1>
                <p className="text-[#8b949e] mt-1">
                  {projects.length} {projects.length === 1 ? 'project' : 'projects'} total
                </p>
              </div>
            </div>
            <Link
              href="/ide"
              className="px-6 py-3 bg-[#238636] hover:bg-[#2ea043] text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
            >
              <FileCode className="h-5 w-5" />
              Create New Project
            </Link>
          </div>

          {/* Search and Filter */}
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#8b949e]" />
              <input
                type="text"
                placeholder="Search projects by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#0d1117] border border-[#30363d] rounded-lg text-white placeholder:text-[#8b949e] focus:border-[#58a6ff] focus:outline-none transition-colors"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-[#8b949e]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2.5 bg-[#0d1117] border border-[#30363d] rounded-lg text-white focus:border-[#58a6ff] focus:outline-none transition-colors cursor-pointer"
              >
                <option value="recent">Recently Updated</option>
                <option value="name">Name (A-Z)</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {filteredAndSortedProjects.length === 0 ? (
          <div className="text-center py-20">
            <FolderCode className="h-20 w-20 text-[#30363d] mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-white mb-2">
              {searchQuery ? 'No projects found' : 'No projects yet'}
            </h3>
            <p className="text-[#8b949e] mb-6">
              {searchQuery 
                ? 'Try adjusting your search query' 
                : 'Create your first project to get started with Stylus development'
              }
            </p>
            {!searchQuery && (
              <Link
                href="/ide"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#238636] hover:bg-[#2ea043] text-white rounded-lg font-semibold transition-colors"
              >
                <FileCode className="h-5 w-5" />
                Create Your First Project
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedProjects.map((project) => (
              <div
                key={project.id}
                className="group relative overflow-hidden border border-[#30363d] rounded-xl bg-[#161b22] hover:border-[#58a6ff] transition-all hover:shadow-xl hover:shadow-[#58a6ff]/10"
              >
                {/* Gradient Background */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#58a6ff]/10 to-transparent rounded-full blur-3xl group-hover:from-[#58a6ff]/20 transition-all" />
                
                <div className="relative z-10 p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-white truncate mb-1 group-hover:text-[#58a6ff] transition-colors">
                        {project.name}
                      </h3>
                      {project.description && (
                        <p className="text-sm text-[#8b949e] line-clamp-2">
                          {project.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 ml-2">
                      {project.deploymentId && (
                        <span className="w-2 h-2 bg-[#3fb950] rounded-full" title="Deployed" />
                      )}
                    </div>
                  </div>

                  {/* Code Preview */}
                  <div className="mb-4 p-3 bg-[#0d1117] rounded-lg border border-[#30363d]">
                    <pre className="text-xs text-[#8b949e] font-mono overflow-hidden">
                      {getCodePreview(project.code) || '// Empty project'}
                    </pre>
                  </div>

                  {/* Metadata */}
                  <div className="flex items-center gap-4 text-xs text-[#8b949e] mb-4">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{formatDate(project.updatedAt)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 bg-[#f85149] rounded-full" />
                      <span>{project.language}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenProject(project.id)}
                      className="flex-1 px-4 py-2 bg-[#238636] hover:bg-[#2ea043] text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Open
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      disabled={deletingId === project.id}
                      className="px-4 py-2 bg-[#da3633]/10 hover:bg-[#da3633]/20 text-[#f85149] text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {deletingId === project.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
