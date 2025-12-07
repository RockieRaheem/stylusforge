'use client';

import { CheckCircle2, Lightbulb, Zap, Target, Award } from 'lucide-react';

interface KeyPointsProps {
  points: string[];
  variant?: 'default' | 'tips' | 'important' | 'goals';
  title?: string;
}

export default function KeyPoints({ points, variant = 'default', title }: KeyPointsProps) {
  const variants = {
    default: {
      icon: CheckCircle2,
      iconColor: 'text-[#3fb950]',
      bgColor: 'bg-[#238636]/10',
      borderColor: 'border-[#238636]/30',
      title: title || 'Key Points'
    },
    tips: {
      icon: Lightbulb,
      iconColor: 'text-[#d29922]',
      bgColor: 'bg-[#d29922]/10',
      borderColor: 'border-[#d29922]/30',
      title: title || 'Pro Tips'
    },
    important: {
      icon: Zap,
      iconColor: 'text-[#f85149]',
      bgColor: 'bg-[#f85149]/10',
      borderColor: 'border-[#f85149]/30',
      title: title || 'Important'
    },
    goals: {
      icon: Target,
      iconColor: 'text-[#58a6ff]',
      bgColor: 'bg-[#58a6ff]/10',
      borderColor: 'border-[#58a6ff]/30',
      title: title || 'Learning Goals'
    }
  };

  const config = variants[variant];
  const Icon = config.icon;

  return (
    <div className={`rounded-lg border ${config.borderColor} ${config.bgColor} p-5 my-6`}>
      <div className="flex items-center gap-2 mb-4">
        <Icon className={`h-5 w-5 ${config.iconColor}`} />
        <h4 className="text-white font-semibold text-sm uppercase tracking-wide">{config.title}</h4>
      </div>
      <ul className="space-y-3">
        {points.map((point, index) => (
          <li key={index} className="flex items-start gap-3 group">
            <div className={`mt-1 flex-shrink-0 w-5 h-5 rounded-full ${config.bgColor} border ${config.borderColor} flex items-center justify-center group-hover:scale-110 transition-transform`}>
              <div className={`w-2 h-2 rounded-full ${config.iconColor.replace('text-', 'bg-')}`} />
            </div>
            <span className="text-[#c9d1d9] leading-relaxed flex-1">{point}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
