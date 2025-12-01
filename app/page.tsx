'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function HomePage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
      {/* Top App Bar */}
      <header className="sticky top-0 z-50 bg-background-dark/80 backdrop-blur-lg">
        <div className="container mx-auto">
          <div className="flex items-center p-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-3xl">hub</span>
              <h2 className="text-white text-xl font-bold leading-tight tracking-[-0.015em] flex-1">
                StylusForge
              </h2>
            </div>
            <nav className="hidden md:flex items-center gap-6 mx-auto">
              <a
                className="text-white/80 hover:text-white transition-colors text-sm font-medium"
                href="#features"
              >
                Features
              </a>
              <a
                className="text-white/80 hover:text-white transition-colors text-sm font-medium"
                href="#docs"
              >
                Docs
              </a>
              <a
                className="text-white/80 hover:text-white transition-colors text-sm font-medium"
                href="#pricing"
              >
                Pricing
              </a>
            </nav>
            <div className="flex flex-1 items-center justify-end gap-2">
              <Link href="/dashboard">
                <button className="hidden md:flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-primary/20 text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/30 transition-colors">
                  <span className="truncate">Sign In</span>
                </button>
              </Link>
              <button className="flex md:hidden max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 bg-transparent text-white gap-2 text-base font-bold leading-normal tracking-[0.015em] min-w-0 p-0 w-12">
                <span className="material-symbols-outlined">menu</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="flex flex-col gap-6 bg-cover bg-center bg-no-repeat items-center justify-center text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col gap-4 max-w-3xl mx-auto"
              >
                <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em] md:text-6xl">
                  Build The Future of Smart Contracts
                </h1>
                <h2 className="text-white/80 text-base font-normal leading-normal md:text-xl">
                  Write Rust. Deploy Instantly. Save Gas.
                </h2>
              </motion.div>

              {/* Button Group */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex w-full max-w-md flex-col sm:flex-row gap-3 justify-center pt-4"
              >
                <Link href="/ide" className="flex-1 sm:flex-initial">
                  <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-5 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] w-full sm:w-auto hover:bg-primary/90 transition-colors">
                    <span className="truncate">Start Building</span>
                  </button>
                </Link>
                <Link href="/ide" className="flex-1 sm:flex-initial">
                  <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-5 bg-[#362348] text-white text-base font-bold leading-normal tracking-[0.015em] w-full sm:w-auto hover:bg-[#362348]/80 transition-colors">
                    <span className="truncate">Try Demo</span>
                  </button>
                </Link>
              </motion.div>

              {/* Chips */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex gap-3 pt-4 flex-wrap justify-center"
              >
                <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-[#362348] px-4">
                  <p className="text-white text-sm font-medium leading-normal">✨ Zero Setup</p>
                </div>
                <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-[#362348] px-4">
                  <p className="text-white text-sm font-medium leading-normal">🚀 One-Click Deploy</p>
                </div>
                <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-[#362348] px-4">
                  <p className="text-white text-sm font-medium leading-normal">💰 10x Cheaper Gas</p>
                </div>
                <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-[#362348] px-4">
                  <p className="text-white text-sm font-medium leading-normal">🎮 Earn NFT Badges</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Code Editor Preview */}
        <section className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="relative rounded-lg border border-white/10 bg-black/30 shadow-2xl shadow-primary/20 p-2 max-w-4xl mx-auto"
          >
            <div className="flex items-center gap-1.5 p-2 border-b border-white/10">
              <div className="h-3 w-3 rounded-full bg-red-500"></div>
              <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
            </div>
            <pre className="p-4 text-sm font-mono overflow-x-auto text-ide-text">
              <code className="language-rust">
                {`#[stylus_sdk::prelude::*]

#[storage]
#[entrypoint]
pub struct Counter {
    count: StorageU256,
}

#[external]
impl Counter {
    pub fn increment(&mut self) -> Result<(), Vec<u8>> {
        let count = self.count.get() + U256::from(1);
        self.count.set(count);
        Ok(())
    }
    
    pub fn get_count(&self) -> Result<U256, Vec<u8>> {
        Ok(self.count.get())
    }
}`}
              </code>
            </pre>
          </motion.div>
        </section>

        {/* Features Section */}
        <section id="features" className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="glassmorphic rounded-2xl p-6"
            >
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold mb-2">Lightning Fast</h3>
              <p className="text-white/70">
                Compile and deploy Stylus contracts in seconds with our optimized WASM pipeline
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="glassmorphic rounded-2xl p-6"
            >
              <div className="text-4xl mb-4">💎</div>
              <h3 className="text-xl font-bold mb-2">Gas Savings</h3>
              <p className="text-white/70">
                See real-time gas comparisons vs Solidity and save up to 90% on deployment costs
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="glassmorphic rounded-2xl p-6"
            >
              <div className="text-4xl mb-4">🎓</div>
              <h3 className="text-xl font-bold mb-2">Learn & Earn</h3>
              <p className="text-white/70">
                Complete interactive tutorials and earn on-chain NFT badges as you master Stylus
              </p>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="glassmorphic rounded-2xl p-8"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-primary mb-2">1,247</div>
                <div className="text-white/60 text-sm">Contracts Deployed</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-secondary mb-2">156</div>
                <div className="text-white/60 text-sm">Active Developers</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-accent-green mb-2">$45K</div>
                <div className="text-white/60 text-sm">Gas Saved</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-accent-yellow mb-2">892</div>
                <div className="text-white/60 text-sm">Achievements Earned</div>
              </div>
            </div>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-2xl">hub</span>
              <span className="font-bold">StylusForge</span>
            </div>
            <div className="text-white/60 text-sm">
              © 2025 StylusForge. Built for Arbitrum APAC Mini Hackathon.
            </div>
            <div className="flex gap-4">
              <a href="#" className="text-white/60 hover:text-white transition-colors">
                Twitter
              </a>
              <a href="#" className="text-white/60 hover:text-white transition-colors">
                GitHub
              </a>
              <a href="#" className="text-white/60 hover:text-white transition-colors">
                Discord
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
