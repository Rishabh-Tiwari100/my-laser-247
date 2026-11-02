import React, { Suspense } from 'react';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import NotOutLoader from '@/components/common/NotOutLoader';

interface Options {
  fallback?: React.ReactNode;
  errorFallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export default function loadable<T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  { fallback = <NotOutLoader />, errorFallback, onError }: Options = {}
) {
  const LazyComponent = React.lazy(importFunc);
  return (props: React.ComponentProps<T>) => (
    <ErrorBoundary fallback={errorFallback} onError={onError}>
      <Suspense fallback={fallback}>
        <LazyComponent {...props} />
      </Suspense>
    </ErrorBoundary>
  );
}
