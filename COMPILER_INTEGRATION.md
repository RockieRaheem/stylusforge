# Stylus Studio - cargo-stylus Integration

## Overview

Stylus Studio now includes **full cargo-stylus integration** for compiling Rust smart contracts to WASM bytecode that can be deployed on Arbitrum Stylus.

### What's New

- ✅ **Real Rust Compilation**: Actual cargo-stylus compilation (no more mocks)
- ✅ **Error Parsing**: User-friendly error messages with line numbers
- ✅ **WASM Optimization**: Release-mode builds with size optimization
- ✅ **ABI Export**: Automatic Solidity-compatible ABI generation
- ✅ **Gas Estimation**: Pre-deployment gas cost calculations
- ✅ **IDE Integration**: Real-time compilation feedback in Problems panel

## Prerequisites

### 1. Install Rust

**Windows:**
```powershell
# Download and install from https://rustup.rs/
# Or via winget:
winget install Rustlang.Rustup

# Restart your terminal, then verify:
rustc --version
cargo --version
```

**macOS/Linux:**
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env

rustc --version
cargo --version
```

### 2. Install WASM Target

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

## Usage in IDE

### Compile a Contract

1. **Open or create a Rust file** (`.rs`) in the IDE
2. **Write your Stylus contract**:
   ```rust
   #![cfg_attr(not(feature = "export-abi"), no_main)]
   extern crate alloc;

   use stylus_sdk::{
       alloy_primitives::U256,
       prelude::*,
   };

   #[storage]
   #[entrypoint]
   pub struct Counter {
       count: StorageU256,
   }

   #[external]
   impl Counter {
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

3. **Click "Compile"** or press **F5**
4. **View results** in the Output panel:
   - Success: Bytecode, WASM size, gas estimate
   - Errors: Detailed compiler errors in Problems panel

### Compilation Output

#### Success Response:
```json
{
  "success": true,
  "bytecode": "0x...", 
  "abi": "[...]",
  "wasmSize": 12345,
  "gasEstimate": "500000",
  "warnings": []
}
```

#### Error Response:
```json
{
  "success": false,
  "errors": [
    "error[E0425]: cannot find value `x` in this scope",
    "  --> src/main.rs:10:5"
  ],
  "warnings": []
}
```

## Architecture

### File Structure

```
stylus_studio/
├── lib/
│   └── compiler/
│       ├── stylus.ts           # Main compiler service
│       └── error-parser.ts     # Error parsing & formatting
├── app/
│   └── api/
│       └── compile/
│           └── route.ts        # Compilation API endpoint
└── CARGO_STYLUS_SETUP.md      # Detailed setup guide
```

### Compilation Flow

1. **User clicks "Compile" in IDE**
   ```
   Frontend → POST /api/compile
   ```

2. **API receives request:**
   ```typescript
   {
     code: string,        // Rust source code
     language: 'rust',
     projectName: string  // Contract name
   }
   ```

3. **StylusCompiler.compile():**
   - Creates temp directory: `os.tmpdir()/stylus-forge/contract-{timestamp}/`
   - Generates `Cargo.toml` with dependencies
   - Writes `src/main.rs` with user code
   - Runs `cargo stylus check` (validation)
   - Runs `cargo stylus build --release` (compilation)
   - Exports ABI with `cargo stylus export-abi`
   - Estimates gas with `cargo stylus estimate-gas`
   - Reads compiled `.wasm` file
   - Cleans up temp directory

4. **Returns result to frontend:**
   - Success: Bytecode + ABI + metadata
   - Failure: Parsed errors with line numbers

### Error Handling

The `CompilerErrorParser` class parses Rust compiler output:

```typescript
// Input (raw rustc output):
error[E0425]: cannot find value `x` in this scope
 --> src/main.rs:10:5
  |
10 |     x + 1
   |     ^ not found in this scope

// Output (structured):
{
  type: 'error',
  code: 'E0425',
  message: 'cannot find value `x` in this scope',
  location: {
    file: 'src/main.rs',
    line: 10,
    column: 5
  },
  snippet: '10 |     x + 1\n   |     ^ not found in this scope',
  suggestion: 'Variable or function not found. Check spelling and imports.'
}
```

Errors are displayed in the IDE's **Problems Panel** with:
- Error type (error/warning)
- Line number
- User-friendly message
- Click to jump to location (planned)

## API Reference

### POST `/api/compile`

Compile Rust code to WASM bytecode.

**Request:**
```json
{
  "code": "// Rust code here",
  "language": "rust",
  "projectName": "my_contract"
}
```

**Response (Success):**
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

**Response (Error):**
```json
{
  "success": false,
  "errors": ["error message 1", "error message 2"],
  "warnings": []
}
```

**Status Codes:**
- `200`: Success
- `400`: Compilation error
- `503`: cargo-stylus not installed

### GET `/api/compile?action=check-installation`

Check if cargo-stylus is installed.

**Response:**
```json
{
  "installed": true,
  "version": "cargo-stylus 0.3.0"
}
```

## Configuration

### Cargo.toml Template

The compiler generates this `Cargo.toml` for each compilation:

```toml
[package]
name = "contract"
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
name = "contract"
path = "src/main.rs"

[profile.release]
codegen-units = 1
strip = true
lto = true
panic = "abort"
opt-level = "z"
```

### Compilation Timeouts

- `cargo stylus check`: **60 seconds**
- `cargo stylus build`: **120 seconds**
- `cargo stylus export-abi`: **30 seconds**
- `cargo stylus estimate-gas`: **30 seconds**

Adjust in `lib/compiler/stylus.ts` if needed.

## Performance Optimization

### Compilation Caching (Planned)

```typescript
// Hash-based caching to avoid recompiling unchanged code
const cache = new Map<string, CompilationResult>();

function getCacheKey(code: string): string {
  return crypto.createHash('sha256').update(code).digest('hex');
}
```

### Parallel Compilation (Planned)

Queue system for handling multiple concurrent compilations.

### Incremental Builds (Planned)

Reuse Cargo build artifacts across compilations.

## Troubleshooting

### cargo-stylus not found

**Error:**
```
cargo-stylus is not installed
Install with: cargo install --force cargo-stylus
```

**Solution:**
```bash
cargo install --force cargo-stylus
```

### WASM target missing

**Error:**
```
error: can't find crate for `std`
```

**Solution:**
```bash
rustup target add wasm32-unknown-unknown
```

### Contract size exceeds limit

**Error:**
```
contract exceeds maximum size of 24KB
```

**Solutions:**
- Enable release optimizations in `Cargo.toml`
- Remove unused dependencies
- Reduce contract complexity
- Split into multiple contracts

### Compilation timeout

**Solutions:**
- Increase timeout in `lib/compiler/stylus.ts`:
  ```typescript
  { cwd: projectDir, timeout: 120000 } // 2 minutes
  ```
- Simplify contract logic
- Use faster hardware

### Permission denied (temp directory)

**Windows:**
```powershell
# Check temp directory permissions
$env:TEMP
icacls $env:TEMP
```

**Linux/macOS:**
```bash
# Check temp directory
echo $TMPDIR
ls -la /tmp
```

## Security Considerations

### Sandboxing

**Current:** Compilation runs on server with full filesystem access.

**Recommendations:**
- Use Docker containers for isolation
- Implement resource limits (CPU, memory, disk)
- Rate limit compilation requests
- Scan uploaded code for malicious patterns

### Resource Limits

**Implemented:**
- Compilation timeouts
- Automatic temp directory cleanup

**Planned:**
- Max project size limit
- Max dependency count limit
- User-based rate limiting

## Testing

### Unit Tests

Test the compiler service:

```typescript
import { StylusCompiler } from '@/lib/compiler/stylus';

test('compiles valid contract', async () => {
  const code = `
    #![cfg_attr(not(feature = "export-abi"), no_main)]
    extern crate alloc;
    use stylus_sdk::prelude::*;
    
    #[storage]
    #[entrypoint]
    pub struct Counter {
        count: StorageU256,
    }
  `;

  const result = await StylusCompiler.compile(code);
  expect(result.success).toBe(true);
  expect(result.bytecode).toMatch(/^0x[0-9a-f]+$/);
});
```

### Integration Tests

Test the API endpoint:

```typescript
test('POST /api/compile', async () => {
  const response = await fetch('http://localhost:3000/api/compile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      code: validRustCode,
      language: 'rust',
      projectName: 'test',
    }),
  });

  const result = await response.json();
  expect(result.success).toBe(true);
});
```

## Future Enhancements

### Planned Features

1. **✨ Syntax Highlighting**: Real-time error highlighting in editor
2. **🔄 Auto-compilation**: Compile on save
3. **📦 Dependency Management**: UI for adding Cargo dependencies
4. **🎯 Breakpoints**: Debug support for compiled WASM
5. **📊 Gas Profiling**: Per-function gas usage analysis
6. **🔗 Direct Deployment**: Deploy from IDE to Arbitrum
7. **🧪 Unit Test Runner**: Run Rust tests in IDE
8. **📝 Code Templates**: Pre-built contract templates
9. **🔍 Type Hints**: Hover information for Stylus SDK types
10. **⚡ Hot Reload**: Instant preview of contract changes

### WebSocket Integration (Next)

Real-time compilation feedback:
```typescript
// Client subscribes to compilation updates
ws.send(JSON.stringify({
  type: 'compile',
  code: rustCode,
}));

// Server streams progress
ws.send(JSON.stringify({
  type: 'progress',
  stage: 'checking',
}));

ws.send(JSON.stringify({
  type: 'progress',
  stage: 'building',
}));

ws.send(JSON.stringify({
  type: 'complete',
  result: { bytecode, abi },
}));
```

## Resources

- [Stylus Documentation](https://docs.arbitrum.io/stylus/stylus-gentle-introduction)
- [cargo-stylus GitHub](https://github.com/OffchainLabs/cargo-stylus)
- [Stylus SDK Rust Docs](https://docs.rs/stylus-sdk/latest/stylus_sdk/)
- [Example Contracts](https://github.com/OffchainLabs/stylus-workshop-rust)

## Support

For issues:
1. Check `CARGO_STYLUS_SETUP.md` for installation help
2. Verify cargo-stylus installation: `cargo stylus --version`
3. Check IDE Output panel for detailed error logs
4. Review Problems panel for compilation errors

## Changelog

### v1.0.0 (Current)
- ✅ Initial cargo-stylus integration
- ✅ Real Rust to WASM compilation
- ✅ Error parsing and display
- ✅ ABI export
- ✅ Gas estimation
- ✅ IDE integration with Problems panel

### v1.1.0 (Planned)
- 🔄 Compilation caching
- 🔄 WebSocket for real-time updates
- 🔄 Syntax validation on-the-fly
- 🔄 Direct deployment to Arbitrum
