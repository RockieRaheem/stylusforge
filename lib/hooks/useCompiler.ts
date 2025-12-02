'use client';

import { useState, useEffect } from 'react';

interface CompilationResult {
  success: boolean;
  bytecode?: string;
  wasmSize?: number;
  errors?: string[];
  warnings?: string[];
  gasEstimate?: string;
}

export function useCompiler() {
  const [isCompiling, setIsCompiling] = useState(false);
  const [compilationResult, setCompilationResult] = useState<CompilationResult | null>(null);
  const [lastCompiled, setLastCompiled] = useState<Date | null>(null);

  const compile = async (code: string): Promise<CompilationResult> => {
    setIsCompiling(true);
    setCompilationResult(null);

    try {
      const response = await fetch('/api/compile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();

      if (!response.ok) {
        const result: CompilationResult = {
          success: false,
          errors: [data.details || data.error || 'Compilation failed'],
        };
        setCompilationResult(result);
        return result;
      }

      const result: CompilationResult = {
        success: true,
        bytecode: data.bytecode,
        wasmSize: data.wasmSize,
      };

      setCompilationResult(result);
      setLastCompiled(new Date());

      return result;
    } catch (error) {
      const result: CompilationResult = {
        success: false,
        errors: [error instanceof Error ? error.message : 'Compilation failed'],
      };
      setCompilationResult(result);
      return result;
    } finally {
      setIsCompiling(false);
    }
  };

  const estimateGas = async (code: string, network: string = 'arbitrum-sepolia'): Promise<string> => {
    try {
      const response = await fetch('/api/estimate-gas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, network }),
      });

      if (!response.ok) {
        return 'Unable to estimate';
      }

      const data = await response.json();
      return data.gasEstimate;
    } catch (error) {
      return 'Error estimating gas';
    }
  };

  const lintCode = (code: string): Array<{ type: 'error' | 'warning'; message: string; line: number }> => {
    const issues: Array<{ type: 'error' | 'warning'; message: string; line: number }> = [];
    const lines = code.split('\n');

    lines.forEach((line, index) => {
      // Check for common issues
      if (line.includes('unwrap()') && !line.includes('expect')) {
        issues.push({
          type: 'warning',
          message: 'Consider using .expect() instead of .unwrap() for better error messages',
          line: index + 1,
        });
      }

      if (line.includes('todo!()')) {
        issues.push({
          type: 'warning',
          message: 'TODO: Implement this functionality',
          line: index + 1,
        });
      }

      if (line.match(/pub\s+fn\s+\w+/) && !lines.slice(Math.max(0, index - 5), index).some(l => l.includes('///'))) {
        issues.push({
          type: 'warning',
          message: 'Consider adding documentation for public functions',
          line: index + 1,
        });
      }
    });

    return issues;
  };

  return {
    compile,
    estimateGas,
    lintCode,
    isCompiling,
    compilationResult,
    lastCompiled,
  };
}
