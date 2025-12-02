'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Project {
  id: number;
  title: string;
  author: string;
  authorAvatar: string;
  description: string;
  category: 'DeFi' | 'NFT' | 'Gaming' | 'DAO' | 'Infrastructure' | 'Social';
  tags: string[];
  fundingGoal: number;
  fundingRaised: number;
  backers: number;
  image: string;
  status: 'Active' | 'Funded' | 'Building';
  daysLeft?: number;
  githubUrl?: string;
  demoUrl?: string;
  contractAddress?: string;
}

export default function MarketplacePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [fundAmount, setFundAmount] = useState<string>('');
  const [showFundModal, setShowFundModal] = useState<boolean>(false);

  const projects: Project[] = [
    {
      id: 1,
      title: 'DexSwap Protocol',
      author: 'Sarah Chen',
      authorAvatar: 'SC',
      description: 'A next-generation DEX built with Stylus for ultra-low gas costs. Features automated market making, concentrated liquidity, and cross-chain swaps.',
      category: 'DeFi',
      tags: ['DEX', 'AMM', 'Liquidity'],
      fundingGoal: 50000,
      fundingRaised: 34500,
      backers: 127,
      image: 'defi',
      status: 'Active',
      daysLeft: 15,
      githubUrl: '#',
      demoUrl: '#',
      contractAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'
    },
    {
      id: 2,
      title: 'ArtChain NFT Marketplace',
      author: 'Marcus Rodriguez',
      authorAvatar: 'MR',
      description: 'Decentralized NFT marketplace with artist royalties, fractional ownership, and gasless minting powered by Stylus efficiency.',
      category: 'NFT',
      tags: ['NFT', 'Marketplace', 'Creator Economy'],
      fundingGoal: 30000,
      fundingRaised: 30000,
      backers: 89,
      image: 'nft',
      status: 'Funded',
      githubUrl: '#',
      demoUrl: '#',
      contractAddress: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063'
    },
    {
      id: 3,
      title: 'GameVerse On-Chain',
      author: 'Alex Kim',
      authorAvatar: 'AK',
      description: 'Fully on-chain gaming engine with real-time multiplayer, item ownership, and tournament rewards. Built for speed with Stylus.',
      category: 'Gaming',
      tags: ['Gaming', 'Web3', 'Metaverse'],
      fundingGoal: 75000,
      fundingRaised: 42300,
      backers: 203,
      image: 'gaming',
      status: 'Active',
      daysLeft: 22,
      githubUrl: '#',
      demoUrl: '#'
    },
    {
      id: 4,
      title: 'GovHub DAO Platform',
      author: 'Emma Thompson',
      authorAvatar: 'ET',
      description: 'Complete DAO governance platform with proposal systems, voting mechanisms, treasury management, and delegation features.',
      category: 'DAO',
      tags: ['Governance', 'DAO', 'Voting'],
      fundingGoal: 40000,
      fundingRaised: 28900,
      backers: 156,
      image: 'dao',
      status: 'Active',
      daysLeft: 10,
      githubUrl: '#',
      contractAddress: '0x1a3B2C4d5E6f7A8B9C0D1E2F3A4B5C6D7E8F9A0B'
    },
    {
      id: 5,
      title: 'ZK-Bridge Infrastructure',
      author: 'David Park',
      authorAvatar: 'DP',
      description: 'Zero-knowledge proof bridge for private cross-chain transactions with maximum security and minimal gas costs.',
      category: 'Infrastructure',
      tags: ['ZK-Proofs', 'Bridge', 'Privacy'],
      fundingGoal: 100000,
      fundingRaised: 67800,
      backers: 234,
      image: 'infra',
      status: 'Active',
      daysLeft: 18,
      githubUrl: '#',
      demoUrl: '#'
    },
    {
      id: 6,
      title: 'SocialFi Network',
      author: 'Priya Sharma',
      authorAvatar: 'PS',
      description: 'Decentralized social network with content monetization, creator tokens, and community-driven moderation.',
      category: 'Social',
      tags: ['SocialFi', 'Content', 'Creator Economy'],
      fundingGoal: 45000,
      fundingRaised: 19200,
      backers: 78,
      image: 'social',
      status: 'Building',
      daysLeft: 25,
      githubUrl: '#'
    }
  ];

  const categories = ['all', 'DeFi', 'NFT', 'Gaming', 'DAO', 'Infrastructure', 'Social'];

  const filteredProjects = projects.filter(project => 
    selectedCategory === 'all' || project.category === selectedCategory
  );

  const getProjectImage = (type: string) => {
    const gradients = {
      defi: 'from-blue-500 via-cyan-500 to-teal-500',
      nft: 'from-purple-500 via-pink-500 to-rose-500',
      gaming: 'from-orange-500 via-red-500 to-pink-500',
      dao: 'from-green-500 via-emerald-500 to-teal-500',
      infra: 'from-indigo-500 via-purple-500 to-blue-500',
      social: 'from-yellow-500 via-orange-500 to-red-500'
    };
    return gradients[type as keyof typeof gradients] || gradients.defi;
  };

  const handleFund = (projectId: number) => {
    setSelectedProject(projectId);
    setShowFundModal(true);
  };

  const connectWallet = async () => {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      try {
        await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
        // Add funding logic here
        alert('Wallet connected! Funding feature coming soon.');
        setShowFundModal(false);
      } catch (error) {
        console.error('Error connecting wallet:', error);
      }
    } else {
      alert('Please install MetaMask to fund projects!');
    }
  };

  const selectedProjectData = selectedProject ? projects.find(p => p.id === selectedProject) : null;

  return (
    <div className="relative w-full min-h-screen bg-[#0d1117] text-white">
      {/* Background Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-20"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl opacity-20"></div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[#21262d] bg-[#0d1117]/95 backdrop-blur-md">
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
              <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-primary to-secondary hover:shadow-glow-cta transition-all">
                <span className="material-symbols-outlined !text-xl">add</span>
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
            <span className="material-symbols-outlined text-primary !text-xl">rocket_launch</span>
            <span className="text-primary text-sm font-semibold">Community Marketplace</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400">
            Fund the Future of Web3
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Discover innovative projects built with Stylus. Support developers, collaborate on ideas, and be part of the next generation of blockchain applications.
          </p>
        </section>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-primary/30 transition-all">
            <div className="text-3xl font-bold text-primary mb-1">24</div>
            <div className="text-sm text-gray-400">Active Projects</div>
          </div>
          <div className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-green-500/30 transition-all">
            <div className="text-3xl font-bold text-green-400 mb-1">$487K</div>
            <div className="text-sm text-gray-400">Total Funded</div>
          </div>
          <div className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-secondary/30 transition-all">
            <div className="text-3xl font-bold text-secondary mb-1">1,247</div>
            <div className="text-sm text-gray-400">Community Backers</div>
          </div>
          <div className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-yellow-500/30 transition-all">
            <div className="text-3xl font-bold text-yellow-400 mb-1">18</div>
            <div className="text-sm text-gray-400">Successfully Launched</div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-2 scrollbar-thin">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-5 py-2.5 rounded-lg font-medium transition-all whitespace-nowrap ${
                selectedCategory === category
                  ? 'bg-primary text-white shadow-lg'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              {category === 'all' ? 'All Projects' : category}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(project => {
            const fundingPercent = Math.round((project.fundingRaised / project.fundingGoal) * 100);
            
            return (
              <div
                key={project.id}
                className="group relative bg-white/5 rounded-2xl border border-white/10 overflow-hidden hover:border-primary/30 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
              >
                {/* Project Image */}
                <div className={`h-48 bg-gradient-to-br ${getProjectImage(project.image)} relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-sm group-hover:bg-black/20 transition-all"></div>
                  <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20">
                    <span className="text-xs font-bold text-white">{project.category}</span>
                  </div>
                  {project.status === 'Funded' && (
                    <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-green-500/90 backdrop-blur-md">
                      <span className="text-xs font-bold text-white flex items-center gap-1">
                        <span className="material-symbols-outlined !text-sm">check_circle</span>
                        Funded
                      </span>
                    </div>
                  )}
                </div>

                {/* Project Info */}
                <div className="p-6">
                  {/* Author */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-sm font-bold">
                      {project.authorAvatar}
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{project.author}</div>
                      <div className="text-xs text-gray-500">Project Creator</div>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-1 rounded text-xs bg-white/5 text-gray-400 border border-white/10"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Funding Progress */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-400">Funding Progress</span>
                      <span className="text-sm font-bold text-primary">{fundingPercent}%</span>
                    </div>
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500"
                        style={{ width: `${fundingPercent}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-lg font-bold">${project.fundingRaised.toLocaleString()}</span>
                      <span className="text-sm text-gray-500">of ${project.fundingGoal.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <span className="material-symbols-outlined !text-lg">group</span>
                      <span>{project.backers} backers</span>
                    </div>
                    {project.daysLeft && (
                      <div className="flex items-center gap-1 text-sm text-gray-400">
                        <span className="material-symbols-outlined !text-lg">schedule</span>
                        <span>{project.daysLeft} days left</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleFund(project.id)}
                      disabled={project.status === 'Funded'}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-semibold transition-all ${
                        project.status === 'Funded'
                          ? 'bg-white/5 text-gray-500 cursor-not-allowed'
                          : 'bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:scale-105'
                      }`}
                    >
                      <span className="material-symbols-outlined !text-xl">
                        {project.status === 'Funded' ? 'check' : 'payments'}
                      </span>
                      <span>{project.status === 'Funded' ? 'Funded' : 'Fund Now'}</span>
                    </button>
                    <button className="px-4 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all">
                      <span className="material-symbols-outlined">share</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <section className="mt-20 text-center p-12 rounded-2xl bg-gradient-to-br from-primary/10 via-secondary/5 to-primary/10 border border-primary/20">
          <span className="material-symbols-outlined !text-5xl text-primary mb-4">lightbulb</span>
          <h2 className="text-3xl font-bold mb-4">Have a Project Idea?</h2>
          <p className="text-lg text-gray-400 mb-6 max-w-2xl mx-auto">
            Share your Stylus project with the community. Get funding, find collaborators, and bring your vision to life.
          </p>
          <Link href="/marketplace/submit">
            <button className="px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-secondary hover:shadow-glow-cta hover:scale-105 transition-all font-bold text-lg">
              Submit Your Project
            </button>
          </Link>
        </section>
      </main>

      {/* Fund Modal */}
      {showFundModal && selectedProjectData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in">
          <div className="bg-[#161b22] rounded-2xl border border-[#30363d] max-w-md w-full p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">Fund Project</h3>
              <button
                onClick={() => setShowFundModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-2">{selectedProjectData.title}</h4>
              <p className="text-sm text-gray-400">by {selectedProjectData.author}</p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Funding Amount (ETH)</label>
              <input
                type="number"
                value={fundAmount}
                onChange={(e) => setFundAmount(e.target.value)}
                placeholder="0.1"
                step="0.01"
                min="0"
                className="w-full px-4 py-3 rounded-lg bg-[#0d1117] border border-[#30363d] text-white focus:border-primary focus:outline-none"
              />
              <p className="text-xs text-gray-500 mt-2">Minimum: 0.01 ETH</p>
            </div>

            {selectedProjectData.contractAddress && (
              <div className="mb-6 p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="text-xs text-gray-500 mb-1">Contract Address</div>
                <div className="text-sm font-mono break-all">{selectedProjectData.contractAddress}</div>
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={connectWallet}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-primary to-secondary hover:shadow-glow-cta transition-all font-semibold"
              >
                <span className="material-symbols-outlined">account_balance_wallet</span>
                <span>Connect Wallet & Fund</span>
              </button>
              <button
                onClick={() => setShowFundModal(false)}
                className="w-full px-6 py-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
