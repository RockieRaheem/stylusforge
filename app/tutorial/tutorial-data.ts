// Complete tutorial content for tutorials 4-10
export interface LessonSection {
  id: number;
  title: string;
  content: string;
  codeExample?: string;
  language?: string;
  tip?: string;
}

export interface Assignment {
  id: number;
  title: string;
  description: string;
  starterCode: string;
  solution: string;
  hints?: string[];
  testCases?: {input: string; expectedOutput: string}[];
}

export const tutorial4Content = {
  sections: [
    {
      id: 1,
      title: "Understanding Events",
      content: `Events are fundamental to smart contract development, providing a way to log important state changes and actions on the blockchain.

**Why Events Matter:**
- Enable off-chain monitoring and indexing
- Cheaper than storing data in contract storage
- Critical for frontend integration and user notifications
- Provide audit trails for contract activity

In Stylus, events are declared using the \`sol_storage!\` and \`evm::log\` macros.`,
      codeExample: `use stylus_sdk::{prelude::*, alloy_primitives::{Address, U256}, evm};

// Define events using sol! macro
sol! {
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Deposit(address indexed user, uint256 amount, uint256 timestamp);
    event StateChanged(uint256 oldValue, uint256 newValue);
}

sol_storage! {
    #[entrypoint]
    pub struct EventLogger {
        counter: StorageU256,
    }
}

#[external]
impl EventLogger {
    pub fn emit_transfer(&self, from: Address, to: Address, value: U256) {
        // Emit a transfer event
        evm::log(Transfer {
            from,
            to,
            value,
        });
    }
    
    pub fn emit_deposit(&self, user: Address, amount: U256) {
        evm::log(Deposit {
            user,
            amount,
            timestamp: U256::from(block::timestamp()),
        });
    }
}`,
      language: 'rust',
      tip: 'Use indexed parameters (max 3) to make events searchable!'
    },
    {
      id: 2,
      title: "Event Best Practices",
      content: `Following best practices for events ensures your contracts are observable and debuggable.

**Best Practices:**
1. **Name events clearly** - Use descriptive names like \`TokensMinted\` not \`Event1\`
2. **Index searchable fields** - User addresses, token IDs, transaction types
3. **Include timestamps** - Always log when something happened
4. **Don't over-emit** - Events cost gas, emit only what's necessary
5. **Follow standards** - Use ERC-20/721 event patterns when applicable`,
      codeExample: `use stylus_sdk::{prelude::*, alloy_primitives::{Address, U256}, evm, block};

sol! {
    // Good: Descriptive, indexed key fields
    event OrderCreated(
        uint256 indexed orderId,
        address indexed creator,
        uint256 amount,
        uint256 timestamp
    );
    
    // Good: Status changes are logged
    event OrderStatusChanged(
        uint256 indexed orderId,
        uint8 oldStatus,
        uint8 newStatus,
        uint256 timestamp
    );
}

sol_storage! {
    pub struct OrderBook {
        next_order_id: StorageU256,
    }
}

#[external]
impl OrderBook {
    pub fn create_order(&mut self, amount: U256) -> U256 {
        let order_id = self.next_order_id.get();
        self.next_order_id.set(order_id + U256::from(1));
        
        // Emit comprehensive event
        evm::log(OrderCreated {
            orderId: order_id,
            creator: msg::sender(),
            amount,
            timestamp: U256::from(block::timestamp()),
        });
        
        order_id
    }
}`,
      language: 'rust',
      tip: 'Always emit events before external calls to prevent reentrancy confusion!'
    },
    {
      id: 3,
      title: "Event Indexing & Querying",
      content: `Understanding how events are indexed helps you design better contract interfaces.

**Indexed vs Non-Indexed:**
- **Indexed** (max 3 per event): Stored in log topics, searchable/filterable
- **Non-indexed**: Stored in log data, cheaper but not searchable

**Common Patterns:**
- Index addresses for user-specific queries
- Index IDs for entity lookups
- Index enum values for filtering by type
- Keep amounts and strings non-indexed (cheaper)`,
      codeExample: `use stylus_sdk::{prelude::*, alloy_primitives::{Address, U256}, evm};

sol! {
    // Indexed: user, token, action type
    // Non-indexed: amounts, metadata
    event TokenAction(
        address indexed user,
        address indexed token,
        uint8 indexed actionType,  // 0=buy, 1=sell, 2=transfer
        uint256 amount,
        uint256 price,
        string metadata
    );
}

sol_storage! {
    pub struct TokenRegistry {
        paused: StorageBool,
    }
}

#[external]
impl TokenRegistry {
    pub fn record_action(
        &self,
        token: Address,
        action_type: u8,
        amount: U256,
        price: U256
    ) {
        evm::log(TokenAction {
            user: msg::sender(),
            token,
            actionType: action_type,
            amount,
            price,
            metadata: "Trade executed".to_string(),
        });
    }
}`,
      language: 'rust',
      tip: 'Use bytes32 for indexed string identifiers for efficient filtering!'
    },
    {
      id: 4,
      title: "Error Events & Debugging",
      content: `Events are crucial for debugging and error tracking in production contracts.

**Debugging Strategies:**
1. Emit events at key checkpoints
2. Log function parameters for failed transactions
3. Track state changes before and after operations
4. Use events to trace complex transaction flows`,
      codeExample: `use stylus_sdk::{prelude::*, alloy_primitives::{Address, U256}, evm, msg, block};

sol! {
    event DebugCheckpoint(string location, uint256 value);
    event ErrorOccurred(string errorType, string message, address user);
    event StateSnapshot(uint256 balance, uint256 totalSupply, uint256 timestamp);
}

sol_storage! {
    pub struct DebuggableContract {
        balance: StorageU256,
        total_supply: StorageU256,
    }
}

#[external]
impl DebuggableContract {
    pub fn complex_operation(&mut self, amount: U256) -> Result<(), Vec<u8>> {
        // Checkpoint 1: Entry
        evm::log(DebugCheckpoint {
            location: "complex_operation:start".to_string(),
            value: amount,
        });
        
        // Validate input
        if amount == U256::ZERO {
            evm::log(ErrorOccurred {
                errorType: "ValidationError".to_string(),
                message: "Amount cannot be zero".to_string(),
                user: msg::sender(),
            });
            return Err("Amount cannot be zero".into());
        }
        
        // Perform operation
        let old_balance = self.balance.get();
        self.balance.set(old_balance + amount);
        
        // Checkpoint 3: Complete
        evm::log(DebugCheckpoint {
            location: "complex_operation:complete".to_string(),
            value: self.balance.get(),
        });
        
        Ok(())
    }
}`,
      language: 'rust',
      tip: 'Remove debug events in production to save gas!'
    }
  ],
  assignment: {
    id: 4,
    title: 'Build an Event-Driven Escrow Contract',
    description: 'Create an escrow contract that emits detailed events for deposits, releases, refunds, and disputes. Include indexed fields for easy querying.',
    starterCode: `use stylus_sdk::{prelude::*, alloy_primitives::{Address, U256}, evm, msg, block};

sol! {
    // TODO: Define EscrowCreated event (indexed: escrowId, buyer, seller)
    // TODO: Define FundsDeposited event
    // TODO: Define FundsReleased event
    // TODO: Define RefundIssued event
    // TODO: Define DisputeRaised event
}

sol_storage! {
    pub struct Escrow {
        // TODO: Add storage
    }
}

#[external]
impl Escrow {
    // TODO: Implement functions with events
}`,
    solution: `use stylus_sdk::{prelude::*, alloy_primitives::{Address, U256}, evm, msg, block};

sol! {
    event EscrowCreated(
        uint256 indexed escrowId,
        address indexed buyer,
        address indexed seller,
        uint256 amount,
        uint256 timestamp
    );
    event FundsDeposited(uint256 indexed escrowId, uint256 amount, uint256 timestamp);
    event FundsReleased(uint256 indexed escrowId, address to, uint256 amount);
    event RefundIssued(uint256 indexed escrowId, address to, uint256 amount);
    event DisputeRaised(uint256 indexed escrowId, address by, string reason);
}

sol_storage! {
    pub struct Escrow {
        next_escrow_id: StorageU256,
    }
}

#[external]
impl Escrow {
    pub fn create_escrow(&mut self, seller: Address, amount: U256) -> U256 {
        let escrow_id = self.next_escrow_id.get();
        self.next_escrow_id.set(escrow_id + U256::from(1));
        
        evm::log(EscrowCreated {
            escrowId: escrow_id,
            buyer: msg::sender(),
            seller,
            amount,
            timestamp: U256::from(block::timestamp()),
        });
        
        escrow_id
    }
    
    pub fn deposit(&self, escrow_id: U256, amount: U256) {
        evm::log(FundsDeposited {
            escrowId: escrow_id,
            amount,
            timestamp: U256::from(block::timestamp()),
        });
    }
    
    pub fn release(&self, escrow_id: U256, to: Address, amount: U256) {
        evm::log(FundsReleased { escrowId: escrow_id, to, amount });
    }
    
    pub fn refund(&self, escrow_id: U256, to: Address, amount: U256) {
        evm::log(RefundIssued { escrowId: escrow_id, to, amount });
    }
    
    pub fn raise_dispute(&self, escrow_id: U256, reason: String) {
        evm::log(DisputeRaised {
            escrowId: escrow_id,
            by: msg::sender(),
            reason,
        });
    }
}`,
    testCases: [
      { input: 'create_escrow(seller, 1000)', expectedOutput: 'Event: EscrowCreated with buyer=msg.sender' },
      { input: 'deposit(0, 1000)', expectedOutput: 'Event: FundsDeposited emitted' },
      { input: 'raise_dispute(0, "Issue")', expectedOutput: 'Event: DisputeRaised with reason' }
    ]
  }
};

