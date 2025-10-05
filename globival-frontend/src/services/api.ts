import axios from "axios"
import { API_URL } from "../config/constants"

// Crear instancia de axios con la URL base
const api = axios.create({
  baseURL: API_URL,
})

// Interceptor para agregar el token a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Mejorar el manejo de errores en el interceptor
api.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    // Si el error es 401 (No autorizado) y no hemos intentado renovar el token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      // Aquí podrías implementar la lógica para renovar el token
      // Por ahora, simplemente redirigimos al login
      localStorage.removeItem("token")
      window.location.href = "/login"
      return Promise.reject(error)
    }

    return Promise.reject(error)
  },
)

// Tipos para los datos
interface CategoryData {
  name: string;
  description?: string;
}

interface SubcategoryData {
  name: string;
  description?: string;
  categoryId: number;
}

interface ClaimData {
  nombre: string;
  email: string;
  telefono: string;
  asunto: string;
  mensaje: string;
}

// Servicios para categorías
export const categoryService = {
  getAll: () => api.get("/categories"),
  getById: (id: number) => api.get(`/categories/${id}`),
  create: (data: CategoryData) => api.post("/categories", data),
  update: (id: number, data: CategoryData) => api.put(`/categories/${id}`, data),
  delete: (id: number) => api.delete(`/categories/${id}`),
}

// Servicios para subcategorías
export const subcategoryService = {
  getAll: () => api.get("/subcategories"),
  getById: (id: number) => api.get(`/subcategories/${id}`),
  create: (data: SubcategoryData) => {
    const payload = {
      name: data.name,
      category_id: typeof data.categoryId === "string" ? Number(data.categoryId) : data.categoryId,
    }
    return api.post("/subcategories", payload)
  },
  update: (id: number, data: SubcategoryData) => {
    const payload = {
      name: data.name,
      category_id: typeof data.categoryId === "string" ? Number(data.categoryId) : data.categoryId,
    }
    return api.put(`/subcategories/${id}`, payload)
  },
  delete: (id: number) => api.delete(`/subcategories/${id}`),
}

// Servicios para productos
export const productService = {
  getAll: () => api.get("/products"),
  getById: (id: number) => api.get(`/products/${id}`),
  getFeaturedProducts: () => api.get("/products"),
  create: (data: FormData) => {
    // Mapear y convertir 'subCategoryId' del frontend a 'sub_category_id' que espera el backend
    const subCategoryId = data.get("subCategoryId")
    if (subCategoryId && typeof subCategoryId === "string") {
      data.delete("subCategoryId")
      data.append("sub_category_id", Number(subCategoryId).toString())
    }

    // Verificar si precio_de_oferta está vacío y eliminarlo si es así
    const precioOferta = data.get("precio_de_oferta")
    if (precioOferta === "") {
      data.delete("precio_de_oferta")
    }

    return api.post("/products", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
  },
  update: (id: number, data: FormData) => {
    // Mapear y convertir 'subCategoryId' del frontend a 'sub_category_id' que espera el backend
    const subCategoryId = data.get("subCategoryId")
    if (subCategoryId && typeof subCategoryId === "string") {
      data.delete("subCategoryId")
      data.append("sub_category_id", Number(subCategoryId).toString())
    }

    // Verificar si precio_de_oferta está vacío y eliminarlo si es así
    const precioOferta = data.get("precio_de_oferta")
    if (precioOferta === "") {
      data.delete("precio_de_oferta")
    }

    return api.put(`/products/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
  },
  delete: (id: number) => api.delete(`/products/${id}`),
}

// Servicios para contactos
export const contactService = {
  getAll: () => api.get("/contacts"),
  getById: (id: number) => api.get(`/contacts/${id}`),
  markAsRead: (id: number) => api.put(`/contacts/${id}/read`),
  delete: (id: number) => api.delete(`/contacts/${id}`),
}

// Servicios para reclamaciones
export const claimService = {
  getAll: () => api.get("/claims"),
  getById: (id: number) => api.get(`/claims/${id}`),
  create: (data: ClaimData) => api.post("/claims", data),
}

// Servicios para testimonios
export const testimonialService = {
  getAll: () => api.get("/testimonials"),
  getById: (id: number) => api.get(`/testimonials/${id}`),
  create: (data: FormData) => api.post("/testimonials", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }),
  delete: (id: number) => api.delete(`/testimonials/${id}`),
  toggleActive: (id: number) => api.put(`/testimonials/${id}/toggle-active`),
}

// Servicios para banners
export const bannerService = {
  getAll: () => api.get("/banners"),
  getById: (id: number) => api.get(`/banners/${id}`),
  create: (data: FormData) => api.post("/banners", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }),
  delete: (id: number) => api.delete(`/banners/${id}`),
  toggleActive: (id: number) => api.put(`/banners/${id}/toggle-active`),
}

export default api
