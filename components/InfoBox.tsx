'use client';

import { Info, AlertTriangle, Lightbulb, Sparkles, CheckCircle } from 'lucide-react';

interface InfoBoxProps {
  children: React.ReactNode;
  type?: 'info' | 'warning' | 'tip' | 'success' | 'highlight';
  title?: string;
}

export default function InfoBox({ children, type = 'info', title }: InfoBoxProps) {
  const configs = {
    info: {
      icon: Info,
      iconColor: 'text-[#58a6ff]',
      bgColor: 'bg-[#388bfd]/10',
      borderColor: 'border-[#388bfd]/30',
      titleColor: 'text-[#58a6ff]',
      defaultTitle: 'Information'
    },
    warning: {
      icon: AlertTriangle,
      iconColor: 'text-[#d29922]',
      bgColor: 'bg-[#d29922]/10',
      borderColor: 'border-[#d29922]/30',
      titleColor: 'text-[#d29922]',
      defaultTitle: 'Important'
    },
    tip: {
      icon: Lightbulb,
      iconColor: 'text-[#a371f7]',
      bgColor: 'bg-[#a371f7]/10',
      borderColor: 'border-[#a371f7]/30',
      titleColor: 'text-[#a371f7]',
      defaultTitle: 'Pro Tip'
    },
    success: {
      icon: CheckCircle,
      iconColor: 'text-[#3fb950]',
      bgColor: 'bg-[#3fb950]/10',
      borderColor: 'border-[#3fb950]/30',
      titleColor: 'text-[#3fb950]',
      defaultTitle: 'Success'
    },
    highlight: {
      icon: Sparkles,
      iconColor: 'text-[#d29922]',
      bgColor: 'bg-gradient-to-r from-[#d29922]/10 to-[#f85149]/10',
      borderColor: 'border-[#d29922]/30',
      titleColor: 'text-[#d29922]',
      defaultTitle: 'Highlight'
    }
  };

  const config = configs[type];
  const Icon = config.icon;

  return (
    <div className={`rounded-lg border ${config.borderColor} ${config.bgColor} p-4 my-4 backdrop-blur-sm`}>
      <div className="flex items-start gap-3">
        <div className={`flex-shrink-0 ${config.iconColor} mt-0.5`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          {(title || config.defaultTitle) && (
            <h5 className={`font-semibold ${config.titleColor} mb-2 text-sm`}>
              {title || config.defaultTitle}
            </h5>
          )}
          <div className="text-[#c9d1d9] text-sm leading-relaxed">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
