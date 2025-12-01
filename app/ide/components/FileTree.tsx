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
        className={`flex items-center gap-1 px-2 py-1 cursor-pointer transition-colors group relative ${
          isSelected ? 'bg-blue-500/20 border-l-2 border-blue-500' : 'hover:bg-white/5'
        }`}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {node.type === 'folder' && (
          <div className="flex items-center justify-center w-4">
            {isExpanded ? (
              <ChevronDown className="h-3 w-3 text-gray-400" />
            ) : (
              <ChevronRight className="h-3 w-3 text-gray-400" />
            )}
          </div>
        )}
        {getFileIcon()}
        <span className={`text-sm flex-1 ${isSelected ? 'text-white font-medium' : 'text-gray-300'}`}>
          {node.name}
        </span>
        {isHovered && node.type === 'file' && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFileDelete(node.id);
            }}
            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 rounded transition-all"
          >
            <Trash2 className="h-3 w-3 text-red-400" />
          </button>
        )}
      </div>
      {node.type === 'folder' && isExpanded && node.children && (
        <div>
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
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['root']));
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
    <div className="flex flex-col h-full bg-[#1e1e1e] border-r border-white/10">
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/10">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Explorer</h2>
        <button
          onClick={() => setShowNewFileDialog(true)}
          className="p-1 hover:bg-white/10 rounded transition-colors"
          title="New File"
        >
          <Plus className="h-4 w-4 text-gray-400 hover:text-white" />
        </button>
      </div>

      {showNewFileDialog && (
        <div className="p-2 bg-[#252526] border-b border-white/10">
          <div className="flex gap-2 mb-2">
            <button
              onClick={() => setNewFileType('file')}
              className={`px-2 py-1 text-xs rounded ${
                newFileType === 'file' ? 'bg-blue-500 text-white' : 'bg-white/5 text-gray-400'
              }`}
            >
              File
            </button>
            <button
              onClick={() => setNewFileType('folder')}
              className={`px-2 py-1 text-xs rounded ${
                newFileType === 'folder' ? 'bg-blue-500 text-white' : 'bg-white/5 text-gray-400'
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
            placeholder={`New ${newFileType} name`}
            className="w-full px-2 py-1 text-sm bg-[#3c3c3c] text-white border border-white/20 rounded focus:outline-none focus:border-blue-500"
            autoFocus
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleCreateFile}
              className="flex-1 px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Create
            </button>
            <button
              onClick={() => {
                setShowNewFileDialog(false);
                setNewFileName('');
              }}
              className="flex-1 px-2 py-1 text-xs bg-white/5 text-gray-400 rounded hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto py-1">
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
