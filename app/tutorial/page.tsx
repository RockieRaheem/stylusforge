'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Tutorial {
  id: number;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  completed: boolean;
  locked: boolean;
  icon: string;
  color: string;
  sections: LessonSection[];
}

interface LessonSection {
  id: number;
  title: string;
  content: string;
  codeExample?: string;
  language?: string;
  tip?: string;
}

interface Assignment {
  id: number;
  title: string;
  description: string;
  starterCode: string;
  solution: string;
  hints: string[];
}

export default function TutorialPage() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'basics' | 'advanced' | 'defi'>('all');
  const [selectedTutorial, setSelectedTutorial] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState<number>(0);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [userCode, setUserCode] = useState<string>('');
  const [showSolution, setShowSolution] = useState<boolean>(false);

  const tutorialContent: Record<number, { sections: LessonSection[], assignment: Assignment }> = {
    1: {
      sections: [
        {
          id: 1,
          title: 'Introduction to Stylus',
          content: `Stylus is Arbitrum's next-generation programming environment that lets you write smart contracts in Rust, C, and C++. 
          
Unlike traditional EVM contracts written in Solidity, Stylus contracts are compiled to WebAssembly (WASM), which offers:

• **10-100x lower gas costs** for compute-intensive operations
• **Memory-safe execution** with Rust's ownership system
• **Access to existing Rust libraries** and tooling
• **Full EVM compatibility** - can call and be called by Solidity contracts

Stylus opens up blockchain development to millions of developers already familiar with these languages.`,
          tip: 'Stylus contracts can be up to 100x cheaper to execute than equivalent Solidity contracts!'
        },
        {
          id: 2,
          title: 'Setting Up Your Environment',
          content: `Before writing your first contract, you need to set up your development environment.

**Prerequisites:**
1. Rust toolchain (rustc, cargo)
2. Stylus CLI tool
3. An Arbitrum-compatible wallet

**Installation Steps:**

First, install Rust if you haven't already:`,
          codeExample: `# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Install Stylus CLI
cargo install --force cargo-stylus

# Verify installation
cargo stylus --version`,
          language: 'bash'
        },
        {
          id: 3,
          title: 'Creating Your First Project',
          content: `Let's create a simple counter contract that demonstrates the basics of Stylus development.

**Project Structure:**
A Stylus project follows Rust's standard project structure with some additions:`,
          codeExample: `# Create a new Stylus project
cargo stylus new my_counter

# Project structure:
my_counter/
├── Cargo.toml          # Dependencies and metadata
├── src/
│   └── lib.rs         # Your contract code
└── .cargo/
    └── config.toml    # Build configuration`,
          language: 'bash',
          tip: 'Always use cargo stylus commands instead of regular cargo for Stylus-specific tasks.'
        },
        {
          id: 4,
          title: 'Writing Your First Contract',
          content: `Now let's write a simple contract. Every Stylus contract needs to import the SDK and define storage.

**Key Concepts:**
• **#[storage]** - Marks a struct as contract storage
• **#[external]** - Marks functions callable from outside
• **StorageType** - Trait for types that can be stored on-chain`,
          codeExample: `use stylus_sdk::{prelude::*, alloy_primitives::U256};

// Define contract storage
#[storage]
pub struct Counter {
    count: StorageU256,  // Persistent storage
}

// Implement contract methods
#[external]
impl Counter {
    // Initialize the counter
    pub fn initialize(&mut self) {
        self.count.set(U256::ZERO);
    }

    // Increment the counter
    pub fn increment(&mut self) {
        let current = self.count.get();
        self.count.set(current + U256::from(1));
    }

    // Read the current count
    pub fn get(&self) -> U256 {
        self.count.get()
    }
}`,
          language: 'rust'
        },
        {
          id: 5,
          title: 'Understanding Storage',
          content: `Storage in Stylus works differently from memory. Understanding this is crucial:

**Storage Types:**
• **StorageU256** - Unsigned 256-bit integers
• **StorageBool** - Boolean values
• **StorageAddress** - Ethereum addresses
• **StorageVec<T>** - Dynamic arrays
• **StorageMap<K, V>** - Key-value mappings

**Important Notes:**
- Storage is persistent across transactions
- Reading storage costs gas
- Writing storage costs even more gas
- Always minimize storage operations`,
          codeExample: `#[storage]
pub struct MyContract {
    owner: StorageAddress,
    balance: StorageU256,
    is_active: StorageBool,
    users: StorageVec<StorageAddress>,
    balances: StorageMap<StorageAddress, StorageU256>,
}`,
          language: 'rust',
          tip: 'Use memory for temporary calculations and storage only for data that must persist!'
        }
      ],
      assignment: {
        id: 1,
        title: 'Build a Simple Counter',
        description: 'Create a counter contract with increment, decrement, and reset functionality. The contract should maintain a count value and allow users to modify it.',
        starterCode: `use stylus_sdk::{prelude::*, alloy_primitives::U256};

#[storage]
pub struct Counter {
    // TODO: Add a count storage variable
}

#[external]
impl Counter {
    // TODO: Implement initialize function
    
    // TODO: Implement increment function
    
    // TODO: Implement decrement function
    
    // TODO: Implement reset function
    
    // TODO: Implement get function
}`,
        solution: `use stylus_sdk::{prelude::*, alloy_primitives::U256};

#[storage]
pub struct Counter {
    count: StorageU256,
}

#[external]
impl Counter {
    pub fn initialize(&mut self) {
        self.count.set(U256::ZERO);
    }
    
    pub fn increment(&mut self) {
        let current = self.count.get();
        self.count.set(current + U256::from(1));
    }
    
    pub fn decrement(&mut self) {
        let current = self.count.get();
        if current > U256::ZERO {
            self.count.set(current - U256::from(1));
        }
    }
    
    pub fn reset(&mut self) {
        self.count.set(U256::ZERO);
    }
    
    pub fn get(&self) -> U256 {
        self.count.get()
    }
}`,
        hints: [
          'Use StorageU256 for the count variable',
          'Remember to check for underflow in decrement',
          'The get function should be a view function (use &self, not &mut self)',
          'Initialize sets the count to zero using U256::ZERO'
        ]
      }
    },
    2: {
      sections: [
        {
          id: 1,
          title: 'Storage Deep Dive',
          content: `Storage is the persistent data layer of your smart contract. Unlike memory, which is cleared after each function call, storage persists between transactions and even after contract upgrades.

**Storage Costs:**
- First write to a slot: ~20,000 gas
- Subsequent writes: ~5,000 gas
- Reading: ~200 gas

**Best Practices:**
• Pack multiple values into single storage slots when possible
• Use events to store data that doesn't need to be read on-chain
• Cache frequently-read values in memory
• Use storage pointers to avoid unnecessary copies`,
          tip: 'Optimizing storage access can reduce your gas costs by 50-90%!'
        },
        {
          id: 2,
          title: 'Storage Types in Detail',
          content: `Stylus provides several storage primitives. Let's explore each one:`,
          codeExample: `use stylus_sdk::{prelude::*, alloy_primitives::{U256, Address}};

#[storage]
pub struct DataStore {
    // Simple types
    counter: StorageU256,
    is_active: StorageBool,
    owner: StorageAddress,
    
    // Dynamic array
    user_list: StorageVec<StorageAddress>,
    
    // Mapping (like Solidity's mapping)
    balances: StorageMap<StorageAddress, StorageU256>,
    
    // Nested mapping
    allowances: StorageMap<StorageAddress, StorageMap<StorageAddress, StorageU256>>,
}`,
          language: 'rust'
        },
        {
          id: 3,
          title: 'Working with StorageMap',
          content: `StorageMap is one of the most powerful storage types. It's similar to Solidity's mapping but with Rust's type safety.`,
          codeExample: `#[external]
impl DataStore {
    // Set a balance
    pub fn set_balance(&mut self, user: Address, amount: U256) {
        self.balances.insert(user, amount);
    }
    
    // Get a balance (returns 0 if not found)
    pub fn get_balance(&self, user: Address) -> U256 {
        self.balances.get(user).unwrap_or(U256::ZERO)
    }
    
    // Check if user exists
    pub fn has_user(&self, user: Address) -> bool {
        self.balances.get(user).is_some()
    }
    
    // Update balance
    pub fn add_balance(&mut self, user: Address, amount: U256) {
        let current = self.get_balance(user);
        self.balances.insert(user, current + amount);
    }
}`,
          language: 'rust',
          tip: 'StorageMap.get() returns Option<T>, so always handle the None case!'
        },
        {
          id: 4,
          title: 'Working with StorageVec',
          content: `StorageVec is a dynamic array that lives in storage. Use it for lists that need to grow over time.`,
          codeExample: `#[external]
impl DataStore {
    // Add user to list
    pub fn add_user(&mut self, user: Address) {
        self.user_list.push(user);
    }
    
    // Get user at index
    pub fn get_user(&self, index: U256) -> Address {
        let idx = index.to::<usize>();
        self.user_list.get(idx).unwrap()
    }
    
    // Get total users
    pub fn user_count(&self) -> U256 {
        U256::from(self.user_list.len())
    }
    
    // Remove last user
    pub fn remove_last_user(&mut self) {
        if !self.user_list.is_empty() {
            self.user_list.pop();
        }
    }
}`,
          language: 'rust',
          tip: 'Be careful with large arrays - iterating over them can be extremely expensive!'
        }
      ],
      assignment: {
        id: 2,
        title: 'Build a User Registry',
        description: 'Create a contract that maintains a registry of users with balances. Implement functions to add users, update balances, and query user information.',
        starterCode: `use stylus_sdk::{prelude::*, alloy_primitives::{U256, Address}};

#[storage]
pub struct UserRegistry {
    // TODO: Add storage for user balances (mapping)
    // TODO: Add storage for user list (vector)
    // TODO: Add storage for total registered users
}

#[external]
impl UserRegistry {
    // TODO: register_user(address, initial_balance)
    
    // TODO: update_balance(address, new_balance)
    
    // TODO: get_balance(address) -> U256
    
    // TODO: get_user_count() -> U256
    
    // TODO: is_registered(address) -> bool
}`,
        solution: `use stylus_sdk::{prelude::*, alloy_primitives::{U256, Address}};

#[storage]
pub struct UserRegistry {
    balances: StorageMap<StorageAddress, StorageU256>,
    users: StorageVec<StorageAddress>,
    user_count: StorageU256,
}

#[external]
impl UserRegistry {
    pub fn register_user(&mut self, user: Address, initial_balance: U256) {
        if self.balances.get(user).is_none() {
            self.balances.insert(user, initial_balance);
            self.users.push(user);
            let count = self.user_count.get();
            self.user_count.set(count + U256::from(1));
        }
    }
    
    pub fn update_balance(&mut self, user: Address, new_balance: U256) {
        if self.balances.get(user).is_some() {
            self.balances.insert(user, new_balance);
        }
    }
    
    pub fn get_balance(&self, user: Address) -> U256 {
        self.balances.get(user).unwrap_or(U256::ZERO)
    }
    
    pub fn get_user_count(&self) -> U256 {
        self.user_count.get()
    }
    
    pub fn is_registered(&self, user: Address) -> bool {
        self.balances.get(user).is_some()
    }
}`,
        hints: [
          'Use StorageMap for the balances to enable O(1) lookups',
          'StorageVec is useful for keeping track of all registered users',
          'Always check if a user exists before updating',
          'Remember to increment the user count when registering'
        ]
      }
    },
    3: {
      sections: [
        {
          id: 1,
          title: 'Understanding Functions',
          content: `Functions in Stylus contracts come in two main types:

**Mutable Functions (&mut self):**
- Can modify contract storage
- Cost gas to execute
- Change blockchain state
- Example: transfer, mint, burn

**View Functions (&self):**
- Read-only, cannot modify storage
- Free to call (no gas) when called externally
- Don't change blockchain state
- Example: balanceOf, totalSupply, owner

The #[external] attribute makes functions callable from outside the contract.`,
          tip: 'Use view functions whenever possible - they\'re free for users to call!'
        },
        {
          id: 2,
          title: 'Function Visibility',
          content: `Control who can call your functions with Rust's visibility modifiers:`,
          codeExample: `#[external]
impl MyContract {
    // Public - anyone can call
    pub fn public_function(&self) -> U256 {
        self.some_value.get()
    }
    
    // Internal - only used within contract
    // NOT marked with pub, so not externally callable
    fn internal_helper(&self) -> U256 {
        // Helper logic
        U256::from(42)
    }
}

// Private implementation (not in #[external] block)
impl MyContract {
    // Only usable within the contract
    fn private_calculation(&self, x: U256, y: U256) -> U256 {
        x + y
    }
}`,
          language: 'rust',
          tip: 'Functions outside the #[external] block are automatically internal!'
        },
        {
          id: 3,
          title: 'Function Parameters and Returns',
          content: `Stylus functions can accept various types and return values:`,
          codeExample: `use stylus_sdk::{prelude::*, alloy_primitives::{U256, Address}};

#[external]
impl MyContract {
    // Simple types
    pub fn set_value(&mut self, value: U256) {
        self.value.set(value);
    }
    
    // Multiple parameters
    pub fn transfer(&mut self, to: Address, amount: U256) -> bool {
        // Transfer logic
        true
    }
    
    // Multiple return values (using tuple)
    pub fn get_info(&self) -> (Address, U256, bool) {
        (
            self.owner.get(),
            self.balance.get(),
            self.is_active.get()
        )
    }
    
    // Array parameters
    pub fn batch_update(&mut self, addresses: Vec<Address>, amounts: Vec<U256>) {
        for (addr, amt) in addresses.iter().zip(amounts.iter()) {
            self.balances.insert(*addr, *amt);
        }
    }
}`,
          language: 'rust'
        },
        {
          id: 4,
          title: 'Access Control',
          content: `Protect sensitive functions with access control modifiers:`,
          codeExample: `use stylus_sdk::{prelude::*, alloy_primitives::Address, msg};

#[storage]
pub struct Controlled {
    owner: StorageAddress,
}

#[external]
impl Controlled {
    // Initialize with owner
    pub fn initialize(&mut self) {
        self.owner.set(msg::sender());
    }
    
    // Only owner can call
    pub fn admin_function(&mut self) {
        require(msg::sender() == self.owner.get(), "Not owner");
        // Admin logic here
    }
    
    // Transfer ownership
    pub fn transfer_ownership(&mut self, new_owner: Address) {
        require(msg::sender() == self.owner.get(), "Not owner");
        self.owner.set(new_owner);
    }
    
    // Public view function
    pub fn get_owner(&self) -> Address {
        self.owner.get()
    }
}

// Helper function for access control
fn require(condition: bool, message: &str) {
    if !condition {
        panic!("{}", message);
    }
}`,
          language: 'rust',
          tip: 'Always validate msg::sender() for sensitive operations!'
        }
      ],
      assignment: {
        id: 3,
        title: 'Build an Access-Controlled Vault',
        description: 'Create a vault contract where only the owner can deposit and withdraw, but anyone can view the balance. Include ownership transfer functionality.',
        starterCode: `use stylus_sdk::{prelude::*, alloy_primitives::{U256, Address}, msg};

#[storage]
pub struct Vault {
    // TODO: Add owner address
    // TODO: Add balance
}

#[external]
impl Vault {
    // TODO: initialize() - sets msg::sender() as owner
    
    // TODO: deposit(amount) - only owner
    
    // TODO: withdraw(amount) - only owner
    
    // TODO: get_balance() -> U256 - public view
    
    // TODO: get_owner() -> Address - public view
    
    // TODO: transfer_ownership(new_owner) - only owner
}`,
        solution: `use stylus_sdk::{prelude::*, alloy_primitives::{U256, Address}, msg};

#[storage]
pub struct Vault {
    owner: StorageAddress,
    balance: StorageU256,
}

#[external]
impl Vault {
    pub fn initialize(&mut self) {
        self.owner.set(msg::sender());
        self.balance.set(U256::ZERO);
    }
    
    pub fn deposit(&mut self, amount: U256) {
        require(msg::sender() == self.owner.get(), "Not owner");
        let current = self.balance.get();
        self.balance.set(current + amount);
    }
    
    pub fn withdraw(&mut self, amount: U256) {
        require(msg::sender() == self.owner.get(), "Not owner");
        let current = self.balance.get();
        require(current >= amount, "Insufficient balance");
        self.balance.set(current - amount);
    }
    
    pub fn get_balance(&self) -> U256 {
        self.balance.get()
    }
    
    pub fn get_owner(&self) -> Address {
        self.owner.get()
    }
    
    pub fn transfer_ownership(&mut self, new_owner: Address) {
        require(msg::sender() == self.owner.get(), "Not owner");
        self.owner.set(new_owner);
    }
}

fn require(condition: bool, message: &str) {
    if !condition {
        panic!("{}", message);
    }
}`,
        hints: [
          'Use msg::sender() to get the caller\'s address',
          'Create a require helper function for cleaner code',
          'Remember to check balance before withdrawing',
          'View functions use &self, not &mut self'
        ]
      }
    }
  };

  const tutorials: Tutorial[] = [
    {
      id: 1,
      title: 'Getting Started with Stylus',
      description: 'Learn the basics of Stylus SDK and create your first smart contract',
      difficulty: 'Beginner',
      duration: '15 min',
      completed: true,
      locked: false,
      icon: 'rocket_launch',
      color: '#58a6ff',
      sections: []
    },
    {
      id: 2,
      title: 'Storage & State Variables',
      description: 'Understand how to work with storage and manage contract state',
      difficulty: 'Beginner',
      duration: '20 min',
      completed: true,
      locked: false,
      icon: 'storage',
      color: '#3fb950',
      sections: []
    },
    {
      id: 3,
      title: 'Functions & Methods',
      description: 'Master contract functions, visibility, and method implementations',
      difficulty: 'Beginner',
      duration: '25 min',
      completed: false,
      locked: false,
      icon: 'code',
      color: '#a371f7',
      sections: []
    },
    {
      id: 4,
      title: 'Events & Logging',
      description: 'Learn to emit events and track contract activity on-chain',
      difficulty: 'Intermediate',
      duration: '20 min',
      completed: false,
      locked: false,
      icon: 'notifications',
      color: '#f85149',
      sections: []
    },
    {
      id: 5,
      title: 'Error Handling',
      description: 'Implement robust error handling and custom error types',
      difficulty: 'Intermediate',
      duration: '18 min',
      completed: false,
      locked: false,
      icon: 'error',
      color: '#f85149',
      sections: []
    },
    {
      id: 6,
      title: 'Testing Contracts',
      description: 'Write comprehensive tests for your smart contracts',
      difficulty: 'Intermediate',
      duration: '30 min',
      completed: false,
      locked: false,
      icon: 'science',
      color: '#58a6ff',
      sections: []
    },
    {
      id: 7,
      title: 'Gas Optimization',
      description: 'Optimize your contracts for minimal gas consumption',
      difficulty: 'Advanced',
      duration: '35 min',
      completed: false,
      locked: false,
      icon: 'speed',
      color: '#3fb950',
      sections: []
    },
    {
      id: 8,
      title: 'Advanced Patterns',
      description: 'Explore design patterns and best practices for complex contracts',
      difficulty: 'Advanced',
      duration: '40 min',
      completed: false,
      locked: true,
      icon: 'architecture',
      color: '#a371f7',
      sections: []
    },
    {
      id: 9,
      title: 'DeFi Token Creation',
      description: 'Build an ERC-20 compatible token with advanced features',
      difficulty: 'Advanced',
      duration: '45 min',
      completed: false,
      locked: true,
      icon: 'currency_exchange',
      color: '#f85149',
      sections: []
    },
    {
      id: 10,
      title: 'NFT Marketplace',
      description: 'Create a complete NFT marketplace smart contract',
      difficulty: 'Advanced',
      duration: '60 min',
      completed: false,
      locked: true,
      icon: 'storefront',
      color: '#58a6ff',
      sections: []
    },
  ];

  const completedCount = tutorials.filter(t => t.completed).length;
  const progressPercent = Math.round((completedCount / tutorials.length) * 100);

  const filteredTutorials = tutorials.filter(tutorial => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'basics') return tutorial.difficulty === 'Beginner';
    if (selectedCategory === 'advanced') return tutorial.difficulty === 'Advanced';
    if (selectedCategory === 'defi') return tutorial.title.includes('DeFi') || tutorial.title.includes('Token') || tutorial.title.includes('NFT');
    return true;
  });

  const selectedTutorialData = selectedTutorial ? tutorials.find(t => t.id === selectedTutorial) : null;
  const lessonContent = selectedTutorial && tutorialContent[selectedTutorial] ? tutorialContent[selectedTutorial] : null;

  // If a tutorial is selected, show the lesson view
  if (selectedTutorial && selectedTutorialData && lessonContent) {
    return (
      <div className="relative flex h-screen w-full flex-col bg-[#0d1117] text-white overflow-hidden">
        {/* Header */}
        <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-[#21262d] bg-[#0d1117] px-6 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                setSelectedTutorial(null);
                setActiveSection(0);
                setShowHint(false);
                setShowSolution(false);
                setUserCode('');
              }}
              className="flex items-center justify-center p-2 text-[#8b949e] transition-all hover:text-white hover:bg-[#21262d] rounded-lg"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <div className="flex items-center gap-3">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{backgroundColor: `${selectedTutorialData.color}20`}}
              >
                <span className="material-symbols-outlined text-lg" style={{color: selectedTutorialData.color}}>
                  {selectedTutorialData.icon}
                </span>
              </div>
              <div>
                <h1 className="text-base font-semibold text-white">{selectedTutorialData.title}</h1>
                <p className="text-xs text-[#8b949e]">{selectedTutorialData.difficulty} • {selectedTutorialData.duration}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#21262d] border border-[#30363d]">
              <span className="material-symbols-outlined text-[#8b949e] text-sm">progress_activity</span>
              <span className="text-[#8b949e] text-sm">Section {activeSection + 1}/{lessonContent.sections.length}</span>
            </div>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar - Section Navigation */}
          <aside className="w-80 border-r border-[#21262d] bg-[#0d1117] overflow-y-auto">
            <div className="p-4 space-y-1">
              <h3 className="text-[#8b949e] text-xs font-semibold uppercase mb-3 px-3">Lesson Sections</h3>
              {lessonContent.sections.map((section, index) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(index)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg transition-all ${
                    activeSection === index
                      ? 'bg-[#58a6ff]/10 border border-[#58a6ff]/30 text-white'
                      : 'text-[#8b949e] hover:bg-[#21262d] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                      activeSection === index ? 'bg-[#58a6ff] text-white' : 'bg-[#21262d] text-[#8b949e]'
                    }`}>
                      {index + 1}
                    </span>
                    <span className="font-medium text-sm">{section.title}</span>
                  </div>
                </button>
              ))}
              
              <div className="pt-4 mt-4 border-t border-[#21262d]">
                <button
                  onClick={() => setActiveSection(lessonContent.sections.length)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg transition-all ${
                    activeSection === lessonContent.sections.length
                      ? 'bg-[#3fb950]/10 border border-[#3fb950]/30 text-white'
                      : 'text-[#8b949e] hover:bg-[#21262d] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">assignment</span>
                    <span className="font-semibold text-sm">Assignment</span>
                  </div>
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto p-8 space-y-6">
              
              {activeSection < lessonContent.sections.length ? (
                // Lesson Section View
                <>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 rounded-full bg-[#58a6ff]/10 text-[#58a6ff] text-xs font-semibold">
                        Section {activeSection + 1}
                      </span>
                    </div>
                    <h2 className="text-3xl font-bold text-white">
                      {lessonContent.sections[activeSection].title}
                    </h2>
                  </div>

                  <div className="prose prose-invert max-w-none">
                    <div className="text-[#8b949e] text-base leading-relaxed whitespace-pre-line">
                      {lessonContent.sections[activeSection].content}
                    </div>
                  </div>

                  {lessonContent.sections[activeSection].codeExample && (
                    <div className="border border-[#30363d] rounded-lg overflow-hidden bg-[#0d1117]">
                      <div className="flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-[#30363d]">
                        <span className="text-[#8b949e] text-sm font-medium">
                          {lessonContent.sections[activeSection].language || 'rust'}
                        </span>
                        <button className="flex items-center gap-1 px-2 py-1 rounded text-[#8b949e] hover:text-white hover:bg-[#21262d] transition-all">
                          <span className="material-symbols-outlined text-sm">content_copy</span>
                          <span className="text-xs">Copy</span>
                        </button>
                      </div>
                      <pre className="p-4 overflow-x-auto">
                        <code className="text-sm text-[#e6edf3] font-mono">
                          {lessonContent.sections[activeSection].codeExample}
                        </code>
                      </pre>
                    </div>
                  )}

                  {lessonContent.sections[activeSection].tip && (
                    <div className="flex gap-3 p-4 rounded-lg bg-[#58a6ff]/5 border border-[#58a6ff]/20">
                      <span className="material-symbols-outlined text-[#58a6ff] text-xl">lightbulb</span>
                      <div>
                        <h4 className="text-[#58a6ff] font-semibold text-sm mb-1">Pro Tip</h4>
                        <p className="text-[#8b949e] text-sm">
                          {lessonContent.sections[activeSection].tip}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-6 border-t border-[#21262d]">
                    <button
                      onClick={() => activeSection > 0 && setActiveSection(activeSection - 1)}
                      disabled={activeSection === 0}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                        activeSection === 0
                          ? 'text-[#8b949e] cursor-not-allowed'
                          : 'text-white hover:bg-[#21262d]'
                      }`}
                    >
                      <span className="material-symbols-outlined">arrow_back</span>
                      <span>Previous</span>
                    </button>
                    
                    <button
                      onClick={() => setActiveSection(activeSection + 1)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#58a6ff] hover:bg-[#1f6feb] text-white transition-all"
                    >
                      <span>
                        {activeSection === lessonContent.sections.length - 1 ? 'Go to Assignment' : 'Next Section'}
                      </span>
                      <span className="material-symbols-outlined">arrow_forward</span>
                    </button>
                  </div>
                </>
              ) : (
                // Assignment View
                <>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 rounded-full bg-[#3fb950]/10 text-[#3fb950] text-xs font-semibold">
                        Assignment
                      </span>
                    </div>
                    <h2 className="text-3xl font-bold text-white">
                      {lessonContent.assignment.title}
                    </h2>
                    <p className="text-[#8b949e] text-base leading-relaxed">
                      {lessonContent.assignment.description}
                    </p>
                  </div>

                  {/* Code Editor */}
                  <div className="border border-[#30363d] rounded-lg overflow-hidden bg-[#0d1117]">
                    <div className="flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-[#30363d]">
                      <span className="text-[#8b949e] text-sm font-medium">Your Solution</span>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => setUserCode(lessonContent.assignment.starterCode)}
                          className="flex items-center gap-1 px-2 py-1 rounded text-[#8b949e] hover:text-white hover:bg-[#21262d] transition-all"
                        >
                          <span className="material-symbols-outlined text-sm">refresh</span>
                          <span className="text-xs">Reset</span>
                        </button>
                      </div>
                    </div>
                    <textarea
                      value={userCode || lessonContent.assignment.starterCode}
                      onChange={(e) => setUserCode(e.target.value)}
                      className="w-full h-96 p-4 bg-[#0d1117] text-[#e6edf3] font-mono text-sm resize-none focus:outline-none"
                      spellCheck="false"
                    />
                  </div>

                  {/* Hints Section */}
                  <div className="border border-[#30363d] rounded-lg overflow-hidden bg-[#0d1117]">
                    <button
                      onClick={() => setShowHint(!showHint)}
                      className="w-full flex items-center justify-between px-4 py-3 bg-[#161b22] hover:bg-[#21262d] transition-all"
                    >
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#a371f7]">help</span>
                        <span className="text-white font-medium">Need Help? View Hints</span>
                      </div>
                      <span className={`material-symbols-outlined text-[#8b949e] transition-transform ${showHint ? 'rotate-180' : ''}`}>
                        expand_more
                      </span>
                    </button>
                    {showHint && (
                      <div className="p-4 space-y-2">
                        {lessonContent.assignment.hints.map((hint, index) => (
                          <div key={index} className="flex gap-2 text-[#8b949e] text-sm">
                            <span className="text-[#a371f7] font-bold">{index + 1}.</span>
                            <span>{hint}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Solution Section */}
                  <div className="border border-[#30363d] rounded-lg overflow-hidden bg-[#0d1117]">
                    <button
                      onClick={() => setShowSolution(!showSolution)}
                      className="w-full flex items-center justify-between px-4 py-3 bg-[#161b22] hover:bg-[#21262d] transition-all"
                    >
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#3fb950]">check_circle</span>
                        <span className="text-white font-medium">View Solution</span>
                      </div>
                      <span className={`material-symbols-outlined text-[#8b949e] transition-transform ${showSolution ? 'rotate-180' : ''}`}>
                        expand_more
                      </span>
                    </button>
                    {showSolution && (
                      <div className="border-t border-[#30363d]">
                        <pre className="p-4 overflow-x-auto">
                          <code className="text-sm text-[#e6edf3] font-mono">
                            {lessonContent.assignment.solution}
                          </code>
                        </pre>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-6 border-t border-[#21262d]">
                    <button
                      onClick={() => setActiveSection(activeSection - 1)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-white hover:bg-[#21262d] transition-all"
                    >
                      <span className="material-symbols-outlined">arrow_back</span>
                      <span>Back to Lesson</span>
                    </button>
                    
                    <button className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#3fb950] hover:bg-[#2ea043] text-white font-medium transition-all">
                      <span className="material-symbols-outlined">check</span>
                      <span>Mark as Complete</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-screen w-full flex-col bg-[#0d1117] text-white overflow-hidden">
      {/* Header */}
      <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-[#21262d] bg-[#0d1117] px-6 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="flex items-center justify-center p-2 text-[#8b949e] transition-all hover:text-white hover:bg-[#21262d] rounded-lg">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#a371f7]/20 to-[#58a6ff]/20 flex items-center justify-center border border-[#30363d]">
              <span className="material-symbols-outlined text-[#a371f7] text-lg">school</span>
            </div>
            <h1 className="text-lg font-semibold text-white">Stylus Tutorials</h1>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-[#8b949e] hover:text-white text-sm font-medium transition-colors">Home</Link>
          <Link href="/ide" className="text-[#8b949e] hover:text-white text-sm font-medium transition-colors">IDE</Link>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#58a6ff] to-[#a371f7] flex items-center justify-center text-white text-sm font-semibold">
            AX
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-8 space-y-8">
            
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-xl border border-[#30363d] bg-gradient-to-br from-[#161b22] to-[#0d1117] p-8">
              <div className="absolute top-0 right-0 w-96 h-96 bg-[#a371f7]/5 rounded-full blur-3xl"></div>
              <div className="relative z-10">
                <div className="flex items-start justify-between gap-6 mb-6">
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold text-white mb-3 bg-gradient-to-r from-white to-[#8b949e] bg-clip-text text-transparent">
                      Master Stylus Development
                    </h2>
                    <p className="text-[#8b949e] text-base mb-4 max-w-2xl">
                      Build high-performance smart contracts on Arbitrum using Rust and the Stylus SDK. 
                      Follow our comprehensive tutorials from basics to advanced patterns.
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#3fb950] text-lg">check_circle</span>
                        <span className="text-[#8b949e] text-sm">{completedCount} completed</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#58a6ff] text-lg">pending</span>
                        <span className="text-[#8b949e] text-sm">{tutorials.length - completedCount} remaining</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress Card */}
                  <div className="w-64 border border-[#30363d] rounded-lg p-5 bg-[#0d1117]">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[#8b949e] text-sm font-medium">Overall Progress</span>
                      <span className="text-white text-2xl font-bold">{progressPercent}%</span>
                    </div>
                    <div className="w-full h-3 bg-[#21262d] rounded-full overflow-hidden mb-3">
                      <div 
                        className="h-full bg-gradient-to-r from-[#a371f7] to-[#58a6ff] rounded-full transition-all duration-500" 
                        style={{width: `${progressPercent}%`}}
                      ></div>
                    </div>
                    <p className="text-[#8b949e] text-xs">{completedCount} of {tutorials.length} tutorials</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Category Filters */}
            <div className="flex items-center gap-3 border-b border-[#21262d] pb-4">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-[#58a6ff] text-white'
                    : 'bg-[#21262d] text-[#8b949e] hover:bg-[#30363d] hover:text-white'
                }`}
              >
                All Tutorials
              </button>
              <button
                onClick={() => setSelectedCategory('basics')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === 'basics'
                    ? 'bg-[#3fb950] text-white'
                    : 'bg-[#21262d] text-[#8b949e] hover:bg-[#30363d] hover:text-white'
                }`}
              >
                Basics
              </button>
              <button
                onClick={() => setSelectedCategory('advanced')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === 'advanced'
                    ? 'bg-[#a371f7] text-white'
                    : 'bg-[#21262d] text-[#8b949e] hover:bg-[#30363d] hover:text-white'
                }`}
              >
                Advanced
              </button>
              <button
                onClick={() => setSelectedCategory('defi')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === 'defi'
                    ? 'bg-[#f85149] text-white'
                    : 'bg-[#21262d] text-[#8b949e] hover:bg-[#30363d] hover:text-white'
                }`}
              >
                DeFi & NFT
              </button>
            </div>

            {/* Tutorials Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredTutorials.map((tutorial) => (
                <div
                  key={tutorial.id}
                  className={`group relative overflow-hidden border rounded-lg p-5 transition-all ${
                    tutorial.locked
                      ? 'border-[#30363d] bg-[#0d1117] opacity-60 cursor-not-allowed'
                      : 'border-[#30363d] hover:border-[#58a6ff] bg-gradient-to-br from-[#161b22] to-[#0d1117] hover:shadow-lg cursor-pointer'
                  }`}
                  style={{
                    boxShadow: !tutorial.locked ? `0 0 0 0 ${tutorial.color}20` : 'none',
                  }}
                  onClick={() => !tutorial.locked && setSelectedTutorial(tutorial.id)}
                >
                  {/* Background Effect */}
                  {!tutorial.locked && (
                    <div 
                      className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{backgroundColor: `${tutorial.color}10`}}
                    ></div>
                  )}
                  
                  <div className="relative z-10">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div 
                        className="w-12 h-12 rounded-lg flex items-center justify-center transition-all"
                        style={{
                          backgroundColor: tutorial.locked ? '#21262d' : `${tutorial.color}15`,
                        }}
                      >
                        {tutorial.locked ? (
                          <span className="material-symbols-outlined text-[#8b949e] text-2xl">lock</span>
                        ) : (
                          <span 
                            className="material-symbols-outlined text-2xl"
                            style={{color: tutorial.color}}
                          >
                            {tutorial.icon}
                          </span>
                        )}
                      </div>
                      
                      {tutorial.completed && (
                        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#3fb950]/20 border border-[#3fb950]/30">
                          <span className="material-symbols-outlined text-[#3fb950] text-sm">check</span>
                          <span className="text-[#3fb950] text-xs font-semibold">Done</span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <h3 className={`text-lg font-bold mb-2 ${tutorial.locked ? 'text-[#8b949e]' : 'text-white group-hover:text-[#58a6ff]'} transition-colors`}>
                      {tutorial.title}
                    </h3>
                    <p className="text-[#8b949e] text-sm mb-4 line-clamp-2">
                      {tutorial.description}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-[#21262d]">
                      <div className="flex items-center gap-3">
                        <span 
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                            tutorial.difficulty === 'Beginner' ? 'bg-[#3fb950]/10 text-[#3fb950]' :
                            tutorial.difficulty === 'Intermediate' ? 'bg-[#58a6ff]/10 text-[#58a6ff]' :
                            'bg-[#f85149]/10 text-[#f85149]'
                          }`}
                        >
                          {tutorial.difficulty}
                        </span>
                        <span className="flex items-center gap-1 text-[#8b949e] text-xs">
                          <span className="material-symbols-outlined text-sm">schedule</span>
                          {tutorial.duration}
                        </span>
                      </div>
                    </div>

                    {/* Locked Overlay Text */}
                    {tutorial.locked && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-[#0d1117]/90 backdrop-blur-sm rounded-lg px-4 py-2 border border-[#30363d]">
                          <span className="text-[#8b949e] text-sm font-medium">Complete previous tutorials</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Learning Path Section */}
            <div className="mt-8 border border-[#30363d] rounded-xl p-6 bg-gradient-to-br from-[#161b22] to-[#0d1117]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#58a6ff]/20 to-[#58a6ff]/5 flex items-center justify-center border border-[#58a6ff]/20">
                  <span className="material-symbols-outlined text-[#58a6ff] text-xl">route</span>
                </div>
                <div>
                  <h3 className="text-white text-lg font-bold">Recommended Learning Path</h3>
                  <p className="text-[#8b949e] text-sm">Follow this path for the best learning experience</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {tutorials.slice(0, 5).map((tutorial, index) => (
                  <div key={tutorial.id} className="relative">
                    <div className={`border rounded-lg p-4 transition-all ${
                      tutorial.completed 
                        ? 'border-[#3fb950] bg-[#3fb950]/5'
                        : 'border-[#30363d] bg-[#0d1117]'
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          tutorial.completed
                            ? 'bg-[#3fb950] text-white'
                            : 'bg-[#21262d] text-[#8b949e]'
                        }`}>
                          {tutorial.completed ? (
                            <span className="material-symbols-outlined text-sm">check</span>
                          ) : (
                            index + 1
                          )}
                        </div>
                        <span className={`text-xs font-semibold ${
                          tutorial.completed ? 'text-[#3fb950]' : 'text-[#8b949e]'
                        }`}>
                          Step {index + 1}
                        </span>
                      </div>
                      <p className="text-white text-sm font-medium line-clamp-2">{tutorial.title}</p>
                    </div>
                    {index < 4 && (
                      <div className="hidden lg:block absolute top-1/2 -right-2 transform -translate-y-1/2 translate-x-full">
                        <span className="material-symbols-outlined text-[#30363d]">arrow_forward</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Resources Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">
              <a href="https://docs.arbitrum.io/stylus" target="_blank" rel="noopener noreferrer" className="group border border-[#30363d] rounded-lg p-5 bg-gradient-to-br from-[#161b22] to-[#0d1117] hover:border-[#58a6ff] transition-all hover:shadow-lg hover:shadow-[#58a6ff]/10">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#58a6ff]/10 flex items-center justify-center group-hover:bg-[#58a6ff]/20 transition-all">
                    <span className="material-symbols-outlined text-[#58a6ff]">book</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-semibold mb-1 group-hover:text-[#58a6ff] transition-colors">Documentation</h4>
                    <p className="text-[#8b949e] text-sm">Official Stylus SDK documentation and guides</p>
                  </div>
                  <span className="material-symbols-outlined text-[#8b949e] group-hover:text-[#58a6ff] transition-colors">arrow_outward</span>
                </div>
              </a>

              <Link href="/ide" className="group border border-[#30363d] rounded-lg p-5 bg-gradient-to-br from-[#161b22] to-[#0d1117] hover:border-[#3fb950] transition-all hover:shadow-lg hover:shadow-[#3fb950]/10">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#3fb950]/10 flex items-center justify-center group-hover:bg-[#3fb950]/20 transition-all">
                    <span className="material-symbols-outlined text-[#3fb950]">code</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-semibold mb-1 group-hover:text-[#3fb950] transition-colors">Practice in IDE</h4>
                    <p className="text-[#8b949e] text-sm">Write and test your own contracts</p>
                  </div>
                  <span className="material-symbols-outlined text-[#8b949e] group-hover:text-[#3fb950] transition-colors">arrow_forward</span>
                </div>
              </Link>

              <a href="https://github.com/OffchainLabs/stylus-sdk-rs" target="_blank" rel="noopener noreferrer" className="group border border-[#30363d] rounded-lg p-5 bg-gradient-to-br from-[#161b22] to-[#0d1117] hover:border-[#a371f7] transition-all hover:shadow-lg hover:shadow-[#a371f7]/10">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#a371f7]/10 flex items-center justify-center group-hover:bg-[#a371f7]/20 transition-all">
                    <span className="material-symbols-outlined text-[#a371f7]">code_blocks</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-semibold mb-1 group-hover:text-[#a371f7] transition-colors">View Examples</h4>
                    <p className="text-[#8b949e] text-sm">Browse sample contracts on GitHub</p>
                  </div>
                  <span className="material-symbols-outlined text-[#8b949e] group-hover:text-[#a371f7] transition-colors">arrow_outward</span>
                </div>
              </a>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
