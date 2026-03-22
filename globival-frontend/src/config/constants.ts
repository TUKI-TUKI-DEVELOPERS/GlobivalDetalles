export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://api.globivaldetalles.com/api";

export const IMAGE_BASE_URL =
  process.env.NEXT_PUBLIC_IMAGE_BASE_URL || "https://api.globivaldetalles.com";

export const CATEGORIES = {
  REGALOS: "Regalos Únicos",
  PERSONALIZADOS: "Productos Personalizados",
  OCASIONES: "Ocasiones Especiales",
  DETALLES: "Detalles de Amor",
} as const;

export const BUSINESS = {
  name: "Globival Detalles",
  phone: "967411110",
  phoneDisplay: "967 411 110",
  whatsapp: "51967411110",
  email: "globival.detalles@gmail.com",
  address: "Urbanización los cedros B4, Yanahuara",
  social: {
    facebook: "https://www.facebook.com/profile.php?id=61572916207328",
    instagram: "https://www.instagram.com/globival.detalles/",
    tiktok: "https://www.tiktok.com/@globival.detalles?lang=en",
  },
  whatsappUrl: (message?: string) =>
    `https://wa.me/51967411110${message ? `?text=${encodeURIComponent(message)}` : ""}`,
} as const;

export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/svg+xml",
  "image/gif",
];
export const MAX_IMAGE_SIZE = 4 * 1024 * 1024; // 4MB

export function validateImageFile(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return "Formato no permitido. Usa JPG, PNG, WebP, SVG o GIF.";
  }
  if (file.size > MAX_IMAGE_SIZE) {
    return `El archivo es muy grande. Máximo 4MB (actual: ${(file.size / 1024 / 1024).toFixed(1)}MB).`;
  }
  return null;
}

// Tiny 4x4 blurred placeholder for Next.js Image component
export const BLUR_DATA_URL =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNCIgaGVpZ2h0PSI0IiB2aWV3Qm94PSIwIDAgNCAgNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZTJlOGYwIi8+PC9zdmc+";

export function buildImageUrl(path: string | null | undefined): string {
  if (!path) return "/placeholder.svg";
  if (path.startsWith("http")) return path;
  return `${IMAGE_BASE_URL}${path}`;
}
