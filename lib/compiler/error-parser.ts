/**
 * Parse cargo/rustc error output into structured format
 */
export interface ParsedError {
  type: 'error' | 'warning' | 'note' | 'help';
  code?: string; // e.g., "E0425"
  message: string;
  location?: {
    file: string;
    line: number;
    column: number;
  };
  snippet?: string;
  suggestion?: string;
}

export class CompilerErrorParser {
  /**
   * Parse Rust compiler output
   * 
   * Example input:
   *   error[E0425]: cannot find value `x` in this scope
   *    --> src/main.rs:10:5
   *     |
   *  10 |     x + 1
   *     |     ^ not found in this scope
   */
  static parseRustErrors(output: string): ParsedError[] {
    const errors: ParsedError[] = [];
    const lines = output.split('\n');
    
    let currentError: Partial<ParsedError> | null = null;
    let snippetLines: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Match error/warning header
      const headerMatch = line.match(/^(error|warning|note|help)(\[([^\]]+)\])?: (.+)$/);
      if (headerMatch) {
        // Save previous error if exists
        if (currentError) {
          if (snippetLines.length > 0) {
            currentError.snippet = snippetLines.join('\n');
          }
          errors.push(currentError as ParsedError);
          snippetLines = [];
        }

        const [, type, , code, message] = headerMatch;
        currentError = {
          type: type as 'error' | 'warning' | 'note' | 'help',
          code,
          message: message.trim(),
        };
        continue;
      }

      // Match location
      const locationMatch = line.match(/^\s*--> ([^:]+):(\d+):(\d+)/);
      if (locationMatch && currentError) {
        const [, file, lineNum, column] = locationMatch;
        currentError.location = {
          file: file.trim(),
          line: parseInt(lineNum, 10),
          column: parseInt(column, 10),
        };
        continue;
      }

      // Match help/suggestion
      const helpMatch = line.match(/^\s*help: (.+)$/);
      if (helpMatch && currentError) {
        currentError.suggestion = helpMatch[1].trim();
        continue;
      }

      // Collect snippet lines
      if (currentError && (line.startsWith('   |') || line.match(/^\s+\d+\s+\|/))) {
        snippetLines.push(line);
      }
    }

    // Save last error
    if (currentError) {
      if (snippetLines.length > 0) {
        currentError.snippet = snippetLines.join('\n');
      }
      errors.push(currentError as ParsedError);
    }

    return errors;
  }

  /**
   * Parse cargo-stylus specific errors
   */
  static parseStylusErrors(output: string): ParsedError[] {
    const errors: ParsedError[] = [];
    const lines = output.split('\n');

    for (const line of lines) {
      // Contract size error
      if (line.includes('contract exceeds maximum size')) {
        const match = line.match(/(\d+)\s*KB/);
        const size = match ? match[1] : 'unknown';
        errors.push({
          type: 'error',
          message: `Contract size (${size}KB) exceeds maximum allowed size (24KB)`,
          suggestion: 'Enable release optimizations or reduce contract complexity',
        });
      }

      // Gas limit error
      if (line.includes('exceeds gas limit')) {
        errors.push({
          type: 'error',
          message: 'Contract initialization exceeds gas limit',
          suggestion: 'Reduce initialization complexity or storage operations',
        });
      }

      // Storage layout error
      if (line.includes('invalid storage layout')) {
        errors.push({
          type: 'error',
          message: 'Invalid storage layout detected',
          suggestion: 'Ensure #[storage] struct follows Stylus SDK patterns',
        });
      }

      // Missing entrypoint
      if (line.includes('no entrypoint')) {
        errors.push({
          type: 'error',
          message: 'Contract must have an #[entrypoint] attribute',
          suggestion: 'Add #[entrypoint] to your main storage struct',
        });
      }
    }

    return errors;
  }

  /**
   * Format errors for display in IDE
   */
  static formatForIDE(errors: ParsedError[]): string {
    return errors
      .map((err) => {
        let formatted = `${err.type.toUpperCase()}`;
        if (err.code) {
          formatted += `[${err.code}]`;
        }
        formatted += `: ${err.message}`;

        if (err.location) {
          formatted += `\n  at ${err.location.file}:${err.location.line}:${err.location.column}`;
        }

        if (err.snippet) {
          formatted += `\n${err.snippet}`;
        }

        if (err.suggestion) {
          formatted += `\n  help: ${err.suggestion}`;
        }

        return formatted;
      })
      .join('\n\n');
  }

  /**
   * Get user-friendly error message
   */
  static getUserFriendlyMessage(error: string): string {
    const friendlyMessages: Record<string, string> = {
      'E0425': 'Variable or function not found. Check spelling and imports.',
      'E0277': 'Type does not implement required trait. Check trait bounds.',
      'E0308': 'Type mismatch. Check that types match in assignment or function call.',
      'E0433': 'Module or crate not found. Check Cargo.toml dependencies.',
      'E0599': 'Method not found. Check that type implements the method.',
      'E0382': 'Use of moved value. Value was moved and can no longer be used.',
      'E0502': 'Cannot borrow as mutable while also borrowed as immutable.',
      'E0597': 'Borrowed value does not live long enough.',
    };

    // Extract error code
    const codeMatch = error.match(/E\d{4}/);
    if (codeMatch && friendlyMessages[codeMatch[0]]) {
      return friendlyMessages[codeMatch[0]];
    }

    // Check for common patterns
    if (error.includes('cannot find')) {
      return 'Item not found. Check imports and spelling.';
    }
    if (error.includes('mismatched types')) {
      return 'Type mismatch. Ensure types are compatible.';
    }
    if (error.includes('borrow')) {
      return 'Borrowing error. Check ownership and lifetimes.';
    }
    if (error.includes('trait')) {
      return 'Trait requirement not satisfied. Implement required trait.';
    }

    return error;
  }

  /**
   * Convert Monaco editor position to Rust compiler position
   */
  static monacoToRustPosition(position: { line: number; column: number }): { line: number; column: number } {
    // Monaco is 1-indexed for lines, 0-indexed for columns
    // Rust compiler is 1-indexed for both
    return {
      line: position.line,
      column: position.column + 1,
    };
  }

  /**
   * Convert Rust compiler position to Monaco editor position
   */
  static rustToMonacoPosition(position: { line: number; column: number }): { line: number; column: number } {
    return {
      line: position.line,
      column: position.column - 1,
    };
  }
}

/**
 * Error categorization for analytics
 */
export function categorizeError(error: ParsedError): string {
  if (error.code) {
    const codeNum = parseInt(error.code.replace('E', ''), 10);
    
    if (codeNum >= 400 && codeNum < 500) return 'name-resolution';
    if (codeNum >= 200 && codeNum < 300) return 'type-error';
    if (codeNum >= 500 && codeNum < 600) return 'borrow-checker';
    if (codeNum >= 700 && codeNum < 800) return 'trait-error';
  }

  if (error.message.includes('contract exceeds')) return 'size-limit';
  if (error.message.includes('gas limit')) return 'gas-limit';
  if (error.message.includes('storage')) return 'storage-error';

  return 'other';
}
