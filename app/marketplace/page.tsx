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
    <div className="min-h-screen bg-white">
      <header className="h-16 border-b border-gray-200 bg-white px-6 sm:px-8">
        <div className="relative flex h-full w-full items-center justify-between max-sm:justify-center">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 text-primary">
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M42.1739 20.1739L27.8261 5.82609C29.1366 7.13663 28.3989 10.1876 26.2002 13.7654C24.8538 15.9564 22.9595 18.3449 20.6522 20.6522C18.3449 22.9595 15.9564 24.8538 13.7654 26.2002C10.1876 28.3989 7.13663 29.1366 5.82609 27.8261L20.1739 42.1739C21.4845 43.4845 24.5355 42.7467 28.1133 40.548C30.3042 39.2016 32.6927 37.3073 35 35C37.3073 32.6927 39.2016 30.3042 40.548 28.1133C42.7467 24.5355 43.4845 21.4845 42.1739 20.1739Z" fill="currentColor"/>
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-900">StylusForge</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/marketplace/submit">
              <button className="px-4 py-2 rounded-lg bg-yellow-400 text-gray-900 font-bold hover:bg-yellow-500 transition-colors">
                Submit Project
              </button>
            </Link>
          </div>
        </div>
      </header>

      <main className="w-full px-6 pt-8 pb-20 sm:container sm:mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-black text-gray-900 mb-2">Projects Gallery</h1>
          <p className="text-lg text-gray-600">Explore innovative Stylus projects built by the community</p>
        </div>

        <div className="mb-6 flex items-center justify-between overflow-auto border-b border-gray-200 pb-6">
          <div className="flex gap-2">
            {['all', 'defi', 'nft', 'gaming', 'dao', 'infrastructure'].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`inline-flex h-9 items-center justify-between gap-2 rounded-lg px-3 py-2 transition-colors ${
                  selectedCategory === cat ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                <span className="whitespace-nowrap font-bold text-sm capitalize">{cat}</span>
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={() => setSelectedCategory('all')} className="text-gray-900 font-bold hover:text-gray-600">Clear all</button>
            <button
              onClick={() => setSortBy(sortBy === 'latest' ? 'popular' : 'latest')}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-gray-100 px-3 py-2"
            >
              <span className="font-bold text-sm">{sortBy === 'latest' ? 'Latest to oldest' : 'Most popular'}</span>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-6">
          {filteredProjects.map(project => (
            <div key={project.id} className="w-full sm:w-[calc((100%-3rem)/3)]">
              <div
                onClick={() => setSelectedProject(project)}
                className="cursor-pointer rounded-2xl border border-gray-200 bg-white transition-colors duration-300 hover:bg-gray-50 relative h-full p-6"
              >
                  <div className="flex justify-between">
                    <span className="relative flex shrink-0 overflow-hidden size-20 rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 items-center justify-center text-4xl">
                      {project.thumbnail}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => { e.preventDefault(); toggleLike(project.id); }}
                      className="flex h-16 w-16 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-gray-300 hover:border-red-400 transition-colors"
                    >
                      <Heart
                        className={`w-6 h-6 ${likedProjects.has(project.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
                      />
                      <span className="text-sm font-bold text-gray-900">{project.stats.stars}</span>
                    </button>
                  </div>
                  <h1 className="mt-3 line-clamp-2 h-16 text-2xl font-bold text-gray-900">{project.title}</h1>
                  <p className="mt-3 line-clamp-2 h-11 text-sm text-gray-600">{project.description}</p>
                  <div className="mt-6 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Gas Optimization</span>
                      <span className="text-sm font-bold text-gray-900">{project.gasOptimization}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Builder</span>
                      <div className="inline-flex items-center gap-1.5">
                        <span className="text-2xl">{project.author.avatar}</span>
                        <span className="text-sm font-bold text-gray-900">{project.author.name}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-1.5">
                    {project.tags.map(tag => (
                      <div key={tag} className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-gray-900">
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
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setSelectedProject(null)}>
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-5xl">{selectedProject.thumbnail}</span>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedProject.title}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-2xl">{selectedProject.author.avatar}</span>
                      <span className="text-sm text-gray-600">by {selectedProject.author.name}</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setSelectedProject(null)} className="text-gray-400 hover:text-gray-900">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                    <div className="text-sm text-gray-500 mb-1">Gas Optimization</div>
                    <div className="text-2xl font-bold text-gray-900">{selectedProject.gasOptimization}%</div>
                  </div>
                  <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                    <div className="text-sm text-gray-500 mb-1">Stars</div>
                    <div className="text-2xl font-bold text-gray-900">{selectedProject.stats.stars}</div>
                  </div>
                  <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                    <div className="text-sm text-gray-500 mb-1">Forks</div>
                    <div className="text-2xl font-bold text-gray-900">{selectedProject.stats.forks}</div>
                  </div>
                  <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                    <div className="text-sm text-gray-500 mb-1">Deployments</div>
                    <div className="text-2xl font-bold text-gray-900">{selectedProject.deployments}</div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">About This Project</h3>
                  <p className="text-gray-600 leading-relaxed">{selectedProject.description}</p>
                </div>

                {/* Tags */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Technologies</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.tags.map(tag => (
                      <span key={tag} className="px-3 py-1.5 rounded-lg text-sm bg-gray-100 text-gray-900 border border-gray-200">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  {selectedProject.githubUrl && (
                    <a href={selectedProject.githubUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                      <button className="w-full px-6 py-3 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-colors font-bold">
                        View on GitHub
                      </button>
                    </a>
                  )}
                  {selectedProject.liveUrl && (
                    <a href={selectedProject.liveUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                      <button className="w-full px-6 py-3 rounded-lg bg-yellow-400 text-gray-900 hover:bg-yellow-500 transition-colors font-bold">
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
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Pitch Video</h3>
                        <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                          <p className="text-gray-500">Video: {selectedProject.pitchVideo}</p>
                        </div>
                      </div>
                    )}
                    {selectedProject.demoVideo && (
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Demo Video</h3>
                        <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                          <p className="text-gray-500">Video: {selectedProject.demoVideo}</p>
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

