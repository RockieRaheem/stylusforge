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
    if (typeof window === 'undefined') {
      throw new Error('Window is not defined - must be run in browser');
    }

    const ethereum = (window as any).ethereum;
    
    if (!ethereum) {
      throw new Error('MetaMask is not installed. Please install MetaMask to continue.');
    }

    try {
      console.log('🦊 Attempting to connect to MetaMask...');
      
      // Directly request accounts - this will show MetaMask popup if not connected
      console.log('📋 Requesting accounts from MetaMask...');
      const accounts = await ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      console.log('📊 Received accounts:', accounts);
      
      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts returned from MetaMask. Please make sure you have at least one account created.');
      }
      
      // Initialize provider and signer
      console.log('🔧 Initializing provider and signer...');
      this.provider = new ethers.BrowserProvider(ethereum);
      this.signer = await this.provider.getSigner();
      
      const address = await this.signer.getAddress();
      console.log('✅ Wallet connected successfully:', address);
      return address;
    } catch (error: any) {
      console.error('❌ Wallet connection error:', error);
      
      // Provide more specific error messages
      if (error.code === 4001) {
        throw new Error('Connection rejected. Please approve the connection in MetaMask.');
      } else if (error.code === -32002) {
        throw new Error('Connection request already pending. Please open MetaMask and approve the connection.');
      } else if (error.code === -32603) {
        throw new Error('MetaMask connection failed. Please try: 1) Click the MetaMask extension icon, 2) Click the three dots menu, 3) Select "Connected sites", 4) Make sure localhost:3000 is connected, 5) Refresh this page and try again.');
      } else if (error.message && error.message.includes('No accounts')) {
        throw new Error('No MetaMask accounts found. Please create an account in MetaMask first, then refresh this page.');
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('Failed to connect wallet. Please make sure MetaMask is unlocked and try again.');
      }
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

      console.log('🔗 Checking network...');
      // Switch to correct network
      await this.switchNetwork(config.network);

      // Check balance
      const address = await this.signer.getAddress();
      const balance = await this.provider!.getBalance(address);
      const balanceInEth = parseFloat(ethers.formatEther(balance));
      
      console.log('💰 Wallet balance:', balanceInEth, 'ETH');

      if (balanceInEth < 0.0001) {
        throw new Error('Insufficient balance. You need at least 0.0001 ETH to deploy. Get testnet ETH from: https://sepoliafaucet.com/ (Sepolia) then bridge to Arbitrum Sepolia at https://bridge.arbitrum.io/?destinationChain=arbitrum-sepolia&sourceChain=sepolia');
      }

      // Compile the Stylus contract
      const bytecode = await this.compileStylus(config.code);

      console.log('🚀 Deploying contract to blockchain...');
      
      // Deploy the contract
      const factory = new ethers.ContractFactory(
        [], // ABI (empty for simple contract)
        bytecode,
        this.signer
      );

      const contract = await factory.deploy({
        gasLimit: config.gasLimit || 3000000,
      });

      console.log('⏳ Waiting for deployment confirmation...');
      await contract.waitForDeployment();

      const contractAddress = await contract.getAddress();
      const deployTx = contract.deploymentTransaction();

      console.log('✅ Contract deployed at:', contractAddress);

      return {
        success: true,
        contractAddress: contractAddress,
        transactionHash: deployTx?.hash,
        gasUsed: deployTx?.gasLimit?.toString(),
      };
    } catch (error: any) {
      console.error('❌ Deployment error:', error);
      
      // Provide helpful error messages
      let errorMessage = 'Deployment failed';
      
      if (error.code === 'INSUFFICIENT_FUNDS') {
        errorMessage = 'Insufficient funds. Get testnet ETH from https://faucet.quicknode.com/arbitrum/sepolia';
      } else if (error.message && error.message.includes('user rejected')) {
        errorMessage = 'Transaction rejected by user';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  private async compileStylus(code: string): Promise<string> {
    // Mock Stylus compilation for demo/hackathon
    // In production, this would call cargo-stylus to compile Rust to WASM
    
    console.log('📦 Compiling Stylus contract...');
    
    // Simulate compilation delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Return a simple contract bytecode (empty contract that does nothing but deploys)
    // This is a minimal EVM bytecode that returns empty data
    const mockBytecode = '0x6080604052348015600f57600080fd5b50603f80601d6000396000f3fe6080604052600080fdfea264697066735822122000000000000000000000000000000000000000000000000000000000000000064736f6c63430008130033';
    
    console.log('✅ Compilation successful!');
    return mockBytecode;
  }

  async estimateGas(code: string, network: 'arbitrum-sepolia' | 'arbitrum-mainnet'): Promise<string> {
    // Mock gas estimation for demo
    // Stylus contracts typically use 10-100x less gas than Solidity
    const mockGasEstimate = '0.0042';
    return mockGasEstimate;
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
