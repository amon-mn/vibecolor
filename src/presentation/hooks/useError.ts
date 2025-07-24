import { useState, useCallback } from 'react';

export function useError() {
  const [error, setError] = useState<string | null>(null);
  const throwError = useCallback((msg: string) => setError(msg), []);
  const clearError = useCallback(() => setError(null), []);
  return { error, throwError, clearError };
} 