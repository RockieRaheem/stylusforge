import { ethers } from 'ethers';

// Contract ABI
const FUNDING_CONTRACT_ABI = [
  "function createProject(uint256 _fundingGoal, uint256 _durationDays) external returns (uint256)",
  "function contribute(uint256 _projectId) external payable",
  "function withdrawFunds(uint256 _projectId) external",
  "function claimRefund(uint256 _projectId) external",
  "function getProject(uint256 _projectId) external view returns (address, uint256, uint256, uint256, bool, bool, uint256)",
  "function getContribution(uint256 _projectId, address _backer) external view returns (uint256)",
  "function getBackers(uint256 _projectId) external view returns (address[])",
  "event ProjectCreated(uint256 indexed projectId, address indexed creator, uint256 fundingGoal, uint256 deadline)",
  "event ContributionMade(uint256 indexed projectId, address indexed backer, uint256 amount)",
  "event FundsWithdrawn(uint256 indexed projectId, address indexed creator, uint256 amount)"
];

// Contract address (update after deployment)
const FUNDING_CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000000'; // Placeholder

export class FundingManager {
  private provider: ethers.Provider | null = null;
  private signer: ethers.Signer | null = null;
  private contract: ethers.Contract | null = null;

  async initialize() {
    if (typeof window === 'undefined' || !(window as any).ethereum) {
      throw new Error('MetaMask not installed');
    }

    await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
    
    this.provider = new ethers.BrowserProvider((window as any).ethereum);
    this.signer = await this.provider.getSigner();
    this.contract = new ethers.Contract(
      FUNDING_CONTRACT_ADDRESS,
      FUNDING_CONTRACT_ABI,
      this.signer
    );
  }

  async createProject(fundingGoalETH: string, durationDays: number): Promise<number> {
    if (!this.contract) await this.initialize();

    const fundingGoalWei = ethers.parseEther(fundingGoalETH);
    
    const tx = await this.contract!.createProject(fundingGoalWei, durationDays);
    const receipt = await tx.wait();

    // Get project ID from event
    const event = receipt.logs.find((log: any) => {
      try {
        const parsed = this.contract!.interface.parseLog(log);
        return parsed?.name === 'ProjectCreated';
      } catch {
        return false;
      }
    });

    if (event) {
      const parsed = this.contract!.interface.parseLog(event);
      return Number(parsed?.args[0]);
    }

    throw new Error('Project creation failed');
  }

  async contribute(projectId: number, amountETH: string): Promise<string> {
    if (!this.contract) await this.initialize();

    const amountWei = ethers.parseEther(amountETH);
    
    const tx = await this.contract!.contribute(projectId, { value: amountWei });
    const receipt = await tx.wait();

    return receipt.hash;
  }

  async withdrawFunds(projectId: number): Promise<string> {
    if (!this.contract) await this.initialize();

    const tx = await this.contract!.withdrawFunds(projectId);
    const receipt = await tx.wait();

    return receipt.hash;
  }

  async claimRefund(projectId: number): Promise<string> {
    if (!this.contract) await this.initialize();

    const tx = await this.contract!.claimRefund(projectId);
    const receipt = await tx.wait();

    return receipt.hash;
  }

  async getProjectDetails(projectId: number) {
    if (!this.contract) await this.initialize();

    const details = await this.contract!.getProject(projectId);

    return {
      creator: details[0],
      fundingGoal: ethers.formatEther(details[1]),
      totalFunded: ethers.formatEther(details[2]),
      deadline: new Date(Number(details[3]) * 1000),
      completed: details[4],
      fundsWithdrawn: details[5],
      backersCount: Number(details[6]),
    };
  }

  async getContribution(projectId: number, address: string): Promise<string> {
    if (!this.contract) await this.initialize();

    const contribution = await this.contract!.getContribution(projectId, address);
    return ethers.formatEther(contribution);
  }

  async getBackers(projectId: number): Promise<string[]> {
    if (!this.contract) await this.initialize();

    return await this.contract!.getBackers(projectId);
  }
}

export const fundingManager = new FundingManager();
