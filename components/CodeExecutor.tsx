'use client';

import { useState, useId } from 'react';
import dynamic from 'next/dynamic';
import { Play, RotateCcw, Copy, Check, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

interface CodeExecutorProps {
  initialCode: string;
  language?: string;
  readOnly?: boolean;
  title?: string;
  height?: string;
  onCodeChange?: (code: string) => void;
  showRunButton?: boolean;
}

interface ExecutionResult {
  success: boolean;
  output?: string;
  error?: string;
  compilationTime?: number;
  executionTime?: number;
}

export default function CodeExecutor({
  initialCode,
  language = 'rust',
  readOnly = false,
  title = 'Code Editor',
  height = '400px',
  onCodeChange,
  showRunButton = true
}: CodeExecutorProps) {
  const instanceId = useId();
  const [code, setCode] = useState(initialCode);
  const [copied, setCopied] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [showOutput, setShowOutput] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setCode(initialCode);
    setExecutionResult(null);
    setShowOutput(false);
    if (onCodeChange) {
      onCodeChange(initialCode);
    }
  };

  const handleCodeChange = (value: string | undefined) => {
    const newCode = value || '';
    setCode(newCode);
    if (onCodeChange) {
      onCodeChange(newCode);
    }
  };

  const executeCode = async () => {
    // Prevent execution if already running
    if (isExecuting) return;
    
    setIsExecuting(true);
    setShowOutput(true);
    setExecutionResult(null);
    
    // Simulate compilation and execution with unique timeout per instance
    const delay = 1500 + Math.floor(Math.random() * 200); // Add slight randomization
    await new Promise(resolve => setTimeout(resolve, delay));

    try {
      // Mock execution results - In production, this would call a backend API
      // that compiles and runs the Rust code in a sandboxed environment
      const result = await mockExecuteRustCode(code, instanceId);
      setExecutionResult(result);
    } catch (error) {
      setExecutionResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="border border-[#30363d] rounded-lg overflow-hidden bg-[#0d1117]" data-executor-id={instanceId}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#161b22] border-b border-[#30363d]">
        <div className="flex items-center gap-3">
          <span className="text-[#8b949e] text-sm font-medium">{title}</span>
          <span className="px-2 py-0.5 rounded text-xs font-mono bg-[#30363d] text-[#8b949e]">
            {language}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {!readOnly && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded text-[#8b949e] hover:text-white hover:bg-[#21262d] transition-all text-sm"
              title="Reset code"
            >
              <RotateCcw size={14} />
              <span>Reset</span>
            </button>
          )}
          
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-[#8b949e] hover:text-white hover:bg-[#21262d] transition-all text-sm"
            title="Copy code"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>

          {showRunButton && (
            <button
              onClick={executeCode}
              disabled={isExecuting}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded bg-[#3fb950] hover:bg-[#3fb950]/90 text-white transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              title="Run code"
            >
              {isExecuting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Running...</span>
                </>
              ) : (
                <>
                  <Play size={14} />
                  <span>Run</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Monaco Editor */}
      <MonacoEditor
        key={`${instanceId}-${initialCode.substring(0, 50)}`}
        height={height}
        language={language}
        value={code}
        onChange={handleCodeChange}
        theme="vs-dark"
        options={{
          readOnly,
          minimap: { enabled: !readOnly },
          scrollBeyondLastLine: false,
          fontSize: 14,
          lineNumbers: 'on',
          renderLineHighlight: readOnly ? 'none' : 'all',
          scrollbar: {
            vertical: 'auto',
            horizontal: 'auto',
          },
          padding: { top: 16, bottom: 16 },
          bracketPairColorization: { enabled: true },
          automaticLayout: true,
          tabSize: 4,
          insertSpaces: true,
          wordWrap: 'on',
        }}
      />

      {/* Output Panel */}
      {showOutput && (
        <div className="border-t border-[#30363d]">
          <div className="flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-[#30363d]">
            <div className="flex items-center gap-2">
              {isExecuting ? (
                <>
                  <Loader2 size={16} className="text-[#58a6ff] animate-spin" />
                  <span className="text-sm font-medium text-[#58a6ff]">Executing...</span>
                </>
              ) : executionResult?.success ? (
                <>
                  <CheckCircle size={16} className="text-[#3fb950]" />
                  <span className="text-sm font-medium text-[#3fb950]">Execution Successful</span>
                </>
              ) : (
                <>
                  <AlertCircle size={16} className="text-[#f85149]" />
                  <span className="text-sm font-medium text-[#f85149]">Execution Failed</span>
                </>
              )}
            </div>
            
            {executionResult && (
              <div className="flex items-center gap-4 text-xs text-[#8b949e]">
                {executionResult.compilationTime && (
                  <span>Compile: {executionResult.compilationTime}ms</span>
                )}
                {executionResult.executionTime && (
                  <span>Run: {executionResult.executionTime}ms</span>
                )}
              </div>
            )}
          </div>

          <div className="bg-[#0d1117] p-4 max-h-64 overflow-y-auto">
            {isExecuting ? (
              <div className="flex items-center justify-center py-8">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 size={32} className="text-[#58a6ff] animate-spin" />
                  <p className="text-[#8b949e] text-sm">Compiling and executing your code...</p>
                </div>
              </div>
            ) : executionResult ? (
              <div className="space-y-3">
                {executionResult.success ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle size={16} className="text-[#3fb950]" />
                      <span className="text-[#3fb950] font-medium text-sm">Output:</span>
                    </div>
                    <pre className="bg-[#161b22] border border-[#30363d] rounded p-3 text-[#c9d1d9] text-sm font-mono overflow-x-auto">
                      {executionResult.output || 'Program executed successfully with no output.'}
                    </pre>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <AlertCircle size={16} className="text-[#f85149]" />
                      <span className="text-[#f85149] font-medium text-sm">Error:</span>
                    </div>
                    <pre className="bg-[#1c1917] border border-[#f85149]/30 rounded p-3 text-[#f85149] text-sm font-mono overflow-x-auto whitespace-pre-wrap">
                      {executionResult.error || 'An unknown error occurred.'}
                    </pre>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}

// Mock function to simulate Rust code execution
// In production, this would call a backend API
async function mockExecuteRustCode(code: string, instanceId: string): Promise<ExecutionResult> {
  // Simulate compilation time with slight variation per instance
  const compilationTime = Math.floor(Math.random() * 500) + 300;
  
  // Check if code is empty or too short
  if (!code || code.trim().length < 10) {
    return {
      success: false,
      error: `error: no input files
 --> src/lib.rs:1:1

error: could not compile due to previous error`,
      compilationTime
    };
  }

  // Basic syntax checks - be lenient for bash/shell scripts and other languages
  const isRustCode = code.includes('fn ') || code.includes('struct ') || code.includes('use ') || code.includes('#[');
  const isBashScript = code.includes('curl') || code.includes('cargo') || code.includes('#!/bin/bash') || code.includes('rustup');
  
  // If it's a bash script, simulate successful execution
  if (isBashScript) {
    const executionTime = Math.floor(Math.random() * 200) + 100;
    return {
      success: true,
      output: '✓ Installation completed successfully\n✓ All dependencies installed\n✓ Environment ready for development',
      compilationTime: 0,
      executionTime
    };
  }

  // For Rust code, do minimal validation
  if (isRustCode && code.includes('error') && !code.includes('Result') && !code.includes('Error')) {
    // Only fail if the word "error" appears in a suspicious context
    return {
      success: false,
      error: `error[E0425]: syntax error detected
 --> src/lib.rs:1:1
  |
1 | ${code.split('\n')[0]}
  | ^^^^

For more information about this error, try \`rustc --explain E0425\``,
      compilationTime
    };
  }

  // Simulate execution time
  const executionTime = Math.floor(Math.random() * 200) + 100;

  // Mock successful output based on code content
  let output = '';
  
  if (code.includes('Counter') || code.includes('count')) {
    output = '✓ Counter contract compiled successfully\n✓ Storage initialized\n✓ Functions: increment(), decrement(), get()\n✓ Ready for deployment';
  } else if (code.includes('ERC20') || code.includes('Token')) {
    output = '✓ Token contract compiled successfully\n✓ Total supply: 1,000,000\n✓ All ERC20 functions available\n✓ Ready for deployment';
  } else if (code.includes('storage') || code.includes('#[storage]')) {
    output = '✓ Contract compiled successfully\n✓ Storage layout validated\n✓ All state variables accessible\n✓ Ready for deployment';
  } else {
    output = '✓ Compilation successful\n✓ Contract size: 2.4kb\n✓ Estimated gas: 150,000\n✓ Ready for deployment';
  }

  return {
    success: true,
    output,
    compilationTime,
    executionTime
  };
}
