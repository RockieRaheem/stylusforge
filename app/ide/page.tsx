'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Menu, Bell, Settings as SettingsIcon, FileCode, Layout, Terminal as TerminalIcon } from 'lucide-react';
import FileTree, { FileNode } from './components/FileTree';
import Toolbar from './components/Toolbar';
import { DEFAULT_CONTRACT, CARGO_TOML, README_MD } from './templates';

// Dynamically import components that need client-side only rendering
const CodeEditor = dynamic(() => import('./components/Editor'), { ssr: false });
const TerminalPanel = dynamic(() => import('./components/Terminal'), { ssr: false });

export default function IDEPage() {
  const [files, setFiles] = useState<FileNode[]>([
    {
      id: 'src',
      name: 'src',
      type: 'folder',
      children: [
        {
          id: 'main.rs',
          name: 'lib.rs',
          type: 'file',
          content: DEFAULT_CONTRACT,
        },
      ],
    },
    {
      id: 'Cargo.toml',
      name: 'Cargo.toml',
      type: 'file',
      content: CARGO_TOML,
    },
    {
      id: 'README.md',
      name: 'README.md',
      type: 'file',
      content: README_MD,
    },
  ]);

  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showTerminal, setShowTerminal] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Initialize with first file
  useEffect(() => {
    const firstFile = files[0]?.type === 'folder' ? files[0].children?.[0] : files[0];
    if (firstFile && firstFile.type === 'file') {
      setSelectedFile(firstFile);
      setFileContent(firstFile.content || '');
    }
  }, []);

  const handleFileSelect = (file: FileNode) => {
    if (file.type === 'file') {
      // Save current file before switching
      if (selectedFile && hasUnsavedChanges) {
        updateFileContent(selectedFile.id, fileContent);
      }
      
      setSelectedFile(file);
      setFileContent(file.content || '');
      setHasUnsavedChanges(false);
    }
  };

  const handleEditorChange = (value: string | undefined) => {
    setFileContent(value || '');
    setHasUnsavedChanges(true);
  };

  const updateFileContent = (fileId: string, content: string) => {
    const updateFiles = (nodes: FileNode[]): FileNode[] => {
      return nodes.map((node) => {
        if (node.id === fileId) {
          return { ...node, content };
        }
        if (node.children) {
          return { ...node, children: updateFiles(node.children) };
        }
        return node;
      });
    };
    setFiles(updateFiles(files));
  };

  const handleSave = () => {
    if (selectedFile) {
      updateFileContent(selectedFile.id, fileContent);
      setHasUnsavedChanges(false);
    }
  };

  const handleFileCreate = (parentId: string | null, type: 'file' | 'folder', name: string) => {
    const newNode: FileNode = {
      id: `${Date.now()}-${name}`,
      name,
      type,
      content: type === 'file' ? '' : undefined,
      children: type === 'folder' ? [] : undefined,
    };

    if (!parentId) {
      setFiles([...files, newNode]);
    } else {
      const addToParent = (nodes: FileNode[]): FileNode[] => {
        return nodes.map((node) => {
          if (node.id === parentId && node.type === 'folder') {
            return {
              ...node,
              children: [...(node.children || []), newNode],
            };
          }
          if (node.children) {
            return { ...node, children: addToParent(node.children) };
          }
          return node;
        });
      };
      setFiles(addToParent(files));
    }
  };

  const handleFileDelete = (fileId: string) => {
    const removeFile = (nodes: FileNode[]): FileNode[] => {
      return nodes
        .filter((node) => node.id !== fileId)
        .map((node) => {
          if (node.children) {
            return { ...node, children: removeFile(node.children) };
          }
          return node;
        });
    };
    setFiles(removeFile(files));
    
    if (selectedFile?.id === fileId) {
      setSelectedFile(null);
      setFileContent('');
    }
  };

  const handleCompile = async () => {
    // Simulate compilation
    return new Promise<{ success: boolean; message: string; logs?: string[] }>((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'Compilation successful! ✓',
          logs: ['Building project...', 'Finished in 2.34s'],
        });
      }, 2000);
    });
  };

  const handleDeploy = async () => {
    // Simulate deployment
    return new Promise<{ success: boolean; address?: string; txHash?: string }>((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          address: '0x' + Math.random().toString(16).substr(2, 40),
          txHash: '0x' + Math.random().toString(16).substr(2, 64),
        });
      }, 3000);
    });
  };

  const getLanguageFromFilename = (filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase();
    const langMap: Record<string, string> = {
      rs: 'rust',
      toml: 'toml',
      md: 'markdown',
      json: 'json',
      txt: 'plaintext',
    };
    return langMap[ext || ''] || 'plaintext';
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === '`') {
        e.preventDefault();
        setShowTerminal(!showTerminal);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedFile, fileContent, showTerminal]);

  return (
    <div className="relative flex h-screen w-full flex-col bg-[#1e1e1e] text-white overflow-hidden">
      {/* Header */}
      <header className="flex h-[50px] flex-none items-center justify-between border-b border-white/10 px-4 bg-[#252526]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 hover:bg-white/10 rounded transition-colors"
          >
            <Menu className="h-4 w-4 text-gray-400" />
          </button>
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 text-blue-500">
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M42.1739 20.1739L27.8261 5.82609C29.1366 7.13663 28.3989 10.1876 26.2002 13.7654C24.8538 15.9564 22.9595 18.3449 20.6522 20.6522C18.3449 22.9595 15.9564 24.8538 13.7654 26.2002C10.1876 28.3989 7.13663 29.1366 5.82609 27.8261L20.1739 42.1739C21.4845 43.4845 24.5355 42.7467 28.1133 40.548C30.3042 39.2016 32.6927 37.3073 35 35C37.3073 32.6927 39.2016 30.3042 40.548 28.1133C42.7467 24.5355 43.4845 21.4845 42.1739 20.1739Z" fill="currentColor"/>
              </svg>
            </div>
            <h1 className="text-sm font-semibold">Stylus IDE</h1>
          </div>
          {selectedFile && (
            <div className="flex items-center gap-2 ml-4 px-3 py-1 bg-[#1e1e1e] rounded">
              <FileCode className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-300">{selectedFile.name}</span>
              {hasUnsavedChanges && <span className="h-2 w-2 bg-blue-400 rounded-full"></span>}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowTerminal(!showTerminal)}
            className="flex items-center gap-2 px-3 py-1.5 hover:bg-white/10 rounded transition-colors"
            title="Toggle Terminal (Ctrl+`)"
          >
            <TerminalIcon className="h-4 w-4 text-gray-400" />
          </button>
          <button className="p-2 hover:bg-white/10 rounded transition-colors">
            <Bell className="h-4 w-4 text-gray-400" />
          </button>
          <button className="p-2 hover:bg-white/10 rounded transition-colors">
            <SettingsIcon className="h-4 w-4 text-gray-400" />
          </button>
          <Link href="/dashboard">
            <div
              className="ml-2 h-8 w-8 rounded-full bg-cover bg-center cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
              style={{ backgroundImage: 'url("https://api.dicebear.com/7.x/avataaars/svg?seed=user")' }}
            />
          </Link>
        </div>
      </header>

      {/* Toolbar */}
      <Toolbar
        onCompile={handleCompile}
        onDeploy={handleDeploy}
        onSave={handleSave}
        hasUnsavedChanges={hasUnsavedChanges}
      />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* File Tree Sidebar */}
        {!sidebarCollapsed && (
          <div className="w-[280px] flex-none">
            <FileTree
              files={files}
              selectedFile={selectedFile?.id || null}
              onFileSelect={handleFileSelect}
              onFileCreate={handleFileCreate}
              onFileDelete={handleFileDelete}
            />
          </div>
        )}

        {/* Editor Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-hidden">
            {selectedFile ? (
              <CodeEditor
                value={fileContent}
                onChange={handleEditorChange}
                language={getLanguageFromFilename(selectedFile.name)}
                path={selectedFile.id}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Layout className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-400 mb-2">No file selected</h3>
                  <p className="text-sm text-gray-500">Select a file from the explorer to start editing</p>
                </div>
              </div>
            )}
          </div>

          {/* Terminal */}
          {showTerminal && <TerminalPanel onClose={() => setShowTerminal(false)} />}
        </div>
      </div>
    </div>
  );
}
