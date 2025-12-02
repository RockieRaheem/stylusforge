# StylusForge Backend Infrastructure Documentation

## Overview
This document outlines the complete backend infrastructure, blockchain integration, and IDE enhancements implemented for StylusForge.

---

## 1. Backend Infrastructure

### Authentication System
**Location**: `lib/auth/AuthContext.tsx`, `app/api/auth/`

**Features**:
- Wallet-based authentication with MetaMask
- User profile management
- Session persistence with localStorage
- Automatic re-authentication on page load

**API Endpoints**:
- `POST /api/auth/login` - Wallet login with signature
- `PATCH /api/auth/profile` - Update user profile
- `GET /api/auth/profile?userId={id}` - Fetch user profile

**Usage**:
```typescript
import { useAuth } from '@/lib/auth/AuthContext';

const { user, login, logout, updateProfile } = useAuth();
await login(walletAddress);
```

---

### Project Management
**Location**: `app/api/projects/route.ts`, `lib/hooks/useProjects.ts`

**Features**:
- CRUD operations for projects
- Code storage and versioning
- Deployment status tracking
- Multi-user project support

**API Endpoints**:
- `GET /api/projects?userId={id}` - Fetch user projects
- `GET /api/projects?projectId={id}` - Fetch specific project
- `POST /api/projects` - Create new project
- `PATCH /api/projects` - Update project
- `DELETE /api/projects?projectId={id}` - Delete project

**Data Structure**:
```typescript
interface Project {
  id: string;
  userId: string;
  name: string;
  description: string;
  code: string;
  language: string;
  createdAt: string;
  updatedAt: string;
  deployedAddress?: string;
  network?: string;
  status: 'draft' | 'deployed' | 'failed';
}
```

**Hook Usage**:
```typescript
import { useProjects } from '@/lib/hooks/useProjects';

const { 
  projects, 
  createProject, 
  updateProject, 
  deleteProject 
} = useProjects(userId);
```

---

### Tutorial Progress Tracking
**Location**: `app/api/tutorials/progress/route.ts`, `lib/hooks/useTutorialProgress.ts`

**Features**:
- Section completion tracking
- Assignment submission
- User code persistence
- Completion timestamps

**API Endpoints**:
- `GET /api/tutorials/progress?userId={id}` - Fetch progress
- `POST /api/tutorials/progress` - Save/update progress

**Hook Usage**:
```typescript
import { useTutorialProgress } from '@/lib/hooks/useTutorialProgress';

const { 
  progress, 
  saveProgress, 
  isCompleted 
} = useTutorialProgress(userId);
```

---

## 2. Blockchain Integration

### Contract Deployment
**Location**: `lib/blockchain/deployer.ts`, `lib/hooks/useDeployment.ts`

**Features**:
- MetaMask wallet connection
- Network switching (Arbitrum Sepolia/Mainnet)
- Stylus contract compilation
- Gas estimation
- Balance checking

**Networks Supported**:
- Arbitrum Sepolia (testnet) - Chain ID: 421614
- Arbitrum Mainnet - Chain ID: 42161

**Usage**:
```typescript
import { useDeployment } from '@/lib/hooks/useDeployment';

const { deploy, connectWallet, getBalance } = useDeployment();

// Connect wallet
const address = await connectWallet();

// Deploy contract
const result = await deploy({
  code: rustCode,
  network: 'arbitrum-sepolia',
  gasLimit: 5000000
});
```

**API Endpoints**:
- `POST /api/compile` - Compile Rust to WASM bytecode
- `POST /api/estimate-gas` - Estimate deployment gas

---

### Funding Smart Contract
**Location**: `contracts/ProjectFunding.sol`, `lib/blockchain/funding.ts`

**Contract Features**:
- Crowdfunding campaigns with goals and deadlines
- Escrow system (funds locked until goal reached)
- 5% platform fee
- Refund mechanism if goal not met
- Multi-backer support

**Key Functions**:
```solidity
createProject(fundingGoal, durationDays) returns projectId
contribute(projectId) payable
withdrawFunds(projectId) // Creator only, goal reached
claimRefund(projectId) // Backers only, goal not met
getProject(projectId) returns projectDetails
```

**JavaScript Integration**:
```typescript
import { fundingManager } from '@/lib/blockchain/funding';

// Create funding campaign
const projectId = await fundingManager.createProject('10', 30); // 10 ETH, 30 days

// Contribute
await fundingManager.contribute(projectId, '0.5'); // 0.5 ETH

// Check details
const details = await fundingManager.getProjectDetails(projectId);
```

