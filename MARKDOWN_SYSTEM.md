# Tutorial Content Rendering System - Usage Guide

## Components Created

### 1. MarkdownRenderer
The main component for rendering formatted markdown content with:
- **Beautiful Typography**: Proper heading hierarchy, spacing, and colors
- **Code Highlighting**: Syntax-highlighted code blocks with copy button
- **Custom Styling**: GitHub dark theme with blue/green accents
- **Lists**: Styled bullet points and numbered lists
- **Links**: Blue hyperlinks that open in new tabs
- **Tables**: Responsive tables with hover effects
- **Images**: Rounded corners with borders

### 2. KeyPoints
Displays important points with visual indicators:
- `variant="default"` - Green checkmarks for key points
- `variant="tips"` - Yellow lightbulb for tips
- `variant="important"` - Red lightning for critical info
- `variant="goals"` - Blue target for learning objectives

### 3. InfoBox
Contextual information boxes:
- `type="info"` - Blue for general information
- `type="warning"` - Yellow for warnings
- `type="tip"` - Purple for pro tips
- `type="success"` - Green for success messages
- `type="highlight"` - Gold for highlights

## Usage Example

```tsx
import MarkdownRenderer from '@/components/MarkdownRenderer';
import KeyPoints from '@/components/KeyPoints';
import InfoBox from '@/components/InfoBox';

export default function TutorialSection() {
  const content = `
## Understanding Functions

**Mutable Functions (\`&mut self\`):**
- Can modify contract storage
- Cost gas to execute
- Change blockchain state
- Example: transfer, mint, burn

**View Functions (\`&self\`):**
- Read-only, cannot modify storage
- Free to call (no gas) when called externally
- Don't change blockchain state
- Example: balanceOf, totalSupply, owner

The \`#[external]\` attribute makes functions callable from outside the contract.
  `;

  const keyPoints = [
    '10-100x lower gas costs for compute-intensive operations',
    'Memory-safe execution with Rust\'s ownership system',
    'Access to existing Rust libraries and tooling',
    'Full EVM compatibility'
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Markdown Content */}
      <MarkdownRenderer content={content} />

      {/* Key Points Box */}
      <KeyPoints 
        points={keyPoints} 
        variant="default"
        title="Why Stylus?" 
      />

      {/* Info Box */}
      <InfoBox type="tip" title="Pro Tip">
        Always use <code>Result&lt;T, E&gt;</code> for functions that can fail. 
        This makes error handling explicit and prevents unexpected panics.
      </InfoBox>

      {/* Code Example */}
      <MarkdownRenderer content={`
\`\`\`rust
use stylus_sdk::prelude::*;

#[storage]
#[entrypoint]
pub struct Counter {
    count: StorageU256,
}

#[public]
impl Counter {
    // View function - no gas when called externally
    pub fn get(&self) -> U256 {
        self.count.get()
    }

    // Mutable function - costs gas
    pub fn increment(&mut self) {
        let current = self.count.get();
        self.count.set(current + U256::from(1));
    }
}
\`\`\`
      `} />
    </div>
  );
}
```

## Features

### Markdown Features
- ✅ **Headers** (H1-H4) with proper hierarchy
- ✅ **Bold** and *italic* text
- ✅ `Inline code` with syntax highlighting
- ✅ Code blocks with language-specific highlighting
- ✅ Bullet lists with custom styling
- ✅ Numbered lists
- ✅ Blockquotes
- ✅ Links (open in new tab)
- ✅ Tables
- ✅ Horizontal rules
- ✅ Images

### Code Highlighting
Supports all major languages:
- Rust
- JavaScript/TypeScript
- Python
- Solidity
- JSON
- YAML
- And more...

### Copy Button
Every code block has a copy button in the top-right corner for easy copying.

### Responsive Design
All components are fully responsive and look great on mobile devices.

## Styling

### Color Palette
- **Background**: `#0d1117` (dark)
- **Surface**: `#161b22` (darker)
- **Border**: `#30363d` (subtle)
- **Text**: `#c9d1d9` (light gray)
- **Headings**: `#ffffff` (white)
- **Accent Blue**: `#58a6ff`
- **Accent Green**: `#3fb950`
- **Accent Purple**: `#a371f7`
- **Accent Yellow**: `#d29922`
- **Accent Red**: `#f85149`

### Typography
- **Font**: System font stack
- **Code Font**: Monospace
- **Line Height**: Relaxed (1.5-1.7)
- **Letter Spacing**: Tight for headings

## Integration with Tutorial System

```tsx
// In tutorial section component
import { TutorialSection } from '@/lib/data/tutorials';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import KeyPoints from '@/components/KeyPoints';

function SectionDisplay({ section }: { section: TutorialSection }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">{section.title}</h2>
      
      <MarkdownRenderer content={section.content} />
      
      {section.keyPoints && (
        <KeyPoints points={section.keyPoints} />
      )}
      
      {section.codeExample && (
        <MarkdownRenderer 
          content={`\`\`\`${section.language || 'rust'}\n${section.codeExample}\n\`\`\``} 
        />
      )}
    </div>
  );
}
```

This creates a beautiful, professional learning experience with properly formatted content!
