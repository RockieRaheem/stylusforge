'use client';

import React, { useState } from 'react';
import { Activity, TrendingDown, Zap, AlertCircle, ChevronDown, ChevronUp, Info, Flame } from 'lucide-react';

export interface GasOperation {
  name: string;
  gasUsed: number;
  percentage: number;
  count: number;
  category: 'storage' | 'computation' | 'memory' | 'call' | 'event';
}

export interface GasProfile {
  totalGas: number;
  operations: GasOperation[];
  estimatedCost: number;
  optimizationSuggestions: string[];
}

interface GasProfilerProps {
  profile: GasProfile | null;
  isLoading?: boolean;
}

const categoryColors = {
  storage: { bg: 'bg-red-500/20', border: 'border-red-500/40', text: 'text-red-400', icon: '💾' },
  computation: { bg: 'bg-blue-500/20', border: 'border-blue-500/40', text: 'text-blue-400', icon: '⚡' },
  memory: { bg: 'bg-purple-500/20', border: 'border-purple-500/40', text: 'text-purple-400', icon: '🧠' },
  call: { bg: 'bg-yellow-500/20', border: 'border-yellow-500/40', text: 'text-yellow-400', icon: '📞' },
  event: { bg: 'bg-green-500/20', border: 'border-green-500/40', text: 'text-green-400', icon: '📡' },
};

