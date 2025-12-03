#!/usr/bin/env node

/**
 * Verification script for cargo-stylus setup
 * Run with: node scripts/verify-cargo-stylus.js
 */

const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function success(message) {
  log(`✓ ${message}`, colors.green);
}

function error(message) {
  log(`✗ ${message}`, colors.red);
}

function warning(message) {
  log(`⚠ ${message}`, colors.yellow);
}

function info(message) {
  log(`ℹ ${message}`, colors.blue);
}

async function checkCommand(command, name, installInstructions) {
  try {
    const { stdout } = await execAsync(`${command} --version`);
    const version = stdout.trim();
    success(`${name} is installed: ${version}`);
    return true;
  } catch {
    error(`${name} is not installed`);
    if (installInstructions) {
      info(`Install with: ${installInstructions}`);
    }
    return false;
  }
}

async function checkTarget() {
  try {
    const { stdout } = await execAsync('rustup target list --installed');
    if (stdout.includes('wasm32-unknown-unknown')) {
      success('WASM target (wasm32-unknown-unknown) is installed');
      return true;
    } else {
      error('WASM target (wasm32-unknown-unknown) is not installed');
      info('Install with: rustup target add wasm32-unknown-unknown');
      return false;
    }
  } catch {
    error('Failed to check rustup targets');
    return false;
  }
}

async function testCompilation() {
  const testContract = `#![cfg_attr(not(feature = "export-abi"), no_main)]
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
    pub fn get_count(&self) -> Result<U256, Vec<u8>> {
        Ok(self.count.get())
    }
}`;

  try {
    info('Testing compilation with sample contract...');
    
    const response = await fetch('http://localhost:3000/api/compile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: testContract,
        language: 'rust',
        projectName: 'test_contract',
      }),
    });

    const result = await response.json();

    if (result.success) {
      success('Compilation test passed!');
      info(`  - Bytecode length: ${result.bytecode?.length || 0} chars`);
      info(`  - WASM size: ${result.wasmSize || 0} bytes`);
      if (result.gasEstimate) {
        info(`  - Gas estimate: ${result.gasEstimate}`);
      }
      return true;
    } else {
      error('Compilation test failed');
      if (result.errors) {
        result.errors.forEach(err => {
          console.log(`     ${err}`);
        });
      }
      return false;
    }
  } catch (err) {
    error('Failed to test compilation');
    warning('Make sure Next.js dev server is running: npm run dev');
    return false;
  }
}

async function checkAPI() {
  try {
    const response = await fetch('http://localhost:3000/api/compile?action=check-installation');
    const result = await response.json();

    if (result.installed) {
      success(`cargo-stylus detected by API: ${result.version}`);
      return true;
    } else {
      error('cargo-stylus not detected by API');
      return false;
    }
  } catch {
    warning('Could not reach API endpoint (server may not be running)');
    info('Start the dev server with: npm run dev');
    return null;
  }
}

async function main() {
  log('\n' + '='.repeat(60), colors.bright);
  log('  Stylus Studio - cargo-stylus Verification', colors.bright);
  log('='.repeat(60) + '\n', colors.bright);

  let allGood = true;

  // Check Rust
  log('Checking Rust installation...', colors.bright);
  const hasRust = await checkCommand('rustc', 'rustc', 'https://rustup.rs/');
  const hasCargo = await checkCommand('cargo', 'cargo', 'https://rustup.rs/');
  allGood = allGood && hasRust && hasCargo;
  console.log('');

  // Check WASM target
  if (hasRust && hasCargo) {
    log('Checking Rust targets...', colors.bright);
    const hasWasm = await checkTarget();
    allGood = allGood && hasWasm;
    console.log('');
  }

  // Check cargo-stylus
  log('Checking cargo-stylus...', colors.bright);
  const hasCargoStylus = await checkCommand(
    'cargo stylus',
    'cargo-stylus',
    'cargo install --force cargo-stylus'
  );
  allGood = allGood && hasCargoStylus;
  console.log('');

  // Check API
  log('Checking API integration...', colors.bright);
  const apiStatus = await checkAPI();
  if (apiStatus !== null) {
    allGood = allGood && apiStatus;
  }
  console.log('');

  // Test compilation
  if (apiStatus === true) {
    log('Testing compilation...', colors.bright);
    const compileStatus = await testCompilation();
    allGood = allGood && compileStatus;
    console.log('');
  }

  // Summary
  log('='.repeat(60), colors.bright);
  if (allGood) {
    success('All checks passed! ✓');
    log('You\'re ready to compile Stylus contracts!', colors.green);
  } else {
    error('Some checks failed. See above for details.');
    log('\nQuick fix commands:', colors.yellow);
    log('  1. Install Rust: https://rustup.rs/', colors.yellow);
    log('  2. rustup target add wasm32-unknown-unknown', colors.yellow);
    log('  3. cargo install --force cargo-stylus', colors.yellow);
    log('  4. npm run dev (start Next.js server)', colors.yellow);
  }
  log('='.repeat(60) + '\n', colors.bright);

  process.exit(allGood ? 0 : 1);
}

main().catch(err => {
  error('Verification script failed: ' + err.message);
  process.exit(1);
});
