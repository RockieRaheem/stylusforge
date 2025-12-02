import { ethers } from 'ethers';

export interface DeploymentConfig {
  code: string;
  network: 'arbitrum-sepolia' | 'arbitrum-mainnet';
  gasLimit?: number;
}

export interface DeploymentResult {
  success: boolean;
  contractAddress?: string;
  transactionHash?: string;
  error?: string;
  gasUsed?: string;
}

// Network configurations
const NETWORKS = {
  'arbitrum-sepolia': {
    chainId: 421614,
    rpcUrl: 'https://sepolia-rollup.arbitrum.io/rpc',
    explorer: 'https://sepolia.arbiscan.io',
  },
  'arbitrum-mainnet': {
    chainId: 42161,
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    explorer: 'https://arbiscan.io',
  },
};

export class ContractDeployer {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.Signer | null = null;

  async connectWallet(): Promise<string> {
    if (typeof window === 'undefined' || !(window as any).ethereum) {
      throw new Error('MetaMask not installed');
    }

    try {
      await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
      
      this.provider = new ethers.BrowserProvider((window as any).ethereum);
      this.signer = await this.provider.getSigner();
      
      const address = await this.signer.getAddress();
      return address;
    } catch (error) {
      console.error('Wallet connection error:', error);
      throw new Error('Failed to connect wallet');
    }
  }

  async switchNetwork(network: 'arbitrum-sepolia' | 'arbitrum-mainnet'): Promise<void> {
    if (typeof window === 'undefined' || !(window as any).ethereum) {
      throw new Error('MetaMask not installed');
    }

    const networkConfig = NETWORKS[network];
    
    try {
      await (window as any).ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${networkConfig.chainId.toString(16)}` }],
      });
    } catch (switchError: any) {
      // Network doesn't exist, add it
      if (switchError.code === 4902) {
        await (window as any).ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: `0x${networkConfig.chainId.toString(16)}`,
            chainName: network === 'arbitrum-sepolia' ? 'Arbitrum Sepolia' : 'Arbitrum One',
            nativeCurrency: {
              name: 'ETH',
              symbol: 'ETH',
              decimals: 18,
            },
            rpcUrls: [networkConfig.rpcUrl],
            blockExplorerUrls: [networkConfig.explorer],
          }],
        });
      } else {
        throw switchError;
      }
    }
  }

  async deployContract(config: DeploymentConfig): Promise<DeploymentResult> {
    try {
      if (!this.signer) {
        await this.connectWallet();
      }

      if (!this.signer) {
        throw new Error('Signer not available');
      }

      // Switch to correct network
      await this.switchNetwork(config.network);

      // For Stylus contracts, we need to compile Rust to WASM first
      // This is a placeholder - in production, integrate with cargo-stylus
      const bytecode = await this.compileStylus(config.code);

      // Deploy the contract
      const factory = new ethers.ContractFactory(
        [], // ABI (empty for now)
        bytecode,
        this.signer
      );

      const contract = await factory.deploy({
        gasLimit: config.gasLimit || 5000000,
      });

      await contract.waitForDeployment();

      const address = await contract.getAddress();
      const deployTx = contract.deploymentTransaction();

      return {
        success: true,
        contractAddress: address,
        transactionHash: deployTx?.hash,
        gasUsed: deployTx?.gasLimit?.toString(),
      };
    } catch (error) {
      console.error('Deployment error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Deployment failed',
      };
    }
  }

  private async compileStylus(code: string): Promise<string> {
    // In production, this would call cargo-stylus to compile Rust to WASM
    // For now, return a mock bytecode
    
    try {
      const response = await fetch('/api/compile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        throw new Error('Compilation failed');
      }

      const { bytecode } = await response.json();
      return bytecode;
    } catch (error) {
      console.error('Compilation error:', error);
      throw new Error('Failed to compile Stylus contract');
    }
  }

  async estimateGas(code: string, network: 'arbitrum-sepolia' | 'arbitrum-mainnet'): Promise<string> {
    try {
      const response = await fetch('/api/estimate-gas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, network }),
      });

      if (!response.ok) {
        throw new Error('Gas estimation failed');
      }

      const { gasEstimate } = await response.json();
      return gasEstimate;
    } catch (error) {
      console.error('Gas estimation error:', error);
      return 'Unable to estimate';
    }
  }

  async getBalance(address: string): Promise<string> {
    if (!this.provider) {
      throw new Error('Provider not initialized');
    }

    const balance = await this.provider.getBalance(address);
    return ethers.formatEther(balance);
  }
}

export const deployer = new ContractDeployer();