---

### Transaction History
**Location**: `app/api/transactions/route.ts`, `lib/hooks/useTransactions.ts`

**Features**:
- Transaction recording (deployment, funding, withdrawal, refund)
- Status tracking (pending, confirmed, failed)
- Gas usage tracking
- Statistics calculation

**API Endpoints**:
- `GET /api/transactions?userId={id}` - Fetch user transactions
- `GET /api/transactions?hash={hash}` - Fetch specific transaction
- `POST /api/transactions` - Record new transaction
- `PATCH /api/transactions` - Update transaction status

**Hook Usage**:
```typescript
import { useTransactions } from '@/lib/hooks/useTransactions';

const { 
  transactions, 
  addTransaction, 
  updateTransactionStatus,
  getGasStats 
} = useTransactions(userId);

// Record transaction
await addTransaction({
  userId,
  type: 'deployment',
  hash: txHash,
  from: address,
  value: '0',
  network: 'arbitrum-sepolia'
});

// Update status
await updateTransactionStatus(txHash, 'confirmed', gasUsed);
```

---

## 3. IDE Enhancements

### Live Compilation
**Location**: `lib/hooks/useCompiler.ts`

**Features**:
- Real-time Rust to WASM compilation
- Error and warning detection
- Code linting
- Gas estimation
- Compilation status tracking

**Hook Usage**:
```typescript
import { useCompiler } from '@/lib/hooks/useCompiler';

const { 
  compile, 
  estimateGas, 
  lintCode,
  isCompiling,
  compilationResult 
} = useCompiler();

// Compile code
const result = await compile(rustCode);

// Lint code
const issues = lintCode(rustCode);

// Estimate gas
const gas = await estimateGas(rustCode, 'arbitrum-sepolia');
```

**Linting Rules**:
- Warns about `unwrap()` usage
- Detects `todo!()` markers
- Checks for missing documentation on public functions

---

### Contract Testing
**Location**: `app/api/test/route.ts`, `lib/hooks/useContractTesting.ts`

**Features**:
- Automated test execution
- Test template generation
- Code complexity analysis
- Debug point setting

**API Endpoint**:
- `POST /api/test` - Run contract tests

**Hook Usage**:
```typescript
import { useContractTesting } from '@/lib/hooks/useContractTesting';

const { 
  runTests, 
  generateTestTemplate,
  analyzeComplexity,
  testResults,
  testSummary 
} = useContractTesting();

// Run tests
const { results, summary } = await runTests(rustCode);

// Generate test template
const testCode = generateTestTemplate('transfer');

// Analyze complexity
const { score, issues } = analyzeComplexity(rustCode);
```

---

## 4. Data Flow

### Project Creation Flow
```
1. User creates project in IDE
2. Code is saved via POST /api/projects
3. User clicks "Compile"
4. POST /api/compile returns bytecode
5. User clicks "Deploy"
6. deployer.deployContract() sends to blockchain
7. Transaction recorded via POST /api/transactions
8. Project updated with deployment address
```

### Funding Flow
```
1. Creator submits project to marketplace
2. fundingManager.createProject() creates on-chain campaign
3. Backers contribute via fundingManager.contribute()
4. Each contribution recorded via POST /api/transactions
5. When goal reached, creator calls withdrawFunds()
6. Platform fee (5%) sent to platform wallet
7. Remaining funds sent to creator
```

### Tutorial Progress Flow
```
1. User completes tutorial section
2. POST /api/tutorials/progress saves progress
3. User completes assignment
4. Code saved with assignmentCompleted: true
5. Tutorial marked complete
6. Next tutorial unlocked
```

---

## 5. Storage Architecture

**Current Implementation**: In-memory Maps (development)
**Production Requirements**: Replace with database

**Recommended Database Schema**:

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY,
  address VARCHAR(42) UNIQUE NOT NULL,
  username VARCHAR(50),
  email VARCHAR(255),
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  code TEXT NOT NULL,
  language VARCHAR(20) DEFAULT 'rust',
  deployed_address VARCHAR(42),
  network VARCHAR(50),
  status VARCHAR(20) DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tutorial progress table
CREATE TABLE tutorial_progress (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  tutorial_id INTEGER NOT NULL,
  completed_sections INTEGER[],
  assignment_completed BOOLEAN DEFAULT FALSE,
  user_code TEXT,
  completed_at TIMESTAMP,
  UNIQUE(user_id, tutorial_id)
);

