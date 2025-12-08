'use client';

import { useState, useEffect } from 'react';
import { Flame, TrendingDown, Zap, DollarSign } from 'lucide-react';

interface ComparisonData {
  operation: string;
  solidity: number;
  stylus: number;
  savings: number;
}

const gasData: ComparisonData[] = [
  { operation: 'Token Transfer', solidity: 45000, stylus: 2800, savings: 94 },
  { operation: 'Storage Write', solidity: 20000, stylus: 800, savings: 96 },
  { operation: 'Complex Computation', solidity: 85000, stylus: 3200, savings: 96 },
  { operation: 'NFT Mint', solidity: 120000, stylus: 8500, savings: 93 },
  { operation: 'Swap Operation', solidity: 150000, stylus: 12000, savings: 92 },
];

const ETH_PRICE = 3500; // USD per ETH
const GWEI_TO_ETH = 1e-9;
const GAS_PRICE_GWEI = 30; // Average gas price in Gwei

export default function GasComparison() {
  const [animatedBars, setAnimatedBars] = useState<number[]>([]);
  const [selectedOperation, setSelectedOperation] = useState<number>(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    // Animate bars sequentially
    gasData.forEach((_, index) => {
      setTimeout(() => {
        setAnimatedBars(prev => [...prev, index]);
      }, index * 150);
    });
  }, []);

  const calculateCost = (gasUnits: number): string => {
    const ethCost = gasUnits * GAS_PRICE_GWEI * GWEI_TO_ETH;
    const usdCost = ethCost * ETH_PRICE;
    return usdCost.toFixed(2);
  };

  const selected = gasData[selectedOperation];
  const totalSolidityCost = gasData.reduce((acc, item) => acc + parseFloat(calculateCost(item.solidity)), 0);
  const totalStylusCost = gasData.reduce((acc, item) => acc + parseFloat(calculateCost(item.stylus)), 0);
  const totalSavings = ((totalSolidityCost - totalStylusCost) / totalSolidityCost) * 100;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-full mb-6">
          <TrendingDown className="w-5 h-5 text-green-400" />
          <span className="text-green-400 font-semibold text-sm">Massive Gas Savings</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Save Up To <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">96%</span> on Gas
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Stylus smart contracts are dramatically more efficient than Solidity. See the real-world cost comparison.
        </p>
      </div>

      {/* Main Comparison Card */}
      <div className="bg-gradient-to-br from-slate-900/90 to-slate-950/90 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8 border-b border-white/10 bg-slate-900/50">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Flame className="w-5 h-5 text-red-400" />
              <span className="text-gray-400 text-sm font-medium">Solidity Cost</span>
            </div>
            <p className="text-3xl font-bold text-red-400">${totalSolidityCost.toFixed(2)}</p>
            <p className="text-xs text-gray-500 mt-1">For 5 common operations</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-blue-400" />
              <span className="text-gray-400 text-sm font-medium">Stylus Cost</span>
            </div>
            <p className="text-3xl font-bold text-blue-400">${totalStylusCost.toFixed(2)}</p>
            <p className="text-xs text-gray-500 mt-1">Same operations</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-green-400" />
              <span className="text-gray-400 text-sm font-medium">You Save</span>
            </div>
            <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400 animate-pulse">
              {totalSavings.toFixed(0)}%
            </p>
            <p className="text-xs text-gray-500 mt-1">${(totalSolidityCost - totalStylusCost).toFixed(2)} saved</p>
          </div>
        </div>

        {/* Bar Chart Comparison */}
        <div className="p-8 space-y-6">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <span className="w-1 h-6 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full"></span>
            Gas Usage by Operation
          </h3>
          
          <div className="space-y-6">
            {gasData.map((item, index) => (
              <div
                key={item.operation}
                className={`transition-all duration-500 ${
                  isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-between mb-2">
                  <button
                    onClick={() => setSelectedOperation(index)}
                    className={`text-sm font-medium transition-colors ${
                      selectedOperation === index 
                        ? 'text-white' 
                        : 'text-gray-400 hover:text-gray-300'
                    }`}
                  >
                    {item.operation}
                  </button>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500">Savings:</span>
                    <span className="px-2 py-1 bg-green-500/20 border border-green-500/30 rounded-md text-green-400 font-bold text-xs">
                      {item.savings}%
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {/* Solidity Bar */}
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 w-20 text-right font-medium">Solidity</span>
                    <div className="flex-1 bg-slate-800/50 rounded-lg h-10 overflow-hidden relative border border-red-500/20">
                      <div
                        className={`h-full bg-gradient-to-r from-red-500 via-red-600 to-red-700 relative transition-all duration-1000 ease-out ${
                          animatedBars.includes(index) ? 'opacity-100' : 'opacity-0'
                        }`}
                        style={{ 
                          width: animatedBars.includes(index) ? '100%' : '0%'
                        }}
                      >
                        {/* Shimmer effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
                      </div>
                      <div className={`absolute inset-0 flex items-center justify-between px-4 transition-opacity duration-500 ${
                        animatedBars.includes(index) ? 'opacity-100' : 'opacity-0'
                      }`} style={{ transitionDelay: '400ms' }}>
                        <span className="text-white text-sm font-bold drop-shadow-lg">
                          {item.solidity.toLocaleString()} gas
                        </span>
                        <span className="text-red-200 text-xs font-medium">${calculateCost(item.solidity)}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Stylus Bar */}
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 w-20 text-right font-medium">Stylus</span>
                    <div className="flex-1 bg-slate-800/50 rounded-lg h-10 overflow-hidden relative border border-blue-500/20">
                      <div
                        className={`h-full bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 relative transition-all duration-1000 ease-out ${
                          animatedBars.includes(index) ? 'opacity-100' : 'opacity-0'
                        }`}
                        style={{ 
                          width: animatedBars.includes(index) ? `${Math.max((item.stylus / item.solidity) * 100, 8)}%` : '0%',
                          transitionDelay: '200ms'
                        }}
                      >
                        {/* Shimmer effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" style={{ animationDelay: '0.5s' }}></div>
                      </div>
                      <div className={`absolute inset-0 flex items-center justify-between px-4 transition-opacity duration-500 ${
                        animatedBars.includes(index) ? 'opacity-100' : 'opacity-0'
                      }`} style={{ transitionDelay: '600ms' }}>
                        <span className="text-white text-sm font-bold drop-shadow-lg">
                          {item.stylus.toLocaleString()} gas
                        </span>
                        <span className="text-blue-200 text-xs font-medium">${calculateCost(item.stylus)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Visual Savings Indicator */}
                  <div className="flex items-center justify-end gap-2 mt-1">
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-green-500/10 border border-green-500/20 rounded-md">
                      <svg className="w-3 h-3 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      <span className="text-green-400 font-bold text-xs">
                        {item.savings}% less gas
                      </span>
                    </div>
                    <span className="text-green-400 text-xs font-semibold">
                      Save ${(parseFloat(calculateCost(item.solidity)) - parseFloat(calculateCost(item.stylus))).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="p-8 bg-slate-900/30 border-t border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Selected Operation Details</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Operation</span>
                  <span className="text-white font-medium">{selected.operation}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Solidity Gas</span>
                  <span className="text-red-400 font-mono text-sm">{selected.solidity.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Stylus Gas</span>
                  <span className="text-blue-400 font-mono text-sm">{selected.stylus.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-white/10">
                  <span className="text-gray-300 font-medium">Gas Saved</span>
                  <span className="text-green-400 font-bold">{(selected.solidity - selected.stylus).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 font-medium">Cost Saved</span>
                  <span className="text-green-400 font-bold">
                    ${(parseFloat(calculateCost(selected.solidity)) - parseFloat(calculateCost(selected.stylus))).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">💡 Why So Efficient?</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">✓</span>
                  <span>Stylus compiles to WebAssembly, which is 10-100x faster than EVM</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">✓</span>
                  <span>More efficient memory management and computation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">✓</span>
                  <span>Optimized Rust code results in smaller contract size</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">✓</span>
                  <span>Native support for complex operations without gas overhead</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="p-8 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="text-xl font-bold text-white mb-2">Ready to save on gas?</h4>
              <p className="text-gray-400 text-sm">Start building with Stylus today and reduce your deployment costs by up to 96%</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href="/tutorial"
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-lg transition-all shadow-lg shadow-blue-500/20"
              >
                Start Learning
              </a>
              <a
                href="/ide"
                className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-lg transition-all border border-white/10"
              >
                Open IDE
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Context */}
      <div className="mt-8 text-center">
        <p className="text-gray-500 text-sm">
          * Gas prices calculated at {GAS_PRICE_GWEI} Gwei, ETH price at ${ETH_PRICE.toLocaleString()}. Actual savings may vary based on network conditions.
        </p>
      </div>
    </div>
  );
}
