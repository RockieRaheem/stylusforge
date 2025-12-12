# 🏆 NFT Achievement System - Complete Guide

## Overview

Stylus Studio now features a **professional NFT achievement system** that mints badges as soul-bound NFTs on Arbitrum Sepolia. Each tutorial completion can be claimed as an on-chain NFT that proves your Stylus mastery.

---

## ✨ Features

- ✅ **Soul-Bound NFTs** - Non-transferable achievement badges
- ✅ **On-Chain Metadata** - SVG images and metadata stored on-chain
- ✅ **10 Achievement Types** - From Beginner to Expert level
- ✅ **MetaMask Integration** - Seamless minting experience
- ✅ **Gas Efficient** - Optimized Solidity contract
- ✅ **Verifiable on Arbiscan** - All badges visible on blockchain explorer

---

## 🎯 How It Works

### 1. Earn Badges (Traditional)
- Complete tutorials in Stylus Studio
- Badge earned and stored in Firebase
- Visible in your `/badges` page

### 2. Mint as NFT (Optional)
- When badge modal appears, click "Mint NFT Badge"
- Approve transaction in MetaMask
- NFT is minted to your wallet address
- Badge is now permanently on Arbitrum blockchain

### 3. View Your NFTs
- Check `/badges` page for NFT section
- View on Arbiscan blockchain explorer
- Display in any NFT wallet or marketplace

---

## 📁 Project Structure

```
stylus_studio/
├── contracts/
│   └── AchievementNFT.sol          # Main NFT smart contract
├── lib/services/
│   └── nft.service.ts              # NFT minting & verification service
├── components/
│   └── BadgeEarnedModal.tsx        # Modal with NFT minting option
├── app/
│   ├── tutorial/page.tsx           # Triggers badge earning
│   └── badges/page.tsx             # Displays NFT badges
└── .env.local                      # Contract address configuration
```

---

## 🚀 Deployment Guide

### Step 1: Install Dependencies

```bash
npm install @openzeppelin/contracts ethers
```

### Step 2: Compile Contract

You can use any of these methods:

**Option A: Hardhat**
```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
npx hardhat compile
```

**Option B: Remix IDE** (Recommended for quick deployment)
1. Go to [remix.ethereum.org](https://remix.ethereum.org)
2. Create new file `AchievementNFT.sol`
3. Paste contract code from `contracts/AchievementNFT.sol`
4. Compile with Solidity 0.8.20

**Option C: Foundry**
```bash
forge build
```

### Step 3: Deploy to Arbitrum Sepolia

**Using Remix:**
1. Go to "Deploy & Run Transactions" tab
2. Select "Injected Provider - MetaMask"
3. Switch MetaMask to Arbitrum Sepolia network:
   - Network Name: Arbitrum Sepolia
   - RPC URL: `https://sepolia-rollup.arbitrum.io/rpc`
   - Chain ID: `421614`
   - Currency: ETH
   - Block Explorer: `https://sepolia.arbiscan.io`
4. Click "Deploy"
5. Confirm transaction in MetaMask
6. **Copy deployed contract address**

**Using Hardhat:**
```javascript
// hardhat.config.js
module.exports = {
  networks: {
    arbitrumSepolia: {
      url: "https://sepolia-rollup.arbitrum.io/rpc",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 421614
    }
  }
};
```

```bash
npx hardhat run scripts/deploy.js --network arbitrumSepolia
```

### Step 4: Configure Environment Variables

Create or update `.env.local`:

```bash
# NFT Contract Address (from deployment)
NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=0xYourContractAddressHere
```

### Step 5: Authorize Minter (Optional)

If you want a backend service to mint badges automatically:

```javascript
// Using ethers.js
const contract = new ethers.Contract(
  contractAddress, 
  ABI, 
  signer
);

await contract.authorizeMinter("0xBackendServiceAddress");
```

For now, users mint their own badges via MetaMask, so this step is optional.

---

## 🎨 Badge Types

| Badge ID | Name | Description | Level | Color |
|----------|------|-------------|-------|-------|
| `stylus_beginner` | Stylus Beginner | Completed Getting Started | 1 | Blue |
| `storage_master` | Storage Master | Mastered storage operations | 2 | Green |
| `function_expert` | Function Expert | Mastered contract functions | 2 | Purple |
| `event_master` | Event Master | Mastered event emission | 2 | Red |
| `error_handler` | Error Handler | Mastered error handling | 2 | Red |
| `test_master` | Test Master | Mastered contract testing | 3 | Blue |
| `gas_optimizer` | Gas Optimizer | Mastered gas optimization | 3 | Green |
| `pattern_architect` | Pattern Architect | Mastered design patterns | 3 | Purple |
| `defi_builder` | DeFi Builder | Built complete DeFi token | 4 | Red |
| `nft_master` | NFT Master | Built NFT marketplace | 4 | Blue |

---

## 🔧 Smart Contract Functions

### Public Functions

```solidity
// Mint a badge to a user
function mintBadge(address recipient, string badgeId) 
    returns (uint256 tokenId)

// Check if user has a badge
function hasBadge(address user, string badgeId) 
    returns (bool)

// Get user's badge token ID
function getUserBadgeTokenId(address user, string badgeId) 
    returns (uint256)

// Get all badges owned by user
function getUserBadges(address user) 
    returns (string[] badgeIds)

// Get on-chain metadata
function tokenURI(uint256 tokenId) 
    returns (string)
```

### Admin Functions

```solidity
// Register new badge type
function registerBadge(
    string badgeId,
    string name,
    string description,
    string category,
    uint256 level,
    string color
)

// Authorize minter
function authorizeMinter(address minter)

// Revoke minter
function revokeMinter(address minter)
```

---

## 💻 Frontend Integration

### Mint NFT from Tutorial Completion

```typescript
import { nftService } from '@/lib/services/nft.service';

// After tutorial completion
const mintBadge = async () => {
  try {
    const result = await nftService.mintBadge(
      userWalletAddress,
      'stylus_beginner'
    );
    
    console.log('NFT minted!', result);
    console.log('Transaction:', result.transactionHash);
    console.log('Token ID:', result.tokenId);
  } catch (error) {
    console.error('Minting failed:', error);
  }
};
```

### Check if User Has Badge

```typescript
const hasBadge = await nftService.hasBadge(
  userAddress,
  'stylus_beginner'
);

if (hasBadge) {
  console.log('User already has this badge!');
}
```

### Get All User NFTs

```typescript
const badges = await nftService.getUserBadges(userAddress);

badges.forEach(badge => {
  console.log(`${badge.name} - Token #${badge.tokenId}`);
  console.log(`View: ${badge.blockExplorer}`);
});
```

---

## 🌐 Network Configuration

### Arbitrum Sepolia Testnet

- **Chain ID:** 421614
- **RPC URL:** `https://sepolia-rollup.arbitrum.io/rpc`
- **Block Explorer:** https://sepolia.arbiscan.io
- **Faucet:** https://faucet.quicknode.com/arbitrum/sepolia

