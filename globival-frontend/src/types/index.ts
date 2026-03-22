export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Category {
  id: number;
  name: string;
  subcategories?: SubCategory[];
  created_at: string;
  updated_at: string;
}

export interface SubCategory {
  id: number;
  name: string;
  category_id: number;
  created_at: string;
  updated_at: string;
  category: Category;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number | string;
  precio_de_oferta: number | string | null;
  stock: number;
  SKU: string | null;
  imagen: string | null;
  images?: Array<{ id: number; image_path: string; order: number } | string>;
  sub_category_id: number;
  created_at: string;
  updated_at: string;
  // API returns camelCase "subCategory" but we support both
  subCategory?: SubCategory;
  sub_category?: SubCategory;
}

/** Get subcategory from product (API returns camelCase `subCategory`) */
export function getSubCategory(product: Product): SubCategory | undefined {
  return product.subCategory || product.sub_category;
}

export interface Banner {
  id: number;
  title: string | null;
  image: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Testimonial {
  id: number;
  name: string;
  message: string;
  image: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Claim {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  mensaje: string;
  created_at: string;
  updated_at: string;
}

export interface Contact {
  id: number;
  nombre: string;
  telefono: string;
  email: string;
  titulo: string;
  categoria: string;
  mensaje: string;
  leido: boolean;
  created_at: string;
  updated_at: string;
}

export interface FeaturedCategorySetting {
  id: number;
  subcategory_id: number | null;
  subcategory: SubCategory | null;
  created_at: string;
  updated_at: string;
}
