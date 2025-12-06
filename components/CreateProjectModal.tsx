'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string, description: string) => Promise<void>;
}

export default function CreateProjectModal({ isOpen, onClose, onCreate }: CreateProjectModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Project name is required');
      return;
    }

    try {
      setIsCreating(true);
      setError('');
      await onCreate(name.trim(), description.trim());
      
      // Reset form
      setName('');
      setDescription('');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create project');
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    if (!isCreating) {
      setName('');
      setDescription('');
      setError('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#0d1117] border border-[#30363d] rounded-xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#21262d]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#58a6ff]/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-[#58a6ff]">add_circle</span>
            </div>
            <div>
              <h2 className="text-white text-lg font-semibold">Create New Project</h2>
              <p className="text-[#8b949e] text-sm">Start building your Stylus contract</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isCreating}
            className="text-[#8b949e] hover:text-white transition-colors disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="bg-[#f85149]/10 border border-[#f85149]/30 rounded-lg p-3 flex items-start gap-2">
              <span className="material-symbols-outlined text-[#f85149] text-lg">error</span>
              <p className="text-[#f85149] text-sm">{error}</p>
            </div>
          )}

          <div>
            <label htmlFor="projectName" className="block text-[#8b949e] text-sm font-medium mb-2">
              Project Name <span className="text-[#f85149]">*</span>
            </label>
            <input
              id="projectName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., NFT Marketplace, DeFi Protocol"
              disabled={isCreating}
              className="w-full px-4 py-2.5 bg-[#0d1117] border border-[#30363d] rounded-lg text-white placeholder-[#8b949e] focus:outline-none focus:border-[#58a6ff] transition-colors disabled:opacity-50"
              maxLength={50}
            />
            <p className="text-[#8b949e] text-xs mt-1">{name.length}/50 characters</p>
          </div>

          <div>
            <label htmlFor="projectDescription" className="block text-[#8b949e] text-sm font-medium mb-2">
              Description (Optional)
            </label>
            <textarea
              id="projectDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of your project..."
              disabled={isCreating}
              rows={3}
              className="w-full px-4 py-2.5 bg-[#0d1117] border border-[#30363d] rounded-lg text-white placeholder-[#8b949e] focus:outline-none focus:border-[#58a6ff] transition-colors resize-none disabled:opacity-50"
              maxLength={200}
            />
            <p className="text-[#8b949e] text-xs mt-1">{description.length}/200 characters</p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={isCreating}
              className="flex-1 px-4 py-2.5 border border-[#30363d] rounded-lg text-[#8b949e] hover:text-white hover:border-[#8b949e] transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating || !name.trim()}
              className="flex-1 px-4 py-2.5 bg-[#238636] hover:bg-[#2ea043] rounded-lg text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isCreating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Creating...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-lg">add</span>
                  Create Project
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
