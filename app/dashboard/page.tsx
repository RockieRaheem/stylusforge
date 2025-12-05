"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/lib/context/AuthContext";
import { useRouter } from "next/navigation";
import { useDashboardData } from "@/lib/hooks/useDashboardData";
import WalletBalance from "@/components/WalletBalance";
import FirebasePermissionWarning from "./components/FirebasePermissionWarning";

export default function DashboardPage() {
  const { userData, loading: authLoading, signOut } = useAuth();
  const { stats, recentProjects, tutorialProgress, loading: dataLoading, refetch } = useDashboardData();
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<'overview' | 'projects' | 'activity'>('overview');
  const [imageError, setImageError] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
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
  
  // Format time ago
  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  };
  
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
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
          {/* Wallet Balance */}
          <WalletBalance showFull />
          
          <button className="relative flex h-9 w-9 items-center justify-center rounded-md border border-[#30363d] hover:border-[#8b949e] hover:bg-[#161b22] transition-all">
            <span className="material-symbols-outlined text-lg text-[#8b949e]">notifications</span>
            <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-[#3fb950] rounded-full"></span>
          </button>
          
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors group"
            >
              {userData?.photoURL && !imageError ? (
                <img
                  alt={displayName}
                  className="w-8 h-8 rounded-full border-2 border-purple-500/50 group-hover:border-purple-500 transition-colors"
                  src={userData.photoURL}
                  onError={() => setImageError(true)}
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#a371f7] to-[#7d8590] border-2 border-purple-500/50 group-hover:border-purple-500 flex items-center justify-center text-xs font-semibold transition-colors">
                  {initials}
                </div>
              )}
              <span className="text-sm font-medium text-gray-200 hidden md:block">{displayName}</span>
              <svg 
                className={`w-4 h-4 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-[#161b22] border border-[#30363d] rounded-lg shadow-xl z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-[#30363d]">
                  <p className="text-sm font-medium text-white">{displayName}</p>
                  <p className="text-xs text-[#8b949e] mt-0.5">{userData?.email}</p>
                </div>
                
                <div className="py-1">
                  <Link href="/dashboard" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-white/5 transition-colors">
                    <span className="material-symbols-outlined text-lg">dashboard</span>
                    Dashboard
                  </Link>
                  <Link href="/ide" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-white/5 transition-colors">
                    <span className="material-symbols-outlined text-lg">code</span>
                    IDE
                  </Link>
                  <Link href="/tutorial" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-white/5 transition-colors">
                    <span className="material-symbols-outlined text-lg">school</span>
                    Tutorials
                  </Link>
                  <Link href="/marketplace" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-white/5 transition-colors">
                    <span className="material-symbols-outlined text-lg">storefront</span>
                    Marketplace
                  </Link>
                  <button className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-white/5 transition-colors w-full">
                    <span className="material-symbols-outlined text-lg">settings</span>
                    Settings
                  </button>
                </div>
                
                <div className="border-t border-[#30363d] py-1">
                  <button 
                    onClick={handleSignOut}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors w-full"
                  >
                    <span className="material-symbols-outlined text-lg">logout</span>
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex flex-1 justify-center py-8 pt-20">
        <div className="flex w-full max-w-7xl flex-col gap-6 px-6 sm:px-10">
          
          {/* Firebase Permission Warning */}
          <FirebasePermissionWarning />
          
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
                  <span className="text-[#8b949e] text-sm font-medium">Projects</span>
                  <div className="w-10 h-10 rounded-lg bg-[#1f6feb]/10 flex items-center justify-center group-hover:bg-[#1f6feb]/20 transition-all">
                    <span className="material-symbols-outlined text-xl text-[#58a6ff]">code</span>
                  </div>
                </div>
                <div className="flex items-baseline gap-2 mb-1">
                  {dataLoading ? (
                    <div className="h-9 w-12 bg-[#21262d] animate-pulse rounded"></div>
                  ) : (
                    <span className="text-white text-3xl font-bold">{stats.totalProjectsCreated}</span>
                  )}
                </div>
                <p className="text-[#8b949e] text-xs">total created</p>
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
                  {dataLoading ? (
                    <div className="h-9 w-16 bg-[#21262d] animate-pulse rounded"></div>
                  ) : (
                    <>
                      <span className="text-white text-3xl font-bold">{tutorialProgress.completed}</span>
                      <span className="text-[#8b949e] text-sm font-medium">/{tutorialProgress.total}</span>
                    </>
                  )}
                </div>
                <p className="text-[#8b949e] text-xs">{tutorialProgress.percentage}% complete</p>
              </div>
            </div>

            <div className="group relative overflow-hidden border border-[#30363d] rounded-lg p-5 hover:border-[#3fb950] transition-all bg-gradient-to-br from-[#161b22] to-[#0d1117] hover:shadow-lg hover:shadow-[#3fb950]/10">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#3fb950]/5 rounded-full blur-2xl group-hover:bg-[#3fb950]/10 transition-all"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[#8b949e] text-sm font-medium">Deployments</span>
                  <div className="w-10 h-10 rounded-lg bg-[#3fb950]/10 flex items-center justify-center group-hover:bg-[#3fb950]/20 transition-all">
                    <span className="material-symbols-outlined text-xl text-[#3fb950]">rocket_launch</span>
                  </div>
                </div>
                <div className="flex items-baseline gap-2 mb-1">
                  {dataLoading ? (
                    <div className="h-9 w-12 bg-[#21262d] animate-pulse rounded"></div>
                  ) : (
                    <span className="text-white text-3xl font-bold">{stats.totalDeployments}</span>
                  )}
                </div>
                <p className="text-[#8b949e] text-xs">contracts deployed</p>
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
                  {dataLoading ? (
                    <div className="h-9 w-12 bg-[#21262d] animate-pulse rounded"></div>
                  ) : (
                    <>
                      <span className="text-white text-3xl font-bold">{stats.currentStreak}</span>
                      <span className="text-[#8b949e] text-sm font-medium">day{stats.currentStreak !== 1 ? 's' : ''}</span>
                    </>
                  )}
                </div>
                <p className="text-[#8b949e] text-xs">{stats.currentStreak > 0 ? 'Keep it up!' : 'Start today!'}</p>
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
                  <button onClick={() => setSelectedTab('projects')} className="text-[#58a6ff] hover:underline text-sm">View all</button>
                </div>
                
                {dataLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="border border-[#30363d] rounded-lg p-5 bg-[#0d1117]">
                        <div className="space-y-3">
                          <div className="h-10 bg-[#21262d] animate-pulse rounded"></div>
                          <div className="h-12 bg-[#21262d] animate-pulse rounded"></div>
                          <div className="h-4 bg-[#21262d] animate-pulse rounded w-2/3"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : recentProjects.length === 0 ? (
                  <div className="border border-[#30363d] rounded-lg p-12 bg-gradient-to-br from-[#161b22] to-[#0d1117] text-center">
                    <div className="w-16 h-16 rounded-full bg-[#21262d] flex items-center justify-center mx-auto mb-4">
                      <span className="material-symbols-outlined text-[#8b949e] text-3xl">code</span>
                    </div>
                    <h3 className="text-white text-lg font-semibold mb-2">No projects yet</h3>
                    <p className="text-[#8b949e] text-sm mb-4">Create your first Stylus smart contract</p>
                    <Link href="/ide" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#58a6ff] hover:bg-[#1f6feb] text-white text-sm font-medium transition-all">
                      <span className="material-symbols-outlined text-lg">add</span>
                      New Project
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {recentProjects.slice(0, 3).map((project) => {
                      const colors = ['#58a6ff', '#3fb950', '#a371f7', '#f85149'];
                      const icons = ['code', 'token', 'currency_exchange', 'how_to_vote'];
                      const randomColor = colors[project.name.length % colors.length];
                      const randomIcon = icons[project.name.length % icons.length];
                      
                      return (
                        <div key={project.id} className="group relative overflow-hidden border border-[#30363d] rounded-lg p-5 hover:border-[#58a6ff] transition-all bg-gradient-to-br from-[#161b22] to-[#0d1117] hover:shadow-lg hover:shadow-[#58a6ff]/10 cursor-pointer" onClick={() => router.push('/ide')}>
                          <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" style={{backgroundColor: `${randomColor}10`}}></div>
                          <div className="relative z-10">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{backgroundColor: `${randomColor}15`}}>
                                  <span className="material-symbols-outlined text-lg" style={{color: randomColor}}>{randomIcon}</span>
                                </div>
                                <h3 className="text-white font-semibold group-hover:text-[#58a6ff] transition-colors truncate">{project.name}</h3>
                              </div>
                              <span className="text-[#8b949e] text-xs px-2.5 py-1 rounded-full bg-[#21262d] border border-[#30363d] flex-shrink-0 ml-2">{project.language}</span>
                            </div>
                            {project.description && (
                              <p className="text-[#8b949e] text-sm mb-4 line-clamp-2">{project.description}</p>
                            )}
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-[#8b949e]">Updated {formatTimeAgo(project.updatedAt)}</span>
                              <span className="text-[#58a6ff] hover:text-white font-medium transition-colors">Open →</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Learning Progress - Simple */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-white text-xl font-semibold">Learning Progress</h2>
                  <Link href="/tutorial" className="text-[#58a6ff] hover:underline text-sm">Continue learning</Link>
                </div>
                
                <div className="relative overflow-hidden border border-[#30363d] rounded-lg p-6 bg-gradient-to-br from-[#161b22] to-[#0d1117] hover:border-[#a371f7] transition-all cursor-pointer" onClick={() => router.push('/tutorial')}>
                  <div className="absolute top-0 right-0 w-48 h-48 bg-[#a371f7]/5 rounded-full blur-3xl"></div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-5">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#a371f7]/20 to-[#a371f7]/5 flex items-center justify-center border border-[#a371f7]/20">
                        <span className="material-symbols-outlined text-3xl text-[#a371f7]">school</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white text-lg font-bold mb-1">Stylus Development Path</h3>
                        {dataLoading ? (
                          <div className="h-4 w-40 bg-[#21262d] animate-pulse rounded"></div>
                        ) : (
                          <p className="text-[#8b949e] text-sm">{tutorialProgress.completed} of {tutorialProgress.total} tutorials completed</p>
                        )}
                      </div>
                      <div className="text-center">
                        {dataLoading ? (
                          <div className="h-8 w-16 bg-[#21262d] animate-pulse rounded"></div>
                        ) : (
                          <>
                            <span className="text-white text-2xl font-bold block">{tutorialProgress.percentage}%</span>
                            <span className="text-[#8b949e] text-xs">Progress</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="w-full h-3 bg-[#21262d] rounded-full overflow-hidden mb-3">
                      <div 
                        className="h-full bg-gradient-to-r from-[#a371f7] to-[#58a6ff] rounded-full transition-all duration-500" 
                        style={{width: `${tutorialProgress.percentage}%`}}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      {dataLoading ? (
                        <div className="h-4 w-32 bg-[#21262d] animate-pulse rounded"></div>
                      ) : (
                        <span className="text-[#8b949e]">
                          {tutorialProgress.total - tutorialProgress.completed} tutorial{tutorialProgress.total - tutorialProgress.completed !== 1 ? 's' : ''} remaining
                        </span>
                      )}
                      <span className="text-[#58a6ff] hover:text-white font-medium transition-colors">Continue →</span>
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

              {dataLoading ? (
                <div className="grid grid-cols-1 gap-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="border border-[#30363d] rounded-lg p-4 bg-[#0d1117]">
                      <div className="space-y-3">
                        <div className="h-6 bg-[#21262d] animate-pulse rounded w-1/3"></div>
                        <div className="h-4 bg-[#21262d] animate-pulse rounded w-2/3"></div>
                        <div className="h-3 bg-[#21262d] animate-pulse rounded w-1/4"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentProjects.length === 0 ? (
                <div className="border border-[#30363d] rounded-lg p-12 bg-gradient-to-br from-[#161b22] to-[#0d1117] text-center">
                  <div className="w-16 h-16 rounded-full bg-[#21262d] flex items-center justify-center mx-auto mb-4">
                    <span className="material-symbols-outlined text-[#8b949e] text-3xl">code</span>
                  </div>
                  <h3 className="text-white text-lg font-semibold mb-2">No projects yet</h3>
                  <p className="text-[#8b949e] text-sm mb-4">Create your first Stylus smart contract in the IDE</p>
                  <Link href="/ide" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#58a6ff] hover:bg-[#1f6feb] text-white text-sm font-medium transition-all">
                    <span className="material-symbols-outlined text-lg">add</span>
                    New Project
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {recentProjects.map((project) => {
                    const colors = ['#58a6ff', '#3fb950', '#a371f7', '#f85149'];
                    const randomColor = colors[project.name.length % colors.length];
                    
                    return (
                      <div key={project.id} className="border border-[#30363d] rounded-lg p-4 hover:border-[#8b949e] transition-colors bg-[#0d1117] cursor-pointer" onClick={() => router.push('/ide')}>
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="material-symbols-outlined text-[#8b949e]">code</span>
                              <h3 className="text-[#58a6ff] font-semibold hover:underline">{project.name}</h3>
                              <span className="text-[#8b949e] text-xs px-2 py-0.5 rounded-full border border-[#30363d]">{project.language}</span>
                            </div>
                            {project.description && (
                              <p className="text-[#8b949e] text-sm mb-2 ml-9">{project.description}</p>
                            )}
                            <div className="flex items-center gap-4 text-xs text-[#8b949e] ml-9">
                              <span>Updated {formatTimeAgo(project.updatedAt)}</span>
                            </div>
                          </div>
                          <span className="text-[#58a6ff] hover:underline text-sm whitespace-nowrap ml-4">Open →</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          )}

          {selectedTab === 'activity' && (
            <div className="space-y-6">
              
              <h2 className="text-white text-xl font-semibold">Recent Activity</h2>

              <div className="border border-[#30363d] rounded-lg bg-[#0d1117]">
                {dataLoading ? (
                  <div className="divide-y divide-[#21262d]">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#21262d] animate-pulse"></div>
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-[#21262d] animate-pulse rounded w-2/3"></div>
                            <div className="h-3 bg-[#21262d] animate-pulse rounded w-1/4"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : recentProjects.length === 0 && stats.totalDeployments === 0 && stats.totalTutorialsCompleted === 0 ? (
                  <div className="p-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-[#21262d] flex items-center justify-center mx-auto mb-4">
                      <span className="material-symbols-outlined text-[#8b949e] text-3xl">history</span>
                    </div>
                    <h3 className="text-white text-lg font-semibold mb-2">No activity yet</h3>
                    <p className="text-[#8b949e] text-sm mb-4">Start by creating a project, completing a tutorial, or deploying a contract</p>
                    <div className="flex items-center justify-center gap-3">
                      <Link href="/tutorial" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#a371f7] hover:bg-[#8957e5] text-white text-sm font-medium transition-all">
                        <span className="material-symbols-outlined text-lg">school</span>
                        Start Learning
                      </Link>
                      <Link href="/ide" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#58a6ff] hover:bg-[#1f6feb] text-white text-sm font-medium transition-all">
                        <span className="material-symbols-outlined text-lg">code</span>
                        New Project
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="divide-y divide-[#21262d]">
                    {/* Recent deployments */}
                    {stats.totalDeployments > 0 && Array(Math.min(stats.totalDeployments, 3)).fill(0).map((_, i) => (
                      <div key={`deploy-${i}`} className="p-4 hover:bg-[#161b22] transition-colors">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#3fb950]/20">
                            <span className="material-symbols-outlined text-base text-[#3fb950]">rocket_launch</span>
                          </div>
                          <div className="flex-1">
                            <p className="text-white text-sm">
                              <span className="font-medium">Deployed contract</span>
                            </p>
                            <p className="text-[#8b949e] text-xs mt-1">Recently</p>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {/* Recent tutorials */}
                    {stats.totalTutorialsCompleted > 0 && Array(Math.min(stats.totalTutorialsCompleted, 2)).fill(0).map((_, i) => (
                      <div key={`tutorial-${i}`} className="p-4 hover:bg-[#161b22] transition-colors">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#a371f7]/20">
                            <span className="material-symbols-outlined text-base text-[#a371f7]">school</span>
                          </div>
                          <div className="flex-1">
                            <p className="text-white text-sm">
                              <span className="font-medium">Completed tutorial</span>
                            </p>
                            <p className="text-[#8b949e] text-xs mt-1">Recently</p>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {/* Recent projects */}
                    {recentProjects.slice(0, 2).map((project) => (
                      <div key={`project-${project.id}`} className="p-4 hover:bg-[#161b22] transition-colors cursor-pointer" onClick={() => router.push('/ide')}>
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#58a6ff]/20">
                            <span className="material-symbols-outlined text-base text-[#58a6ff]">add_circle</span>
                          </div>
                          <div className="flex-1">
                            <p className="text-white text-sm">
                              <span className="font-medium">Created project</span>
                              {' '}
                              <span className="text-[#58a6ff]">{project.name}</span>
                            </p>
                            <p className="text-[#8b949e] text-xs mt-1">{formatTimeAgo(project.updatedAt)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}
        </div>
      </main>
    </div>
  );
}
