export interface CodeTemplate {
  id: string;
  name: string;
  description: string;
  category: 'defi' | 'nft' | 'basic' | 'advanced';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  icon: string;
  code: string;
  gasEstimate: string;
  features: string[];
}

export const codeTemplates: CodeTemplate[] = [
  {
    id: 'counter',
    name: 'Simple Counter',
    description: 'A basic counter contract demonstrating storage operations and state management in Stylus',
    category: 'basic',
    difficulty: 'beginner',
    icon: '123',
    gasEstimate: '~2.1k',
    features: ['Storage Operations', 'State Management', 'Basic Functions'],
    code: `// Simple Counter Contract
// NOTE: This uses stylus_sdk which is for actual deployment.
// Browser compilation will show errors - this is normal.
// Click "Deploy" to compile and deploy to Arbitrum.

#![cfg_attr(not(feature = "export-abi"), no_main)]
extern crate alloc;

use stylus_sdk::{
    alloy_primitives::U256,
    prelude::*,
    storage::StorageU256,
};

#[storage]
#[entrypoint]
pub struct Counter {
    count: StorageU256,
}

#[public]
impl Counter {
    /// Increment the counter by 1
    pub fn increment(&mut self) {
        let current = self.count.get();
        self.count.set(current + U256::from(1));
    }

    /// Decrement the counter by 1  
    pub fn decrement(&mut self) {
        let current = self.count.get();
        if current > U256::from(0) {
            self.count.set(current - U256::from(1));
        }
    }

    /// Get the current counter value
    pub fn get_count(&self) -> U256 {
        self.count.get()
    }

    /// Reset the counter to zero
    pub fn reset(&mut self) {
        self.count.set(U256::from(0));
    }

    /// Set counter to a specific value
    pub fn set_count(&mut self, new_value: U256) {
        self.count.set(new_value);
    }
}`,
  },
  {
    id: 'erc20',
    name: 'ERC-20 Token',
    description: 'Full-featured fungible token implementation with transfer, approval, and allowance mechanisms',
    category: 'defi',
    difficulty: 'intermediate',
    icon: 'token',
    gasEstimate: '~8.5k',
    features: ['Transfer', 'Approve', 'Allowances', 'Events'],
    code: `// ERC-20 Token Contract
// NOTE: This uses stylus_sdk which requires actual deployment.
// Browser compilation will show errors - click "Deploy" to deploy to Arbitrum.

#![cfg_attr(not(feature = "export-abi"), no_main)]
extern crate alloc;

use alloc::string::String;
use stylus_sdk::{
    alloy_primitives::{Address, U256},
    evm, msg,
    prelude::*,
    storage::{StorageAddress, StorageMap, StorageU256, StorageString},
};

sol_storage! {
    #[entrypoint]
    pub struct Erc20 {
        StorageString name;
        StorageString symbol;
        StorageU256 total_supply;
        StorageMap<Address, U256> balances;
        StorageMap<Address, StorageMap<Address, U256>> allowances;
    }
}

// Declare events
sol! {
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

#[public]
impl Erc20 {
    /// Initialize the token with name, symbol, and initial supply
    pub fn init(&mut self, name: String, symbol: String, initial_supply: U256) {
        self.name.set_str(name);
        self.symbol.set_str(symbol);
        self.total_supply.set(initial_supply);
        
        let sender = msg::sender();
        self.balances.setter(sender).set(initial_supply);
        
        evm::log(Transfer {
            from: Address::ZERO,
            to: sender,
            value: initial_supply,
        });
    }

    /// Get token name
    pub fn name(&self) -> String {
        self.name.get_string()
    }

    /// Get token symbol
    pub fn symbol(&self) -> String {
        self.symbol.get_string()
    }

    /// Get total supply
    pub fn total_supply(&self) -> U256 {
        self.total_supply.get()
    }

    /// Get balance of an account
    pub fn balance_of(&self, account: Address) -> U256 {
        self.balances.get(account)
    }

    /// Transfer tokens to another address
    pub fn transfer(&mut self, to: Address, amount: U256) -> bool {
        let sender = msg::sender();
        self._transfer(sender, to, amount);
        true
    }

    /// Approve spender to spend tokens
    pub fn approve(&mut self, spender: Address, amount: U256) -> bool {
        let owner = msg::sender();
        self.allowances.setter(owner).setter(spender).set(amount);
        
        evm::log(Approval {
            owner,
            spender,
            value: amount,
        });
        
        true
    }

    /// Get allowance for spender
    pub fn allowance(&self, owner: Address, spender: Address) -> U256 {
        self.allowances.getter(owner).get(spender)
    }

    /// Transfer from one address to another using allowance
    pub fn transfer_from(&mut self, from: Address, to: Address, amount: U256) -> bool {
        let spender = msg::sender();
        let current_allowance = self.allowances.getter(from).get(spender);
        
        if current_allowance < amount {
            return false;
        }
        
        self.allowances.setter(from).setter(spender).set(current_allowance - amount);
        self._transfer(from, to, amount);
        
        true
    }

    /// Internal transfer function
    fn _transfer(&mut self, from: Address, to: Address, amount: U256) {
        let from_balance = self.balances.get(from);
        assert!(from_balance >= amount, "Insufficient balance");
        
        self.balances.setter(from).set(from_balance - amount);
        let to_balance = self.balances.get(to);
        self.balances.setter(to).set(to_balance + amount);
        
        evm::log(Transfer {
            from,
            to,
            value: amount,
        });
    }
}`,
  },
  {
    id: 'nft',
    name: 'ERC-721 NFT',
    description: 'Non-fungible token contract with minting, transfers, and metadata support',
    category: 'nft',
    difficulty: 'intermediate',
    icon: 'image',
    gasEstimate: '~12k',
    features: ['Minting', 'Transfers', 'Ownership', 'Metadata'],
    code: `// ERC-721 NFT Contract
// NOTE: This uses stylus_sdk which requires actual deployment.
// Browser compilation will show errors - click "Deploy" to deploy to Arbitrum.

#![cfg_attr(not(feature = "export-abi"), no_main)]
extern crate alloc;

use alloc::string::String;
use stylus_sdk::{
    alloy_primitives::{Address, U256},
    evm, msg,
    prelude::*,
    storage::{StorageAddress, StorageMap, StorageU256, StorageString},
};

sol_storage! {
    #[entrypoint]
    pub struct Erc721 {
        StorageString name;
        StorageString symbol;
        StorageU256 token_id_counter;
        StorageMap<U256, Address> owners;
        StorageMap<Address, U256> balances;
        StorageMap<U256, Address> token_approvals;
        StorageMap<Address, StorageMap<Address, bool>> operator_approvals;
        StorageMap<U256, String> token_uris;
    }
}

sol! {
    event Transfer(address indexed from, address indexed to, uint256 indexed token_id);
    event Approval(address indexed owner, address indexed approved, uint256 indexed token_id);
    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);
}

#[public]
impl Erc721 {
    /// Initialize NFT collection
    pub fn init(&mut self, name: String, symbol: String) {
        self.name.set_str(name);
        self.symbol.set_str(symbol);
        self.token_id_counter.set(U256::from(0));
    }

    /// Get collection name
    pub fn name(&self) -> String {
        self.name.get_string()
    }

    /// Get collection symbol
    pub fn symbol(&self) -> String {
        self.symbol.get_string()
    }

    /// Get owner of a token
    pub fn owner_of(&self, token_id: U256) -> Address {
        self.owners.get(token_id)
    }

    /// Get balance of an address
    pub fn balance_of(&self, owner: Address) -> U256 {
        self.balances.get(owner)
    }

    /// Get token URI
    pub fn token_uri(&self, token_id: U256) -> String {
        self.token_uris.get(token_id)
    }

    /// Mint a new NFT
    pub fn mint(&mut self, to: Address, uri: String) -> U256 {
        let token_id = self.token_id_counter.get();
        self.token_id_counter.set(token_id + U256::from(1));
        
        self.owners.setter(token_id).set(to);
        let balance = self.balances.get(to);
        self.balances.setter(to).set(balance + U256::from(1));
        self.token_uris.setter(token_id).set_str(uri);
        
        evm::log(Transfer {
            from: Address::ZERO,
            to,
            token_id,
        });
        
        token_id
    }

    /// Transfer NFT to another address
    pub fn transfer_from(&mut self, from: Address, to: Address, token_id: U256) {
        let owner = self.owners.get(token_id);
        assert!(owner == from, "Not token owner");
        
        let sender = msg::sender();
        assert!(
            sender == owner || self.is_approved_for_all(owner, sender) || self.get_approved(token_id) == sender,
            "Not authorized"
        );
        
        self._transfer(from, to, token_id);
    }

    /// Approve address to transfer token
    pub fn approve(&mut self, to: Address, token_id: U256) {
        let owner = self.owners.get(token_id);
        assert!(msg::sender() == owner, "Not token owner");
        
        self.token_approvals.setter(token_id).set(to);
        
        evm::log(Approval {
            owner,
            approved: to,
            token_id,
        });
    }

    /// Get approved address for token
    pub fn get_approved(&self, token_id: U256) -> Address {
        self.token_approvals.get(token_id)
    }

    /// Set operator approval for all tokens
    pub fn set_approval_for_all(&mut self, operator: Address, approved: bool) {
        let owner = msg::sender();
        self.operator_approvals.setter(owner).setter(operator).set(approved);
        
        evm::log(ApprovalForAll {
            owner,
            operator,
            approved,
        });
    }

    /// Check if operator is approved for all
    pub fn is_approved_for_all(&self, owner: Address, operator: Address) -> bool {
        self.operator_approvals.getter(owner).get(operator)
    }

    /// Internal transfer
    fn _transfer(&mut self, from: Address, to: Address, token_id: U256) {
        self.owners.setter(token_id).set(to);
        
        let from_balance = self.balances.get(from);
        self.balances.setter(from).set(from_balance - U256::from(1));
        
        let to_balance = self.balances.get(to);
        self.balances.setter(to).set(to_balance + U256::from(1));
        
        self.token_approvals.setter(token_id).set(Address::ZERO);
        
        evm::log(Transfer {
            from,
            to,
            token_id,
        });
    }

    /// Burn a token
    pub fn burn(&mut self, token_id: U256) {
        let owner = self.owners.get(token_id);
        assert!(msg::sender() == owner, "Not token owner");
        
        self.owners.setter(token_id).set(Address::ZERO);
        let balance = self.balances.get(owner);
        self.balances.setter(owner).set(balance - U256::from(1));
        
        evm::log(Transfer {
            from: owner,
            to: Address::ZERO,
            token_id,
        });
    }
}`,
  },
  {
    id: 'multisig',
    name: 'Multi-Signature Wallet',
    description: 'Secure wallet requiring multiple signatures for transaction execution',
    category: 'advanced',
    difficulty: 'advanced',
    icon: 'lock',
    gasEstimate: '~15k',
    features: ['Multi-Sig', 'Proposals', 'Voting', 'Security'],
    code: `// Multi-Signature Wallet
// NOTE: This uses stylus_sdk which requires actual deployment.
// Browser compilation will show errors - click "Deploy" to deploy to Arbitrum.

#![cfg_attr(not(feature = "export-abi"), no_main)]
extern crate alloc;

use stylus_sdk::{
    alloy_primitives::{Address, U256},
    call::RawCall,
    evm, msg,
    prelude::*,
    storage::{StorageAddress, StorageArray, StorageMap, StorageU256, StorageBool},
};

sol_storage! {
    #[entrypoint]
    pub struct MultiSigWallet {
        StorageArray<Address> owners;
        StorageMap<Address, bool> is_owner;
        StorageU256 required_confirmations;
        StorageU256 transaction_count;
        StorageMap<U256, Transaction> transactions;
        StorageMap<U256, StorageMap<Address, bool>> confirmations;
    }

    pub struct Transaction {
        Address destination;
        U256 value;
        bool executed;
    }
}

sol! {
    event Submission(uint256 indexed transaction_id);
    event Confirmation(address indexed sender, uint256 indexed transaction_id);
    event Execution(uint256 indexed transaction_id);
    event ExecutionFailure(uint256 indexed transaction_id);
}

#[public]
impl MultiSigWallet {
    /// Initialize wallet with owners and required confirmations
    pub fn init(&mut self, owner_addresses: Vec<Address>, required: U256) {
        assert!(owner_addresses.len() > 0, "Owners required");
        assert!(required > U256::ZERO && required <= U256::from(owner_addresses.len()), "Invalid required count");
        
        for owner in owner_addresses {
            self.owners.push(owner);
            self.is_owner.setter(owner).set(true);
        }
        
        self.required_confirmations.set(required);
        self.transaction_count.set(U256::ZERO);
    }

    /// Submit a new transaction
    pub fn submit_transaction(&mut self, destination: Address, value: U256) -> U256 {
        assert!(self.is_owner.get(msg::sender()), "Not owner");
        
        let tx_id = self.transaction_count.get();
        self.transaction_count.set(tx_id + U256::from(1));
        
        let mut tx = self.transactions.setter(tx_id);
        tx.destination.set(destination);
        tx.value.set(value);
        tx.executed.set(false);
        
        evm::log(Submission { transaction_id: tx_id });
        
        self.confirm_transaction(tx_id);
        
        tx_id
    }

    /// Confirm a transaction
    pub fn confirm_transaction(&mut self, transaction_id: U256) {
        let sender = msg::sender();
        assert!(self.is_owner.get(sender), "Not owner");
        assert!(!self.confirmations.getter(transaction_id).get(sender), "Already confirmed");
        
        self.confirmations.setter(transaction_id).setter(sender).set(true);
        
        evm::log(Confirmation {
            sender,
            transaction_id,
        });
        
        self.try_execute_transaction(transaction_id);
    }

    /// Execute transaction if enough confirmations
    fn try_execute_transaction(&mut self, transaction_id: U256) {
        let tx = self.transactions.getter(transaction_id);
        
        if tx.executed.get() {
            return;
        }
        
        if self.is_confirmed(transaction_id) {
            self.transactions.setter(transaction_id).executed.set(true);
            
            let destination = tx.destination.get();
            let value = tx.value.get();
            
            let result = RawCall::new().value(value).call(destination, &[]);
            
            if result.is_ok() {
                evm::log(Execution { transaction_id });
            } else {
                evm::log(ExecutionFailure { transaction_id });
                self.transactions.setter(transaction_id).executed.set(false);
            }
        }
    }

    /// Check if transaction has enough confirmations
    pub fn is_confirmed(&self, transaction_id: U256) -> bool {
        let mut count = U256::ZERO;
        
        for i in 0..self.owners.len() {
            let owner = self.owners.get(i).expect("Owner not found");
            if self.confirmations.getter(transaction_id).get(owner) {
                count += U256::from(1);
            }
        }
        
        count >= self.required_confirmations.get()
    }

    /// Get confirmation count for transaction
    pub fn get_confirmation_count(&self, transaction_id: U256) -> U256 {
        let mut count = U256::ZERO;
        
        for i in 0..self.owners.len() {
            let owner = self.owners.get(i).expect("Owner not found");
            if self.confirmations.getter(transaction_id).get(owner) {
                count += U256::from(1);
            }
        }
        
        count
    }

    /// Get transaction details
    pub fn get_transaction(&self, transaction_id: U256) -> (Address, U256, bool) {
        let tx = self.transactions.getter(transaction_id);
        (tx.destination.get(), tx.value.get(), tx.executed.get())
    }

    /// Get number of owners
    pub fn owner_count(&self) -> U256 {
        U256::from(self.owners.len())
    }
}`,
  },
  {
    id: 'staking',
    name: 'Staking Contract',
    description: 'Token staking with rewards distribution and time-locked withdrawals',
    category: 'defi',
    difficulty: 'advanced',
    icon: 'trending_up',
    gasEstimate: '~10k',
    features: ['Staking', 'Rewards', 'Time Locks', 'Yield'],
    code: `// Staking Contract
// NOTE: This uses stylus_sdk which requires actual deployment.
// Browser compilation will show errors - click "Deploy" to deploy to Arbitrum.

#![cfg_attr(not(feature = "export-abi"), no_main)]
extern crate alloc;

use stylus_sdk::{
    alloy_primitives::{Address, U256},
    block, evm, msg,
    prelude::*,
    storage::{StorageAddress, StorageMap, StorageU256},
};

sol_storage! {
    #[entrypoint]
    pub struct StakingContract {
        StorageAddress staking_token;
        StorageU256 reward_rate; // Rewards per second per token
        StorageU256 total_staked;
        StorageMap<Address, Stake> stakes;
    }

    pub struct Stake {
        U256 amount;
        U256 start_time;
        U256 last_claim_time;
        U256 total_rewards_claimed;
    }
}

sol! {
    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event RewardClaimed(address indexed user, uint256 reward);
}

#[public]
impl StakingContract {
    /// Initialize staking contract
    pub fn init(&mut self, token: Address, rate: U256) {
        self.staking_token.set(token);
        self.reward_rate.set(rate);
        self.total_staked.set(U256::ZERO);
    }

    /// Stake tokens
    pub fn stake(&mut self, amount: U256) {
        assert!(amount > U256::ZERO, "Cannot stake 0");
        
        let user = msg::sender();
        let current_time = U256::from(block::timestamp());
        
        let mut user_stake = self.stakes.setter(user);
        let existing_amount = user_stake.amount.get();
        
        if existing_amount > U256::ZERO {
            // Claim pending rewards before adding new stake
            self.claim_rewards();
        }
        
        user_stake.amount.set(existing_amount + amount);
        user_stake.start_time.set(current_time);
        user_stake.last_claim_time.set(current_time);
        
        let total = self.total_staked.get();
        self.total_staked.set(total + amount);
        
        evm::log(Staked {
            user,
            amount,
        });
    }

    /// Withdraw staked tokens
    pub fn withdraw(&mut self, amount: U256) {
        let user = msg::sender();
        let user_stake = self.stakes.getter(user);
        let staked_amount = user_stake.amount.get();
        
        assert!(amount > U256::ZERO && amount <= staked_amount, "Invalid amount");
        
        // Claim rewards before withdrawal
        self.claim_rewards();
        
        self.stakes.setter(user).amount.set(staked_amount - amount);
        
        let total = self.total_staked.get();
        self.total_staked.set(total - amount);
        
        evm::log(Withdrawn {
            user,
            amount,
        });
    }

    /// Claim accumulated rewards
    pub fn claim_rewards(&mut self) {
        let user = msg::sender();
        let reward = self.calculate_rewards(user);
        
        if reward > U256::ZERO {
            let current_time = U256::from(block::timestamp());
            self.stakes.setter(user).last_claim_time.set(current_time);
            
            let claimed = self.stakes.getter(user).total_rewards_claimed.get();
            self.stakes.setter(user).total_rewards_claimed.set(claimed + reward);
            
            evm::log(RewardClaimed {
                user,
                reward,
            });
        }
    }

    /// Calculate pending rewards for a user
    pub fn calculate_rewards(&self, user: Address) -> U256 {
        let user_stake = self.stakes.getter(user);
        let staked_amount = user_stake.amount.get();
        
        if staked_amount == U256::ZERO {
            return U256::ZERO;
        }
        
        let current_time = U256::from(block::timestamp());
        let last_claim = user_stake.last_claim_time.get();
        let time_elapsed = current_time - last_claim;
        
        let reward_rate = self.reward_rate.get();
        
        // reward = staked_amount * reward_rate * time_elapsed / 1e18
        (staked_amount * reward_rate * time_elapsed) / U256::from(1_000_000_000_000_000_000u128)
    }

    /// Get stake info for user
    pub fn get_stake_info(&self, user: Address) -> (U256, U256, U256, U256) {
        let stake = self.stakes.getter(user);
        (
            stake.amount.get(),
            stake.start_time.get(),
            stake.last_claim_time.get(),
            stake.total_rewards_claimed.get(),
        )
    }

    /// Get total staked amount
    pub fn get_total_staked(&self) -> U256 {
        self.total_staked.get()
    }

    /// Get pending rewards for user
    pub fn get_pending_rewards(&self, user: Address) -> U256 {
        self.calculate_rewards(user)
    }
}`,
  },
];

export function getTemplateById(id: string): CodeTemplate | undefined {
  return codeTemplates.find(template => template.id === id);
}

export function getTemplatesByCategory(category: string): CodeTemplate[] {
  return codeTemplates.filter(template => template.category === category);
}

export function getTemplatesByDifficulty(difficulty: string): CodeTemplate[] {
  return codeTemplates.filter(template => template.difficulty === difficulty);
}
