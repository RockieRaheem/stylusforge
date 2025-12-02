import { NextRequest, NextResponse } from 'next/server';

interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
  duration: number;
}

export async function POST(request: NextRequest) {
  try {
    const { code, tests } = await request.json();

    if (!code) {
      return NextResponse.json(
        { error: 'Code required' },
        { status: 400 }
      );
    }

    // Simulate running tests
    // In production, this would run actual Rust tests
    const results: TestResult[] = [];

    // Auto-generate basic tests if none provided
    const testCases = tests || generateBasicTests(code);

    for (const test of testCases) {
      const startTime = Date.now();
      
      try {
        // Simulate test execution
        await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 200));
        
        // Mock test result
        const passed = Math.random() > 0.2; // 80% pass rate
        
        results.push({
          name: test.name || 'Unnamed test',
          passed,
          ...(passed ? {} : { error: 'Assertion failed' }),
          duration: Date.now() - startTime,
        });
      } catch (error) {
        results.push({
          name: test.name || 'Unnamed test',
          passed: false,
          error: error instanceof Error ? error.message : 'Test failed',
          duration: Date.now() - startTime,
        });
      }
    }

    const summary = {
      total: results.length,
      passed: results.filter(r => r.passed).length,
      failed: results.filter(r => !r.passed).length,
      duration: results.reduce((sum, r) => sum + r.duration, 0),
    };

    return NextResponse.json({ results, summary });
  } catch (error) {
    console.error('Test execution error:', error);
    return NextResponse.json(
      { error: 'Test execution failed' },
      { status: 500 }
    );
  }
}

function generateBasicTests(code: string) {
  const tests = [];

  // Check for common patterns and generate tests
  if (code.includes('entrypoint')) {
    tests.push({ name: 'test_entrypoint_exists' });
  }

  if (code.match(/pub\s+fn/)) {
    tests.push({ name: 'test_public_functions' });
  }

  if (code.includes('Storage')) {
    tests.push({ name: 'test_storage_operations' });
  }

  if (tests.length === 0) {
    tests.push({ name: 'test_compilation' });
  }

  return tests;
}
