import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

const execAsync = promisify(exec);

export interface CompilationResult {
  success: boolean;
  bytecode?: string;
  abi?: string;
  wasmSize?: number;
  errors?: string[];
  warnings?: string[];
  gasEstimate?: string;
}

export class StylusCompiler {
  private static readonly TEMP_DIR = path.join(os.tmpdir(), 'stylus-forge');

  /**
   * Compile Rust code to WASM using cargo-stylus
   */
  static async compile(code: string, projectName: string = 'contract'): Promise<CompilationResult> {
    try {
      // Create temporary project directory
      const projectDir = path.join(this.TEMP_DIR, `${projectName}-${Date.now()}`);
      await fs.mkdir(projectDir, { recursive: true });

      // Create Cargo.toml
      const cargoToml = `[package]
name = "${projectName}"
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
name = "${projectName}"
path = "src/main.rs"

[profile.release]
codegen-units = 1
strip = true
lto = true
panic = "abort"
opt-level = "z"
`;

      await fs.writeFile(path.join(projectDir, 'Cargo.toml'), cargoToml);

      // Create src directory and main.rs
      const srcDir = path.join(projectDir, 'src');
      await fs.mkdir(srcDir, { recursive: true });
      await fs.writeFile(path.join(srcDir, 'main.rs'), code);

      // Check cargo-stylus is installed
      try {
        await execAsync('cargo stylus --version');
      } catch {
        return {
          success: false,
          errors: ['cargo-stylus is not installed. Install with: cargo install --force cargo-stylus'],
        };
      }

      // Compile with cargo-stylus
      const { stdout, stderr } = await execAsync(
        'cargo stylus check',
        { cwd: projectDir, timeout: 60000 } // 60 second timeout
      );

      // Parse output for errors/warnings
      const errors: string[] = [];
      const warnings: string[] = [];

      if (stderr) {
        const lines = stderr.split('\n');
        for (const line of lines) {
          if (line.includes('error:') || line.includes('error[')) {
            errors.push(line.trim());
          } else if (line.includes('warning:') || line.includes('warning[')) {
            warnings.push(line.trim());
          }
        }
      }

      if (errors.length > 0) {
        // Clean up
        await fs.rm(projectDir, { recursive: true, force: true });
        return {
          success: false,
          errors,
          warnings,
        };
      }

      // Build optimized WASM
      const { stdout: buildOutput } = await execAsync(
        'cargo stylus build --release',
        { cwd: projectDir, timeout: 120000 } // 2 minute timeout
      );

      // Read the compiled WASM
      const wasmPath = path.join(projectDir, 'target', 'wasm32-unknown-unknown', 'release', `${projectName}.wasm`);
      const wasmBuffer = await fs.readFile(wasmPath);
      const bytecode = `0x${wasmBuffer.toString('hex')}`;

      // Export ABI
      let abi: string | undefined;
      try {
        const { stdout: abiOutput } = await execAsync(
          'cargo stylus export-abi',
          { cwd: projectDir, timeout: 30000 }
        );
        abi = abiOutput.trim();
      } catch (abiError) {
        warnings.push('Failed to export ABI');
      }

      // Estimate deployment gas
      let gasEstimate: string | undefined;
      try {
        const { stdout: gasOutput } = await execAsync(
          'cargo stylus estimate-gas',
          { cwd: projectDir, timeout: 30000 }
        );
        const match = gasOutput.match(/(\d+)\s+gas/);
        if (match) {
          gasEstimate = match[1];
        }
      } catch {
        // Gas estimation is optional
      }

      // Clean up
      await fs.rm(projectDir, { recursive: true, force: true });

      return {
        success: true,
        bytecode,
        abi,
        wasmSize: wasmBuffer.length,
        warnings: warnings.length > 0 ? warnings : undefined,
        gasEstimate,
      };

    } catch (error: any) {
      return {
        success: false,
        errors: [error.message || 'Compilation failed'],
      };
    }
  }

  /**
   * Validate Rust syntax without full compilation
   */
  static async validateSyntax(code: string): Promise<{ valid: boolean; errors?: string[] }> {
    try {
      const projectDir = path.join(this.TEMP_DIR, `validate-${Date.now()}`);
      await fs.mkdir(projectDir, { recursive: true });

      const cargoToml = `[package]
name = "validator"
version = "0.1.0"
edition = "2021"

[dependencies]
stylus-sdk = "0.6.0"
alloy-primitives = "0.7.6"
`;

      await fs.writeFile(path.join(projectDir, 'Cargo.toml'), cargoToml);
      
      const srcDir = path.join(projectDir, 'src');
      await fs.mkdir(srcDir, { recursive: true });
      await fs.writeFile(path.join(srcDir, 'main.rs'), code);

      // Run cargo check (syntax validation only)
      const { stderr } = await execAsync(
        'cargo check',
        { cwd: projectDir, timeout: 30000 }
      );

      await fs.rm(projectDir, { recursive: true, force: true });

      if (stderr && (stderr.includes('error:') || stderr.includes('error['))) {
        const errors = stderr
          .split('\n')
          .filter(line => line.includes('error:') || line.includes('error['))
          .map(line => line.trim());

        return { valid: false, errors };
      }

      return { valid: true };

    } catch (error: any) {
      return {
        valid: false,
        errors: [error.message || 'Syntax validation failed'],
      };
    }
  }

  /**
   * Check if cargo-stylus is installed
   */
  static async isInstalled(): Promise<boolean> {
    try {
      await execAsync('cargo stylus --version');
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get cargo-stylus version
   */
  static async getVersion(): Promise<string | null> {
    try {
      const { stdout } = await execAsync('cargo stylus --version');
      return stdout.trim();
    } catch {
      return null;
    }
  }
}
