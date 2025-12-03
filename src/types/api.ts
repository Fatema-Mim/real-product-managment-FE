export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  category_id: number[];
  images: string[];
  stock_quantity: number;
  status: "active" | "inactive";
  createdAt: Date;
  updatedAt?: Date;
}

export interface Category {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  message: string;
}

export interface LogoutResponse {
  message: string;
}

export interface ProductsResponse {
  products: Product[];
}

export interface ProductResponse {
  product: Product;
}

export interface AddProductResponse {
  message: string;
  productId: string;
}

export interface UpdateProductResponse {
  message: string;
  product: Product;
}

export interface DeleteProductResponse {
  message: string;
}

export interface CategoriesResponse {
  categories: Category[];
}

export interface AddCategoryResponse {
  message: string;
  categoryId: string;
}

export interface UpdateCategoryResponse {
  message: string;
  category: Category;
}

export interface DeleteCategoryResponse {
  message: string;
}

export interface ApiError {
  message: string;
  error?: string;
}
