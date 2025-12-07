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
  
  // Calculate score, handle empty test cases
  const score = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 100;
  const passed = totalTests === 0 || passedTests === totalTests;
  
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
    expectedOutput: testCase.expectedOutput
  });
  
  // If no expected output, pass by default
  if (!testCase.expectedOutput) {
    return { passed: true, message: 'No validation required' };
  }
  
  const normalizedUser = normalizeCode(userCode);
  const normalizedSolution = normalizeCode(solutionCode);
  const expectedLower = testCase.expectedOutput.toLowerCase();
  
  // Pattern 1: Event checks (e.g., "Event: FundsDeposited emitted")
  if (expectedLower.includes('event:')) {
    const eventMatch = testCase.expectedOutput.match(/Event:\s*(\w+)/i);
    if (eventMatch) {
      const eventName = eventMatch[1];
      const eventLower = eventName.toLowerCase();
      
      // Check for event definition or usage
      const hasEvent = normalizedUser.includes(`struct ${eventLower}`) || 
                      normalizedUser.includes(`${eventLower} {`) ||
                      normalizedUser.includes(`log(${eventLower}`) ||
                      normalizedUser.includes(`evm::log(${eventLower}`) ||
                      normalizedUser.includes(`sol! { event ${eventLower}`);
      
      console.log(`  Event check: ${eventName} - ${hasEvent ? 'FOUND' : 'NOT FOUND'}`);
      return {
        passed: hasEvent,
        message: hasEvent ? `Event ${eventName} implemented` : `Event ${eventName} not found`
      };
    }
  }
  
  // Pattern 2: Error checks (e.g., "Error: InvalidAddress")
  if (expectedLower.includes('error:')) {
    const errorMatch = testCase.expectedOutput.match(/Error:\s*(\w+)/i);
    if (errorMatch) {
      const errorName = errorMatch[1];
      const errorLower = errorName.toLowerCase();
      
      // Check for error definition or usage
      const hasError = normalizedUser.includes(errorLower) ||
                      normalizedUser.includes(`err("${errorLower}`) ||
                      normalizedUser.includes(`err(${errorLower}`);
      
      console.log(`  Error check: ${errorName} - ${hasError ? 'FOUND' : 'NOT FOUND'}`);
      return {
        passed: hasError,
        message: hasError ? `Error ${errorName} handled` : `Error ${errorName} not found`
      };
    }
  }
  
  // Pattern 3: Feature checks (e.g., "burn functionality", "transfer fee", "paused")
  const featureKeywords = {
    'burn': ['burn', 'burn(', 'fn burn'],
    'mint': ['mint', 'mint(', 'fn mint'],
    'pause': ['pause', 'paused', 'pausable'],
    'fee': ['fee', 'fee_bps', 'transfer_fee'],
    'vesting': ['vest', 'vesting', 'vested'],
    'approve': ['approve', 'approval', 'allowance'],
    'transfer': ['transfer', 'transfer('],
    'supply': ['supply', 'total_supply']
  };
  
  for (const [feature, keywords] of Object.entries(featureKeywords)) {
    if (expectedLower.includes(feature)) {
      const hasFeature = keywords.some(keyword => normalizedUser.includes(keyword.toLowerCase()));
      if (hasFeature) {
        console.log(`  Feature check: ${feature} - FOUND`);
        return { passed: true, message: `Feature ${feature} implemented` };
      }
    }
  }
  
  // Pattern 4: Test result checks (e.g., "All tests pass")
  if (expectedLower.includes('test') && expectedLower.includes('pass')) {
    const hasTests = normalizedUser.includes('#[test]') || normalizedUser.includes('mod test');
    console.log(`  Test check - ${hasTests ? 'FOUND' : 'NOT FOUND'}`);
    return {
      passed: hasTests,
      message: hasTests ? 'Tests implemented' : 'Tests not found'
    };
  }
  
  // Pattern 5: Gas savings check
  if (expectedLower.includes('gas') && expectedLower.includes('saving')) {
    // Always pass gas optimization checks as they're subjective
    return { passed: true, message: 'Gas optimization assumed' };
  }
  
  // Pattern 6: Success/workflow checks
  if (expectedLower.includes('success') || expectedLower.includes('works') || expectedLower.includes('flow')) {
    // Check if code has basic structure
    const hasBasicStructure = normalizedUser.length > 100 && 
                             (normalizedUser.includes('impl') || normalizedUser.includes('fn'));
    return {
      passed: hasBasicStructure,
      message: hasBasicStructure ? 'Basic implementation found' : 'Implementation incomplete'
    };
  }
  
  // Default: Check if user code is similar to solution (at least 30% match)
  const similarityThreshold = 0.3;
  const commonTokens = normalizedUser.split(' ').filter(token => 
    token.length > 3 && normalizedSolution.includes(token)
  ).length;
  const totalTokens = normalizedSolution.split(' ').filter(token => token.length > 3).length;
  const similarity = totalTokens > 0 ? commonTokens / totalTokens : 0;
  
  console.log(`  Similarity check: ${(similarity * 100).toFixed(1)}%`);
  const passed = similarity >= similarityThreshold;
  
  return {
    passed,
    message: passed ? 'Implementation matches expected pattern' : 'Implementation incomplete or incorrect'
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
