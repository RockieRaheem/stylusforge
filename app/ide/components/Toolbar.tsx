'use client';

import { useState } from 'react';
import { Play, Upload, Settings, Save, Download, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import * as Toast from '@radix-ui/react-toast';

interface ToolbarProps {
  onCompile: () => Promise<{ success: boolean; message: string; logs?: string[] }>;
  onSave: () => void;
  hasUnsavedChanges: boolean;
}

export default function Toolbar({ onCompile, onSave, hasUnsavedChanges }: ToolbarProps) {
  const [isCompiling, setIsCompiling] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const showToast = (message: string, type: 'success' | 'error') => {
    setToastMessage(message);
    setToastType(type);
    setToastOpen(true);
  };

  const handleCompile = async () => {
    setIsCompiling(true);
    try {
      const result = await onCompile();
      showToast(result.message, result.success ? 'success' : 'error');
    } catch (error) {
      showToast('Compilation failed', 'error');
    } finally {
      setIsCompiling(false);
    }
  };

  const handleSave = () => {
    onSave();
    showToast('File saved successfully', 'success');
  };

  return (
    <Toast.Provider swipeDirection="right">
      <div className="flex items-center gap-2 px-3 py-1.5 bg-[#252526] border-b border-[#1e1e1e]">
        <div className="flex items-center gap-2 flex-1">
          {/* Compile Button */}
          <button
            onClick={handleCompile}
            disabled={isCompiling}
            className="flex items-center gap-2 px-3 py-1.5 bg-[#0e639c] hover:bg-[#1177bb] text-white rounded text-[13px] font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCompiling ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Compiling...</span>
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5" />
                <span>Compile</span>
              </>
            )}
          </button>

          <div className="w-px h-5 bg-[#1e1e1e]"></div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={!hasUnsavedChanges}
            className="flex items-center gap-2 px-3 py-1.5 bg-transparent hover:bg-[#2a2d2e] text-gray-300 rounded text-[13px] font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
            title="Save (Ctrl+S)"
          >
            <Save className="h-3.5 w-3.5" />
            <span>Save</span>
            {hasUnsavedChanges && <span className="h-1.5 w-1.5 bg-[#0e639c] rounded-full"></span>}
          </button>

          {/* Export Button */}
          <button
            className="flex items-center gap-2 px-3 py-1.5 bg-transparent hover:bg-[#2a2d2e] text-gray-300 rounded text-[13px] font-medium transition-all"
            title="Export Project"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export</span>
          </button>
        </div>

        {/* Settings Button */}
        <button
          className="p-1.5 hover:bg-[#2a2d2e] rounded transition-colors"
          title="Settings"
        >
          <Settings className="h-4 w-4 text-gray-400 hover:text-white" />
        </button>
      </div>

      {/* Toast Notification */}
      <Toast.Root
        className={`${
          toastType === 'success' ? 'bg-[#16825d]' : 'bg-[#f48771]'
        } rounded shadow-xl p-3 flex items-center gap-3 border border-black/20`}
        open={toastOpen}
        onOpenChange={setToastOpen}
      >
        <Toast.Description className="flex items-center gap-2 text-white">
          {toastType === 'success' ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <XCircle className="h-4 w-4" />
          )}
          <span className="text-[13px]">{toastMessage}</span>
        </Toast.Description>
      </Toast.Root>

      <Toast.Viewport className="fixed bottom-6 right-6 flex flex-col gap-2 w-80 max-w-[100vw] z-50" />
    </Toast.Provider>
  );
}
