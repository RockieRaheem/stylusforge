'use client';

import { AlertTriangle, ExternalLink } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function FirebasePermissionWarning() {
  const [dismissed, setDismissed] = useState(true); // Start dismissed
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Listen for Firebase permission errors
    const handleError = (event: ErrorEvent) => {
      if (event.message?.includes('Missing or insufficient permissions') ||
          event.message?.includes('permission-denied')) {
        setHasError(true);
        setDismissed(false);
      }
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (dismissed || !hasError) return null;

  return (
    <div className="bg-red-500/10 border-2 border-red-500/30 rounded-lg p-4 mb-6">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5 animate-pulse" />
        <div className="flex-1">
          <h3 className="text-red-400 font-bold text-lg mb-2">
            🔥 Firebase Permission Error
          </h3>
          <p className="text-red-200 text-sm mb-3">
            Deployments are <strong>not being saved</strong> because Firebase security rules need to be updated.
            Your contracts deploy successfully, but the dashboard won't update.
          </p>
          
          <div className="bg-black/30 rounded-lg p-3 mb-3 border border-red-500/20">
            <p className="text-red-100 font-semibold text-sm mb-2">Quick Fix (30 seconds):</p>
            <ol className="text-red-100 text-sm space-y-1.5 list-decimal list-inside">
              <li>Click "Open Firebase Console" below</li>
              <li>Go to <strong>Firestore Database</strong> → <strong>Rules</strong> tab</li>
              <li>Add the deployment rules (see FIREBASE_RULES_UPDATE.md)</li>
              <li>Click <strong>Publish</strong></li>
              <li>Refresh this page and deploy again</li>
            </ol>
          </div>

          <div className="flex gap-2">
            <a
              href="https://console.firebase.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white font-medium text-sm rounded-lg transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Open Firebase Console
            </a>
            <button
              onClick={() => window.open('/FIREBASE_RULES_UPDATE.md', '_blank')}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 font-medium text-sm rounded-lg transition-colors border border-red-500/30"
            >
              View Instructions
            </button>
            <button
              onClick={() => setDismissed(true)}
              className="px-3 py-1.5 border border-red-500/30 hover:bg-red-500/10 text-red-300 font-medium text-sm rounded-lg transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
