// Sample Stylus contract templates

// NOTE: This default template uses standard Rust for browser-based compilation.
// The Rust Playground doesn't support stylus_sdk, so we use a simplified version.
// When deploying actual Stylus contracts, replace with proper stylus_sdk code.

export const DEFAULT_CONTRACT = `// Simple Counter Example (Standard Rust)
// This compiles in the browser for syntax validation.
// For actual Stylus deployment, use stylus_sdk with proper storage types.

pub struct Counter {
    count: u64,
}

impl Counter {
    pub fn new() -> Self {
        Counter { count: 0 }
    }

    pub fn increment(&mut self) {
        self.count = self.count.saturating_add(1);
    }

    pub fn decrement(&mut self) -> Result<(), String> {
        if self.count > 0 {
            self.count -= 1;
            Ok(())
        } else {
            Err("Counter cannot be negative".to_string())
        }
    }

    pub fn get(&self) -> u64 {
        self.count
    }

    pub fn set(&mut self, value: u64) {
        self.count = value;
    }
}

fn main() {
    let mut counter = Counter::new();
    counter.increment();
    println!("Count: {}", counter.get());
}`;

export const ERC20_CONTRACT = `#![cfg_attr(not(feature = "export-abi"), no_main)]
extern crate alloc;

use stylus_sdk::{
    alloy_primitives::{Address, U256},
    prelude::*,
    storage::{StorageMap, StorageU256},
};

#[storage]
#[entrypoint]
pub struct ERC20Token {
    balances: StorageMap<Address, StorageU256>,
    allowances: StorageMap<Address, StorageMap<Address, StorageU256>>,
    total_supply: StorageU256,
}

#[external]
impl ERC20Token {
    pub fn balance_of(&self, owner: Address) -> Result<U256, Vec<u8>> {
        Ok(self.balances.get(owner))
    }

    pub fn transfer(&mut self, to: Address, amount: U256) -> Result<bool, Vec<u8>> {
        let sender = msg::sender();
        let sender_balance = self.balances.get(sender);
        
        if sender_balance < amount {
            return Err(b"Insufficient balance".to_vec());
        }

        self.balances.setter(sender).sub(amount);
        self.balances.setter(to).add(amount);
        
        Ok(true)
    }

    pub fn approve(&mut self, spender: Address, amount: U256) -> Result<bool, Vec<u8>> {
        let owner = msg::sender();
        self.allowances.setter(owner).setter(spender).set(amount);
        Ok(true)
    }

    pub fn transfer_from(
        &mut self,
        from: Address,
        to: Address,
        amount: U256,
    ) -> Result<bool, Vec<u8>> {
        let spender = msg::sender();
        let allowance = self.allowances.getter(from).get(spender);
        
        if allowance < amount {
            return Err(b"Insufficient allowance".to_vec());
        }

        let from_balance = self.balances.get(from);
        if from_balance < amount {
            return Err(b"Insufficient balance".to_vec());
        }

        self.allowances.setter(from).setter(spender).sub(amount);
        self.balances.setter(from).sub(amount);
        self.balances.setter(to).add(amount);
        
        Ok(true)
    }

    pub fn total_supply(&self) -> Result<U256, Vec<u8>> {
        Ok(self.total_supply.get())
    }
}`;

export const CARGO_TOML = `[package]
name = "stylus-contract"
version = "0.1.0"
edition = "2021"

[dependencies]
stylus-sdk = "0.5.1"
alloy-primitives = "0.7.6"
alloy-sol-types = "0.7.6"
hex = "0.4.3"

[dev-dependencies]
tokio = { version = "1.12.0", features = ["full"] }
ethers = "2.0.0"

[features]
export-abi = ["stylus-sdk/export-abi"]

[[bin]]
name = "stylus-contract"
path = "src/main.rs"

[profile.release]
codegen-units = 1
strip = true
lto = true
panic = "abort"
opt-level = "z"

[lib]
crate-type = ["lib", "cdylib"]`;

export const README_MD = `# Stylus Smart Contract

This is a Rust-based smart contract written for Arbitrum Stylus.

## Features

- Written in Rust for better performance and safety
- Compiled to WebAssembly (WASM)
- Deployed on Arbitrum network
- Gas-efficient execution

## Building

\`\`\`bash
cargo build --release
\`\`\`

## Testing

\`\`\`bash
cargo test
\`\`\`

## Deployment

Use the Stylus CLI or IDE deploy button to deploy your contract.

## Learn More

- [Arbitrum Stylus Documentation](https://docs.arbitrum.io/stylus/overview)
- [Stylus SDK](https://github.com/OffchainLabs/stylus-sdk-rs)
`;

export interface FileTemplate {
  name: string;
  language: string;
  content: string;
}

export const TEMPLATES: Record<string, FileTemplate> = {
  counter: {
    name: 'Counter Contract',
    language: 'rust',
    content: DEFAULT_CONTRACT,
  },
  erc20: {
    name: 'ERC-20 Token',
    language: 'rust',
    content: ERC20_CONTRACT,
  },
};
