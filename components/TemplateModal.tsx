'use client';

import { useState } from 'react';
import { codeTemplates, CodeTemplate } from '@/lib/data/code-templates';
import { X, Code2, Zap, BookOpen, Lock, TrendingUp, Image, Wallet } from 'lucide-react';

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (template: CodeTemplate) => void;
}

const categoryIcons: Record<string, any> = {
  basic: BookOpen,
  defi: TrendingUp,
  nft: Image,
  advanced: Lock,
};

const difficultyColors: Record<string, string> = {
  beginner: 'bg-green-500/20 text-green-400 border-green-500/30',
  intermediate: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  advanced: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const iconMap: Record<string, any> = {
  '123': () => (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
    </svg>
  ),
  'token': Wallet,
  'image': Image,
  'lock': Lock,
  'trending_up': TrendingUp,
};

export default function TemplateModal({ isOpen, onClose, onSelect }: TemplateModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredTemplates = selectedCategory === 'all' 
    ? codeTemplates 
    : codeTemplates.filter(t => t.category === selectedCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-6xl max-h-[90vh] bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-slate-900/50">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Code Templates</h2>
            <p className="text-gray-400 text-sm">Start with production-ready Stylus contracts</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 p-4 border-b border-white/10 bg-slate-900/30 overflow-x-auto">
          {[
            { id: 'all', label: 'All Templates', icon: Code2 },
            { id: 'basic', label: 'Basic', icon: BookOpen },
            { id: 'defi', label: 'DeFi', icon: TrendingUp },
            { id: 'nft', label: 'NFT', icon: Image },
            { id: 'advanced', label: 'Advanced', icon: Lock },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setSelectedCategory(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${
                selectedCategory === id
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map((template) => {
              const IconComponent = iconMap[template.icon] || Code2;
              const CategoryIcon = categoryIcons[template.category];
              
              return (
                <button
                  key={template.id}
                  onClick={() => {
                    onSelect(template);
                    onClose();
                  }}
                  onMouseEnter={() => setHoveredTemplate(template.id)}
                  onMouseLeave={() => setHoveredTemplate(null)}
                  className="group relative flex flex-col p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl border border-white/10 hover:border-blue-500/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/10 text-left"
                >
                  {/* Icon & Category Badge */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 text-blue-400 group-hover:scale-110 transition-transform">
                      {typeof IconComponent === 'function' ? <IconComponent /> : <IconComponent className="w-8 h-8" />}
                    </div>
                    <div className="flex items-center gap-1 text-gray-400">
                      <CategoryIcon className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Template Info */}
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                    {template.name}
                  </h3>
                  <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                    {template.description}
                  </p>

                  {/* Features */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {template.features.slice(0, 3).map((feature, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-xs text-gray-400"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10">
                    <div className={`px-2 py-1 rounded text-xs font-medium border ${difficultyColors[template.difficulty]}`}>
                      {template.difficulty}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                      <Zap className="w-3.5 h-3.5 text-green-400" />
                      {template.gasEstimate}
                    </div>
                  </div>

                  {/* Hover Overlay */}
                  {hoveredTemplate === template.id && (
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 to-transparent rounded-xl pointer-events-none" />
                  )}
                </button>
              );
            })}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Code2 className="w-16 h-16 text-gray-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No templates found</h3>
              <p className="text-gray-500">Try selecting a different category</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-white/10 bg-slate-900/50">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Code2 className="w-4 h-4" />
            <span>{filteredTemplates.length} templates available</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