export const tutorial5Content = {
  sections: [
    {
      id: 1,
      title: "Result Types & Error Propagation",
      content: `Stylus uses Rust's powerful Result type for error handling, providing type-safe error management.

**Result<T, E> Basics:**
- \`Ok(value)\` - Success case with value
- \`Err(error)\` - Error case with error details
- Use \`?\` operator to propagate errors
- Pattern match for custom error handling

**Why Result Types:**
- Compile-time error checking
- Explicit error handling required
- No silent failures
- Clear error propagation paths`,
      codeExample: `use stylus_sdk::{prelude::*, alloy_primitives::U256};

sol_storage! {
    pub struct SafeVault {
        balance: StorageU256,
        min_deposit: StorageU256,
    }
}

#[external]
impl SafeVault {
    // Returns Result - caller must handle errors
    pub fn deposit(&mut self, amount: U256) -> Result<U256, Vec<u8>> {
        // Validate input
        if amount == U256::ZERO {
            return Err("Amount must be greater than zero".into());
        }
        
        if amount < self.min_deposit.get() {
            return Err("Amount below minimum deposit".into());
        }
        
        // Update state
        let new_balance = self.balance.get() + amount;
        self.balance.set(new_balance);
        
        // Return success with new balance
        Ok(new_balance)
    }
    
    pub fn withdraw(&mut self, amount: U256) -> Result<U256, Vec<u8>> {
        let balance = self.balance.get();
        
        // Check sufficient balance
        if amount > balance {
            return Err("Insufficient balance".into());
        }
        
        // Update state
        let new_balance = balance - amount;
        self.balance.set(new_balance);
        
        Ok(new_balance)
    }
    
    // Error propagation with ? operator
    pub fn transfer(&mut self, amount: U256) -> Result<(), Vec<u8>> {
        self.withdraw(amount)?;  // Propagates error if withdrawal fails
        Ok(())
    }
}`,
      language: 'rust',
      tip: 'Always use descriptive error messages - they help users understand what went wrong!'
    },
    {
      id: 2,
      title: "Custom Error Types",
      content: `Define custom error enums for more structured and informative error handling.

**Benefits of Custom Errors:**
- Type-safe error variants
- Attach error-specific data
- Better error categorization
- Improved debugging and logging`,
      codeExample: `use stylus_sdk::{prelude::*, alloy_primitives::{Address, U256}};

// Define custom error enum
#[derive(Debug)]
pub enum VaultError {
    InsufficientBalance { requested: U256, available: U256 },
    Unauthorized { caller: Address, required: Address },
    AmountTooSmall { amount: U256, minimum: U256 },
    VaultLocked,
    InvalidAddress,
}

impl From<VaultError> for Vec<u8> {
    fn from(err: VaultError) -> Vec<u8> {
        match err {
            VaultError::InsufficientBalance { requested, available } => {
                format!("Insufficient balance: requested {}, available {}", requested, available).into()
            }
            VaultError::Unauthorized { caller, required } => {
                format!("Unauthorized: caller {}, required {}", caller, required).into()
            }
            VaultError::AmountTooSmall { amount, minimum } => {
                format!("Amount {} below minimum {}", amount, minimum).into()
            }
            VaultError::VaultLocked => "Vault is locked".into(),
            VaultError::InvalidAddress => "Invalid address provided".into(),
        }
    }
}

sol_storage! {
    pub struct AdvancedVault {
        balance: StorageU256,
        owner: StorageAddress,
        locked: StorageBool,
    }
}

#[external]
impl AdvancedVault {
    pub fn withdraw(&mut self, amount: U256) -> Result<(), Vec<u8>> {
        // Check vault is not locked
        if self.locked.get() {
            return Err(VaultError::VaultLocked.into());
        }
        
        // Check authorization
        if msg::sender() != self.owner.get() {
            return Err(VaultError::Unauthorized {
                caller: msg::sender(),
                required: self.owner.get(),
            }.into());
        }
        
        // Check balance
        let balance = self.balance.get();
        if amount > balance {
            return Err(VaultError::InsufficientBalance {
                requested: amount,
                available: balance,
            }.into());
        }
        
        // Execute withdrawal
        self.balance.set(balance - amount);
        Ok(())
    }
}`,
      language: 'rust',
      tip: 'Include relevant data in error variants to help users diagnose issues!'
    },
    {
      id: 3,
      title: "Input Validation Patterns",
      content: `Always validate inputs at function boundaries to prevent invalid state and attacks.

**Validation Checklist:**
- Check for zero addresses
- Validate amount ranges
- Verify permissions/ownership
- Check contract state
- Validate array lengths
- Prevent overflow/underflow`,
      codeExample: `use stylus_sdk::{prelude::*, alloy_primitives::{Address, U256}};

sol_storage! {
    pub struct ValidatedContract {
        owner: StorageAddress,
        min_amount: StorageU256,
        max_amount: StorageU256,
    }
}

#[external]
impl ValidatedContract {
    // Helper: Validate address is not zero
    fn validate_address(&self, addr: Address) -> Result<(), Vec<u8>> {
        if addr == Address::ZERO {
            return Err("Invalid zero address".into());
        }
        Ok(())
    }
    
    // Helper: Validate amount in range
    fn validate_amount(&self, amount: U256) -> Result<(), Vec<u8>> {
        let min = self.min_amount.get();
        let max = self.max_amount.get();
        
        if amount < min {
            return Err(format!("Amount {} below minimum {}", amount, min).into());
        }
        
        if amount > max {
            return Err(format!("Amount {} exceeds maximum {}", amount, max).into());
        }
        
        Ok(())
    }
    
    // Helper: Validate caller is owner
    fn validate_owner(&self) -> Result<(), Vec<u8>> {
        if msg::sender() != self.owner.get() {
            return Err("Only owner can call this function".into());
        }
        Ok(())
    }
    
    // Use validators in functions
    pub fn transfer(&mut self, to: Address, amount: U256) -> Result<(), Vec<u8>> {
        // Validate all inputs
        self.validate_owner()?;
        self.validate_address(to)?;
        self.validate_amount(amount)?;
        
        // Validation passed - execute transfer
        Ok(())
    }
    
    pub fn batch_transfer(
        &mut self,
        recipients: Vec<Address>,
        amounts: Vec<U256>
    ) -> Result<(), Vec<u8>> {
        // Validate array lengths match
        if recipients.len() != amounts.len() {
            return Err("Recipients and amounts length mismatch".into());
        }
        
        // Validate array not empty
        if recipients.is_empty() {
            return Err("Cannot process empty batch".into());
        }
        
        // Validate each recipient and amount
        for (recipient, amount) in recipients.iter().zip(amounts.iter()) {
            self.validate_address(*recipient)?;
            self.validate_amount(*amount)?;
        }
        
        Ok(())
    }
}`,
      language: 'rust',
      tip: 'Fail fast - validate all inputs before making any state changes!'
    },
    {
      id: 4,
      title: "Safe Math & Overflow Protection",
      content: `Protect against arithmetic overflow and underflow with Rust's checked operations.

**Arithmetic Safety:**
- \`checked_add/sub/mul/div\` - Returns Option, None on overflow
- \`saturating_add/sub\` - Clamps at min/max values
- \`wrapping_add/sub\` - Wraps around on overflow

Always use checked operations for user-controlled values.`,
      codeExample: `use stylus_sdk::{prelude::*, alloy_primitives::U256};

sol_storage! {
    pub struct SafeMath {
        balance: StorageU256,
    }
}

#[external]
impl SafeMath {
    // Safe addition with overflow check
    pub fn safe_add(&mut self, amount: U256) -> Result<U256, Vec<u8>> {
        let current = self.balance.get();
        
        // Use checked_add to prevent overflow
        match current.checked_add(amount) {
            Some(new_balance) => {
                self.balance.set(new_balance);
                Ok(new_balance)
            }
            None => Err("Arithmetic overflow".into())
        }
    }
    
    // Safe subtraction with underflow check
    pub fn safe_sub(&mut self, amount: U256) -> Result<U256, Vec<u8>> {
        let current = self.balance.get();
        
        match current.checked_sub(amount) {
            Some(new_balance) => {
                self.balance.set(new_balance);
                Ok(new_balance)
            }
            None => Err("Arithmetic underflow".into())
        }
    }
    
    // Safe multiplication
    pub fn safe_mul(&self, a: U256, b: U256) -> Result<U256, Vec<u8>> {
        match a.checked_mul(b) {
            Some(result) => Ok(result),
            None => Err("Multiplication overflow".into())
        }
    }
    
    // Safe division with zero check
    pub fn safe_div(&self, a: U256, b: U256) -> Result<U256, Vec<u8>> {
        if b == U256::ZERO {
            return Err("Division by zero".into());
        }
        
        match a.checked_div(b) {
            Some(result) => Ok(result),
            None => Err("Division error".into())
        }
    }
    
    // Percentage calculation
    pub fn calculate_fee(&self, amount: U256, fee_percent: u32) -> Result<U256, Vec<u8>> {
        let fee_multiplied = amount
            .checked_mul(U256::from(fee_percent))
            .ok_or("Fee calculation overflow")?;
            
        let fee = fee_multiplied
            .checked_div(U256::from(100))
            .ok_or("Fee calculation error")?;
            
        Ok(fee)
    }
}`,
      language: 'rust',
      tip: 'U256 operations can overflow too! Always use checked operations.'
    }
  ],
  assignment: {
    id: 5,
    title: 'Build a Safe Token Contract',
    description: 'Create a token contract with comprehensive error handling, input validation, and safe math operations.',
    starterCode: `use stylus_sdk::{prelude::*, alloy_primitives::{Address, U256}};

// TODO: Define custom error enum

sol_storage! {
    pub struct SafeToken {
        // TODO: Add storage
    }
}

#[external]
impl SafeToken {
    // TODO: Implement with validation and error handling
}`,
    solution: `use stylus_sdk::{prelude::*, alloy_primitives::{Address, U256}};

#[derive(Debug)]
pub enum TokenError {
    InsufficientBalance { requested: U256, available: U256 },
    InvalidAddress,
    InvalidAmount,
    Unauthorized,
}

impl From<TokenError> for Vec<u8> {
    fn from(err: TokenError) -> Vec<u8> {
        match err {
            TokenError::InsufficientBalance { requested, available } =>
                format!("Insufficient: need {}, have {}", requested, available).into(),
            TokenError::InvalidAddress => "Invalid address".into(),
            TokenError::InvalidAmount => "Invalid amount".into(),
            TokenError::Unauthorized => "Unauthorized".into(),
        }
    }
}

sol_storage! {
    pub struct SafeToken {
        total_supply: StorageU256,
        owner: StorageAddress,
    }
}

#[external]
impl SafeToken {
    fn validate_address(&self, addr: Address) -> Result<(), Vec<u8>> {
        if addr == Address::ZERO {
            return Err(TokenError::InvalidAddress.into());
        }
        Ok(())
    }
    
    fn validate_amount(&self, amount: U256) -> Result<(), Vec<u8>> {
        if amount == U256::ZERO {
            return Err(TokenError::InvalidAmount.into());
        }
        Ok(())
    }
    
    pub fn initialize(&mut self, initial_supply: U256) -> Result<(), Vec<u8>> {
        self.validate_amount(initial_supply)?;
        self.total_supply.set(initial_supply);
        self.owner.set(msg::sender());
        Ok(())
    }
    
    pub fn transfer(&mut self, to: Address, amount: U256) -> Result<(), Vec<u8>> {
        self.validate_address(to)?;
        self.validate_amount(amount)?;
        Ok(())
    }
}`,
    testCases: [
      { input: 'transfer(ZERO_ADDRESS, 100)', expectedOutput: 'Error: InvalidAddress' },
      { input: 'transfer(addr, 0)', expectedOutput: 'Error: InvalidAmount' }
    ]
  }
};

