'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/context/AuthContext';
import { tutorialProgressService } from '@/lib/services/tutorial-progress.service';
import { nftService, BadgeNFT } from '@/lib/services/nft.service';
import BadgeDisplay from '@/components/BadgeDisplay';
import { Award, ArrowLeft, Trophy, Star, Lock, ExternalLink, Sparkles } from 'lucide-react';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  earnedAt: Date;
}

interface BadgeStats {
  totalEarned: number;
  totalAvailable: number;
  percentage: number;
  totalPoints: number;
  recentBadges: Badge[];
}

// All available badges in the system
const ALL_BADGES = [
  {
    id: 'stylus_beginner',
    name: 'Stylus Beginner',
    description: 'Completed Getting Started tutorial',
    icon: 'rocket_launch',
    color: '#58a6ff'
  },
  {
    id: 'storage_master',
    name: 'Storage Master',
    description: 'Mastered storage and state management',
    icon: 'storage',
    color: '#3fb950'
  },
  {
    id: 'function_expert',
    name: 'Function Expert',
    description: 'Mastered contract functions and methods',
    icon: 'code',
    color: '#a371f7'
  },
  {
    id: 'event_master',
    name: 'Event Master',
    description: 'Mastered event emission and logging',
    icon: 'notifications',
    color: '#f85149'
  },
  {
    id: 'error_handler',
    name: 'Error Handler',
    description: 'Mastered error handling patterns',
    icon: 'error',
    color: '#f85149'
  },
  {
    id: 'test_master',
    name: 'Test Master',
    description: 'Mastered smart contract testing',
    icon: 'science',
    color: '#58a6ff'
  },
  {
    id: 'gas_optimizer',
    name: 'Gas Optimizer',
    description: 'Mastered gas optimization techniques',
    icon: 'speed',
    color: '#3fb950'
  },
  {
    id: 'pattern_architect',
    name: 'Pattern Architect',
    description: 'Mastered advanced design patterns',
    icon: 'architecture',
    color: '#a371f7'
  },
  {
    id: 'defi_builder',
    name: 'DeFi Builder',
    description: 'Built a complete DeFi token',
    icon: 'currency_exchange',
    color: '#f85149'
  },
  {
    id: 'nft_master',
    name: 'NFT Master',
    description: 'Built a complete NFT marketplace',
    icon: 'storefront',
    color: '#58a6ff'
  }
];

