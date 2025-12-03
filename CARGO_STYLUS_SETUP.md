# Cargo Stylus Setup Guide

Complete guide for setting up cargo-stylus for Rust → WASM compilation in Stylus Studio.

## Prerequisites

### 1. Rust Installation

**Windows:**
```powershell
# Download and run rustup-init.exe from https://rustup.rs/
# Or via winget:
winget install Rustlang.Rustup

# Verify installation
rustc --version
cargo --version
```

**macOS/Linux:**
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env

# Verify installation
rustc --version
cargo --version
```

### 2. Add WASM Target

```bash
rustup target add wasm32-unknown-unknown
```

### 3. Install cargo-stylus

```bash
cargo install --force cargo-stylus
```

Verify installation:
```bash
cargo stylus --version
```

Expected output: `cargo-stylus 0.x.x`

## cargo-stylus Commands

### Check Contract
Validates Stylus contract without building:
```bash
cargo stylus check
```

This verifies:
- Rust syntax is valid
- Dependencies are correctly specified
- Contract follows Stylus SDK patterns
- Gas limits won't be exceeded

### Build Contract
Compiles Rust to optimized WASM:
```bash
cargo stylus build --release
```

Output: `target/wasm32-unknown-unknown/release/[contract_name].wasm`

### Export ABI
Generates Solidity-compatible ABI:
```bash
cargo stylus export-abi
```

Requires the contract to use `#[external]` macros from stylus-sdk.

### Estimate Gas
Estimates deployment gas cost:
```bash
cargo stylus estimate-gas
```

Returns gas estimate for deploying the WASM contract.

### Deploy Contract
Deploy directly to Arbitrum (requires private key):
```bash
cargo stylus deploy \
  --private-key="your_private_key" \
  --endpoint="https://sepolia-rollup.arbitrum.io/rpc"
```

### Verify Contract
Verify a deployed contract:
```bash
cargo stylus verify \
  --deployment-tx="0x..." \
  --endpoint="https://sepolia-rollup.arbitrum.io/rpc"
```

## Project Structure

### Cargo.toml Template
```toml
[package]
name = "my-contract"
version = "0.1.0"
edition = "2021"

[dependencies]
alloy-primitives = "0.7.6"
alloy-sol-types = "0.7.6"
stylus-sdk = "0.6.0"
hex = "0.4.3"

[dev-dependencies]
tokio = { version = "1.12.0", features = ["full"] }
ethers = "2.0.0"

[features]
export-abi = ["stylus-sdk/export-abi"]

[[bin]]
name = "my-contract"
path = "src/main.rs"

[profile.release]
codegen-units = 1        # Optimize for size
strip = true             # Remove debug symbols
lto = true               # Link-time optimization
panic = "abort"          # Smaller panic handler
opt-level = "z"          # Optimize for size
```

### Basic Contract Template
```rust
#![cfg_attr(not(feature = "export-abi"), no_main)]
extern crate alloc;

use stylus_sdk::{
    alloy_primitives::{Address, U256},
    prelude::*,
};

#[storage]
#[entrypoint]
pub struct Counter {
    count: StorageU256,
    owner: StorageAddress,
}

#[external]
impl Counter {
    pub fn initialize(&mut self, owner: Address) -> Result<(), Vec<u8>> {
        self.owner.set(owner);
        Ok(())
    }

    pub fn increment(&mut self) -> Result<(), Vec<u8>> {
        let count = self.count.get();
        self.count.set(count + U256::from(1));
        Ok(())
    }

    pub fn get_count(&self) -> Result<U256, Vec<u8>> {
        Ok(self.count.get())
    }
}
```

## Integration with Stylus Studio

### API Flow

1. **User writes Rust code in IDE**
2. **User clicks "Compile"**
3. **Frontend sends POST to `/api/compile`**
   ```typescript
   const response = await fetch('/api/compile', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({
       code: rustCode,
       language: 'rust',
       projectName: 'my-contract',
     }),
   });
   ```

4. **Backend (`lib/compiler/stylus.ts`):**
   - Creates temporary project directory
   - Generates `Cargo.toml` and `src/main.rs`
   - Runs `cargo stylus check`
   - Runs `cargo stylus build --release`
   - Reads compiled WASM bytecode
   - Exports ABI
   - Cleans up temp files

5. **Backend returns:**
   ```json
   {
     "success": true,
     "bytecode": "0x...",
     "abi": "[...]",
     "wasmSize": 12345,
     "warnings": [],
     "gasEstimate": "500000"
   }
   ```

### Error Handling

Common compilation errors:

**1. cargo-stylus not installed:**
```json
{
  "success": false,
  "error": "cargo-stylus is not installed",
  "instructions": "Install with: cargo install --force cargo-stylus"
}
```

**2. Syntax errors:**
```json
{
  "success": false,
  "errors": [
    "error[E0425]: cannot find value `x` in this scope",
    "  --> src/main.rs:10:5"
  ]
}
```

**3. Stylus SDK violations:**
```json
{
  "success": false,
  "errors": [
    "error: contract exceeds maximum size of 24KB",
    "error: storage layout is invalid"
  ]
}
```