export const tutorial6Content = {
  sections: [
    {
      id: 1,
      title: "Unit Testing Basics",
      content: `Testing is crucial for smart contract security. Stylus contracts can be tested using Rust's built-in testing framework.

**Test Structure:**
- Unit tests for individual functions
- Integration tests for contract interactions
- Edge case testing for boundary conditions
- Gas usage verification`,
      codeExample: `#[cfg(test)]
mod tests {
    use super::*;
    use stylus_sdk::alloy_primitives::U256;
    
    #[test]
    fn test_deposit() {
        let mut contract = MyContract::default();
        contract.initialize();
        
        let result = contract.deposit(U256::from(100));
        assert!(result.is_ok());
        assert_eq!(contract.balance.get(), U256::from(100));
    }
    
    #[test]
    fn test_deposit_zero_fails() {
        let mut contract = MyContract::default();
        contract.initialize();
        
        let result = contract.deposit(U256::ZERO);
        assert!(result.is_err());
    }
    
    #[test]
    fn test_withdraw_insufficient_balance() {
        let mut contract = MyContract::default();
        contract.initialize();
        contract.deposit(U256::from(50)).unwrap();
        
        let result = contract.withdraw(U256::from(100));
        assert!(result.is_err());
    }
}`,
      language: 'rust',
      tip: 'Run tests with: cargo test'
    },
    {
      id: 2,
      title: "Integration Testing",
      content: `Integration tests verify that contract functions work together correctly.

**Testing Patterns:**
- Setup common test state
- Test complex workflows
- Verify state consistency
- Test error conditions`,
      codeExample: `#[cfg(test)]
mod integration_tests {
    use super::*;
    
    fn setup_contract() -> MyContract {
        let mut contract = MyContract::default();
        contract.initialize();
        contract
    }
    
    #[test]
    fn test_full_workflow() {
        let mut contract = setup_contract();
        
        // Step 1: Deposit
        contract.deposit(U256::from(1000)).unwrap();
        assert_eq!(contract.balance.get(), U256::from(1000));
        
        // Step 2: Withdraw partial
        contract.withdraw(U256::from(400)).unwrap();
        assert_eq!(contract.balance.get(), U256::from(600));
        
        // Step 3: Deposit more
        contract.deposit(U256::from(500)).unwrap();
        assert_eq!(contract.balance.get(), U256::from(1100));
    }
    
    #[test]
    fn test_authorization_workflow() {
        let mut contract = setup_contract();
        
        // Only owner should be able to perform certain operations
        // Test would include mocking msg::sender()
    }
}`,
      language: 'rust',
      tip: 'Use helper functions to reduce test boilerplate!'
    },
    {
      id: 3,
      title: "Property-Based Testing",
      content: `Property-based testing generates random inputs to find edge cases.

**Benefits:**
- Discovers unexpected bugs
- Tests many input combinations
- Verifies invariants hold
- Reduces manual test writing`,
      codeExample: `// Using proptest crate
#[cfg(test)]
mod property_tests {
    use super::*;
    use proptest::prelude::*;
    
    proptest! {
        #[test]
        fn test_deposit_never_decreases_balance(
            initial in 0u64..1000000,
            deposit_amount in 1u64..1000000
        ) {
            let mut contract = MyContract::default();
            contract.initialize();
            contract.balance.set(U256::from(initial));
            
            let old_balance = contract.balance.get();
            contract.deposit(U256::from(deposit_amount)).unwrap();
            let new_balance = contract.balance.get();
            
            // Property: balance should always increase after deposit
            assert!(new_balance > old_balance);
        }
        
        #[test]
        fn test_withdraw_never_exceeds_balance(
            initial in 100u64..1000000,
            withdraw_amount in 1u64..100
        ) {
            let mut contract = MyContract::default();
            contract.initialize();
            contract.balance.set(U256::from(initial));
            
            if withdraw_amount <= initial {
                contract.withdraw(U256::from(withdraw_amount)).unwrap();
                assert!(contract.balance.get() >= U256::ZERO);
            }
        }
    }
}`,
      language: 'rust',
      tip: 'Property tests find bugs your unit tests might miss!'
    },
    {
      id: 4,
      title: "Test Coverage & Best Practices",
      content: `Aim for high test coverage and follow testing best practices.

**Best Practices:**
- Test all error conditions
- Test boundary values (0, max, overflow)
- Test access control
- Verify events are emitted
- Test gas usage
- Use descriptive test names`,
      codeExample: `#[cfg(test)]
mod comprehensive_tests {
    use super::*;
    
    #[test]
    fn test_all_error_cases() {
        let mut contract = MyContract::default();
        contract.initialize();
        
        // Test zero amount
        assert!(contract.deposit(U256::ZERO).is_err());
        
        // Test insufficient balance
        assert!(contract.withdraw(U256::from(1)).is_err());
        
        // Test overflow
        contract.balance.set(U256::MAX);
        assert!(contract.deposit(U256::from(1)).is_err());
    }
    
    #[test]
    fn test_boundary_values() {
        let mut contract = MyContract::default();
        contract.initialize();
        
        // Test max value
        contract.balance.set(U256::MAX - U256::from(1));
        assert!(contract.deposit(U256::from(1)).is_ok());
        assert_eq!(contract.balance.get(), U256::MAX);
        
        // Test just before overflow
        contract.balance.set(U256::MAX - U256::from(10));
        assert!(contract.deposit(U256::from(11)).is_err());
    }
    
    #[test]
    fn test_state_consistency() {
        let mut contract = MyContract::default();
        contract.initialize();
        
        let initial = contract.balance.get();
        contract.deposit(U256::from(100)).unwrap();
        contract.withdraw(U256::from(100)).unwrap();
        
        // Balance should return to initial state
        assert_eq!(contract.balance.get(), initial);
    }
}`,
      language: 'rust',
      tip: 'Aim for 100% coverage of critical functions!'
    }
  ],
  assignment: {
    id: 6,
    title: 'Write Comprehensive Tests',
    description: 'Create a full test suite for a vault contract including unit tests, integration tests, and edge cases.',
    starterCode: `use stylus_sdk::{prelude::*, alloy_primitives::U256};

sol_storage! {
    pub struct Vault {
        balance: StorageU256,
        owner: StorageAddress,
    }
}

#[external]
impl Vault {
    pub fn deposit(&mut self, amount: U256) -> Result<(), Vec<u8>> {
        if amount == U256::ZERO {
            return Err("Zero amount".into());
        }
        let new_balance = self.balance.get().checked_add(amount)
            .ok_or("Overflow")?;
        self.balance.set(new_balance);
        Ok(())
    }
    
    pub fn withdraw(&mut self, amount: U256) -> Result<(), Vec<u8>> {
        let balance = self.balance.get();
        if amount > balance {
            return Err("Insufficient balance".into());
        }
        self.balance.set(balance - amount);
        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    
    // TODO: Add unit tests
    // TODO: Add integration tests
    // TODO: Add edge case tests
}`,
    solution: `#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_deposit_success() {
        let mut vault = Vault::default();
        assert!(vault.deposit(U256::from(100)).is_ok());
        assert_eq!(vault.balance.get(), U256::from(100));
    }
    
    #[test]
    fn test_deposit_zero_fails() {
        let mut vault = Vault::default();
        assert!(vault.deposit(U256::ZERO).is_err());
    }
    
    #[test]
    fn test_withdraw_success() {
        let mut vault = Vault::default();
        vault.deposit(U256::from(100)).unwrap();
        assert!(vault.withdraw(U256::from(50)).is_ok());
        assert_eq!(vault.balance.get(), U256::from(50));
    }
    
    #[test]
    fn test_withdraw_insufficient() {
        let mut vault = Vault::default();
        assert!(vault.withdraw(U256::from(1)).is_err());
    }
    
    #[test]
    fn test_overflow_protection() {
        let mut vault = Vault::default();
        vault.balance.set(U256::MAX);
        assert!(vault.deposit(U256::from(1)).is_err());
    }
    
    #[test]
    fn test_full_cycle() {
        let mut vault = Vault::default();
        vault.deposit(U256::from(1000)).unwrap();
        vault.withdraw(U256::from(300)).unwrap();
        vault.deposit(U256::from(500)).unwrap();
        assert_eq!(vault.balance.get(), U256::from(1200));
    }
}`,
    testCases: [
      { input: 'cargo test', expectedOutput: 'All tests pass' }
    ]
  }
};

