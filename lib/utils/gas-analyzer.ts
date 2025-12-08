import { GasProfile, GasOperation } from '@/components/GasProfiler';

interface WasmInstruction {
  opcode: string;
  operands: number[];
}

// Gas costs for common WASM operations (approximate)
const GAS_COSTS = {
  // Storage operations
  'storage.load': 2100,
  'storage.store': 20000,
  'storage.set': 20000,
  
  // Memory operations
  'memory.grow': 512,
  'memory.size': 2,
  'memory.copy': 3,
  'memory.fill': 3,
  
  // Computation
  'i32.add': 3,
  'i32.sub': 3,
  'i32.mul': 5,
  'i32.div': 10,
  'i64.add': 3,
  'i64.sub': 3,
  'i64.mul': 5,
  'i64.div': 10,
  
  // Comparison
  'i32.eq': 3,
  'i32.ne': 3,
  'i32.lt': 3,
  'i32.gt': 3,
  
  // Control flow
  'call': 100,
  'call_indirect': 150,
  'br': 10,
  'br_if': 10,
  'return': 0,
  
  // Events
  'event.emit': 375,
  'log0': 375,
  'log1': 750,
  'log2': 1125,
  
  // Default
  'default': 2,
};

// Categorize operations
function categorizeOperation(opcode: string): 'storage' | 'computation' | 'memory' | 'call' | 'event' {
  if (opcode.includes('storage') || opcode.includes('store') || opcode.includes('load')) {
    return 'storage';
  }
  if (opcode.includes('memory') || opcode.includes('grow')) {
    return 'memory';
  }
  if (opcode.includes('call')) {
    return 'call';
  }
  if (opcode.includes('log') || opcode.includes('event')) {
    return 'event';
  }
  return 'computation';
}

