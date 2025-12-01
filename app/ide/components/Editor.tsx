'use client';

import { useEffect, useRef, useState } from 'react';
import Editor, { Monaco } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';

interface EditorProps {
  value: string;
  onChange: (value: string | undefined) => void;
  language: string;
  path: string;
}

export default function CodeEditor({ value, onChange, language, path }: EditorProps) {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [theme, setTheme] = useState<'vs-dark' | 'light'>('vs-dark');

  function handleEditorDidMount(editor: monaco.editor.IStandaloneCodeEditor, monaco: Monaco) {
    editorRef.current = editor;

    // Configure Rust/Stylus language support
    monaco.languages.register({ id: 'rust' });
    
    // Add Stylus SDK specific keywords
    monaco.languages.setMonarchTokensProvider('rust', {
      keywords: [
        'as', 'break', 'const', 'continue', 'crate', 'else', 'enum', 'extern',
        'false', 'fn', 'for', 'if', 'impl', 'in', 'let', 'loop', 'match', 'mod',
        'move', 'mut', 'pub', 'ref', 'return', 'self', 'Self', 'static', 'struct',
        'super', 'trait', 'true', 'type', 'unsafe', 'use', 'where', 'while',
        'async', 'await', 'dyn', 'abstract', 'become', 'box', 'do', 'final',
        'macro', 'override', 'priv', 'typeof', 'unsized', 'virtual', 'yield',
        // Stylus SDK specific
        'storage', 'entrypoint', 'external', 'payable'
      ],
      typeKeywords: [
        'bool', 'u8', 'u16', 'u32', 'u64', 'u128', 'i8', 'i16', 'i32', 'i64', 'i128',
        'f32', 'f64', 'usize', 'isize', 'char', 'str', 'String', 'Vec', 'Option',
        'Result', 'Box', 'Rc', 'Arc',
        // Stylus types
        'StorageU256', 'StorageAddress', 'StorageBool', 'Address', 'U256'
      ],
      operators: [
        '=', '>', '<', '!', '~', '?', ':', '==', '<=', '>=', '!=',
        '&&', '||', '++', '--', '+', '-', '*', '/', '&', '|', '^', '%',
        '<<', '>>', '>>>', '+=', '-=', '*=', '/=', '&=', '|=', '^=',
        '%=', '<<=', '>>=', '>>>='
      ],
      symbols: /[=><!~?:&|+\-*\/\^%]+/,
      escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
      tokenizer: {
        root: [
          [/[a-z_$][\w$]*/, {
            cases: {
              '@keywords': 'keyword',
              '@typeKeywords': 'type',
              '@default': 'identifier'
            }
          }],
          [/[A-Z][\w\$]*/, 'type.identifier'],
          { include: '@whitespace' },
          [/[{}()\[\]]/, '@brackets'],
          [/[<>](?!@symbols)/, '@brackets'],
          [/@symbols/, {
            cases: {
              '@operators': 'operator',
              '@default': ''
            }
          }],
          [/\d*\.\d+([eE][\-+]?\d+)?/, 'number.float'],
          [/0[xX][0-9a-fA-F]+/, 'number.hex'],
          [/\d+/, 'number'],
          [/[;,.]/, 'delimiter'],
          [/"([^"\\]|\\.)*$/, 'string.invalid'],
          [/"/, { token: 'string.quote', bracket: '@open', next: '@string' }],
          [/'[^\\']'/, 'string'],
          [/'/, 'string.invalid']
        ],
        string: [
          [/[^\\"]+/, 'string'],
          [/@escapes/, 'string.escape'],
          [/\\./, 'string.escape.invalid'],
          [/"/, { token: 'string.quote', bracket: '@close', next: '@pop' }]
        ],
        whitespace: [
          [/[ \t\r\n]+/, 'white'],
          [/\/\*/, 'comment', '@comment'],
          [/\/\/.*$/, 'comment'],
        ],
        comment: [
          [/[^\/*]+/, 'comment'],
          [/\/\*/, 'comment', '@push'],
          [/\*\//, 'comment', '@pop'],
          [/[\/*]/, 'comment']
        ],
      },
    });

    // Configure editor options
    editor.updateOptions({
      fontSize: 14,
      minimap: { enabled: true },
      scrollBeyondLastLine: false,
      wordWrap: 'on',
      automaticLayout: true,
      tabSize: 4,
      insertSpaces: true,
      formatOnPaste: true,
      formatOnType: true,
      suggestOnTriggerCharacters: true,
      quickSuggestions: true,
    });
  }

  return (
    <div className="h-full w-full">
      <Editor
        height="100%"
        defaultLanguage={language}
        language={language}
        value={value}
        onChange={onChange}
        theme={theme}
        onMount={handleEditorDidMount}
        path={path}
        options={{
          fontSize: 14,
          minimap: { enabled: true },
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          automaticLayout: true,
          tabSize: 4,
          insertSpaces: true,
        }}
      />
    </div>
  );
}