export const tutorial7Content = {
  sections: [
    {
      id: 1,
      title: "Gas Optimization Fundamentals",
      content: `Gas optimization is critical for making contracts affordable and competitive.

**Stylus Advantage:**
Stylus contracts are already 10-100x cheaper than Solidity, but you can optimize further.

**Key Principles:**
- Minimize storage operations
- Use memory for temporary data
- Batch operations when possible
- Choose efficient data structures
- Cache storage reads`,
      codeExample: `// BAD: Multiple storage reads
pub fn calculate_total(&self) -> U256 {
    let a = self.value_a.get();  // SLOAD ~100 gas
    let b = self.value_b.get();  // SLOAD ~100 gas
    let c = self.value_c.get();  // SLOAD ~100 gas
    a + b + c
}

// GOOD: Single storage read pattern
pub fn calculate_total_optimized(&self) -> U256 {
    // Load all values once
    let a = self.value_a.get();
    let b = self.value_b.get();
    let c = self.value_c.get();
    
    // Compute in memory
    a + b + c
}

// BEST: If values are related, store together
sol_storage! {
    pub struct Optimized {
        values: StorageArray<U256, 3>,  // Store together
    }
}`,
      language: 'rust',
      tip: 'Storage operations are the most expensive - optimize these first!'
    },
    {
      id: 2,
      title: "Storage Optimization",
      content: `Storage is the most expensive resource in smart contracts.

**Storage Costs:**
- First write (SSTORE): ~20,000 gas
- Update (SSTORE): ~5,000 gas
- Read (SLOAD): ~100 gas

**Optimization Strategies:**
- Pack multiple values into one slot
- Use events instead of storage for logs
- Delete unused storage
- Use transient storage for temporary data`,
      codeExample: `// BAD: Each bool uses 32 bytes
sol_storage! {
    pub struct Wasteful {
        flag1: StorageBool,
        flag2: StorageBool,
        flag3: StorageBool,
        flag4: StorageBool,
    }
}

// GOOD: Pack into single byte
sol_storage! {
    pub struct Efficient {
        flags: StorageU8,  // Can store 8 bools
    }
}

#[external]
impl Efficient {
    pub fn set_flag(&mut self, index: u8, value: bool) {
        let mut flags = self.flags.get();
        if value {
            flags |= 1 << index;  // Set bit
        } else {
            flags &= !(1 << index);  // Clear bit
        }
        self.flags.set(flags);
    }
    
    pub fn get_flag(&self, index: u8) -> bool {
        let flags = self.flags.get();
        (flags & (1 << index)) != 0
    }
}

// BEST: Use events for historical data
sol! {
    event StatusChanged(uint8 indexed status, uint256 timestamp);
}

pub fn update_status(&mut self, status: u8) {
    // Don't store history, emit event instead
    evm::log(StatusChanged {
        status,
        timestamp: U256::from(block::timestamp()),
    });
}`,
      language: 'rust',
      tip: 'Bit packing can save 90%+ on storage costs!'
    },
    {
      id: 3,
      title: "Computation Optimization",
      content: `Optimize computational operations for efficiency.

**Strategies:**
- Use bit operations instead of arithmetic
- Avoid expensive operations (division, modulo)
- Precompute constants
- Use lookup tables for repeated calculations
- Minimize loop iterations`,
      codeExample: `// BAD: Expensive division
pub fn calculate_percentage(&self, value: U256) -> U256 {
    value * U256::from(5) / U256::from(100)
}

// GOOD: Multiply then shift
pub fn calculate_percentage_optimized(&self, value: U256) -> U256 {
    // 5% = multiply by 5, divide by 100
    // But 100 is not power of 2, so precompute
    (value * U256::from(5)) / U256::from(100)
}

// BEST: Use fixed-point arithmetic
pub fn calculate_fee_bps(&self, value: U256, bps: u32) -> U256 {
    // Basis points: 1 bps = 0.01%
    // 500 bps = 5%
    (value * U256::from(bps)) / U256::from(10000)
}

// Bit manipulation is cheaper
pub fn is_even(&self, value: U256) -> bool {
    (value & U256::from(1)) == U256::ZERO
}

pub fn divide_by_power_of_2(&self, value: U256, power: u32) -> U256 {
    value >> power  // Much cheaper than division
}

// Lookup table for gas savings
const FEE_TIERS: [u32; 5] = [10, 25, 50, 75, 100];  // bps

pub fn get_fee_tier(&self, tier_index: usize) -> u32 {
    FEE_TIERS[tier_index]  // No computation needed
}`,
      language: 'rust',
      tip: 'Bit shifts are ~10x cheaper than division!'
    },
    {
      id: 4,
      title: "Advanced Optimization Techniques",
      content: `Master-level optimizations for maximum efficiency.

**Advanced Techniques:**
- Short-circuit evaluation
- Lazy evaluation
- Memory vs storage trade-offs
- Function inlining
- Optimal data structure selection`,
      codeExample: `// Short-circuit evaluation
pub fn complex_check(&self, user: Address) -> bool {
    // Check cheapest condition first
    if user == Address::ZERO {
        return false;  // Exit early, don't waste gas
    }
    
    // More expensive checks after
    if !self.is_registered(user) {
        return false;
    }
    
    // Most expensive last
    self.verify_signature(user)
}

// Lazy evaluation - only compute when needed
pub fn get_value_if_active(&self) -> Option<U256> {
    if !self.is_active.get() {
        return None;  // Skip expensive computation
    }
    
    Some(self.expensive_calculation())
}

// Memory for temporary arrays
pub fn process_batch(&self, items: Vec<U256>) -> U256 {
    let mut total = U256::ZERO;
    
    // Process in memory, not storage
    for item in items {
        total += item;
    }
    
    // Only write result to storage
    total
}

// Optimal data structure: Use HashMap for lookups
use std::collections::HashMap;

pub fn lookup_optimized(&self, key: U256) -> Option<U256> {
    // O(1) lookup instead of O(n) array scan
    self.data_map.get(key)
}

// Function call overhead
#[inline]  // Hint compiler to inline for zero-cost abstraction
fn add_fee(&self, amount: U256) -> U256 {
    amount + U256::from(100)
}`,
      language: 'rust',
      tip: 'Profile your contract to find the real bottlenecks!'
    }
  ],
  assignment: {
    id: 7,
    title: 'Optimize a Token Contract',
    description: 'Take an inefficient token contract and optimize it for gas savings. Apply storage packing, computation optimization, and efficient patterns.',
    starterCode: `// UNOPTIMIZED TOKEN
sol_storage! {
    pub struct InefficientToken {
        total_supply: StorageU256,
        balances: StorageMap<Address, StorageU256>,
        frozen: StorageMap<Address, StorageBool>,
        is_paused: StorageBool,
        owner: StorageAddress,
        fee_rate: StorageU256,  // In percentage
    }
}

// TODO: Optimize storage layout
// TODO: Optimize transfer function
// TODO: Reduce storage operations
// TODO: Use efficient fee calculation`,
    solution: `// OPTIMIZED TOKEN
sol_storage! {
    pub struct OptimizedToken {
        total_supply: StorageU256,
        balances: StorageMap<Address, StorageU256>,
        // Pack frozen + paused into single byte
        flags: StorageU8,  // bit 0: paused, bits 1-7: reserved
        owner: StorageAddress,
        fee_bps: StorageU16,  // Basis points (0-10000)
    }
}

#[external]
impl OptimizedToken {
    pub fn transfer(&mut self, to: Address, amount: U256) -> Result<(), Vec<u8>> {
        // Short-circuit checks (cheapest first)
        if to == Address::ZERO {
            return Err("Invalid address".into());
        }
        
        if (self.flags.get() & 1) != 0 {
            return Err("Paused".into());
        }
        
        let sender = msg::sender();
        
        // Cache storage reads
        let sender_balance = self.balances.get(sender);
        
        // Calculate fee using bps (more efficient)
        let fee_bps = self.fee_bps.get() as u32;
        let fee = (amount * U256::from(fee_bps)) / U256::from(10000);
        let total_amount = amount.checked_add(fee)
            .ok_or("Amount overflow")?;
        
        // Validate balance
        if sender_balance < total_amount {
            return Err("Insufficient balance".into());
        }
        
        // Update balances (batched)
        self.balances.insert(sender, sender_balance - total_amount);
        
        let recipient_balance = self.balances.get(to);
        self.balances.insert(to, recipient_balance + amount);
        
        Ok(())
    }
    
    #[inline]
    fn is_paused(&self) -> bool {
        (self.flags.get() & 1) != 0
    }
}`,
    testCases: [
      { input: 'Compare gas: before vs after', expectedOutput: '30-50% gas savings' }
    ]
  }
};