// Get friendly operation name
function getFriendlyName(opcode: string): string {
  const nameMap: Record<string, string> = {
    'storage.load': 'Storage Read',
    'storage.store': 'Storage Write',
    'storage.set': 'Storage Update',
    'memory.grow': 'Memory Allocation',
    'memory.copy': 'Memory Copy',
    'memory.fill': 'Memory Fill',
    'call': 'Function Call',
    'call_indirect': 'Dynamic Call',
    'i32.add': 'Integer Addition',
    'i32.sub': 'Integer Subtraction',
    'i32.mul': 'Integer Multiplication',
    'i32.div': 'Integer Division',
    'i64.add': 'Long Addition',
    'i64.mul': 'Long Multiplication',
    'log0': 'Event Emission',
    'log1': 'Indexed Event',
    'log2': 'Multi-Indexed Event',
  };
  
  return nameMap[opcode] || opcode.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

// Analyze bytecode and estimate gas usage
export function analyzeGasUsage(bytecode: Uint8Array): GasProfile {
  // This is a simplified analysis. In production, you'd use a proper WASM parser
  const operations: Map<string, { gasUsed: number; count: number; category: string }> = new Map();
  
  // Simulate parsing WASM bytecode
  // In reality, this would parse the actual bytecode structure
  const estimatedOps = estimateOperationsFromBytecode(bytecode);
  
  let totalGas = 0;
  
  // Count operations and calculate gas
  estimatedOps.forEach(opcode => {
    const gasCost = GAS_COSTS[opcode as keyof typeof GAS_COSTS] || GAS_COSTS.default;
    totalGas += gasCost;
    
    const existing = operations.get(opcode);
    if (existing) {
      existing.gasUsed += gasCost;
      existing.count += 1;
    } else {
      operations.set(opcode, {
        gasUsed: gasCost,
        count: 1,
        category: categorizeOperation(opcode),
      });
    }
  });
  
  // Convert to array and calculate percentages
  const operationsList: GasOperation[] = Array.from(operations.entries()).map(([opcode, data]) => ({
    name: getFriendlyName(opcode),
    gasUsed: data.gasUsed,
    percentage: (data.gasUsed / totalGas) * 100,
    count: data.count,
    category: data.category as any,
  }));
  
  // Generate optimization suggestions
  const suggestions = generateOptimizationSuggestions(operationsList, totalGas);
  
  const ethPrice = 3500;
  const gasPrice = 0.1;
  const estimatedCost = (totalGas * gasPrice * ethPrice) / 1e9;
  
  return {
    totalGas,
    operations: operationsList,
    estimatedCost,
    optimizationSuggestions: suggestions,
  };
}

// Estimate operations from bytecode (simplified)
function estimateOperationsFromBytecode(bytecode: Uint8Array): string[] {
  const operations: string[] = [];
  const size = bytecode.length;
  
  // Base deployment cost
  operations.push('call'); // Constructor call
  
  // Estimate based on bytecode size
  const storageOps = Math.floor(size / 100);
  const memoryOps = Math.floor(size / 50);
  const computeOps = Math.floor(size / 20);
  
  // Add storage operations
  for (let i = 0; i < storageOps; i++) {
    operations.push(i % 2 === 0 ? 'storage.load' : 'storage.store');
  }
  
  // Add memory operations
  for (let i = 0; i < memoryOps; i++) {
    operations.push(i % 3 === 0 ? 'memory.grow' : 'memory.copy');
  }
  
  // Add computation operations
  for (let i = 0; i < computeOps; i++) {
    const ops = ['i32.add', 'i32.mul', 'i32.eq', 'i64.add'];
    operations.push(ops[i % ops.length]);
  }
  
  // Add some function calls
  const callCount = Math.floor(size / 200);
  for (let i = 0; i < callCount; i++) {
    operations.push('call');
  }
  
  // Add event emission if bytecode suggests events
  if (size > 500) {
    operations.push('log1');
  }
  
  return operations;
}

// Generate optimization suggestions based on gas usage
function generateOptimizationSuggestions(operations: GasOperation[], totalGas: number): string[] {
  const suggestions: string[] = [];
  
  // Check for expensive storage operations
  const storageOps = operations.filter(op => op.category === 'storage');
  const storageGas = storageOps.reduce((sum, op) => sum + op.gasUsed, 0);
  
  if (storageGas > totalGas * 0.5) {
    suggestions.push(
      'Storage operations account for over 50% of gas usage. Consider batching storage writes or using memory for temporary data.'
    );
  }
  
  // Check for repeated operations
  const repeatedOps = operations.filter(op => op.count > 10);
  if (repeatedOps.length > 0) {
    suggestions.push(
      `Operation "${repeatedOps[0].name}" is called ${repeatedOps[0].count} times. Consider caching results or optimizing the loop.`
    );
  }
  
  // Check for expensive calls
  const callOps = operations.filter(op => op.category === 'call');
  const callGas = callOps.reduce((sum, op) => sum + op.gasUsed, 0);
  
  if (callGas > totalGas * 0.3) {
    suggestions.push(
      'Function calls are expensive. Consider inlining small functions or reducing call depth.'
    );
  }
  
  // General optimization tips
  if (totalGas > 100000) {
    suggestions.push(
      'Consider using more efficient data structures like packed storage or bit manipulation to reduce gas costs.'
    );
  }
  
  if (operations.some(op => op.name.includes('Division'))) {
    suggestions.push(
      'Integer division is expensive. If dividing by powers of 2, use bit shifting (>> operator) instead.'
    );
  }
  
  // Add Stylus-specific tips
  suggestions.push(
    'Stylus contracts benefit from Rust\'s zero-cost abstractions. Use iterators and avoid unnecessary allocations.'
  );
  
  return suggestions;
}

// Analyze a specific contract and return gas profile
export function analyzeContract(wasmBytes: Uint8Array | null): GasProfile | null {
  if (!wasmBytes) {
    return null;
  }
  
  return analyzeGasUsage(wasmBytes);
}

// Mock profile for testing
export function getMockGasProfile(): GasProfile {
  return {
    totalGas: 45320,
    operations: [
      { name: 'Storage Write', gasUsed: 20000, percentage: 44.1, count: 1, category: 'storage' },
      { name: 'Storage Read', gasUsed: 8400, percentage: 18.5, count: 4, category: 'storage' },
      { name: 'Function Call', gasUsed: 5000, percentage: 11.0, count: 50, category: 'call' },
      { name: 'Memory Allocation', gasUsed: 4096, percentage: 9.0, count: 8, category: 'memory' },
      { name: 'Integer Multiplication', gasUsed: 2500, percentage: 5.5, count: 500, category: 'computation' },
      { name: 'Integer Addition', gasUsed: 2400, percentage: 5.3, count: 800, category: 'computation' },
      { name: 'Memory Copy', gasUsed: 1200, percentage: 2.6, count: 400, category: 'memory' },
      { name: 'Event Emission', gasUsed: 750, percentage: 1.7, count: 1, category: 'event' },
      { name: 'Integer Comparison', gasUsed: 600, percentage: 1.3, count: 200, category: 'computation' },
      { name: 'Integer Division', gasUsed: 374, percentage: 0.8, count: 37, category: 'computation' },
    ],
    estimatedCost: 0.0159,
    optimizationSuggestions: [
      'Storage operations account for 62.6% of gas usage. Consider batching storage writes or using memory for temporary data.',
      'Operation "Integer Multiplication" is called 500 times. Consider caching results or optimizing the loop.',
      'Integer division is expensive. If dividing by powers of 2, use bit shifting (>> operator) instead.',
      'Stylus contracts benefit from Rust\'s zero-cost abstractions. Use iterators and avoid unnecessary allocations.',
    ],
  };
}