export default function GasProfiler({ profile, isLoading }: GasProfilerProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['storage', 'computation']));
  const [showOptimizations, setShowOptimizations] = useState(true);
  const [showComparison, setShowComparison] = useState(false);

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  if (isLoading) {
    return (
      <div className="w-full bg-gradient-to-br from-slate-900/50 to-slate-800/50 border border-white/10 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center animate-pulse">
            <Activity className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Gas Profiler</h3>
            <p className="text-sm text-gray-400">Analyzing gas usage...</p>
          </div>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-white/5 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="w-full bg-gradient-to-br from-slate-900/50 to-slate-800/50 border border-white/10 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
            <Activity className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Gas Profiler</h3>
            <p className="text-sm text-gray-400">Detailed gas usage breakdown</p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-800/50 flex items-center justify-center mb-4">
            <Zap className="w-8 h-8 text-gray-600" />
          </div>
          <p className="text-gray-500 text-sm">Compile or deploy your contract to see gas analysis</p>
        </div>
      </div>
    );
  }

  // Group operations by category
  const groupedOps = profile.operations.reduce((acc, op) => {
    if (!acc[op.category]) {
      acc[op.category] = [];
    }
    acc[op.category].push(op);
    return acc;
  }, {} as Record<string, GasOperation[]>);

  // Calculate category totals
  const categoryTotals = Object.entries(groupedOps).map(([category, ops]) => ({
    category,
    total: ops.reduce((sum, op) => sum + op.gasUsed, 0),
    percentage: ops.reduce((sum, op) => sum + op.percentage, 0),
    count: ops.length,
  }));

  const ethPrice = 3500; // USD per ETH
  const gasPrice = 0.1; // Gwei

  return (
    <div className="w-full bg-gradient-to-br from-slate-900/50 to-slate-800/50 border border-white/10 rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
            <Activity className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Gas Profiler</h3>
            <p className="text-sm text-gray-400">Detailed breakdown & optimization tips</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-400" />
          <span className="text-2xl font-bold text-white">{profile.totalGas.toLocaleString()}</span>
          <span className="text-sm text-gray-400">gas</span>
        </div>
      </div>

      {/* Cost Estimate */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <div className="text-xs text-gray-400 mb-1">Estimated Cost</div>
          <div className="text-xl font-bold text-green-400">
            ${((profile.totalGas * gasPrice * ethPrice) / 1e9).toFixed(4)}
          </div>
        </div>
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <div className="text-xs text-gray-400 mb-1">Gas Price</div>
          <div className="text-xl font-bold text-blue-400">{gasPrice} Gwei</div>
        </div>
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <div className="text-xs text-gray-400 mb-1">Operations</div>
          <div className="text-xl font-bold text-purple-400">{profile.operations.length}</div>
        </div>
      </div>

      {/* Visual Gas Distribution Chart */}
      <div className="mb-6 bg-white/5 rounded-lg p-5 border border-white/10">
        <h4 className="text-sm font-semibold text-gray-400 mb-4">Gas Distribution</h4>
        <div className="space-y-4">
          {categoryTotals
            .sort((a, b) => b.total - a.total)
            .slice(0, 5)
            .map(({ category, total, percentage }) => {
              const colors = categoryColors[category as keyof typeof categoryColors];
              return (
                <div key={category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{colors.icon}</span>
                      <span className="text-sm font-medium text-white capitalize">{category}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-sm font-bold ${colors.text}`}>{percentage.toFixed(1)}%</span>
                      <span className="text-xs text-gray-500 w-20 text-right">{total.toLocaleString()} gas</span>
                    </div>
                  </div>
                  <div className="relative h-3 bg-black/30 rounded-full overflow-hidden">
                    <div
                      className={`absolute inset-y-0 left-0 ${colors.bg.replace('/20', '/60')} rounded-full transition-all duration-1000 ease-out`}
                      style={{ 
                        width: `${percentage}%`,
                        animation: 'slideIn 0.8s ease-out',
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent shimmer"></div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
          <TrendingDown className="w-4 h-4" />
          Gas Usage by Category
        </h4>
        <div className="space-y-2">
          {categoryTotals
            .sort((a, b) => b.total - a.total)
            .map(({ category, total, percentage, count }) => {
              const colors = categoryColors[category as keyof typeof categoryColors];
              const isExpanded = expandedCategories.has(category);

              return (
                <div key={category} className="space-y-2">
                  {/* Category Header */}
                  <button
                    onClick={() => toggleCategory(category)}
                    className="w-full flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 hover:border-white/20 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{colors.icon}</span>
                      <div className="text-left">
                        <div className="font-semibold text-white capitalize flex items-center gap-2">
                          {category}
                          <span className="text-xs text-gray-500">({count} ops)</span>
                        </div>
                        <div className="text-xs text-gray-400">{total.toLocaleString()} gas</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className={`text-sm font-bold ${colors.text}`}>{percentage.toFixed(1)}%</div>
                        <div className="text-xs text-gray-500">of total</div>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                      )}
                    </div>
                  </button>

                  {/* Category Operations */}
                  {isExpanded && groupedOps[category] && (
                    <div className="pl-6 space-y-1">
                      {groupedOps[category]
                        .sort((a, b) => b.gasUsed - a.gasUsed)
                        .map((op, idx) => (
                          <div
                            key={idx}
                            className={`flex items-center justify-between p-3 rounded-lg ${colors.bg} border ${colors.border}`}
                          >
                            <div className="flex-1">
                              <div className="text-sm font-medium text-white">{op.name}</div>
                              {op.count > 1 && (
                                <div className="text-xs text-gray-400">Called {op.count}x</div>
                              )}
                            </div>
                            <div className="flex items-center gap-4">
                              {/* Gas Bar */}
                              <div className="flex items-center gap-2">
                                <div className="w-24 h-2 bg-black/30 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full ${colors.bg.replace('/20', '/60')} transition-all duration-500`}
                                    style={{ width: `${op.percentage}%` }}
                                  ></div>
                                </div>
                                <span className="text-xs text-gray-400">{op.percentage.toFixed(1)}%</span>
                              </div>
                              <div className={`text-sm font-bold ${colors.text} min-w-[80px] text-right`}>
                                {op.gasUsed.toLocaleString()}
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </div>

      {/* Optimization Suggestions */}
      {profile.optimizationSuggestions.length > 0 && (
        <div>
          <button
            onClick={() => setShowOptimizations(!showOptimizations)}
            className="w-full flex items-center justify-between mb-3 text-sm font-semibold text-gray-400 hover:text-white transition-colors"
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Optimization Suggestions ({profile.optimizationSuggestions.length})
            </div>
            {showOptimizations ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {showOptimizations && (
            <div className="space-y-2">
              {profile.optimizationSuggestions.map((suggestion, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg"
                >
                  <Info className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-300 leading-relaxed">{suggestion}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Comparison Footer */}
      <div className="mt-6 pt-6 border-t border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-gray-400">
            💡 Stylus contracts typically use <span className="text-green-400 font-semibold">10-100x less gas</span> than Solidity
          </div>
          <button 
            onClick={() => setShowComparison(!showComparison)}
            className="text-sm text-blue-400 hover:text-blue-300 transition-colors font-medium flex items-center gap-1"
          >
            {showComparison ? 'Hide' : 'Compare with Solidity'} →
          </button>
        </div>

        {/* Solidity Comparison */}
        {showComparison && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-gradient-to-r from-red-500/10 via-orange-500/10 to-yellow-500/10 border border-orange-500/30 rounded-lg p-5">
              <h4 className="text-sm font-semibold text-orange-400 mb-4 flex items-center gap-2">
                <Flame className="w-4 h-4" />
                Solidity vs Stylus Comparison
              </h4>
              
              {/* Comparison Grid */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                {/* Solidity Column */}
                <div className="space-y-3">
                  <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Solidity (EVM)</div>
                  {profile.operations.slice(0, 5).map((op, idx) => {
                    // Estimate Solidity gas cost (typically 10-50x higher)
                    const solidityMultiplier = op.category === 'storage' ? 20 : op.category === 'computation' ? 10 : 15;
                    const solidityGas = Math.round(op.gasUsed * solidityMultiplier);
                    
                    return (
                      <div key={idx} className="bg-red-500/10 border border-red-500/30 rounded p-3">
                        <div className="text-xs text-gray-300 mb-1">{op.name}</div>
                        <div className="flex items-center justify-between">
                          <span className="text-red-400 font-bold">{solidityGas.toLocaleString()}</span>
                          <span className="text-xs text-gray-500">gas</span>
                        </div>
                      </div>
                    );
                  })}
                  <div className="bg-red-500/20 border border-red-500/40 rounded p-3">
                    <div className="text-xs text-gray-300 mb-1">Total Estimated</div>
                    <div className="flex items-center justify-between">
                      <span className="text-red-400 font-bold text-lg">{(profile.totalGas * 15).toLocaleString()}</span>
                      <span className="text-xs text-gray-500">gas</span>
                    </div>
                  </div>
                </div>

                {/* Stylus Column */}
                <div className="space-y-3">
                  <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Stylus (WASM)</div>
                  {profile.operations.slice(0, 5).map((op, idx) => (
                    <div key={idx} className="bg-green-500/10 border border-green-500/30 rounded p-3">
                      <div className="text-xs text-gray-300 mb-1">{op.name}</div>
                      <div className="flex items-center justify-between">
                        <span className="text-green-400 font-bold">{op.gasUsed.toLocaleString()}</span>
                        <span className="text-xs text-gray-500">gas</span>
                      </div>
                    </div>
                  ))}
                  <div className="bg-green-500/20 border border-green-500/40 rounded p-3">
                    <div className="text-xs text-gray-300 mb-1">Total Actual</div>
                    <div className="flex items-center justify-between">
                      <span className="text-green-400 font-bold text-lg">{profile.totalGas.toLocaleString()}</span>
                      <span className="text-xs text-gray-500">gas</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Savings Summary */}
              <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/40 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Estimated Savings</div>
                    <div className="text-2xl font-bold text-green-400">
                      {((1 - profile.totalGas / (profile.totalGas * 15)) * 100).toFixed(1)}%
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-400 mb-1">Gas Saved</div>
                    <div className="text-xl font-bold text-blue-400">
                      {((profile.totalGas * 15) - profile.totalGas).toLocaleString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-400 mb-1">Cost Saved</div>
                    <div className="text-xl font-bold text-purple-400">
                      ${(((profile.totalGas * 15) - profile.totalGas) * 0.1 * 3500 / 1e9).toFixed(4)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Why So Different */}
              <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <h5 className="text-xs font-semibold text-blue-400 mb-2 flex items-center gap-2">
                  <Info className="w-3 h-3" />
                  Why is Stylus so much cheaper?
                </h5>
                <ul className="space-y-1 text-xs text-gray-300">
                  <li>• WASM is compiled to native machine code (vs EVM bytecode interpretation)</li>
                  <li>• Memory operations are direct (vs expensive EVM memory expansion)</li>
                  <li>• Rust's zero-cost abstractions eliminate runtime overhead</li>
                  <li>• Optimized storage access patterns reduce redundant SLOAD/SSTORE</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
