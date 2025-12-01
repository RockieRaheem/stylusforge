'use client';

import { useState } from 'react';
import { ChevronRight, ChevronDown, File, Folder, FolderOpen, Plus, Trash2 } from 'lucide-react';

export interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  content?: string;
  children?: FileNode[];
}

interface FileTreeProps {
  files: FileNode[];
  selectedFile: string | null;
  onFileSelect: (file: FileNode) => void;
  onFileCreate: (parentId: string | null, type: 'file' | 'folder', name: string) => void;
  onFileDelete: (fileId: string) => void;
}

interface FileItemProps {
  node: FileNode;
  level: number;
  selectedFile: string | null;
  onFileSelect: (file: FileNode) => void;
  onFileDelete: (fileId: string) => void;
  expandedFolders: Set<string>;
  toggleFolder: (folderId: string) => void;
}

function FileItem({ node, level, selectedFile, onFileSelect, onFileDelete, expandedFolders, toggleFolder }: FileItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const isExpanded = expandedFolders.has(node.id);
  const isSelected = selectedFile === node.id;

  const getFileIcon = () => {
    if (node.type === 'folder') {
      return isExpanded ? <FolderOpen className="h-4 w-4 text-blue-400" /> : <Folder className="h-4 w-4 text-blue-400" />;
    }
    
    const ext = node.name.split('.').pop()?.toLowerCase();
    const iconColors: Record<string, string> = {
      'rs': 'text-orange-400',
      'toml': 'text-yellow-400',
      'json': 'text-green-400',
      'md': 'text-blue-300',
      'txt': 'text-gray-400',
    };
    
    return <File className={`h-4 w-4 ${iconColors[ext || ''] || 'text-gray-400'}`} />;
  };

  const handleClick = () => {
    if (node.type === 'folder') {
      toggleFolder(node.id);
    } else {
      onFileSelect(node);
    }
  };

  return (
    <div>
      <div
        className={`flex items-center gap-1 px-2 py-0.5 cursor-pointer transition-all duration-75 group relative ${
          isSelected 
            ? 'bg-[#37373d]' 
            : 'hover:bg-[#2a2d2e]'
        }`}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {node.type === 'folder' ? (
          <div className="flex items-center justify-center w-4 transition-transform duration-150">
            {isExpanded ? (
              <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
            )}
          </div>
        ) : (
          <div className="w-4"></div>
        )}
        {getFileIcon()}
        <span className={`text-[13px] flex-1 select-none ${isSelected ? 'text-white' : 'text-gray-300'}`}>
          {node.name}
        </span>
        {isHovered && node.type === 'file' && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFileDelete(node.id);
            }}
            className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-[#464647] rounded transition-all"
          >
            <Trash2 className="h-3.5 w-3.5 text-gray-400 hover:text-red-400" />
          </button>
        )}
      </div>
      {node.type === 'folder' && isExpanded && node.children && (
        <div className="animate-in fade-in slide-in-from-top-1 duration-150">
          {node.children.map((child) => (
            <FileItem
              key={child.id}
              node={child}
              level={level + 1}
              selectedFile={selectedFile}
              onFileSelect={onFileSelect}
              onFileDelete={onFileDelete}
              expandedFolders={expandedFolders}
              toggleFolder={toggleFolder}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function FileTree({ files, selectedFile, onFileSelect, onFileCreate, onFileDelete }: FileTreeProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['root', 'src']));
  const [showNewFileDialog, setShowNewFileDialog] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFileType, setNewFileType] = useState<'file' | 'folder'>('file');

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const handleCreateFile = () => {
    if (newFileName.trim()) {
      onFileCreate(null, newFileType, newFileName.trim());
      setNewFileName('');
      setShowNewFileDialog(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#252526]">
      <div className="flex items-center justify-between px-3 py-2 select-none">
        <h2 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Stylus Project</h2>
        <button
          onClick={() => setShowNewFileDialog(true)}
          className="p-1 hover:bg-white/10 rounded transition-colors opacity-0 group-hover:opacity-100"
          title="New File..."
        >
          <Plus className="h-3.5 w-3.5 text-gray-400 hover:text-white" />
        </button>
      </div>

      {showNewFileDialog && (
        <div className="p-3 bg-[#1e1e1e] border-b border-[#1e1e1e] animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex gap-2 mb-2">
            <button
              onClick={() => setNewFileType('file')}
              className={`px-2 py-1 text-[11px] font-medium rounded transition-colors ${
                newFileType === 'file' ? 'bg-[#0e639c] text-white' : 'bg-[#3c3c3c] text-gray-400 hover:bg-[#464647]'
              }`}
            >
              File
            </button>
            <button
              onClick={() => setNewFileType('folder')}
              className={`px-2 py-1 text-[11px] font-medium rounded transition-colors ${
                newFileType === 'folder' ? 'bg-[#0e639c] text-white' : 'bg-[#3c3c3c] text-gray-400 hover:bg-[#464647]'
              }`}
            >
              Folder
            </button>
          </div>
          <input
            type="text"
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCreateFile();
              if (e.key === 'Escape') setShowNewFileDialog(false);
            }}
            placeholder={`${newFileType === 'file' ? 'filename.rs' : 'folder-name'}`}
            className="w-full px-2 py-1.5 text-[13px] bg-[#3c3c3c] text-white border border-[#464647] rounded focus:outline-none focus:border-[#007acc] transition-colors"
            autoFocus
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleCreateFile}
              className="flex-1 px-3 py-1.5 text-[11px] font-medium bg-[#0e639c] text-white rounded hover:bg-[#1177bb] transition-colors"
            >
              Create
            </button>
            <button
              onClick={() => {
                setShowNewFileDialog(false);
                setNewFileName('');
              }}
              className="flex-1 px-3 py-1.5 text-[11px] font-medium bg-[#3c3c3c] text-gray-300 rounded hover:bg-[#464647] transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto overflow-x-hidden hover:overflow-x-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
        {files.map((node) => (
          <FileItem
            key={node.id}
            node={node}
            level={0}
            selectedFile={selectedFile}
            onFileSelect={onFileSelect}
            onFileDelete={onFileDelete}
            expandedFolders={expandedFolders}
            toggleFolder={toggleFolder}
          />
        ))}
      </div>
    </div>
  );
}
