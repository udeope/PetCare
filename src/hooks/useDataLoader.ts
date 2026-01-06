import { useState, useEffect, useCallback } from 'react';

export interface DataLoaderState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export interface UseDataLoaderResult<T> extends DataLoaderState<T> {
  refetch: () => Promise<void>;
}

/**
 * Hook genérico para cargar datos desde una URL con manejo de loading y errores
 */
export function useDataLoader<T>(
  url: string,
  options?: {
    initialData?: T;
    enabled?: boolean;
  }
): UseDataLoaderResult<T> {
  const [data, setData] = useState<T | null>(options?.initialData ?? null);
  const [loading, setLoading] = useState(options?.enabled !== false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const jsonData = await response.json();
      setData(jsonData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al cargar datos';
      setError(errorMessage);
      console.error(`Error cargando datos desde ${url}:`, err);
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    if (options?.enabled !== false) {
      fetchData();
    }
  }, [fetchData, options?.enabled]);

  return { data, loading, error, refetch: fetchData };
}

/**
 * Hook para cargar múltiples recursos en paralelo
 */
export function useMultipleDataLoader<T extends Record<string, unknown>>(
  urls: Record<keyof T, string>,
  options?: { enabled?: boolean }
): {
  data: Partial<T>;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
} {
  const [data, setData] = useState<Partial<T>>({});
  const [loading, setLoading] = useState(options?.enabled !== false);
  const [error, setError] = useState<string | null>(null);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const entries = Object.entries(urls) as [keyof T, string][];
      const results = await Promise.all(
        entries.map(async ([key, url]) => {
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(`Error cargando ${String(key)}: ${response.statusText}`);
          }
          const jsonData = await response.json();
          return [key, jsonData] as const;
        })
      );

      const newData = Object.fromEntries(results) as Partial<T>;
      setData(newData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al cargar datos';
      setError(errorMessage);
      console.error('Error cargando múltiples datos:', err);
    } finally {
      setLoading(false);
    }
  }, [urls]);

  useEffect(() => {
    if (options?.enabled !== false) {
      fetchAllData();
    }
  }, [fetchAllData, options?.enabled]);

  return { data, loading, error, refetch: fetchAllData };
}
