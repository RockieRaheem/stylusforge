'use client';

import { useState } from 'react';
import { Play, Upload, Settings, Save, Download, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import * as Toast from '@radix-ui/react-toast';

interface ToolbarProps {
  onCompile: () => Promise<{ success: boolean; message: string; logs?: string[] }>;
  onDeploy: () => Promise<{ success: boolean; address?: string; txHash?: string }>;
  onSave: () => void;
  hasUnsavedChanges: boolean;
}

export default function Toolbar({ onCompile, onDeploy, onSave, hasUnsavedChanges }: ToolbarProps) {
  const [isCompiling, setIsCompiling] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
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

  const handleDeploy = async () => {
    setIsDeploying(true);
    try {
      const result = await onDeploy();
      if (result.success && result.address) {
        showToast(`Deployed to ${result.address}`, 'success');
      } else {
        showToast('Deployment failed', 'error');
      }
    } catch (error) {
      showToast('Deployment failed', 'error');
    } finally {
      setIsDeploying(false);
    }
  };

  const handleSave = () => {
    onSave();
    showToast('File saved successfully', 'success');
  };

  return (
    <Toast.Provider swipeDirection="right">
      <div className="flex items-center gap-2 px-4 py-2 bg-[#252526] border-b border-white/10">
        <div className="flex items-center gap-2 flex-1">
          {/* Compile Button */}
          <button
            onClick={handleCompile}
            disabled={isCompiling}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
          >
            {isCompiling ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm font-medium">Compiling...</span>
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                <span className="text-sm font-medium">Compile</span>
              </>
            )}
          </button>

          {/* Deploy Button */}
          <button
            onClick={handleDeploy}
            disabled={isDeploying}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
          >
            {isDeploying ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm font-medium">Deploying...</span>
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                <span className="text-sm font-medium">Deploy</span>
              </>
            )}
          </button>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={!hasUnsavedChanges}
            className="flex items-center gap-2 px-4 py-2 bg-[#3c3c3c] hover:bg-[#4a4a4a] text-white rounded-md transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            title="Save (Ctrl+S)"
          >
            <Save className="h-4 w-4" />
            <span className="text-sm font-medium">Save</span>
            {hasUnsavedChanges && <span className="h-2 w-2 bg-blue-400 rounded-full"></span>}
          </button>

          {/* Export Button */}
          <button
            className="flex items-center gap-2 px-4 py-2 bg-[#3c3c3c] hover:bg-[#4a4a4a] text-white rounded-md transition-all"
            title="Export Project"
          >
            <Download className="h-4 w-4" />
            <span className="text-sm font-medium">Export</span>
          </button>
        </div>

        {/* Settings Button */}
        <button
          className="p-2 hover:bg-white/10 rounded-md transition-colors"
          title="Settings"
        >
          <Settings className="h-5 w-5 text-gray-400 hover:text-white" />
        </button>
      </div>

      {/* Toast Notification */}
      <Toast.Root
        className={`${
          toastType === 'success' ? 'bg-green-600' : 'bg-red-600'
        } rounded-lg shadow-lg p-4 flex items-center gap-3`}
        open={toastOpen}
        onOpenChange={setToastOpen}
      >
        <Toast.Description className="flex items-center gap-2 text-white">
          {toastType === 'success' ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <XCircle className="h-5 w-5" />
          )}
          <span className="text-sm font-medium">{toastMessage}</span>
        </Toast.Description>
      </Toast.Root>

      <Toast.Viewport className="fixed bottom-4 right-4 flex flex-col gap-2 w-96 max-w-[100vw] z-50" />
    </Toast.Provider>
  );
}
