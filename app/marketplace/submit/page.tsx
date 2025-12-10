'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Code2, Github, ExternalLink, Video, Upload, Sparkles } from 'lucide-react';

export default function SubmitProjectPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    authorName: '',
    authorAvatar: '',
    thumbnail: '',
    category: 'defi' as 'defi' | 'nft' | 'gaming' | 'dao' | 'infrastructure' | 'other',
    tags: '',
    githubUrl: '',
    demoUrl: '',
    pitchVideo: '',
    demoVideo: '',
    gasOptimization: '',
    pricingType: 'free' as 'free' | 'paid' | 'freemium',
    price: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { value: 'defi', label: 'DeFi', icon: '💰' },
    { value: 'nft', label: 'NFT', icon: '🎨' },
    { value: 'gaming', label: 'Gaming', icon: '🎮' },
    { value: 'dao', label: 'DAO', icon: '🗳️' },
    { value: 'infrastructure', label: 'Infrastructure', icon: '🏗️' },
    { value: 'other', label: 'Other', icon: '🔧' }
  ];

  const emojiSuggestions = ['🚀', '💎', '⚡', '🔥', '🌟', '🎯', '💰', '🎨', '🎮', '🔄', '🌉', '⚖️', '🗳️', '🏗️'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create new project object matching the marketplace interface
      const newProject = {
        id: Date.now(),
        title: formData.title,
        description: formData.description,
        author: {
          name: formData.authorName || 'Anonymous',
          avatar: formData.authorAvatar || '👤',
          verified: false
        },
        thumbnail: formData.thumbnail || '📦',
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        category: formData.category,
        stats: {
          views: 0,
          stars: 0,
          forks: 0,
          downloads: 0
        },
        gasOptimization: parseInt(formData.gasOptimization) || 0,
        deployments: 0,
        lastUpdated: new Date().toISOString().split('T')[0],
        featured: false,
        verified: false,
        pricing: {
          type: formData.pricingType,
          price: formData.pricingType === 'free' ? undefined : parseFloat(formData.price) || undefined
        },
        pitchVideo: formData.pitchVideo || undefined,
        demoVideo: formData.demoVideo || undefined,
        githubUrl: formData.githubUrl || undefined,
        liveUrl: formData.demoUrl || undefined
      };

      // Get existing projects from localStorage
      const existingProjects = JSON.parse(localStorage.getItem('userProjects') || '[]');
      
      // Add new project
      existingProjects.push(newProject);
      
      // Save back to localStorage
      localStorage.setItem('userProjects', JSON.stringify(existingProjects));

      // Show success message
      alert('🎉 Project submitted successfully! Your project is now live on the marketplace.');
      
      // Redirect to marketplace
      router.push('/marketplace');
    } catch (error) {
      console.error('Error submitting project:', error);
      alert('❌ Error submitting project. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-800/50 bg-slate-950/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/marketplace" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
              <span>←</span>
              <span>Back to Marketplace</span>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 text-primary">
                <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path d="M42.1739 20.1739L27.8261 5.82609C29.1366 7.13663 28.3989 10.1876 26.2002 13.7654C24.8538 15.9564 22.9595 18.3449 20.6522 20.6522C18.3449 22.9595 15.9564 24.8538 13.7654 26.2002C10.1876 28.3989 7.13663 29.1366 5.82609 27.8261L20.1739 42.1739C21.4845 43.4845 24.5355 42.7467 28.1133 40.548C30.3042 39.2016 32.6927 37.3073 35 35C37.3073 32.6927 39.2016 30.3042 40.548 28.1133C42.7467 24.5355 43.4845 21.4845 42.1739 20.1739Z" fill="currentColor"/>
                </svg>
              </div>
              <span className="text-xl font-bold">StylusForge</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-primary text-sm font-semibold">Submit Your Project</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400">
            Share Your Innovation
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Showcase your Arbitrum Stylus project to the community. Get visibility, stars, and collaborators.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <section className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Code2 className="w-6 h-6 text-primary" />
              Basic Information
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Project Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="e.g., Ultra-Efficient DEX Router"
                  className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-800 text-white focus:border-primary focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description *</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe your project, its features, and what makes it unique. Explain the problem it solves and the benefits of using Stylus."
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-800 text-white focus:border-primary focus:outline-none transition-colors resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">Write a compelling description that showcases your project's value proposition.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Category *</label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value as any})}
                    className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-800 text-white focus:border-primary focus:outline-none transition-colors"
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.icon} {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Tags *</label>
                  <input
                    type="text"
                    required
                    value={formData.tags}
                    onChange={(e) => setFormData({...formData, tags: e.target.value})}
                    placeholder="DeFi, DEX, AMM, Liquidity"
                    className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-800 text-white focus:border-primary focus:outline-none transition-colors"
                  />
                  <p className="text-xs text-gray-500 mt-1">Separate tags with commas</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Gas Optimization (%) *</label>
                <input
                  type="number"
                  required
                  min="0"
                  max="99"
                  value={formData.gasOptimization}
                  onChange={(e) => setFormData({...formData, gasOptimization: e.target.value})}
                  placeholder="e.g., 95"
                  className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-800 text-white focus:border-primary focus:outline-none transition-colors"
                />
                <p className="text-xs text-gray-500 mt-1">How much gas does your Stylus implementation save compared to Solidity?</p>
              </div>
            </div>
          </section>

          {/* Author & Visual */}
          <section className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Upload className="w-6 h-6 text-secondary" />
              Author & Visual Identity
            </h2>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.authorName}
                    onChange={(e) => setFormData({...formData, authorName: e.target.value})}
                    placeholder="e.g., Alex Chen"
                    className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-800 text-white focus:border-primary focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Author Avatar (Emoji)</label>
                  <input
                    type="text"
                    value={formData.authorAvatar}
                    onChange={(e) => setFormData({...formData, authorAvatar: e.target.value})}
                    placeholder="👨‍💻"
                    className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-800 text-white focus:border-primary focus:outline-none transition-colors text-center text-2xl"
                    maxLength={2}
                  />
                  <p className="text-xs text-gray-500 mt-1">Single emoji representing you</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Project Thumbnail (Emoji) *</label>
                <input
                  type="text"
                  required
                  value={formData.thumbnail}
                  onChange={(e) => setFormData({...formData, thumbnail: e.target.value})}
                  placeholder="🚀"
                  className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-800 text-white focus:border-primary focus:outline-none transition-colors text-center text-4xl"
                  maxLength={2}
                />
                <div className="flex flex-wrap gap-2 mt-3">
                  <p className="text-xs text-gray-500 w-full mb-2">Popular choices:</p>
                  {emojiSuggestions.map(emoji => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setFormData({...formData, thumbnail: emoji})}
                      className="w-10 h-10 rounded-lg bg-slate-950 border border-slate-800 hover:border-primary transition-colors text-xl"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Project Links */}
          <section className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <ExternalLink className="w-6 h-6 text-blue-400" />
              Project Links
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">GitHub Repository</label>
                <div className="relative">
                  <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="url"
                    value={formData.githubUrl}
                    onChange={(e) => setFormData({...formData, githubUrl: e.target.value})}
                    placeholder="https://github.com/username/project"
                    className="w-full pl-11 pr-4 py-3 rounded-lg bg-slate-950 border border-slate-800 text-white focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Live Demo / Website</label>
                <div className="relative">
                  <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="url"
                    value={formData.demoUrl}
                    onChange={(e) => setFormData({...formData, demoUrl: e.target.value})}
                    placeholder="https://demo.yourproject.com"
                    className="w-full pl-11 pr-4 py-3 rounded-lg bg-slate-950 border border-slate-800 text-white focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Video Links */}
          <section className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Video className="w-6 h-6 text-purple-400" />
              Video Content
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Pitch Video URL</label>
                <input
                  type="url"
                  value={formData.pitchVideo}
                  onChange={(e) => setFormData({...formData, pitchVideo: e.target.value})}
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-800 text-white focus:border-primary focus:outline-none transition-colors"
                />
                <p className="text-xs text-gray-500 mt-1">YouTube, Vimeo, or Loom link for your project pitch</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Demo Video URL</label>
                <input
                  type="url"
                  value={formData.demoVideo}
                  onChange={(e) => setFormData({...formData, demoVideo: e.target.value})}
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-800 text-white focus:border-primary focus:outline-none transition-colors"
                />
                <p className="text-xs text-gray-500 mt-1">Technical walkthrough or product demo</p>
              </div>

              <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
                <div className="flex items-start gap-3">
                  <Video className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-300">
                      <strong>Pro Tip:</strong> Projects with pitch and demo videos get 3x more engagement! 
                      Upload your videos to YouTube or Vimeo and paste the links here.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Pricing */}
          <section className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="text-2xl">💰</span>
              Pricing
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Pricing Model *</label>
                <select
                  required
                  value={formData.pricingType}
                  onChange={(e) => setFormData({...formData, pricingType: e.target.value as any})}
                  className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-800 text-white focus:border-primary focus:outline-none transition-colors"
                >
                  <option value="free">Free (Open Source)</option>
                  <option value="paid">Paid (One-time)</option>
                  <option value="freemium">Freemium (Free + Premium)</option>
                </select>
              </div>

              {(formData.pricingType === 'paid' || formData.pricingType === 'freemium') && (
                <div>
                  <label className="block text-sm font-medium mb-2">Price (USD) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    placeholder="99.00"
                    className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-800 text-white focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
              )}
            </div>
          </section>

          {/* Submit Button */}
          <div className="flex gap-4">
            <Link href="/marketplace" className="flex-1">
              <button
                type="button"
                className="w-full px-6 py-4 rounded-xl bg-slate-900/50 hover:bg-slate-800 border border-slate-800 font-semibold transition-all"
              >
                Cancel
              </button>
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-4 rounded-xl bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-bold text-lg"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Project'}
            </button>
          </div>

          <p className="text-center text-sm text-gray-500">
            Your project will be immediately visible on the marketplace. Make sure all information is accurate.
          </p>
        </form>
      </main>
    </div>
  );
}