### Get Test ETH

1. Go to [QuickNode Faucet](https://faucet.quicknode.com/arbitrum/sepolia)
2. Enter your wallet address
3. Request test ETH
4. Wait for confirmation

---

## 🧪 Testing

### Test Minting Locally

```typescript
// Test NFT service initialization
await nftService.initialize();

// Test contract deployment check
const isDeployed = await nftService.isContractDeployed();
console.log('Contract deployed:', isDeployed);

// Test minting
const badge = await nftService.mintBadge(
  '0xYourWalletAddress',
  'stylus_beginner'
);

console.log('Minted:', badge);
```

### Verify on Arbiscan

1. Go to https://sepolia.arbiscan.io
2. Search for your contract address
3. View transactions, holders, and metadata
4. Check individual NFT details

---

## 🛠️ Troubleshooting

### "MetaMask not installed"
- Install MetaMask browser extension
- Refresh the page

### "Not authorized to mint"
- Make sure you're using the correct wallet
- Contract owner needs to authorize minters via `authorizeMinter()`

### "User already has this badge"
- Each badge can only be minted once per user
- Check Arbiscan to verify ownership

### "Transaction rejected"
- User cancelled transaction in MetaMask
- Make sure you have enough ETH for gas

### "Contract not initialized"
- Contract address not set in `.env.local`
- Add `NEXT_PUBLIC_NFT_CONTRACT_ADDRESS`

### Wrong Network
- Switch MetaMask to Arbitrum Sepolia
- The app will prompt network switch automatically

---

## 📊 Gas Costs

Approximate gas costs on Arbitrum Sepolia:

| Operation | Gas | Cost (at 0.1 gwei) |
|-----------|-----|---------------------|
| Deploy Contract | ~3.5M | ~$0.001 |
| Mint Badge | ~150K | ~$0.00005 |
| Check Badge | 0 (view) | Free |
| Get User Badges | 0 (view) | Free |

*Arbitrum is extremely cheap!*

---

## 🔐 Security Features

1. **Soul-Bound Tokens**
   - NFTs cannot be transferred after minting
   - Prevents badge selling/trading
   - Ensures authentic achievement

2. **Authorization System**
   - Only authorized minters can mint badges
   - Contract owner controls minter list
   - Prevents unauthorized minting

3. **Duplicate Prevention**
   - Each user can only mint each badge once
   - Checked on-chain before minting

4. **On-Chain Metadata**
   - SVG images stored on-chain
   - No dependency on external servers
   - Permanent and immutable

---

## 🎓 User Flow Example

1. **User completes Tutorial #1**
   ```
   ✅ Tutorial complete
   🎉 Badge earned: "Stylus Beginner"
   ```

2. **Badge modal appears**
   ```
   🏆 Achievement Unlocked!
   [Mint NFT Badge] button visible
   ```

3. **User clicks "Mint NFT Badge"**
   ```
   🦊 MetaMask opens
   📝 Review transaction
   ✅ Confirm
   ```

4. **NFT minted successfully**
   ```
   ✨ NFT Badge Minted!
   🔗 View on Arbiscan
   Token ID: #42
   ```

5. **Badge visible on blockchain**
   ```
   💎 Viewable in:
   - /badges page
   - Arbiscan explorer
   - Any NFT wallet
   ```

---

## 📝 Future Enhancements

- [ ] Batch minting for multiple badges
- [ ] Achievement levels (Bronze, Silver, Gold)
- [ ] Rarity tiers based on completion time
- [ ] Special edition badges for events
- [ ] NFT marketplace integration
- [ ] Profile picture generator from badges
- [ ] Leaderboard based on NFT count
- [ ] Badge evolution system

---

## 🤝 Support

If you encounter issues:

1. Check this documentation
2. Verify contract deployment on Arbiscan
3. Check browser console for errors
4. Ensure MetaMask is connected to Arbitrum Sepolia
5. Make sure you have test ETH

---

## 📄 License

MIT License - See contract for details

---

**Built with ❤️ for the Arbitrum Stylus community**

Enjoy minting your achievement NFTs! 🚀
