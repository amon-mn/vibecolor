import { useState, useCallback } from 'react';

export function useLoading<T extends (...args: any[]) => Promise<any>>(
  asyncFn: T
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const wrapped = useCallback(
    async (...args: Parameters<T>): Promise<ReturnType<T> | undefined> => {
      setLoading(true);
      setError(null);
      try {
        const result = await asyncFn(...args);
        setLoading(false);
        return result;
      } catch (e: any) {
        setError(e?.message || 'Erro desconhecido');
        setLoading(false);
        return undefined;
      }
    },
    [asyncFn]
  );

  return { loading, error, run: wrapped };
}
