'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Code2, GraduationCap, Flame, Rocket, BookOpen, Plus } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-dark">
      {/* Top App Bar */}
      <div className="flex items-center bg-surface-dark/80 backdrop-blur-sm sticky top-0 z-10 p-4 justify-between border-b border-white/10">
        <div className="flex items-center gap-2">
          <button className="p-1">
            <span className="material-symbols-outlined text-white text-3xl">menu</span>
          </button>
          <Link href="/">
            <h2 className="text-white text-xl font-bold leading-tight tracking-[-0.015em] flex-1 hover:text-primary transition-colors">
              StylusForge
            </h2>
          </Link>
        </div>
        <div className="flex items-center justify-end">
          <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 w-10 bg-primary text-white hover:bg-primary/80 transition-colors">
            <span className="material-symbols-outlined text-white" style={{ fontSize: '24px' }}>
              person
            </span>
          </button>
        </div>
      </div>

      <main className="flex-1 p-4 pb-24 space-y-8">
        {/* Headline Text */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-white tracking-light text-3xl font-bold leading-tight text-left"
        >
          Welcome back, Alex! 👋
        </motion.h1>

        {/* Gamification Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col gap-4 rounded-xl bg-surface-dark p-5 border border-white/10 shadow-lg"
        >
          <div className="flex gap-6 justify-between items-center">
            <p className="text-text-light-primary text-base font-medium leading-normal">
              Level 7 Developer
            </p>
            <p className="text-text-light-secondary text-sm font-normal leading-normal">
              450 / 1000 XP
            </p>
          </div>
          <div className="rounded-full bg-white/10">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '45%' }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-2 rounded-full bg-gradient-to-r from-primary to-secondary"
            />
          </div>
          <p className="text-amber-400 text-sm font-medium leading-normal flex items-center gap-1.5">
            <Flame className="w-4 h-4 fill-amber-400" />
            12 day streak
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col gap-2 rounded-xl p-4 bg-surface-dark border border-white/10 shadow-lg hover:border-primary/50 transition-colors"
          >
            <p className="text-text-light-secondary text-sm font-medium leading-normal">
              Contracts Deployed
            </p>
            <p className="text-white tracking-tight text-4xl font-bold leading-tight" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
              24
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25 }}
            className="flex flex-col gap-2 rounded-xl p-4 bg-surface-dark border border-white/10 shadow-lg hover:border-secondary/50 transition-colors"
          >
            <p className="text-text-light-secondary text-sm font-medium leading-normal">
              Tutorials Done
            </p>
            <p className="text-white tracking-tight text-4xl font-bold leading-tight" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
              12
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col gap-2 rounded-xl p-4 bg-surface-dark border border-white/10 shadow-lg hover:border-accent-green/50 transition-colors"
          >
            <p className="text-text-light-secondary text-sm font-medium leading-normal">
              Gas Saved
            </p>
            <p className="text-white tracking-tight text-4xl font-bold leading-tight" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
              $156
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.35 }}
            className="flex flex-col gap-2 rounded-xl p-4 bg-surface-dark border border-white/10 shadow-lg hover:border-accent-yellow/50 transition-colors"
          >
            <p className="text-text-light-secondary text-sm font-medium leading-normal">
              Achievements
            </p>
            <p className="text-white tracking-tight text-4xl font-bold leading-tight" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
              8
            </p>
          </motion.div>
        </div>

        {/* Recent Projects Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-white text-xl font-bold leading-tight tracking-[-0.015em] pb-4">
            Recent Projects
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-4 rounded-lg bg-surface-dark p-4 border border-white/10 hover:border-white/30 transition-colors">
              <div className="flex-1">
                <p className="text-white font-semibold">NFT Marketplace Contract</p>
                <p className="text-text-light-secondary text-sm">Modified: 2 hours ago</p>
              </div>
              <Link href="/ide">
                <button className="flex items-center justify-center rounded-md h-10 px-4 bg-white/10 text-white gap-2 text-sm font-bold hover:bg-white/20 transition-colors">
                  Open
                </button>
              </Link>
            </div>

            <div className="flex items-center justify-between gap-4 rounded-lg bg-surface-dark p-4 border border-white/10 hover:border-white/30 transition-colors">
              <div className="flex-1">
                <p className="text-white font-semibold">DEX Router</p>
                <p className="text-text-light-secondary text-sm">Modified: 1 day ago</p>
              </div>
              <Link href="/ide">
                <button className="flex items-center justify-center rounded-md h-10 px-4 bg-white/10 text-white gap-2 text-sm font-bold hover:bg-white/20 transition-colors">
                  Open
                </button>
              </Link>
            </div>

            <div className="flex items-center justify-between gap-4 rounded-lg bg-surface-dark p-4 border border-white/10 hover:border-white/30 transition-colors">
              <div className="flex-1">
                <p className="text-white font-semibold">DAO Governance</p>
                <p className="text-text-light-secondary text-sm">Modified: 3 days ago</p>
              </div>
              <Link href="/ide">
                <button className="flex items-center justify-center rounded-md h-10 px-4 bg-white/10 text-white gap-2 text-sm font-bold hover:bg-white/20 transition-colors">
                  Open
                </button>
              </Link>
            </div>

            <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-white/20 p-4 text-center text-text-light-secondary hover:bg-white/5 hover:border-white/40 transition-colors">
              <Plus className="w-5 h-5" />
              <span className="font-semibold">New Project</span>
            </button>
          </div>
        </motion.div>

        {/* Achievement Gallery */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-white text-xl font-bold leading-tight tracking-[-0.015em] pb-4">
            Achievement Gallery
          </h2>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="flex flex-col items-center gap-2 flex-shrink-0 text-center w-20 cursor-pointer"
            >
              <div className="flex items-center justify-center size-20 rounded-full bg-secondary shadow-[0_0_15px_rgba(40,160,240,0.5)]">
                <Code2 className="w-10 h-10 text-white" />
              </div>
              <p className="text-text-light-secondary text-xs font-medium">First Contract</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.1, rotate: -5 }}
              className="flex flex-col items-center gap-2 flex-shrink-0 text-center w-20 cursor-pointer"
            >
              <div className="flex items-center justify-center size-20 rounded-full bg-primary shadow-[0_0_15px_rgba(150,80,255,0.5)]">
                <GraduationCap className="w-10 h-10 text-white" />
              </div>
              <p className="text-text-light-secondary text-xs font-medium">Rust Novice</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="flex flex-col items-center gap-2 flex-shrink-0 text-center w-20 cursor-pointer"
            >
              <div className="flex items-center justify-center size-20 rounded-full bg-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.5)]">
                <Flame className="w-10 h-10 text-white fill-white" />
              </div>
              <p className="text-text-light-secondary text-xs font-medium">10-Day Streak</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.1, rotate: -5 }}
              className="flex flex-col items-center gap-2 flex-shrink-0 text-center w-20 cursor-pointer"
            >
              <div className="flex items-center justify-center size-20 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                <BookOpen className="w-10 h-10 text-white" />
              </div>
              <p className="text-text-light-secondary text-xs font-medium">Tutorial Master</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="flex flex-col items-center gap-2 flex-shrink-0 text-center w-20 cursor-pointer"
            >
              <div className="flex items-center justify-center size-20 rounded-full bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.5)]">
                <Rocket className="w-10 h-10 text-white" />
              </div>
              <p className="text-text-light-secondary text-xs font-medium">Gas Optimizer</p>
            </motion.div>

            <div className="flex flex-col items-center gap-2 flex-shrink-0 text-center w-20">
              <div className="flex items-center justify-center size-20 rounded-full bg-white/10 border-2 border-dashed border-white/20">
                <span className="text-2xl">🔒</span>
              </div>
              <p className="text-text-light-secondary text-xs font-medium">Locked</p>
            </div>
          </div>
        </motion.div>

        {/* Learning Path Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-white text-xl font-bold leading-tight tracking-[-0.015em] pb-4">
            Learning Path
          </h2>
          <div className="flex flex-col gap-4 rounded-xl bg-surface-dark p-5 border border-white/10 shadow-lg">
            <p className="text-white font-semibold">Stylus Basics</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 rounded-full bg-white/10 h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '67%' }}
                  transition={{ duration: 1, delay: 0.8 }}
                  className="h-2 rounded-full bg-gradient-to-r from-secondary to-accent-blue"
                />
              </div>
              <p className="text-text-light-secondary text-sm" style={{ fontFamily: 'JetBrains Mono, monospace' }}>67%</p>
            </div>
            <p className="text-text-light-secondary text-sm">
              Next up: Advanced Stylus Patterns
            </p>
            <Link href="/tutorial">
              <button className="w-full flex items-center justify-center rounded-lg h-12 px-6 bg-secondary text-white gap-2 text-base font-bold leading-normal tracking-[0.015em] hover:bg-secondary/90 transition-colors">
                Continue Learning
              </button>
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
