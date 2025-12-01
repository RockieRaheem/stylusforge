// Sample Stylus contract templates

export const DEFAULT_CONTRACT = `#![cfg_attr(not(feature = "export-abi"), no_main)]
extern crate alloc;

use stylus_sdk::{alloy_primitives::U256, prelude::*, storage::{StorageU256}};

#[storage]
#[entrypoint]
pub struct Counter {
    count: StorageU256,
}

#[external]
impl Counter {
    pub fn increment(&mut self) -> Result<(), Vec<u8>> {
        let count = self.count.get() + U256::from(1);
        self.count.set(count);
        Ok(())
    }

    pub fn decrement(&mut self) -> Result<(), Vec<u8>> {
        let count = self.count.get();
        if count > U256::from(0) {
            self.count.set(count - U256::from(1));
            Ok(())
        } else {
            Err(b"Counter cannot be negative".to_vec())
        }
    }

    pub fn get(&self) -> Result<U256, Vec<u8>> {
        Ok(self.count.get())
    }

    pub fn set(&mut self, value: U256) -> Result<(), Vec<u8>> {
        self.count.set(value);
        Ok(())
    }
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
name = "stylus-project"
version = "0.1.0"
edition = "2021"

[dependencies]
stylus-sdk = "0.6.0"
alloy-primitives = "0.7.7"
alloy-sol-types = "0.7.7"
mini-alloc = "0.4.2"

[features]
export-abi = ["stylus-sdk/export-abi"]

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
