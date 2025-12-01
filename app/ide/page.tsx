'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function IDEPage() {
  const [compiling, setCompiling] = useState(false);

  const handleCompile = () => {
    setCompiling(true);
    setTimeout(() => {
      setCompiling(false);
    }, 2000);
  };

  return (
    <div className="relative flex h-screen w-full flex-col bg-background-light dark:bg-[#101b22] text-white overflow-hidden">
      {/* Header */}
      <header className="flex h-[60px] flex-none items-center justify-between whitespace-nowrap border-b border-solid border-white/10 px-4">
        <div className="flex items-center gap-4 text-white">
          <div className="size-6 text-primary">
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
          <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">Stylus IDE</h2>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-6 text-sm font-medium text-gray-300">
            <a className="hover:text-white transition-colors duration-200" href="#">File</a>
            <a className="hover:text-white transition-colors duration-200" href="#">Edit</a>
            <a className="hover:text-white transition-colors duration-200" href="#">View</a>
          </div>
        </div>
        <div className="flex flex-1 items-center justify-end gap-2">
          <button 
            onClick={handleCompile}
            data-loading={compiling}
            className="group flex min-w-[110px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-md h-9 px-4 bg-gradient-to-br from-[#28a0f0] to-[#0d87e3] text-white text-sm font-bold leading-normal tracking-[0.015em] transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/20 hover:from-[#3ab0ff] hover:to-[#1e97f3]"
          >
            <span className="group-data-[loading=true]:hidden truncate">Compile</span>
            <div className="hidden group-data-[loading=true]:flex items-center justify-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/50 border-t-white"></div>
              <span className="truncate">Compiling</span>
            </div>
          </button>
          <button className="group flex min-w-[100px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-md h-9 px-4 bg-gradient-to-br from-[#28a745] to-[#218838] text-white text-sm font-bold leading-normal tracking-[0.015em] transition-all duration-200 hover:shadow-lg hover:shadow-green-500/20 hover:from-[#32c954] hover:to-[#28a745]">
            <span className="truncate">Deploy</span>
          </button>
          <div className="flex items-center gap-1 pl-4">
            <button className="flex h-9 w-9 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-transparent text-gray-300 transition-colors duration-200 hover:bg-white/10 hover:text-white">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="flex h-9 w-9 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-transparent text-gray-300 transition-colors duration-200 hover:bg-white/10 hover:text-white">
              <span className="material-symbols-outlined">settings</span>
            </button>
            <Link href="/dashboard">
              <div className="ml-2 bg-center bg-no-repeat aspect-square bg-cover rounded-full size-9 cursor-pointer" style={{backgroundImage: 'url("https://api.dicebear.com/7.x/avataaars/svg?seed=user")'}}></div>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - File Explorer */}
        <aside className="flex h-full w-[250px] flex-none flex-col justify-between border-r border-solid border-white/10 bg-[#1e1e1e] p-2">
          <div className="flex flex-col gap-2">
            <div className="flex flex-col px-2 pb-2">
              <h1 className="text-gray-400 text-xs font-bold uppercase tracking-wider">EXPLORER</h1>
              <p className="text-gray-300 text-sm font-normal leading-normal">MY-STYLUS-PROJECT</p>
            </div>
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-white/5 cursor-pointer transition-colors duration-150">
                <span className="material-symbols-outlined text-gray-300 text-base transition-transform duration-200 ease-in-out">expand_more</span>
                <span className="material-symbols-outlined text-gray-300 text-lg -ml-2">folder_open</span>
                <p className="text-white text-sm font-medium leading-normal">src</p>
              </div>
              <div className="flex items-center gap-2 pl-7 pr-2 py-1.5 rounded bg-blue-500/10 border border-blue-500/20">
                <svg className="h-4 w-4 text-[#DEA584]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 12 6 6l-3 3 3 3 3-3 3 3-3 3 3 3 6-6-3-3-3 3-3-3zM9 9l6 6"></path>
                </svg>
                <p className="text-white text-sm font-medium leading-normal">main.rs</p>
              </div>
              <div className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-white/5 cursor-pointer transition-colors duration-150">
                <span className="material-symbols-outlined text-gray-300 text-base transition-transform duration-200 ease-in-out">chevron_right</span>
                <span className="material-symbols-outlined text-gray-300 text-lg -ml-2">folder</span>
                <p className="text-white text-sm font-medium leading-normal">target</p>
              </div>
              <div className="flex items-center gap-2 pl-[2.125rem] pr-2 py-1.5 rounded hover:bg-white/5 cursor-pointer transition-colors duration-150">
                <svg className="h-4 w-4 text-[#F0D879]" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5a2.5 2.5 0 0 1 5 0v10.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5V6H10v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-1.93-1.57-3.5-3.5-3.5S8 3.07 8 5v11.5c0 2.76 2.24 5 5 5s5-2.24 5-5V6h-1.5z"></path>
                </svg>
                <p className="text-white text-sm font-medium leading-normal">Cargo.toml</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Editor Section */}
        <section className="flex flex-1 flex-col bg-[#1E1E1E]">
          <div className="flex-none border-b border-solid border-white/10">
            <div className="flex items-center bg-[#252526] px-4 py-2 text-sm text-gray-300 w-fit">
              <svg className="h-4 w-4 text-[#DEA584] mr-2" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12 6 6l-3 3 3 3 3-3 3 3-3 3 3 3 6-6-3-3-3 3-3-3zM9 9l6 6"></path>
              </svg>
              <span>main.rs</span>
              <span className="material-symbols-outlined ml-2 text-xs cursor-pointer hover:bg-white/10 rounded p-0.5">close</span>
            </div>
          </div>
          <div className="flex flex-1 overflow-hidden font-mono text-[14px] leading-6 relative">
            <div className="w-12 flex-none py-2 text-right pr-4 text-gray-600 select-none">
              <div>1</div>
              <div>2</div>
              <div>3</div>
              <div>4</div>
              <div>5</div>
              <div>6</div>
              <div>7</div>
              <div>8</div>
              <div>9</div>
              <div>10</div>
              <div>11</div>
              <div>12</div>
              <div>13</div>
              <div>14</div>
              <div>15</div>
            </div>
            <div className="flex-1 py-2 text-[#D4D4D4] whitespace-pre">
              <div><span className="text-[#569CD6]">#[stylus_sdk::prelude]</span></div>
              <div><span className="text-[#569CD6]">use</span> stylus_sdk::prelude::*;</div>
              <div></div>
              <div><span className="text-[#569CD6]">#[storage]</span></div>
              <div><span className="text-[#569CD6]">#[entrypoint]</span></div>
              <div><span className="text-[#569CD6]">pub struct</span> <span className="text-[#4EC9B0]">Counter</span> {'{'}</div>
              <div>    count: <span className="text-[#4EC9B0]">StorageU256</span>,</div>
              <div>{'}'}</div>
              <div></div>
              <div><span className="text-[#569CD6]">#[external]</span></div>
              <div><span className="text-[#569CD6]">impl</span> <span className="text-[#4EC9B0]">Counter</span> {'{'}</div>
              <div>    <span className="text-[#569CD6]">pub fn</span> <span className="text-[#DCDCAA]">increment</span>(&<span className="text-[#569CD6]">mut</span> <span className="text-[#569CD6]">self</span>) -{'>'} <span className="text-[#4EC9B0]">Result</span>{'<(), Vec<u8>>'} {'{'}</div>
              <div>        <span className="text-[#569CD6]">let</span> count = <span className="text-[#569CD6]">self</span>.count.<span className="text-[#DCDCAA]">get</span>() + <span className="text-[#4EC9B0]">U256</span>::<span className="text-[#DCDCAA]">from</span>(<span className="text-[#B5CEA8]">1</span>);</div>
              <div>        <span className="text-[#569CD6]">self</span>.count.<span className="text-[#DCDCAA]">set</span>(count);</div>
              <div>        <span className="text-[#569CD6]">Ok</span>(())</div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
