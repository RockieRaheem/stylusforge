'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { useProject } from '@/lib/context/ProjectContext';
import { projectService } from '@/lib/services/project.service';
import { notifyProjectCreated } from '@/lib/events/dashboard-events';
import IDEProjectWrapper from '@/components/IDEProjectWrapper';
import WalletBalance from '@/components/WalletBalance';
import { 
  Menu, Bell, Settings as SettingsIcon, FileCode, Layout, Terminal as TerminalIcon,
  Files, Search, GitBranch, PlayCircle, Package, AlertCircle, CheckCircle2,
  X, Code2, Maximize2, ChevronDown, ChevronUp, Wifi
} from 'lucide-react';
import FileTree, { FileNode } from './components/FileTree';
import Toolbar from './components/Toolbar';
import { DEFAULT_CONTRACT, CARGO_TOML, README_MD } from './templates';
import TemplateModal from '@/components/TemplateModal';
import { CodeTemplate } from '@/lib/data/code-templates';
import GasProfiler from '@/components/GasProfiler';
import { GasProfile } from '@/components/GasProfiler';
import { analyzeContract, getMockGasProfile } from '@/lib/utils/gas-analyzer';

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
  const [sidebarWidth, setSidebarWidth] = useState(200);
  const [problems, setProblems] = useState<Array<{ type: 'error' | 'warning'; message: string; line: number }>>([]);
  const [activePanel, setActivePanel] = useState<'terminal' | 'problems' | 'output' | 'gas'>('terminal');
  const [buildOutput, setBuildOutput] = useState<string[]>([]);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [gasProfile, setGasProfile] = useState<GasProfile | null>(null);
  const [isAnalyzingGas, setIsAnalyzingGas] = useState(false);
  const [creatingNew, setCreatingNew] = useState<{ type: 'file' | 'folder'; parentId: string | null } | null>(null);
  const [newItemName, setNewItemName] = useState('');
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [isSavingProject, setIsSavingProject] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  
  // User profile dropdown
  const { userData, signOut } = useAuth();
  const { currentProject, updateCurrentProject } = useProject();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const displayName = userData?.displayName || userData?.email?.split('@')[0] || '';
  const initials = displayName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
  
  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

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

  const handleTemplateSelect = (template: CodeTemplate) => {
    // Create new file with template code
    const newFile: FileNode = {
      id: `${Date.now()}-${template.name}.rs`,
      name: `${template.name.toLowerCase().replace(/\s+/g, '_')}.rs`,
      type: 'file',
      content: template.code,
    };

    // Add to src folder or root
    const srcFolder = files.find(f => f.name === 'src' && f.type === 'folder');
    if (srcFolder && srcFolder.children) {
      const updatedFiles = files.map(f => {
        if (f.id === 'src') {
          return {
            ...f,
            children: [...(f.children || []), newFile]
          };
        }
        return f;
      });
      setFiles(updatedFiles);
    } else {
      setFiles([...files, newFile]);
    }

    // Select the new file
    setSelectedFile(newFile);
    setFileContent(template.code);
    setHasUnsavedChanges(true);
  };

  const handleSave = async () => {
    if (selectedFile) {
      updateFileContent(selectedFile.id, fileContent);
      setHasUnsavedChanges(false);
      
      // Auto-save project to Firebase
      if (userData?.uid && selectedFile.name.endsWith('.rs')) {
        try {
          setIsSavingProject(true);
          
          if (currentProjectId) {
            // Update existing project
            await projectService.updateProject(currentProjectId, {
              code: fileContent,
              name: selectedFile.name.replace('.rs', ''),
            });
            console.log('✅ Project updated in Firebase');
          } else {
            // Create new project
            const projectId = await projectService.createProject(
              userData.uid,
              selectedFile.name.replace('.rs', ''),
              fileContent,
              'rust',
              'Created in IDE'
            );
            setCurrentProjectId(projectId);
            notifyProjectCreated({ projectId, projectName: selectedFile.name.replace('.rs', '') });
            console.log('✅ Project created in Firebase:', projectId);
          }
        } catch (error) {
          console.error('❌ Failed to save project to Firebase:', error);
        } finally {
          setIsSavingProject(false);
        }
      }
    }
  };

  const startCreatingNew = (type: 'file' | 'folder', parentId: string | null = null) => {
    setCreatingNew({ type, parentId });
    setNewItemName('');
  };

  const handleFileCreate = (parentId: string | null, type: 'file' | 'folder', name: string) => {
    if (!name.trim()) return;
    
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
    
    setCreatingNew(null);
    setNewItemName('');
  };

  const completeCreation = () => {
    if (creatingNew && newItemName.trim()) {
      handleFileCreate(creatingNew.parentId, creatingNew.type, newItemName);
    } else {
      setCreatingNew(null);
      setNewItemName('');
    }
  };

  const cancelCreation = () => {
    setCreatingNew(null);
    setNewItemName('');
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
    if (!selectedFile || !fileContent) {
      return {
        success: false,
        message: 'No file selected',
        logs: ['Error: Select a file to compile'],
      };
    }

    try {
      setActivePanel('output');
      setShowTerminal(true);
      setBuildOutput(['🔧 Starting compilation...', '']);

      const response = await fetch('/api/compile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: fileContent,
          language: 'rust',
          projectName: selectedFile.name.replace('.rs', ''),
        }),
      });

      const result = await response.json();

      if (result.success) {
        const logs = [
          '🔧 Compiling Rust code...',
          '✓ Compilation successful!',
          `  Bytecode: ${result.bytecode?.slice(0, 42)}...`,
          `  WASM size: ${result.wasmSize} bytes`,
          result.gasEstimate && `  Gas estimate: ${result.gasEstimate}`,
          result.warnings && result.warnings.length > 0 && '',
          result.warnings && result.warnings.length > 0 && '⚠ Warnings:',
          ...(result.warnings || []).map((w: string) => `  ${w}`),
          result.stdout && '',
          result.stdout && 'Output:',
          result.stdout && `  ${result.stdout}`,
        ].filter(Boolean);

        // Update build output panel
        setBuildOutput(logs as string[]);

        // Clear problems on success
        setProblems([]);

        // Analyze gas usage
        if (result.bytecode) {
          setIsAnalyzingGas(true);
          try {
            // Convert hex bytecode to Uint8Array
            const hexString = result.bytecode.replace(/^0x/, '');
            const wasmBytes = new Uint8Array(hexString.match(/.{1,2}/g)?.map((byte: string) => parseInt(byte, 16)) || []);
            const profile = analyzeContract(wasmBytes);
            setGasProfile(profile);
            
            // Add gas analysis to build output
            if (profile) {
              setBuildOutput(prev => [
                ...prev,
                '',
                '⚡ Gas Analysis:',
                `  Total gas: ${profile.totalGas.toLocaleString()}`,
                `  Estimated cost: $${profile.estimatedCost.toFixed(4)}`,
                `  Operations analyzed: ${profile.operations.length}`,
                '',
                '💡 View detailed breakdown in Gas Profiler tab',
              ]);
            }
          } catch (error) {
            console.error('Gas analysis error:', error);
          } finally {
            setIsAnalyzingGas(false);
          }
        }

        return {
          success: true,
          message: 'Compilation successful! ✓',
          logs,
        };
      } else {
        // Parse errors and add to problems panel
        const errorProblems = (result.errors || []).map((err: string, idx: number) => ({
          type: 'error' as const,
          message: err,
          line: idx + 1,
        }));

        const warningProblems = (result.warnings || []).map((warn: string, idx: number) => ({
          type: 'warning' as const,
          message: warn,
          line: idx + 1,
        }));

        setProblems([...errorProblems, ...warningProblems]);

        const errorLogs = [
          '❌ Compilation failed',
          '',
          'Errors:',
          ...(result.errors || []),
          result.warnings && result.warnings.length > 0 && '',
          result.warnings && result.warnings.length > 0 && 'Warnings:',
          ...(result.warnings || []),
        ].filter(Boolean);

        setBuildOutput(errorLogs as string[]);

        return {
          success: false,
          message: 'Compilation failed',
          logs: errorLogs as string[],
        };
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Compilation failed';
      setProblems([{
        type: 'error',
        message: errorMessage,
        line: 1,
      }]);

      const errorLogs = [
        '❌ Compilation failed',
        '',
        'Error: ' + errorMessage,
        'Hint: Check your network connection or try again',
      ];

      setBuildOutput(errorLogs);

      return {
        success: false,
        message: 'Compilation failed',
        logs: errorLogs,
      };
    }
  };

  const handleDeploy = () => {
    // Save current contract to localStorage
    localStorage.setItem('currentContract', fileContent);
    localStorage.setItem('contractName', selectedFile?.name || 'Contract.rs');
    
    // Navigate to deploy page
    router.push('/deploy');
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

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setOpenMenu(null);
    if (openMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [openMenu]);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+S - Save file
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
      // Ctrl+` - Toggle terminal
      if ((e.ctrlKey || e.metaKey) && e.key === '`') {
        e.preventDefault();
        setShowTerminal(!showTerminal);
      }
      // Ctrl+B - Toggle sidebar
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        setSidebarCollapsed(!sidebarCollapsed);
      }
      // F5 - Compile
      if (e.key === 'F5') {
        e.preventDefault();
        handleCompile();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedFile, fileContent, showTerminal, sidebarCollapsed]);

  return (
    <IDEProjectWrapper
      onProjectLoad={(id, name, code) => {
        // Load the project code into editor
        setFileContent(code);
        setCurrentProjectId(id);
      }}
      onProjectSave={async (code) => {
        // Save is already handled by updateCurrentProject
        await updateCurrentProject(code);
      }}
    >
      <div className="relative flex flex-col h-screen w-full bg-[#1e1e1e] text-white overflow-hidden">
        {/* VS Code Title Bar */}
        <div className="flex h-[35px] items-center justify-between bg-[#323233] border-b border-[#2d2d30] px-3 flex-none shadow-sm select-none">
          <div className="flex items-center gap-2.5">
            <div className="h-4 w-4 text-[#0098ff]">
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M42.1739 20.1739L27.8261 5.82609C29.1366 7.13663 28.3989 10.1876 26.2002 13.7654C24.8538 15.9564 22.9595 18.3449 20.6522 20.6522C18.3449 22.9595 15.9564 24.8538 13.7654 26.2002C10.1876 28.3989 7.13663 29.1366 5.82609 27.8261L20.1739 42.1739C21.4845 43.4845 24.5355 42.7467 28.1133 40.548C30.3042 39.2016 32.6927 37.3073 35 35C37.3073 32.6927 39.2016 30.3042 40.548 28.1133C42.7467 24.5355 43.4845 21.4845 42.1739 20.1739Z" fill="currentColor"/>
              </svg>
            </div>
            <span className="text-[13px] text-[#cccccc] font-normal tracking-tight">Stylus Studio</span>
            {selectedFile && (
              <>
                <span className="text-[#6e6e6e] text-[13px] mx-1">—</span>
                <span className="text-[13px] text-[#999999] font-normal">{selectedFile.name}</span>
                {hasUnsavedChanges && <span className="text-[13px] text-white ml-1.5">●</span>}
              </>
            )}
          </div>

          {/* Menu Bar */}
          <div className="flex items-center gap-1 ml-6">
            <div className="relative">
              <button
                onClick={() => setOpenMenu(openMenu === 'file' ? null : 'file')}
                className="px-2 py-1 text-[13px] text-[#cccccc] hover:bg-[#2d2d30] rounded-sm transition-colors"
              >
                File
              </button>
              {openMenu === 'file' && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-[#252526] border border-[#454545] rounded-sm shadow-xl z-50">
                  <button className="w-full px-4 py-2 text-left text-[13px] text-[#cccccc] hover:bg-[#2a2d2e] flex items-center justify-between">
                    New File
                    <span className="text-[#858585] text-[11px]">Ctrl+N</span>
                  </button>
                  <button 
                    onClick={() => {
                      handleSave();
                      setOpenMenu(null);
                    }}
                    disabled={isSavingProject}
                    className="w-full px-4 py-2 text-left text-[13px] text-[#cccccc] hover:bg-[#2a2d2e] flex items-center justify-between disabled:opacity-50"
                  >
                    {isSavingProject ? 'Saving...' : 'Save'}
                    <span className="text-[#858585] text-[11px]">Ctrl+S</span>
                  </button>
                  <div className="h-[1px] bg-[#454545] my-1"></div>
                  <Link href="/">
                    <button className="w-full px-4 py-2 text-left text-[13px] text-[#cccccc] hover:bg-[#2a2d2e]">
                      Home
                    </button>
                  </Link>
                  <Link href="/dashboard">
                    <button className="w-full px-4 py-2 text-left text-[13px] text-[#cccccc] hover:bg-[#2a2d2e]">
                      Dashboard
                    </button>
                  </Link>
                  <Link href="/tutorial">
                    <button className="w-full px-4 py-2 text-left text-[13px] text-[#cccccc] hover:bg-[#2a2d2e]">
                      Tutorials
                    </button>
                  </Link>
                </div>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => setOpenMenu(openMenu === 'edit' ? null : 'edit')}
                className="px-2 py-1 text-[13px] text-[#cccccc] hover:bg-[#2d2d30] rounded-sm transition-colors"
              >
                Edit
              </button>
              {openMenu === 'edit' && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-[#252526] border border-[#454545] rounded-sm shadow-xl z-50">
                  <button className="w-full px-4 py-2 text-left text-[13px] text-[#cccccc] hover:bg-[#2a2d2e] flex items-center justify-between">
                    Undo
                    <span className="text-[#858585] text-[11px]">Ctrl+Z</span>
                  </button>
                  <button className="w-full px-4 py-2 text-left text-[13px] text-[#cccccc] hover:bg-[#2a2d2e] flex items-center justify-between">
                    Redo
                    <span className="text-[#858585] text-[11px]">Ctrl+Y</span>
                  </button>
                  <div className="h-[1px] bg-[#454545] my-1"></div>
                  <button className="w-full px-4 py-2 text-left text-[13px] text-[#cccccc] hover:bg-[#2a2d2e] flex items-center justify-between">
                    Find
                    <span className="text-[#858585] text-[11px]">Ctrl+F</span>
                  </button>
                </div>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => setOpenMenu(openMenu === 'view' ? null : 'view')}
                className="px-2 py-1 text-[13px] text-[#cccccc] hover:bg-[#2d2d30] rounded-sm transition-colors"
              >
                View
              </button>
              {openMenu === 'view' && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-[#252526] border border-[#454545] rounded-sm shadow-xl z-50">
                  <button
                    onClick={() => {
                      setSidebarCollapsed(!sidebarCollapsed);
                      setOpenMenu(null);
                    }}
                    className="w-full px-4 py-2 text-left text-[13px] text-[#cccccc] hover:bg-[#2a2d2e] flex items-center justify-between"
                  >
                    Toggle Sidebar
                    <span className="text-[#858585] text-[11px]">Ctrl+B</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowTerminal(!showTerminal);
                      setOpenMenu(null);
                    }}
                    className="w-full px-4 py-2 text-left text-[13px] text-[#cccccc] hover:bg-[#2a2d2e] flex items-center justify-between"
                  >
                    Toggle Terminal
                    <span className="text-[#858585] text-[11px]">Ctrl+`</span>
                  </button>
                </div>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => setOpenMenu(openMenu === 'run' ? null : 'run')}
                className="px-2 py-1 text-[13px] text-[#cccccc] hover:bg-[#2d2d30] rounded-sm transition-colors"
              >
                Run
              </button>
              {openMenu === 'run' && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-[#252526] border border-[#454545] rounded-sm shadow-xl z-50">
                  <button
                    onClick={() => {
                      handleCompile();
                      setOpenMenu(null);
                    }}
                    className="w-full px-4 py-2 text-left text-[13px] text-[#cccccc] hover:bg-[#2a2d2e] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <PlayCircle className="h-4 w-4" />
                      Compile Project
                    </div>
                    <span className="text-[#858585] text-[11px]">F5</span>
                  </button>
                  <button
                    onClick={() => {
                      handleDeploy();
                      setOpenMenu(null);
                    }}
                    className="w-full px-4 py-2 text-left text-[13px] text-[#cccccc] hover:bg-[#2a2d2e] flex items-center gap-2"
                  >
                    <Package className="h-4 w-4" />
                    Deploy to Arbitrum
                  </button>
                  <button
                    onClick={() => {
                      handleDeploy();
                      setOpenMenu(null);
                    }}
                    className="w-full px-4 py-2 text-left text-[13px] text-[#cccccc] hover:bg-[#2a2d2e] flex items-center gap-2"
                  >
                    <Package className="h-4 w-4" />
                    Deploy to Arbitrum
                  </button>
                </div>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => {
                  setShowTerminal(true);
                  setActivePanel('terminal');
                  setOpenMenu(null);
                }}
                className="px-2 py-1 text-[13px] text-[#cccccc] hover:bg-[#2d2d30] rounded-sm transition-colors flex items-center gap-1.5"
              >
                <TerminalIcon className="h-3.5 w-3.5" />
                Terminal
              </button>
            </div>

            <div className="relative">
              <button
                onClick={() => setIsTemplateModalOpen(true)}
                className="px-3 py-1 text-[13px] text-white bg-blue-600 hover:bg-blue-700 rounded-sm transition-colors flex items-center gap-1.5 font-medium"
              >
                <Code2 className="h-3.5 w-3.5" />
                Templates
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative flex h-9 w-9 items-center justify-center rounded-md border border-[#454545] hover:border-[#858585] hover:bg-[#2d2d30] transition-all">
              <Bell className="h-3.5 w-3.5 text-[#858585] hover:text-[#cccccc] transition-colors" />
              <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-[#3fb950] rounded-full"></span>
            </button>
            
            {/* Wallet Balance */}
            <WalletBalance showFull />
            
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors group"
              >
                {userData?.photoURL && !imageError ? (
                  <img
                    alt={displayName}
                    className="w-8 h-8 rounded-full border-2 border-purple-500/50 group-hover:border-purple-500 transition-colors"
                    src={userData.photoURL}
                    onError={() => setImageError(true)}
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#a371f7] to-[#7d8590] border-2 border-purple-500/50 group-hover:border-purple-500 flex items-center justify-center text-xs font-semibold transition-colors">
                    {initials}
                  </div>
                )}
                <span className="text-sm font-medium text-[#cccccc] hidden md:block">{displayName}</span>
                <svg 
                  className={`w-4 h-4 text-[#858585] transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-[#252526] border border-[#454545] rounded-lg shadow-xl z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-[#454545]">
                    <p className="text-sm font-medium text-white">{displayName}</p>
                    <p className="text-xs text-[#858585] mt-0.5">{userData?.email}</p>
                  </div>
                  
                  <div className="py-1">
                    <Link href="/dashboard" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-[#cccccc] hover:bg-[#2d2d30] transition-colors">
                      <Layout className="h-4 w-4" />
                      Dashboard
                    </Link>
                    <Link href="/ide" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-[#cccccc] hover:bg-[#2d2d30] transition-colors">
                      <Code2 className="h-4 w-4" />
                      IDE
                    </Link>
                    <Link href="/tutorial" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-[#cccccc] hover:bg-[#2d2d30] transition-colors">
                      <FileCode className="h-4 w-4" />
                      Tutorials
                    </Link>
                    <button onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-[#cccccc] hover:bg-[#2d2d30] transition-colors w-full">
                      <SettingsIcon className="h-4 w-4" />
                      Settings
                    </button>
                  </div>
                  
                  <div className="border-t border-[#454545] py-1">
                    <button 
                      onClick={handleSignOut}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors w-full"
                    >
                      <X className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Activity Bar - VS Code Style */}
          <div className="w-[48px] bg-[#333333] border-r border-[#2d2d30] flex flex-col items-center py-3 gap-0 flex-none">
            <button
              onClick={() => { setActiveView('explorer'); setSidebarCollapsed(false); }}
              className={`w-[48px] h-[48px] flex items-center justify-center relative group ${
                activeView === 'explorer' ? 'text-white' : 'text-[#858585] hover:text-white'
              } transition-all duration-150`}
              title="Explorer (Ctrl+Shift+E)"
            >
              <Files className="h-[22px] w-[22px]" />
              {activeView === 'explorer' && (
                <div className="absolute left-0 top-0 h-full w-[2px] bg-white shadow-[0_0_8px_rgba(255,255,255,0.6)]"></div>
              )}
            </button>
            <button
              onClick={() => { setActiveView('search'); setSidebarCollapsed(false); }}
              className={`w-[48px] h-[48px] flex items-center justify-center relative group ${
                activeView === 'search' ? 'text-white' : 'text-[#858585] hover:text-white'
              } transition-all duration-150`}
              title="Search (Ctrl+Shift+F)"
            >
              <Search className="h-[22px] w-[22px]" />
              {activeView === 'search' && (
                <div className="absolute left-0 top-0 h-full w-[2px] bg-white shadow-[0_0_8px_rgba(255,255,255,0.6)]"></div>
              )}
            </button>
            <button
              onClick={() => { setActiveView('git'); setSidebarCollapsed(false); }}
              className={`w-[48px] h-[48px] flex items-center justify-center relative group ${
                activeView === 'git' ? 'text-white' : 'text-[#858585] hover:text-white'
              } transition-all duration-150`}
              title="Source Control (Ctrl+Shift+G)"
            >
              <GitBranch className="h-[22px] w-[22px]" />
              {activeView === 'git' && (
                <div className="absolute left-0 top-0 h-full w-[2px] bg-white shadow-[0_0_8px_rgba(255,255,255,0.6)]"></div>
              )}
            </button>
            <button
              onClick={() => { setActiveView('extensions'); setSidebarCollapsed(false); }}
              className={`w-[48px] h-[48px] flex items-center justify-center relative group ${
                activeView === 'extensions' ? 'text-white' : 'text-[#858585] hover:text-white'
              } transition-all duration-150`}
              title="Extensions (Ctrl+Shift+X)"
            >
              <Package className="h-[22px] w-[22px]" />
              {activeView === 'extensions' && (
                <div className="absolute left-0 top-0 h-full w-[2px] bg-white shadow-[0_0_8px_rgba(255,255,255,0.6)]"></div>
              )}
            </button>
            <div className="flex-1"></div>
            <button
              className="w-[48px] h-[48px] flex items-center justify-center text-[#858585] hover:text-white transition-all duration-150"
              title="Settings"
            >
              <SettingsIcon className="h-[22px] w-[22px]" />
            </button>
          </div>

          {/* Sidebar */}
          {!sidebarCollapsed && (
            <div className="bg-[#252526] border-r border-[#2d2d30] flex flex-none relative shadow-[2px_0_8px_rgba(0,0,0,0.2)]" style={{ width: `${sidebarWidth}px` }}>
              <div className="flex flex-col w-full">
                {/* Sidebar Header */}
                <div className="h-[35px] flex items-center justify-between px-3 border-b border-[#2d2d30]">
                  <span className="text-[11px] font-semibold text-[#cccccc] uppercase tracking-wider">
                    {activeView === 'explorer' && 'Explorer'}
                    {activeView === 'search' && 'Search'}
                    {activeView === 'git' && 'Source Control'}
                    {activeView === 'extensions' && 'Extensions'}
                  </span>
                  <div className="flex items-center gap-0.5">
                    {activeView === 'explorer' && (
                      <>
                        <button
                          onClick={() => startCreatingNew('file')}
                          className="p-1 hover:bg-[#2d2d30] rounded-sm transition-colors duration-150"
                          title="New File"
                        >
                          <FileCode className="h-3.5 w-3.5 text-[#858585] hover:text-[#cccccc] transition-colors" />
                        </button>
                        <button
                          onClick={() => startCreatingNew('folder')}
                          className="p-1 hover:bg-[#2d2d30] rounded-sm transition-colors duration-150"
                          title="New Folder"
                        >
                          <Files className="h-3.5 w-3.5 text-[#858585] hover:text-[#cccccc] transition-colors" />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => setSidebarCollapsed(true)}
                      className="p-1 hover:bg-[#2d2d30] rounded-sm transition-colors duration-150"
                    >
                      <X className="h-3.5 w-3.5 text-[#858585] hover:text-[#cccccc] transition-colors" />
                    </button>
                  </div>
                </div>

                {/* Sidebar Content */}
                <div className="flex-1 overflow-hidden">
                  {activeView === 'explorer' && (
                    <div className="h-full overflow-y-auto overflow-x-hidden px-2 py-2">
                    {creatingNew && (
                      <div className="flex items-center gap-1.5 px-2 py-1 mb-1">
                        {creatingNew.type === 'file' ? (
                          <FileCode className="h-4 w-4 text-[#858585] flex-shrink-0" />
                        ) : (
                          <Files className="h-4 w-4 text-[#858585] flex-shrink-0" />
                        )}
                        <input
                          type="text"
                          value={newItemName}
                          onChange={(e) => setNewItemName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              completeCreation();
                            } else if (e.key === 'Escape') {
                              cancelCreation();
                            }
                          }}
                          onBlur={completeCreation}
                          autoFocus
                          placeholder={creatingNew.type === 'file' ? 'filename.rs' : 'foldername'}
                          className="flex-1 bg-[#3c3c3c] text-[#cccccc] text-[13px] px-2 py-0.5 border border-[#0098ff] outline-none rounded-sm"
                        />
                      </div>
                    )}
                    <FileTree
                      files={files}
                      selectedFile={selectedFile?.id || null}
                      onFileSelect={handleFileSelect}
                      onFileCreate={handleFileCreate}
                      onFileDelete={handleFileDelete}
                    />
                  </div>
                )}
                {activeView === 'search' && (
                  <div className="p-4">
                    <input
                      type="text"
                      placeholder="Search in files..."
                      className="w-full px-3 py-1.5 bg-[#3c3c3c] text-[#cccccc] text-[13px] rounded-sm border border-[#3c3c3c] focus:border-[#007acc] focus:outline-none transition-colors placeholder:text-[#6e6e6e]"
                    />
                    <div className="mt-6 text-[#6e6e6e] text-center">
                      No results
                    </div>
                  </div>
                )}
                {activeView === 'git' && (
                  <div className="p-4">
                    <div className="text-[13px] text-[#cccccc] space-y-3">
                      <div className="flex items-center gap-2.5 font-medium">
                        <GitBranch className="h-4 w-4" />
                        <span>master</span>
                      </div>
                      <p className="text-[13px] text-[#6e6e6e] mt-6">No changes</p>
                    </div>
                  </div>
                )}
                {activeView === 'extensions' && (
                  <div className="p-4">
                    <input
                      type="text"
                      placeholder="Search Extensions"
                      className="w-full px-3 py-1.5 bg-[#3c3c3c] text-[#cccccc] text-[13px] border border-[#3c3c3c] rounded-sm focus:outline-none focus:border-[#007acc] transition-colors placeholder:text-[#6e6e6e]"
                    />
                    <div className="mt-5 space-y-2">
                      <div className="text-[11px] text-[#858585] uppercase font-semibold tracking-wider mb-3">Recommended</div>
                      <div className="p-2.5 hover:bg-[#2d2d30] rounded-sm cursor-pointer transition-colors duration-150">
                        <div className="text-[13px] text-[#cccccc] font-medium">Rust Analyzer</div>
                        <div className="text-[12px] text-[#6e6e6e] mt-0.5">Installed</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Resize Handle */}
              <div
                className="absolute top-0 right-0 h-full w-[4px] cursor-col-resize hover:bg-[#007acc]/60 active:bg-[#007acc] transition-all duration-150 z-10"
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
              <div className="h-[35px] flex items-center bg-[#252526] border-b border-[#2d2d30] overflow-x-auto flex-none">
                <div className="flex items-center h-full px-4 bg-[#1e1e1e] border-r border-[#252526] gap-2.5 min-w-fit cursor-pointer hover:bg-[#2a2d2e] transition-colors duration-150 group">
                  <FileCode className="h-4 w-4 text-[#858585]" />
                  <span className="text-[13px] text-[#cccccc] font-normal">{selectedFile.name}</span>
                  {hasUnsavedChanges && <span className="text-[#cccccc] text-[16px] leading-none">●</span>}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFile(null);
                      setFileContent('');
                    }}
                    className="ml-1 p-1 opacity-0 group-hover:opacity-100 hover:bg-[#3e3e42] rounded-sm transition-all duration-150"
                  >
                    <X className="h-3.5 w-3.5 text-[#858585] hover:text-[#cccccc]" />
                  </button>
                </div>
              </div>
            )}

            {/* Editor */}
            <div className="flex-1 overflow-hidden" style={{ height: showTerminal ? `calc(100% - ${panelHeight}px)` : '100%' }}>
              {selectedFile ? (
                <>
                  {/* Info Banner for Stylus SDK templates */}
                  {fileContent.includes('stylus_sdk') && fileContent.includes('NOTE:') && (
                    <div className="bg-blue-500/10 border-b border-blue-500/30 px-4 py-2 flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-blue-400 flex-shrink-0" />
                        <span className="text-sm text-blue-300">
                          <strong>Template Info:</strong> This contract uses Stylus SDK and requires deployment to compile. 
                          Browser errors are expected - click <strong>"Deploy"</strong> to build and deploy to Arbitrum.
                        </span>
                      </div>
                    </div>
                  )}
                  <CodeEditor
                    value={fileContent}
                    onChange={handleEditorChange}
                    language={getLanguageFromFilename(selectedFile.name)}
                    path={selectedFile.id}
                  />
                </>
              ) : (
                <div className="flex items-center justify-center h-full bg-[#1e1e1e]">
                  <div className="text-center">
                    <Code2 className="h-24 w-24 text-[#3e3e42] mx-auto mb-6" />
                    <h3 className="text-[15px] font-medium text-[#858585] mb-2">No file open</h3>
                    <p className="text-[13px] text-[#6e6e6e]">Select a file from the explorer to start editing</p>
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
                  className="h-[4px] hover:bg-[#007acc]/60 cursor-ns-resize active:bg-[#007acc] transition-all duration-150"
                  onMouseDown={() => setIsResizing(true)}
                />

                {/* Panel Tabs */}
                <div className="flex items-center h-[35px] bg-[#252526] border-b border-[#2d2d30] px-2 gap-0.5">
                  <button
                    onClick={() => setActivePanel('terminal')}
                    className={`px-3 py-1.5 text-[13px] font-normal rounded-sm ${
                      activePanel === 'terminal'
                        ? 'bg-[#1e1e1e] text-[#cccccc]'
                        : 'text-[#858585] hover:text-[#cccccc]'
                    } transition-all duration-150`}
                  >
                    Terminal
                  </button>
                  <button
                    onClick={() => setActivePanel('problems')}
                    className={`px-3 py-1.5 text-[13px] font-normal rounded-sm flex items-center gap-1.5 ${
                      activePanel === 'problems'
                        ? 'bg-[#1e1e1e] text-[#cccccc]'
                        : 'text-[#858585] hover:text-[#cccccc]'
                    } transition-all duration-150`}
                  >
                    Problems
                    {problems.length > 0 && (
                      <span className="bg-[#f48771] text-white text-[10px] px-1.5 py-0.5 rounded-full font-medium">
                        {problems.length}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => setActivePanel('output')}
                    className={`px-3 py-1.5 text-[13px] font-normal rounded-sm ${
                      activePanel === 'output'
                        ? 'bg-[#1e1e1e] text-[#cccccc]'
                        : 'text-[#858585] hover:text-[#cccccc]'
                    } transition-all duration-150`}
                  >
                    Output
                  </button>
                  <button
                    onClick={() => setActivePanel('gas')}
                    className={`px-3 py-1.5 text-[13px] font-normal rounded-sm flex items-center gap-1.5 ${
                      activePanel === 'gas'
                        ? 'bg-[#1e1e1e] text-[#cccccc]'
                        : 'text-[#858585] hover:text-[#cccccc]'
                    } transition-all duration-150`}
                  >
                    <span>⚡</span>
                    Gas Profiler
                    {gasProfile && (
                      <span className="bg-blue-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-medium">
                        {gasProfile.totalGas.toLocaleString()}
                      </span>
                    )}
                  </button>
                  <div className="flex-1"></div>
                  <button
                    onClick={() => setPanelHeight(panelHeight === 250 ? 400 : 250)}
                    className="p-1 hover:bg-[#2d2d30] rounded-sm transition-colors duration-150"
                    title="Maximize Panel"
                  >
                    {panelHeight > 300 ? (
                      <ChevronDown className="h-4 w-4 text-[#858585] hover:text-[#cccccc] transition-colors" />
                    ) : (
                      <ChevronUp className="h-4 w-4 text-[#858585] hover:text-[#cccccc] transition-colors" />
                    )}
                  </button>
                  <button
                    onClick={() => setShowTerminal(!showTerminal)}
                    className="p-1 hover:bg-[#2d2d30] rounded-sm transition-colors duration-150"
                    title="Toggle Panel (Ctrl+`)"
                  >
                    <X className="h-4 w-4 text-[#858585] hover:text-[#cccccc] transition-colors" />
                  </button>
                </div>

                {/* Panel Content */}
                <div className="flex-1 overflow-hidden">
                  {activePanel === 'terminal' && <TerminalPanel />}
                  {activePanel === 'problems' && (
                    <div className="h-full overflow-y-auto p-3 font-mono text-[13px] select-text">
                      {problems.length === 0 ? (
                        <div className="flex items-center justify-center h-full text-[#858585]">
                          <CheckCircle2 className="h-5 w-5 mr-2.5" />
                          No problems detected
                        </div>
                      ) : (
                        problems.map((problem, idx) => (
                          <div key={idx} className="flex items-start gap-2.5 p-2.5 hover:bg-[#2d2d30] transition-colors duration-150 rounded-sm group">
                            {problem.type === 'error' ? (
                              <AlertCircle className="h-4 w-4 text-[#f48771] flex-shrink-0 mt-0.5 select-none" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-[#cca700] flex-shrink-0 mt-0.5 select-none" />
                            )}
                            <div className="select-text cursor-text">
                              <div className="text-[#cccccc]">{problem.message}</div>
                              <div className="text-[#858585] text-[12px] mt-1">
                                {selectedFile?.name} [Ln {problem.line}]
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                  {activePanel === 'output' && (
                    <div className="h-full overflow-y-auto p-3 font-mono text-[13px] text-[#cccccc] select-text cursor-text">
                      {buildOutput.length === 0 ? (
                        <div className="text-[#858585]">Build output will appear here...</div>
                      ) : (
                        buildOutput.map((line, idx) => (
                          <div key={idx} className="leading-relaxed whitespace-pre-wrap">
                            {line}
                          </div>
                        ))
                      )}
                    </div>
                  )}
                  {activePanel === 'gas' && (
                    <div className="h-full overflow-y-auto p-3">
                      <GasProfiler profile={gasProfile} isLoading={isAnalyzingGas} />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Status Bar - VS Code Style (Bottom) */}
        <div className="h-[22px] bg-[#007acc] flex items-center justify-between px-3 text-[12px] text-white flex-none w-full shadow-[0_-1px_0_rgba(0,0,0,0.3)]">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 cursor-pointer hover:bg-[#005a9e] px-2 py-0.5 rounded-sm transition-colors duration-150">
              <GitBranch className="h-3.5 w-3.5" />
              <span className="font-normal">master</span>
            </div>
            <div className="flex items-center gap-1.5 cursor-pointer hover:bg-[#005a9e] px-2 py-0.5 rounded-sm transition-colors duration-150" onClick={() => setActivePanel('problems')}>
              <AlertCircle className="h-3.5 w-3.5" />
              <span className="font-normal">0</span>
            </div>
            <div className="flex items-center gap-1.5 cursor-pointer hover:bg-[#005a9e] px-2 py-0.5 rounded-sm transition-colors duration-150" onClick={() => setActivePanel('problems')}>
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span className="font-normal">0</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {selectedFile && (
              <>
                <span className="cursor-default font-normal">Ln 1, Col 1</span>
                <span className="cursor-default font-normal">{getLanguageFromFilename(selectedFile.name).toUpperCase()}</span>
                <span className="cursor-default font-normal">UTF-8</span>
              </>
            )}
            <div className="flex items-center gap-1.5 cursor-pointer hover:bg-[#005a9e] px-2 py-0.5 rounded-sm transition-colors duration-150">
              <Wifi className="h-3.5 w-3.5" />
            </div>
          </div>
        </div>

        {/* Template Modal */}
        <TemplateModal
          isOpen={isTemplateModalOpen}
          onClose={() => setIsTemplateModalOpen(false)}
          onSelect={handleTemplateSelect}
        />
      </div>
    </IDEProjectWrapper>
  );
}