export const tutorial8Content = {
  sections: [
    {
      id: 1,
      title: "Upgradeable Contracts",
      content: `Design contracts that can be upgraded without losing state or changing addresses.

**Upgrade Patterns:**
- Proxy pattern with implementation contracts
- Storage separation
- Initialize functions instead of constructors
- Careful storage layout management

**Why Upgradeable:**
- Fix bugs in production
- Add new features
- Adapt to changing requirements
- Maintain same contract address`,
      codeExample: `// Proxy Contract
sol_storage! {
    pub struct Proxy {
        implementation: StorageAddress,
        admin: StorageAddress,
    }
}

#[external]
impl Proxy {
    pub fn upgrade(&mut self, new_implementation: Address) -> Result<(), Vec<u8>> {
        // Only admin can upgrade
        if msg::sender() != self.admin.get() {
            return Err("Only admin".into());
        }
        
        if new_implementation == Address::ZERO {
            return Err("Invalid address".into());
        }
        
        self.implementation.set(new_implementation);
        
        evm::log(Upgraded {
            implementation: new_implementation,
        });
        
        Ok(())
    }
    
    pub fn get_implementation(&self) -> Address {
        self.implementation.get()
    }
}

// Implementation Contract V1
sol_storage! {
    pub struct VaultV1 {
        balances: StorageMap<Address, U256>,
        total_deposited: StorageU256,
    }
}

// Implementation Contract V2 (upgraded)
sol_storage! {
    pub struct VaultV2 {
        balances: StorageMap<Address, U256>,
        total_deposited: StorageU256,
        // New feature: interest rate
        interest_rate: StorageU256,
    }
}

sol! {
    event Upgraded(address indexed implementation);
}`,
      language: 'rust',
      tip: 'Never change storage layout in upgrades - only append new variables!'
    },
    {
      id: 2,
      title: "Access Control Patterns",
      content: `Implement sophisticated access control for multi-user systems.

**Patterns:**
- Role-Based Access Control (RBAC)
- Multi-signature requirements
- Time-locked operations
- Hierarchical permissions`,
      codeExample: `use stylus_sdk::{prelude::*, alloy_primitives::{Address, U256}};

// Define roles as constants
const ADMIN_ROLE: u8 = 1;
const MINTER_ROLE: u8 = 2;
const BURNER_ROLE: u8 = 4;
const PAUSER_ROLE: u8 = 8;

sol_storage! {
    pub struct RoleBasedContract {
        // Bitmap of roles for each address
        roles: StorageMap<Address, StorageU8>,
        admin: StorageAddress,
    }
}

#[external]
impl RoleBasedContract {
    pub fn grant_role(&mut self, account: Address, role: u8) -> Result<(), Vec<u8>> {
        // Only admin can grant roles
        if msg::sender() != self.admin.get() {
            return Err("Only admin".into());
        }
        
        let current_roles = self.roles.get(account);
        self.roles.insert(account, current_roles | role);
        
        evm::log(RoleGranted { account, role });
        Ok(())
    }
    
    pub fn revoke_role(&mut self, account: Address, role: u8) -> Result<(), Vec<u8>> {
        if msg::sender() != self.admin.get() {
            return Err("Only admin".into());
        }
        
        let current_roles = self.roles.get(account);
        self.roles.insert(account, current_roles & !role);
        
        evm::log(RoleRevoked { account, role });
        Ok(())
    }
    
    pub fn has_role(&self, account: Address, role: u8) -> bool {
        (self.roles.get(account) & role) != 0
    }
    
    // Protected function example
    pub fn mint(&mut self, to: Address, amount: U256) -> Result<(), Vec<u8>> {
        if !self.has_role(msg::sender(), MINTER_ROLE) {
            return Err("Requires MINTER_ROLE".into());
        }
        
        // Minting logic...
        Ok(())
    }
}

sol! {
    event RoleGranted(address indexed account, uint8 role);
    event RoleRevoked(address indexed account, uint8 role);
}`,
      language: 'rust',
      tip: 'Use bit flags to store multiple roles efficiently in one byte!'
    },
    {
      id: 3,
      title: "Factory Pattern",
      content: `Create contracts that deploy other contracts programmatically.

**Use Cases:**
- Token factories
- Pool creation (Uniswap style)
- DAO deployment
- Cloning contracts

**Benefits:**
- Standardized deployments
- Reduced deployment costs
- Tracking all deployed contracts
- Upgrade all instances`,
      codeExample: `sol_storage! {
    pub struct TokenFactory {
        deployed_tokens: StorageVec<StorageAddress>,
        token_count: StorageU256,
    }
}

sol! {
    event TokenCreated(
        address indexed token,
        address indexed creator,
        string name,
        string symbol,
        uint256 totalSupply
    );
}

#[external]
impl TokenFactory {
    pub fn create_token(
        &mut self,
        name: String,
        symbol: String,
        total_supply: U256
    ) -> Result<Address, Vec<u8>> {
        // In actual Stylus, you would deploy bytecode here
        // This is a simplified example
        
        let creator = msg::sender();
        
        // Simulated deployment - in reality would use CREATE2
        let token_address = self.compute_token_address(creator, name.clone());
        
        // Track deployed token
        self.deployed_tokens.push(token_address);
        self.token_count.set(self.token_count.get() + U256::from(1));
        
        // Emit event
        evm::log(TokenCreated {
            token: token_address,
            creator,
            name,
            symbol,
            totalSupply: total_supply,
        });
        
        Ok(token_address)
    }
    
    pub fn get_deployed_tokens(&self) -> Vec<Address> {
        let count = self.deployed_tokens.len();
        let mut tokens = Vec::new();
        
        for i in 0..count {
            tokens.push(self.deployed_tokens.get(i).unwrap());
        }
        
        tokens
    }
    
    pub fn get_token_count(&self) -> U256 {
        self.token_count.get()
    }
    
    fn compute_token_address(&self, creator: Address, name: String) -> Address {
        // Simplified - would use CREATE2 for deterministic addresses
        creator  // Placeholder
    }
}`,
      language: 'rust',
      tip: 'Use CREATE2 for deterministic contract addresses!'
    },
    {
      id: 4,
      title: "Pull Payment Pattern",
      content: `Implement secure payment withdrawals instead of pushing payments.

**Why Pull over Push:**
- Prevents reentrancy attacks
- Gas efficiency
- Failed transfers don't break contract
- User controls when to withdraw

**Pattern:**
Instead of sending ETH directly, record what users can withdraw.`,
      codeExample: `sol_storage! {
    pub struct PaymentSplitter {
        // Track how much each address can withdraw
        pending_withdrawals: StorageMap<Address, U256>,
        total_shares: StorageU256,
        shares: StorageMap<Address, U256>,
    }
}

sol! {
    event PaymentReleased(address indexed to, uint256 amount);
    event PaymentReceived(address indexed from, uint256 amount);
}

#[external]
impl PaymentSplitter {
    pub fn release_payment(&mut self, payee: Address) -> Result<(), Vec<u8>> {
        let payment = self.pending_withdrawals.get(payee);
        
        if payment == U256::ZERO {
            return Err("No payment due".into());
        }
        
        // Update state BEFORE transfer (prevent reentrancy)
        self.pending_withdrawals.insert(payee, U256::ZERO);
        
        // Transfer would happen here
        // call::transfer(payee, payment)?;
        
        evm::log(PaymentReleased {
            to: payee,
            amount: payment,
        });
        
        Ok(())
    }
    
    // Called when contract receives payment
    pub fn receive_payment(&mut self) -> Result<(), Vec<u8>> {
        let amount = msg::value();  // Amount sent
        let sender = msg::sender();
        
        if amount == U256::ZERO {
            return Err("No payment sent".into());
        }
        
        // Distribute to all shareholders proportionally
        let total_shares = self.total_shares.get();
        
        // This is simplified - would iterate through all shareholders
        // For each shareholder:
        //   let share = (amount * shareholder_shares) / total_shares;
        //   pending_withdrawals[shareholder] += share;
        
        evm::log(PaymentReceived {
            from: sender,
            amount,
        });
        
        Ok(())
    }
    
    pub fn get_pending_payment(&self, payee: Address) -> U256 {
        self.pending_withdrawals.get(payee)
    }
}`,
      language: 'rust',
      tip: 'Always update state before external calls (Checks-Effects-Interactions pattern)!'
    }
  ],
  assignment: {
    id: 8,
    title: 'Build a Multi-Sig Wallet with RBAC',
    description: 'Create a multi-signature wallet with role-based access control. Require multiple signatures for high-value transactions.',
    starterCode: `// TODO: Implement MultiSigWallet with:
// - Role-based access control
// - Transaction proposals
// - Multiple approvals required
// - Pull payment pattern for withdrawals`,
    solution: `sol_storage! {
    pub struct MultiSigWallet {
        owners: StorageMap<Address, StorageBool>,
        required_approvals: StorageU8,
        transactions: StorageVec<Transaction>,
        approvals: StorageMap<U256, StorageMap<Address, StorageBool>>,
    }
}

struct Transaction {
    to: Address,
    amount: U256,
    executed: bool,
    approval_count: u8,
}

#[external]
impl MultiSigWallet {
    pub fn propose_transaction(&mut self, to: Address, amount: U256) -> Result<U256, Vec<u8>> {
        if !self.owners.get(msg::sender()) {
            return Err("Not owner".into());
        }
        
        let tx_id = U256::from(self.transactions.len());
        // Add transaction logic
        Ok(tx_id)
    }
    
    pub fn approve_transaction(&mut self, tx_id: U256) -> Result<(), Vec<u8>> {
        // Approval logic
        Ok(())
    }
    
    pub fn execute_transaction(&mut self, tx_id: U256) -> Result<(), Vec<u8>> {
        // Execute if enough approvals
        Ok(())
    }
}`,
    testCases: [
      { input: 'propose_transaction(addr, 1000)', expectedOutput: 'Transaction ID returned' },
      { input: 'Execute with 1 approval', expectedOutput: 'Error: Not enough approvals' },
      { input: 'Execute with 3 approvals', expectedOutput: 'Success' }
    ]
  }
};

