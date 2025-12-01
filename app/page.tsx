import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="relative w-full min-h-screen flex flex-col items-center overflow-x-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl filter opacity-30 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/20 rounded-full blur-3xl filter opacity-30 animate-pulse" style={{animationDelay: '1s'}}></div>
      
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 z-10">
        {/* TopNavBar */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-white/10 py-4">
          <div className="flex items-center gap-4 text-white">
            <div className="size-8 text-primary">
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
            <h2 className="text-white text-2xl font-bold leading-tight">StylusForge</h2>
          </div>
          <div className="flex flex-1 justify-end items-center gap-8">
            <div className="hidden md:flex items-center gap-9">
              <a className="text-gray-300 hover:text-white text-sm font-medium leading-normal transition-colors" href="#">Features</a>
              <a className="text-gray-300 hover:text-white text-sm font-medium leading-normal transition-colors" href="#">Pricing</a>
              <a className="text-gray-300 hover:text-white text-sm font-medium leading-normal transition-colors" href="#">Docs</a>
            </div>
            <Link href="/ide">
              <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-5 bg-gradient-to-r from-primary to-secondary text-white text-sm font-bold leading-normal tracking-wide shadow-lg hover:shadow-glow-cta transition-shadow duration-300">
                <span className="truncate">Start Building</span>
              </button>
            </Link>
          </div>
        </header>

        <main className="flex flex-col gap-24 md:gap-40 py-24 md:py-32">
          {/* HeroSection */}
          <section className="flex flex-col gap-10 items-center text-center">
            <div className="flex flex-col gap-4">
              <h1 className="text-white text-6xl md:text-8xl font-black leading-tight tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-gray-100 to-gray-500">
                Build The Future of Smart Contracts
              </h1>
              <h2 className="text-gray-400 text-lg md:text-xl font-normal leading-relaxed max-w-3xl mx-auto">
                Write Rust. Deploy Instantly. Save Gas. The ultimate browser-based IDE and learning platform for Arbitrum Stylus.
              </h2>
            </div>
            <div className="flex flex-wrap gap-4 flex-row items-center justify-center">
              <Link href="/ide">
                <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-gradient-to-r from-primary to-secondary text-white text-base font-bold leading-normal tracking-wide shadow-glow-cta hover:shadow-glow-cta-hover hover:scale-105 transform-gpu transition-all duration-300 ease-in-out">
                  <span className="truncate">Start For Free</span>
                </button>
              </Link>
              <Link href="/ide">
                <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-white/10 hover:bg-white/20 text-white text-base font-bold leading-normal tracking-wide transition-colors">
                  <span className="truncate">Try Demo</span>
                </button>
              </Link>
            </div>
            {/* Chips */}
            <div className="flex gap-3 pt-4 flex-wrap justify-center">
              <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-white/10 px-4">
                <p className="text-gray-200 text-sm font-medium leading-normal">Rust-Powered</p>
              </div>
              <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-white/10 px-4">
                <p className="text-gray-200 text-sm font-medium leading-normal">99% Cheaper Gas</p>
              </div>
              <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-white/10 px-4">
                <p className="text-gray-200 text-sm font-medium leading-normal">EVM Compatible</p>
              </div>
            </div>
          </section>

          {/* Animated Code Editor */}
          <section className="flex flex-col items-center gap-8 -mt-16 md:-mt-20">
            <div className="w-full max-w-4xl glass-morphism-window rounded-2xl shadow-soft-window overflow-hidden transform-gpu">
              <div className="h-9 bg-black/30 flex items-center px-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#ff5f56] rounded-full"></div>
                  <div className="w-3 h-3 bg-[#ffbd2e] rounded-full"></div>
                  <div className="w-3 h-3 bg-[#27c93f] rounded-full"></div>
                </div>
              </div>
              <div className="p-6 font-mono text-sm bg-black/20">
                <pre className="whitespace-pre-wrap">
                  <code className="language-rust">
                    <span className="text-gray-500">// Real-time compilation and gas estimation</span>{'\n'}
                    <span className="text-purple-400">#[entrypoint]</span>{'\n'}
                    <span className="text-blue-400">pub fn </span><span className="text-yellow-300">user_main</span><span className="text-gray-300">(</span><span className="text-orange-400">input: </span><span className="text-green-400">Vec&lt;u8&gt;</span><span className="text-gray-300">) </span><span className="text-blue-400">-&gt; </span><span className="text-green-400">Result&lt;Vec&lt;u8&gt;, </span><span className="text-red-400">Revert</span><span className="text-green-400">&gt;</span><span className="text-gray-300"> {'{'}</span>{'\n'}
                    {'    '}<span className="text-blue-400">let </span><span className="text-orange-400">counter</span><span className="text-gray-300"> = </span><span className="text-green-400">StorageU64</span><span className="text-gray-300">::new();</span>{'\n'}
                    {'    '}<span className="text-blue-400">let </span><span className="text-orange-400">value</span><span className="text-gray-300"> = </span><span className="text-orange-400">counter</span><span className="text-gray-300">.get();</span>{'\n'}
                    {'    '}<span className="text-orange-400">counter</span><span className="text-gray-300">.set(</span><span className="text-orange-400">value</span><span className="text-gray-300"> + </span><span className="text-teal-300">1</span><span className="text-gray-300">);</span>{'\n'}
                    {'    '}<span className="text-blue-400">Ok</span><span className="text-gray-300">(</span><span className="text-orange-400">value</span><span className="text-gray-300">.to_be_bytes().into())</span>{'\n'}
                    <span className="text-gray-300">{'}'}</span>
                  </code>
                </pre>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="flex flex-col gap-12 items-center text-center">
            <div className="flex flex-col gap-4">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Everything You Need to Build on Stylus</h2>
              <p className="text-lg text-gray-400 max-w-3xl mx-auto">Develop, test, and deploy faster than ever with our integrated suite of tools.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
              <div className="flex flex-col items-center text-center p-8 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 hover:-translate-y-2 transition-all duration-300 ease-in-out shadow-soft">
                <div className="flex items-center justify-center h-16 w-16 rounded-xl bg-primary/10 text-primary mb-6">
                  <span className="material-symbols-outlined !text-4xl !font-light">terminal</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Browser-Based IDE</h3>
                <p className="text-gray-400 leading-relaxed">A full-featured code editor in your browser. No setup required. Write, compile, and test Rust smart contracts seamlessly.</p>
              </div>
              <div className="flex flex-col items-center text-center p-8 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 hover:-translate-y-2 transition-all duration-300 ease-in-out shadow-soft">
                <div className="flex items-center justify-center h-16 w-16 rounded-xl bg-secondary/10 text-secondary mb-6">
                  <span className="material-symbols-outlined !text-4xl !font-light">rocket_launch</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Instant Deployment</h3>
                <p className="text-gray-400 leading-relaxed">Deploy your contracts to Arbitrum testnets or mainnet with a single click, directly from the IDE.</p>
              </div>
              <div className="flex flex-col items-center text-center p-8 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 hover:-translate-y-2 transition-all duration-300 ease-in-out shadow-soft">
                <div className="flex items-center justify-center h-16 w-16 rounded-xl bg-primary/10 text-primary mb-6">
                  <span className="material-symbols-outlined !text-4xl !font-light">school</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Interactive Learning</h3>
                <p className="text-gray-400 leading-relaxed">Guided tutorials and code examples to help you master Rust and Stylus development, from beginner to expert.</p>
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="flex flex-col gap-8 items-center text-center">
            <div className="flex flex-col gap-4">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Live Platform Stats</h2>
              <p className="text-lg text-gray-400 max-w-3xl mx-auto">See the power of StylusForge in action with real-time data from our platform.</p>
            </div>
            <div className="w-full max-w-5xl glass-morphism-prominent rounded-2xl p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-white/10">
                <div className="flex flex-col items-center gap-2 pt-8 md:pt-4">
                  <p className="text-lg text-gray-400">Contracts Deployed</p>
                  <p className="text-5xl font-bold text-white font-mono tracking-tight animated-counter">1,204</p>
                </div>
                <div className="flex flex-col items-center gap-2 pt-8 md:pt-4">
                  <p className="text-lg text-gray-400">Avg. Gas Savings</p>
                  <p className="text-5xl font-bold text-white font-mono tracking-tight animated-counter">99.2%</p>
                </div>
                <div className="flex flex-col items-center gap-2 pt-8 md:pt-4">
                  <p className="text-lg text-gray-400">Active Developers</p>
                  <p className="text-5xl font-bold text-white font-mono tracking-tight animated-counter">873</p>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
