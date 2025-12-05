'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function DeploySuccessPage() {
  const searchParams = useSearchParams();
  const contractAddress = searchParams?.get('address') || '0x0000000000000000000000000000000000000000';
  const txHash = searchParams?.get('tx') || '0x0000000000000000000000000000000000000000000000000000000000000000';
  const network = searchParams?.get('network') || 'arbitrum-sepolia';
  const [addressCopied, setAddressCopied] = useState(false);

  const explorerUrl = network === 'arbitrum-mainnet' 
    ? `https://arbiscan.io/tx/${txHash}`
    : `https://sepolia.arbiscan.io/tx/${txHash}`;

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(contractAddress);
    setAddressCopied(true);
    setTimeout(() => setAddressCopied(false), 2000);
  };

  const handleShareTwitter = () => {
    const text = `Just deployed my first Stylus contract on Arbitrum! 🚀\n\nContract: ${contractAddress}\n\nBuilt with StylusForge`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleViewExplorer = () => {
    window.open(explorerUrl, '_blank');
  };

  return (
    <div
      className="relative flex min-h-screen w-full flex-col bg-background-dark overflow-hidden"
      style={{
        backgroundImage:
          "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAiZBzSH-wqLfoigRezFXH62S32g-_Hx5iKGYHOuv7q7sKb3BfvqJPEYB7w-i04MERHXehgq7-nS-LFGdAcC1jHHlAhfzR_cMCCM9qMVjniuMkQnQTbEApj-6ETWLqLMTX0HRoUaZc7lVDVbyrGwjwIsNiARl2-m23k9tD7UjSb_V0ZZ1Z7EjYsFjDKHIpns8G1iGzjqo9sdnicMa2XneS5Ud6pBhpblE9EVQmwhSaIK-H6kRVmnhIUuD5nucvxNk-o9SyKfQ3zVmE')",
        backgroundSize: "cover",
      }}
    >
      <div className="flex flex-1 items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="flex flex-col max-w-2xl flex-1 bg-[#2A3B4D]/80 backdrop-blur-sm rounded-xl border border-white/10 shadow-2xl overflow-hidden">
          <div className="relative p-6 sm:p-8 overflow-hidden">
            {/* Confetti layer */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="confetti bg-[#28A0F0]" style={{ left: "10%", animationDelay: "0s" }} />
              <div className="confetti bg-stylus-purple" style={{ left: "20%", animationDelay: "-1s" }} />
              <div className="confetti bg-green-400" style={{ left: "30%", animationDelay: "-0.5s" }} />
              <div className="confetti bg-yellow-300" style={{ left: "40%", animationDelay: "-2s" }} />
              <div className="confetti bg-[#28A0F0]" style={{ left: "50%", animationDelay: "-1.5s" }} />
              <div className="confetti bg-pink-400" style={{ left: "60%", animationDelay: "-3s" }} />
              <div className="confetti bg-stylus-purple" style={{ left: "70%", animationDelay: "-2.5s" }} />
              <div className="confetti bg-white" style={{ left: "80%", animationDelay: "-0.2s" }} />
              <div className="confetti bg-green-400" style={{ left: "90%", animationDelay: "-1.8s" }} />
            </div>

            {/* Title + close */}
            <div className="flex flex-wrap justify-between items-start gap-4">
              <p className="text-[#F0F0F0] tracking-tight text-2xl sm:text-[32px] font-bold leading-tight">Contract Deployed Successfully!</p>
              <Link href="/ide">
                <button className="flex items-center justify-center rounded-lg h-8 w-8 bg-white/5 text-[#A0AEC0] hover:bg-white/10 transition-colors" title="Back to IDE">
                  <span className="material-symbols-outlined text-xl">close</span>
                </button>
              </Link>
            </div>

            {/* Badge / Achievement */}
            <div className="mt-8 flex flex-col items-center justify-center text-center">
              <h3 className="text-stylus-purple tracking-wide text-2xl font-bold leading-tight">Achievement Unlocked!</h3>
              <div className="relative mt-4">
                <div className="animate-badge">
                  <div className="absolute -inset-2 bg-stylus-purple/20 blur-2xl rounded-full" />
                  <div className="relative w-32 h-32 bg-stylus-purple/10 rounded-full flex items-center justify-center p-2 border border-stylus-purple/20">
                    <div
                      className="w-full h-full bg-center bg-no-repeat bg-cover rounded-full"
                      style={{
                        backgroundImage:
                          "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBe9ZJ47CXb8b4jQlBq39Tqm4kZV_MmZ007cisIZABlNA3r9CaUX8gRMhZ-a300OqFGaSWTKTpDYIJ4CZ8EL3E5he4rqSa5_E6DFuD6fBnHgBzgTCj5Z22SU6cWhnUEnD1v4zKL-LGqKOH2vAR-d1ZAaXC7mIVj2LbTxVCDB7lvwWjtMNnzdoLa4p_Wdoji_hGdk-C9XLtlNiBTRtXHdhql9_lt7QCpyHvb20HNVfXpA44nkVZEA7QK8JWOdg_dEjAWQEHfSmFXOu0')",
                      }}
                    />
                  </div>
                </div>
                {/* Sparkles */}
                <div className="sparkle" style={{ top: "10%", left: "10%", animationDelay: "0s" }} />
                <div className="sparkle" style={{ top: "80%", left: "0%", animationDelay: "0.5s" }} />
                <div className="sparkle" style={{ top: "20%", right: "5%", animationDelay: "1s" }} />
                <div className="sparkle" style={{ bottom: "15%", right: "15%", animationDelay: "0.2s" }} />
              </div>
              <h2 className="text-[#F0F0F0] text-lg font-bold leading-tight tracking-[-0.015em] pt-4">First Deployment</h2>
              <p className="text-primary text-base font-medium leading-normal pt-1">+50 XP</p>
            </div>

            {/* Details */}
            <div className="mt-8 space-y-4">
              <div className="bg-black/20 rounded-lg p-4">
                <label className="text-sm font-medium text-[#A0AEC0] tracking-wider uppercase">Contract Address</label>
                <div className="flex items-center gap-4 mt-2">
                  <p className="font-mono text-base text-[#F0F0F0] truncate">{contractAddress}</p>
                  <button 
                    onClick={handleCopyAddress}
                    className="flex-shrink-0 flex items-center justify-center gap-1.5 rounded-md h-8 px-3 bg-white/10 text-[#A0AEC0] text-sm font-medium leading-normal hover:bg-white/20 transition-all duration-200 group"
                  >
                    <span className="material-symbols-outlined text-base transition-transform group-hover:scale-110">
                      {addressCopied ? 'check' : 'content_copy'}
                    </span>
                    <span>{addressCopied ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
              </div>
              <div className="bg-black/20 rounded-lg p-4">
                <label className="text-sm font-medium text-[#A0AEC0] tracking-wider uppercase">Transaction Hash</label>
                <div className="flex items-center gap-4 mt-2">
                  <p className="font-mono text-base text-[#F0F0F0] truncate">{txHash}</p>
                  <button 
                    onClick={handleViewExplorer}
                    className="flex-shrink-0 flex items-center justify-center gap-1.5 rounded-md h-8 px-3 bg-white/10 text-[#A0AEC0] text-sm font-medium leading-normal hover:bg-white/20 transition-all duration-200 group"
                  >
                    <span className="material-symbols-outlined text-base transition-transform group-hover:scale-110">open_in_new</span>
                    <span>Explorer</span>
                  </button>
                </div>
              </div>
              <div className="bg-green-500/10 border border-green-500/30 text-green-300 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-green-400">local_gas_station</span>
                  <p className="font-medium text-green-300">Gas Saved with Stylus</p>
                </div>
                <p className="font-bold text-lg text-green-300">~42%</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-white/10 bg-black/20 p-6 flex flex-col sm:flex-row gap-3 justify-end">
            <button 
              onClick={handleShareTwitter}
              className="flex w-full sm:w-auto cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-white/10 text-[#F0F0F0] text-sm font-medium leading-normal transition-all duration-300 hover:bg-white/20 hover:shadow-lg hover:shadow-white/10"
            >
              <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
              <span>Share on Twitter</span>
            </button>
            <Link href="/dashboard" className="w-full sm:w-auto">
              <button className="flex w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-white/10 text-[#F0F0F0] text-sm font-medium leading-normal transition-all duration-300 hover:bg-white/20">
                <span className="material-symbols-outlined text-base">dashboard</span>
                <span>Dashboard</span>
              </button>
            </Link>
            <Link href="/ide" className="w-full sm:w-auto">
              <button className="group relative flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-5 bg-gradient-to-r from-[#28A0F0] to-stylus-purple text-white text-sm font-bold leading-normal transition-all duration-300">
                <span className="absolute inset-0 bg-white/20 opacity=0 transition-opacity duration-300 group-hover:opacity-100 group-hover:scale-150" />
                <span className="relative z-10">Continue Coding</span>
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Page-scoped animations */}
      <style jsx>{`
        @keyframes confetti-fall {
          0% { transform: translateY(-100%) rotateZ(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotateZ(720deg); opacity: 0; }
        }
        @keyframes badge-zoom-in {
          0% { transform: scale(0.5); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes sparkle {
          0%, 100% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.2); opacity: 1; }
        }
        .confetti { position: absolute; width: 10px; height: 10px; animation: confetti-fall 5s linear infinite; }
        .animate-badge { animation: badge-zoom-in 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; }
        .sparkle { position: absolute; width: 12px; height: 12px; background-color: white; border-radius: 50%; animation: sparkle 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite; box-shadow: 0 0 8px 2px rgba(255, 255, 255, 0.7); }
      `}</style>
    </div>
  );
}
