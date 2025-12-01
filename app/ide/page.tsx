'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { 
  Menu, Bell, Settings as SettingsIcon, FileCode, Layout, Terminal as TerminalIcon,
  Files, Search, GitBranch, PlayCircle, Package, AlertCircle, CheckCircle2,
  X, Code2, Maximize2, ChevronDown, ChevronUp, Wifi
} from 'lucide-react';
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
  const [activeView, setActiveView] = useState<'explorer' | 'search' | 'git' | 'extensions'>('explorer');
  const [panelHeight, setPanelHeight] = useState(250);
  const [isResizing, setIsResizing] = useState(false);
  const [isResizingSidebar, setIsResizingSidebar] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(300);
  const [problems, setProblems] = useState<Array<{ type: 'error' | 'warning'; message: string; line: number }>>([]);
  const [activePanel, setActivePanel] = useState<'terminal' | 'problems' | 'output'>('terminal');

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

  // Panel resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const newHeight = window.innerHeight - e.clientY - 22; // 22px for status bar
      setPanelHeight(Math.max(100, Math.min(newHeight, window.innerHeight - 200)));
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  // Sidebar resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizingSidebar) return;
      const newWidth = e.clientX - 48; // 48px for activity bar
      setSidebarWidth(Math.max(200, Math.min(newWidth, 600)));
    };

    const handleMouseUp = () => {
      setIsResizingSidebar(false);
    };

    if (isResizingSidebar) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizingSidebar]);

  return (
    <div className="relative flex h-screen w-full bg-[#1e1e1e] text-white overflow-hidden select-none">
      {/* VS Code Title Bar */}
      <div className="flex h-[35px] items-center justify-between bg-[#323233] border-b border-[#1e1e1e] px-2 flex-none">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 text-blue-500">
            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M42.1739 20.1739L27.8261 5.82609C29.1366 7.13663 28.3989 10.1876 26.2002 13.7654C24.8538 15.9564 22.9595 18.3449 20.6522 20.6522C18.3449 22.9595 15.9564 24.8538 13.7654 26.2002C10.1876 28.3989 7.13663 29.1366 5.82609 27.8261L20.1739 42.1739C21.4845 43.4845 24.5355 42.7467 28.1133 40.548C30.3042 39.2016 32.6927 37.3073 35 35C37.3073 32.6927 39.2016 30.3042 40.548 28.1133C42.7467 24.5355 43.4845 21.4845 42.1739 20.1739Z" fill="currentColor"/>
            </svg>
          </div>
          <span className="text-xs text-gray-300">Stylus Studio</span>
          {selectedFile && (
            <>
              <span className="text-gray-600">-</span>
              <span className="text-xs text-gray-400">{selectedFile.name}</span>
              {hasUnsavedChanges && <span className="text-xs text-gray-400">●</span>}
            </>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Link href="/dashboard">
            <button className="p-1 hover:bg-white/10 rounded transition-colors">
              <Menu className="h-3.5 w-3.5 text-gray-400" />
            </button>
          </Link>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Content Area */}
        {/* Activity Bar - VS Code Style */}
        <div className="w-[48px] bg-[#333333] border-r border-[#1e1e1e] flex flex-col items-center py-2 gap-1 flex-none">
          <button
            onClick={() => { setActiveView('explorer'); setSidebarCollapsed(false); }}
            className={`w-[48px] h-[48px] flex items-center justify-center relative group ${
              activeView === 'explorer' ? 'text-white' : 'text-gray-400 hover:text-white'
            } transition-colors`}
            title="Explorer (Ctrl+Shift+E)"
          >
            <Files className="h-6 w-6" />
            {activeView === 'explorer' && (
              <div className="absolute left-0 top-0 h-full w-[2px] bg-white"></div>
            )}
          </button>
          <button
            onClick={() => { setActiveView('search'); setSidebarCollapsed(false); }}
            className={`w-[48px] h-[48px] flex items-center justify-center relative group ${
              activeView === 'search' ? 'text-white' : 'text-gray-400 hover:text-white'
            } transition-colors`}
            title="Search (Ctrl+Shift+F)"
          >
            <Search className="h-6 w-6" />
            {activeView === 'search' && (
              <div className="absolute left-0 top-0 h-full w-[2px] bg-white"></div>
            )}
          </button>
          <button
            onClick={() => { setActiveView('git'); setSidebarCollapsed(false); }}
            className={`w-[48px] h-[48px] flex items-center justify-center relative group ${
              activeView === 'git' ? 'text-white' : 'text-gray-400 hover:text-white'
            } transition-colors`}
            title="Source Control (Ctrl+Shift+G)"
          >
            <GitBranch className="h-6 w-6" />
            {activeView === 'git' && (
              <div className="absolute left-0 top-0 h-full w-[2px] bg-white"></div>
            )}
          </button>
          <button
            onClick={() => { setActiveView('extensions'); setSidebarCollapsed(false); }}
            className={`w-[48px] h-[48px] flex items-center justify-center relative group ${
              activeView === 'extensions' ? 'text-white' : 'text-gray-400 hover:text-white'
            } transition-colors`}
            title="Extensions (Ctrl+Shift+X)"
          >
            <Package className="h-6 w-6" />
            {activeView === 'extensions' && (
              <div className="absolute left-0 top-0 h-full w-[2px] bg-white"></div>
            )}
          </button>
          <div className="flex-1"></div>
          <button
            className="w-[48px] h-[48px] flex items-center justify-center text-gray-400 hover:text-white transition-colors"
            title="Settings"
          >
            <SettingsIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Sidebar */}
        {!sidebarCollapsed && (
          <div className="bg-[#252526] border-r border-[#1e1e1e] flex flex-none relative" style={{ width: `${sidebarWidth}px` }}>
            <div className="flex flex-col w-full">
              {/* Sidebar Header */}
              <div className="h-[35px] flex items-center justify-between px-4 border-b border-[#1e1e1e]">
                <span className="text-xs font-medium text-gray-300 uppercase tracking-wider">
                  {activeView === 'explorer' && 'Explorer'}
                  {activeView === 'search' && 'Search'}
                  {activeView === 'git' && 'Source Control'}
                  {activeView === 'extensions' && 'Extensions'}
                </span>
                <button
                  onClick={() => setSidebarCollapsed(true)}
                  className="p-1 hover:bg-white/10 rounded transition-colors"
                >
                  <X className="h-3.5 w-3.5 text-gray-400" />
                </button>
              </div>

              {/* Sidebar Content */}
              <div className="flex-1 overflow-hidden">
              {activeView === 'explorer' && (
                <FileTree
                  files={files}
                  selectedFile={selectedFile?.id || null}
                  onFileSelect={handleFileSelect}
                  onFileCreate={handleFileCreate}
                  onFileDelete={handleFileDelete}
                />
              )}
              {activeView === 'search' && (
                <div className="p-4">
                  <input
                    type="text"
                    placeholder="Search in files..."
                    className="w-full px-3 py-2 bg-[#3c3c3c] text-white text-sm rounded border border-[#555] focus:border-blue-500 focus:outline-none"
                  />
                  <div className="mt-4 text-sm text-gray-500">
                    No results found
                  </div>
                </div>
              )}
              {activeView === 'git' && (
                <div className="p-4">
                  <div className="text-sm text-gray-400 space-y-2">
                    <div className="flex items-center gap-2">
                      <GitBranch className="h-4 w-4" />
                      <span>master</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-4">No changes</p>
                  </div>
                </div>
              )}
              {activeView === 'extensions' && (
                <div className="p-4">
                  <input
                    type="text"
                    placeholder="Search Extensions"
                    className="w-full px-3 py-2 bg-[#3c3c3c] text-white text-sm border border-[#1e1e1e] rounded focus:outline-none focus:border-blue-500"
                  />
                  <div className="mt-4 space-y-2">
                    <div className="text-xs text-gray-400">Recommended</div>
                    <div className="p-2 hover:bg-white/5 rounded cursor-pointer">
                      <div className="text-sm text-white">Rust Analyzer</div>
                      <div className="text-xs text-gray-500">Installed</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Resize Handle */}
            <div
              className="absolute top-0 right-0 h-full w-[4px] cursor-col-resize hover:bg-blue-500/50 active:bg-blue-500 transition-colors z-10"
              onMouseDown={() => setIsResizingSidebar(true)}
            />
          </div>
          </div>
        )}

        {/* Editor Group */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Toolbar */}
          <Toolbar
            onCompile={handleCompile}
            onDeploy={handleDeploy}
            onSave={handleSave}
            hasUnsavedChanges={hasUnsavedChanges}
          />

          {/* Tabs Bar */}
          {selectedFile && (
            <div className="h-[35px] flex items-center bg-[#252526] border-b border-[#1e1e1e] overflow-x-auto flex-none">
              <div className="flex items-center h-full px-3 bg-[#1e1e1e] border-r border-[#1e1e1e] gap-2 min-w-fit cursor-pointer hover:bg-[#2a2d2e] transition-colors">
                <FileCode className="h-3.5 w-3.5 text-gray-400" />
                <span className="text-[13px] text-gray-300">{selectedFile.name}</span>
                {hasUnsavedChanges && <span className="text-white">●</span>}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFile(null);
                    setFileContent('');
                  }}
                  className="ml-2 p-0.5 hover:bg-white/10 rounded transition-colors"
                >
                  <X className="h-3 w-3 text-gray-400" />
                </button>
              </div>
            </div>
          )}

          {/* Editor */}
          <div className="flex-1 overflow-hidden" style={{ height: showTerminal ? `calc(100% - ${panelHeight}px)` : '100%' }}>
            {selectedFile ? (
              <CodeEditor
                value={fileContent}
                onChange={handleEditorChange}
                language={getLanguageFromFilename(selectedFile.name)}
                path={selectedFile.id}
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-[#1e1e1e]">
                <div className="text-center">
                  <Code2 className="h-20 w-20 text-gray-700 mx-auto mb-4" />
                  <h3 className="text-sm font-medium text-gray-400 mb-2">No file open</h3>
                  <p className="text-xs text-gray-600">Select a file from the explorer to start editing</p>
                </div>
              </div>
            )}
          </div>

          {/* Panel (Terminal, Problems, Output) */}
          {showTerminal && (
            <div
              className="border-t border-[#1e1e1e] bg-[#1e1e1e] flex flex-col"
              style={{ height: `${panelHeight}px` }}
            >
              {/* Resize Handle */}
              <div
                className="h-[4px] hover:bg-blue-500/50 cursor-ns-resize active:bg-blue-500 transition-colors"
                onMouseDown={() => setIsResizing(true)}
              />

              {/* Panel Tabs */}
              <div className="flex items-center h-[35px] bg-[#252526] border-b border-[#1e1e1e] px-2 gap-1">
                <button
                  onClick={() => setActivePanel('terminal')}
                  className={`px-3 py-1 text-xs rounded ${
                    activePanel === 'terminal'
                      ? 'bg-[#1e1e1e] text-white'
                      : 'text-gray-400 hover:text-white'
                  } transition-colors`}
                >
                  Terminal
                </button>
                <button
                  onClick={() => setActivePanel('problems')}
                  className={`px-3 py-1 text-xs rounded flex items-center gap-1 ${
                    activePanel === 'problems'
                      ? 'bg-[#1e1e1e] text-white'
                      : 'text-gray-400 hover:text-white'
                  } transition-colors`}
                >
                  Problems
                  {problems.length > 0 && (
                    <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                      {problems.length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setActivePanel('output')}
                  className={`px-3 py-1 text-xs rounded ${
                    activePanel === 'output'
                      ? 'bg-[#1e1e1e] text-white'
                      : 'text-gray-400 hover:text-white'
                  } transition-colors`}
                >
                  Output
                </button>
                <div className="flex-1"></div>
                <button
                  onClick={() => setPanelHeight(panelHeight === 250 ? 400 : 250)}
                  className="p-1 hover:bg-white/10 rounded transition-colors"
                  title="Maximize Panel"
                >
                  {panelHeight > 300 ? (
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  ) : (
                    <ChevronUp className="h-4 w-4 text-gray-400" />
                  )}
                </button>
                <button
                  onClick={() => setShowTerminal(false)}
                  className="p-1 hover:bg-white/10 rounded transition-colors"
                  title="Close Panel"
                >
                  <X className="h-4 w-4 text-gray-400" />
                </button>
              </div>

              {/* Panel Content */}
              <div className="flex-1 overflow-hidden">
                {activePanel === 'terminal' && <TerminalPanel />}
                {activePanel === 'problems' && (
                  <div className="h-full overflow-y-auto p-2 font-mono text-xs">
                    {problems.length === 0 ? (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        <CheckCircle2 className="h-5 w-5 mr-2" />
                        No problems detected
                      </div>
                    ) : (
                      problems.map((problem, idx) => (
                        <div key={idx} className="flex items-start gap-2 p-2 hover:bg-white/5 cursor-pointer">
                          {problem.type === 'error' ? (
                            <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                          )}
                          <div>
                            <div className="text-gray-300">{problem.message}</div>
                            <div className="text-gray-600 text-[11px]">
                              {selectedFile?.name} [Ln {problem.line}]
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
                {activePanel === 'output' && (
                  <div className="h-full overflow-y-auto p-2 font-mono text-xs text-gray-300">
                    <div>Build output will appear here...</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status Bar - VS Code Style (Bottom) */}
      <div className="h-[22px] bg-[#007acc] flex items-center justify-between px-3 text-xs text-white flex-none w-full">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 cursor-pointer hover:bg-white/10 px-2 py-0.5 rounded">
            <GitBranch className="h-3 w-3" />
            <span>master</span>
          </div>
          <div className="flex items-center gap-1.5 cursor-pointer hover:bg-white/10 px-2 py-0.5 rounded" onClick={() => setActivePanel('problems')}>
            <AlertCircle className="h-3 w-3" />
            <span>0</span>
          </div>
          <div className="flex items-center gap-1.5 cursor-pointer hover:bg-white/10 px-2 py-0.5 rounded" onClick={() => setActivePanel('problems')}>
            <CheckCircle2 className="h-3 w-3" />
            <span>0</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {selectedFile && (
            <>
              <span className="cursor-default">Ln 1, Col 1</span>
              <span className="cursor-default">{getLanguageFromFilename(selectedFile.name).toUpperCase()}</span>
              <span className="cursor-default">UTF-8</span>
            </>
          )}
          <div className="flex items-center gap-1.5 cursor-pointer hover:bg-white/10 px-2 py-0.5 rounded">
            <Wifi className="h-3 w-3" />
          </div>
        </div>
      </div>
    </div>
  );
}
