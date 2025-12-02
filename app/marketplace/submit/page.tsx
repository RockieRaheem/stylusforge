'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SubmitProjectPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    tagline: '',
    description: '',
    category: 'DeFi',
    tags: '',
    fundingGoal: '',
    duration: '30',
    githubUrl: '',
    demoUrl: '',
    contractAddress: '',
    teamSize: '1',
    lookingFor: [] as string[],
  });

  const categories = ['DeFi', 'NFT', 'Gaming', 'DAO', 'Infrastructure', 'Social'];
  const collaborationTypes = [
    'Funding',
    'Developers',
    'Designers',
    'Marketing',
    'Advisors',
    'Beta Testers'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would integrate with your backend/blockchain
    console.log('Project submitted:', formData);
    alert('Project submitted successfully! (Demo - would integrate with blockchain)');
    router.push('/marketplace');
  };

  const handleCheckboxChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      lookingFor: prev.lookingFor.includes(value)
        ? prev.lookingFor.filter(item => item !== value)
        : [...prev.lookingFor, value]
    }));
  };

  return (
    <div className="relative w-full min-h-screen bg-[#0d1117] text-white">
      {/* Background Effects */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-20"></div>
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl opacity-20"></div>

      {/* Header */}
      <header className="border-b border-[#21262d] bg-[#0d1117]/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/marketplace" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
              <span className="material-symbols-outlined">arrow_back</span>
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
            <span className="material-symbols-outlined text-primary !text-xl">campaign</span>
            <span className="text-primary text-sm font-semibold">Submit Your Project</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400">
            Share Your Vision
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Get your Stylus project in front of the community. Find backers, collaborators, and supporters.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <section className="p-8 rounded-2xl bg-white/5 border border-white/10">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">info</span>
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
                  placeholder="e.g., DexSwap Protocol"
                  className="w-full px-4 py-3 rounded-lg bg-[#0d1117] border border-[#30363d] text-white focus:border-primary focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tagline *</label>
                <input
                  type="text"
                  required
                  value={formData.tagline}
                  onChange={(e) => setFormData({...formData, tagline: e.target.value})}
                  placeholder="A one-sentence description of your project"
                  className="w-full px-4 py-3 rounded-lg bg-[#0d1117] border border-[#30363d] text-white focus:border-primary focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Detailed Description *</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Explain your project in detail. What problem does it solve? What makes it unique?"
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg bg-[#0d1117] border border-[#30363d] text-white focus:border-primary focus:outline-none transition-colors resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Category *</label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg bg-[#0d1117] border border-[#30363d] text-white focus:border-primary focus:outline-none transition-colors"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Tags</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({...formData, tags: e.target.value})}
                    placeholder="e.g., DEX, AMM, Liquidity"
                    className="w-full px-4 py-3 rounded-lg bg-[#0d1117] border border-[#30363d] text-white focus:border-primary focus:outline-none transition-colors"
                  />
                  <p className="text-xs text-gray-500 mt-1">Separate with commas</p>
                </div>
              </div>
            </div>
          </section>

          {/* Funding Details */}
          <section className="p-8 rounded-2xl bg-white/5 border border-white/10">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="material-symbols-outlined text-green-400">payments</span>
              Funding Details
            </h2>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Funding Goal (USD) *</label>
                  <input
                    type="number"
                    required
                    min="100"
                    value={formData.fundingGoal}
                    onChange={(e) => setFormData({...formData, fundingGoal: e.target.value})}
                    placeholder="50000"
                    className="w-full px-4 py-3 rounded-lg bg-[#0d1117] border border-[#30363d] text-white focus:border-primary focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Campaign Duration (days) *</label>
                  <select
                    required
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg bg-[#0d1117] border border-[#30363d] text-white focus:border-primary focus:outline-none transition-colors"
                  >
                    <option value="15">15 days</option>
                    <option value="30">30 days</option>
                    <option value="45">45 days</option>
                    <option value="60">60 days</option>
                  </select>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary mt-0.5">info</span>
                  <div>
                    <p className="text-sm text-gray-300">
                      Funds will be held in a smart contract on Arbitrum and released based on milestone completion. 
                      A 5% platform fee applies to successfully funded projects.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Project Links */}
          <section className="p-8 rounded-2xl bg-white/5 border border-white/10">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="material-symbols-outlined text-secondary">link</span>
              Project Links
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">GitHub Repository</label>
                <input
                  type="url"
                  value={formData.githubUrl}
                  onChange={(e) => setFormData({...formData, githubUrl: e.target.value})}
                  placeholder="https://github.com/username/project"
                  className="w-full px-4 py-3 rounded-lg bg-[#0d1117] border border-[#30363d] text-white focus:border-primary focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Live Demo / Website</label>
                <input
                  type="url"
                  value={formData.demoUrl}
                  onChange={(e) => setFormData({...formData, demoUrl: e.target.value})}
                  placeholder="https://demo.yourproject.com"
                  className="w-full px-4 py-3 rounded-lg bg-[#0d1117] border border-[#30363d] text-white focus:border-primary focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Contract Address (if deployed)</label>
                <input
                  type="text"
                  value={formData.contractAddress}
                  onChange={(e) => setFormData({...formData, contractAddress: e.target.value})}
                  placeholder="0x..."
                  className="w-full px-4 py-3 rounded-lg bg-[#0d1117] border border-[#30363d] text-white focus:border-primary focus:outline-none transition-colors font-mono"
                />
              </div>
            </div>
          </section>

          {/* Team & Collaboration */}
          <section className="p-8 rounded-2xl bg-white/5 border border-white/10">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="material-symbols-outlined text-yellow-400">group</span>
              Team & Collaboration
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Current Team Size</label>
                <select
                  value={formData.teamSize}
                  onChange={(e) => setFormData({...formData, teamSize: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg bg-[#0d1117] border border-[#30363d] text-white focus:border-primary focus:outline-none transition-colors"
                >
                  <option value="1">Solo (1 person)</option>
                  <option value="2-5">Small Team (2-5 people)</option>
                  <option value="6-10">Medium Team (6-10 people)</option>
                  <option value="10+">Large Team (10+ people)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-3">What are you looking for?</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {collaborationTypes.map(type => (
                    <label
                      key={type}
                      className="flex items-center gap-3 p-3 rounded-lg bg-[#0d1117] border border-[#30363d] hover:border-primary/50 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={formData.lookingFor.includes(type)}
                        onChange={() => handleCheckboxChange(type)}
                        className="w-4 h-4 rounded border-[#30363d] bg-[#0d1117] text-primary focus:ring-primary focus:ring-offset-0"
                      />
                      <span className="text-sm">{type}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Submit Button */}
          <div className="flex gap-4">
            <Link href="/marketplace" className="flex-1">
              <button
                type="button"
                className="w-full px-6 py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 font-semibold transition-all"
              >
                Cancel
              </button>
            </Link>
            <button
              type="submit"
              className="flex-1 px-6 py-4 rounded-xl bg-gradient-to-r from-primary to-secondary hover:shadow-glow-cta hover:scale-105 transition-all font-bold text-lg"
            >
              Submit Project
            </button>
          </div>

          <p className="text-center text-sm text-gray-500">
            By submitting, you agree to our terms of service and community guidelines.
          </p>
        </form>
      </main>
    </div>
  );
}