export default function BadgesPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<BadgeStats>({
    totalEarned: 0,
    totalAvailable: ALL_BADGES.length,
    percentage: 0,
    totalPoints: 0,
    recentBadges: []
  });
  const [earnedBadges, setEarnedBadges] = useState<Set<string>>(new Set());
  const [nftBadges, setNftBadges] = useState<BadgeNFT[]>([]);
  const [loadingNFTs, setLoadingNFTs] = useState(false);
  const [showNFTSection, setShowNFTSection] = useState(false);

  useEffect(() => {
    if (user) {
      loadBadges();
      loadNFTBadges();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadNFTBadges = async () => {
    if (!user) return;

    try {
      setLoadingNFTs(true);
      
      // Check if NFT contract is deployed
      const isDeployed = await nftService.isContractDeployed();
      if (!isDeployed) {
        setShowNFTSection(false);
        return;
      }

      setShowNFTSection(true);

      // For Firebase auth, we need wallet address
      // In a real app, you'd have the user connect their wallet
      // For now, we'll just check if contract is available
      const contractAddress = nftService.getContractAddress();
      if (contractAddress) {
        // This would need actual wallet connection
        // For demo, we show the section but note wallet connection needed
        console.log('NFT contract available at:', contractAddress);
      }
    } catch (error) {
      console.error('Error loading NFT badges:', error);
    } finally {
      setLoadingNFTs(false);
    }
  };

  const loadBadges = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const userData = await tutorialProgressService.getUserData(user.uid);
      
      console.log('🔍 Raw badges data:', userData.badges);
      console.log('📊 Total badges in data:', userData.badges.length);
      
      // Remove duplicates by badge ID
      const uniqueBadges = userData.badges.filter((badge, index, self) =>
        index === self.findIndex((b) => b.id === badge.id)
      );
      
      console.log('✅ Unique badges:', uniqueBadges.length);
      
      const earnedIds = new Set(uniqueBadges.map(b => b.id));
      setEarnedBadges(earnedIds);

      const recentBadges = uniqueBadges
        .sort((a, b) => b.earnedAt.getTime() - a.earnedAt.getTime())
        .slice(0, 3);

      setStats({
        totalEarned: uniqueBadges.length,
        totalAvailable: ALL_BADGES.length,
        percentage: Math.round((uniqueBadges.length / ALL_BADGES.length) * 100),
        totalPoints: userData.totalPoints,
        recentBadges
      });
    } catch (error) {
      console.error('Error loading badges:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#58a6ff] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#8b949e]">Loading badges...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d1117] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[#21262d] bg-[#0d1117]/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/dashboard"
                className="p-2 hover:bg-[#21262d] rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-[#8b949e]" />
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#f85149]/20 to-[#f85149]/5 flex items-center justify-center border border-[#f85149]/20">
                  <Award className="h-6 w-6 text-[#f85149]" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">Your Badges</h1>
                  <p className="text-sm text-[#8b949e]">Track your achievements</p>
                </div>
              </div>
            </div>
            <Link
              href="/tutorial"
              className="px-4 py-2 bg-[#238636] hover:bg-[#2ea043] rounded-lg transition-colors text-sm font-medium"
            >
              Earn More Badges
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="border border-[#30363d] rounded-lg p-5 bg-gradient-to-br from-[#161b22] to-[#0d1117]">
            <div className="flex items-center gap-3 mb-2">
              <Trophy className="h-5 w-5 text-[#f85149]" />
              <span className="text-[#8b949e] text-sm font-medium">Total Badges</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-white text-3xl font-bold">{stats.totalEarned}</span>
              <span className="text-[#8b949e] text-sm">/ {stats.totalAvailable}</span>
            </div>
          </div>

          <div className="border border-[#30363d] rounded-lg p-5 bg-gradient-to-br from-[#161b22] to-[#0d1117]">
            <div className="flex items-center gap-3 mb-2">
              <Award className="h-5 w-5 text-[#58a6ff]" />
              <span className="text-[#8b949e] text-sm font-medium">Completion</span>
            </div>
            <span className="text-white text-3xl font-bold">{stats.percentage}%</span>
          </div>

          <div className="border border-[#30363d] rounded-lg p-5 bg-gradient-to-br from-[#161b22] to-[#0d1117]">
            <div className="flex items-center gap-3 mb-2">
              <Star className="h-5 w-5 text-[#f85149]" />
              <span className="text-[#8b949e] text-sm font-medium">Total Points</span>
            </div>
            <span className="text-white text-3xl font-bold">{stats.totalPoints.toLocaleString()}</span>
          </div>

          <div className="border border-[#30363d] rounded-lg p-5 bg-gradient-to-br from-[#161b22] to-[#0d1117]">
            <div className="flex items-center gap-3 mb-2">
              <Lock className="h-5 w-5 text-[#8b949e]" />
              <span className="text-[#8b949e] text-sm font-medium">To Unlock</span>
            </div>
            <span className="text-white text-3xl font-bold">{stats.totalAvailable - stats.totalEarned}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="border border-[#30363d] rounded-lg p-6 bg-gradient-to-br from-[#161b22] to-[#0d1117] mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-white">Badge Collection Progress</h2>
            <span className="text-[#8b949e] text-sm">{stats.totalEarned} / {stats.totalAvailable} earned</span>
          </div>
          <div className="w-full h-4 bg-[#21262d] rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#f85149] via-[#a371f7] to-[#58a6ff] rounded-full transition-all duration-500"
              style={{ width: `${stats.percentage}%` }}
            />
          </div>
        </div>

        {/* Badge Grid */}
        <div className="space-y-6">
          {/* NFT Badges Section */}
          {showNFTSection && (
            <div className="border-2 border-purple-500/30 rounded-lg p-6 bg-gradient-to-br from-purple-900/10 to-pink-900/10 mb-8">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Sparkles className="h-6 w-6 text-purple-400" />
                  <div>
                    <h2 className="text-xl font-bold text-white">NFT Achievement Badges</h2>
                    <p className="text-sm text-[#8b949e]">Mint your badges as NFTs on Arbitrum</p>
                  </div>
                </div>
                <a
                  href={`https://sepolia.arbiscan.io/address/${nftService.getContractAddress()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                >
                  View Contract
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="bg-[#161b22] rounded-lg p-4 border border-[#30363d]">
                <div className="flex items-start gap-3">
                  <Award className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-white font-semibold text-sm mb-2">
                      Claim Your Achievement NFTs
                    </h3>
                    <p className="text-[#8b949e] text-xs mb-3">
                      When you earn a badge in tutorials, you can mint it as an on-chain NFT. 
                      Each NFT is soul-bound (non-transferable) and proves your Stylus mastery.
                    </p>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded">
                        Soul-Bound NFTs
                      </span>
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded">
                        Arbitrum Sepolia
                      </span>
                      <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded">
                        On-Chain Metadata
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {nftBadges.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-semibold text-white mb-3">Your NFT Badges</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {nftBadges.map((nft) => (
                      <div
                        key={nft.tokenId}
                        className="border border-purple-500/30 rounded-lg p-3 bg-[#161b22] hover:border-purple-500/60 transition-all group"
                      >
                        <div className="aspect-square rounded-lg overflow-hidden mb-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                          {nft.imageUrl && (
                            <img
                              src={nft.imageUrl}
                              alt={nft.name}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <h4 className="text-white text-xs font-semibold mb-1">{nft.name}</h4>
                        <p className="text-[#8b949e] text-xs mb-2">#{nft.tokenId}</p>
                        {nft.blockExplorer && (
                          <a
                            href={nft.blockExplorer}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                          >
                            View NFT
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {stats.totalEarned > 0 && (
            <div>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Trophy className="h-6 w-6 text-[#f85149]" />
                Earned Badges ({stats.totalEarned})
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {ALL_BADGES.filter(badge => earnedBadges.has(badge.id)).map(badge => {
                  const earnedBadge = stats.recentBadges.find(b => b.id === badge.id);
                  return (
                    <div 
                      key={badge.id}
                      className="border border-[#30363d] rounded-lg p-5 bg-gradient-to-br from-[#161b22] to-[#0d1117] hover:border-[#58a6ff] transition-all group"
                    >
                      <div className="flex flex-col items-center text-center">
                        <BadgeDisplay
                          {...badge}
                          earnedAt={earnedBadge?.earnedAt || new Date()}
                          size="md"
                          showAnimation={false}
                        />
                        <h3 className="text-white font-semibold text-sm mt-3 mb-1">{badge.name}</h3>
                        <p className="text-[#8b949e] text-xs mb-2">{badge.description}</p>
                        {earnedBadge && (
                          <p className="text-[#8b949e] text-xs">
                            Earned {new Date(earnedBadge.earnedAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {stats.totalAvailable - stats.totalEarned > 0 && (
            <div>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Lock className="h-6 w-6 text-[#8b949e]" />
                Locked Badges ({stats.totalAvailable - stats.totalEarned})
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {ALL_BADGES.filter(badge => !earnedBadges.has(badge.id)).map(badge => (
                  <div 
                    key={badge.id}
                    className="border border-[#30363d] rounded-lg p-5 bg-gradient-to-br from-[#161b22] to-[#0d1117] opacity-50 hover:opacity-70 transition-all"
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="relative">
                        <div 
                          className="w-20 h-20 rounded-full flex items-center justify-center border-2 border-dashed border-[#30363d] grayscale"
                          style={{ backgroundColor: `${badge.color}10` }}
                        >
                          <span className="material-symbols-outlined text-3xl text-[#30363d]">
                            {badge.icon}
                          </span>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Lock className="h-6 w-6 text-[#8b949e]" />
                        </div>
                      </div>
                      <h3 className="text-[#8b949e] font-semibold text-sm mt-3 mb-1">{badge.name}</h3>
                      <p className="text-[#8b949e] text-xs">{badge.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Empty State */}
        {stats.totalEarned === 0 && (
          <div className="border border-[#30363d] rounded-lg p-12 bg-gradient-to-br from-[#161b22] to-[#0d1117] text-center">
            <div className="w-20 h-20 rounded-full bg-[#21262d] flex items-center justify-center mx-auto mb-4">
              <Award className="h-10 w-10 text-[#8b949e]" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No Badges Yet</h3>
            <p className="text-[#8b949e] mb-6 max-w-md mx-auto">
              Start completing tutorials to earn your first badge and begin your journey to becoming a Stylus expert!
            </p>
            <Link
              href="/tutorial"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#238636] hover:bg-[#2ea043] rounded-lg transition-colors font-medium"
            >
              <Trophy className="h-5 w-5" />
              Start Learning
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
