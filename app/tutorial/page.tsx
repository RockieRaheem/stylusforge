'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Tutorial {
  id: number;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  completed: boolean;
  locked: boolean;
  icon: string;
  color: string;
}

export default function TutorialPage() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'basics' | 'advanced' | 'defi'>('all');
  const [selectedTutorial, setSelectedTutorial] = useState<number | null>(null);

  const tutorials: Tutorial[] = [
    {
      id: 1,
      title: 'Getting Started with Stylus',
      description: 'Learn the basics of Stylus SDK and create your first smart contract',
      difficulty: 'Beginner',
      duration: '15 min',
      completed: true,
      locked: false,
      icon: 'rocket_launch',
      color: '#58a6ff'
    },
    {
      id: 2,
      title: 'Storage & State Variables',
      description: 'Understand how to work with storage and manage contract state',
      difficulty: 'Beginner',
      duration: '20 min',
      completed: true,
      locked: false,
      icon: 'storage',
      color: '#3fb950'
    },
    {
      id: 3,
      title: 'Functions & Methods',
      description: 'Master contract functions, visibility, and method implementations',
      difficulty: 'Beginner',
      duration: '25 min',
      completed: false,
      locked: false,
      icon: 'code',
      color: '#a371f7'
    },
    {
      id: 4,
      title: 'Events & Logging',
      description: 'Learn to emit events and track contract activity on-chain',
      difficulty: 'Intermediate',
      duration: '20 min',
      completed: false,
      locked: false,
      icon: 'notifications',
      color: '#f85149'
    },
    {
      id: 5,
      title: 'Error Handling',
      description: 'Implement robust error handling and custom error types',
      difficulty: 'Intermediate',
      duration: '18 min',
      completed: false,
      locked: false,
      icon: 'error',
      color: '#f85149'
    },
    {
      id: 6,
      title: 'Testing Contracts',
      description: 'Write comprehensive tests for your smart contracts',
      difficulty: 'Intermediate',
      duration: '30 min',
      completed: false,
      locked: false,
      icon: 'science',
      color: '#58a6ff'
    },
    {
      id: 7,
      title: 'Gas Optimization',
      description: 'Optimize your contracts for minimal gas consumption',
      difficulty: 'Advanced',
      duration: '35 min',
      completed: false,
      locked: false,
      icon: 'speed',
      color: '#3fb950'
    },
    {
      id: 8,
      title: 'Advanced Patterns',
      description: 'Explore design patterns and best practices for complex contracts',
      difficulty: 'Advanced',
      duration: '40 min',
      completed: false,
      locked: true,
      icon: 'architecture',
      color: '#a371f7'
    },
    {
      id: 9,
      title: 'DeFi Token Creation',
      description: 'Build an ERC-20 compatible token with advanced features',
      difficulty: 'Advanced',
      duration: '45 min',
      completed: false,
      locked: true,
      icon: 'currency_exchange',
      color: '#f85149'
    },
    {
      id: 10,
      title: 'NFT Marketplace',
      description: 'Create a complete NFT marketplace smart contract',
      difficulty: 'Advanced',
      duration: '60 min',
      completed: false,
      locked: true,
      icon: 'storefront',
      color: '#58a6ff'
    },
  ];

  const completedCount = tutorials.filter(t => t.completed).length;
  const progressPercent = Math.round((completedCount / tutorials.length) * 100);

  const filteredTutorials = tutorials.filter(tutorial => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'basics') return tutorial.difficulty === 'Beginner';
    if (selectedCategory === 'advanced') return tutorial.difficulty === 'Advanced';
    if (selectedCategory === 'defi') return tutorial.title.includes('DeFi') || tutorial.title.includes('Token') || tutorial.title.includes('NFT');
    return true;
  });

  return (
    <div className="relative flex h-screen w-full flex-col bg-[#0d1117] text-white overflow-hidden">
      {/* Header */}
      <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-[#21262d] bg-[#0d1117] px-6 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="flex items-center justify-center p-2 text-[#8b949e] transition-all hover:text-white hover:bg-[#21262d] rounded-lg">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#a371f7]/20 to-[#58a6ff]/20 flex items-center justify-center border border-[#30363d]">
              <span className="material-symbols-outlined text-[#a371f7] text-lg">school</span>
            </div>
            <h1 className="text-lg font-semibold text-white">Stylus Tutorials</h1>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-[#8b949e] hover:text-white text-sm font-medium transition-colors">Home</Link>
          <Link href="/ide" className="text-[#8b949e] hover:text-white text-sm font-medium transition-colors">IDE</Link>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#58a6ff] to-[#a371f7] flex items-center justify-center text-white text-sm font-semibold">
            AX
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-8 space-y-8">
            
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-xl border border-[#30363d] bg-gradient-to-br from-[#161b22] to-[#0d1117] p-8">
              <div className="absolute top-0 right-0 w-96 h-96 bg-[#a371f7]/5 rounded-full blur-3xl"></div>
              <div className="relative z-10">
                <div className="flex items-start justify-between gap-6 mb-6">
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold text-white mb-3 bg-gradient-to-r from-white to-[#8b949e] bg-clip-text text-transparent">
                      Master Stylus Development
                    </h2>
                    <p className="text-[#8b949e] text-base mb-4 max-w-2xl">
                      Build high-performance smart contracts on Arbitrum using Rust and the Stylus SDK. 
                      Follow our comprehensive tutorials from basics to advanced patterns.
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#3fb950] text-lg">check_circle</span>
                        <span className="text-[#8b949e] text-sm">{completedCount} completed</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#58a6ff] text-lg">pending</span>
                        <span className="text-[#8b949e] text-sm">{tutorials.length - completedCount} remaining</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress Card */}
                  <div className="w-64 border border-[#30363d] rounded-lg p-5 bg-[#0d1117]">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[#8b949e] text-sm font-medium">Overall Progress</span>
                      <span className="text-white text-2xl font-bold">{progressPercent}%</span>
                    </div>
                    <div className="w-full h-3 bg-[#21262d] rounded-full overflow-hidden mb-3">
                      <div 
                        className="h-full bg-gradient-to-r from-[#a371f7] to-[#58a6ff] rounded-full transition-all duration-500" 
                        style={{width: `${progressPercent}%`}}
                      ></div>
                    </div>
                    <p className="text-[#8b949e] text-xs">{completedCount} of {tutorials.length} tutorials</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Category Filters */}
            <div className="flex items-center gap-3 border-b border-[#21262d] pb-4">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-[#58a6ff] text-white'
                    : 'bg-[#21262d] text-[#8b949e] hover:bg-[#30363d] hover:text-white'
                }`}
              >
                All Tutorials
              </button>
              <button
                onClick={() => setSelectedCategory('basics')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === 'basics'
                    ? 'bg-[#3fb950] text-white'
                    : 'bg-[#21262d] text-[#8b949e] hover:bg-[#30363d] hover:text-white'
                }`}
              >
                Basics
              </button>
              <button
                onClick={() => setSelectedCategory('advanced')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === 'advanced'
                    ? 'bg-[#a371f7] text-white'
                    : 'bg-[#21262d] text-[#8b949e] hover:bg-[#30363d] hover:text-white'
                }`}
              >
                Advanced
              </button>
              <button
                onClick={() => setSelectedCategory('defi')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === 'defi'
                    ? 'bg-[#f85149] text-white'
                    : 'bg-[#21262d] text-[#8b949e] hover:bg-[#30363d] hover:text-white'
                }`}
              >
                DeFi & NFT
              </button>
            </div>

            {/* Tutorials Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredTutorials.map((tutorial) => (
                <div
                  key={tutorial.id}
                  className={`group relative overflow-hidden border rounded-lg p-5 transition-all ${
                    tutorial.locked
                      ? 'border-[#30363d] bg-[#0d1117] opacity-60 cursor-not-allowed'
                      : 'border-[#30363d] hover:border-[#58a6ff] bg-gradient-to-br from-[#161b22] to-[#0d1117] hover:shadow-lg cursor-pointer'
                  }`}
                  style={{
                    boxShadow: !tutorial.locked ? `0 0 0 0 ${tutorial.color}20` : 'none',
                  }}
                  onClick={() => !tutorial.locked && setSelectedTutorial(tutorial.id)}
                >
                  {/* Background Effect */}
                  {!tutorial.locked && (
                    <div 
                      className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{backgroundColor: `${tutorial.color}10`}}
                    ></div>
                  )}
                  
                  <div className="relative z-10">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div 
                        className="w-12 h-12 rounded-lg flex items-center justify-center transition-all"
                        style={{
                          backgroundColor: tutorial.locked ? '#21262d' : `${tutorial.color}15`,
                        }}
                      >
                        {tutorial.locked ? (
                          <span className="material-symbols-outlined text-[#8b949e] text-2xl">lock</span>
                        ) : (
                          <span 
                            className="material-symbols-outlined text-2xl"
                            style={{color: tutorial.color}}
                          >
                            {tutorial.icon}
                          </span>
                        )}
                      </div>
                      
                      {tutorial.completed && (
                        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#3fb950]/20 border border-[#3fb950]/30">
                          <span className="material-symbols-outlined text-[#3fb950] text-sm">check</span>
                          <span className="text-[#3fb950] text-xs font-semibold">Done</span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <h3 className={`text-lg font-bold mb-2 ${tutorial.locked ? 'text-[#8b949e]' : 'text-white group-hover:text-[#58a6ff]'} transition-colors`}>
                      {tutorial.title}
                    </h3>
                    <p className="text-[#8b949e] text-sm mb-4 line-clamp-2">
                      {tutorial.description}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-[#21262d]">
                      <div className="flex items-center gap-3">
                        <span 
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                            tutorial.difficulty === 'Beginner' ? 'bg-[#3fb950]/10 text-[#3fb950]' :
                            tutorial.difficulty === 'Intermediate' ? 'bg-[#58a6ff]/10 text-[#58a6ff]' :
                            'bg-[#f85149]/10 text-[#f85149]'
                          }`}
                        >
                          {tutorial.difficulty}
                        </span>
                        <span className="flex items-center gap-1 text-[#8b949e] text-xs">
                          <span className="material-symbols-outlined text-sm">schedule</span>
                          {tutorial.duration}
                        </span>
                      </div>
                    </div>

                    {/* Locked Overlay Text */}
                    {tutorial.locked && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-[#0d1117]/90 backdrop-blur-sm rounded-lg px-4 py-2 border border-[#30363d]">
                          <span className="text-[#8b949e] text-sm font-medium">Complete previous tutorials</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Learning Path Section */}
            <div className="mt-8 border border-[#30363d] rounded-xl p-6 bg-gradient-to-br from-[#161b22] to-[#0d1117]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#58a6ff]/20 to-[#58a6ff]/5 flex items-center justify-center border border-[#58a6ff]/20">
                  <span className="material-symbols-outlined text-[#58a6ff] text-xl">route</span>
                </div>
                <div>
                  <h3 className="text-white text-lg font-bold">Recommended Learning Path</h3>
                  <p className="text-[#8b949e] text-sm">Follow this path for the best learning experience</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {tutorials.slice(0, 5).map((tutorial, index) => (
                  <div key={tutorial.id} className="relative">
                    <div className={`border rounded-lg p-4 transition-all ${
                      tutorial.completed 
                        ? 'border-[#3fb950] bg-[#3fb950]/5'
                        : 'border-[#30363d] bg-[#0d1117]'
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          tutorial.completed
                            ? 'bg-[#3fb950] text-white'
                            : 'bg-[#21262d] text-[#8b949e]'
                        }`}>
                          {tutorial.completed ? (
                            <span className="material-symbols-outlined text-sm">check</span>
                          ) : (
                            index + 1
                          )}
                        </div>
                        <span className={`text-xs font-semibold ${
                          tutorial.completed ? 'text-[#3fb950]' : 'text-[#8b949e]'
                        }`}>
                          Step {index + 1}
                        </span>
                      </div>
                      <p className="text-white text-sm font-medium line-clamp-2">{tutorial.title}</p>
                    </div>
                    {index < 4 && (
                      <div className="hidden lg:block absolute top-1/2 -right-2 transform -translate-y-1/2 translate-x-full">
                        <span className="material-symbols-outlined text-[#30363d]">arrow_forward</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Resources Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">
              <a href="https://docs.arbitrum.io/stylus" target="_blank" rel="noopener noreferrer" className="group border border-[#30363d] rounded-lg p-5 bg-gradient-to-br from-[#161b22] to-[#0d1117] hover:border-[#58a6ff] transition-all hover:shadow-lg hover:shadow-[#58a6ff]/10">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#58a6ff]/10 flex items-center justify-center group-hover:bg-[#58a6ff]/20 transition-all">
                    <span className="material-symbols-outlined text-[#58a6ff]">book</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-semibold mb-1 group-hover:text-[#58a6ff] transition-colors">Documentation</h4>
                    <p className="text-[#8b949e] text-sm">Official Stylus SDK documentation and guides</p>
                  </div>
                  <span className="material-symbols-outlined text-[#8b949e] group-hover:text-[#58a6ff] transition-colors">arrow_outward</span>
                </div>
              </a>

              <Link href="/ide" className="group border border-[#30363d] rounded-lg p-5 bg-gradient-to-br from-[#161b22] to-[#0d1117] hover:border-[#3fb950] transition-all hover:shadow-lg hover:shadow-[#3fb950]/10">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#3fb950]/10 flex items-center justify-center group-hover:bg-[#3fb950]/20 transition-all">
                    <span className="material-symbols-outlined text-[#3fb950]">code</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-semibold mb-1 group-hover:text-[#3fb950] transition-colors">Practice in IDE</h4>
                    <p className="text-[#8b949e] text-sm">Write and test your own contracts</p>
                  </div>
                  <span className="material-symbols-outlined text-[#8b949e] group-hover:text-[#3fb950] transition-colors">arrow_forward</span>
                </div>
              </Link>

              <a href="https://github.com/OffchainLabs/stylus-sdk-rs" target="_blank" rel="noopener noreferrer" className="group border border-[#30363d] rounded-lg p-5 bg-gradient-to-br from-[#161b22] to-[#0d1117] hover:border-[#a371f7] transition-all hover:shadow-lg hover:shadow-[#a371f7]/10">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#a371f7]/10 flex items-center justify-center group-hover:bg-[#a371f7]/20 transition-all">
                    <span className="material-symbols-outlined text-[#a371f7]">code_blocks</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-semibold mb-1 group-hover:text-[#a371f7] transition-colors">View Examples</h4>
                    <p className="text-[#8b949e] text-sm">Browse sample contracts on GitHub</p>
                  </div>
                  <span className="material-symbols-outlined text-[#8b949e] group-hover:text-[#a371f7] transition-colors">arrow_outward</span>
                </div>
              </a>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
