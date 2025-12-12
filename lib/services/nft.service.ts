/**
 * NFT Service for Stylus Studio Achievement Badges
 * Handles minting, verification, and display of on-chain achievement NFTs
 */

import { ethers } from 'ethers';

// Contract ABI (only the functions we need)
const ACHIEVEMENT_NFT_ABI = [
  "function mintBadge(address recipient, string memory badgeId) external returns (uint256)",
  "function hasBadge(address user, string memory badgeId) external view returns (bool)",
  "function getUserBadgeTokenId(address user, string memory badgeId) external view returns (uint256)",
  "function getUserBadges(address user) external view returns (string[] memory)",
  "function tokenURI(uint256 tokenId) external view returns (string memory)",
  "function balanceOf(address owner) external view returns (uint256)",
  "function ownerOf(uint256 tokenId) external view returns (address)",
  "function badges(string memory badgeId) external view returns (tuple(string name, string description, string category, uint256 level, string color, bool exists))",
  "event BadgeMinted(address indexed recipient, string badgeId, uint256 tokenId, uint256 timestamp)"
];

// Deployed contract address (update after deployment)
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS || '';

// Network configuration
const ARBITRUM_SEPOLIA = {
  chainId: 421614,
  name: 'Arbitrum Sepolia',
  rpcUrl: 'https://sepolia-rollup.arbitrum.io/rpc',
  blockExplorer: 'https://sepolia.arbiscan.io'
};

export interface BadgeNFT {
  badgeId: string;
  tokenId: number;
  name: string;
  description: string;
  category: string;
  level: number;
  color: string;
  imageUrl: string;
  tokenURI: string;
  transactionHash?: string;
  blockExplorer?: string;
}

interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
}

class NFTService {
  private contract: ethers.Contract | null = null;
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.JsonRpcSigner | null = null;

  /**
   * Initialize connection to MetaMask and contract
   */
  async initialize(): Promise<void> {
    if (typeof window === 'undefined' || !(window as any).ethereum) {
      throw new Error('MetaMask not installed');
    }

    if (!CONTRACT_ADDRESS) {
      console.warn('NFT contract address not configured');
      return;
    }

    try {
      this.provider = new ethers.BrowserProvider((window as any).ethereum);
      this.signer = await this.provider.getSigner();
      this.contract = new ethers.Contract(CONTRACT_ADDRESS, ACHIEVEMENT_NFT_ABI, this.signer);
    } catch (error) {
      console.error('Failed to initialize NFT service:', error);
      throw error;
    }
  }

