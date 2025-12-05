'use client';

import { AlertTriangle, ExternalLink } from 'lucide-react';
import { useState } from 'react';

export default function RPCWarning() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-yellow-500/10 border-2 border-yellow-500/30 rounded-lg p-4 mb-6">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-yellow-400 font-bold text-lg mb-2">
            ⚠️ Known RPC Issue
          </h3>
          <p className="text-yellow-200 text-sm mb-3">
            The default Arbitrum Sepolia RPC is experiencing connectivity issues. 
            You <strong>must change your MetaMask RPC</strong> to deploy successfully.
          </p>
          
          <div className="bg-black/30 rounded-lg p-3 mb-3 border border-yellow-500/20">
            <p className="text-yellow-100 font-semibold text-sm mb-2">Quick Fix (2 minutes):</p>
            <ol className="text-yellow-100 text-sm space-y-1.5 list-decimal list-inside">
              <li>Open MetaMask → Click network dropdown</li>
              <li>Click <strong>Arbitrum Sepolia</strong> → Click ⋮ (three dots)</li>
              <li>Select <strong>Edit</strong> → Scroll to "RPC URL"</li>
              <li>Replace with: <code className="bg-black/50 px-2 py-0.5 rounded text-xs text-yellow-300">https://arbitrum-sepolia.blockpi.network/v1/rpc/public</code></li>
              <li>Click <strong>Save</strong> → Disconnect and reconnect wallet</li>
            </ol>
          </div>

          <div className="flex gap-2">
            <a
              href="https://chainlist.org/chain/421614"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-black font-medium text-sm rounded-lg transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Auto-Add RPC (ChainList)
            </a>
            <button
              onClick={() => setDismissed(true)}
              className="px-3 py-1.5 border border-yellow-500/30 hover:bg-yellow-500/10 text-yellow-300 font-medium text-sm rounded-lg transition-colors"
            >
              I've Changed It
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
