"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/lib/context/AuthContext";

export default function DashboardPage() {
  const { userData, loading } = useAuth();
  const [selectedTab, setSelectedTab] = useState<'overview' | 'projects' | 'activity'>('overview');
  const [imageError, setImageError] = useState(false);
  
  // Get user's display name, fallback to first part of email
  const displayName = userData?.displayName || userData?.email?.split('@')[0] || '';
  const firstName = displayName.split(' ')[0] || displayName;
  
  // Get user initials for avatar
  const initials = displayName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
  
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-[#0d1117] text-white">
      <header className="flex items-center justify-between whitespace-nowrap border-b border-[#21262d] px-6 sm:px-10 py-3 sticky top-0 bg-[#010409] z-50">
        <div className="flex items-center gap-4">
          <Link href="/">
            <div className="size-8 text-[#58a6ff] cursor-pointer hover:opacity-80 transition-opacity">
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_6_543)">
                  <path d="M42.1739 20.1739L27.8261 5.82609C29.1366 7.13663 28.3989 10.1876 26.2002 13.7654C24.8538 15.9564 22.9595 18.3449 20.6522 20.6522C18.3449 22.9595 15.9564 24.8538 13.7654 26.2002C10.1876 28.3989 7.13663 29.1366 5.82609 27.8261L20.1739 42.1739C21.4845 43.4845 24.5355 42.7467 28.1133 40.548C30.3042 39.2016 32.6927 37.3073 35 35C37.3073 32.6927 39.2016 30.3042 40.548 28.1133C42.7467 24.5355 43.4845 21.4845 42.1739 20.1739Z" fill="currentColor"/>
                  <path clipRule="evenodd" d="M7.24189 26.4066C7.31369 26.4411 7.64204 26.5637 8.52504 26.3738C9.59462 26.1438 11.0343 25.5311 12.7183 24.4963C14.7583 23.2426 17.0256 21.4503 19.238 19.238C21.4503 17.0256 23.2426 14.7583 24.4963 12.7183C25.5311 11.0343 26.1438 9.59463 26.3738 8.52504C26.5637 7.64204 26.4411 7.31369 26.4066 7.24189C26.345 7.21246 26.143 7.14535 25.6664 7.1918C24.9745 7.25925 23.9954 7.5498 22.7699 8.14278C20.3369 9.32007 17.3369 11.4915 14.4142 14.4142C11.4915 17.3369 9.32007 20.3369 8.14278 22.7699C7.5498 23.9954 7.25925 24.9745 7.1918 25.6664C7.14534 26.143 7.21246 26.345 7.24189 26.4066ZM29.9001 10.7285C29.4519 12.0322 28.7617 13.4172 27.9042 14.8126C26.465 17.1544 24.4686 19.6641 22.0664 22.0664C19.6641 24.4686 17.1544 26.465 14.8126 27.9042C13.4172 28.7617 12.0322 29.4519 10.7285 29.9001L21.5754 40.747C21.6001 40.7606 21.8995 40.931 22.8729 40.7217C23.9424 40.4916 25.3821 39.879 27.0661 38.8441C29.1062 37.5904 31.3734 35.7982 33.5858 33.5858C35.7982 31.3734 37.5904 29.1062 38.8441 27.0661C39.879 25.3821 40.4916 23.9425 40.7216 22.8729C40.931 21.8995 40.7606 21.6001 40.747 21.5754L29.9001 10.7285ZM29.2403 4.41187L43.5881 18.7597C44.9757 20.1473 44.9743 22.1235 44.6322 23.7139C44.2714 25.3919 43.4158 27.2666 42.252 29.1604C40.8128 31.5022 38.8165 34.012 36.4142 36.4142C34.012 38.8165 31.5022 40.8128 29.1604 42.252C27.2666 43.4158 25.3919 44.2714 23.7139 44.6322C22.1235 44.9743 20.1473 44.9757 18.7597 43.5881L4.41187 29.2403C3.29027 28.1187 3.08209 26.5973 3.21067 25.2783C3.34099 23.9415 3.8369 22.4852 4.54214 21.0277C5.96129 18.0948 8.43335 14.7382 11.5858 11.5858C14.7382 8.43335 18.0948 5.9613 21.0277 4.54214C22.4852 3.8369 23.9415 3.34099 25.2783 3.21067C26.5973 3.08209 28.1187 3.29028 29.2403 4.41187Z" fill="currentColor" fillRule="evenodd"/>
                </g>
                <defs>
                  <clipPath id="clip0_6_543">
                    <rect fill="white" height="48" width="48"/>
                  </clipPath>
                </defs>
              </svg>
            </div>
          </Link>
          <h2 className="text-white text-lg font-semibold">StylusForge</h2>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-[#8b949e] hover:text-[#58a6ff] text-sm font-medium transition-colors">Home</Link>
          <Link href="/tutorial" className="text-[#8b949e] hover:text-[#58a6ff] text-sm font-medium transition-colors">Learn</Link>
          <Link href="/ide" className="text-[#8b949e] hover:text-[#58a6ff] text-sm font-medium transition-colors">IDE</Link>
          <Link href="/marketplace" className="text-[#8b949e] hover:text-[#58a6ff] text-sm font-medium transition-colors">Marketplace</Link>
          <a className="text-[#8b949e] hover:text-[#58a6ff] text-sm font-medium transition-colors" href="#">Docs</a>
        </div>
          <div className="flex items-center gap-3">
          <button className="relative flex h-9 w-9 items-center justify-center rounded-md border border-[#30363d] hover:border-[#8b949e] hover:bg-[#161b22] transition-all">
            <span className="material-symbols-outlined text-lg text-[#8b949e]">notifications</span>
            <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-[#3fb950] rounded-full"></span>
          </button>
          {userData?.photoURL && !imageError ? (
            <img
              src={userData.photoURL}
              alt={displayName}
              className="w-8 h-8 rounded-full cursor-pointer hover:opacity-80 transition-opacity border border-[#30363d]"
              onError={() => setImageError(true)}
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7d8590] to-[#484f58] flex items-center justify-center text-xs font-semibold cursor-pointer hover:opacity-80 transition-opacity">
              {initials}
            </div>
          )}
        </div>
      </header>

      <main className="flex flex-1 justify-center py-8 pt-20">
        <div className="flex w-full max-w-7xl flex-col gap-6 px-6 sm:px-10">
          
          {/* Enhanced Welcome Section */}
          <div className="relative overflow-hidden rounded-xl border border-[#30363d] bg-gradient-to-br from-[#161b22] to-[#0d1117] p-8">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#1f6feb]/5 rounded-full blur-3xl"></div>
            <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-[#3fb950] animate-pulse"></div>
                  <span className="text-[#8b949e] text-sm font-medium">Active</span>
                </div>
                <h1 className="text-white text-4xl font-bold mb-2 bg-gradient-to-r from-white to-[#8b949e] bg-clip-text text-transparent">Welcome back, {firstName}!</h1>
                <p className="text-[#8b949e] text-base">Ready to build something amazing today?</p>
              </div>
              <div className="flex items-center gap-3">
                <Link href="/marketplace" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[#30363d] hover:border-[#a371f7] text-[#8b949e] hover:text-white text-sm font-medium transition-all">
                  <span className="material-symbols-outlined text-lg">storefront</span>
                  Marketplace
                </Link>
                <Link href="/tutorial" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[#30363d] hover:border-[#58a6ff] text-[#8b949e] hover:text-white text-sm font-medium transition-all">
                  <span className="material-symbols-outlined text-lg">school</span>
                  Tutorials
                </Link>
                <Link href="/ide" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#238636] hover:bg-[#2ea043] text-white text-sm font-medium transition-all shadow-lg shadow-[#238636]/20 hover:shadow-[#238636]/40">
                  <span className="material-symbols-outlined text-lg">code</span>
                  New Project
                </Link>
              </div>
            </div>
          </div>

          {/* Enhanced Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="group relative overflow-hidden border border-[#30363d] rounded-lg p-5 hover:border-[#58a6ff] transition-all bg-gradient-to-br from-[#161b22] to-[#0d1117] hover:shadow-lg hover:shadow-[#58a6ff]/10">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#58a6ff]/5 rounded-full blur-2xl group-hover:bg-[#58a6ff]/10 transition-all"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[#8b949e] text-sm font-medium">Contracts</span>
                  <div className="w-10 h-10 rounded-lg bg-[#1f6feb]/10 flex items-center justify-center group-hover:bg-[#1f6feb]/20 transition-all">
                    <span className="material-symbols-outlined text-xl text-[#58a6ff]">rocket_launch</span>
                  </div>
                </div>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-white text-3xl font-bold">12</span>
                  <span className="text-[#3fb950] text-xs font-semibold px-2 py-0.5 rounded-full bg-[#3fb950]/10">+2</span>
                </div>
                <p className="text-[#8b949e] text-xs">this week</p>
              </div>
            </div>

            <div className="group relative overflow-hidden border border-[#30363d] rounded-lg p-5 hover:border-[#a371f7] transition-all bg-gradient-to-br from-[#161b22] to-[#0d1117] hover:shadow-lg hover:shadow-[#a371f7]/10">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#a371f7]/5 rounded-full blur-2xl group-hover:bg-[#a371f7]/10 transition-all"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[#8b949e] text-sm font-medium">Tutorials</span>
                  <div className="w-10 h-10 rounded-lg bg-[#a371f7]/10 flex items-center justify-center group-hover:bg-[#a371f7]/20 transition-all">
                    <span className="material-symbols-outlined text-xl text-[#a371f7]">school</span>
                  </div>
                </div>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-white text-3xl font-bold">8</span>
                  <span className="text-[#8b949e] text-sm font-medium">/10</span>
                </div>
                <p className="text-[#8b949e] text-xs">80% complete</p>
              </div>
            </div>

            <div className="group relative overflow-hidden border border-[#30363d] rounded-lg p-5 hover:border-[#3fb950] transition-all bg-gradient-to-br from-[#161b22] to-[#0d1117] hover:shadow-lg hover:shadow-[#3fb950]/10">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#3fb950]/5 rounded-full blur-2xl group-hover:bg-[#3fb950]/10 transition-all"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[#8b949e] text-sm font-medium">Gas Saved</span>
                  <div className="w-10 h-10 rounded-lg bg-[#3fb950]/10 flex items-center justify-center group-hover:bg-[#3fb950]/20 transition-all">
                    <span className="material-symbols-outlined text-xl text-[#3fb950]">savings</span>
                  </div>
                </div>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-white text-3xl font-bold">0.42</span>
                  <span className="text-[#8b949e] text-sm font-medium">ETH</span>
                </div>
                <p className="text-[#8b949e] text-xs">99% optimized</p>
              </div>
            </div>

            <div className="group relative overflow-hidden border border-[#30363d] rounded-lg p-5 hover:border-[#f85149] transition-all bg-gradient-to-br from-[#161b22] to-[#0d1117] hover:shadow-lg hover:shadow-[#f85149]/10">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#f85149]/5 rounded-full blur-2xl group-hover:bg-[#f85149]/10 transition-all"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[#8b949e] text-sm font-medium">Streak</span>
                  <div className="w-10 h-10 rounded-lg bg-[#f85149]/10 flex items-center justify-center group-hover:bg-[#f85149]/20 transition-all">
                    <span className="material-symbols-outlined text-xl text-[#f85149]">local_fire_department</span>
                  </div>
                </div>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-white text-3xl font-bold">5</span>
                  <span className="text-[#8b949e] text-sm font-medium">days</span>
                </div>
                <p className="text-[#8b949e] text-xs">Keep it up!</p>
              </div>
            </div>
          </div>

          {/* Tab Navigation - Simple */}
          <div className="border-b border-[#21262d] mt-4">
            <nav className="flex gap-6">
              <button
                onClick={() => setSelectedTab('overview')}
                className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                  selectedTab === 'overview'
                    ? 'border-[#f78166] text-white'
                    : 'border-transparent text-[#8b949e] hover:text-white hover:border-[#6e7681]'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setSelectedTab('projects')}
                className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                  selectedTab === 'projects'
                    ? 'border-[#f78166] text-white'
                    : 'border-transparent text-[#8b949e] hover:text-white hover:border-[#6e7681]'
                }`}
              >
                Projects
              </button>
              <button
                onClick={() => setSelectedTab('activity')}
                className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                  selectedTab === 'activity'
                    ? 'border-[#f78166] text-white'
                    : 'border-transparent text-[#8b949e] hover:text-white hover:border-[#6e7681]'
                }`}
              >
                Activity
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          {selectedTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Recent Projects - Simple Grid */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-white text-xl font-semibold">Recent Projects</h2>
                  <Link href="/ide" className="text-[#58a6ff] hover:underline text-sm">View all</Link>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { name: 'Arbitrum NFT', desc: 'NFT minting contract on Arbitrum', time: '2 hours ago', language: 'Rust', icon: 'token', color: '#58a6ff' },
                    { name: 'DeFi Token', desc: 'ERC-20 compatible token', time: '1 day ago', language: 'Stylus', icon: 'currency_exchange', color: '#3fb950' },
                    { name: 'DAO Governance', desc: 'Smart contract for DAO voting', time: '3 days ago', language: 'Rust', icon: 'how_to_vote', color: '#a371f7' },
                  ].map((project, i) => (
                    <div key={i} className="group relative overflow-hidden border border-[#30363d] rounded-lg p-5 hover:border-[#58a6ff] transition-all bg-gradient-to-br from-[#161b22] to-[#0d1117] hover:shadow-lg hover:shadow-[#58a6ff]/10">
                      <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" style={{backgroundColor: `${project.color}10`}}></div>
                      <div className="relative z-10">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{backgroundColor: `${project.color}15`}}>
                              <span className="material-symbols-outlined text-lg" style={{color: project.color}}>{project.icon}</span>
                            </div>
                            <h3 className="text-white font-semibold group-hover:text-[#58a6ff] transition-colors">{project.name}</h3>
                          </div>
                          <span className="text-[#8b949e] text-xs px-2.5 py-1 rounded-full bg-[#21262d] border border-[#30363d]">{project.language}</span>
                        </div>
                        <p className="text-[#8b949e] text-sm mb-4 ml-13">{project.desc}</p>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-[#8b949e]">Updated {project.time}</span>
                          <Link href="/ide" className="text-[#58a6ff] hover:text-white font-medium transition-colors">Open →</Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Learning Progress - Simple */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-white text-xl font-semibold">Learning Progress</h2>
                  <Link href="/tutorial" className="text-[#58a6ff] hover:underline text-sm">Continue learning</Link>
                </div>
                
                <div className="relative overflow-hidden border border-[#30363d] rounded-lg p-6 bg-gradient-to-br from-[#161b22] to-[#0d1117] hover:border-[#a371f7] transition-all">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-[#a371f7]/5 rounded-full blur-3xl"></div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-5">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#a371f7]/20 to-[#a371f7]/5 flex items-center justify-center border border-[#a371f7]/20">
                        <span className="material-symbols-outlined text-3xl text-[#a371f7]">school</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white text-lg font-bold mb-1">Stylus Development Path</h3>
                        <p className="text-[#8b949e] text-sm">8 of 10 tutorials completed</p>
                      </div>
                      <div className="text-center">
                        <span className="text-white text-2xl font-bold block">80%</span>
                        <span className="text-[#8b949e] text-xs">Progress</span>
                      </div>
                    </div>
                    <div className="w-full h-3 bg-[#21262d] rounded-full overflow-hidden mb-3">
                      <div className="h-full bg-gradient-to-r from-[#a371f7] to-[#58a6ff] rounded-full transition-all" style={{width: '80%'}}></div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#8b949e]">2 tutorials remaining</span>
                      <Link href="/tutorial" className="text-[#58a6ff] hover:text-white font-medium transition-colors">Continue →</Link>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {selectedTab === 'projects' && (
            <div className="space-y-6">
              
              <div className="flex items-center justify-between">
                <h2 className="text-white text-xl font-semibold">All Projects</h2>
                <Link href="/ide" className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#238636] hover:bg-[#2ea043] text-white text-sm font-medium transition-colors">
                  <span className="material-symbols-outlined text-base">add</span>
                  New Project
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {[
                  { name: 'Arbitrum NFT Collection', desc: 'NFT minting and marketplace contract', updated: '2 hours ago', language: 'Rust', stars: 5 },
                  { name: 'DeFi Token Protocol', desc: 'ERC-20 token with advanced features', updated: '1 day ago', language: 'Stylus', stars: 12 },
                  { name: 'DAO Governance System', desc: 'Decentralized voting and proposals', updated: '3 days ago', language: 'Rust', stars: 8 },
                  { name: 'Cross-chain Bridge', desc: 'Asset bridge between chains', updated: '5 days ago', language: 'Stylus', stars: 15 },
                  { name: 'Lending Protocol', desc: 'Decentralized lending platform', updated: '1 week ago', language: 'Rust', stars: 20 },
                ].map((project, i) => (
                  <div key={i} className="border border-[#30363d] rounded-lg p-4 hover:border-[#8b949e] transition-colors bg-[#0d1117]">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="material-symbols-outlined text-[#8b949e]">code</span>
                          <h3 className="text-[#58a6ff] font-semibold hover:underline cursor-pointer">{project.name}</h3>
                          <span className="text-[#8b949e] text-xs px-2 py-0.5 rounded-full border border-[#30363d]">{project.language}</span>
                        </div>
                        <p className="text-[#8b949e] text-sm mb-2 ml-9">{project.desc}</p>
                        <div className="flex items-center gap-4 text-xs text-[#8b949e] ml-9">
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">star</span>
                            {project.stars}
                          </span>
                          <span>Updated {project.updated}</span>
                        </div>
                      </div>
                      <Link href="/ide" className="text-[#58a6ff] hover:underline text-sm whitespace-nowrap ml-4">Open →</Link>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {selectedTab === 'activity' && (
            <div className="space-y-6">
              
              <h2 className="text-white text-xl font-semibold">Recent Activity</h2>

              <div className="border border-[#30363d] rounded-lg divide-y divide-[#21262d] bg-[#0d1117]">
                {[
                  { action: 'Deployed contract', project: 'Arbitrum NFT', time: '2 hours ago', icon: 'rocket_launch', color: '#58a6ff' },
                  { action: 'Completed tutorial', project: 'Advanced Rust Patterns', time: '5 hours ago', icon: 'school', color: '#a371f7' },
                  { action: 'Created project', project: 'DeFi Token', time: '1 day ago', icon: 'add_circle', color: '#3fb950' },
                  { action: 'Earned badge', project: 'Rust Expert', time: '2 days ago', icon: 'military_tech', color: '#f85149' },
                  { action: 'Gas optimization', project: 'DAO Governance', time: '3 days ago', icon: 'speed', color: '#f85149' },
                  { action: 'Updated contract', project: 'Cross-chain Bridge', time: '4 days ago', icon: 'edit', color: '#8b949e' },
                ].map((activity, i) => (
                  <div key={i} className="p-4 hover:bg-[#161b22] transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{backgroundColor: `${activity.color}20`}}>
                        <span className="material-symbols-outlined text-base" style={{color: activity.color}}>{activity.icon}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-white text-sm">
                          <span className="font-medium">{activity.action}</span>
                          {' '}
                          <span className="text-[#58a6ff]">{activity.project}</span>
                        </p>
                        <p className="text-[#8b949e] text-xs mt-1">{activity.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}
        </div>
      </main>
    </div>
  );
}
