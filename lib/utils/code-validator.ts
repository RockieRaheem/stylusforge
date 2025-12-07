import { TestCase } from '../data/tutorials';

export interface ValidationResult {
  passed: boolean;
  score: number;
  maxScore: number;
  feedback: string[];
  passedTests: number;
  totalTests: number;
}

/**
 * Validate Rust/Stylus code against requirements
 */
export function validateStylusCode(
  userCode: string,
  solution: string,
  testCases: TestCase[]
): ValidationResult {
  const feedback: string[] = [];
  let passedTests = 0;
  const totalTests = testCases.length;
  
  // Normalize code for comparison
  const normalizedUser = normalizeCode(userCode);
  const normalizedSolution = normalizeCode(solution);
  
  // Run each test case
  for (const testCase of testCases) {
    console.log('🧪 Running test case:', testCase.id, testCase.description);
    console.log('  Expected:', testCase.expectedOutput?.substring(0, 50));
    
    const result = runTestCase(normalizedUser, normalizedSolution, testCase);
    console.log('  Result:', result.passed ? '✅ PASS' : '❌ FAIL', result.message);
    
    if (result.passed) {
      passedTests++;
      feedback.push(`✅ ${testCase.description}`);
    } else {
      feedback.push(`❌ ${testCase.description}: ${result.message}`);
    }
  }
  
  const score = Math.round((passedTests / totalTests) * 100);
  const passed = passedTests === totalTests;
  
  if (passed) {
    feedback.unshift('🎉 Perfect! All tests passed!');
  } else if (passedTests > 0) {
    feedback.unshift(`⚡ Good progress! ${passedTests}/${totalTests} tests passed.`);
  } else {
    feedback.unshift('❗ No tests passed yet. Check the hints and try again.');
  }
  
  return {
    passed,
    score,
    maxScore: 100,
    feedback,
    passedTests,
    totalTests
  };
}

function normalizeCode(code: string): string {
  return code
    .replace(/\/\/.*/g, '') // Remove single-line comments
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove multi-line comments
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim()
    .toLowerCase();
}

function runTestCase(
  userCode: string,
  solutionCode: string,
  testCase: TestCase
): { passed: boolean; message: string } {
  console.log('🔍 runTestCase called with:', {
    testCaseId: testCase.id,
    testCaseDescription: testCase.description,
    hasExpectedOutput: !!testCase.expectedOutput,
    expectedOutputLength: testCase.expectedOutput?.length
  });
  
  // Simple check: does the user code contain the expected output?
  if (!testCase.expectedOutput) {
    return { passed: true, message: 'No validation required' };
  }
  
  const normalizedExpected = normalizeCode(testCase.expectedOutput);
  console.log('  Normalized expected:', normalizedExpected.substring(0, 100));
  console.log('  User code contains?', userCode.includes(normalizedExpected));
  
  const passed = userCode.includes(normalizedExpected);
  
  return {
    passed,
    message: passed ? 'Pattern found' : 'Expected pattern not found in code'
  };
}

interface CodeCheck {
  type: 'keyword' | 'pattern' | 'structure';
  description: string;
  pattern: string | RegExp;
}

function extractChecksFromDescription(description: string, expectedOutput: string): CodeCheck[] {
  const checks: CodeCheck[] = [];
  
  // Add null/undefined checks
  if (!description || !expectedOutput) {
    return checks;
  }
  
  const lower = description.toLowerCase();
  const output = expectedOutput.toLowerCase();
  
  // Check for struct/field definitions
  if (lower.includes('contains') && lower.includes('field')) {
    const match = output.match(/(\w+)\s+field\s+named\s+(\w+)/);
    if (match) {
      checks.push({
        type: 'structure',
        description: `${match[1]} field named ${match[2]}`,
        pattern: new RegExp(`${match[2]}\\s*:\\s*storage${match[1]}`, 'i')
      });
    }
  }
  
  // Check for function signatures
  if (lower.includes('function') && output.includes('pub fn')) {
    const match = output.match(/pub\s+fn\s+(\w+)/);
    if (match) {
      checks.push({
        type: 'pattern',
        description: `Function ${match[1]} exists`,
        pattern: new RegExp(`pub\\s+fn\\s+${match[1]}`, 'i')
      });
    }
  }
  
  // Check for specific patterns
  if (output.includes('function signature:')) {
    const signature = output.split('function signature:')[1].trim();
    checks.push({
      type: 'pattern',
      description: 'Correct function signature',
      pattern: normalizeCode(signature)
    });
  }
  
  // Check for events
  if (lower.includes('event') && lower.includes('defined')) {
    const match = output.match(/event\s+with\s+(\w+)\s+and\s+(\w+)/);
    if (match) {
      checks.push({
        type: 'pattern',
        description: `Event with ${match[1]} and ${match[2]}`,
        pattern: /event\s+\w+/i
      });
    }
  }
  
  // Check for indexed parameters
  if (lower.includes('indexed')) {
    checks.push({
      type: 'keyword',
      description: 'Indexed parameter',
      pattern: 'indexed'
    });
  }
  
  // Check for error handling
  if (lower.includes('error') && (lower.includes('enum') || lower.includes('defined'))) {
    checks.push({
      type: 'pattern',
      description: 'Error enum defined',
      pattern: /pub\s+enum\s+error/i
    });
  }
  
  // Check for access control
  if (lower.includes('only_owner') || lower.includes('owner')) {
    checks.push({
      type: 'pattern',
      description: 'Owner check',
      pattern: /only_owner|msg::sender\(\)\s*!=\s*self\.owner/i
    });
  }
  
  // Check for balance validation
  if (lower.includes('balance') && (lower.includes('check') || lower.includes('validation'))) {
    checks.push({
      type: 'pattern',
      description: 'Balance check before operation',
      pattern: /if\s+.*balance|amount\s*>\s*balance/i
    });
  }
  
  // Generic checks based on expected output keywords
  const keywords = ['increment', 'decrement', 'evm::log', 'result', 'error'];
  for (const keyword of keywords) {
    if (output.includes(keyword)) {
      checks.push({
        type: 'keyword',
        description: `Contains ${keyword}`,
        pattern: keyword
      });
    }
  }
  
  return checks;
}

function performCheck(code: string, check: CodeCheck): boolean {
  if (check.type === 'keyword') {
    return code.includes(check.pattern.toString().toLowerCase());
  }
  
  if (check.type === 'pattern') {
    if (typeof check.pattern === 'string') {
      return code.includes(check.pattern.toLowerCase());
    }
    return check.pattern.test(code);
  }
  
  if (check.type === 'structure') {
    if (typeof check.pattern === 'string') {
      return code.includes(check.pattern.toLowerCase());
    }
    return check.pattern.test(code);
  }
  
  return false;
}

/**
 * Get hints based on failed tests
 */
export function getRelevantHints(
  result: ValidationResult,
  allHints: string[],
  attemptCount: number
): string[] {
  const hintsToShow = Math.min(attemptCount, allHints.length);
  return allHints.slice(0, hintsToShow);
}

/**
 * Check if code is substantially different from starter code
 */
export function hasUserMadeProgress(userCode: string, starterCode: string): boolean {
  const normalizedUser = normalizeCode(userCode);
  const normalizedStarter = normalizeCode(starterCode);
  
  // Calculate similarity (simple approach)
  const userLength = normalizedUser.length;
  const starterLength = normalizedStarter.length;
  
  // If user code is significantly longer or has removed todos, they've made progress
  if (userLength > starterLength * 1.2 || !normalizedUser.includes('todo')) {
    return true;
  }
  
  return false;
}
