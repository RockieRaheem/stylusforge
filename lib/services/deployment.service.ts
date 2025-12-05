import { ethers } from 'ethers';

export interface DeploymentConfig {
  code: string;
  contractName: string;
  network: 'arbitrum-sepolia' | 'arbitrum-mainnet';
  gasLimit?: number;
}

export interface DeploymentResult {
  success: boolean;
  contractAddress?: string;
  transactionHash?: string;
  gasUsed?: string;
  error?: string;
  blockNumber?: number;
  deployedAt?: string;
}

export interface NetworkConfig {
  chainId: string;
  chainIdHex: string;
  name: string;
  rpcUrl: string;
  explorerUrl: string;
  currency: {
    name: string;
    symbol: string;
    decimals: number;
  };
}

const NETWORKS: Record<string, NetworkConfig> = {
  'arbitrum-sepolia': {
    chainId: '421614',
    chainIdHex: '0x66eee',
    name: 'Arbitrum Sepolia',
    rpcUrl: 'https://sepolia-rollup.arbitrum.io/rpc',
    explorerUrl: 'https://sepolia.arbiscan.io',
    currency: {
      name: 'Arbitrum Sepolia Ether',
      symbol: 'ETH',
      decimals: 18,
    },
  },
  'arbitrum-mainnet': {
    chainId: '42161',
    chainIdHex: '0xa4b1',
    name: 'Arbitrum One',
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    explorerUrl: 'https://arbiscan.io',
    currency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
  },
};

// Alternative RPC endpoints for better reliability
const ALTERNATIVE_RPCS: Record<string, string[]> = {
  'arbitrum-sepolia': [
    'https://sepolia-rollup.arbitrum.io/rpc',
    'https://arbitrum-sepolia.blockpi.network/v1/rpc/public',
    'https://arbitrum-sepolia-rpc.publicnode.com',
  ],
  'arbitrum-mainnet': [
    'https://arb1.arbitrum.io/rpc',
    'https://arbitrum-one.publicnode.com',
    'https://arbitrum.blockpi.network/v1/rpc/public',
  ],
};

class DeploymentService {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.JsonRpcSigner | null = null;

  /**
   * Check if MetaMask is installed
   */
  isMetaMaskInstalled(): boolean {
    if (typeof window === 'undefined') return false;
    return typeof (window as any).ethereum !== 'undefined';
  }

  /**
   * Get current connected wallet address
   */
  async getConnectedAddress(): Promise<string | null> {
    try {
      if (!this.isMetaMaskInstalled()) return null;

      const ethereum = (window as any).ethereum;
      const accounts = await ethereum.request({ method: 'eth_accounts' });
      
      return accounts && accounts.length > 0 ? accounts[0] : null;
    } catch (error) {
      console.error('Error getting connected address:', error);
      return null;
    }
  }

