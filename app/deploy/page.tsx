import Link from 'next/link';

export default function DeployPage() {
  return (
    <div
      className="relative flex h-screen min-h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-hidden items-center justify-center p-4"
      style={{
        backgroundImage:
          "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAiZBzSH-wqLfoigRezFXH62S32g-_Hx5iKGYHOuv7q7sKb3BfvqJPEYB7w-i04MERHXehgq7-nS-LFGdAcC1jHHlAhfzR_cMCCM9qMVjniuMkQnQTbEApj-6ETWLqLMTX0HRoUaZc7lVDVbyrGwjwIsNiARl2-m23k9tD7UjSb_V0ZZ1Z7EjYsFjDKHIpns8G1iGzjqo9sdnicMa2XneS5Ud6pBhpblE9EVQmwhSaIK-H6kRVmnhIUuD5nucvxNk-o9SyKfQ3zVmE')",
        backgroundPosition: "center center",
        backgroundSize: "cover",
      }}
    >
      <div className="relative flex flex-col w-full max-w-2xl rounded-xl bg-slate-900/50 backdrop-blur-lg border border-white/10 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 p-6 border-b border-white/10">
          <h1 className="text-white tracking-light text-2xl font-bold leading-tight">Deploy Your Contract</h1>
          <Link href="/ide">
            <button className="flex items-center justify-center p-1.5 rounded-full text-gray-400 hover:bg-white/10 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/20" title="Back to IDE">
              <span className="material-symbols-outlined text-2xl">close</span>
            </button>
          </Link>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Top form row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col flex-1">
              <p className="text-gray-300 text-sm font-medium leading-normal pb-2">Contract</p>
              <div className="flex items-center w-full min-w-0 flex-1 rounded-lg border border-white/20 bg-slate-900/50 h-12 px-4">
                <span className="text-gray-200 text-base font-mono leading-normal">MyAwesomeContract.sol</span>
              </div>
            </div>
            <div className="flex flex-col flex-1">
              <p className="text-gray-300 text-sm font-medium leading-normal pb-2">Network</p>
              <select className="form-select appearance-none w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#a855f7] border border-white/20 bg-slate-900/50 focus:border-[#a855f7] h-12 bg-[url('data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20viewBox=%270%200%2024%2024%27%20fill=%27%23a0aec0%27%3e%3cpath%20d=%27M7%2010l5%205%205-5H7z%27/%3e%3c/svg%3e')] bg-no-repeat bg-right-2.5 placeholder:text-gray-500 px-4 text-base font-normal leading-normal">
                <option value="arbitrum-sepolia">Arbitrum Sepolia</option>
                <option value="arbitrum-one">Arbitrum One</option>
                <option value="local-testnet">Local Testnet</option>
              </select>
            </div>
          </div>

          {/* Steps list */}
          <div className="space-y-3">
            {/* Row 1 - Done */}
            <div className="flex items-center gap-4 bg-slate-900/50 px-4 h-16 justify-between rounded-lg border border-white/10">
              <div className="flex items-center gap-4">
                <div className="text-[#22c55e] flex items-center justify-center rounded-full bg-[#22c55e]/20 shrink-0 size-9">
                  <span className="material-symbols-outlined animated-checkmark" style={{ fontVariationSettings: "'FILL' 1, 'wght' 500", fontSize: 22 }}>check_circle</span>
                </div>
                <p className="text-white text-base font-medium leading-normal flex-1 truncate">Compiling Contract</p>
              </div>
              <div className="shrink-0">
                <p className="text-[#22c55e] text-sm font-medium leading-normal">Done</p>
              </div>
            </div>

            {/* Row 2 - In progress */}
            <div className="flex items-center gap-4 bg-slate-900/50 px-4 min-h-[72px] py-2 justify-between rounded-lg border border-[#a855f7]/50 ring-1 ring-[#a855f7]/50 shadow-lg shadow-[rgba(168,85,247,0.1)]">
              <div className="flex items-center gap-4">
                <div className="text-[#a855f7] flex items-center justify-center rounded-full bg-[#a855f7]/20 shrink-0 size-9">
                  <svg className="dynamic-spinner h-5 w-5 text-[#a855f7]" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill="currentColor"></path>
                  </svg>
                </div>
                <div className="flex flex-col justify-center">
                  <p className="text-white text-base font-medium leading-normal line-clamp-1">Upload to Arbitrum</p>
                  <p className="text-gray-300 text-sm font-normal leading-normal line-clamp-2">In progress</p>
                </div>
              </div>
              <div className="shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-24 overflow-hidden rounded-full bg-slate-700 h-2">
                    <div className="h-full rounded-full bg-gradient-to-r from-[#a855f7] to-[#28a0f0] transition-all duration-500" style={{ width: "65%" }}></div>
                  </div>
                  <p className="text-white text-sm font-mono font-medium leading-normal w-9 text-right">65%</p>
                </div>
              </div>
            </div>

            {/* Row 3 - Pending */}
            <div className="flex items-center gap-4 bg-slate-900/50 px-4 h-16 justify-between rounded-lg border border-transparent opacity-60">
              <div className="flex items-center gap-4">
                <div className="text-gray-400 flex items-center justify-center rounded-full bg-white/5 shrink-0 size-9">
                  <span className="material-symbols-outlined" style={{ fontSize: 22 }}>shield</span>
                </div>
                <p className="text-gray-300 text-base font-normal leading-normal flex-1 truncate">Verifying on-chain</p>
              </div>
              <div className="shrink-0">
                <p className="text-gray-500 text-sm font-medium leading-normal">Pending</p>
              </div>
            </div>

            {/* Row 4 - Pending */}
            <div className="flex items-center gap-4 bg-slate-900/50 px-4 h-16 justify-between rounded-lg border border-transparent opacity-60">
              <div className="flex items-center gap-4">
                <div className="text-gray-400 flex items-center justify-center rounded-full bg-white/5 shrink-0 size-9">
                  <span className="material-symbols-outlined" style={{ fontSize: 22 }}>flag</span>
                </div>
                <p className="text-gray-300 text-base font-normal leading-normal flex-1 truncate">Finalizing deployment</p>
              </div>
              <div className="shrink-0">
                <p className="text-gray-500 text-sm font-medium leading-normal">Pending</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 border-t border-white/10 bg-black/20">
          <div className="text-left w-full sm:w-auto">
            <p className="text-gray-400 text-sm">Estimated Gas Cost</p>
            <p className="text-[#22c55e] font-mono text-lg font-medium">0.0042 ETH</p>
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <button className="flex w-full sm:w-auto min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-white/5 text-gray-200 text-base font-medium leading-normal hover:bg-white/10 active:bg-white/5 transition-colors duration-200">
              <span className="truncate">Cancel</span>
            </button>
            <button className="group relative flex w-full sm:w-auto min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-gradient-to-r from-[var(--arbitrum-blue-start)] to-[var(--arbitrum-blue-end)] text-white text-base font-bold leading-normal shadow-lg shadow-[color:var(--arbitrum-blue-start)]/20 transition-all duration-300">
              <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-active:opacity-0"></span>
              <span className="truncate">Deploy for 0.0042 ETH</span>
            </button>
          </div>
        </div>
      </div>

      {/* Page-scoped variables and animations */}
      <style jsx>{`
        :root {
          --arbitrum-blue-start: #28a0f0;
          --arbitrum-blue-end: #0570c9;
        }
        .animated-checkmark {
          animation: checkmark-animation 0.5s ease-out forwards;
          opacity: 0;
        }
        @keyframes checkmark-animation {
          0% { transform: scale(0.5); opacity: 0; }
          50% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        .dynamic-spinner {
          animation: dynamic-spin 1.5s linear infinite;
        }
        @keyframes dynamic-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
