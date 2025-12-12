'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { X, Sparkles, Award, ArrowRight, ExternalLink } from 'lucide-react';
import BadgeDisplay from './BadgeDisplay';
import Confetti from 'react-confetti';
import { nftService } from '@/lib/services/nft.service';

interface BadgeEarnedModalProps {
  badge: {
    id: string;
    name: string;
    description: string;
    icon: string;
    color: string;
  };
  onClose: () => void;
  points?: number;
  userAddress?: string;
  enableNFTMinting?: boolean;
}

export default function BadgeEarnedModal({ 
  badge, 
  onClose, 
  points, 
  userAddress,
  enableNFTMinting = true 
}: BadgeEarnedModalProps) {
  const router = useRouter();
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [mounted, setMounted] = useState(false);
  const [isMintingNFT, setIsMintingNFT] = useState(false);
  const [nftMinted, setNftMinted] = useState(false);
  const [nftError, setNftError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [showNFTOption, setShowNFTOption] = useState(false);

  useEffect(() => {
    setMounted(true);
    setShowConfetti(true);
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight
    });
    
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    
    // Check if NFT minting is available
    const checkNFTAvailability = async () => {
      if (enableNFTMinting && userAddress) {
        const isDeployed = await nftService.isContractDeployed();
        setShowNFTOption(isDeployed);
      }
    };
    checkNFTAvailability();
    
    return () => clearTimeout(timer);
  }, [enableNFTMinting, userAddress]);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleGoToTutorials = () => {
    onClose();
    router.push('/tutorial');
  };

  const handleGoToDashboard = () => {
    onClose();
    router.push('/dashboard');
  };

  const handleGoToBadges = () => {
    onClose();
    router.push('/badges');
  };

  const handleMintNFT = async () => {
    if (!userAddress) {
      setNftError('Please connect your wallet first');
      return;
    }

    setIsMintingNFT(true);
    setNftError(null);

    try {
      const result = await nftService.mintBadge(userAddress, badge.id);
      setNftMinted(true);
      setTxHash(result.transactionHash || null);
      console.log('NFT minted successfully:', result);
    } catch (error: any) {
      console.error('Error minting NFT:', error);
      setNftError(error.message || 'Failed to mint NFT');
    } finally {
      setIsMintingNFT(false);
    }
  };

  if (!mounted) return null;

  const modalContent = (
    <>
      {console.log('🎨 BadgeEarnedModal RENDERING')}
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={200}
          gravity={0.3}
        />
      )}
      
      <div 
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999 }}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div className="relative w-full max-w-md mx-4">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute -top-12 right-0 p-2 text-white/60 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Modal content */}
          <div className="relative bg-gradient-to-br from-[#161b22] to-[#0d1117] border-2 rounded-2xl p-8 shadow-2xl animate-in zoom-in duration-300"
            style={{ borderColor: badge.color }}
          >
            {/* Glow effect */}
            <div 
              className="absolute inset-0 rounded-2xl blur-xl opacity-30 -z-10"
              style={{ backgroundColor: badge.color }}
            />

            {/* Sparkle effects */}
            <div className="absolute top-4 left-4 animate-pulse">
              <Sparkles className="h-6 w-6 text-yellow-400" />
            </div>
            <div className="absolute bottom-4 right-4 animate-pulse delay-75">
              <Sparkles className="h-5 w-5 text-yellow-300" />
            </div>

            {/* Content */}
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">
                🎉 Achievement Unlocked!
              </h2>
              <p className="text-[#8b949e] text-sm mb-6">
                You've earned a new badge
              </p>

              {/* Badge display */}
              <div className="flex justify-center mb-6">
                <BadgeDisplay
                  {...badge}
                  earnedAt={new Date()}
                  size="lg"
                  showAnimation={true}
                />
              </div>

              {/* Badge details */}
              <h3 className="text-xl font-bold text-white mb-2">{badge.name}</h3>
              <p className="text-[#8b949e] text-sm mb-6">{badge.description}</p>

              {/* Points earned */}
              {points && (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#238636]/20 border border-[#238636] rounded-full mb-6">
                  <Sparkles className="h-4 w-4 text-[#3fb950]" />
                  <span className="text-[#3fb950] font-semibold">+{points} Points</span>
                </div>
              )}

              {/* NFT Minting Section */}
              {showNFTOption && !nftMinted && (
                <div className="mb-6 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg">
                  <div className="flex items-start gap-3 mb-3">
                    <Sparkles className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                    <div className="text-left">
                      <h4 className="text-white font-semibold text-sm mb-1">
                        Claim as NFT Badge
                      </h4>
                      <p className="text-[#8b949e] text-xs">
                        Mint this achievement as an on-chain NFT on Arbitrum Sepolia
                      </p>
                    </div>
                  </div>
                  
                  {nftError && (
                    <div className="mb-3 p-2 bg-red-500/10 border border-red-500/30 rounded text-red-400 text-xs">
                      {nftError}
                    </div>
                  )}

                  <button
                    onClick={handleMintNFT}
                    disabled={isMintingNFT}
                    className="w-full px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg font-medium text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isMintingNFT ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Minting NFT...
                      </>
                    ) : (
                      <>
                        <Award className="w-4 h-4" />
                        Mint NFT Badge
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* NFT Minted Success */}
              {nftMinted && (
                <div className="mb-6 p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-lg">
                  <div className="flex items-start gap-3 mb-3">
                    <Award className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <div className="text-left flex-1">
                      <h4 className="text-white font-semibold text-sm mb-1">
                        🎉 NFT Badge Minted!
                      </h4>
                      <p className="text-[#8b949e] text-xs mb-2">
                        Your achievement is now permanently on the Arbitrum blockchain
                      </p>
                      {txHash && (
                        <a
                          href={`https://sepolia.arbiscan.io/tx/${txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          View on Arbiscan
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleGoToBadges}
                  className="w-full px-6 py-3 rounded-lg font-semibold text-white transition-all hover:scale-105 flex items-center justify-center gap-2"
                  style={{
                    background: `linear-gradient(135deg, ${badge.color} 0%, ${badge.color}dd 100%)`
                  }}
                >
                  <Award className="h-4 w-4" />
                  View All Badges
                </button>
                <div className="flex gap-3">
                  <button
                    onClick={handleGoToDashboard}
                    className="flex-1 px-6 py-2.5 rounded-lg font-medium text-white bg-[#21262d] hover:bg-[#30363d] transition-all flex items-center justify-center gap-2 text-sm"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={handleGoToTutorials}
                    className="flex-1 px-6 py-2.5 rounded-lg font-medium text-white bg-[#21262d] hover:bg-[#30363d] transition-all flex items-center justify-center gap-2 text-sm"
                  >
                    Next Tutorial
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  // Render directly without portal for now
  return modalContent;
}