  /**
   * Ensure we're connected to Arbitrum Sepolia
   */
  async ensureCorrectNetwork(): Promise<void> {
    if (!this.provider) {
      throw new Error('Provider not initialized');
    }

    const network = await this.provider.getNetwork();
    if (Number(network.chainId) !== ARBITRUM_SEPOLIA.chainId) {
      try {
        await (window as any).ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${ARBITRUM_SEPOLIA.chainId.toString(16)}` }],
        });
      } catch (switchError: any) {
        // Chain not added, try to add it
        if (switchError.code === 4902) {
          await (window as any).ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: `0x${ARBITRUM_SEPOLIA.chainId.toString(16)}`,
              chainName: ARBITRUM_SEPOLIA.name,
              rpcUrls: [ARBITRUM_SEPOLIA.rpcUrl],
              blockExplorerUrls: [ARBITRUM_SEPOLIA.blockExplorer],
            }],
          });
        } else {
          throw switchError;
        }
      }
    }
  }

  /**
   * Mint an achievement badge NFT
   */
  async mintBadge(recipientAddress: string, badgeId: string): Promise<BadgeNFT> {
    if (!this.contract) {
      await this.initialize();
    }

    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

    try {
      await this.ensureCorrectNetwork();

      // Check if user already has this badge
      const hasBadge = await this.contract.hasBadge(recipientAddress, badgeId);
      if (hasBadge) {
        throw new Error('User already has this badge');
      }

      // Mint the badge
      const tx = await this.contract.mintBadge(recipientAddress, badgeId);
      console.log('Minting badge... Transaction:', tx.hash);

      // Wait for transaction confirmation
      const receipt = await tx.wait();
      console.log('Badge minted! Receipt:', receipt);

      // Find the BadgeMinted event
      const event = receipt.logs
        .map((log: any) => {
          try {
            return this.contract!.interface.parseLog(log);
          } catch {
            return null;
          }
        })
        .find((e: any) => e && e.name === 'BadgeMinted');

      if (!event) {
        throw new Error('BadgeMinted event not found');
      }

      const tokenId = Number(event.args.tokenId);

      // Get badge metadata
      const badge = await this.getBadgeDetails(recipientAddress, badgeId, tokenId);
      
      return {
        ...badge,
        transactionHash: tx.hash,
        blockExplorer: `${ARBITRUM_SEPOLIA.blockExplorer}/tx/${tx.hash}`
      };

    } catch (error: any) {
      console.error('Error minting badge:', error);
      
      if (error.code === 'ACTION_REJECTED') {
        throw new Error('Transaction rejected by user');
      } else if (error.message.includes('already has this badge')) {
        throw new Error('You already own this achievement badge');
      } else if (error.message.includes('Not authorized')) {
        throw new Error('Not authorized to mint badges. Please contact support.');
      }
      
      throw new Error(`Failed to mint badge: ${error.message}`);
    }
  }

  /**
   * Check if user has a specific badge
   */
  async hasBadge(userAddress: string, badgeId: string): Promise<boolean> {
    if (!this.contract) {
      await this.initialize();
    }

    if (!this.contract) {
      return false;
    }

    try {
      return await this.contract.hasBadge(userAddress, badgeId);
    } catch (error) {
      console.error('Error checking badge:', error);
      return false;
    }
  }

  /**
   * Get all badges owned by a user
   */
  async getUserBadges(userAddress: string): Promise<BadgeNFT[]> {
    if (!this.contract) {
      await this.initialize();
    }

    if (!this.contract) {
      return [];
    }

    try {
      const badgeIds = await this.contract.getUserBadges(userAddress);
      
      const badges = await Promise.all(
        badgeIds.map(async (badgeId: string) => {
          const tokenId = await this.contract!.getUserBadgeTokenId(userAddress, badgeId);
          return this.getBadgeDetails(userAddress, badgeId, Number(tokenId));
        })
      );

      return badges;
    } catch (error) {
      console.error('Error getting user badges:', error);
      return [];
    }
  }

  /**
   * Get detailed information about a badge
   */
  async getBadgeDetails(userAddress: string, badgeId: string, tokenId: number): Promise<BadgeNFT> {
    if (!this.contract) {
      await this.initialize();
    }

    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

    try {
      // Get badge metadata from contract
      const badgeData = await this.contract.badges(badgeId);
      
      // Get token URI (on-chain SVG)
      const tokenURI = await this.contract.tokenURI(tokenId);
      
      // Parse the data URI to get metadata
      let imageUrl = '';

      if (tokenURI.startsWith('data:application/json;base64,')) {
        const base64Data = tokenURI.replace('data:application/json;base64,', '');
        // Decode base64 in browser-safe way
        const jsonString = decodeURIComponent(
          atob(base64Data)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
        const metadata = JSON.parse(jsonString) as NFTMetadata;
        imageUrl = metadata.image;
      }

      return {
        badgeId,
        tokenId,
        name: badgeData.name,
        description: badgeData.description,
        category: badgeData.category,
        level: Number(badgeData.level),
        color: badgeData.color,
        imageUrl,
        tokenURI,
        blockExplorer: `${ARBITRUM_SEPOLIA.blockExplorer}/token/${CONTRACT_ADDRESS}?a=${tokenId}`
      };

    } catch (error) {
      console.error('Error getting badge details:', error);
      throw error;
    }
  }

  /**
   * Get NFT balance for a user
   */
  async getBalance(userAddress: string): Promise<number> {
    if (!this.contract) {
      await this.initialize();
    }

    if (!this.contract) {
      return 0;
    }

    try {
      const balance = await this.contract.balanceOf(userAddress);
      return Number(balance);
    } catch (error) {
      console.error('Error getting balance:', error);
      return 0;
    }
  }

  /**
   * Check if contract is deployed and accessible
   */
  async isContractDeployed(): Promise<boolean> {
    if (!CONTRACT_ADDRESS) {
      return false;
    }

    try {
      const provider = new ethers.JsonRpcProvider(ARBITRUM_SEPOLIA.rpcUrl);
      const code = await provider.getCode(CONTRACT_ADDRESS);
      return code !== '0x';
    } catch (error) {
      console.error('Error checking contract:', error);
      return false;
    }
  }

  /**
   * Get contract address
   */
  getContractAddress(): string {
    return CONTRACT_ADDRESS;
  }

  /**
   * Get network info
   */
  getNetworkInfo() {
    return ARBITRUM_SEPOLIA;
  }
}

// Export singleton instance
export const nftService = new NFTService();
