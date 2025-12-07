export interface TutorialDefinition {
  id: number;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  category: 'basics' | 'advanced' | 'defi';
  icon: string;
  color: string;
  prerequisites: number[];
  badge: {
    id: string;
    name: string;
    description: string;
    icon: string;
    color: string;
  };
  sections: TutorialSection[];
  challenges: Challenge[];
  maxScore: number;
}

export interface TutorialSection {
  id: number;
  title: string;
  content: string;
  codeExample?: string;
  language?: string;
  keyPoints: string[];
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  instructions: string[];
  starterCode: string;
  solution: string;
  testCases: TestCase[];
  hints: string[];
  points: number;
}

export interface TestCase {
  id: string;
  description: string;
  input?: string;
  expectedOutput: string;
  hidden?: boolean;
}

export const tutorials: TutorialDefinition[] = [
  {
    id: 1,
    title: 'Introduction to Stylus',
    description: 'Learn the basics of Arbitrum Stylus and write your first smart contract',
    difficulty: 'Beginner',
    duration: '30 min',
    category: 'basics',
    icon: 'rocket',
    color: '#58a6ff',
    prerequisites: [],
    badge: {
      id: 'stylus_beginner',
      name: 'Stylus Beginner',
      description: 'Completed the Introduction to Stylus tutorial',
      icon: 'rocket',
      color: '#58a6ff'
    },
    sections: [
      {
        id: 1,
        title: 'What is Stylus?',
        content: `Stylus is Arbitrum's revolutionary programming environment that brings the power of Rust, C, and C++ to blockchain development.

**Why Stylus Matters:**
Unlike traditional EVM contracts written in Solidity, Stylus contracts are compiled to WebAssembly (WASM), offering unprecedented performance and flexibility.`,
        keyPoints: [
          '10-100x lower gas costs for compute-intensive operations',
          'Memory-safe execution with Rust\'s ownership system',
          'Access to existing Rust libraries and tooling',
          'Full EVM compatibility - can call and be called by Solidity contracts',
          'Opens blockchain development to millions of Rust developers'
        ]
      },
      {
        id: 2,
        title: 'Your First Contract',
        content: `Let's create a simple counter contract to understand the basics of Stylus development.

This contract will demonstrate:
- State storage
- Read and write operations
- Public functions
- The \`#[entrypoint]\` macro`,
        codeExample: `use stylus_sdk::{prelude::*, storage::StorageU256};

#[storage]
#[entrypoint]
pub struct Counter {
    count: StorageU256,
}

#[public]
impl Counter {
    pub fn get(&self) -> U256 {
        self.count.get()
    }

    pub fn increment(&mut self) {
        let current = self.count.get();
        self.count.set(current + U256::from(1));
    }
}`,
        language: 'rust',
        keyPoints: [
          'The #[storage] macro marks the main contract struct',
          'The #[entrypoint] macro designates the contract entry point',
          'StorageU256 provides gas-efficient storage for 256-bit integers',
          'Public functions are marked with #[public]',
          'Mutable methods can modify contract state'
        ]
      },
      {
        id: 3,
        title: 'Understanding Storage',
        content: `Stylus provides efficient storage types that map directly to EVM storage slots.

**Common Storage Types:**
- \`StorageU256\`: 256-bit unsigned integers
- \`StorageBool\`: Boolean values
- \`StorageAddress\`: Ethereum addresses
- \`StorageMap\`: Key-value mappings
- \`StorageVec\`: Dynamic arrays`,
        codeExample: `use stylus_sdk::{prelude::*, storage::{StorageU256, StorageBool, StorageAddress}};

#[storage]
pub struct MyContract {
    owner: StorageAddress,
    paused: StorageBool,
    balance: StorageU256,
}`,
        language: 'rust',
        keyPoints: [
          'Storage types are gas-optimized for blockchain use',
          'Use .get() to read and .set() to write values',
          'Storage is persistent across transactions',
          'Each storage slot costs gas to read and write'
        ]
      }
    ],
    challenges: [
      {
        id: 'counter_challenge',
        title: 'Build a Counter Contract',
        description: 'Create a counter contract with increment and decrement functions',
        instructions: [
          'Define a Counter struct with a count field',
          'Implement a get() function that returns the current count',
          'Implement an increment() function that increases count by 1',
          'Implement a decrement() function that decreases count by 1',
          'Make sure decrement doesn\'t go below zero'
        ],
        starterCode: `use stylus_sdk::{prelude::*, storage::StorageU256, alloy_primitives::U256};

#[storage]
#[entrypoint]
pub struct Counter {
    // TODO: Add count field
}

#[public]
impl Counter {
    // TODO: Implement get() function
    
    // TODO: Implement increment() function
    
    // TODO: Implement decrement() function
}`,
        solution: `use stylus_sdk::{prelude::*, storage::StorageU256, alloy_primitives::U256};

#[storage]
#[entrypoint]
pub struct Counter {
    count: StorageU256,
}

#[public]
impl Counter {
    pub fn get(&self) -> U256 {
        self.count.get()
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
}`,
        testCases: [
          {
            id: 'test_1',
            description: 'Contract contains count field',
            expectedOutput: 'StorageU256 field named count'
          },
          {
            id: 'test_2',
            description: 'get() function returns current count',
            expectedOutput: 'Function signature: pub fn get(&self) -> U256'
          },
          {
            id: 'test_3',
            description: 'increment() function increases count',
            expectedOutput: 'Function increments count by 1'
          },
          {
            id: 'test_4',
            description: 'decrement() function decreases count safely',
            expectedOutput: 'Function decrements but prevents underflow'
          }
        ],
        hints: [
          'Use StorageU256 for the count field',
          'Remember to check for zero before decrementing',
          'Use U256::from(1) to create a value of 1',
          'Mutable functions need &mut self parameter'
        ],
        points: 100
      }
    ],
    maxScore: 100
  },
  {
    id: 2,
    title: 'Working with Events',
    description: 'Learn how to emit and handle events in Stylus contracts',
    difficulty: 'Beginner',
    duration: '25 min',
    category: 'basics',
    icon: 'zap',
    color: '#f85149',
    prerequisites: [1],
    badge: {
      id: 'event_master',
      name: 'Event Master',
      description: 'Mastered Stylus events and logging',
      icon: 'zap',
      color: '#f85149'
    },
    sections: [
      {
        id: 1,
        title: 'Why Events Matter',
        content: `Events are crucial for smart contracts, providing a way to log important state changes and actions.

**Benefits of Events:**
Events enable off-chain monitoring, are cheaper than storage, and are essential for frontend integration and user notifications.`,
        keyPoints: [
          'Events create permanent logs on the blockchain',
          'Much cheaper than storing data in contract state',
          'Enable real-time monitoring and indexing',
          'Critical for building responsive user interfaces',
          'Indexed parameters make events searchable'
        ]
      },
      {
        id: 2,
        title: 'Defining Events',
        content: `In Stylus, events are defined using the sol! macro and emitted with evm::log.`,
        codeExample: `use stylus_sdk::{prelude::*, alloy_primitives::{Address, U256}, evm};

sol! {
    event Transfer(
        address indexed from,
        address indexed to,
        uint256 value
    );
    
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );
}

#[public]
impl Token {
    pub fn transfer(&mut self, to: Address, amount: U256) {
        // ... transfer logic ...
        
        evm::log(Transfer {
            from: msg::sender(),
            to,
            value: amount
        });
    }
}`,
        language: 'rust',
        keyPoints: [
          'Use sol! macro to define events',
          'Mark up to 3 parameters as indexed for searchability',
          'Emit events with evm::log()',
          'Always emit events after state changes',
          'Follow standard event naming conventions'
        ]
      }
    ],
    challenges: [
      {
        id: 'events_challenge',
        title: 'Create an Event-Driven Contract',
        description: 'Build a contract that properly emits events for all state changes',
        instructions: [
          'Define a ValueChanged event with oldValue and newValue parameters',
          'Create a setValue function that updates a stored value',
          'Emit the ValueChanged event whenever the value changes',
          'Make the newValue parameter indexed for searchability'
        ],
        starterCode: `use stylus_sdk::{prelude::*, storage::StorageU256, alloy_primitives::U256, evm};

sol! {
    // TODO: Define ValueChanged event
}

#[storage]
#[entrypoint]
pub struct EventContract {
    value: StorageU256,
}

#[public]
impl EventContract {
    pub fn get_value(&self) -> U256 {
        self.value.get()
    }
    
    // TODO: Implement setValue with event emission
}`,
        solution: `use stylus_sdk::{prelude::*, storage::StorageU256, alloy_primitives::U256, evm};

sol! {
    event ValueChanged(uint256 oldValue, uint256 indexed newValue);
}

#[storage]
#[entrypoint]
pub struct EventContract {
    value: StorageU256,
}

#[public]
impl EventContract {
    pub fn get_value(&self) -> U256 {
        self.value.get()
    }
    
    pub fn set_value(&mut self, new_value: U256) {
        let old_value = self.value.get();
        self.value.set(new_value);
        
        evm::log(ValueChanged {
            oldValue: old_value,
            newValue: new_value
        });
    }
}`,
        testCases: [
          {
            id: 'test_1',
            description: 'ValueChanged event is defined',
            expectedOutput: 'Event with oldValue and newValue parameters'
          },
          {
            id: 'test_2',
            description: 'newValue is indexed',
            expectedOutput: 'indexed keyword on newValue parameter'
          },
          {
            id: 'test_3',
            description: 'setValue emits event',
            expectedOutput: 'evm::log() called in setValue'
          }
        ],
        hints: [
          'Use sol! macro to define events',
          'Add indexed keyword before parameter type',
          'Call evm::log() after updating state',
          'Pass event data as a struct'
        ],
        points: 100
      }
    ],
    maxScore: 100
  },
  {
    id: 3,
    title: 'Error Handling & Security',
    description: 'Master error handling and security best practices in Stylus',
    difficulty: 'Intermediate',
    duration: '45 min',
    category: 'advanced',
    icon: 'target',
    color: '#a371f7',
    prerequisites: [1, 2],
    badge: {
      id: 'security_expert',
      name: 'Security Expert',
      description: 'Mastered secure contract development',
      icon: 'target',
      color: '#a371f7'
    },
    sections: [
      {
        id: 1,
        title: 'Custom Errors',
        content: `Proper error handling is crucial for secure and user-friendly contracts.

In Stylus, you can define custom errors using enums and the sol_interface! macro.`,
        codeExample: `use stylus_sdk::{prelude::*, alloy_primitives::Address};

sol_storage! {
    pub enum Error {
        Unauthorized(Address),
        InsufficientBalance(U256, U256), // (required, available)
        InvalidAddress,
    }
}

#[public]
impl Token {
    pub fn transfer(&mut self, to: Address, amount: U256) -> Result<(), Error> {
        if to == Address::ZERO {
            return Err(Error::InvalidAddress);
        }
        
        let balance = self.balances.get(msg::sender());
        if balance < amount {
            return Err(Error::InsufficientBalance(amount, balance));
        }
        
        // ... proceed with transfer ...
        Ok(())
    }
}`,
        language: 'rust',
        keyPoints: [
          'Use Result<T, E> for functions that can fail',
          'Define custom error enums for clear error messages',
          'Provide context in error variants',
          'Check conditions before modifying state',
          'Return early on error conditions'
        ]
      },
      {
        id: 2,
        title: 'Access Control',
        content: `Implementing proper access control is essential for contract security.`,
        codeExample: `use stylus_sdk::{prelude::*, storage::StorageAddress, alloy_primitives::Address, msg};

#[storage]
pub struct Ownable {
    owner: StorageAddress,
}

#[public]
impl Ownable {
    pub fn only_owner(&self) -> Result<(), Error> {
        if msg::sender() != self.owner.get() {
            return Err(Error::Unauthorized(msg::sender()));
        }
        Ok(())
    }
    
    pub fn admin_function(&mut self) -> Result<(), Error> {
        self.only_owner()?;
        // ... admin logic ...
        Ok(())
    }
}`,
        language: 'rust',
        keyPoints: [
          'Store owner address in contract state',
          'Create modifier-like functions for access checks',
          'Use ? operator to propagate errors',
          'Verify sender before critical operations',
          'Consider multi-signature for high-value operations'
        ]
      }
    ],
    challenges: [
      {
        id: 'security_challenge',
        title: 'Build a Secure Vault',
        description: 'Create a secure vault contract with proper access control and error handling',
        instructions: [
          'Define custom errors: Unauthorized, InsufficientFunds, InvalidAmount',
          'Store owner address and balance',
          'Implement owner-only deposit function',
          'Implement owner-only withdraw function with balance checks',
          'Prevent withdrawing more than available balance'
        ],
        starterCode: `use stylus_sdk::{prelude::*, storage::{StorageAddress, StorageU256}, alloy_primitives::{Address, U256}, msg};

sol_storage! {
    pub enum Error {
        // TODO: Define custom errors
    }
}

#[storage]
#[entrypoint]
pub struct Vault {
    // TODO: Add owner and balance fields
}

#[public]
impl Vault {
    // TODO: Implement functions with proper security
}`,
        solution: `use stylus_sdk::{prelude::*, storage::{StorageAddress, StorageU256}, alloy_primitives::{Address, U256}, msg};

sol_storage! {
    pub enum Error {
        Unauthorized(Address),
        InsufficientFunds(U256, U256),
        InvalidAmount,
    }
}

#[storage]
#[entrypoint]
pub struct Vault {
    owner: StorageAddress,
    balance: StorageU256,
}

#[public]
impl Vault {
    fn only_owner(&self) -> Result<(), Error> {
        if msg::sender() != self.owner.get() {
            return Err(Error::Unauthorized(msg::sender()));
        }
        Ok(())
    }
    
    pub fn deposit(&mut self, amount: U256) -> Result<(), Error> {
        self.only_owner()?;
        
        if amount == U256::ZERO {
            return Err(Error::InvalidAmount);
        }
        
        let current = self.balance.get();
        self.balance.set(current + amount);
        Ok(())
    }
    
    pub fn withdraw(&mut self, amount: U256) -> Result<(), Error> {
        self.only_owner()?;
        
        let current = self.balance.get();
        if amount > current {
            return Err(Error::InsufficientFunds(amount, current));
        }
        
        self.balance.set(current - amount);
        Ok(())
    }
    
    pub fn get_balance(&self) -> U256 {
        self.balance.get()
    }
}`,
        testCases: [
          {
            id: 'test_1',
            description: 'Custom errors are defined',
            expectedOutput: 'Error enum with Unauthorized, InsufficientFunds, InvalidAmount'
          },
          {
            id: 'test_2',
            description: 'Owner-only access control',
            expectedOutput: 'only_owner() check in deposit and withdraw'
          },
          {
            id: 'test_3',
            description: 'Balance validation',
            expectedOutput: 'Check balance before withdrawal'
          },
          {
            id: 'test_4',
            description: 'Zero amount validation',
            expectedOutput: 'Reject zero amounts'
          }
        ],
        hints: [
          'Use msg::sender() to get the caller address',
          'Compare addresses with != operator',
          'Check balance before subtraction to prevent underflow',
          'Use ? operator to propagate errors'
        ],
        points: 150
      }
    ],
    maxScore: 150
  }
];

// Helper function to get tutorial by ID
export function getTutorialById(id: number): TutorialDefinition | undefined {
  return tutorials.find(t => t.id === id);
}

// Helper function to check if tutorial is unlocked
export function isTutorialUnlocked(tutorialId: number, completedTutorials: number[]): boolean {
  const tutorial = getTutorialById(tutorialId);
  if (!tutorial) return false;
  
  return tutorial.prerequisites.every(prereq => completedTutorials.includes(prereq));
}
