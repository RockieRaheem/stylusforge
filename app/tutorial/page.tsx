'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function TutorialPage() {
  const [hintOpen, setHintOpen] = useState(false);

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark text-white">
      {/* Header */}
      <header className="flex h-16 w-full items-center justify-between border-b border-white/10 bg-[#16222b] px-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <button className="flex items-center justify-center p-2 text-white/80 transition-colors hover:text-white">
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
          </Link>
          <h1 className="text-lg font-medium text-white">Tutorial: Build Your First Stylus Contract</h1>
        </div>
        <div className="flex items-center gap-2">
          <div 
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-8" 
            style={{backgroundImage: 'url("https://api.dicebear.com/7.x/avataaars/svg?seed=user")'}}
          ></div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Left Sidebar - Progress */}
        <aside className="flex h-full w-[320px] shrink-0 flex-col justify-between border-r border-white/10 bg-[#16222b] p-6">
          <div className="flex flex-col gap-8">
            {/* Progress Header */}
            <div className="flex gap-3 items-center">
              <div className="size-12 text-primary">
                <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0_6_543)">
                    <path d="M42.1739 20.1739L27.8261 5.82609C29.1366 7.13663 28.3989 10.1876 26.2002 13.7654C24.8538 15.9564 22.9595 18.3449 20.6522 20.6522C18.3449 22.9595 15.9564 24.8538 13.7654 26.2002C10.1876 28.3989 7.13663 29.1366 5.82609 27.8261L20.1739 42.1739C21.4845 43.4845 24.5355 42.7467 28.1133 40.548C30.3042 39.2016 32.6927 37.3073 35 35C37.3073 32.6927 39.2016 30.3042 40.548 28.1133C42.7467 24.5355 43.4845 21.4845 42.1739 20.1739Z" fill="currentColor"/>
                    <path clipRule="evenodd" d="M7.24189 26.4066C7.31369 26.4411 7.64204 26.5637 8.52504 26.3738C9.59462 26.1438 11.0343 25.5311 12.7183 24.4963C14.7583 23.2426 17.0256 21.4503 19.238 19.238C21.4503 17.0256 23.2426 14.7583 24.4963 12.7183C25.5311 11.0343 26.1438 9.59463 26.3738 8.52504C26.5637 7.64204 26.4411 7.31369 26.4066 7.24189C26.345 7.21246 26.143 7.14535 25.6664 7.1918C24.9745 7.25925 23.9954 7.5498 22.7699 8.14278C20.3369 9.32007 17.3369 11.4915 14.4142 14.4142C11.4915 17.3369 9.32007 20.3369 8.14278 22.7699C7.5498 23.9954 7.25925 24.9745 7.1918 25.6664C7.14534 26.143 7.21246 26.345 7.24189 26.4066ZM29.9001 10.7285C29.4519 12.0322 28.7617 13.4172 27.9042 14.8126C26.465 17.1544 24.4686 19.6641 22.0664 22.0664C19.6641 24.4686 17.1544 26.465 14.8126 27.9042C13.4172 28.7617 12.0322 29.4519 10.7285 29.9001L21.5754 40.747C21.6001 40.7606 21.8995 40.931 22.8729 40.7217C23.9424 40.4916 25.3821 39.879 27.0661 38.8441C29.1062 37.5904 31.3734 35.7982 33.5858 33.5858C35.7982 31.3734 37.5904 29.1062 38.8441 27.0661C39.879 25.3821 40.4916 23.9425 40.7216 22.8729C40.931 21.8995 40.7606 21.6001 40.747 21.5754L29.9001 10.7285ZM29.2403 4.41187L43.5881 18.7597C44.9757 20.1473 44.9743 22.1235 44.6322 23.7139C44.2714 25.3919 43.4158 27.2666 42.252 29.1604C40.8128 31.5022 38.8165 34.012 36.4142 36.4142C34.012 38.8165 31.5022 40.8128 29.1604 42.252C27.2666 43.4158 25.3919 44.2714 23.7139 44.6322C22.1235 44.9743 20.1473 44.9757 18.7597 43.5881L4.41187 29.2403C3.29027 28.1187 3.08209 26.5973 3.21067 25.2783C3.34099 23.9415 3.8369 22.4852 4.54214 21.0277C5.96129 18.0948 8.43335 14.7382 11.5858 11.5858C14.7382 8.43335 18.0948 5.9613 21.0277 4.54214C22.4852 3.8369 23.9415 3.34099 25.2783 3.21067C26.5973 3.08209 28.1187 3.29028 29.2403 4.41187Z" fill="currentColor" fillRule="evenodd"/>
                  </g>
                  <defs>
                    <clipPath id="clip0_6_543">
                      <rect fill="white" height="48" width="48"/>
                    </clipPath>
                  </defs>
                </svg>
              </div>
              <div className="flex flex-col">
                <h2 className="text-white text-base font-semibold leading-normal">Tutorial Progress</h2>
                <p className="text-white/60 text-sm font-normal leading-normal">Keep going, you&apos;re doing great!</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="flex flex-col gap-2">
              <div className="flex gap-6 justify-between items-center">
                <p className="text-white/90 text-sm font-medium leading-normal">Overall Completion</p>
                <p className="text-primary text-sm font-bold leading-normal">40%</p>
              </div>
              <div className="w-full rounded-full bg-white/10 h-2">
                <div className="h-2 rounded-full bg-primary transition-all duration-500" style={{width: '40%'}}></div>
              </div>
            </div>

            {/* Steps List */}
            <div className="flex flex-col gap-3">
              {/* Step 1 - Completed */}
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg">
                <div className="flex items-center justify-center size-6 rounded-full bg-success animate-bounce-in">
                  <span className="material-symbols-outlined text-base text-background-dark" style={{fontVariationSettings: "'wght' 600"}}>check</span>
                </div>
                <p className="text-white/80 text-sm font-medium leading-normal">Project Setup</p>
              </div>

              {/* Step 2 - Completed */}
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg">
                <div className="flex items-center justify-center size-6 rounded-full bg-success animate-bounce-in" style={{animationDelay: '0.1s'}}>
                  <span className="material-symbols-outlined text-base text-background-dark" style={{fontVariationSettings: "'wght' 600"}}>check</span>
                </div>
                <p className="text-white/80 text-sm font-medium leading-normal">Define Contract State</p>
              </div>

              {/* Step 3 - Active */}
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/20">
                <div className="flex items-center justify-center size-6 rounded-full bg-primary animate-bounce-in" style={{animationDelay: '0.2s'}}>
                  <span className="text-xs font-bold text-background-dark">3</span>
                </div>
                <p className="text-primary text-sm font-bold leading-normal">Implement Logic</p>
              </div>

              {/* Step 4 - Locked */}
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-white/50">
                <div className="flex items-center justify-center size-6 rounded-full border-2 border-white/30">
                  <span className="text-xs font-bold text-white/50">4</span>
                </div>
                <p className="text-sm font-medium leading-normal">Compile &amp; Test</p>
              </div>

              {/* Step 5 - Locked */}
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-white/50">
                <div className="flex items-center justify-center size-6 rounded-full border-2 border-white/30">
                  <span className="text-xs font-bold text-white/50">5</span>
                </div>
                <p className="text-sm font-medium leading-normal">Deploy Contract</p>
              </div>
            </div>
          </div>

          {/* Rewards Button */}
          <button className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-11 px-4 bg-primary text-background-dark text-sm font-bold leading-normal tracking-wide transition-colors hover:bg-primary/90">
            <span className="truncate">View Rewards</span>
          </button>
        </aside>

        {/* Main Content */}
        <main className="flex flex-1 flex-col overflow-y-auto">
          <div className="flex flex-1 flex-col p-8 gap-6">
            {/* Step Instructions Card */}
            <div className="flex flex-col rounded-xl border border-white/10 bg-[#16222b] p-6">
              <div className="flex items-baseline gap-3">
                <span className="text-primary font-bold text-sm">STEP 3 OF 5</span>
                <h3 className="text-white text-2xl font-bold leading-tight tracking-tight">Create a Storage Variable</h3>
              </div>
              <p className="text-white/70 text-base font-normal leading-relaxed mt-4 max-w-3xl">
                In this step, you&apos;ll define a storage variable to hold a value on the blockchain. This is a fundamental concept in smart contract development. Use the <code className="font-mono bg-white/10 text-secondary text-sm px-1.5 py-0.5 rounded">#[storage]</code> attribute to declare a struct that will hold your contract&apos;s state.
              </p>

              {/* Hint Section */}
              <div className="mt-6">
                <details className="group" open={hintOpen} onToggle={(e) => setHintOpen((e.target as HTMLDetailsElement).open)}>
                  <summary className="list-none flex items-center gap-2 rounded-lg h-9 px-3 bg-secondary/20 text-secondary text-sm font-medium transition-colors hover:bg-secondary/30 cursor-pointer w-fit">
                    <span className="material-symbols-outlined text-base">lightbulb</span>
                    <span className="truncate">Show Hint</span>
                    <span className="material-symbols-outlined text-base transition-transform group-open:rotate-180">expand_more</span>
                  </summary>
                  <div className="hint-content overflow-hidden">
                    <div className="mt-4 rounded-lg bg-black/20 p-4 border border-white/10">
                      <p className="text-white/70 text-sm">
                        You need to declare a public struct. Inside this struct, define a variable to hold a number. For example: <code className="font-mono bg-white/10 text-secondary text-xs px-1 py-0.5 rounded">pub number: u64</code>.
                      </p>
                    </div>
                  </div>
                </details>
              </div>
            </div>

            {/* Code Editor Card */}
            <div className="flex flex-1 flex-col rounded-xl border border-white/10 bg-[#1a1a1a] overflow-hidden">
              {/* Editor Header */}
              <div className="flex h-12 items-center justify-between border-b border-white/10 bg-[#16222b] px-4">
                <p className="text-sm font-medium text-white/80">src/lib.rs</p>
                <div className="flex items-center gap-2">
                  <button className="flex items-center justify-center p-2 text-white/60 transition-colors hover:text-white">
                    <span className="material-symbols-outlined text-base">content_copy</span>
                  </button>
                  <button className="flex items-center justify-center p-2 text-white/60 transition-colors hover:text-white">
                    <span className="material-symbols-outlined text-base">history</span>
                  </button>
                </div>
              </div>

              {/* Code Content */}
              <div className="flex-1 p-4 font-mono text-sm text-white/80 leading-relaxed overflow-auto">
                <pre className="relative">
                  <code>
                    <div className="flex items-center gap-4">
                      <div className="text-right text-gray-500 w-4">1</div>
                      <div><span className="text-gray-500">// First, we need to import the Stylus SDK.</span></div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right text-gray-500 w-4">2</div>
                      <div><span className="text-secondary">use</span> stylus_sdk::prelude::*;</div>
                      <span className="material-symbols-outlined text-success text-lg ml-2">check_circle</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right text-gray-500 w-4">3</div>
                      <div></div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right text-gray-500 w-4">4</div>
                      <div><span className="text-gray-500">// Next, we define our contract&apos;s storage.</span></div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right text-gray-500 w-4">5</div>
                      <div><span className="text-gray-500">// This is where we&apos;ll store the state of our contract.</span></div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right text-gray-500 w-4">6</div>
                      <div>
                        <span className="underline decoration-wavy decoration-red-500 decoration-2">
                          <span className="text-gray-400">|</span>
                        </span>
                      </div>
                    </div>
                  </code>
                </pre>
              </div>
            </div>
          </div>

          {/* Bottom Action Bar */}
          <div className="flex h-20 items-center justify-end gap-4 border-t border-white/10 bg-[#16222b] px-8">
            <button className="flex min-w-[140px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-11 px-6 bg-gradient-to-r from-secondary to-primary text-white text-sm font-bold leading-normal tracking-wide transition-all duration-300 hover:shadow-lg hover:shadow-primary/30 active:scale-95">
              <span className="truncate">Check Solution</span>
            </button>
            <button 
              className="flex min-w-[120px] max-w-[480px] cursor-not-allowed items-center justify-center overflow-hidden rounded-lg h-11 px-6 bg-white/10 text-white/50 text-sm font-bold leading-normal tracking-wide" 
              disabled
            >
              <span className="truncate">Next Step</span>
            </button>
          </div>
        </main>
      </div>

      <style jsx>{`
        @keyframes bounce-in {
          0% {
            transform: scale(0.5);
            opacity: 0;
          }
          70% {
            transform: scale(1.1);
            opacity: 1;
          }
          100% {
            transform: scale(1);
          }
        }
        .animate-bounce-in {
          animation: bounce-in 0.5s ease-out forwards;
        }
        details[open] .hint-content {
          animation: reveal 0.4s ease-out forwards;
        }
        @keyframes reveal {
          from {
            opacity: 0;
            transform: translateY(-10px);
            max-height: 0;
          }
          to {
            opacity: 1;
            transform: translateY(0);
            max-height: 500px;
          }
        }
      `}</style>
    </div>
  );
}
