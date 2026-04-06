import api, { ApiResponse } from './api';
import { API_CONFIG, PAGINATION } from '@/constants/Config';

export type Product = {
  id:               number;
  title:            string;
  description:      string;
  price:            number;
  discountPercentage: number;
  rating:           number;
  stock:            number;
  brand:            string;
  category:         string;
  thumbnail:        string;
  images:           string[];
};

export type ProductsResponse = {
  products: Product[];
  total:    number;
  skip:     number;
  limit:    number;
};

export type Category = string;

const menuService = {

  getProducts: (
    limit: number = PAGINATION.DEFAULT_LIMIT,
    skip:  number = PAGINATION.DEFAULT_SKIP
  ): Promise<ApiResponse<ProductsResponse>> => {
    const endpoint = API_CONFIG.ENDPOINTS.PRODUCT_LIMIT(limit, skip);
    return api.get<ProductsResponse>(endpoint);
  },

  getProductById: (
    id: number | string
  ): Promise<ApiResponse<Product>> => {
    const endpoint = API_CONFIG.ENDPOINTS.PRODUCT_BY_ID(id);
    return api.get<Product>(endpoint);
  },

  searchProducts: (
    keyword: string
  ): Promise<ApiResponse<ProductsResponse>> => {
    const endpoint = `${API_CONFIG.ENDPOINTS.PRODUCTS_SEARCH}?q=${encodeURIComponent(keyword)}`;
    return api.get<ProductsResponse>(endpoint);
  },

  getCategories: (): Promise<ApiResponse<Category[]>> => {
    return api.get<Category[]>(API_CONFIG.ENDPOINTS.PRODUCTS_CATEGORIES);
  },

  getProductsByCategory: (
    category: string
  ): Promise<ApiResponse<ProductsResponse>> => {
    const endpoint = API_CONFIG.ENDPOINTS.PRODUCTS_BY_CATEGORY(category);
    return api.get<ProductsResponse>(endpoint);
  },

};

export default menuService;