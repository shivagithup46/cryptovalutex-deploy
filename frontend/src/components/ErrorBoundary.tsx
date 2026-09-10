import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  errorMsg: string;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorMsg: ''
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMsg: error.message };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[500px] flex items-center justify-center p-4">
          <div className="glass-card w-full max-w-lg p-8 text-center border border-accent-pink/50">
            <div className="w-16 h-16 rounded-full bg-accent-pink/10 flex items-center justify-center mx-auto mb-6 text-accent-pink">
              <AlertTriangle size={32} />
            </div>
            <h2 className="text-2xl font-bold text-primary mb-2">Something went wrong</h2>
            <p className="text-secondary mb-6">
              An unexpected error occurred in the application. Don't worry, your funds are safe.
            </p>
            <div className="bg-vault-800 p-4 rounded-lg text-left mb-6 overflow-auto text-xs font-mono text-accent-pink max-h-32">
              {this.state.errorMsg}
            </div>
            <button 
              onClick={() => {
                localStorage.removeItem('token');
                window.location.href = '/login';
              }}
              className="btn-primary w-full py-3 flex items-center justify-center gap-2"
            >
              <RefreshCcw size={18} />
              Return to Login
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
