'use client';

import { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Play, Save, Upload, Settings, Bell, Menu } from 'lucide-react';
import Link from 'next/link';

const defaultCode = `use stylus_sdk::prelude::*;

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
}`;

export default function IDEPage() {
  const [code, setCode] = useState(defaultCode);
  const [compiling, setCompiling] = useState(false);
  const [compiled, setCompiled] = useState(false);
  const [activeTab, setActiveTab] = useState('console');

  const handleCompile = async () => {
    setCompiling(true);
    // Simulate compilation
    setTimeout(() => {
      setCompiling(false);
      setCompiled(true);
    }, 2000);
  };

  return (
    <div className="h-screen w-screen flex flex-col text-ide-text bg-ide-bg" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Top Navigation Bar */}
      <header className="bg-ide-sidebar border-b border-ide-border flex items-center justify-between px-3 py-2 shrink-0">
        <div className="flex items-center gap-2">
          <button className="p-1.5 rounded-md hover:bg-white/10 transition-colors">
            <Menu className="w-5 h-5 text-ide-text-secondary" />
          </button>
          <Link href="/" className="flex items-center gap-1.5">
            <svg
              className="w-6 h-6 text-accent-blue"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2L2 7V17L12 22L22 17V7L12 2ZM4 8.236L12 12.736L20 8.236V16.764L12 20.264L4 16.764V8.236ZM12 4.472L18.944 8.5L12 12.528L5.056 8.5L12 4.472Z" />
            </svg>
            <span className="text-sm font-semibold text-ide-text">StylusForge</span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCompile}
            disabled={compiling}
            className="flex items-center gap-2 px-4 py-1.5 rounded-md bg-accent-blue hover:bg-accent-blue/80 text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play className="w-4 h-4" />
            {compiling ? 'Compiling...' : 'Compile'}
          </button>
          <button className="flex items-center gap-2 px-4 py-1.5 rounded-md bg-accent-green hover:bg-accent-green/80 text-white text-sm font-medium transition-colors">
            <Upload className="w-4 h-4" />
            Deploy
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-1.5 rounded-md hover:bg-white/10 transition-colors">
            <Bell className="w-5 h-5 text-ide-text-secondary" />
          </button>
          <button className="p-1.5 rounded-md hover:bg-white/10 transition-colors">
            <Settings className="w-5 h-5 text-ide-text-secondary" />
          </button>
          <Link href="/dashboard">
            <button className="w-8 h-8 rounded-full border-2 border-ide-border overflow-hidden">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=user"
                alt="User avatar"
                className="w-full h-full object-cover"
              />
            </button>
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow overflow-hidden flex">
        {/* Left Sidebar - File Explorer */}
        <aside className="w-64 bg-ide-sidebar border-r border-ide-border flex flex-col">
          <div className="p-3 border-b border-ide-border">
            <h3 className="text-sm font-semibold text-ide-text">Explorer</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            <div className="space-y-1">
              <div className="text-xs text-ide-text-secondary uppercase tracking-wider px-2 py-1">
                Examples
              </div>
              <button className="w-full text-left px-2 py-1 rounded hover:bg-white/5 text-sm text-ide-text flex items-center gap-2">
                <span className="text-accent-orange">📄</span>
                counter.rs
              </button>
              <button className="w-full text-left px-2 py-1 rounded hover:bg-white/5 text-sm text-ide-text flex items-center gap-2">
                <span className="text-accent-orange">📄</span>
                erc20.rs
              </button>
              <button className="w-full text-left px-2 py-1 rounded hover:bg-white/5 text-sm text-ide-text flex items-center gap-2">
                <span className="text-accent-orange">📄</span>
                nft.rs
              </button>
            </div>
            <div className="mt-4 space-y-1">
              <div className="text-xs text-ide-text-secondary uppercase tracking-wider px-2 py-1">
                My Projects
              </div>
              <button className="w-full text-left px-2 py-1 rounded hover:bg-white/5 text-sm text-ide-text flex items-center gap-2">
                <span className="text-accent-orange">📄</span>
                my-contract.rs
              </button>
            </div>
          </div>
          <div className="p-2 border-t border-ide-border">
            <button className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-white/5 hover:bg-white/10 text-sm text-ide-text transition-colors">
              <span>+</span>
              New File
            </button>
          </div>
        </aside>

        {/* Center - Editor */}
        <div className="flex-1 flex flex-col">
          <div className="bg-ide-sidebar/80 backdrop-blur-sm flex items-center justify-between px-4 py-2 border-b border-ide-border">
            <div className="flex items-center gap-4 text-ide-text-secondary text-sm">
              <button className="hover:text-ide-text transition-colors">
                <Save className="w-4 h-4" />
              </button>
            </div>
            <div className="text-sm text-ide-text" style={{ fontFamily: 'JetBrains Mono, monospace' }}>src/lib.rs</div>
            <div className="flex items-center gap-4 text-ide-text-secondary text-sm">
              <span>Rust</span>
            </div>
          </div>

          <div className="flex-1">
            <Editor
              height="100%"
              defaultLanguage="rust"
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value || '')}
              options={{
                minimap: { enabled: true },
                fontSize: 14,
                lineNumbers: 'on',
                rulers: [],
                wordWrap: 'on',
                automaticLayout: true,
              }}
            />
          </div>
        </div>

        {/* Right Panel - Output */}
        <aside className="w-80 bg-ide-sidebar border-l border-ide-border flex flex-col">
          <div className="flex border-b border-ide-border">
            <button
              onClick={() => setActiveTab('console')}
              className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'console'
                  ? 'text-ide-text border-b-2 border-accent-blue'
                  : 'text-ide-text-secondary hover:text-ide-text'
              }`}
            >
              Console
            </button>
            <button
              onClick={() => setActiveTab('gas')}
              className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'gas'
                  ? 'text-ide-text border-b-2 border-accent-blue'
                  : 'text-ide-text-secondary hover:text-ide-text'
              }`}
            >
              Gas Report
            </button>
            <button
              onClick={() => setActiveTab('tests')}
              className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'tests'
                  ? 'text-ide-text border-b-2 border-accent-blue'
                  : 'text-ide-text-secondary hover:text-ide-text'
              }`}
            >
              Tests
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {activeTab === 'console' && (
              <div className="space-y-2">
                {compiled && (
                  <div className="flex items-start gap-2">
                    <span className="text-accent-green text-lg">✓</span>
                    <div>
                      <p className="text-sm text-accent-green font-medium">Compiled successfully</p>
                      <p className="text-xs text-ide-text-secondary mt-1">
                        Compilation time: 2.3s
                      </p>
                    </div>
                  </div>
                )}
                {compiling && (
                  <div className="flex items-start gap-2">
                    <span className="text-accent-blue">⏳</span>
                    <p className="text-sm text-ide-text">Compiling...</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'gas' && compiled && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-ide-text-secondary">Gas Used</span>
                    <span className="text-lg font-bold text-accent-green" style={{ fontFamily: 'JetBrains Mono, monospace' }}>21,000</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-ide-text-secondary">vs Solidity</span>
                    <span className="text-sm text-accent-orange" style={{ fontFamily: 'JetBrains Mono, monospace' }}>85,000</span>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-accent-green/10 border border-accent-green/20">
                  <p className="text-sm text-accent-green font-semibold">💰 75% cheaper!</p>
                  <p className="text-xs text-ide-text-secondary mt-1">
                    You saved 64,000 gas ($12.80)
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'tests' && (
              <div className="text-sm text-ide-text-secondary">
                No tests configured yet.
              </div>
            )}
          </div>
        </aside>
      </main>

      {/* Status Bar */}
      <footer className="bg-ide-sidebar border-t border-ide-border px-4 py-1 flex items-center justify-between text-xs text-ide-text-secondary">
        <div className="flex items-center gap-4">
          <span>✓ Rust 1.75</span>
          <span>Stylus v0.5</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Arbitrum Sepolia</span>
          <span>Ln 12, Col 5</span>
        </div>
      </footer>
    </div>
  );
}
