'use client';

import { useState, useEffect, useCallback } from 'react';
import { deploymentService, DeploymentConfig, DeploymentResult } from '@/lib/services/deployment.service';

export function useDeployment() {
  const [isDeploying, setIsDeploying] = useState(false);
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);
  const [walletBalance, setWalletBalance] = useState<string>('0');
  const [isCheckingConnection, setIsCheckingConnection] = useState(true);
  const [currentNetwork, setCurrentNetwork] = useState<string>('');

  // Check existing wallet connection on mount
  useEffect(() => {
    checkExistingConnection();
  }, []);

  const checkExistingConnection = async () => {
    try {
      setIsCheckingConnection(true);
      const address = await deploymentService.getConnectedAddress();
      
      if (address) {
        setConnectedAddress(address);
        await updateBalance(address);
        await updateNetwork();
        console.log('✅ Existing wallet connection detected:', address);
      }
    } catch (error) {
      console.error('Error checking connection:', error);
    } finally {
      setIsCheckingConnection(false);
    }
  };

  const updateBalance = async (address?: string) => {
    try {
      const balance = await deploymentService.getBalance(address);
      setWalletBalance(balance);
    } catch (error) {
      console.error('Error updating balance:', error);
    }
  };

  const updateNetwork = async () => {
    try {
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        const ethereum = (window as any).ethereum;
        const chainId = await ethereum.request({ method: 'eth_chainId' });
        
        if (chainId === '0x66eee') {
          setCurrentNetwork('arbitrum-sepolia');
        } else if (chainId === '0xa4b1') {
          setCurrentNetwork('arbitrum-mainnet');
        } else {
          setCurrentNetwork('unknown');
        }
      }
    } catch (error) {
      console.error('Error getting network:', error);
    }
  };

  const connectWallet = useCallback(async (): Promise<string> => {
    try {
      const address = await deploymentService.connectWallet();
      setConnectedAddress(address);
      await updateBalance(address);
      await updateNetwork();
      
      // Listen for account changes
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        const ethereum = (window as any).ethereum;
        
        ethereum.on('accountsChanged', (accounts: string[]) => {
          if (accounts.length > 0) {
            setConnectedAddress(accounts[0]);
            updateBalance(accounts[0]);
          } else {
            setConnectedAddress(null);
            setWalletBalance('0');
          }
        });

        ethereum.on('chainChanged', () => {
          updateNetwork();
          window.location.reload();
        });
      }

      return address;
    } catch (error) {
      console.error('Connection error:', error);
      throw error;
    }
  }, []);

  const deploy = useCallback(async (config: DeploymentConfig): Promise<DeploymentResult> => {
    setIsDeploying(true);

    try {
      // Ensure wallet is connected
      if (!connectedAddress) {
        console.log('🔗 Wallet not connected, connecting...');
        await connectWallet();
      }

      // Deploy contract
      const result = await deploymentService.deployContract(config);

      // Update balance after deployment
      if (result.success && connectedAddress) {
        await updateBalance(connectedAddress);
      }

      return result;
    } catch (error: any) {
      console.error('Deployment error in hook:', error);
      return {
        success: false,
        error: error.message || 'Deployment failed',
      };
    } finally {
      setIsDeploying(false);
    }
  }, [connectedAddress, connectWallet]);

  const getBalance = useCallback(async (address?: string): Promise<string> => {
    return deploymentService.getBalance(address);
  }, []);

  const estimateGas = useCallback(async (network: 'arbitrum-sepolia' | 'arbitrum-mainnet'): Promise<string> => {
    return deploymentService.estimateGasCost(network);
  }, []);

  const isMetaMaskInstalled = useCallback((): boolean => {
    return deploymentService.isMetaMaskInstalled();
  }, []);

  return {
    // State
    isDeploying,
    connectedAddress,
    walletBalance,
    isCheckingConnection,
    currentNetwork,

    // Actions
    connectWallet,
    deploy,
    getBalance,
    estimateGas,
    isMetaMaskInstalled,
  };
}
