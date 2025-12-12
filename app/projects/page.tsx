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
        const aTime = a.createdAt instanceof Date ? a.createdAt.getTime() : 0;
        const bTime = b.createdAt instanceof Date ? b.createdAt.getTime() : 0;
        return aTime - bTime;
      } else {
        const aTime = a.updatedAt instanceof Date ? a.updatedAt.getTime() : 0;
        const bTime = b.updatedAt instanceof Date ? b.updatedAt.getTime() : 0;
        return bTime - aTime;
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
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="absolute inset-0 blur-2xl">
              <Loader2 className="h-12 w-12 animate-spin text-cyan-400 mx-auto" />
            </div>
            <Loader2 className="h-12 w-12 animate-spin text-cyan-400 mx-auto mb-4 relative" />
          </div>
          <p className="text-slate-400 font-medium">Loading your projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Header */}
      <div className="relative border-b border-slate-800/50 backdrop-blur-xl bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link 
                href="/dashboard"
                className="p-2.5 hover:bg-slate-800/50 rounded-xl transition-all hover:scale-105 group"
              >
                <ArrowLeft className="h-5 w-5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
              </Link>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl backdrop-blur-sm border border-cyan-500/30">
                    <FolderCode className="h-7 w-7 text-cyan-400" />
                  </div>
                  <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">
                    My Projects
                  </h1>
                </div>
                <p className="text-slate-400 ml-14">
                  {projects.length} {projects.length === 1 ? 'project' : 'projects'} • Building the future with Stylus
                </p>
              </div>
            </div>
            <Link
              href="/ide"
              className="group relative px-6 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-105"
            >
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 blur transition-opacity"></div>
              <FileCode className="h-5 w-5 relative z-10" />
              <span className="relative z-10">Create New Project</span>
            </Link>
          </div>

          {/* Search and Filter */}
          <div className="flex items-center gap-4">
            <div className="flex-1 relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
              <input
                type="text"
                placeholder="Search projects by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-slate-900/50 border border-slate-800 rounded-xl text-white placeholder:text-slate-500 focus:border-cyan-500/50 focus:bg-slate-900/80 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all backdrop-blur-sm"
              />
            </div>
            <div className="flex items-center gap-3 px-4 py-3.5 bg-slate-900/50 border border-slate-800 rounded-xl backdrop-blur-sm">
              <Filter className="h-5 w-5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent border-none text-white focus:outline-none cursor-pointer font-medium"
              >
                <option value="recent" className="bg-slate-900">Recently Updated</option>
                <option value="name" className="bg-slate-900">Name (A-Z)</option>
                <option value="oldest" className="bg-slate-900">Oldest First</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="relative max-w-7xl mx-auto px-6 py-12">
        {filteredAndSortedProjects.length === 0 ? (
          <div className="text-center py-24">
            <div className="relative inline-block mb-8">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-full blur-2xl"></div>
              <div className="relative p-8 bg-slate-900/50 backdrop-blur-sm rounded-full border border-slate-800">
                <FolderCode className="h-20 w-20 text-slate-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">
              {searchQuery ? 'No projects found' : 'No projects yet'}
            </h3>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">
              {searchQuery 
                ? 'Try adjusting your search query or create a new project' 
                : 'Create your first project to get started with Stylus development and unlock the power of Rust smart contracts'
              }
            </p>
            {!searchQuery && (
              <Link
                href="/ide"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-105"
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
                className="group relative overflow-hidden border border-slate-800/50 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-900/50 hover:border-cyan-500/50 transition-all hover:shadow-2xl hover:shadow-cyan-500/10 backdrop-blur-sm hover:scale-[1.02]"
              >
                {/* Gradient Glow Effect */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10 p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center border border-cyan-500/30">
                          <FileCode className="h-4 w-4 text-cyan-400" />
                        </div>
                        <h3 className="text-lg font-bold text-white truncate group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-blue-400 transition-all">
                          {project.name}
                        </h3>
                      </div>
                      {project.description && (
                        <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">
                          {project.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 ml-2">
                      {project.deploymentId && (
                        <div className="relative">
                          <div className="absolute inset-0 bg-green-500 rounded-full blur-sm animate-pulse"></div>
                          <div className="relative w-2 h-2 bg-green-400 rounded-full" title="Deployed"></div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Code Preview */}
                  <div className="mb-4 p-4 bg-slate-950/50 rounded-xl border border-slate-800/50 backdrop-blur-sm group-hover:border-slate-700/50 transition-colors">
                    <pre className="text-xs text-slate-500 font-mono overflow-hidden leading-relaxed">
                      {getCodePreview(project.code) || '// Empty project'}
                    </pre>
                  </div>

                  {/* Metadata */}
                  <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-800/50 rounded-lg backdrop-blur-sm">
                      <Calendar className="h-3.5 w-3.5 text-slate-500" />
                      <span>{formatDate(project.updatedAt)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-800/50 rounded-lg backdrop-blur-sm">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="font-medium">{project.language}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenProject(project.id)}
                      className="flex-1 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Open
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      disabled={deletingId === project.id}
                      className="px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 text-red-400 hover:text-red-300 text-sm font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
