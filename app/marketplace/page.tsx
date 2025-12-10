'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Play, Code2, Star, TrendingUp, Search, LayoutGrid, List,
  Github, ExternalLink, Share, CheckCircle, X, Zap, GitFork, Sparkles
} from 'lucide-react';

// Project interface
interface Project {
  id: number;
  title: string;
  description: string;
  author: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  thumbnail: string; // emoji
  tags: string[];
  category: 'defi' | 'nft' | 'gaming' | 'dao' | 'infrastructure' | 'other';
  stats: {
    views: number;
    stars: number;
    forks: number;
    downloads: number;
  };
  gasOptimization: number; // percentage
  deployments: number;
  lastUpdated: string;
  featured: boolean;
  verified: boolean;
  pricing: {
    type: 'free' | 'paid' | 'freemium';
    price?: number;
  };
  pitchVideo?: string;
  demoVideo?: string;
}

export default function MarketplacePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'popular' | 'recent' | 'gas'>('popular');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'pitch' | 'demo'>('overview');
  const [allProjects, setAllProjects] = useState<Project[]>([]);

  // Load projects on mount
  useEffect(() => {
    // Get user-submitted projects from localStorage
    const userProjects = JSON.parse(localStorage.getItem('userProjects') || '[]');
    
    // Combine with mock projects
    setAllProjects([...userProjects, ...MOCK_PROJECTS]);
  }, []);

  // Mock projects data
  const MOCK_PROJECTS: Project[] = [
    {
      id: 1,
      title: 'Ultra-Efficient DEX Router',
      description: 'Next-generation decentralized exchange router with 95% gas savings. Features automated market making, concentrated liquidity pools, and cross-chain swaps powered by Arbitrum Stylus.',
      author: { name: 'Alex Chen', avatar: '👨‍💻', verified: true },
      thumbnail: '🔄',
      tags: ['DeFi', 'DEX', 'AMM', 'Liquidity'],
      category: 'defi',
      stats: { views: 12500, stars: 342, forks: 89, downloads: 1205 },
      gasOptimization: 95,
      deployments: 47,
      lastUpdated: '2025-02-10',
      featured: true,
      verified: true,
      pricing: { type: 'free' },
      pitchVideo: 'https://example.com/dex-pitch',
      demoVideo: 'https://example.com/dex-demo'
    },
    {
      id: 2,
      title: 'Zero-Knowledge NFT Marketplace',
      description: 'Privacy-first NFT marketplace using ZK proofs. Trade, mint, and collect digital assets with complete anonymity while enjoying 92% lower gas costs compared to traditional solutions.',
      author: { name: 'Sarah Martinez', avatar: '👩‍🎨', verified: true },
      thumbnail: '🎨',
      tags: ['NFT', 'ZK-Proofs', 'Privacy', 'Marketplace'],
      category: 'nft',
      stats: { views: 9800, stars: 278, forks: 65, downloads: 892 },
      gasOptimization: 92,
      deployments: 34,
      lastUpdated: '2025-02-08',
      featured: true,
      verified: true,
      pricing: { type: 'free' },
      pitchVideo: 'https://example.com/nft-pitch',
      demoVideo: 'https://example.com/nft-demo'
    },
    {
      id: 3,
      title: 'Gaming State Channels',
      description: 'Lightning-fast gaming infrastructure with real-time state updates. Perfect for on-chain games requiring instant player interactions with 97% gas optimization.',
      author: { name: 'Kevin Park', avatar: '🎮', verified: false },
      thumbnail: '🎮',
      tags: ['Gaming', 'State Channels', 'Real-time'],
      category: 'gaming',
      stats: { views: 15200, stars: 425, forks: 112, downloads: 1450 },
      gasOptimization: 97,
      deployments: 28,
      lastUpdated: '2025-02-12',
      featured: false,
      verified: false,
      pricing: { type: 'free' }
    },
    {
      id: 4,
      title: 'DAO Governance Suite',
      description: 'Complete governance platform for DAOs. Includes proposal systems, voting mechanisms, treasury management, delegation, and multi-sig support with massive gas savings.',
      author: { name: 'Emma Thompson', avatar: '⚖️', verified: true },
      thumbnail: '🗳️',
      tags: ['DAO', 'Governance', 'Voting', 'Treasury'],
      category: 'dao',
      stats: { views: 7600, stars: 198, forks: 45, downloads: 623 },
      gasOptimization: 88,
      deployments: 19,
      lastUpdated: '2025-02-05',
      featured: false,
      verified: true,
      pricing: { type: 'freemium', price: 99 },
      pitchVideo: 'https://example.com/dao-pitch'
    },
    {
      id: 5,
      title: 'Cross-Chain Bridge Protocol',
      description: 'Secure and efficient cross-chain bridge for seamless asset transfers. Supports multiple chains with robust security guarantees and 94% lower gas costs.',
      author: { name: 'David Kim', avatar: '🌉', verified: true },
      thumbnail: '🌉',
      tags: ['Bridge', 'Cross-Chain', 'Infrastructure'],
      category: 'infrastructure',
      stats: { views: 18900, stars: 567, forks: 134, downloads: 2340 },
      gasOptimization: 94,
      deployments: 52,
      lastUpdated: '2025-02-11',
      featured: true,
      verified: true,
      pricing: { type: 'free' },
      demoVideo: 'https://example.com/bridge-demo'
    },
    {
      id: 6,
      title: 'Automated Market Maker',
      description: 'Advanced AMM with dynamic fee structures and impermanent loss protection. Built for professional traders requiring maximum capital efficiency with minimal gas overhead.',
      author: { name: 'Lisa Wong', avatar: '💰', verified: true },
      thumbnail: '💎',
      tags: ['DeFi', 'AMM', 'Trading', 'Liquidity'],
      category: 'defi',
      stats: { views: 14300, stars: 389, forks: 98, downloads: 1567 },
      gasOptimization: 96,
      deployments: 41,
      lastUpdated: '2025-02-09',
      featured: true,
      verified: true,
      pricing: { type: 'free' },
      pitchVideo: 'https://example.com/amm-pitch',
      demoVideo: 'https://example.com/amm-demo'
    }
  ];

  const CATEGORIES = [
    { id: 'all', label: 'All Projects', icon: '📦' },
    { id: 'defi', label: 'DeFi', icon: '💰' },
    { id: 'nft', label: 'NFT', icon: '🎨' },
    { id: 'gaming', label: 'Gaming', icon: '🎮' },
    { id: 'dao', label: 'DAO', icon: '🗳️' },
    { id: 'infrastructure', label: 'Infrastructure', icon: '🏗️' },
    { id: 'other', label: 'Other', icon: '🔧' }
  ];

  // Filter and sort projects
  const filteredProjects = allProjects
    .filter(p => {
      const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'popular') return b.stats.stars - a.stats.stars;
      if (sortBy === 'recent') return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
      if (sortBy === 'gas') return b.gasOptimization - a.gasOptimization;
      return 0;
    });

  const featuredProjects = allProjects.filter(p => p.featured);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-800/50 bg-slate-950/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-3">
                <div className="w-8 h-8 text-primary">
                  <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <path d="M42.1739 20.1739L27.8261 5.82609C29.1366 7.13663 28.3989 10.1876 26.2002 13.7654C24.8538 15.9564 22.9595 18.3449 20.6522 20.6522C18.3449 22.9595 15.9564 24.8538 13.7654 26.2002C10.1876 28.3989 7.13663 29.1366 5.82609 27.8261L20.1739 42.1739C21.4845 43.4845 24.5355 42.7467 28.1133 40.548C30.3042 39.2016 32.6927 37.3073 35 35C37.3073 32.6927 39.2016 30.3042 40.548 28.1133C42.7467 24.5355 43.4845 21.4845 42.1739 20.1739Z" fill="currentColor"/>
                  </svg>
                </div>
                <span className="text-xl font-bold">StylusForge</span>
              </Link>
              <nav className="hidden md:flex items-center gap-6">
                <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">Dashboard</Link>
                <Link href="/tutorial" className="text-gray-400 hover:text-white transition-colors">Tutorials</Link>
                <Link href="/ide" className="text-gray-400 hover:text-white transition-colors">IDE</Link>
                <Link href="/marketplace" className="text-white font-semibold">Marketplace</Link>
              </nav>
            </div>
            <Link href="/marketplace/submit">
              <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-primary/20 transition-all">
                <span className="text-xl">+</span>
                <span className="font-semibold">Submit Project</span>
              </button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6">
            <Code2 className="w-5 h-5 text-primary" />
            <span className="text-primary text-sm font-semibold">Stylus Project Marketplace</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400">
            Discover Web3 Innovation
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Explore cutting-edge projects built with Arbitrum Stylus. Featuring pitch videos, demos, and ultra-efficient smart contracts.
          </p>
        </section>

        {/* Search & Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg bg-slate-900/50 border border-slate-800 text-white focus:border-primary focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 overflow-x-auto">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                    selectedCategory === cat.id
                      ? 'bg-primary text-white shadow-lg shadow-primary/20'
                      : 'bg-slate-900/50 text-gray-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>

            <div className="ml-auto flex items-center gap-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-800 text-white focus:border-primary focus:outline-none"
              >
                <option value="popular">Most Popular</option>
                <option value="recent">Recently Updated</option>
                <option value="gas">Gas Efficiency</option>
              </select>

              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'grid' ? 'bg-primary text-white' : 'bg-slate-900/50 text-gray-400 hover:bg-slate-800'
                  }`}
                >
                  <LayoutGrid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'list' ? 'bg-primary text-white' : 'bg-slate-900/50 text-gray-400 hover:bg-slate-800'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Projects */}
        {selectedCategory === 'all' && featuredProjects.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-yellow-400" />
              Featured Projects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredProjects.slice(0, 2).map(project => (
                <div
                  key={project.id}
                  onClick={() => setSelectedProject(project)}
                  className="group relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-slate-700 overflow-hidden hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                >
                  <div className="absolute top-4 right-4 z-10 flex gap-2">
                    {project.verified && (
                      <div className="px-3 py-1.5 rounded-full bg-blue-500/20 border border-blue-500/50 backdrop-blur-sm">
                        <span className="text-xs font-bold text-blue-400 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Verified
                        </span>
                      </div>
                    )}
                    {project.featured && (
                      <div className="px-3 py-1.5 rounded-full bg-yellow-500/20 border border-yellow-500/50 backdrop-blur-sm">
                        <span className="text-xs font-bold text-yellow-400 flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          Featured
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="relative h-64 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <div className="text-8xl">{project.thumbnail}</div>
                    {(project.pitchVideo || project.demoVideo) && (
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border-2 border-white/50">
                          <Play className="w-8 h-8 text-white ml-1" />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-sm font-bold">
                        {project.author.avatar}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold">{project.author.name}</span>
                          {project.author.verified && <CheckCircle className="w-4 h-4 text-blue-400" />}
                        </div>
                        <div className="text-xs text-gray-500">Project Creator</div>
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                      {project.description}
                    </p>

                    <div className="grid grid-cols-4 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-primary">{project.gasOptimization}%</div>
                        <div className="text-xs text-gray-500">Gas Saved</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold">{project.stats.stars}</div>
                        <div className="text-xs text-gray-500">Stars</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold">{project.stats.forks}</div>
                        <div className="text-xs text-gray-500">Forks</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold">{project.deployments}</div>
                        <div className="text-xs text-gray-500">Deploys</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        {project.tags.slice(0, 2).map(tag => (
                          <span key={tag} className="px-2 py-1 rounded text-xs bg-slate-800 text-gray-400">
                            {tag}
                          </span>
                        ))}
                      </div>
                      {project.pricing.type === 'free' ? (
                        <span className="text-sm font-bold text-green-400">Free</span>
                      ) : (
                        <span className="text-sm font-bold">${project.pricing.price}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* All Projects */}
        <section>
          <h2 className="text-2xl font-bold mb-6">
            {selectedCategory === 'all' ? 'All Projects' : CATEGORIES.find(c => c.id === selectedCategory)?.label}
          </h2>
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {filteredProjects.map(project => (
              <div
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className="group relative bg-slate-900/50 rounded-xl border border-slate-800 overflow-hidden hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              >
                <div className="relative h-48 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                  <div className="text-6xl">{project.thumbnail}</div>
                  {(project.pitchVideo || project.demoVideo) && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border-2 border-white/50">
                        <Play className="w-6 h-6 text-white ml-1" />
                      </div>
                    </div>
                  )}
                  {project.verified && (
                    <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-xs font-bold">
                      {project.author.avatar}
                    </div>
                    <span className="text-sm font-medium text-gray-300">{project.author.name}</span>
                  </div>

                  <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-1">
                    {project.title}
                  </h3>
                  <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                    {project.description}
                  </p>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3" /> {project.stats.stars}
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" /> {project.gasOptimization}%
                      </span>
                    </div>
                    {project.pricing.type === 'free' ? (
                      <span className="text-xs font-bold text-green-400">Free</span>
                    ) : (
                      <span className="text-xs font-bold">${project.pricing.price}</span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {project.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="px-2 py-0.5 rounded text-xs bg-slate-800 text-gray-400">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedProject(null)}>
          <div className="bg-slate-900 rounded-2xl border border-slate-700 max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="sticky top-0 bg-slate-900 border-b border-slate-800 p-6 flex items-center justify-between z-10">
              <div className="flex items-center gap-4">
                <div className="text-4xl">{selectedProject.thumbnail}</div>
                <div>
                  <h2 className="text-2xl font-bold">{selectedProject.title}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-gray-400">by {selectedProject.author.name}</span>
                    {selectedProject.author.verified && <CheckCircle className="w-4 h-4 text-blue-400" />}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex gap-1 px-6 pt-4 border-b border-slate-800">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2 rounded-t-lg font-medium transition-all ${
                  activeTab === 'overview' ? 'bg-slate-800 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                Overview
              </button>
              {selectedProject.pitchVideo && (
                <button
                  onClick={() => setActiveTab('pitch')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-t-lg font-medium transition-all ${
                    activeTab === 'pitch' ? 'bg-slate-800 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Play className="w-4 h-4" />
                  Pitch Video
                </button>
              )}
              {selectedProject.demoVideo && (
                <button
                  onClick={() => setActiveTab('demo')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-t-lg font-medium transition-all ${
                    activeTab === 'demo' ? 'bg-slate-800 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Code2 className="w-4 h-4" />
                  Demo Video
                </button>
              )}
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                      <div className="flex items-center gap-2 text-primary mb-2">
                        <Zap className="w-5 h-5" />
                        <span className="text-sm text-gray-400">Gas Optimization</span>
                      </div>
                      <div className="text-2xl font-bold">{selectedProject.gasOptimization}%</div>
                    </div>
                    <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="w-5 h-5 text-yellow-400" />
                        <span className="text-sm text-gray-400">Stars</span>
                      </div>
                      <div className="text-2xl font-bold">{selectedProject.stats.stars}</div>
                    </div>
                    <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                      <div className="flex items-center gap-2 mb-2">
                        <GitFork className="w-5 h-5 text-gray-400" />
                        <span className="text-sm text-gray-400">Forks</span>
                      </div>
                      <div className="text-2xl font-bold">{selectedProject.stats.forks}</div>
                    </div>
                    <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-5 h-5 text-green-400" />
                        <span className="text-sm text-gray-400">Deployments</span>
                      </div>
                      <div className="text-2xl font-bold">{selectedProject.deployments}</div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h3 className="text-lg font-bold mb-3">About This Project</h3>
                    <p className="text-gray-400 leading-relaxed">{selectedProject.description}</p>
                  </div>

                  {/* Tags */}
                  <div>
                    <h3 className="text-lg font-bold mb-3">Technologies</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.tags.map(tag => (
                        <span key={tag} className="px-3 py-1.5 rounded-lg text-sm bg-slate-800 text-gray-300 border border-slate-700">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <button className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-primary/20 transition-all font-semibold">
                      <Github className="w-5 h-5" />
                      View on GitHub
                    </button>
                    <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 transition-all">
                      <ExternalLink className="w-5 h-5" />
                      Live Demo
                    </button>
                    <button className="px-6 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 transition-all">
                      <Share className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'pitch' && selectedProject.pitchVideo && (
                <div className="space-y-4">
                  <div className="aspect-video bg-slate-800 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Play className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-400">Pitch video player (URL: {selectedProject.pitchVideo})</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-2">About the Pitch</h3>
                    <p className="text-gray-400">
                      Learn about the vision, problem statement, and solution approach for {selectedProject.title}.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'demo' && selectedProject.demoVideo && (
                <div className="space-y-4">
                  <div className="aspect-video bg-slate-800 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Code2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-400">Demo video player (URL: {selectedProject.demoVideo})</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-2">Technical Walkthrough</h3>
                    <p className="text-gray-400">
                      See {selectedProject.title} in action with a complete technical demonstration and code walkthrough.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
