'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export default function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  return (
    <div className={`prose prose-invert max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Headings
          h1: ({ node, ...props }) => (
            <h1 className="text-3xl font-bold text-white mb-4 mt-6 border-b border-[#30363d] pb-2" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-2xl font-bold text-white mb-3 mt-5" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-xl font-semibold text-white mb-2 mt-4" {...props} />
          ),
          h4: ({ node, ...props }) => (
            <h4 className="text-lg font-semibold text-[#e6edf3] mb-2 mt-3" {...props} />
          ),

          // Paragraphs - always use p tag for paragraphs, code blocks won't be inside them
          p: ({ node, children, ...props }) => {
            return <p className="text-[#c9d1d9] leading-relaxed mb-4" {...props}>{children}</p>;
          },

          // Pre blocks (code blocks are wrapped in pre tags by markdown)
          pre: ({ node, children, ...props }) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { ref, ...restProps } = props as any;
            return <div className="my-4" {...restProps}>{children}</div>;
          },

          // Strong/Bold
          strong: ({ node, ...props }) => (
            <strong className="font-bold text-white" {...props} />
          ),

          // Emphasis/Italic
          em: ({ node, ...props }) => (
            <em className="italic text-[#e6edf3]" {...props} />
          ),

          // Lists
          ul: ({ node, ...props }) => (
            <ul className="list-none space-y-2 mb-4 ml-0" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal list-inside space-y-2 mb-4 ml-2 text-[#c9d1d9]" {...props} />
          ),
          li: ({ node, children, ...props }) => {
            const content = String(children);
            // Check if this is a bullet point (contains •) or regular list item
            if (content.includes('•')) {
              return (
                <li className="flex items-start gap-3 text-[#c9d1d9]" {...props}>
                  <span className="text-[#58a6ff] mt-1 flex-shrink-0">●</span>
                  <span>{children}</span>
                </li>
              );
            }
            return (
              <li className="flex items-start gap-3 text-[#c9d1d9]" {...props}>
                <span className="text-[#3fb950] mt-1 flex-shrink-0">▸</span>
                <span>{children}</span>
              </li>
            );
          },

          // Code blocks and inline code
          code: ({ node, inline, className, children, ...props }: any) => {
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : 'text';

            // Inline code - simple span, no div
            if (inline || !className) {
              return (
                <code
                  className="px-1.5 py-0.5 rounded bg-[#30363d] text-[#79c0ff] font-mono text-sm border border-[#444c56]"
                  {...props}
                >
                  {children}
                </code>
              );
            }

            // Block code - will be inside a pre tag
            return (
              <SyntaxHighlighter
                style={vscDarkPlus}
                language={language}
                PreTag="div"
                className="!bg-[#0d1117] !m-0 rounded-lg overflow-hidden"
                customStyle={{
                  padding: '1rem',
                  margin: 0,
                  background: '#0d1117',
                  fontSize: '0.875rem',
                  lineHeight: '1.5'
                }}
                showLineNumbers={false}
                wrapLines={false}
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            );
          },

          // Pre tag - wraps code blocks, already a block element
          pre: ({ node, children, ...props }: any) => {
            return (
              <div className="my-4 rounded-lg overflow-hidden border border-[#30363d] shadow-lg" {...props}>
                {children}
              </div>
            );
          },

          // Blockquotes
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="border-l-4 border-[#58a6ff] bg-[#161b22] pl-4 py-3 my-4 rounded-r-lg"
              {...props}
            />
          ),

          // Links
          a: ({ node, ...props }) => (
            <a
              className="text-[#58a6ff] hover:text-[#79c0ff] underline transition-colors"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            />
          ),

          // Horizontal rule
          hr: ({ node, ...props }) => (
            <hr className="border-[#30363d] my-6" {...props} />
          ),

          // Tables
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto my-4">
              <table className="min-w-full border border-[#30363d] rounded-lg" {...props} />
            </div>
          ),
          thead: ({ node, ...props }) => (
            <thead className="bg-[#161b22]" {...props} />
          ),
          tbody: ({ node, ...props }) => (
            <tbody className="divide-y divide-[#30363d]" {...props} />
          ),
          tr: ({ node, ...props }) => (
            <tr className="hover:bg-[#161b22] transition-colors" {...props} />
          ),
          th: ({ node, ...props }) => (
            <th className="px-4 py-3 text-left text-sm font-semibold text-white border-b border-[#30363d]" {...props} />
          ),
          td: ({ node, ...props }) => (
            <td className="px-4 py-3 text-sm text-[#c9d1d9]" {...props} />
          ),

          // Image
          img: ({ node, ...props }) => (
            <img className="rounded-lg border border-[#30363d] my-4 max-w-full h-auto" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
