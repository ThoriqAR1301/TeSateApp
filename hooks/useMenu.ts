import { useState, useCallback } from 'react';
import useFetch from './useFetch';
import menuService, {
  Product,
  ProductsResponse,
} from '@/services/menuService';
import { PAGINATION } from '@/constants/Config';

export function useProducts(
  limit: number = PAGINATION.DEFAULT_LIMIT,
  skip:  number = PAGINATION.DEFAULT_SKIP
) {
  const { data, isLoading, error, refetch } =
    useFetch<ProductsResponse>(
      () => menuService.getProducts(limit, skip),
      [limit, skip]
    );

  return {
    products:   data?.products ?? [],
    total:      data?.total    ?? 0,
    isLoading,
    error,
    refetch,
  };
}

export function useProductById(id: number | string) {
  const { data, isLoading, error, refetch } =
    useFetch<Product>(
      () => menuService.getProductById(id),
      [id]
    );

  return { product: data, isLoading, error, refetch };
}

export function useProductSearch() {
  const [keyword,   setKeyword]   = useState('');
  const [results,   setResults]   = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error,     setError]     = useState<string | null>(null);

  const search = useCallback(async (query: string) => {
    const trimmed = query.trim();
    setKeyword(trimmed);

    if (!trimmed) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    const res = await menuService.searchProducts(trimmed);

    if (res.success && res.data) {
      setResults(res.data.products);
    } else {
      setError(res.error ?? 'Pencarian Gagal. Coba Lagi Ya!');
      setResults([]);
    }

    setIsLoading(false);
  }, []);

  const clearSearch = useCallback(() => {
    setKeyword('');
    setResults([]);
    setError(null);
  }, []);

  return { keyword, results, isLoading, error, search, clearSearch };
}

export function useProductsByCategory(category: string) {
  const enabled = !!category && category !== 'rekomendasi';

  const { data, isLoading, error, refetch } =
    useFetch<ProductsResponse>(
      () => menuService.getProductsByCategory(category),
      [category],
      { enabled }
    );

  return {
    products:  data?.products ?? [],
    total:     data?.total    ?? 0,
    isLoading,
    error,
    refetch,
  };
}

export function useCategories() {
  const { data, isLoading, error, refetch } =
    useFetch<string[]>(
      () => menuService.getCategories(),
      []
    );

  return { categories: data ?? [], isLoading, error, refetch };
}

export function useMenu() {
  const [activeCategory, setActiveCategory] = useState('rekomendasi');
  const [page,           setPage]           = useState(0);

  const limit = PAGINATION.DEFAULT_LIMIT;
  const skip  = page * limit;

  const {
    products:  allProducts,
    total,
    isLoading: loadingAll,
    error:     errorAll,
    refetch:   refetchAll,
  } = useProducts(limit, skip);

  const {
    products:  categoryProducts,
    isLoading: loadingCategory,
    error:     errorCategory,
    refetch:   refetchCategory,
  } = useProductsByCategory(activeCategory);

  const searchState = useProductSearch();

  const displayProducts = searchState.keyword
    ? searchState.results
    : activeCategory === 'rekomendasi'
      ? allProducts
      : categoryProducts;

  const isLoading = searchState.isLoading || loadingAll || loadingCategory;
  const error     = searchState.error     || errorAll   || errorCategory;

  const refetch = () => {
    refetchAll();
    if (activeCategory !== 'rekomendasi') refetchCategory();
  };

  const nextPage = () => {
    if (skip + limit < total) setPage(p => p + 1);
  };

  const prevPage = () => {
    if (page > 0) setPage(p => p - 1);
  };

  return {
    displayProducts,
    activeCategory,
    setActiveCategory,
    isLoading,
    error,
    refetch,
    page,
    total,
    nextPage,
    prevPage,
    hasMore: skip + limit < total,
    searchState,
  };
}

export default useMenu;