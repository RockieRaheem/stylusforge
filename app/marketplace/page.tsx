'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';

interface Project {
  id: number;
  title: string;
  description: string;
  author: { name: string; avatar: string; verified: boolean };
  thumbnail: string;
  tags: string[];
  category: string;
  stats: { views: number; stars: number; forks: number; downloads: number };
  gasOptimization: number;
  deployments: number;
  lastUpdated: string;
  featured: boolean;
  verified: boolean;
  pricing: { type: string; price?: number };
  pitchVideo?: string;
  demoVideo?: string;
  githubUrl?: string;
  liveUrl?: string;
}

export default function ProjectsGallery() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [likedProjects, setLikedProjects] = useState<Set<number>>(new Set());
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const MOCK_PROJECTS: Project[] = [
    {
      id: 1, title: 'Ultra-Efficient DEX Router', description: 'Next-generation DEX with 95% gas savings, AMM, concentrated liquidity, and cross-chain swaps.',
      author: { name: 'Alex Chen', avatar: '👨‍💻', verified: true }, thumbnail: '🔄', tags: ['DeFi', 'DEX', 'AMM'],
      category: 'defi', stats: { views: 12500, stars: 342, forks: 89, downloads: 1205 }, gasOptimization: 95,
      deployments: 47, lastUpdated: '2025-02-10', featured: true, verified: true, pricing: { type: 'free' },
      pitchVideo: 'https://example.com/dex-pitch', demoVideo: 'https://example.com/dex-demo'
    },
    {
      id: 2, title: 'Zero-Knowledge NFT Marketplace', description: 'Privacy-first NFT marketplace using ZK proofs with 92% lower gas costs.',
      author: { name: 'Sarah Martinez', avatar: '👩‍🎨', verified: true }, thumbnail: '🎨', tags: ['NFT', 'ZK-Proofs', 'Privacy'],
      category: 'nft', stats: { views: 9800, stars: 278, forks: 65, downloads: 892 }, gasOptimization: 92,
      deployments: 34, lastUpdated: '2025-02-08', featured: true, verified: true, pricing: { type: 'free' }
    },
    {
      id: 3, title: 'Gaming State Channels', description: 'Lightning-fast gaming infrastructure with real-time state updates and 97% gas optimization.',
      author: { name: 'Kevin Park', avatar: '🎮', verified: false }, thumbnail: '🎮', tags: ['Gaming', 'State Channels'],
      category: 'gaming', stats: { views: 15200, stars: 425, forks: 112, downloads: 1450 }, gasOptimization: 97,
      deployments: 28, lastUpdated: '2025-02-12', featured: false, verified: false, pricing: { type: 'free' }
    }
  ];

  useEffect(() => {
    const userProjects = JSON.parse(localStorage.getItem('userProjects') || '[]');
    setAllProjects([...userProjects, ...MOCK_PROJECTS]);
    const liked = JSON.parse(localStorage.getItem('likedProjects') || '[]');
    setLikedProjects(new Set(liked));
  }, []);

  const toggleLike = (id: number) => {
    const newLiked = new Set(likedProjects);
    if (newLiked.has(id)) newLiked.delete(id);
    else newLiked.add(id);
    setLikedProjects(newLiked);
    localStorage.setItem('likedProjects', JSON.stringify([...newLiked]));
  };

  const filteredProjects = allProjects
    .filter(p => (selectedCategory === 'all' || p.category === selectedCategory) &&
      (p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
       p.description.toLowerCase().includes(searchQuery.toLowerCase())))
    .sort((a, b) => sortBy === 'latest' ? new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime() : b.stats.stars - a.stats.stars);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <header className="relative h-16 border-b border-slate-800/50 backdrop-blur-xl bg-slate-900/30 px-6 sm:px-8">
        <div className="relative flex h-full w-full items-center justify-between max-sm:justify-center">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 text-cyan-400 group-hover:text-cyan-300 transition-colors">
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M42.1739 20.1739L27.8261 5.82609C29.1366 7.13663 28.3989 10.1876 26.2002 13.7654C24.8538 15.9564 22.9595 18.3449 20.6522 20.6522C18.3449 22.9595 15.9564 24.8538 13.7654 26.2002C10.1876 28.3989 7.13663 29.1366 5.82609 27.8261L20.1739 42.1739C21.4845 43.4845 24.5355 42.7467 28.1133 40.548C30.3042 39.2016 32.6927 37.3073 35 35C37.3073 32.6927 39.2016 30.3042 40.548 28.1133C42.7467 24.5355 43.4845 21.4845 42.1739 20.1739Z" fill="currentColor"/>
              </svg>
            </div>
            <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">StylusForge</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/marketplace/submit">
              <button className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold hover:scale-105 transition-all shadow-lg shadow-cyan-500/25">
                Submit Project
              </button>
            </Link>
          </div>
        </div>
      </header>

      <main className="relative w-full px-6 pt-8 pb-20 sm:container sm:mx-auto">
        <div className="mb-8">
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 mb-3">Projects Gallery</h1>
          <p className="text-lg text-slate-400">Explore innovative Stylus projects built by the community</p>
        </div>

        <div className="mb-8 flex items-center justify-between overflow-auto border-b border-slate-800/50 pb-6">
          <div className="flex gap-2">
            {['all', 'defi', 'nft', 'gaming', 'dao', 'infrastructure'].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`inline-flex h-10 items-center justify-between gap-2 rounded-xl px-4 py-2 transition-all font-bold text-sm capitalize ${
                  selectedCategory === cat 
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25' 
                    : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-white backdrop-blur-sm'
                }`}
              >
                <span className="whitespace-nowrap">{cat}</span>
              </button>
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={() => setSelectedCategory('all')} className="text-slate-400 font-bold hover:text-cyan-400 transition-colors">Clear all</button>
            <button
              onClick={() => setSortBy(sortBy === 'latest' ? 'popular' : 'latest')}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-slate-800/50 backdrop-blur-sm px-4 py-2 hover:bg-slate-800 transition-colors border border-slate-700/50"
            >
              <span className="font-bold text-sm text-white">{sortBy === 'latest' ? 'Latest to oldest' : 'Most popular'}</span>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-6">
          {filteredProjects.map(project => (
            <div key={project.id} className="w-full sm:w-[calc((100%-3rem)/3)]">
              <div
                onClick={() => setSelectedProject(project)}
                className="group cursor-pointer rounded-2xl border border-slate-800/50 bg-gradient-to-br from-slate-900/90 to-slate-900/50 backdrop-blur-sm transition-all duration-300 hover:border-cyan-500/50 hover:shadow-2xl hover:shadow-cyan-500/10 relative h-full p-6 hover:scale-[1.02]"
              >
                  {/* Glow Effect */}
                  <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative z-10 flex justify-between">
                    <span className="relative flex shrink-0 overflow-hidden size-20 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 items-center justify-center text-4xl backdrop-blur-sm">
                      {project.thumbnail}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); toggleLike(project.id); }}
                      className="flex h-16 w-16 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-slate-700/50 hover:border-red-400/50 transition-all bg-slate-800/50 backdrop-blur-sm hover:bg-slate-800"
                    >
                      <Heart
                        className={`w-6 h-6 transition-all ${likedProjects.has(project.id) ? 'fill-red-500 text-red-500' : 'text-slate-400 group-hover:text-slate-300'}`}
                      />
                      <span className="text-sm font-bold text-white">{project.stats.stars}</span>
                    </button>
                  </div>
                  <h1 className="relative mt-3 line-clamp-2 h-16 text-2xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-blue-400 transition-all">{project.title}</h1>
                  <p className="relative mt-3 line-clamp-2 h-11 text-sm text-slate-400 leading-relaxed">{project.description}</p>
                  <div className="relative mt-6 space-y-2">
                    <div className="flex items-center justify-between px-3 py-2 bg-slate-800/50 rounded-lg backdrop-blur-sm">
                      <span className="text-sm text-slate-500">Gas Optimization</span>
                      <span className="text-sm font-bold text-cyan-400">{project.gasOptimization}%</span>
                    </div>
                    <div className="flex items-center justify-between px-3 py-2 bg-slate-800/50 rounded-lg backdrop-blur-sm">
                      <span className="text-sm text-slate-500">Builder</span>
                      <div className="inline-flex items-center gap-1.5">
                        <span className="text-2xl">{project.author.avatar}</span>
                        <span className="text-sm font-bold text-white">{project.author.name}</span>
                      </div>
                    </div>
                  </div>
                  <div className="relative mt-4 flex flex-wrap items-center gap-2">
                    {project.tags.map(tag => (
                      <div key={tag} className="inline-flex items-center rounded-full bg-cyan-500/10 border border-cyan-500/30 px-3 py-1 text-xs font-medium text-cyan-400">
                        {tag}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* Project Details Modal */}
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setSelectedProject(null)}>
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
              {/* Header */}
              <div className="sticky top-0 bg-slate-900/95 backdrop-blur-xl border-b border-slate-800 p-6 flex items-center justify-between z-10">
                <div className="flex items-center gap-4">
                  <span className="text-5xl p-3 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-2xl">{selectedProject.thumbnail}</span>
                  <div>
                    <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">{selectedProject.title}</h2>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-2xl">{selectedProject.author.avatar}</span>
                      <span className="text-sm text-slate-400">by <span className="text-white font-semibold">{selectedProject.author.name}</span></span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setSelectedProject(null)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm hover:border-cyan-500/50 transition-colors">
                    <div className="text-sm text-slate-500 mb-1">Gas Optimization</div>
                    <div className="text-2xl font-black text-cyan-400">{selectedProject.gasOptimization}%</div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm hover:border-purple-500/50 transition-colors">
                    <div className="text-sm text-slate-500 mb-1">Stars</div>
                    <div className="text-2xl font-black text-purple-400">{selectedProject.stats.stars}</div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm hover:border-blue-500/50 transition-colors">
                    <div className="text-sm text-slate-500 mb-1">Forks</div>
                    <div className="text-2xl font-black text-blue-400">{selectedProject.stats.forks}</div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm hover:border-green-500/50 transition-colors">
                    <div className="text-sm text-slate-500 mb-1">Deployments</div>
                    <div className="text-2xl font-black text-green-400">{selectedProject.deployments}</div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-3">About This Project</h3>
                  <p className="text-slate-400 leading-relaxed">{selectedProject.description}</p>
                </div>

                {/* Tags */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-3">Technologies</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.tags.map(tag => (
                      <span key={tag} className="px-4 py-2 rounded-xl text-sm bg-slate-800/50 text-cyan-400 border border-cyan-500/30 font-medium backdrop-blur-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  {selectedProject.githubUrl && (
                    <a href={selectedProject.githubUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                      <button className="w-full px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 text-white transition-all font-bold shadow-lg">
                        View on GitHub
                      </button>
                    </a>
                  )}
                  {selectedProject.liveUrl && (
                    <a href={selectedProject.liveUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                      <button className="w-full px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white transition-all font-bold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40">
                        Live Demo
                      </button>
                    </a>
                  )}
                </div>

                {/* Videos */}
                {(selectedProject.pitchVideo || selectedProject.demoVideo) && (
                  <div className="space-y-4">
                    {selectedProject.pitchVideo && (
                      <div>
                        <h3 className="text-xl font-bold text-white mb-3">Pitch Video</h3>
                        <div className="aspect-video bg-slate-800/50 border border-slate-700/50 rounded-xl flex items-center justify-center backdrop-blur-sm">
                          <p className="text-slate-500">Video: {selectedProject.pitchVideo}</p>
                        </div>
                      </div>
                    )}
                    {selectedProject.demoVideo && (
                      <div>
                        <h3 className="text-xl font-bold text-white mb-3">Demo Video</h3>
                        <div className="aspect-video bg-slate-800/50 border border-slate-700/50 rounded-xl flex items-center justify-center backdrop-blur-sm">
                          <p className="text-slate-500">Video: {selectedProject.demoVideo}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

