'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/context/AuthContext';
import { deploymentHistoryService } from '@/lib/services/deployment-history.service';
import { Loader2, Rocket, Calendar, ExternalLink, ArrowLeft, Search, Filter, Copy, CheckCircle, Clock, TrendingUp } from 'lucide-react';

interface Deployment {
  id: string;
  contractAddress: string;
  contractName: string;
  network: string;
  timestamp: any;
  gasUsed: string;
  transactionHash: string;
  userId: string;
  projectId?: string;
  projectName?: string;
  status: 'success' | 'failed';
}

export default function DeploymentsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterNetwork, setFilterNetwork] = useState<'all' | 'arbitrum-sepolia' | 'arbitrum-mainnet'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'oldest' | 'gas'>('recent');
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadDeployments();
    }
  }, [user]);

  const loadDeployments = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const userDeployments = await deploymentHistoryService.getUserDeployments(user.uid);
      setDeployments(userDeployments);
    } catch (error) {
      console.error('Failed to load deployments:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedAddress(text);
      setTimeout(() => setCopiedAddress(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const filteredAndSortedDeployments = deployments
    .filter(deployment => {
      const matchesSearch = 
        deployment.contractName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deployment.contractAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deployment.projectName?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesNetwork = filterNetwork === 'all' || deployment.network === filterNetwork;
      
      return matchesSearch && matchesNetwork;
    })
    .sort((a, b) => {
      if (sortBy === 'oldest') {
        return a.timestamp?.toMillis() - b.timestamp?.toMillis();
      } else if (sortBy === 'gas') {
        return parseFloat(b.gasUsed) - parseFloat(a.gasUsed);
      } else {
        return b.timestamp?.toMillis() - a.timestamp?.toMillis();
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

  const getExplorerUrl = (network: string, hash: string) => {
    if (network === 'arbitrum-mainnet') {
      return `https://arbiscan.io/tx/${hash}`;
    }
    return `https://sepolia.arbiscan.io/tx/${hash}`;
  };

  const getAddressUrl = (network: string, address: string) => {
    if (network === 'arbitrum-mainnet') {
      return `https://arbiscan.io/address/${address}`;
    }
    return `https://sepolia.arbiscan.io/address/${address}`;
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const totalGasUsed = deployments.reduce((sum, d) => sum + parseFloat(d.gasUsed || '0'), 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#3fb950] mx-auto mb-4" />
          <p className="text-[#8b949e]">Loading your deployments...</p>
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
                  <Rocket className="h-8 w-8 text-[#3fb950]" />
                  Contract Deployments
                </h1>
                <p className="text-[#8b949e] mt-1">
                  {deployments.length} {deployments.length === 1 ? 'contract' : 'contracts'} deployed
                </p>
              </div>
            </div>
            <Link
              href="/deploy"
              className="px-6 py-3 bg-[#238636] hover:bg-[#2ea043] text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
            >
              <Rocket className="h-5 w-5" />
              Deploy New Contract
            </Link>
          </div>

          {/* Stats */}
          {deployments.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-[#0d1117] border border-[#30363d] rounded-lg">
                <div className="flex items-center gap-2 text-[#8b949e] text-sm mb-2">
                  <Rocket className="h-4 w-4" />
                  <span>Total Deployments</span>
                </div>
                <div className="text-2xl font-bold text-white">{deployments.length}</div>
              </div>
              <div className="p-4 bg-[#0d1117] border border-[#30363d] rounded-lg">
                <div className="flex items-center gap-2 text-[#8b949e] text-sm mb-2">
                  <TrendingUp className="h-4 w-4" />
                  <span>Total Gas Used</span>
                </div>
                <div className="text-2xl font-bold text-white">{totalGasUsed.toFixed(4)} ETH</div>
              </div>
              <div className="p-4 bg-[#0d1117] border border-[#30363d] rounded-lg">
                <div className="flex items-center gap-2 text-[#8b949e] text-sm mb-2">
                  <Clock className="h-4 w-4" />
                  <span>Last Deployed</span>
                </div>
                <div className="text-sm font-medium text-white">
                  {formatDate(deployments[0]?.timestamp)}
                </div>
              </div>
            </div>
          )}

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#8b949e]" />
              <input
                type="text"
                placeholder="Search by contract name, address, or project..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#0d1117] border border-[#30363d] rounded-lg text-white placeholder:text-[#8b949e] focus:border-[#3fb950] focus:outline-none transition-colors"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-[#8b949e]" />
              <select
                value={filterNetwork}
                onChange={(e) => setFilterNetwork(e.target.value as any)}
                className="px-4 py-2.5 bg-[#0d1117] border border-[#30363d] rounded-lg text-white focus:border-[#3fb950] focus:outline-none transition-colors cursor-pointer"
              >
                <option value="all">All Networks</option>
                <option value="arbitrum-sepolia">Arbitrum Sepolia</option>
                <option value="arbitrum-mainnet">Arbitrum Mainnet</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2.5 bg-[#0d1117] border border-[#30363d] rounded-lg text-white focus:border-[#3fb950] focus:outline-none transition-colors cursor-pointer"
              >
                <option value="recent">Recently Deployed</option>
                <option value="oldest">Oldest First</option>
                <option value="gas">Highest Gas</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Deployments List */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {filteredAndSortedDeployments.length === 0 ? (
          <div className="text-center py-20">
            <Rocket className="h-20 w-20 text-[#30363d] mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-white mb-2">
              {searchQuery || filterNetwork !== 'all' ? 'No deployments found' : 'No deployments yet'}
            </h3>
            <p className="text-[#8b949e] mb-6">
              {searchQuery || filterNetwork !== 'all'
                ? 'Try adjusting your search or filter criteria' 
                : 'Deploy your first contract to get started'
              }
            </p>
            {!searchQuery && filterNetwork === 'all' && (
              <Link
                href="/deploy"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#238636] hover:bg-[#2ea043] text-white rounded-lg font-semibold transition-colors"
              >
                <Rocket className="h-5 w-5" />
                Deploy Your First Contract
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAndSortedDeployments.map((deployment) => (
              <div
                key={deployment.id}
                className="group relative overflow-hidden border border-[#30363d] rounded-xl bg-[#161b22] hover:border-[#3fb950] transition-all hover:shadow-xl hover:shadow-[#3fb950]/10"
              >
                {/* Gradient Background */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#3fb950]/10 to-transparent rounded-full blur-3xl group-hover:from-[#3fb950]/20 transition-all" />
                
                <div className="relative z-10 p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Left Section */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-white group-hover:text-[#3fb950] transition-colors">
                          {deployment.contractName}
                        </h3>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                          deployment.network === 'arbitrum-mainnet' 
                            ? 'bg-[#1f6feb]/10 text-[#58a6ff]' 
                            : 'bg-[#f85149]/10 text-[#f85149]'
                        }`}>
                          {deployment.network === 'arbitrum-mainnet' ? 'Mainnet' : 'Sepolia'}
                        </span>
                      </div>

                      {deployment.projectName && (
                        <p className="text-sm text-[#8b949e] mb-3">
                          Project: <span className="text-white">{deployment.projectName}</span>
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        {/* Contract Address */}
                        <div className="flex items-center gap-2">
                          <span className="text-[#8b949e]">Address:</span>
                          <button
                            onClick={() => copyToClipboard(deployment.contractAddress)}
                            className="flex items-center gap-1.5 text-white hover:text-[#3fb950] transition-colors"
                          >
                            <code className="font-mono">{truncateAddress(deployment.contractAddress)}</code>
                            {copiedAddress === deployment.contractAddress ? (
                              <CheckCircle className="h-3.5 w-3.5 text-[#3fb950]" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </div>

                        {/* Gas Used */}
                        <div className="flex items-center gap-2">
                          <span className="text-[#8b949e]">Gas:</span>
                          <span className="text-white font-mono">{deployment.gasUsed} ETH</span>
                        </div>

                        {/* Date */}
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3.5 w-3.5 text-[#8b949e]" />
                          <span className="text-[#8b949e]">{formatDate(deployment.timestamp)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right Section - Actions */}
                    <div className="flex items-center gap-2">
                      <a
                        href={getAddressUrl(deployment.network, deployment.contractAddress)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-[#238636] hover:bg-[#2ea043] text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-2"
                      >
                        View Contract
                        <ExternalLink className="h-4 w-4" />
                      </a>
                      <a
                        href={getExplorerUrl(deployment.network, deployment.transactionHash)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-[#30363d] hover:bg-[#484f58] text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-2"
                      >
                        View TX
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
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
