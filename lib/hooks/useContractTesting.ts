'use client';

import { useState } from 'react';

interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
  duration: number;
}

interface TestSummary {
  total: number;
  passed: number;
  failed: number;
  duration: number;
}

export function useContractTesting() {
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [testSummary, setTestSummary] = useState<TestSummary | null>(null);

  const runTests = async (code: string, tests?: any[]): Promise<{ results: TestResult[]; summary: TestSummary }> => {
    setIsRunning(true);
    setTestResults([]);
    setTestSummary(null);

    try {
      const response = await fetch('/api/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, tests }),
      });

      if (!response.ok) {
        throw new Error('Test execution failed');
      }

      const data = await response.json();
      setTestResults(data.results);
      setTestSummary(data.summary);

      return data;
    } catch (error) {
      console.error('Test error:', error);
      throw error;
    } finally {
      setIsRunning(false);
    }
  };

  const generateTestTemplate = (functionName: string): string => {
    return `#[test]
fn test_${functionName}() {
    // Arrange
    // TODO: Setup test data
    
    // Act
    // TODO: Call the function
    
    // Assert
    // TODO: Verify results
    assert!(true);
}`;
  };

  const debugContract = (code: string, breakpoints: number[] = []): string[] => {
    const lines = code.split('\n');
    const debugInfo: string[] = [];

    lines.forEach((line, index) => {
      const lineNum = index + 1;
      
      // Add debug points for important lines
      if (line.includes('fn ') || line.includes('let ') || line.includes('return')) {
        debugInfo.push(`Line ${lineNum}: ${line.trim()}`);
      }

      if (breakpoints.includes(lineNum)) {
        debugInfo.push(`BREAKPOINT at line ${lineNum}`);
      }
    });

    return debugInfo;
  };

  const analyzeComplexity = (code: string): { score: number; issues: string[] } => {
    const issues: string[] = [];
    let score = 0;

    // Count nested blocks
    const nestedBlocks = (code.match(/\{/g) || []).length;
    if (nestedBlocks > 20) {
      score += 2;
      issues.push('High nesting depth detected');
    }

    // Count function count
    const functionCount = (code.match(/fn\s+\w+/g) || []).length;
    if (functionCount > 15) {
      score += 1;
      issues.push('Large number of functions');
    }

    // Check for unsafe blocks
    const unsafeCount = (code.match(/unsafe/g) || []).length;
    if (unsafeCount > 0) {
      score += 3;
      issues.push(`${unsafeCount} unsafe block(s) found`);
    }

    return { score, issues };
  };

  return {
    runTests,
    generateTestTemplate,
    debugContract,
    analyzeComplexity,
    isRunning,
    testResults,
    testSummary,
  };
}
