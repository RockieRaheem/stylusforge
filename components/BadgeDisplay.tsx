'use client';

import { useEffect, useState } from 'react';
import { Trophy, Star, Zap, Target, Award, Crown, Flame, Rocket } from 'lucide-react';

interface BadgeProps {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  earnedAt?: Date;
  size?: 'sm' | 'md' | 'lg';
  showAnimation?: boolean;
}

const iconMap: { [key: string]: any } = {
  trophy: Trophy,
  star: Star,
  zap: Zap,
  target: Target,
  award: Award,
  crown: Crown,
  flame: Flame,
  rocket: Rocket
};

export default function BadgeDisplay({ 
  id, 
  name, 
  description, 
  icon, 
  color, 
  earnedAt,
  size = 'md',
  showAnimation = false
}: BadgeProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const IconComponent = iconMap[icon] || Trophy;

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24'
  };

  const iconSizes = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  useEffect(() => {
    if (showAnimation) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showAnimation]);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="group relative">
      <div 
        className={`
          ${sizeClasses[size]} 
          rounded-full 
          flex items-center justify-center 
          transition-all duration-300
          ${earnedAt ? 'opacity-100' : 'opacity-30 grayscale'}
          ${isAnimating ? 'animate-bounce scale-110' : 'group-hover:scale-110'}
        `}
        style={{
          background: earnedAt 
            ? `linear-gradient(135deg, ${color}40 0%, ${color}80 100%)`
            : 'linear-gradient(135deg, #30363d 0%, #21262d 100%)',
          boxShadow: earnedAt 
            ? `0 0 20px ${color}40, inset 0 0 10px ${color}20`
            : 'none'
        }}
      >
        <IconComponent 
          className={`${iconSizes[size]} transition-all duration-300`}
          style={{ 
            color: earnedAt ? color : '#8b949e',
            filter: earnedAt ? 'drop-shadow(0 0 8px currentColor)' : 'none'
          }}
        />
        
        {isAnimating && (
          <>
            <div className="absolute inset-0 rounded-full animate-ping" 
              style={{ backgroundColor: `${color}40` }} 
            />
            <div className="absolute -inset-4 rounded-full animate-pulse" 
              style={{ 
                background: `radial-gradient(circle, ${color}20 0%, transparent 70%)` 
              }} 
            />
          </>
        )}
      </div>

      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-[#161b22] border border-[#30363d] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 w-48 text-center">
        <p className="text-white text-sm font-semibold mb-1">{name}</p>
        <p className="text-[#8b949e] text-xs mb-1">{description}</p>
        {earnedAt && (
          <p className="text-[#58a6ff] text-xs">
            Earned {formatDate(earnedAt)}
          </p>
        )}
        {!earnedAt && (
          <p className="text-[#8b949e] text-xs italic">Not yet earned</p>
        )}
      </div>
    </div>
  );
}