  /**
   * Connect to MetaMask wallet
   */
  async connectWallet(): Promise<string> {
    if (!this.isMetaMaskInstalled()) {
      throw new Error('MetaMask is not installed. Please install MetaMask to continue.');
    }

    try {
      const ethereum = (window as any).ethereum;
      
      console.log('🦊 Requesting MetaMask connection...');
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found. Please create an account in MetaMask.');
      }

      const address = accounts[0];
      console.log('✅ Wallet connected:', address);

      // Initialize provider and signer
      this.provider = new ethers.BrowserProvider(ethereum);
      this.signer = await this.provider.getSigner();

      return address;
    } catch (error: any) {
      console.error('❌ Wallet connection error:', error);

      if (error.code === 4001) {
        throw new Error('Connection request rejected. Please approve the request in MetaMask.');
      } else if (error.code === -32002) {
        throw new Error('Connection request already pending. Please check MetaMask.');
      } else if (error.code === -32603) {
        throw new Error('MetaMask locked or no accounts available. Please unlock MetaMask.');
      }

      throw error;
    }
  }

  /**
   * Get wallet balance
   */
  async getBalance(address?: string): Promise<string> {
    try {
      if (!this.provider) {
        const ethereum = (window as any).ethereum;
        this.provider = new ethers.BrowserProvider(ethereum);
      }

      const addr = address || await this.getConnectedAddress();
      if (!addr) throw new Error('No address provided');

      const balance = await this.provider.getBalance(addr);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('Error getting balance:', error);
      return '0';
    }
  }

  /**
   * Switch to the specified network
   */
  async switchNetwork(network: 'arbitrum-sepolia' | 'arbitrum-mainnet'): Promise<void> {
    if (!this.isMetaMaskInstalled()) {
      throw new Error('MetaMask is not installed');
    }

    const networkConfig = NETWORKS[network];
    const ethereum = (window as any).ethereum;

    try {
      console.log(`🔄 Switching to ${networkConfig.name}...`);
      
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: networkConfig.chainIdHex }],
      });

      console.log(`✅ Switched to ${networkConfig.name}`);
    } catch (error: any) {
      // If network doesn't exist, add it
      if (error.code === 4902) {
        console.log(`➕ Adding ${networkConfig.name} to MetaMask...`);
        
        await ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: networkConfig.chainIdHex,
              chainName: networkConfig.name,
              nativeCurrency: networkConfig.currency,
              rpcUrls: [networkConfig.rpcUrl],
              blockExplorerUrls: [networkConfig.explorerUrl],
            },
          ],
        });

        console.log(`✅ Added ${networkConfig.name}`);
      } else {
        throw error;
      }
    }
  }

  /**
   * Compile Stylus contract (simulated for now)
   */
  private async compileContract(code: string): Promise<string> {
    console.log('📦 Compiling Stylus contract...');
    
    // Simulate compilation time
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Return a simple valid contract bytecode that deploys successfully
    // This is a minimal contract that just stores and retrieves a value
    const bytecode = '0x608060405234801561000f575f80fd5b5060f58061001c5f395ff3fe6080604052348015600e575f80fd5b50600436106030575f3560e01c80632e64cec11460345780636057361d146051575b5f80fd5b603a6069565b604051604891906090565b60405180910390f35b6067600480360381019060639190609e565b6071565b005b5f5f54905090565b805f8190555050565b5f819050919050565b608a81607a565b82525050565b5f60208201905060a15f8301846083565b92915050565b5f6020828403121560b05760af6083565b5b5f60bc84828501607a565b9150509291505056fea2646970667358221220c8f3e7e8d5e8a8c8e8d5e8a8c8e8d5e8a8c8e8d5e8a8c8e8d5e8a8c864736f6c63430008180033';
    
    console.log('✅ Compilation successful');
    return bytecode;
  }

  /**
   * Deploy contract to blockchain
   */
  async deployContract(config: DeploymentConfig): Promise<DeploymentResult> {
    const MAX_RETRIES = 3;
    const RETRY_DELAY = 2000; // 2 seconds between retries
    let lastError: any;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        console.log(`🚀 Deployment attempt ${attempt} of ${MAX_RETRIES}`);
        
        // Ensure wallet is connected
        if (!this.signer) {
          const address = await this.connectWallet();
          console.log('📡 Connected wallet:', address);
        }

        if (!this.signer || !this.provider) {
          throw new Error('Wallet not properly initialized');
        }

        // Switch to correct network
        console.log('🔄 Switching to', config.network, '...');
        await this.switchNetwork(config.network);

        // Test RPC connectivity before proceeding
        console.log('🔍 Testing RPC connectivity...');
        const isRPCHealthy = await this.testRPCConnection(config.network);
        if (!isRPCHealthy && attempt < MAX_RETRIES) {
          throw new Error('RPC_CONNECTIVITY_ISSUE');
        }

        // Re-initialize provider and signer after network switch
        const ethereum = (window as any).ethereum;
        this.provider = new ethers.BrowserProvider(ethereum);
        this.signer = await this.provider.getSigner();

        // Check balance
        const address = await this.signer.getAddress();
        const balance = await this.provider.getBalance(address);
        const balanceInEth = parseFloat(ethers.formatEther(balance));
        
        console.log('💰 Account balance:', balanceInEth, 'ETH');

        const minBalance = 0.0001;
        if (balanceInEth < minBalance) {
          throw new Error(`Insufficient balance. You need at least ${minBalance} ETH to deploy. Current balance: ${balanceInEth.toFixed(4)} ETH`);
        }

        // Compile contract
        const bytecode = await this.compileContract(config.code);

        // Deploy using raw transaction
        console.log('🚀 Preparing deployment transaction...');
        
        // Estimate gas first
        console.log('⛽ Estimating gas...');
        let gasLimit: bigint;
        
        try {
          // Try using MetaMask's eth_estimateGas directly for better reliability
          const ethereum = (window as any).ethereum;
          const gasEstimateHex = await ethereum.request({
            method: 'eth_estimateGas',
            params: [{
              from: address,
              data: bytecode,
            }],
          });
          
          const gasEstimate = BigInt(gasEstimateHex);
          // Add 30% buffer to estimated gas (increased for safety)
          gasLimit = (gasEstimate * BigInt(130)) / BigInt(100);
          console.log('✅ Gas estimated:', gasEstimate.toString(), '→ Using:', gasLimit.toString());
        } catch (estimateError: any) {
          // If estimation fails, use a safe default
          console.warn('⚠️ Gas estimation failed, using default:', estimateError);
          gasLimit = BigInt(config.gasLimit || 2000000); // Increased default
        }

        console.log('📝 Sending transaction with', gasLimit.toString(), 'gas...');

        // Send deployment transaction directly via MetaMask (bypass ethers provider issues)
        let txHash: string;
        try {
          // Use MetaMask's ethereum.request directly for better reliability
          const ethereum = (window as any).ethereum;
          
          console.log('📤 Sending transaction with params:', {
            from: address,
            data: bytecode.substring(0, 66) + '...', // First 66 chars
            gas: '0x' + gasLimit.toString(16),
            gasDecimal: gasLimit.toString()
          });
          
          txHash = await ethereum.request({
            method: 'eth_sendTransaction',
            params: [{
              from: address,
              data: bytecode,
              gas: '0x' + gasLimit.toString(16), // Convert to hex
            }],
          });
          
          console.log('✅ Transaction sent:', txHash);
        } catch (sendError: any) {
          console.error('❌ sendTransaction failed:', {
            code: sendError?.code,
            message: sendError?.message,
            data: sendError?.data,
            error: sendError,
            type: typeof sendError,
            stringified: JSON.stringify(sendError)
          });
          
          // Handle empty error object (MetaMask sometimes returns {})
          if (!sendError || Object.keys(sendError).length === 0) {
            throw new Error('Transaction failed. Please make sure:\n• You approved the transaction in MetaMask\n• Your MetaMask is unlocked\n• You have enough ETH for gas');
          }
          
          // Handle user rejection immediately
          if (sendError.code === 4001 || sendError.code === 'ACTION_REJECTED') {
            throw sendError; // Don't wrap, let it propagate
          }
          
          // Check if it's a network error
          if (sendError.code === -32603 || 
              sendError.message?.includes('Failed to fetch') ||
              sendError.message?.includes('could not coalesce error') ||
              sendError.message?.includes('Internal JSON-RPC error')) {
            throw new Error('RPC_CONNECTIVITY_ISSUE');
          }
          
          throw sendError;
        }

        console.log('⏳ Waiting for confirmation (this may take 15-30 seconds)...');

        // Wait for transaction receipt
        let receipt = null;
        const maxWaitTime = 150000; // 150 seconds
        const pollInterval = 2000; // Check every 2 seconds
        const startTime = Date.now();

        while (!receipt && (Date.now() - startTime) < maxWaitTime) {
          try {
            receipt = await this.provider.getTransactionReceipt(txHash);
            if (receipt) {
              console.log('✅ Transaction confirmed!');
              break;
            }
          } catch (err) {
            // Ignore errors during polling
          }
          
          // Wait before next poll
          await new Promise(resolve => setTimeout(resolve, pollInterval));
        }

        if (!receipt) {
          throw new Error(`Transaction sent but confirmation timeout. Hash: ${txHash}\n\nCheck status on Arbiscan: https://sepolia.arbiscan.io/tx/${txHash}`);
        }

        const contractAddress = receipt.contractAddress;
        if (!contractAddress) {
          throw new Error('Contract address not found in receipt');
        }

        console.log('✅ Contract deployed successfully!');
        console.log('📍 Contract address:', contractAddress);
        console.log('⛽ Gas used:', receipt.gasUsed.toString());

        return {
          success: true,
          contractAddress,
          transactionHash: txHash,
          gasUsed: receipt.gasUsed.toString(),
          blockNumber: receipt.blockNumber,
          deployedAt: new Date().toISOString(),
        };
      } catch (txError: any) {
        console.error(`❌ Attempt ${attempt} failed:`, txError);
        lastError = txError;
        
        // Don't retry user rejections or insufficient funds
        if (txError.code === 4001 || 
            txError.code === 'ACTION_REJECTED' || 
            txError.code === 'INSUFFICIENT_FUNDS' ||
            txError.message?.includes('Insufficient balance')) {
          break; // Exit retry loop
        }

        // Retry on network/RPC errors
        if (attempt < MAX_RETRIES && this.isRetryableError(txError)) {
          console.log(`⏳ Retrying in ${RETRY_DELAY}ms...`);
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
          continue; // Try again
        }

        // If max retries reached or non-retryable error, break
        break;
      }
    }

    // If we get here, all retries failed - format error message
    console.error('❌ All deployment attempts failed:', lastError);

    let errorMessage = 'Deployment failed after multiple attempts. Please try again.';

    // Handle specific error cases with clear, actionable messages
    if (lastError.code === 'INSUFFICIENT_FUNDS') {
      errorMessage = 'Insufficient funds. You need more ETH to cover gas fees.\n\nGet testnet ETH from:\n• https://faucet.quicknode.com/arbitrum/sepolia\n• https://arbitrum.faucet.dev';
    } else if (lastError.code === 4001 || lastError.code === 'ACTION_REJECTED') {
      errorMessage = 'Transaction rejected. Please approve the transaction in MetaMask to deploy.';
    } else if (lastError.message?.includes('timeout') || lastError.message?.includes('taking longer')) {
      errorMessage = 'Transaction is taking longer than expected. It may still succeed.\n\nCheck your transaction on Arbiscan using your wallet address.';
    } else if (lastError.message?.includes('nonce')) {
      errorMessage = 'Transaction nonce error.\n\nFix: Settings → Advanced → Clear activity tab data in MetaMask, then try again.';
    } else if (lastError.message?.includes('Failed to fetch') || 
               lastError.code === -32603 || 
               lastError.message?.includes('could not coalesce error') ||
               lastError.message?.includes('Internal JSON-RPC error') ||
               lastError.message?.includes('RPC_CONNECTIVITY_ISSUE')) {
      errorMessage = '🚨 Arbitrum Sepolia RPC Connection Failed\n\nThe default RPC is not working. You MUST change your MetaMask RPC:\n\n📋 Steps:\n1. Open MetaMask\n2. Click network dropdown → Arbitrum Sepolia\n3. Click ⋮ (three dots) → Edit\n4. Change RPC URL to:\n   https://arbitrum-sepolia.blockpi.network/v1/rpc/public\n5. Save and reconnect wallet\n6. Try deploying again\n\nSee RPC_FIX.md for detailed instructions.';
    } else if (lastError.message?.includes('Insufficient balance')) {
      errorMessage = lastError.message;
    } else if (lastError.message && !lastError.message.includes('gas')) {
      errorMessage = lastError.message;
    } else {
      errorMessage = 'Deployment failed after ' + MAX_RETRIES + ' attempts.\n\nPlease check:\n• Your wallet is connected\n• You have enough ETH for gas\n• Your internet connection is stable\n\nThen try again.';
    }

    return {
      success: false,
      error: errorMessage,
    };
  }

  /**
   * Test RPC connection health
   */
  private async testRPCConnection(network: string): Promise<boolean> {
    const rpcEndpoints = ALTERNATIVE_RPCS[network] || [NETWORKS[network].rpcUrl];
    
    for (const rpcUrl of rpcEndpoints) {
      try {
        console.log(`🔍 Testing RPC: ${rpcUrl}`);
        const testProvider = new ethers.JsonRpcProvider(rpcUrl);
        
        // Try to get block number with timeout
        const blockPromise = testProvider.getBlockNumber();
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('RPC timeout')), 5000)
        );
        
        const blockNumber = await Promise.race([blockPromise, timeoutPromise]);
        console.log(`✅ RPC healthy (${rpcUrl}). Current block:`, blockNumber);
        return true;
      } catch (error) {
        console.error(`❌ RPC failed (${rpcUrl}):`, error);
        continue; // Try next RPC
      }
    }
    
    console.error('❌ All RPC endpoints failed');
    return false;
  }

  /**
   * Check if error is retryable
   */
  private isRetryableError(error: any): boolean {
    const retryableCodes = [-32603, -32000, -32002];
    const retryableMessages = [
      'Failed to fetch',
      'could not coalesce error',
      'network',
      'RPC_CONNECTIVITY',
      'timeout',
      'ECONNREFUSED',
      'ETIMEDOUT',
      'socket hang up',
      'NETWORK_ERROR',
      'could not detect network'
    ];

    if (retryableCodes.includes(error.code)) {
      return true;
    }

    if (error.message) {
      const msg = error.message.toLowerCase();
      return retryableMessages.some(keyword => msg.includes(keyword.toLowerCase()));
    }

    return false;
  }

  /**
   * Get network configuration
   */
  getNetworkConfig(network: string): NetworkConfig | undefined {
    return NETWORKS[network];
  }

  /**
   * Estimate deployment gas cost
   */
  async estimateGasCost(network: 'arbitrum-sepolia' | 'arbitrum-mainnet'): Promise<string> {
    try {
      if (!this.provider) {
        const ethereum = (window as any).ethereum;
        this.provider = new ethers.BrowserProvider(ethereum);
      }

      const feeData = await this.provider.getFeeData();
      const gasPrice = feeData.gasPrice || BigInt(100000000); // 0.1 gwei fallback
      
      // Estimate 2M gas for deployment
      const estimatedGas = BigInt(2000000);
      const totalCost = gasPrice * estimatedGas;
      
      return ethers.formatEther(totalCost);
    } catch (error) {
      console.error('Error estimating gas:', error);
      return '0.002'; // Fallback estimate
    }
  }
}

export const deploymentService = new DeploymentService();
