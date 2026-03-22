import axios, { type AxiosResponse } from "axios";
import { API_URL } from "@/config/constants";

/**
 * Extracts an array from an Axios response, handling both
 * plain arrays `[...]` and Laravel-wrapped `{ data: [...] }` formats.
 */
export function extractArray<T>(response: AxiosResponse): T[] {
  const body = response.data;
  if (Array.isArray(body)) return body;
  if (body && Array.isArray(body.data)) return body.data;
  return [];
}

/**
 * Extracts a single object from an Axios response, handling both
 * plain `{...}` and Laravel-wrapped `{ data: {...} }` formats.
 */
export function extractObject<T>(response: AxiosResponse): T {
  const body = response.data;
  if (body && typeof body === "object" && "data" in body && !Array.isArray(body.data)) {
    return body.data as T;
  }
  return body as T;
}

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

interface CategoryData {
  name: string;
}

interface SubcategoryData {
  name: string;
  categoryId: number;
}

interface ClaimData {
  nombre: string;
  email: string;
  telefono?: string;
  mensaje: string;
}

interface ContactData {
  nombre: string;
  telefono: string;
  email: string;
  titulo: string;
  categoria: string;
  mensaje: string;
}

export const categoryService = {
  getAll: () => api.get("/categories"),
  getById: (id: number) => api.get(`/categories/${id}`),
  create: (data: CategoryData) => api.post("/categories", data),
  update: (id: number, data: CategoryData) =>
    api.put(`/categories/${id}`, data),
  delete: (id: number) => api.delete(`/categories/${id}`),
};

export const subcategoryService = {
  getAll: () => api.get("/subcategories"),
  getById: (id: number) => api.get(`/subcategories/${id}`),
  create: (data: SubcategoryData) => {
    const payload = {
      name: data.name,
      category_id:
        typeof data.categoryId === "string"
          ? Number(data.categoryId)
          : data.categoryId,
    };
    return api.post("/subcategories", payload);
  },
  update: (id: number, data: SubcategoryData) => {
    const payload = {
      name: data.name,
      category_id:
        typeof data.categoryId === "string"
          ? Number(data.categoryId)
          : data.categoryId,
    };
    return api.put(`/subcategories/${id}`, payload);
  },
  delete: (id: number) => api.delete(`/subcategories/${id}`),
};

export const productService = {
  getAll: () => api.get("/products"),
  getFeatured: () => api.get("/products/featured"),
  getById: (id: number) => api.get(`/products/${id}`),
  deleteImage: (productId: number, imageId: number) =>
    api.delete(`/products/${productId}/images/${imageId}`),
  create: (data: FormData) => {
    const subCategoryId = data.get("subCategoryId");
    if (subCategoryId && typeof subCategoryId === "string") {
      data.delete("subCategoryId");
      data.append("sub_category_id", Number(subCategoryId).toString());
    }
    const precioOferta = data.get("precio_de_oferta");
    if (precioOferta === "") {
      data.delete("precio_de_oferta");
    }
    return api.post("/products", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  update: (id: number, data: FormData) => {
    const subCategoryId = data.get("subCategoryId");
    if (subCategoryId && typeof subCategoryId === "string") {
      data.delete("subCategoryId");
      data.append("sub_category_id", Number(subCategoryId).toString());
    }
    const precioOferta = data.get("precio_de_oferta");
    if (precioOferta === "") {
      data.delete("precio_de_oferta");
    }
    return api.put(`/products/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  delete: (id: number) => api.delete(`/products/${id}`),
};

export const contactService = {
  getAll: () => api.get("/contacts"),
  getById: (id: number) => api.get(`/contacts/${id}`),
  create: (data: ContactData) => api.post("/contacts", data),
  markAsRead: (id: number) => api.put(`/contacts/${id}/read`),
  delete: (id: number) => api.delete(`/contacts/${id}`),
};

export const claimService = {
  getAll: () => api.get("/claims"),
  getById: (id: number) => api.get(`/claims/${id}`),
  create: (data: ClaimData) => api.post("/claims", data),
};

export const testimonialService = {
  getAll: (params?: { active?: boolean }) =>
    api.get("/testimonials", { params }),
  getById: (id: number) => api.get(`/testimonials/${id}`),
  create: (data: FormData) =>
    api.post("/testimonials", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  update: (id: number, data: FormData) =>
    api.post(`/testimonials/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  delete: (id: number) => api.delete(`/testimonials/${id}`),
  toggleActive: (id: number) => api.put(`/testimonials/${id}/toggle-active`),
};

export const bannerService = {
  getAll: () => api.get("/banners"),
  getById: (id: number) => api.get(`/banners/${id}`),
  create: (data: FormData) =>
    api.post("/banners", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  update: (id: number, data: FormData) =>
    api.put(`/banners/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  delete: (id: number) => api.delete(`/banners/${id}`),
  toggleActive: (id: number) => api.put(`/banners/${id}/toggle-active`),
};

export const featuredCategoryService = {
  get: () => api.get("/featured-category"),
  update: (subcategoryId: number | null) =>
    api.put("/featured-category", { subcategory_id: subcategoryId }),
};

export default api;
