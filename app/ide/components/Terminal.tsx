'use client';

import { useState, useRef, useEffect } from 'react';
import { Terminal, X, Maximize2, Minimize2 } from 'lucide-react';

interface TerminalProps {
  onClose?: () => void;
}

export default function TerminalPanel({ onClose }: TerminalProps) {
  const [output, setOutput] = useState<Array<{ type: 'input' | 'output' | 'error'; text: string }>>([
    { type: 'output', text: 'Stylus Studio Terminal v1.0.0' },
    { type: 'output', text: 'Type "help" for available commands' },
    { type: 'output', text: '' },
  ]);
  const [input, setInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isMaximized, setIsMaximized] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  const executeCommand = async (command: string) => {
    const trimmedCommand = command.trim();
    if (!trimmedCommand) return;

    // Add command to history
    setCommandHistory([...commandHistory, trimmedCommand]);
    setHistoryIndex(-1);

    // Add command to output
    setOutput((prev) => [...prev, { type: 'input', text: `$ ${trimmedCommand}` }]);

    // Parse and execute command
    const [cmd, ...args] = trimmedCommand.split(' ');

    switch (cmd.toLowerCase()) {
      case 'help':
        setOutput((prev) => [
          ...prev,
          { type: 'output', text: 'Available commands:' },
          { type: 'output', text: '  cargo build       - Build the Stylus project' },
          { type: 'output', text: '  cargo test        - Run tests' },
          { type: 'output', text: '  cargo check       - Check code without building' },
          { type: 'output', text: '  cargo stylus new  - Create a new Stylus project' },
          { type: 'output', text: '  cargo stylus check - Check Stylus contract' },
          { type: 'output', text: '  cargo stylus deploy - Deploy to Arbitrum' },
          { type: 'output', text: '  clear             - Clear terminal' },
          { type: 'output', text: '  help              - Show this help message' },
          { type: 'output', text: '' },
        ]);
        break;

      case 'clear':
        setOutput([]);
        break;

      case 'cargo':
        if (args[0] === 'build') {
          setOutput((prev) => [
            ...prev,
            { type: 'output', text: 'Compiling stylus-project v0.1.0' },
            { type: 'output', text: 'Building dependencies...' },
          ]);
          // Simulate build process
          setTimeout(() => {
            setOutput((prev) => [
              ...prev,
              { type: 'output', text: 'Finished dev [unoptimized + debuginfo] target(s) in 3.24s' },
              { type: 'output', text: '' },
            ]);
          }, 1500);
        } else if (args[0] === 'test') {
          setOutput((prev) => [
            ...prev,
            { type: 'output', text: 'Running tests...' },
          ]);
          setTimeout(() => {
            setOutput((prev) => [
              ...prev,
              { type: 'output', text: 'test result: ok. 3 passed; 0 failed' },
              { type: 'output', text: '' },
            ]);
          }, 1000);
        } else if (args[0] === 'check') {
          setOutput((prev) => [
            ...prev,
            { type: 'output', text: 'Checking stylus-project v0.1.0' },
          ]);
          setTimeout(() => {
            setOutput((prev) => [
              ...prev,
              { type: 'output', text: 'Finished dev [unoptimized + debuginfo] target(s) in 1.23s' },
              { type: 'output', text: '' },
            ]);
          }, 800);
        } else if (args[0] === 'stylus') {
          if (args[1] === 'check') {
            setOutput((prev) => [
              ...prev,
              { type: 'output', text: 'Checking Stylus contract...' },
            ]);
            setTimeout(() => {
              setOutput((prev) => [
                ...prev,
                { type: 'output', text: '✓ Contract validation passed' },
                { type: 'output', text: '✓ Gas estimation: 1,234,567' },
                { type: 'output', text: '' },
              ]);
            }, 1200);
          } else if (args[1] === 'deploy') {
            setOutput((prev) => [
              ...prev,
              { type: 'output', text: 'Deploying to Arbitrum Sepolia...' },
            ]);
            setTimeout(() => {
              setOutput((prev) => [
                ...prev,
                { type: 'output', text: '✓ Contract deployed successfully' },
                { type: 'output', text: '✓ Address: 0x1234...5678' },
                { type: 'output', text: '✓ Transaction: 0xabcd...efgh' },
                { type: 'output', text: '' },
              ]);
            }, 2000);
          } else {
            setOutput((prev) => [
              ...prev,
              { type: 'error', text: `Unknown stylus command: ${args[1]}` },
              { type: 'output', text: '' },
            ]);
          }
        } else {
          setOutput((prev) => [
            ...prev,
            { type: 'output', text: `Cargo command: ${args.join(' ')}` },
            { type: 'output', text: '' },
          ]);
        }
        break;

      case 'ls':
      case 'dir':
        setOutput((prev) => [
          ...prev,
          { type: 'output', text: 'src/' },
          { type: 'output', text: 'target/' },
          { type: 'output', text: 'Cargo.toml' },
          { type: 'output', text: 'Cargo.lock' },
          { type: 'output', text: '' },
        ]);
        break;

      default:
        setOutput((prev) => [
          ...prev,
          { type: 'error', text: `Command not found: ${cmd}` },
          { type: 'output', text: 'Type "help" for available commands' },
          { type: 'output', text: '' },
        ]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = Math.min(commandHistory.length - 1, historyIndex + 1);
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      setOutput([]);
    }
  };

  return (
    <div className={`flex flex-col bg-[#1e1e1e] h-full`}>
      {/* Terminal Output */}
      <div
        ref={outputRef}
        className="flex-1 overflow-y-auto px-4 py-2 font-mono text-[13px] scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent select-text cursor-text"
        onClick={() => inputRef.current?.focus()}
      >
        {output.map((line, index) => (
          <div
            key={index}
            className={`leading-relaxed select-text ${
              line.type === 'input'
                ? 'text-[#4fc1ff]'
                : line.type === 'error'
                ? 'text-[#f48771]'
                : 'text-[#cccccc]'
            }`}
          >
            {line.text}
          </div>
        ))}
        <div className="flex items-center gap-2 text-[#cccccc]">
          <span className="text-[#4fc1ff]">$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none border-none text-[#cccccc] caret-white"
            autoFocus
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
}
