"use client";

import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark text-white">
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-border-dark px-6 sm:px-10 py-3 fixed top-0 left-0 right-0 bg-background-dark/80 backdrop-blur-sm z-50">
        <div className="flex items-center gap-4">
          <div className="size-6 text-primary">
            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><path d="M6 6H42L36 24L42 42H6L12 24L6 6Z" fill="currentColor"/></svg>
          </div>
          <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">Stylus Platform</h2>
        </div>
        <div className="hidden md:flex items-center gap-9">
          <Link href="/tutorial" className="text-white/80 hover:text-white text-sm font-medium leading-normal transition-colors">Learn</Link>
          <Link href="/ide" className="text-white/80 hover:text-white text-sm font-medium leading-normal transition-colors">IDE</Link>
          <a className="text-white/80 hover:text-white text-sm font-medium leading-normal transition-colors" href="#">Docs</a>
          <a className="text-white/80 hover:text-white text-sm font-medium leading-normal transition-colors" href="#">Community</a>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-card-dark text-white/80 hover:text-white hover:bg-border-dark transition-colors">
            <span className="material-symbols-outlined text-xl">notifications</span>
          </button>
          <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD3ZiKwv45v9PFmNDRlcNYCTQOI7aZq4OKILFX4EdZk2TSCCM78S_qeqhvF_syjJ21lzBYN2j4XSxl4BGEMo_ubSXSzwnmWVL4e9S4Tk8hRO2pvIIEC5k7m0SQtuX1nUaBBUASW9AqF8QSRUHNUAn8nIQTuutwr84FGdFDNYZhvZRR_xXs_LmU49AaN53iH1A_aRKLWrnOI-zN5Dhh9AvStySLB5rgjWJrSOJyOVTZrkjZ89XePiTYy11fz61dGF9OSy9pYToZ8M-Q")'}}></div>
        </div>
      </header>

      <main className="flex flex-1 justify-center py-5 pt-24">
        <div className="flex w-full max-w-7xl flex-col gap-12 px-6 sm:px-10">
          {/* Welcome Section */}
          <div className="flex flex-col md:flex-row flex-wrap justify-between items-start gap-6">
            <div className="flex flex-col gap-2">
              <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em]">Welcome back, Alex!</h1>
            </div>
            <div className="flex flex-col gap-5 p-6 bg-card-dark border border-border-dark rounded-xl flex-1 w-full max-w-lg shadow-lg">
              <div className="flex justify-between items-center gap-4">
                <div className="flex flex-col">
                  <p className="text-white text-base font-medium leading-normal">Level 5</p>
                  <p className="text-text-secondary-dark text-sm font-normal leading-normal font-mono">1500 / 2000 XP</p>
                </div>
                <div className="flex items-center gap-2 text-amber-400">
                  <span className="material-symbols-outlined text-2xl">local_fire_department</span>
                  <span className="font-bold text-lg">5 Day Streak</span>
                </div>
              </div>
              <div className="w-full">
                <div className="rounded-full bg-border-dark h-2.5 overflow-hidden">
                  <div className="h-full rounded-full bg-stylus-purple animate-progress-bar" style={{width: '75%'}}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="stat-card flex flex-col gap-4 rounded-xl p-6 bg-card-dark border border-border-dark transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-text-secondary-dark text-base font-medium leading-normal">Contracts Deployed</p>
                  <p className="text-white tracking-tighter text-5xl font-bold leading-tight font-mono animate-count-up">12</p>
                </div>
                <div className="p-3 rounded-full bg-primary/10 text-primary">
                  <span className="material-symbols-outlined text-3xl stat-icon">rocket_launch</span>
                </div>
              </div>
            </div>
            <div className="stat-card flex flex-col gap-4 rounded-xl p-6 bg-card-dark border border-border-dark transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-text-secondary-dark text-base font-medium leading-normal">Tutorials Completed</p>
                  <p className="text-white tracking-tighter text-5xl font-bold leading-tight font-mono animate-count-up [animation-delay:0.1s]">8</p>
                </div>
                <div className="p-3 rounded-full bg-stylus-purple/10 text-stylus-purple">
                  <span className="material-symbols-outlined text-3xl stat-icon">school</span>
                </div>
              </div>
            </div>
            <div className="stat-card flex flex-col gap-4 rounded-xl p-6 bg-card-dark border border-border-dark transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-text-secondary-dark text-base font-medium leading-normal">Gas Saved (ETH)</p>
                  <p className="text-white tracking-tighter text-5xl font-bold leading-tight font-mono animate-count-up [animation-delay:0.2s]">0.42</p>
                </div>
                <div className="p-3 rounded-full bg-green-500/10 text-green-400">
                  <span className="material-symbols-outlined text-3xl stat-icon">local_gas_station</span>
                </div>
              </div>
            </div>
            <div className="stat-card flex flex-col gap-4 rounded-xl p-6 bg-card-dark border border-border-dark transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-text-secondary-dark text-base font-medium leading-normal">Badges Earned</p>
                  <p className="text-white tracking-tighter text-5xl font-bold leading-tight font-mono animate-count-up [animation-delay:0.3s]">5</p>
                </div>
                <div className="p-3 rounded-full bg-amber-500/10 text-amber-400">
                  <span className="material-symbols-outlined text-3xl stat-icon">military_tech</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Projects */}
          <section className="relative">
            <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] pb-4 pt-5">Recent Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="relative flex flex-col justify-between gap-4 rounded-2xl p-6 bg-white/5 backdrop-blur-xl border border-white/10 transition-all duration-300 ease-in-out group hover:shadow-lg-hover hover:border-white/20 hover:-translate-y-1 overflow-hidden min-h-[160px]">
                <div className="absolute inset-0 bg-gradient-to-br from-card-dark/20 to-transparent opacity-50"></div>
                <div className="flex flex-col gap-2 z-10">
                  <h3 className="text-white text-xl font-bold">DeFi Lending Protocol</h3>
                  <p className="text-text-secondary-dark text-sm font-mono">Last modified: 2 days ago</p>
                </div>
                <Link href="#" className="z-10 flex w-full max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-primary/20 text-primary hover:bg-primary hover:text-white gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-4 transition-all duration-300 border border-primary/50 hover:border-primary group-hover:pl-5">
                  Open
                  <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform duration-300">arrow_forward</span>
                </Link>
              </div>

              <div className="relative flex flex-col justify-between gap-4 rounded-2xl p-6 bg-white/5 backdrop-blur-xl border border-white/10 transition-all duration-300 ease-in-out group hover:shadow-lg-hover hover:border-white/20 hover:-translate-y-1 overflow-hidden min-h-[160px]">
                <div className="absolute inset-0 bg-gradient-to-br from-card-dark/20 to-transparent opacity-50"></div>
                <div className="flex flex-col gap-2 z-10">
                  <h3 className="text-white text-xl font-bold">NFT Marketplace</h3>
                  <p className="text-text-secondary-dark text-sm font-mono">Last modified: 1 week ago</p>
                </div>
                <Link href="#" className="z-10 flex w-full max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-primary/20 text-primary hover:bg-primary hover:text-white gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-4 transition-all duration-300 border border-primary/50 hover:border-primary group-hover:pl-5">
                  Open
                  <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform duration-300">arrow_forward</span>
                </Link>
              </div>

              <div className="relative flex flex-col justify-between gap-4 rounded-2xl p-6 bg-white/5 backdrop-blur-xl border border-white/10 transition-all duration-300 ease-in-out group hover:shadow-lg-hover hover:border-white/20 hover:-translate-y-1 overflow-hidden min-h-[160px]">
                <div className="absolute inset-0 bg-gradient-to-br from-card-dark/20 to-transparent opacity-50"></div>
                <div className="flex flex-col gap-2 z-10">
                  <h3 className="text-white text-xl font-bold">Governance DAO</h3>
                  <p className="text-text-secondary-dark text-sm font-mono">Last modified: 3 weeks ago</p>
                </div>
                <Link href="#" className="z-10 flex w-full max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-primary/20 text-primary hover:bg-primary hover:text-white gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-4 transition-all duration-300 border border-primary/50 hover:border-primary group-hover:pl-5">
                  Open
                  <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform duration-300">arrow_forward</span>
                </Link>
              </div>
            </div>
            <button className="fixed bottom-10 right-10 flex items-center justify-center size-16 rounded-full bg-gradient-to-br from-primary to-stylus-purple text-white shadow-2xl shadow-primary/30 hover:scale-105 hover:shadow-primary/40 transition-all duration-300 z-40">
              <span className="material-symbols-outlined text-4xl">add</span>
            </button>
          </section>

          {/* Achievement Gallery */}
          <section>
            <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] pb-4 pt-5">Achievement Gallery</h2>
            <div className="flex gap-8 overflow-x-auto pb-6 -mx-10 px-10">
              <div className="relative group flex flex-col items-center gap-3 flex-shrink-0 w-32">
                <div className="badge-hover bg-center bg-no-repeat aspect-square bg-cover rounded-full size-28 border-4 border-stylus-purple shadow-lg" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDuDrHYlpbdtnikzJHT-L-TA3VOz77DsiHJmkx58ZFtXHuMk3byivlXoFslI7apyorPBl7CE0oL7UMYlpfabfowYPw08vqkRPxX6bZ35of52AsIk66UKCBnwDygWXU3-nRrO4PoQmBOlgMLhyCKIGD6TxMq143X564B6TeqR7YoUtpnC5-IgltDk_GfvQDGd1nSBOKGrWlcn_BqTx8OU1iL1vYbPYqP8a3YcwwtjFupCcQaCy1fw6gXKrCO05lan0VQS9zxmWdX8r8")'}}></div>
                <p className="text-white text-sm font-medium">First Deploy</p>
                <div className="tooltip absolute bottom-full mb-2 w-max max-w-xs text-center invisible opacity-0 translate-y-2 transition-all duration-300 bg-card-dark text-white text-xs rounded-lg py-2 px-3 border border-border-dark shadow-xl z-10">
                  <strong className="font-bold">First Deploy</strong><br/>Unlocked by deploying your first contract.
                </div>
              </div>
              <div className="relative group flex flex-col items-center gap-3 flex-shrink-0 w-32">
                <div className="badge-hover bg-center bg-no-repeat aspect-square bg-cover rounded-full size-28 border-4 border-stylus-purple shadow-lg" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB7M9WyzbIAL5ED1sv3f3nMnHeKAE6cz85-0V6DQ73onuzT1Ri2hm4p37qMaRqlyo6xDOwBqdSMdevpzURoyfOH6C7gVu7TaWz6AOzuea4z311j8JQN8AnUyIK_K3XrVWYYhj8KUYcoDw2kZ3M1m21Xs1AoiYK4b8awXHz6r6-k0-cNlw81S9J-48dwSpy6tVXUDJ7EKSUGNNZpRh9jKTQEN7B3Bz7ZwSMeJ1XQKFuj71ESd9LvzuVUvOCNSCdPHzliTVFPXn9UC5E")'}}></div>
                <p className="text-white text-sm font-medium">Stylus Scholar</p>
                <div className="tooltip absolute bottom-full mb-2 w-max max-w-xs text-center invisible opacity-0 translate-y-2 transition-all duration-300 bg-card-dark text-white text-xs rounded-lg py-2 px-3 border border-border-dark shadow-xl z-10">
                  <strong className="font-bold">Stylus Scholar</strong><br/>Complete 5 tutorials to earn this badge.
                </div>
              </div>
              <div className="relative group flex flex-col items-center gap-3 flex-shrink-0 w-32">
                <div className="badge-hover bg-center bg-no-repeat aspect-square bg-cover rounded-full size-28 border-4 border-stylus-purple shadow-lg" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBEvrfrxLoegkfOKdM0cA5VsmQa_A36C3jeHZliqbSXpGK3oPkup5jUTgNul1GUlQbUYbSLju2zx8LBTmIScD3pBLTe6vuFMUcPckuek_7nHn6D8Zhm7MNKpxYerDpFTGDx4zh0TnsZiaBVDVhNxyLgAdbwAupX3yoGWcjOT7-E5jCKwxx62X7utA0IpDFEYa4JV_5cCMj6lywujPtQ20DaR_Ccgh3oFsa3VJi6BeNFEhkXNb0xLobLdVcBX7zXmlR56bzUETgkY2w")'}}></div>
                <p className="text-white text-sm font-medium">Gas Saver</p>
                <div className="tooltip absolute bottom-full mb-2 w-max max-w-xs text-center invisible opacity-0 translate-y-2 transition-all duration-300 bg-card-dark text-white text-xs rounded-lg py-2 px-3 border border-border-dark shadow-xl z-10">
                  <strong className="font-bold">Gas Saver</strong><br/>Awarded for significant gas optimization.
                </div>
              </div>
              <div className="relative group flex flex-col items-center gap-3 flex-shrink-0 w-32">
                <div className="badge-hover bg-center bg-no-repeat aspect-square bg-cover rounded-full size-28 border-4 border-stylus-purple shadow-lg" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA85Fs-4ncarvclwWrDk5rA6YD65NiaZUpWziGEnIUuVVlHXzZI3W6VcyROTLj0dXjb3a4V0gyZYG1lpfgy59OS_BXB74IG3s7jnd1L8QGolrqzltP-Op53_XfdFsFSKdtqaCdaDkr13rKg9kkhAbK8UkwjFtrbB0gMpBUUebyRfkLKIichnJLMEqwfLxxbPejTNyz9C-oTV0WIBCJ1b_jZZeBBvN1pj-qU4Z2Lb4vBEIyT31P8_RI0Z8hAw86wk3wrT22AjMvjI8s")'}}></div>
                <p className="text-white text-sm font-medium">Week Streak</p>
                <div className="tooltip absolute bottom-full mb-2 w-max max-w-xs text-center invisible opacity-0 translate-y-2 transition-all duration-300 bg-card-dark text-white text-xs rounded-lg py-2 px-3 border border-border-dark shadow-xl z-10">
                  <strong className="font-bold">Week Streak</strong><br/>Maintain a 7-day coding streak.
                </div>
              </div>
              <div className="relative group flex flex-col items-center gap-3 flex-shrink-0 w-32">
                <div className="badge-hover bg-center bg-no-repeat aspect-square bg-cover rounded-full size-28 border-4 border-stylus-purple shadow-lg" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBYrxE5Lv48INx_9riS6Fv4dRn0y2xmthwId6w0P7dpytSmfblxViWeefZd1rNfbEG34cgGwfFoKVPyNxwHjJ_Ze1_cddiRl8AMhQUtbJc6jVSIZ3-TYFv7sA1CpMAdNElsUW00ngqFDcdwZCV0eWnKM04RQoyi6Rkcf3qX_lB8D0z6haeD1kNEKZvXss6-1u-KwC9B_JiTcOWCvsf3o0p8wZGUWlPFEBhwYsX3mupEBGjRs-mhl1F36qoHbH-7c9uomHQUNdpxnuc")'}}></div>
                <p className="text-white text-sm font-medium">Contributor</p>
                <div className="tooltip absolute bottom-full mb-2 w-max max-w-xs text-center invisible opacity-0 translate-y-2 transition-all duration-300 bg-card-dark text-white text-xs rounded-lg py-2 px-3 border border-border-dark shadow-xl z-10">
                  <strong className="font-bold">Contributor</strong><br/>Contribute to a community project.
                </div>
              </div>
              <div className="relative group flex flex-col items-center gap-3 flex-shrink-0 w-32">
                <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-28 border-4 border-border-dark bg-card-dark opacity-50 transition-opacity duration-300 group-hover:opacity-60"></div>
                <p className="text-text-secondary-dark text-sm font-medium">Locked</p>
                <div className="tooltip absolute bottom-full mb-2 w-max max-w-xs text-center invisible opacity-0 translate-y-2 transition-all duration-300 bg-card-dark text-white text-xs rounded-lg py-2 px-3 border border-border-dark shadow-xl z-10">
                  <strong className="font-bold">Locked Achievement</strong><br/>Keep learning to unlock new badges.
                </div>
              </div>
            </div>
          </section>

          {/* Learning Path */}
          <section>
            <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] pb-4 pt-5">Your Learning Path</h2>
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 rounded-2xl p-8 bg-card-dark border border-border-dark">
              <div className="flex-1 w-full">
                <p className="text-text-secondary-dark text-sm font-medium uppercase tracking-wider">Next Up</p>
                <h3 className="text-white text-xl font-bold mt-1">Mastering State Variables</h3>
                <div className="relative w-full mt-6">
                  <div className="relative w-full h-3 rounded-full bg-border-dark overflow-hidden">
                    <div className="animate-progress-bar-learning h-full rounded-full bg-gradient-to-r from-primary to-stylus-purple"></div>
                    <div className="absolute top-0 left-1/4 w-0.5 h-full bg-background-dark"></div>
                    <div className="absolute top-0 left-1/2 w-0.5 h-full bg-background-dark"></div>
                    <div className="absolute top-0 left-3/4 w-0.5 h-full bg-background-dark"></div>
                  </div>
                  <div className="flex justify-between text-xs font-mono text-text-secondary-dark mt-2">
                    <span>0%</span>
                    <span className="text-white font-bold">40%</span>
                    <span>100%</span>
                  </div>
                  <div className="absolute top-1/2 -mt-1.5 h-3" style={{left: '25%'}}>
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-mono text-text-secondary-dark">M1</span>
                    <div className="size-3 rounded-full bg-border-dark border-2 border-background-dark"></div>
                  </div>
                  <div className="absolute top-1/2 -mt-1.5 h-3" style={{left: '50%'}}>
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-mono text-text-secondary-dark">M2</span>
                    <div className="size-3 rounded-full bg-border-dark border-2 border-background-dark"></div>
                  </div>
                  <div className="absolute top-1/2 -mt-1.5 h-3" style={{left: '75%'}}>
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-mono text-text-secondary-dark">M3</span>
                    <div className="size-3 rounded-full bg-border-dark border-2 border-background-dark"></div>
                  </div>
                </div>
              </div>
              <Link href="/tutorial" className="group relative flex w-full md:w-auto shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-800 px-6 h-12 text-base font-bold text-white transition-all duration-300 hover:scale-105 active:scale-95">
                <span className="absolute inset-0 bg-gradient-to-r from-primary to-stylus-purple opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
                <span className="relative flex items-center gap-2">
                  Continue Learning
                  <span className="material-symbols-outlined transition-transform duration-300 group-hover:translate-x-1">arrow_forward</span>
                </span>
              </Link>
            </div>
          </section>
        </div>
      </main>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes count-up {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes progress-bar-anim {
          from { width: 0%; }
          to { width: 75%; }
        }
        @keyframes progress-bar-learning {
          from { width: 0%; }
          to { width: 40%; }
        }
        .animate-count-up { animation: count-up 0.8s ease-out forwards; }
        .animate-progress-bar { animation: progress-bar-anim 1.5s ease-out forwards; }
        .animate-progress-bar-learning { animation: progress-bar-learning 1.5s ease-out forwards; }
        .badge-hover { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .badge-hover:hover { transform: scale(1.1) rotate(5deg); }
        .stat-card:hover .stat-icon { transform: translateY(-4px) scale(1.1); filter: drop-shadow(0 0 8px currentColor); }
        .stat-card .stat-icon { transition: transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1), filter 0.3s ease; }
        .group:hover .tooltip { opacity: 1; transform: translateY(0); visibility: visible; }
      `}</style>
    </div>
  );
}