export const tutorial9Content = {
  sections: [
    {
      id: 1,
      title: "ERC-20 Token Standard",
      content: `The ERC-20 standard defines a common interface for fungible tokens.

**Core Functions:**
- \`totalSupply()\` - Total tokens in existence
- \`balanceOf(address)\` - Get balance of address
- \`transfer(to, amount)\` - Transfer tokens
- \`approve(spender, amount)\` - Approve spending
- \`transferFrom(from, to, amount)\` - Transfer on behalf
- \`allowance(owner, spender)\` - Check approved amount

**Events:**
- \`Transfer(from, to, amount)\`
- \`Approval(owner, spender, amount)\``,
      codeExample: `use stylus_sdk::{prelude::*, alloy_primitives::{Address, U256}, evm, msg};

sol! {
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

sol_storage! {
    pub struct ERC20Token {
        total_supply: StorageU256,
        balances: StorageMap<Address, U256>,
        allowances: StorageMap<Address, StorageMap<Address, U256>>,
        name: StorageString,
        symbol: StorageString,
        decimals: StorageU8,
    }
}

#[external]
impl ERC20Token {
    pub fn initialize(&mut self, name: String, symbol: String, initial_supply: U256) {
        self.name.set_str(&name);
        self.symbol.set_str(&symbol);
        self.decimals.set(18);
        
        let sender = msg::sender();
        self.balances.insert(sender, initial_supply);
        self.total_supply.set(initial_supply);
        
        evm::log(Transfer {
            from: Address::ZERO,
            to: sender,
            value: initial_supply,
        });
    }
    
    pub fn total_supply(&self) -> U256 {
        self.total_supply.get()
    }
    
    pub fn balance_of(&self, account: Address) -> U256 {
        self.balances.get(account)
    }
    
    pub fn transfer(&mut self, to: Address, amount: U256) -> Result<bool, Vec<u8>> {
        let from = msg::sender();
        self._transfer(from, to, amount)?;
        Ok(true)
    }
    
    fn _transfer(&mut self, from: Address, to: Address, amount: U256) -> Result<(), Vec<u8>> {
        if from == Address::ZERO || to == Address::ZERO {
            return Err("Invalid address".into());
        }
        
        let from_balance = self.balances.get(from);
        if from_balance < amount {
            return Err("Insufficient balance".into());
        }
        
        self.balances.insert(from, from_balance - amount);
        
        let to_balance = self.balances.get(to);
        self.balances.insert(to, to_balance + amount);
        
        evm::log(Transfer { from, to, value: amount });
        Ok(())
    }
}`,
      language: 'rust',
      tip: 'Always emit Transfer event from address(0) when minting!'
    },
    {
      id: 2,
      title: "Approval Mechanism",
      content: `The approval mechanism allows third parties to transfer tokens on your behalf.

**Use Cases:**
- DEX trading (approve DEX to move your tokens)
- Staking contracts
- Payment processors
- DeFi protocols

**Security:**
- Check allowance before transferFrom
- Decrease allowance after use
- Beware of front-running approval changes`,
      codeExample: `#[external]
impl ERC20Token {
    pub fn approve(&mut self, spender: Address, amount: U256) -> Result<bool, Vec<u8>> {
        if spender == Address::ZERO {
            return Err("Invalid spender".into());
        }
        
        let owner = msg::sender();
        
        // Set allowance
        self.allowances.setter(owner).insert(spender, amount);
        
        evm::log(Approval {
            owner,
            spender,
            value: amount,
        });
        
        Ok(true)
    }
    
    pub fn allowance(&self, owner: Address, spender: Address) -> U256 {
        self.allowances.getter(owner).get(spender)
    }
    
    pub fn transfer_from(
        &mut self,
        from: Address,
        to: Address,
        amount: U256
    ) -> Result<bool, Vec<u8>> {
        let spender = msg::sender();
        
        // Check allowance
        let current_allowance = self.allowances.getter(from).get(spender);
        if current_allowance < amount {
            return Err("Insufficient allowance".into());
        }
        
        // Decrease allowance
        self.allowances.setter(from).insert(spender, current_allowance - amount);
        
        // Transfer tokens
        self._transfer(from, to, amount)?;
        
        Ok(true)
    }
    
    pub fn increase_allowance(&mut self, spender: Address, added_value: U256) -> Result<bool, Vec<u8>> {
        let owner = msg::sender();
        let current = self.allowances.getter(owner).get(spender);
        let new_allowance = current.checked_add(added_value)
            .ok_or("Allowance overflow")?;
        
        self.allowances.setter(owner).insert(spender, new_allowance);
        
        evm::log(Approval { owner, spender, value: new_allowance });
        Ok(true)
    }
    
    pub fn decrease_allowance(&mut self, spender: Address, subtracted_value: U256) -> Result<bool, Vec<u8>> {
        let owner = msg::sender();
        let current = self.allowances.getter(owner).get(spender);
        
        if current < subtracted_value {
            return Err("Allowance underflow".into());
        }
        
        let new_allowance = current - subtracted_value;
        self.allowances.setter(owner).insert(spender, new_allowance);
        
        evm::log(Approval { owner, spender, value: new_allowance });
        Ok(true)
    }
}`,
      language: 'rust',
      tip: 'Use increaseAllowance/decreaseAllowance to prevent front-running attacks!'
    },
    {
      id: 3,
      title: "Advanced Token Features",
      content: `Enhance your token with advanced features.

**Common Features:**
- Burning (reduce supply)
- Minting (increase supply)
- Pausing (emergency stop)
- Snapshots (for governance)
- Transfer fees
- Blacklisting`,
      codeExample: `sol_storage! {
    pub struct AdvancedToken {
        // ERC-20 base
        total_supply: StorageU256,
        balances: StorageMap<Address, U256>,
        allowances: StorageMap<Address, StorageMap<Address, U256>>,
        
        // Advanced features
        owner: StorageAddress,
        paused: StorageBool,
        minter: StorageAddress,
        transfer_fee_bps: StorageU16,  // Basis points
        fee_recipient: StorageAddress,
    }
}

sol! {
    event TokensBurned(address indexed from, uint256 amount);
    event TokensMinted(address indexed to, uint256 amount);
    event Paused();
    event Unpaused();
    event FeeChanged(uint16 newFeeBps);
}

#[external]
impl AdvancedToken {
    pub fn burn(&mut self, amount: U256) -> Result<(), Vec<u8>> {
        let sender = msg::sender();
        let balance = self.balances.get(sender);
        
        if balance < amount {
            return Err("Insufficient balance".into());
        }
        
        self.balances.insert(sender, balance - amount);
        let new_supply = self.total_supply.get() - amount;
        self.total_supply.set(new_supply);
        
        evm::log(TokensBurned { from: sender, amount });
        evm::log(Transfer { from: sender, to: Address::ZERO, value: amount });
        
        Ok(())
    }
    
    pub fn mint(&mut self, to: Address, amount: U256) -> Result<(), Vec<u8>> {
        // Only minter can mint
        if msg::sender() != self.minter.get() {
            return Err("Not minter".into());
        }
        
        if to == Address::ZERO {
            return Err("Invalid address".into());
        }
        
        let balance = self.balances.get(to);
        self.balances.insert(to, balance + amount);
        
        let new_supply = self.total_supply.get() + amount;
        self.total_supply.set(new_supply);
        
        evm::log(TokensMinted { to, amount });
        evm::log(Transfer { from: Address::ZERO, to, value: amount });
        
        Ok(())
    }
    
    pub fn pause(&mut self) -> Result<(), Vec<u8>> {
        if msg::sender() != self.owner.get() {
            return Err("Only owner".into());
        }
        
        self.paused.set(true);
        evm::log(Paused {});
        Ok(())
    }
    
    pub fn unpause(&mut self) -> Result<(), Vec<u8>> {
        if msg::sender() != self.owner.get() {
            return Err("Only owner".into());
        }
        
        self.paused.set(false);
        evm::log(Unpaused {});
        Ok(())
    }
    
    pub fn transfer_with_fee(&mut self, to: Address, amount: U256) -> Result<bool, Vec<u8>> {
        if self.paused.get() {
            return Err("Token is paused".into());
        }
        
        let from = msg::sender();
        
        // Calculate fee
        let fee_bps = self.transfer_fee_bps.get() as u32;
        let fee = (amount * U256::from(fee_bps)) / U256::from(10000);
        let amount_after_fee = amount - fee;
        
        // Transfer main amount
        self._transfer(from, to, amount_after_fee)?;
        
        // Transfer fee
        if fee > U256::ZERO {
            let fee_recipient = self.fee_recipient.get();
            self._transfer(from, fee_recipient, fee)?;
        }
        
        Ok(true)
    }
}`,
      language: 'rust',
      tip: 'Consider governance for changing critical parameters like fees!'
    },
    {
      id: 4,
      title: "Token Economics & Security",
      content: `Design sound tokenomics and security measures.

**Tokenomics Considerations:**
- Initial supply distribution
- Inflation/deflation mechanics
- Vesting schedules
- Utility within ecosystem

**Security Checklist:**
- Prevent integer overflow/underflow
- Validate all inputs
- Emit events for all state changes
- Implement pausable for emergencies
- Consider time locks for admin functions
- Audit before mainnet`,
      codeExample: `// Vesting schedule implementation
sol_storage! {
    pub struct VestedToken {
        // Base ERC-20
        total_supply: StorageU256,
        balances: StorageMap<Address, U256>,
        
        // Vesting
        vesting_schedules: StorageMap<Address, VestingSchedule>,
    }
}

struct VestingSchedule {
    total_amount: U256,
    released_amount: U256,
    start_time: U256,
    duration: U256,
}

#[external]
impl VestedToken {
    pub fn create_vesting(
        &mut self,
        beneficiary: Address,
        amount: U256,
        duration_seconds: U256
    ) -> Result<(), Vec<u8>> {
        if msg::sender() != self.owner.get() {
            return Err("Only owner".into());
        }
        
        let schedule = VestingSchedule {
            total_amount: amount,
            released_amount: U256::ZERO,
            start_time: U256::from(block::timestamp()),
            duration: duration_seconds,
        };
        
        self.vesting_schedules.insert(beneficiary, schedule);
        Ok(())
    }
    
    pub fn release_vested(&mut self) -> Result<U256, Vec<u8>> {
        let beneficiary = msg::sender();
        let schedule = self.vesting_schedules.get(beneficiary);
        
        let vested_amount = self.calculate_vested(schedule)?;
        let releasable = vested_amount - schedule.released_amount;
        
        if releasable == U256::ZERO {
            return Err("No tokens to release".into());
        }
        
        // Update schedule
        let mut updated_schedule = schedule;
        updated_schedule.released_amount = vested_amount;
        self.vesting_schedules.insert(beneficiary, updated_schedule);
        
        // Transfer tokens
        let balance = self.balances.get(beneficiary);
        self.balances.insert(beneficiary, balance + releasable);
        
        Ok(releasable)
    }
    
    fn calculate_vested(&self, schedule: VestingSchedule) -> Result<U256, Vec<u8>> {
        let current_time = U256::from(block::timestamp());
        
        if current_time < schedule.start_time {
            return Ok(U256::ZERO);
        }
        
        let elapsed = current_time - schedule.start_time;
        
        if elapsed >= schedule.duration {
            return Ok(schedule.total_amount);
        }
        
        // Linear vesting
        let vested = (schedule.total_amount * elapsed) / schedule.duration;
        Ok(vested)
    }
}`,
      language: 'rust',
      tip: 'Use time-locked vesting to prevent early dumps!'
    }
  ],
  assignment: {
    id: 9,
    title: 'Create a Complete DeFi Token',
    description: 'Build an ERC-20 token with burning, minting, pausing, transfer fees, and vesting.',
    starterCode: `// TODO: Implement full-featured DeFi token with:
// - ERC-20 standard functions
// - Burn/mint capabilities
// - Pausable transfers
// - Transfer fees
// - Vesting schedules`,
    solution: `// Full implementation combining all features from sections above
sol_storage! {
    pub struct DeFiToken {
        total_supply: StorageU256,
        balances: StorageMap<Address, U256>,
        allowances: StorageMap<Address, StorageMap<Address, U256>>,
        owner: StorageAddress,
        paused: StorageBool,
        transfer_fee_bps: StorageU16,
        name: StorageString,
        symbol: StorageString,
    }
}

// Implement all functions from sections 1-4`,
    testCases: [
      { input: 'transfer(addr, 1000)', expectedOutput: '995 received (0.5% fee)' },
      { input: 'burn(500)', expectedOutput: 'Total supply decreased' },
      { input: 'Transfer when paused', expectedOutput: 'Error: Paused' }
    ]
  }
};

