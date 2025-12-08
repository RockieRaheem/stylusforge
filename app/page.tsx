'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import UserMenu from '@/components/UserMenu';
import GasComparison from '@/components/GasComparison';
import { Sparkles, Zap, Shield, Code2, Rocket, Github, Twitter, Mail, ExternalLink, Play, CheckCircle2, TrendingUp } from 'lucide-react';

export default function HomePage() {
  const [statsAnimated, setStatsAnimated] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    setStatsAnimated(true);
    const interval = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { value: '10,000+', label: 'Lines of Code Deployed', icon: Code2 },
    { value: '$50,000+', label: 'Gas Saved', icon: TrendingUp },
    { value: '500+', label: 'Developers', icon: Sparkles },
    { value: '96%', label: 'Gas Reduction', icon: Zap },
  ];

  const testimonials = [
    {
      name: 'Alex Chen',
      role: 'Senior Blockchain Developer',
      company: 'DeFi Protocol',
      image: '👨‍💻',
      quote: 'StylusForge cut our deployment costs by 95%. The gas savings alone paid for months of development.',
    },
    {
      name: 'Sarah Johnson',
      role: 'Smart Contract Engineer',
      company: 'NFT Marketplace',
      image: '👩‍💻',
      quote: 'The browser-based IDE is incredible. I went from idea to deployed contract in under 10 minutes.',
    },
    {
      name: 'Michael Park',
      role: 'Tech Lead',
      company: 'Web3 Startup',
      image: '👨‍🔬',
      quote: 'Finally, an IDE that understands Stylus. The templates and tutorials made onboarding our team effortless.',
    },
  ];

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center overflow-x-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 z-10 relative">
        {/* Enhanced TopNavBar */}
        <header className="flex items-center justify-between py-6 backdrop-blur-sm border-b border-white/10">
          <div className="flex items-center gap-4 text-white">
            <div className="size-10 text-blue-400">
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_6_543)">
                  <path d="M42.1739 20.1739L27.8261 5.82609C29.1366 7.13663 28.3989 10.1876 26.2002 13.7654C24.8538 15.9564 22.9595 18.3449 20.6522 20.6522C18.3449 22.9595 15.9564 24.8538 13.7654 26.2002C10.1876 28.3989 7.13663 29.1366 5.82609 27.8261L20.1739 42.1739C21.4845 43.4845 24.5355 42.7467 28.1133 40.548C30.3042 39.2016 32.6927 37.3073 35 35C37.3073 32.6927 39.2016 30.3042 40.548 28.1133C42.7467 24.5355 43.4845 21.4845 42.1739 20.1739Z" fill="currentColor"/>
                  <path clipRule="evenodd" d="M7.24189 26.4066C7.31369 26.4411 7.64204 26.5637 8.52504 26.3738C9.59462 26.1438 11.0343 25.5311 12.7183 24.4963C14.7583 23.2426 17.0256 21.4503 19.238 19.238C21.4503 17.0256 23.2426 14.7583 24.4963 12.7183C25.5311 11.0343 26.1438 9.59463 26.3738 8.52504C26.5637 7.64204 26.4411 7.31369 26.4066 7.24189C26.345 7.21246 26.143 7.14535 25.6664 7.1918C24.9745 7.25925 23.9954 7.5498 22.7699 8.14278C20.3369 9.32007 17.3369 11.4915 14.4142 14.4142C11.4915 17.3369 9.32007 20.3369 8.14278 22.7699C7.5498 23.9954 7.25925 24.9745 7.1918 25.6664C7.14534 26.143 7.21246 26.345 7.24189 26.4066ZM29.9001 10.7285C29.4519 12.0322 28.7617 13.4172 27.9042 14.8126C26.465 17.1544 24.4686 19.6641 22.0664 22.0664C19.6641 24.4686 17.1544 26.465 14.8126 27.9042C13.4172 28.7617 12.0322 29.4519 10.7285 29.9001L21.5754 40.747C21.6001 40.7606 21.8995 40.931 22.8729 40.7217C23.9424 40.4916 25.3821 39.879 27.0661 38.8441C29.1062 37.5904 31.3734 35.7982 33.5858 33.5858C35.7982 31.3734 37.5904 29.1062 38.8441 27.0661C39.879 25.3821 40.4916 23.9425 40.7216 22.8729C40.931 21.8995 40.7606 21.6001 40.747 21.5754L29.9001 10.7285ZM29.2403 4.41187L43.5881 18.7597C44.9757 20.1473 44.9743 22.1235 44.6322 23.7139C44.2714 25.3919 43.4158 27.2666 42.252 29.1604C40.8128 31.5022 38.8165 34.012 36.4142 36.4142C34.012 38.8165 31.5022 40.8128 29.1604 42.252C27.2666 43.4158 25.3919 44.2714 23.7139 44.6322C22.1235 44.9743 20.1473 44.9757 18.7597 43.5881L4.41187 29.2403C3.29027 28.1187 3.08209 26.5973 3.21067 25.2783C3.34099 23.9415 3.8369 22.4852 4.54214 21.0277C5.96129 18.0948 8.43335 14.7382 11.5858 11.5858C14.7382 8.43335 18.0948 5.9613 21.0277 4.54214C22.4852 3.8369 23.9415 3.34099 25.2783 3.21067C26.5973 3.08209 28.1187 3.29028 29.2403 4.41187Z" fill="currentColor" fillRule="evenodd"/>
                </g>
              </svg>
            </div>
            <h2 className="text-white text-2xl font-bold">StylusForge</h2>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/tutorial" className="text-gray-300 hover:text-white transition-colors font-medium">
              Tutorials
            </Link>
            <Link href="/ide" className="text-gray-300 hover:text-white transition-colors font-medium">
              IDE
            </Link>
            <Link href="https://docs.arbitrum.io/stylus" target="_blank" className="text-gray-300 hover:text-white transition-colors font-medium">
              Docs
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <UserMenu />
          </div>
        </header>

        <main className="flex flex-col gap-32 py-16 md:py-24">
          {/* Hero Section */}
          <section className="flex flex-col gap-12 items-center text-center pt-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full animate-fade-in">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-blue-300 text-sm font-semibold">Now with 96% gas savings on Arbitrum</span>
            </div>

            <div className="flex flex-col gap-6 max-w-5xl">
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-black leading-[1.1] tracking-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-cyan-200 drop-shadow-2xl">
                  Build Smart Contracts
                </span>
                <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400">
                  That Actually Scale
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                The most powerful browser IDE for <span className="text-blue-400 font-semibold">Arbitrum Stylus</span>. 
                Write Rust contracts that are <span className="text-green-400 font-bold">10-100x cheaper</span> than Solidity.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 justify-center items-center">
              <Link href="/dashboard">
                <button className="group px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 flex items-center gap-3">
                  <Rocket className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  Start Building Free
                </button>
              </Link>
              <Link href="/tutorial">
                <button className="px-8 py-4 bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/20 hover:border-white/40 text-white font-semibold rounded-xl transition-all flex items-center gap-3">
                  <Play className="w-5 h-5" />
                  Watch Demo
                </button>
              </Link>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400 pt-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                <span>No Installation Required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                <span>Deploy in 30 Seconds</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                <span>Free Forever</span>
              </div>
            </div>
          </section>
          {/* Stats Section */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className={`flex flex-col items-center justify-center p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-white/10 hover:border-blue-500/50 transition-all duration-500 hover:scale-105 ${
                    statsAnimated ? 'animate-fade-in' : 'opacity-0'
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <Icon className="w-8 h-8 text-blue-400 mb-3" />
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-sm text-gray-400 text-center">{stat.label}</div>
                </div>
              );
            })}
          </section>

          {/* Enhanced Code Preview */}
          <section className="flex flex-col items-center gap-8">
            <div className="text-center max-w-3xl">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Write Code, Not Configuration
              </h2>
              <p className="text-xl text-gray-400">
                Start coding instantly with our browser-based IDE. No setup, no downloads, no hassle.
              </p>
            </div>

            <div className="w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden border border-white/10 hover:border-blue-500/30 transition-all duration-500">
              <div className="h-10 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 flex items-center px-5 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 bg-red-500 rounded-full hover:scale-125 transition-transform cursor-pointer"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full hover:scale-125 transition-transform cursor-pointer"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full hover:scale-125 transition-transform cursor-pointer"></div>
                </div>
                <div className="flex-1 flex justify-center">
                  <span className="text-gray-400 text-xs font-mono">contract.rs</span>
                </div>
              </div>
              <div className="p-8 font-mono text-sm md:text-base bg-gradient-to-br from-slate-900 to-slate-950 backdrop-blur-sm">
                <pre className="whitespace-pre-wrap leading-relaxed">
                  <code className="language-rust">
                    <span className="text-gray-500">// Lightning-fast smart contracts with Rust</span>{'\n'}
                    <span className="text-purple-400">#[entrypoint]</span>{'\n'}
                    <span className="text-blue-400">pub fn </span><span className="text-yellow-300">user_main</span><span className="text-gray-300">(</span><span className="text-orange-400">input: </span><span className="text-green-400">Vec&lt;u8&gt;</span><span className="text-gray-300">) </span><span className="text-blue-400">-&gt; </span><span className="text-green-400">Result&lt;Vec&lt;u8&gt;, </span><span className="text-red-400">Revert</span><span className="text-green-400">&gt;</span><span className="text-gray-300"> {'{'}</span>{'\n'}
                    {'    '}<span className="text-blue-400">let </span><span className="text-orange-400">counter</span><span className="text-gray-300"> = </span><span className="text-green-400">StorageU64</span><span className="text-gray-300">::new();</span>{'\n'}
                    {'    '}<span className="text-blue-400">let </span><span className="text-orange-400">value</span><span className="text-gray-300"> = </span><span className="text-orange-400">counter</span><span className="text-gray-300">.get();</span>{'\n'}
                    {'    '}<span className="text-orange-400">counter</span><span className="text-gray-300">.set(</span><span className="text-orange-400">value</span><span className="text-gray-300"> + </span><span className="text-cyan-300">1</span><span className="text-gray-300">);</span>{'\n'}
                    {'    '}<span className="text-blue-400">Ok</span><span className="text-gray-300">(</span><span className="text-orange-400">value</span><span className="text-gray-300">.to_be_bytes().into())</span>{'\n'}
                    <span className="text-gray-300">{'}'}</span>{'\n\n'}
                    <span className="text-gray-500">// Gas cost: ~2,100 vs Solidity's ~21,000+ ⚡</span>
                  </code>
                </pre>
              </div>
              <div className="h-12 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 flex items-center justify-between px-6 border-t border-white/10">
                <span className="text-green-400 text-sm font-mono flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Compiled successfully
                </span>
                <span className="text-gray-500 text-xs font-mono">Gas Estimate: 2.1k</span>
              </div>
            </div>
          </section>

          {/* Features Grid */}
          <section className="flex flex-col gap-16 items-center text-center">
            <div className="flex flex-col gap-4 max-w-3xl">
              <h2 className="text-4xl md:text-5xl font-bold text-white">
                Everything You Need to Ship Fast
              </h2>
              <p className="text-xl text-gray-400">
                A complete development environment designed for speed and efficiency
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
              <div className="group flex flex-col items-center text-center p-8 bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl border border-white/10 hover:bg-blue-500/10 hover:border-blue-500/40 hover:-translate-y-2 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-blue-500/20 cursor-pointer">
                <div className="flex items-center justify-center h-16 w-16 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 text-blue-400 mb-6 group-hover:bg-blue-500/30 group-hover:scale-110 transition-all duration-500">
                  <Code2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">Browser IDE</h3>
                <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                  Full-featured code editor with syntax highlighting, auto-completion, and real-time compilation. No installation needed.
                </p>
              </div>
              <div className="group flex flex-col items-center text-center p-8 bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl border border-white/10 hover:bg-purple-500/10 hover:border-purple-500/40 hover:-translate-y-2 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-purple-500/20 cursor-pointer">
                <div className="flex items-center justify-center h-16 w-16 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-500/5 text-purple-400 mb-6 group-hover:bg-purple-500/30 group-hover:scale-110 transition-all duration-500">
                  <Rocket className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">One-Click Deploy</h3>
                <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                  Deploy to Arbitrum Sepolia or mainnet instantly. Automatic gas estimation and transaction management included.
                </p>
              </div>
              <div className="group flex flex-col items-center text-center p-8 bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl border border-white/10 hover:bg-green-500/10 hover:border-green-500/40 hover:-translate-y-2 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-green-500/20 cursor-pointer">
                <div className="flex items-center justify-center h-16 w-16 rounded-xl bg-gradient-to-br from-green-500/20 to-green-500/5 text-green-400 mb-6 group-hover:bg-green-500/30 group-hover:scale-110 transition-all duration-500">
                  <Shield className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-green-400 transition-colors">Learn By Doing</h3>
                <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                  Interactive tutorials with hands-on exercises. Go from Rust beginner to Stylus expert with guided lessons.
                </p>
              </div>
            </div>
          </section>

          {/* Gas Comparison */}
          <GasComparison />

          {/* Testimonials */}
          <section className="flex flex-col gap-12 items-center">
            <div className="text-center max-w-3xl">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Loved by Developers Worldwide
              </h2>
              <p className="text-xl text-gray-400">
                Join hundreds of developers building the future with Stylus
              </p>
            </div>

            <div className="relative w-full max-w-4xl">
              <div className="flex gap-6 overflow-hidden">
                {testimonials.map((testimonial, index) => (
                  <div
                    key={index}
                    className={`flex-shrink-0 w-full transition-all duration-700 ${
                      index === activeTestimonial ? 'opacity-100 scale-100' : 'opacity-0 scale-95 absolute inset-0'
                    }`}
                  >
                    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-white/10 p-8 md:p-12">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="text-5xl">{testimonial.image}</div>
                        <div>
                          <div className="text-xl font-bold text-white">{testimonial.name}</div>
                          <div className="text-sm text-gray-400">{testimonial.role}</div>
                          <div className="text-sm text-blue-400">{testimonial.company}</div>
                        </div>
                      </div>
                      <p className="text-lg text-gray-300 italic leading-relaxed">
                        "{testimonial.quote}"
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-center gap-2 mt-6">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTestimonial(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === activeTestimonial ? 'bg-blue-400 w-8' : 'bg-gray-600'
                    }`}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="flex flex-col gap-8 items-center text-center py-16 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 rounded-3xl border border-white/10">
            <div className="flex flex-col gap-6 max-w-4xl px-6">
              <h2 className="text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400">
                Ready to Build the Future?
              </h2>
              <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
                Join developers building the next generation of gas-efficient smart contracts
              </p>
            </div>
            <Link href="/dashboard">
              <button className="group px-12 py-5 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 hover:from-blue-600 hover:via-purple-600 hover:to-cyan-600 text-white text-xl font-bold rounded-2xl transition-all shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 flex items-center gap-3">
                <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                Start Building Now
                <Rocket className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <p className="text-gray-500 text-sm">No credit card required • Deploy in 30 seconds • Free forever</p>
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t border-white/10 py-12 mt-24">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 text-blue-400">
                  <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_6_543)">
                      <path d="M42.1739 20.1739L27.8261 5.82609C29.1366 7.13663 28.3989 10.1876 26.2002 13.7654C24.8538 15.9564 22.9595 18.3449 20.6522 20.6522C18.3449 22.9595 15.9564 24.8538 13.7654 26.2002C10.1876 28.3989 7.13663 29.1366 5.82609 27.8261L20.1739 42.1739C21.4845 43.4845 24.5355 42.7467 28.1133 40.548C30.3042 39.2016 32.6927 37.3073 35 35C37.3073 32.6927 39.2016 30.3042 40.548 28.1133C42.7467 24.5355 43.4845 21.4845 42.1739 20.1739Z" fill="currentColor"/>
                    </g>
                  </svg>
                </div>
                <span className="text-xl font-bold text-white">StylusForge</span>
              </div>
              <p className="text-gray-400 text-sm">
                The most powerful browser IDE for Arbitrum Stylus smart contracts.
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><Link href="/ide" className="text-gray-400 hover:text-white transition-colors">IDE</Link></li>
                <li><Link href="/tutorial" className="text-gray-400 hover:text-white transition-colors">Tutorials</Link></li>
                <li><Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">Dashboard</Link></li>
                <li><Link href="/deploy" className="text-gray-400 hover:text-white transition-colors">Deploy</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Link href="https://docs.arbitrum.io/stylus" target="_blank" className="text-gray-400 hover:text-white transition-colors flex items-center gap-1">
                  Documentation <ExternalLink className="w-3 h-3" />
                </Link></li>
                <li><Link href="https://github.com/OffchainLabs/stylus-sdk-rs" target="_blank" className="text-gray-400 hover:text-white transition-colors flex items-center gap-1">
                  Stylus SDK <ExternalLink className="w-3 h-3" />
                </Link></li>
                <li><Link href="https://arbitrum.io" target="_blank" className="text-gray-400 hover:text-white transition-colors flex items-center gap-1">
                  Arbitrum <ExternalLink className="w-3 h-3" />
                </Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Connect</h3>
              <div className="flex gap-4">
                <a href="https://github.com" target="_blank" className="text-gray-400 hover:text-white transition-colors">
                  <Github className="w-6 h-6" />
                </a>
                <a href="https://twitter.com" target="_blank" className="text-gray-400 hover:text-white transition-colors">
                  <Twitter className="w-6 h-6" />
                </a>
                <a href="mailto:hello@stylusforge.com" className="text-gray-400 hover:text-white transition-colors">
                  <Mail className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © 2025 StylusForge. Built for Arbitrum Stylus Hackathon.
            </p>
            <div className="flex gap-6 text-sm text-gray-500">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
              <Link href="/cookies" className="hover:text-white transition-colors">Cookies</Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
