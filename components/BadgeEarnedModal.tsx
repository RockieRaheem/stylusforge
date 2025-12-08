'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { X, Sparkles, Award, ArrowRight } from 'lucide-react';
import BadgeDisplay from './BadgeDisplay';
import Confetti from 'react-confetti';

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
}

export default function BadgeEarnedModal({ badge, onClose, points }: BadgeEarnedModalProps) {
  const router = useRouter();
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setShowConfetti(true);
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight
    });
    
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

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