export const tutorial10Content = {
  sections: [
    {
      id: 1,
      title: "ERC-721 NFT Standard",
      content: `ERC-721 defines the standard for non-fungible tokens (NFTs).

**Core Functions:**
- \`balanceOf(owner)\` - Number of NFTs owned
- \`ownerOf(tokenId)\` - Get owner of specific NFT
- \`transferFrom(from, to, tokenId)\` - Transfer NFT
- \`safeTransferFrom\` - Transfer with receiver validation
- \`approve(to, tokenId)\` - Approve transfer
- \`setApprovalForAll\` - Approve all tokens

**Events:**
- \`Transfer(from, to, tokenId)\`
- \`Approval(owner, approved, tokenId)\`
- \`ApprovalForAll(owner, operator, approved)\``,
      codeExample: `use stylus_sdk::{prelude::*, alloy_primitives::{Address, U256}, evm, msg};

sol! {
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);
    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);
}

sol_storage! {
    pub struct NFT {
        // Token ownership
        owners: StorageMap<U256, Address>,
        balances: StorageMap<Address, U256>,
        
        // Approvals
        token_approvals: StorageMap<U256, Address>,
        operator_approvals: StorageMap<Address, StorageMap<Address, bool>>,
        
        // Metadata
        name: StorageString,
        symbol: StorageString,
        token_uri_base: StorageString,
        
        // Minting
        next_token_id: StorageU256,
    }
}

#[external]
impl NFT {
    pub fn balance_of(&self, owner: Address) -> U256 {
        if owner == Address::ZERO {
            return U256::ZERO;
        }
        self.balances.get(owner)
    }
    
    pub fn owner_of(&self, token_id: U256) -> Result<Address, Vec<u8>> {
        let owner = self.owners.get(token_id);
        if owner == Address::ZERO {
            return Err("Token doesn't exist".into());
        }
        Ok(owner)
    }
    
    pub fn transfer_from(&mut self, from: Address, to: Address, token_id: U256) -> Result<(), Vec<u8>> {
        // Validate ownership
        if self.owners.get(token_id) != from {
            return Err("Not token owner".into());
        }
        
        // Check authorization
        let sender = msg::sender();
        if !self.is_approved_or_owner(sender, token_id) {
            return Err("Not authorized".into());
        }
        
        if to == Address::ZERO {
            return Err("Invalid recipient".into());
        }
        
        // Clear approval
        self.token_approvals.insert(token_id, Address::ZERO);
        
        // Update balances
        let from_balance = self.balances.get(from);
        self.balances.insert(from, from_balance - U256::from(1));
        
        let to_balance = self.balances.get(to);
        self.balances.insert(to, to_balance + U256::from(1));
        
        // Update ownership
        self.owners.insert(token_id, to);
        
        evm::log(Transfer { from, to, tokenId: token_id });
        
        Ok(())
    }
    
    fn is_approved_or_owner(&self, spender: Address, token_id: U256) -> bool {
        let owner = self.owners.get(token_id);
        
        // Owner can always transfer
        if spender == owner {
            return true;
        }
        
        // Check specific approval
        if self.token_approvals.get(token_id) == spender {
            return true;
        }
        
        // Check operator approval
        self.operator_approvals.getter(owner).get(spender)
    }
}`,
      language: 'rust',
      tip: 'Always validate token exists before operations!'
    },
    {
      id: 2,
      title: "NFT Minting & Metadata",
      content: `Implement minting functions and metadata management.

**Minting Patterns:**
- Sequential IDs
- Reserved/presale minting
- Batch minting
- Lazy minting

**Metadata:**
- Token URI pointing to JSON
- On-chain vs off-chain storage
- IPFS integration
- Metadata standards`,
      codeExample: `#[external]
impl NFT {
    pub fn mint(&mut self, to: Address) -> Result<U256, Vec<u8>> {
        if to == Address::ZERO {
            return Err("Invalid address".into());
        }
        
        let token_id = self.next_token_id.get();
        self.next_token_id.set(token_id + U256::from(1));
        
        // Set ownership
        self.owners.insert(token_id, to);
        
        // Update balance
        let balance = self.balances.get(to);
        self.balances.insert(to, balance + U256::from(1));
        
        evm::log(Transfer {
            from: Address::ZERO,
            to,
            tokenId: token_id,
        });
        
        Ok(token_id)
    }
    
    pub fn batch_mint(&mut self, to: Address, quantity: u32) -> Result<Vec<U256>, Vec<u8>> {
        if to == Address::ZERO {
            return Err("Invalid address".into());
        }
        
        if quantity == 0 || quantity > 100 {
            return Err("Invalid quantity".into());
        }
        
        let mut token_ids = Vec::new();
        
        for _ in 0..quantity {
            let token_id = self.mint(to)?;
            token_ids.push(token_id);
        }
        
        Ok(token_ids)
    }
    
    pub fn token_uri(&self, token_id: U256) -> Result<String, Vec<u8>> {
        if self.owners.get(token_id) == Address::ZERO {
            return Err("Token doesn't exist".into());
        }
        
        // Construct URI: baseURI + tokenId + .json
        let base_uri = self.token_uri_base.get_string();
        let uri = format!("{}{}.json", base_uri, token_id);
        
        Ok(uri)
    }
    
    pub fn set_base_uri(&mut self, base_uri: String) -> Result<(), Vec<u8>> {
        // Only owner should be able to set
        self.token_uri_base.set_str(&base_uri);
        Ok(())
    }
}`,
      language: 'rust',
      tip: 'Store metadata on IPFS for decentralization!'
    },
    {
      id: 3,
      title: "NFT Marketplace - Listings",
      content: `Build a marketplace where users can list and buy NFTs.

**Marketplace Features:**
- Fixed-price listings
- Auction listings
- Offer system
- Royalties
- Marketplace fees`,
      codeExample: `sol_storage! {
    pub struct NFTMarketplace {
        listings: StorageMap<U256, Listing>,  // tokenId => Listing
        marketplace_fee_bps: StorageU16,
        marketplace_owner: StorageAddress,
    }
}

struct Listing {
    seller: Address,
    price: U256,
    active: bool,
}

sol! {
    event Listed(uint256 indexed tokenId, address indexed seller, uint256 price);
    event Sold(uint256 indexed tokenId, address indexed buyer, uint256 price);
    event Cancelled(uint256 indexed tokenId);
}

#[external]
impl NFTMarketplace {
    pub fn list_nft(
        &mut self,
        nft_contract: Address,
        token_id: U256,
        price: U256
    ) -> Result<(), Vec<u8>> {
        let seller = msg::sender();
        
        if price == U256::ZERO {
            return Err("Price must be > 0".into());
        }
        
        // Verify seller owns the NFT
        // In reality: call nft_contract.ownerOf(tokenId)
        
        // Create listing
        let listing = Listing {
            seller,
            price,
            active: true,
        };
        
        self.listings.insert(token_id, listing);
        
        evm::log(Listed {
            tokenId: token_id,
            seller,
            price,
        });
        
        Ok(())
    }
    
    pub fn buy_nft(
        &mut self,
        nft_contract: Address,
        token_id: U256
    ) -> Result<(), Vec<u8>> {
        let buyer = msg::sender();
        let listing = self.listings.get(token_id);
        
        if !listing.active {
            return Err("Not listed".into());
        }
        
        let payment = msg::value();
        if payment < listing.price {
            return Err("Insufficient payment".into());
        }
        
        // Calculate fees
        let fee_bps = self.marketplace_fee_bps.get() as u32;
        let marketplace_fee = (listing.price * U256::from(fee_bps)) / U256::from(10000);
        let seller_proceeds = listing.price - marketplace_fee;
        
        // Mark as sold
        let mut updated_listing = listing;
        updated_listing.active = false;
        self.listings.insert(token_id, updated_listing);
        
        // Transfer NFT to buyer
        // nft_contract.transferFrom(listing.seller, buyer, token_id);
        
        // Transfer payment
        // transfer(listing.seller, seller_proceeds);
        // transfer(marketplace_owner, marketplace_fee);
        
        evm::log(Sold {
            tokenId: token_id,
            buyer,
            price: listing.price,
        });
        
        Ok(())
    }
    
    pub fn cancel_listing(&mut self, token_id: U256) -> Result<(), Vec<u8>> {
        let listing = self.listings.get(token_id);
        
        if listing.seller != msg::sender() {
            return Err("Not seller".into());
        }
        
        if !listing.active {
            return Err("Not listed".into());
        }
        
        let mut updated_listing = listing;
        updated_listing.active = false;
        self.listings.insert(token_id, updated_listing);
        
        evm::log(Cancelled { tokenId: token_id });
        
        Ok(())
    }
    
    pub fn get_listing(&self, token_id: U256) -> Result<Listing, Vec<u8>> {
        let listing = self.listings.get(token_id);
        if !listing.active {
            return Err("Not listed".into());
        }
        Ok(listing)
    }
}`,
      language: 'rust',
      tip: 'Always transfer NFT before payment to prevent reentrancy!'
    },
    {
      id: 4,
      title: "Auctions & Royalties",
      content: `Implement auction mechanics and creator royalties.

**Auction Types:**
- English auction (ascending price)
- Dutch auction (descending price)
- Sealed bid auction

**Royalties:**
- ERC-2981 royalty standard
- Automatic royalty payments
- Configurable percentages`,
      codeExample: `sol_storage! {
    pub struct AuctionHouse {
        auctions: StorageMap<U256, Auction>,
        royalties: StorageMap<Address, StorageMap<U256, RoyaltyInfo>>,  // NFT => tokenId => royalty
    }
}

struct Auction {
    seller: Address,
    starting_price: U256,
    highest_bid: U256,
    highest_bidder: Address,
    end_time: U256,
    active: bool,
}

struct RoyaltyInfo {
    creator: Address,
    royalty_bps: u16,  // Basis points (e.g., 500 = 5%)
}

sol! {
    event AuctionCreated(uint256 indexed tokenId, address indexed seller, uint256 startingPrice, uint256 endTime);
    event BidPlaced(uint256 indexed tokenId, address indexed bidder, uint256 amount);
    event AuctionFinalized(uint256 indexed tokenId, address indexed winner, uint256 finalPrice);
}

#[external]
impl AuctionHouse {
    pub fn create_auction(
        &mut self,
        nft_contract: Address,
        token_id: U256,
        starting_price: U256,
        duration_seconds: u64
    ) -> Result<(), Vec<u8>> {
        let seller = msg::sender();
        let current_time = block::timestamp();
        let end_time = U256::from(current_time + duration_seconds);
        
        let auction = Auction {
            seller,
            starting_price,
            highest_bid: U256::ZERO,
            highest_bidder: Address::ZERO,
            end_time,
            active: true,
        };
        
        self.auctions.insert(token_id, auction);
        
        evm::log(AuctionCreated {
            tokenId: token_id,
            seller,
            startingPrice: starting_price,
            endTime: end_time,
        });
        
        Ok(())
    }
    
    pub fn place_bid(&mut self, token_id: U256) -> Result<(), Vec<u8>> {
        let bidder = msg::sender();
        let bid_amount = msg::value();
        
        let auction = self.auctions.get(token_id);
        
        if !auction.active {
            return Err("Auction not active".into());
        }
        
        let current_time = U256::from(block::timestamp());
        if current_time > auction.end_time {
            return Err("Auction ended".into());
        }
        
        let min_bid = if auction.highest_bid == U256::ZERO {
            auction.starting_price
        } else {
            auction.highest_bid + (auction.highest_bid / U256::from(20))  // 5% increment
        };
        
        if bid_amount < min_bid {
            return Err("Bid too low".into());
        }
        
        // Refund previous bidder
        if auction.highest_bidder != Address::ZERO {
            // transfer(auction.highest_bidder, auction.highest_bid);
        }
        
        // Update auction
        let mut updated_auction = auction;
        updated_auction.highest_bid = bid_amount;
        updated_auction.highest_bidder = bidder;
        self.auctions.insert(token_id, updated_auction);
        
        evm::log(BidPlaced {
            tokenId: token_id,
            bidder,
            amount: bid_amount,
        });
        
        Ok(())
    }
    
    pub fn finalize_auction(&mut self, nft_contract: Address, token_id: U256) -> Result<(), Vec<u8>> {
        let auction = self.auctions.get(token_id);
        
        if !auction.active {
            return Err("Auction not active".into());
        }
        
        let current_time = U256::from(block::timestamp());
        if current_time <= auction.end_time {
            return Err("Auction still ongoing".into());
        }
        
        // Calculate royalties
        let royalty_info = self.royalties.getter(nft_contract).get(token_id);
        let royalty_amount = (auction.highest_bid * U256::from(royalty_info.royalty_bps)) / U256::from(10000);
        let seller_proceeds = auction.highest_bid - royalty_amount;
        
        // Mark as finalized
        let mut updated_auction = auction;
        updated_auction.active = false;
        self.auctions.insert(token_id, updated_auction);
        
        // Transfer NFT and payments
        // nft_contract.transferFrom(auction.seller, auction.highest_bidder, token_id);
        // transfer(auction.seller, seller_proceeds);
        // transfer(royalty_info.creator, royalty_amount);
        
        evm::log(AuctionFinalized {
            tokenId: token_id,
            winner: auction.highest_bidder,
            finalPrice: auction.highest_bid,
        });
        
        Ok(())
    }
    
    pub fn set_royalty(
        &mut self,
        nft_contract: Address,
        token_id: U256,
        creator: Address,
        royalty_bps: u16
    ) -> Result<(), Vec<u8>> {
        if royalty_bps > 1000 {  // Max 10%
            return Err("Royalty too high".into());
        }
        
        let royalty_info = RoyaltyInfo {
            creator,
            royalty_bps,
        };
        
        self.royalties.setter(nft_contract).insert(token_id, royalty_info);
        Ok(())
    }
}`,
      language: 'rust',
      tip: 'Implement ERC-2981 for standard royalty support across marketplaces!'
    }
  ],
  assignment: {
    id: 10,
    title: 'Build a Complete NFT Marketplace',
    description: 'Create a full-featured NFT marketplace with fixed-price listings, auctions, offers, and royalty support.',
    starterCode: `// TODO: Implement complete NFT marketplace with:
// - ERC-721 NFT contract
// - Fixed-price listings
// - Auction system
// - Offer system
// - Royalty payments
// - Marketplace fees`,
    solution: `// Combine all code from sections 1-4
// Full implementation of NFT + Marketplace + Auctions + Royalties`,
    testCases: [
      { input: 'mint() -> list() -> buy()', expectedOutput: 'Full purchase flow works' },
      { input: 'create_auction() -> bid() -> finalize()', expectedOutput: 'Auction completes with royalty payment' },
      { input: 'Multiple bids on auction', expectedOutput: 'Previous bidders refunded' }
    ]
  }
};
