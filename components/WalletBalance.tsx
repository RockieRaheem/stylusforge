'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

interface WalletBalanceProps {
  className?: string;
  showFull?: boolean;
}

export default function WalletBalance({ className = '', showFull = false }: WalletBalanceProps) {
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>('0.0000');
  const [network, setNetwork] = useState<string>('Unknown');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const checkWallet = async () => {
      if (typeof window === 'undefined' || !(window as any).ethereum) {
        return;
      }

      try {
        const ethereum = (window as any).ethereum;
        
        // Get accounts
        const accounts = await ethereum.request({ method: 'eth_accounts' });
        
        if (accounts && accounts.length > 0) {
          const account = accounts[0];
          setAddress(account);
          setIsConnected(true);

          // Get balance
          const provider = new ethers.BrowserProvider(ethereum);
          const balanceWei = await provider.getBalance(account);
          const balanceEth = ethers.formatEther(balanceWei);
          setBalance(parseFloat(balanceEth).toFixed(4));

          // Get network
          const networkInfo = await provider.getNetwork();
          const chainId = Number(networkInfo.chainId);
          
          console.log('🔗 Detected network:', { chainId, networkInfo });
          
          switch (chainId) {
            case 421614:
              setNetwork('Arbitrum Sepolia');
              break;
            case 42161:
              setNetwork('Arbitrum One');
              break;
            case 11155111:
              setNetwork('Sepolia');
              break;
            case 1:
              setNetwork('Ethereum');
              break;
            default:
              setNetwork(`Chain ${chainId}`);
          }
          
          console.log('✅ Network set to:', chainId === 421614 ? 'Arbitrum Sepolia' : `Chain ${chainId}`);
        }
      } catch (error) {
        console.error('Error checking wallet:', error);
      }
    };

    checkWallet();

    // Listen for account and network changes
    if ((window as any).ethereum) {
      const ethereum = (window as any).ethereum;
      
      ethereum.on('accountsChanged', checkWallet);
      ethereum.on('chainChanged', checkWallet);

      return () => {
        ethereum.removeListener('accountsChanged', checkWallet);
        ethereum.removeListener('chainChanged', checkWallet);
      };
    }
  }, []);

  if (!isConnected) {
    return null;
  }

  return (
    <div className={`flex items-center gap-2 bg-slate-800/50 rounded-lg px-3 py-2 border border-white/10 ${className}`}>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        <div className="flex flex-col">
          {showFull && (
            <span className="text-gray-400 text-xs">{network}</span>
          )}
          <div className="flex items-center gap-2">
            <span className="text-white font-mono text-sm font-medium">{balance} ETH</span>
            {showFull && address && (
              <span className="text-gray-500 text-xs font-mono">
                {address.slice(0, 6)}...{address.slice(-4)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
