import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="flex flex-col items-center justify-center p-8 bg-zinc-950 border border-red-500/30 rounded-3xl text-zinc-100 shadow-2xl max-w-lg mx-auto my-10">
          <AlertTriangle size={48} className="mb-6 text-red-500 animate-pulse" />
          <h3 className="text-xl font-bold uppercase tracking-[0.2em] mb-3 text-white">System Anomaly Detected</h3>
          <p className="text-sm text-zinc-400 text-center mb-8 font-light leading-relaxed">
            {this.state.error?.message || 'The neural rendering engine encountered an unrecoverable state.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <button 
              onClick={() => this.setState({ hasError: false, error: null })}
              className="flex-1 px-6 py-3 bg-zinc-900 hover:bg-zinc-800 border border-white/5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all"
            >
              Attempt Hot-Reload
            </button>
            <button 
              onClick={() => {
                sessionStorage.clear();
                localStorage.clear();
                window.location.reload();
              }}
              className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-500 rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(220,38,38,0.3)]"
            >
              Restart Engine
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
