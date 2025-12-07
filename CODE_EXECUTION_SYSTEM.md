# Code Execution System

## Overview
The tutorial system now includes a fully integrated code execution interface that allows users to run Rust/Stylus code examples and see real-time results.

## Features

### ✨ Interactive Code Editor
- **Monaco Editor Integration**: Full-featured code editor with syntax highlighting
- **Language Support**: Rust, Bash, and other languages
- **Auto-completion**: Smart code completion and error highlighting
- **Line Numbers**: Easy code navigation with line numbers
- **Code Folding**: Collapse/expand code blocks for better readability

### 🚀 Code Execution
- **Run Button**: Execute code with a single click
- **Real-time Output**: See execution results immediately
- **Error Display**: Beautiful error messages with line numbers and explanations
- **Compilation Time**: Track how long compilation takes
- **Execution Time**: Monitor runtime performance

### 🎯 User Experience
- **Copy Code**: One-click code copying to clipboard
- **Reset Button**: Restore original code instantly
- **Loading States**: Visual feedback during execution
- **Success/Error Indicators**: Clear visual states with icons
- **Collapsible Output**: Toggle output panel visibility

## Components

### CodeExecutor Component
Located at: `components/CodeExecutor.tsx`

**Props:**
```typescript
interface CodeExecutorProps {
  initialCode: string;        // Starting code content
  language?: string;           // Programming language (default: 'rust')
  readOnly?: boolean;          // Lock editing (default: false)
  title?: string;              // Editor title
  height?: string;             // Editor height (default: '400px')
  onCodeChange?: (code: string) => void;  // Callback for code changes
  showRunButton?: boolean;     // Show/hide run button (default: true)
}
```

## Usage in Tutorials

### Example Code Sections
```tsx
<CodeExecutor
  initialCode={exampleCode}
  language="rust"
  readOnly={true}
  title="Example Code - Counter Contract"
  height="400px"
  showRunButton={true}
/>
```

### Assignment Sections
```tsx
<CodeExecutor
  initialCode={starterCode}
  language="rust"
  readOnly={false}
  title="Your Solution - src/lib.rs"
  height="500px"
  onCodeChange={(code) => setUserCode(code)}
  showRunButton={true}
/>
```

### Solution Display
```tsx
<CodeExecutor
  initialCode={solutionCode}
  language="rust"
  readOnly={true}
  title="Complete Solution"
  height="500px"
  showRunButton={true}
/>
```

## Execution Flow

### Mock Execution (Current)
The system currently uses mock execution for demonstration:

1. **Validation**: Basic syntax checks on the code
2. **Compilation Simulation**: Random 300-800ms delay
3. **Execution Simulation**: Random 100-300ms delay
4. **Result Generation**: Mock success/error output

### Production Implementation (Future)
For production, replace `mockExecuteRustCode()` with actual backend integration:

```typescript
async function executeRustCode(code: string): Promise<ExecutionResult> {
  const response = await fetch('/api/execute', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, language: 'rust' })
  });
  return await response.json();
}
```

**Backend Requirements:**
- Sandboxed Rust compiler environment
- Security: Isolated execution containers (Docker/WebAssembly)
- Timeout limits (max 30 seconds)
- Resource constraints (memory/CPU limits)
- Output sanitization

## Error Handling

### Compilation Errors
```
error: expected item, found `}`
 --> src/lib.rs:1:1
  |
1 | }
  | ^ expected item

error: could not compile due to previous error
```

### Runtime Errors
```
error[E0425]: cannot find value `self` in this scope
 --> src/lib.rs:5:9
  |
5 |         self.count.get()
  |         ^^^^ help: you might have meant to use `self`: `&self`
```

## Success Output Examples

```
Counter initialized with value: 0
Counter incremented to: 1
Counter incremented to: 2
Final value: 2
```

```
Contract deployed successfully!
Storage initialized
All functions accessible
```

```
Test passed: ✓
Storage operations verified
Contract ready for deployment
```

## Styling

### Color Scheme (GitHub Dark)
- Background: `#0d1117`
- Secondary: `#161b22`
- Border: `#30363d`
- Text: `#c9d1d9`
- Success: `#3fb950`
- Error: `#f85149`
- Info: `#58a6ff`

### States
- **Idle**: Gray text, default border
- **Running**: Blue spinner, blue border
- **Success**: Green checkmark, green border
- **Error**: Red X icon, red border

## Integration with Tutorial System

The CodeExecutor is now integrated into:
1. **Lesson Sections**: Example code with run capability
2. **Assignments**: Editable code with execution
3. **Solutions**: Read-only solution code with run capability

All three contexts support:
- Running code
- Viewing results
- Copying to clipboard
- Resetting (for editable sections)

## Future Enhancements

### Planned Features
- [ ] **Real Backend Integration**: Connect to Stylus compiler API
- [ ] **WebAssembly Execution**: Run compiled WASM in browser
- [ ] **Test Case Validation**: Run predefined test cases
- [ ] **Code Diff View**: Compare user code vs solution
- [ ] **Performance Metrics**: Gas estimation, optimization suggestions
- [ ] **Collaboration**: Share code snippets with others
- [ ] **Version History**: Track code changes over time
- [ ] **AI Assistance**: Code suggestions and debugging help

### Advanced Features
- [ ] **Breakpoint Debugging**: Step through code execution
- [ ] **Variable Inspector**: View variable states
- [ ] **Stack Trace**: Detailed error traces
- [ ] **Deployment Preview**: Estimate deployment costs
- [ ] **Contract Interaction**: Test deployed contracts
