'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useDeployment } from '@/lib/hooks/useDeployment';
import { useRouter, useSearchParams } from 'next/navigation';

type DeploymentStep = 'compile' | 'upload' | 'verify' | 'finalize';

export default function DeployPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { deploy, connectWallet, getBalance, isDeploying, deploymentResult, connectedAddress } = useDeployment();
  
  const [currentStep, setCurrentStep] = useState<DeploymentStep>('compile');
  const [progress, setProgress] = useState(0);
  const [network, setNetwork] = useState<'arbitrum-sepolia' | 'arbitrum-mainnet'>('arbitrum-sepolia');
  const [contractCode, setContractCode] = useState('');
  const [contractName, setContractName] = useState('MyContract.rs');
  const [gasEstimate, setGasEstimate] = useState('0.0042');
  const [userBalance, setUserBalance] = useState('0.0');
  const [error, setError] = useState<string | null>(null);
  const [metamaskStatus, setMetamaskStatus] = useState<'checking' | 'installed' | 'not-installed' | 'locked'>('checking');

  // Check MetaMask status on mount
  useEffect(() => {
    const checkMetaMask = async () => {
      if (typeof window === 'undefined') {
        setMetamaskStatus('not-installed');
        return;
      }

      const ethereum = (window as any).ethereum;
      
      if (!ethereum) {
        setMetamaskStatus('not-installed');
        console.log('❌ MetaMask not detected');
        return;
      }

      // MetaMask is installed, mark as ready
      setMetamaskStatus('installed');
      console.log('✅ MetaMask extension detected');
    };

    checkMetaMask();
  }, []);

  // Load contract code from URL params or localStorage
  useEffect(() => {
    const code = searchParams?.get('code') || localStorage.getItem('currentContract') || '';
    const name = searchParams?.get('name') || localStorage.getItem('contractName') || 'MyContract.rs';
    setContractCode(code);
    setContractName(name);
  }, [searchParams]);

  // Load user balance when wallet connects
  useEffect(() => {
    if (connectedAddress) {
      getBalance(connectedAddress).then(balance => {
        const balanceNum = parseFloat(balance);
        setUserBalance(balanceNum.toFixed(4));
        
        // Show info banner if balance is too low
        if (balanceNum < 0.001) {
          console.log('💡 Demo mode will be used (insufficient testnet ETH)');
        }
      });
    }
  }, [connectedAddress, getBalance]);

  const handleConnect = async () => {
    try {
      setError(null);
      await connectWallet();
    } catch (err: any) {
      console.error('Connect wallet error:', err);
      const errorMessage = err?.message || 'Failed to connect wallet';
      setError(errorMessage);
      
      // Show user-friendly message
      if (errorMessage.includes('MetaMask is not installed')) {
        alert('Please install MetaMask extension to deploy contracts.\n\nVisit: https://metamask.io/download/');
      }
    }
  };

  const handleDeploy = async () => {
    if (!contractCode) {
      setError('No contract code to deploy');
      return;
    }

    if (!connectedAddress) {
      await handleConnect();
      return;
    }

    try {
      setError(null);
      setCurrentStep('compile');
      setProgress(10);

      console.log('🚀 Starting deployment process...');

      // Step 1: Compile
      setProgress(25);
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setCurrentStep('upload');
      setProgress(40);
      console.log('📤 Uploading to network...');

      // Step 2: Deploy
      const result = await deploy({
        code: contractCode,
        network: network as 'arbitrum-sepolia' | 'arbitrum-mainnet',
      });

      if (!result.success) {
        throw new Error(result.error || 'Deployment failed');
      }

      setProgress(65);
      setCurrentStep('verify');
      console.log('✅ Contract deployed:', result.contractAddress);
      await new Promise(resolve => setTimeout(resolve, 500));

      setProgress(85);
      setCurrentStep('finalize');
      await new Promise(resolve => setTimeout(resolve, 500));

      setProgress(100);
      console.log('🎉 Deployment complete!');

      // Save deployment to Firestore if user is logged in
      if (typeof window !== 'undefined') {
        try {
          const { auth } = await import('@/lib/firebase/config');
          const { projectService } = await import('@/lib/services/project.service');
          
          if (auth.currentUser) {
            // Update the project as deployed if it exists
            const projectId = localStorage.getItem('currentProjectId');
            if (projectId) {
              await projectService.markAsDeployed(
                projectId,
                result.contractAddress!,
                network
              );
              console.log('📝 Project marked as deployed in database');
            }
          }
        } catch (dbError) {
          console.warn('Could not save to database:', dbError);
          // Don't fail deployment if database save fails
        }
      }

      // Redirect to success page
      setTimeout(() => {
        router.push(`/deploy/success?address=${result.contractAddress}&tx=${result.transactionHash}&network=${network}`);
      }, 500);

    } catch (err: any) {
      console.error('❌ Deployment failed:', err);
      setError(err?.message || 'Deployment failed');
      setCurrentStep('compile');
      setProgress(0);
    }
  };

  const getStepStatus = (step: DeploymentStep): 'done' | 'active' | 'pending' => {
    const steps: DeploymentStep[] = ['compile', 'upload', 'verify', 'finalize'];
    const currentIndex = steps.indexOf(currentStep);
    const stepIndex = steps.indexOf(step);
    
    if (stepIndex < currentIndex) return 'done';
    if (stepIndex === currentIndex) return 'active';
    return 'pending';
  };

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
          <div className="flex items-center gap-3">
            {/* Wallet Info Display */}
            {connectedAddress && (
              <div className="flex items-center gap-2 bg-slate-800/50 rounded-lg px-3 py-2 border border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <div className="flex flex-col">
                    <span className="text-gray-400 text-xs">
                      {network === 'arbitrum-sepolia' ? 'Arbitrum Sepolia' : 'Arbitrum One'}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-mono text-sm font-medium">{userBalance} ETH</span>
                      <span className="text-gray-500 text-xs font-mono">
                        {connectedAddress.slice(0, 6)}...{connectedAddress.slice(-4)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <Link href="/ide">
              <button className="flex items-center justify-center p-1.5 rounded-full text-gray-400 hover:bg-white/10 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/20" title="Back to IDE">
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </Link>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* MetaMask Status Banner */}
          {metamaskStatus === 'not-installed' && (
            <div className="bg-orange-500/10 border border-orange-500/50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-orange-400 text-xl flex-shrink-0 mt-0.5">warning</span>
                <div className="flex-1">
                  <p className="text-orange-400 font-semibold text-sm mb-1">MetaMask Not Detected</p>
                  <p className="text-orange-300 text-sm mb-3">Please install MetaMask browser extension to deploy contracts.</p>
                  <a 
                    href="https://metamask.io/download/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-500/20 hover:bg-orange-500/30 rounded text-orange-300 text-sm font-medium transition-colors"
                  >
                    Install MetaMask
                    <span className="material-symbols-outlined text-base">open_in_new</span>
                  </a>
                </div>
              </div>
            </div>
          )}
          
          {metamaskStatus === 'locked' && !connectedAddress && (
            <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-yellow-400 text-xl flex-shrink-0 mt-0.5">lock</span>
                <div className="flex-1">
                  <p className="text-yellow-400 font-semibold text-sm mb-1">MetaMask Setup Required</p>
                  <p className="text-yellow-300 text-sm">Please unlock MetaMask and make sure you have at least one account created. Then click "Connect Wallet" below.</p>
                </div>
              </div>
            </div>
          )}

          {/* Low Balance Warning */}
          {connectedAddress && parseFloat(userBalance) < 0.0001 && !error && (
            <div className="bg-orange-500/10 border border-orange-500/50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-orange-400 text-xl flex-shrink-0 mt-0.5">warning</span>
                <div className="flex-1">
                  <p className="text-orange-400 font-semibold text-sm mb-1">Insufficient Balance</p>
                  <p className="text-orange-300 text-sm mb-3">
                    You need at least 0.0001 ETH on Arbitrum Sepolia to deploy. Current balance: {userBalance} ETH
                  </p>
                  <div className="space-y-2">
                    <p className="text-orange-200 text-xs font-semibold">Get testnet ETH:</p>
                    <div className="flex flex-wrap gap-2">
                      <a 
                        href="https://sepoliafaucet.com/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-500/20 hover:bg-orange-500/30 rounded text-orange-300 text-xs font-medium transition-colors"
                      >
                        1. Get Sepolia ETH
                        <span className="material-symbols-outlined text-sm">open_in_new</span>
                      </a>
                      <a 
                        href="https://bridge.arbitrum.io/?destinationChain=arbitrum-sepolia&sourceChain=sepolia" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-500/20 hover:bg-orange-500/30 rounded text-orange-300 text-xs font-medium transition-colors"
                      >
                        2. Bridge to Arbitrum
                        <span className="material-symbols-outlined text-sm">open_in_new</span>
                      </a>
                      <button
                        onClick={async () => {
                          try {
                            await (window as any).ethereum.request({
                              method: 'wallet_addEthereumChain',
                              params: [{
                                chainId: '0x66eee',
                                chainName: 'Arbitrum Sepolia',
                                nativeCurrency: {
                                  name: 'ETH',
                                  symbol: 'ETH',
                                  decimals: 18,
                                },
                                rpcUrls: ['https://sepolia-rollup.arbitrum.io/rpc'],
                                blockExplorerUrls: ['https://sepolia.arbiscan.io'],
                              }],
                            });
                            alert('✅ Arbitrum Sepolia network added to MetaMask!');
                          } catch (err) {
                            console.error('Failed to add network:', err);
                          }
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-500/20 hover:bg-green-500/30 rounded text-green-300 text-xs font-medium transition-colors"
                      >
                        Add Network to MetaMask
                        <span className="material-symbols-outlined text-sm">add</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-red-400 text-xl flex-shrink-0 mt-0.5">error</span>
                <div className="flex-1">
                  <p className="text-red-400 font-semibold text-sm mb-1">Deployment Error</p>
                  <p className="text-red-300 text-sm">{error}</p>
                  {error.includes('MetaMask is not installed') && (
                    <a 
                      href="https://metamask.io/download/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 mt-3 px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 rounded text-red-300 text-sm font-medium transition-colors"
                    >
                      Download MetaMask
                      <span className="material-symbols-outlined text-sm">open_in_new</span>
                    </a>
                  )}
                </div>
                <button 
                  onClick={() => setError(null)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>
              </div>
            </div>
          )}

          {/* Wallet Connection */}
          {!connectedAddress && (
            <div className="bg-blue-500/10 border border-blue-500/50 rounded-lg p-4">
              <p className="text-blue-400 text-sm mb-2">Connect your wallet to deploy</p>
              <button 
                onClick={handleConnect}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-medium transition-colors"
              >
                Connect Wallet
              </button>
            </div>
          )}

          {/* Top form row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col flex-1">
              <p className="text-gray-300 text-sm font-medium leading-normal pb-2">Contract</p>
              <div className="flex items-center w-full min-w-0 flex-1 rounded-lg border border-white/20 bg-slate-900/50 h-12 px-4">
                <span className="text-gray-200 text-base font-mono leading-normal truncate">{contractName}</span>
              </div>
            </div>
            <div className="flex flex-col flex-1">
              <p className="text-gray-300 text-sm font-medium leading-normal pb-2">Network</p>
              <select 
                value={network}
                onChange={(e) => setNetwork(e.target.value as any)}
                disabled={isDeploying}
                className="form-select appearance-none w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#a855f7] border border-white/20 bg-slate-900/50 focus:border-[#a855f7] h-12 bg-[url('data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20viewBox=%270%200%2024%2024%27%20fill=%27%23a0aec0%27%3e%3cpath%20d=%27M7%2010l5%205%205-5H7z%27/%3e%3c/svg%3e')] bg-no-repeat bg-right-2.5 placeholder:text-gray-500 px-4 text-base font-normal leading-normal disabled:opacity-50 disabled:cursor-not-allowed">
                <option value="arbitrum-sepolia">Arbitrum Sepolia</option>
                <option value="arbitrum-mainnet">Arbitrum One</option>
              </select>
            </div>
          </div>

          {/* Steps list */}
          <div className="space-y-3">
            {/* Row 1 - Compile */}
            <div className={`flex items-center gap-4 bg-slate-900/50 px-4 h-16 justify-between rounded-lg border ${
              getStepStatus('compile') === 'done' ? 'border-white/10' : 
              getStepStatus('compile') === 'active' ? 'border-[#a855f7]/50 ring-1 ring-[#a855f7]/50 shadow-lg shadow-[rgba(168,85,247,0.1)]' : 
              'border-transparent opacity-60'
            }`}>
              <div className="flex items-center gap-4">
                <div className={`flex items-center justify-center rounded-full shrink-0 size-9 ${
                  getStepStatus('compile') === 'done' ? 'text-[#22c55e] bg-[#22c55e]/20' :
                  getStepStatus('compile') === 'active' ? 'text-[#a855f7] bg-[#a855f7]/20' :
                  'text-gray-400 bg-white/5'
                }`}>
                  {getStepStatus('compile') === 'done' ? (
                    <span className="material-symbols-outlined animated-checkmark" style={{ fontVariationSettings: "'FILL' 1, 'wght' 500", fontSize: 22 }}>check_circle</span>
                  ) : getStepStatus('compile') === 'active' ? (
                    <svg className="dynamic-spinner h-5 w-5" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill="currentColor"></path>
                    </svg>
                  ) : (
                    <span className="material-symbols-outlined" style={{ fontSize: 22 }}>code</span>
                  )}
                </div>
                <p className={`text-base font-medium leading-normal flex-1 truncate ${
                  getStepStatus('compile') === 'pending' ? 'text-gray-300' : 'text-white'
                }`}>Compiling Contract</p>
              </div>
              <div className="shrink-0">
                <p className={`text-sm font-medium leading-normal ${
                  getStepStatus('compile') === 'done' ? 'text-[#22c55e]' :
                  getStepStatus('compile') === 'active' ? 'text-white' :
                  'text-gray-500'
                }`}>
                  {getStepStatus('compile') === 'done' ? 'Done' : 
                   getStepStatus('compile') === 'active' ? 'In Progress' : 
                   'Pending'}
                </p>
              </div>
            </div>

            {/* Row 2 - Upload */}
            <div className={`flex items-center gap-4 bg-slate-900/50 px-4 min-h-[72px] py-2 justify-between rounded-lg border ${
              getStepStatus('upload') === 'done' ? 'border-white/10' : 
              getStepStatus('upload') === 'active' ? 'border-[#a855f7]/50 ring-1 ring-[#a855f7]/50 shadow-lg shadow-[rgba(168,85,247,0.1)]' : 
              'border-transparent opacity-60'
            }`}>
              <div className="flex items-center gap-4">
                <div className={`flex items-center justify-center rounded-full shrink-0 size-9 ${
                  getStepStatus('upload') === 'done' ? 'text-[#22c55e] bg-[#22c55e]/20' :
                  getStepStatus('upload') === 'active' ? 'text-[#a855f7] bg-[#a855f7]/20' :
                  'text-gray-400 bg-white/5'
                }`}>
                  {getStepStatus('upload') === 'done' ? (
                    <span className="material-symbols-outlined animated-checkmark" style={{ fontVariationSettings: "'FILL' 1, 'wght' 500", fontSize: 22 }}>check_circle</span>
                  ) : getStepStatus('upload') === 'active' ? (
                    <svg className="dynamic-spinner h-5 w-5" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill="currentColor"></path>
                    </svg>
                  ) : (
                    <span className="material-symbols-outlined" style={{ fontSize: 22 }}>cloud_upload</span>
                  )}
                </div>
                <div className="flex flex-col justify-center">
                  <p className={`text-base font-medium leading-normal line-clamp-1 ${
                    getStepStatus('upload') === 'pending' ? 'text-gray-300' : 'text-white'
                  }`}>Upload to Arbitrum</p>
                  {getStepStatus('upload') === 'active' && (
                    <p className="text-gray-300 text-sm font-normal leading-normal line-clamp-2">Deploying to {network}</p>
                  )}
                </div>
              </div>
              {getStepStatus('upload') === 'active' && (
                <div className="shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="w-24 overflow-hidden rounded-full bg-slate-700 h-2">
                      <div className="h-full rounded-full bg-gradient-to-r from-[#a855f7] to-[#28a0f0] transition-all duration-500" style={{ width: `${progress}%` }}></div>
                    </div>
                    <p className="text-white text-sm font-mono font-medium leading-normal w-9 text-right">{progress}%</p>
                  </div>
                </div>
              )}
              {getStepStatus('upload') !== 'active' && (
                <div className="shrink-0">
                  <p className={`text-sm font-medium leading-normal ${
                    getStepStatus('upload') === 'done' ? 'text-[#22c55e]' : 'text-gray-500'
                  }`}>
                    {getStepStatus('upload') === 'done' ? 'Done' : 'Pending'}
                  </p>
                </div>
              )}
            </div>

            {/* Row 3 - Verify */}
            <div className={`flex items-center gap-4 bg-slate-900/50 px-4 h-16 justify-between rounded-lg border ${
              getStepStatus('verify') === 'done' ? 'border-white/10' : 
              getStepStatus('verify') === 'active' ? 'border-[#a855f7]/50 ring-1 ring-[#a855f7]/50 shadow-lg shadow-[rgba(168,85,247,0.1)]' : 
              'border-transparent opacity-60'
            }`}>
              <div className="flex items-center gap-4">
                <div className={`flex items-center justify-center rounded-full shrink-0 size-9 ${
                  getStepStatus('verify') === 'done' ? 'text-[#22c55e] bg-[#22c55e]/20' :
                  getStepStatus('verify') === 'active' ? 'text-[#a855f7] bg-[#a855f7]/20' :
                  'text-gray-400 bg-white/5'
                }`}>
                  {getStepStatus('verify') === 'done' ? (
                    <span className="material-symbols-outlined animated-checkmark" style={{ fontVariationSettings: "'FILL' 1, 'wght' 500", fontSize: 22 }}>check_circle</span>
                  ) : getStepStatus('verify') === 'active' ? (
                    <svg className="dynamic-spinner h-5 w-5" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill="currentColor"></path>
                    </svg>
                  ) : (
                    <span className="material-symbols-outlined" style={{ fontSize: 22 }}>shield</span>
                  )}
                </div>
                <p className={`text-base font-normal leading-normal flex-1 truncate ${
                  getStepStatus('verify') === 'pending' ? 'text-gray-300' : 'text-white'
                }`}>Verifying on-chain</p>
              </div>
              <div className="shrink-0">
                <p className={`text-sm font-medium leading-normal ${
                  getStepStatus('verify') === 'done' ? 'text-[#22c55e]' :
                  getStepStatus('verify') === 'active' ? 'text-white' :
                  'text-gray-500'
                }`}>
                  {getStepStatus('verify') === 'done' ? 'Done' : 
                   getStepStatus('verify') === 'active' ? 'In Progress' : 
                   'Pending'}
                </p>
              </div>
            </div>

            {/* Row 4 - Finalize */}
            <div className={`flex items-center gap-4 bg-slate-900/50 px-4 h-16 justify-between rounded-lg border ${
              getStepStatus('finalize') === 'done' ? 'border-white/10' : 
              getStepStatus('finalize') === 'active' ? 'border-[#a855f7]/50 ring-1 ring-[#a855f7]/50 shadow-lg shadow-[rgba(168,85,247,0.1)]' : 
              'border-transparent opacity-60'
            }`}>
              <div className="flex items-center gap-4">
                <div className={`flex items-center justify-center rounded-full shrink-0 size-9 ${
                  getStepStatus('finalize') === 'done' ? 'text-[#22c55e] bg-[#22c55e]/20' :
                  getStepStatus('finalize') === 'active' ? 'text-[#a855f7] bg-[#a855f7]/20' :
                  'text-gray-400 bg-white/5'
                }`}>
                  {getStepStatus('finalize') === 'done' ? (
                    <span className="material-symbols-outlined animated-checkmark" style={{ fontVariationSettings: "'FILL' 1, 'wght' 500", fontSize: 22 }}>check_circle</span>
                  ) : getStepStatus('finalize') === 'active' ? (
                    <svg className="dynamic-spinner h-5 w-5" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill="currentColor"></path>
                    </svg>
                  ) : (
                    <span className="material-symbols-outlined" style={{ fontSize: 22 }}>flag</span>
                  )}
                </div>
                <p className={`text-base font-normal leading-normal flex-1 truncate ${
                  getStepStatus('finalize') === 'pending' ? 'text-gray-300' : 'text-white'
                }`}>Finalizing deployment</p>
              </div>
              <div className="shrink-0">
                <p className={`text-sm font-medium leading-normal ${
                  getStepStatus('finalize') === 'done' ? 'text-[#22c55e]' :
                  getStepStatus('finalize') === 'active' ? 'text-white' :
                  'text-gray-500'
                }`}>
                  {getStepStatus('finalize') === 'done' ? 'Done' : 
                   getStepStatus('finalize') === 'active' ? 'In Progress' : 
                   'Pending'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 border-t border-white/10 bg-black/20">
          <div className="text-left w-full sm:w-auto">
            <p className="text-gray-400 text-sm">Estimated Gas Cost</p>
            <p className="text-[#22c55e] font-mono text-lg font-medium">{gasEstimate} ETH</p>
            {connectedAddress && (
              <p className="text-gray-500 text-xs mt-1">Balance: {userBalance} ETH</p>
            )}
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <Link href="/ide">
              <button 
                className="flex w-full sm:w-auto min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-white/5 text-gray-200 text-base font-medium leading-normal hover:bg-white/10 active:bg-white/5 transition-colors duration-200"
                disabled={isDeploying}
              >
                <span className="truncate">Cancel</span>
              </button>
            </Link>
            <button 
              onClick={handleDeploy}
              disabled={isDeploying || !contractCode}
              className="group relative flex w-full sm:w-auto min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-gradient-to-r from-[var(--arbitrum-blue-start)] to-[var(--arbitrum-blue-end)] text-white text-base font-bold leading-normal shadow-lg shadow-[color:var(--arbitrum-blue-start)]/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-active:opacity-0"></span>
              <span className="truncate">
                {!connectedAddress ? 'Connect Wallet' :
                 isDeploying ? 'Deploying...' :
                 `Deploy for ${gasEstimate} ETH`}
              </span>
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
