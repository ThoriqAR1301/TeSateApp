import { useState, useEffect, useCallback, useRef } from 'react';
import { ApiResponse } from '@/services/api';

type UseFetchOptions = {
  enabled?: boolean;   
};

type UseFetchReturn<T> = {
  data:      T | null;
  isLoading: boolean;
  error:     string | null;
  refetch:   () => void;
  reset:     () => void;
};

function useFetch<T>(
  fetcher:  () => Promise<ApiResponse<T>>,
  deps:     unknown[]        = [],
  options:  UseFetchOptions  = {}
): UseFetchReturn<T> {
  const { enabled = true } = options;

  const [data,      setData]      = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error,     setError]     = useState<string | null>(null);

  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const isMountedRef = useRef(true);
  useEffect(() => {
    isMountedRef.current = true;
    return () => { isMountedRef.current = false; };
  }, []);

  const fetchData = useCallback(async () => {
    if (!isMountedRef.current) return;

    setIsLoading(true);
    setError(null);

    const res = await fetcherRef.current();

    if (!isMountedRef.current) return;

    if (res.success && res.data !== null) {
      setData(res.data);
    } else {
      setError(res.error ?? 'Ada Yang Error Nih. Coba Lagi!');
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (enabled) fetchData();
  }, [enabled, ...deps]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return { data, isLoading, error, refetch: fetchData, reset };
}

export default useFetch;