-- Transactions table
CREATE TABLE transactions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  type VARCHAR(20) NOT NULL,
  hash VARCHAR(66) UNIQUE NOT NULL,
  from_address VARCHAR(42) NOT NULL,
  to_address VARCHAR(42),
  value VARCHAR(100) NOT NULL,
  gas_used VARCHAR(100),
  status VARCHAR(20) DEFAULT 'pending',
  network VARCHAR(50) NOT NULL,
  project_id UUID REFERENCES projects(id),
  contract_address VARCHAR(42),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Marketplace projects table
CREATE TABLE marketplace_projects (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  project_id UUID REFERENCES projects(id),
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(50),
  funding_goal DECIMAL(18, 8) NOT NULL,
  funding_raised DECIMAL(18, 8) DEFAULT 0,
  backers_count INTEGER DEFAULT 0,
  deadline TIMESTAMP NOT NULL,
  blockchain_project_id INTEGER,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 6. Security Considerations

### Authentication
- ✅ Wallet signature verification required for production
- ✅ Session tokens with expiration
- ✅ CSRF protection on state-changing operations

### Smart Contracts
- ✅ Reentrancy guards on withdrawal functions
- ✅ Access control modifiers
- ✅ Integer overflow protection (Solidity 0.8+)
- ✅ Emergency pause mechanism recommended

### API Security
- ⚠️ Rate limiting needed
- ⚠️ Input validation required
- ⚠️ SQL injection protection (when using DB)
- ⚠️ API authentication tokens

---

## 7. Deployment Checklist

### Smart Contracts
- [ ] Deploy ProjectFunding.sol to Arbitrum Sepolia
- [ ] Deploy ProjectFunding.sol to Arbitrum Mainnet
- [ ] Update contract address in `lib/blockchain/funding.ts`
- [ ] Verify contract on Arbiscan

### Backend
- [ ] Set up PostgreSQL database
- [ ] Replace in-memory storage with DB queries
- [ ] Configure environment variables
- [ ] Set up Redis for session management
- [ ] Deploy API endpoints

### Frontend
- [ ] Configure RPC endpoints
- [ ] Set up error tracking (Sentry)
- [ ] Add analytics
- [ ] Configure CDN for assets

---

## 8. Environment Variables

Create `.env.local`:

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/stylusforge

# Blockchain
ARBITRUM_SEPOLIA_RPC=https://sepolia-rollup.arbitrum.io/rpc
ARBITRUM_MAINNET_RPC=https://arb1.arbitrum.io/rpc
PLATFORM_WALLET_ADDRESS=0x...
FUNDING_CONTRACT_ADDRESS_SEPOLIA=0x...
FUNDING_CONTRACT_ADDRESS_MAINNET=0x...

# API Keys
ARBISCAN_API_KEY=your_api_key
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id

# Platform
PLATFORM_FEE_PERCENTAGE=5
SESSION_SECRET=your_secret_key
```

---

## 9. Next Steps

### Immediate
1. Set up PostgreSQL database
2. Migrate in-memory storage to database
3. Deploy funding smart contract
4. Implement cargo-stylus integration for real compilation

### Short-term
1. Add user authentication with wallet signatures
2. Implement rate limiting
3. Add WebSocket for real-time collaboration
4. Create admin dashboard

### Long-term
1. Integrate actual Rust compiler
2. Add contract debugging with breakpoints
3. Implement AI code suggestions
4. Create mobile app

---

## 10. Testing

### Unit Tests Needed
- [ ] Authentication flow
- [ ] Project CRUD operations
- [ ] Transaction recording
- [ ] Tutorial progress tracking

### Integration Tests
- [ ] Wallet connection → Deployment flow
- [ ] Funding campaign lifecycle
- [ ] Tutorial completion → Progress tracking

### Smart Contract Tests
- [ ] Funding goal reached scenario
- [ ] Refund scenario
- [ ] Platform fee calculation
- [ ] Edge cases (deadline, multiple contributions)

---

## Support & Documentation

For questions or issues:
- GitHub: github.com/RockieRaheem/stylusforge
- Documentation: docs.stylusforge.io (TBD)
- Community: discord.gg/stylusforge (TBD)

---

**Last Updated**: December 2, 2025
**Version**: 1.0.0
**Status**: Development Complete - Ready for Database Integration
