'use client';

import React from 'react';
import { Button } from '@thebeautypro/ui/button';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('❌ [Error Boundary] Erro capturado:', error);
    console.error('❌ [Error Boundary] Stack:', error.stack);
    console.error('❌ [Error Boundary] Component stack:', errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
          <div className="max-w-md rounded-lg border bg-white p-6 text-center shadow-lg">
            <div className="mb-4 text-6xl">❌</div>
            <h1 className="mb-2 text-2xl font-bold text-red-600">Erro na Aplicação</h1>
            <p className="mb-4 text-gray-600">
              Ocorreu um erro ao carregar esta página.
            </p>
            <div className="mb-4 rounded bg-red-50 p-4 text-left">
              <p className="mb-2 font-mono text-sm font-bold text-red-800">
                {this.state.error?.name}: {this.state.error?.message}
              </p>
              {this.state.error?.stack && (
                <pre className="max-h-40 overflow-auto text-xs text-red-700">
                  {this.state.error.stack}
                </pre>
              )}
            </div>
            <Button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
            >
              Recarregar Página
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
