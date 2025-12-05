'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useDeployment } from '@/lib/hooks/useDeployment';
import { projectService } from '@/lib/services/project.service';
import { deploymentHistoryService } from '@/lib/services/deployment-history.service';
import { CheckCircle, XCircle, Loader2, ExternalLink, Copy, AlertTriangle, Sparkles } from 'lucide-react';
import { notifyDeploymentSuccess } from '@/lib/events/dashboard-events';

type DeploymentStep = 'idle' | 'connecting' | 'compiling' | 'deploying' | 'confirming' | 'success' | 'error';

export default function DeployPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    isDeploying,
    connectedAddress,
    walletBalance,
    isCheckingConnection,
    currentNetwork,
    connectWallet,
    deploy,
    estimateGas,
    isMetaMaskInstalled,
  } = useDeployment();

  // State
  const [step, setStep] = useState<DeploymentStep>('idle');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [contractCode, setContractCode] = useState('');
  const [contractName, setContractName] = useState('');
  const [network, setNetwork] = useState<'arbitrum-sepolia' | 'arbitrum-mainnet'>('arbitrum-sepolia');
  const [gasEstimate, setGasEstimate] = useState('0.002');
  const [deploymentResult, setDeploymentResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Load contract from localStorage or URL
  useEffect(() => {
    const code = searchParams?.get('code') || localStorage.getItem('currentContract') || '';
    const name = searchParams?.get('name') || localStorage.getItem('contractName') || 'Contract.rs';
    
    setContractCode(code);
    setContractName(name);
  }, [searchParams]);

  // Update gas estimate when network changes
  useEffect(() => {
    if (connectedAddress) {
      estimateGas(network).then(setGasEstimate);
    }
  }, [network, connectedAddress, estimateGas]);

  const handleConnect = async () => {
    try {
      setError(null);
      setStep('connecting');
      await connectWallet();
      setStep('idle');
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet');
      setStep('error');
    }
  };

  const handleDeploy = async () => {
    if (!contractCode || !contractCode.trim()) {
      setError('No contract code to deploy');
      return;
    }

    if (!connectedAddress) {
      await handleConnect();
      return;
    }

    try {
      setError(null);
      setStep('compiling');
      setProgress(15);

      console.log('🚀 Starting deployment...');
      
      // Simulate compilation progress
      await new Promise(resolve => setTimeout(resolve, 800));
      setProgress(35);

      setStep('deploying');
      setProgress(50);

      // Deploy contract
      const result = await deploy({
        code: contractCode,
        contractName: contractName,
        network: network,
      });

      if (!result.success) {
        throw new Error(result.error || 'Deployment failed');
      }

      setProgress(75);
      setStep('confirming');

      // Simulate confirmation
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProgress(100);

      setDeploymentResult(result);
      setStep('success');

      // Save to database
      if (typeof window !== 'undefined') {
        try {
          const { auth } = await import('@/lib/firebase/config');
          if (auth.currentUser) {
            const projectId = localStorage.getItem('currentProjectId');
            
            // Mark project as deployed
            if (projectId) {
              await projectService.markAsDeployed(
                projectId,
                result.contractAddress!,
                network
              );
            }

            // Record deployment in history
            const deploymentData: any = {
              contractName: contractName,
              contractAddress: result.contractAddress!,
              transactionHash: result.transactionHash!,
              network: network,
              gasUsed: result.gasUsed || '0',
              blockNumber: result.blockNumber,
              status: 'success',
            };
            
            // Only include projectId if it exists (Firebase doesn't accept undefined)
            if (projectId) {
              deploymentData.projectId = projectId;
            }
            
            await deploymentHistoryService.recordDeployment(
              auth.currentUser.uid,
              deploymentData
            );

            console.log('✅ Saved to database');
            
            // Emit dashboard event to trigger refresh
            notifyDeploymentSuccess({
              contractAddress: result.contractAddress!,
              transactionHash: result.transactionHash!,
              network: network,
            });
            
            console.log('📢 Dashboard refresh event emitted');
          }
        } catch (dbError) {
          console.warn('Could not save to database:', dbError);
        }
      }

      console.log('🎉 Deployment complete!');
    } catch (err: any) {
      console.error('❌ Deployment failed:', err);
      setError(err.message || 'Deployment failed');
      setStep('error');
      setProgress(0);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getExplorerUrl = (address: string, type: 'address' | 'tx' = 'address') => {
    const baseUrl = network === 'arbitrum-sepolia' 
      ? 'https://sepolia.arbiscan.io' 
      : 'https://arbiscan.io';
    return `${baseUrl}/${type}/${address}`;
  };

  const getStepIcon = (currentStep: DeploymentStep) => {
    if (step === 'error') return <XCircle className="w-6 h-6 text-red-500" />;
    if (step === 'success') return <CheckCircle className="w-6 h-6 text-green-500" />;
    
    if (currentStep === step) {
      return <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />;
    }
    
    const steps: DeploymentStep[] = ['connecting', 'compiling', 'deploying', 'confirming'];
    const currentIndex = steps.indexOf(step);
    const stepIndex = steps.indexOf(currentStep);
    
    if (stepIndex < currentIndex) {
      return <CheckCircle className="w-6 h-6 text-green-500" />;
    }
    
    return <div className="w-6 h-6 rounded-full border-2 border-gray-600" />;
  };

  // Success View
  if (step === 'success' && deploymentResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-6">
        <div className="max-w-2xl w-full bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
          {/* Success Header */}
          <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-b border-green-500/30 p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 border-2 border-green-500 mb-4">
              <CheckCircle className="w-10 h-10 text-green-400" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Deployment Successful!</h1>
            <p className="text-gray-300">Your contract is now live on {network === 'arbitrum-sepolia' ? 'Arbitrum Sepolia' : 'Arbitrum One'}</p>
          </div>

          {/* Contract Details */}
          <div className="p-8 space-y-6">
            {/* Contract Address */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Contract Address</label>
              <div className="flex items-center gap-2 bg-slate-800/50 rounded-lg p-4 border border-white/10">
                <code className="flex-1 text-sm font-mono text-white break-all">
                  {deploymentResult.contractAddress}
                </code>
                <button
                  onClick={() => copyToClipboard(deploymentResult.contractAddress)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  title="Copy address"
                >
                  <Copy className="w-4 h-4 text-gray-400" />
                </button>
                <a
                  href={getExplorerUrl(deploymentResult.contractAddress, 'address')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  title="View on Explorer"
                >
                  <ExternalLink className="w-4 h-4 text-blue-400" />
                </a>
              </div>
            </div>

            {/* Transaction Hash */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Transaction Hash</label>
              <div className="flex items-center gap-2 bg-slate-800/50 rounded-lg p-4 border border-white/10">
                <code className="flex-1 text-sm font-mono text-gray-300 break-all">
                  {deploymentResult.transactionHash}
                </code>
                <button
                  onClick={() => copyToClipboard(deploymentResult.transactionHash)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  title="Copy hash"
                >
                  <Copy className="w-4 h-4 text-gray-400" />
                </button>
                <a
                  href={getExplorerUrl(deploymentResult.transactionHash, 'tx')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  title="View Transaction"
                >
                  <ExternalLink className="w-4 h-4 text-blue-400" />
                </a>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800/30 rounded-lg p-4 border border-white/5">
                <p className="text-xs text-gray-400 mb-1">Gas Used</p>
                <p className="text-lg font-semibold text-white">{deploymentResult.gasUsed}</p>
              </div>
              <div className="bg-slate-800/30 rounded-lg p-4 border border-white/5">
                <p className="text-xs text-gray-400 mb-1">Block Number</p>
                <p className="text-lg font-semibold text-white">{deploymentResult.blockNumber}</p>
              </div>
            </div>

            {/* Achievement Badge */}
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg p-4 border border-purple-500/30">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-white font-semibold mb-1">Achievement Unlocked!</h3>
                  <p className="text-sm text-gray-300">Successfully deployed your first Stylus contract on Arbitrum</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Link href="/dashboard" className="flex-1">
                <button className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-lg transition-all shadow-lg shadow-blue-500/20">
                  View Dashboard
                </button>
              </Link>
              <Link href="/ide" className="flex-1">
                <button className="w-full px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-lg transition-all border border-white/10">
                  Deploy Another
                </button>
              </Link>
            </div>
          </div>
        </div>

        {copied && (
          <div className="fixed bottom-6 right-6 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in">
            Copied to clipboard!
          </div>
        )}
      </div>
    );
  }

  // Main Deployment View
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-6">
      <div className="max-w-3xl w-full bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="border-b border-white/10 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">Deploy Contract</h1>
              <p className="text-gray-400 text-sm">Deploy your Stylus contract to Arbitrum</p>
            </div>
            <Link href="/ide">
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <XCircle className="w-5 h-5 text-gray-400" />
              </button>
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Only render dynamic content after mount to prevent hydration mismatch */}
          {!mounted ? (
            <div className="bg-slate-800/30 rounded-lg p-4 border border-white/5">
              <div className="animate-pulse flex space-x-4">
                <div className="flex-1 space-y-3 py-1">
                  <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-700 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* MetaMask Check */}
              {!isMetaMaskInstalled() && (
            <div className="bg-orange-500/10 border border-orange-500/50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-orange-400 font-semibold mb-1">MetaMask Required</h3>
                  <p className="text-sm text-orange-300 mb-3">Please install MetaMask to deploy contracts.</p>
                  <a
                    href="https://metamask.io/download/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/20 hover:bg-orange-500/30 rounded-lg text-orange-300 text-sm font-medium transition-colors"
                  >
                    Install MetaMask
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Wallet Connection */}
          {mounted && isCheckingConnection ? (
            <div className="bg-blue-500/10 border border-blue-500/50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
                <p className="text-blue-300 text-sm">Checking wallet connection...</p>
              </div>
            </div>
          ) : !connectedAddress ? (
            <div className="bg-blue-500/10 border border-blue-500/50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <h3 className="text-blue-300 font-semibold mb-2">Connect Your Wallet</h3>
                  <p className="text-sm text-blue-200 mb-4">Connect your MetaMask wallet to deploy contracts</p>
                  <button
                    onClick={handleConnect}
                    disabled={step === 'connecting'}
                    className="px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                  >
                    {step === 'connecting' ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      'Connect Wallet'
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <div>
                    <p className="text-sm text-gray-400">Connected Wallet</p>
                    <p className="text-white font-mono text-sm">
                      {connectedAddress.slice(0, 6)}...{connectedAddress.slice(-4)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400">Balance</p>
                  <p className="text-white font-semibold">{parseFloat(walletBalance).toFixed(4)} ETH</p>
                </div>
              </div>
            </div>
          )}

          {/* Low Balance Warning */}
          {mounted && connectedAddress && parseFloat(walletBalance) < 0.0001 && (
            <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-yellow-400 font-semibold mb-1">Low Balance</h3>
                  <p className="text-sm text-yellow-300 mb-3">
                    You need at least 0.0001 ETH to deploy. Current balance: {parseFloat(walletBalance).toFixed(4)} ETH
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <a
                      href="https://sepoliafaucet.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500/20 hover:bg-yellow-500/30 rounded text-yellow-300 text-xs font-medium transition-colors"
                    >
                      Get Sepolia ETH
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <a
                      href="https://bridge.arbitrum.io/?destinationChain=arbitrum-sepolia&sourceChain=sepolia"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500/20 hover:bg-yellow-500/30 rounded text-yellow-300 text-xs font-medium transition-colors"
                    >
                      Bridge to Arbitrum Sepolia
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
              </div>
            )}

            {/* Error Display */}
            {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-red-400 font-semibold mb-1">Deployment Error</h3>
                  <p className="text-sm text-red-300 whitespace-pre-line">{error}</p>
                </div>
                <button
                  onClick={() => setError(null)}
                  className="text-red-400 hover:text-red-300"
                >
                  <XCircle className="w-4 h-4" />
                </button>
              </div>
              </div>
            )}

            {/* Contract Info */}
            <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Contract Name</label>
              <input
                type="text"
                value={contractName}
                onChange={(e) => setContractName(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                placeholder="MyContract.rs"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Network</label>
              <select
                value={network}
                onChange={(e) => setNetwork(e.target.value as any)}
                className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              >
                <option value="arbitrum-sepolia">Arbitrum Sepolia (Testnet)</option>
                <option value="arbitrum-mainnet">Arbitrum One (Mainnet)</option>
              </select>
            </div>
          </div>

          {/* Deployment Progress */}
          {(step !== 'idle' && step !== 'error' && step !== 'success') && (
            <div className="space-y-4 bg-slate-800/30 rounded-lg p-6 border border-white/5">
              <div className="space-y-4">
                {/* Connecting Step */}
                <div className="flex items-center gap-4">
                  {getStepIcon('connecting')}
                  <div className="flex-1">
                    <p className="text-white font-medium">Connecting to Network</p>
                    <p className="text-sm text-gray-400">Establishing connection...</p>
                  </div>
                </div>

                {/* Compiling Step */}
                <div className="flex items-center gap-4">
                  {getStepIcon('compiling')}
                  <div className="flex-1">
                    <p className="text-white font-medium">Compiling Contract</p>
                    <p className="text-sm text-gray-400">Compiling Rust to WASM...</p>
                  </div>
                </div>

                {/* Deploying Step */}
                <div className="flex items-center gap-4">
                  {getStepIcon('deploying')}
                  <div className="flex-1">
                    <p className="text-white font-medium">Deploying to Blockchain</p>
                    <p className="text-sm text-gray-400">Sending transaction...</p>
                  </div>
                </div>

                {/* Confirming Step */}
                <div className="flex items-center gap-4">
                  {getStepIcon('confirming')}
                  <div className="flex-1">
                    <p className="text-white font-medium">Confirming Transaction</p>
                    <p className="text-sm text-gray-400">Waiting for confirmation...</p>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Progress</span>
                  <span className="text-white font-medium">{progress}%</span>
                </div>
                <div className="w-full h-2 bg-slate-700/50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Gas Estimate */}
          <div className="flex items-center justify-between bg-slate-800/30 rounded-lg p-4 border border-white/5">
            <div>
              <p className="text-sm text-gray-400">Estimated Gas Cost</p>
              <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
                {gasEstimate} ETH
              </p>
            </div>
            {connectedAddress && (
              <div className="text-right">
                <p className="text-sm text-gray-400">Your Balance</p>
                <p className="text-lg font-semibold text-white">{parseFloat(walletBalance).toFixed(4)} ETH</p>
              </div>
            )}
          </div>
          </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-white/10 p-6 bg-slate-900/30">
          <div className="flex gap-3">
            <Link href="/ide" className="flex-1">
              <button
                disabled={isDeploying}
                className="w-full px-6 py-3 bg-white/5 hover:bg-white/10 disabled:bg-white/5 disabled:opacity-50 text-white font-medium rounded-lg transition-all border border-white/10"
              >
                Cancel
              </button>
            </Link>
            <button
              onClick={connectedAddress ? handleDeploy : handleConnect}
              disabled={Boolean(
                isDeploying || 
                !contractCode || 
                (connectedAddress && parseFloat(walletBalance) < 0.0001)
              )}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-lg transition-all shadow-lg shadow-blue-500/20 disabled:shadow-none flex items-center justify-center gap-2"
            >
              {!connectedAddress ? (
                'Connect Wallet'
              ) : isDeploying ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Deploying...
                </>
              ) : (
                `Deploy for ${gasEstimate} ETH`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