## Performance Optimization

### Compilation Caching
The compiler service creates temp directories in `os.tmpdir()/stylus-forge/`.

Consider implementing:
- **Hash-based caching**: Cache compiled WASM by code hash
- **Incremental builds**: Reuse compilation artifacts
- **Build queue**: Handle concurrent compilations

Example cache implementation:
```typescript
import crypto from 'crypto';

const cache = new Map<string, CompilationResult>();

function getCacheKey(code: string): string {
  return crypto.createHash('sha256').update(code).digest('hex');
}

export async function compileWithCache(code: string): Promise<CompilationResult> {
  const key = getCacheKey(code);
  
  if (cache.has(key)) {
    return cache.get(key)!;
  }
  
  const result = await StylusCompiler.compile(code);
  cache.set(key, result);
  
  return result;
}
```

### Build Timeouts
Current timeouts:
- `cargo stylus check`: 60 seconds
- `cargo stylus build`: 120 seconds
- `cargo stylus export-abi`: 30 seconds

Adjust based on contract complexity.

## Troubleshooting

### Issue: "cargo-stylus: command not found"

**Solution:**
```bash
# Add cargo bin to PATH
export PATH="$HOME/.cargo/bin:$PATH"

# Or reinstall
cargo install --force cargo-stylus
```

### Issue: "failed to compile WASM"

**Check:**
1. Rust version (requires 1.70+)
2. WASM target installed: `rustup target add wasm32-unknown-unknown`
3. Dependencies in Cargo.toml match stylus-sdk versions

### Issue: "contract exceeds size limit"

**Solutions:**
- Enable release optimizations in `Cargo.toml`
- Remove unused dependencies
- Split large contracts into libraries
- Use `#[inline]` attributes strategically

### Issue: Compilation timeout

**Solutions:**
- Increase timeout in `lib/compiler/stylus.ts`
- Optimize contract complexity
- Use faster hardware/CI runners

## Testing Compiled Contracts

### Unit Tests
```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_increment() {
        let mut counter = Counter::default();
        counter.increment().unwrap();
        assert_eq!(counter.get_count().unwrap(), U256::from(1));
    }
}
```

Run tests:
```bash
cargo test
```

### Integration Tests
Use `ethers-rs` or `alloy` to test deployed contracts:

```rust
#[tokio::test]
async fn test_deployed_contract() {
    let provider = Provider::try_from("http://localhost:8547")?;
    let contract = Counter::new(address, Arc::new(provider));
    
    let tx = contract.increment().send().await?;
    tx.await?;
    
    let count = contract.get_count().call().await?;
    assert_eq!(count, U256::from(1));
}
```

## Security Considerations

### Private Key Management
**Never** include private keys in code or version control.

Use environment variables:
```bash
export PRIVATE_KEY="0x..."
export RPC_URL="https://sepolia-rollup.arbitrum.io/rpc"
```

### Gas Limits
Stylus contracts have gas limits:
- Max contract size: **24KB WASM**
- Max init gas: **32M gas**
- Max execution gas: **block gas limit**

Test gas usage before deploying:
```bash
cargo stylus estimate-gas
```

### Audit Dependencies
Check `Cargo.toml` dependencies for:
- Known vulnerabilities: `cargo audit`
- License compatibility
- Supply chain security

## Production Deployment

### 1. Compile with Optimizations
```bash
cargo stylus build --release
```

### 2. Verify Contract Size
```bash
ls -lh target/wasm32-unknown-unknown/release/*.wasm
```

Should be < 24KB.

### 3. Estimate Gas
```bash
cargo stylus estimate-gas --endpoint="https://arb1.arbitrum.io/rpc"
```

### 4. Deploy to Testnet First
```bash
cargo stylus deploy \
  --private-key-path=".private-key" \
  --endpoint="https://sepolia-rollup.arbitrum.io/rpc"
```

### 5. Test on Testnet
Run full integration test suite against deployed contract.

### 6. Deploy to Mainnet
```bash
cargo stylus deploy \
  --private-key-path=".private-key" \
  --endpoint="https://arb1.arbitrum.io/rpc"
```

### 7. Verify Contract
```bash
cargo stylus verify \
  --deployment-tx="0x..." \
  --endpoint="https://arb1.arbitrum.io/rpc"
```

## Resources

- [Stylus Documentation](https://docs.arbitrum.io/stylus/stylus-gentle-introduction)
- [cargo-stylus GitHub](https://github.com/OffchainLabs/cargo-stylus)
- [Stylus SDK](https://github.com/OffchainLabs/stylus-sdk-rs)
- [Example Contracts](https://github.com/OffchainLabs/stylus-workshop-rust)
- [Arbitrum Discord](https://discord.gg/arbitrum)

## Next Steps

1. ✅ Install cargo-stylus
2. ✅ Verify installation: `cargo stylus --version`
3. ✅ Test compilation with sample contract
4. 🔄 Integrate with IDE frontend
5. 🔄 Add real-time error highlighting
6. 🔄 Implement WebSocket for live compilation feedback
7. 🔄 Add deployment UI for one-click deploys
