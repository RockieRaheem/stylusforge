'use client';

import { useState } from 'react';
import { deployer, DeploymentConfig, DeploymentResult } from '../blockchain/deployer';

export function useDeployment() {
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentResult, setDeploymentResult] = useState<DeploymentResult | null>(null);
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);

  const connectWallet = async (): Promise<string> => {
    try {
      const address = await deployer.connectWallet();
      setConnectedAddress(address);
      return address;
    } catch (error) {
      // Re-throw the original error to preserve the specific error message
      throw error;
    }
  };

  const deploy = async (config: DeploymentConfig): Promise<DeploymentResult> => {
    setIsDeploying(true);
    setDeploymentResult(null);

    try {
      if (!connectedAddress) {
        await connectWallet();
      }

      const result = await deployer.deployContract(config);
      setDeploymentResult(result);
      return result;
    } catch (error) {
      const errorResult: DeploymentResult = {
        success: false,
        error: error instanceof Error ? error.message : 'Deployment failed',
      };
      setDeploymentResult(errorResult);
      return errorResult;
    } finally {
      setIsDeploying(false);
    }
  };

  const getBalance = async (address?: string): Promise<string> => {
    try {
      const addr = address || connectedAddress;
      if (!addr) throw new Error('No address provided');
      
      return await deployer.getBalance(addr);
    } catch (error) {
      return '0';
    }
  };

  const estimateGas = async (code: string, network: DeploymentConfig['network']): Promise<string> => {
    try {
      return await deployer.estimateGas(code, network);
    } catch (error) {
      return 'Unable to estimate';
    }
  };

  return {
    deploy,
    connectWallet,
    getBalance,
    estimateGas,
    isDeploying,
    deploymentResult,
    connectedAddress,
  };
}
