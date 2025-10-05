import React, { useState, useEffect } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { 
  FaBox, 
  FaTag, 
  FaDollarSign, 
  FaImage, 
  FaArrowLeft, 
  FaArrowRight, 
  FaCheck,
  FaInfoCircle,
  FaUpload,
  FaTrash
} from 'react-icons/fa'
import { IMAGE_BASE_URL } from '../../config/constants'

// Helper para construir URLs de imagen
const buildImageUrl = (path?: string) => {
  if (!path) return ""
  if (/^https?:\/\//.test(path)) return path
  const clean = path.replace(/^\/+/, "")
  return clean.startsWith("storage/")
    ? `${IMAGE_BASE_URL}/${clean}`
    : `${IMAGE_BASE_URL}/storage/${clean}`
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  precio_de_oferta?: number;
  stock: number;
  imagen?: string;
  subCategory?: {
    id: number;
    name: string;
  };
}

interface Subcategory {
  id: number;
  name: string;
  categoryId: number;
  category?: {
    id: number;
    name: string;
  };
}

interface ProductoFormProps {
  product?: Product | null;
  subcategories: Subcategory[];
  onSave: (formData: FormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const validationSchema = Yup.object({
  name: Yup.string().required("El nombre es requerido"),
  description: Yup.string().required("La descripción es requerida"),
  price: Yup.number()
    .required("El precio es requerido")
    .positive("El precio debe ser positivo"),
  precio_de_oferta: Yup.number()
    .positive("El precio de oferta debe ser positivo")
    .test("less-than-price", "El precio de oferta debe ser menor al precio normal", function (value) {
      const { price } = this.parent;
      if (value && price && value >= price) {
        return false;
      }
      return true;
    }),
  stock: Yup.number()
    .required("El stock es requerido")
    .integer("El stock debe ser un número entero")
    .min(0, "El stock no puede ser negativo"),
  subCategoryId: Yup.number().required("La subcategoría es requerida"),
})

const ProductoForm = ({ product, subcategories, onSave, onCancel, isSubmitting = false }: ProductoFormProps) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const totalSteps = 4

  const steps = [
    { id: 1, title: 'Información Básica', icon: <FaInfoCircle /> },
    { id: 2, title: 'Categorización', icon: <FaTag /> },
    { id: 3, title: 'Precios y Stock', icon: <FaDollarSign /> },
    { id: 4, title: 'Imagen', icon: <FaImage /> }
  ]

  const formik = useFormik({
    initialValues: {
      name: product?.name || "",
      description: product?.description || "",
      price: product?.price || 0,
      precio_de_oferta: product?.precio_de_oferta || "",
      stock: product?.stock || 0,
      subCategoryId: product?.subCategory?.id || "",
      imagen: null as File | null,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const formData = new FormData()
        formData.append("name", values.name)
        formData.append("description", values.description)
        formData.append("price", values.price.toString())
        if (values.precio_de_oferta) {
          formData.append("precio_de_oferta", values.precio_de_oferta.toString())
        }
        formData.append("stock", values.stock.toString())
        formData.append("subCategoryId", values.subCategoryId.toString())
        if (values.imagen) {
          formData.append("imagen", values.imagen)
        }

        await onSave(formData)
      } catch (error) {
        console.error("Error al guardar el producto:", error)
      }
    },
  })

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      formik.setFieldValue("imagen", file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    formik.setFieldValue("imagen", null)
    setImagePreview(null)
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return formik.values.name && formik.values.description && !formik.errors.name && !formik.errors.description
      case 2:
        return formik.values.subCategoryId && !formik.errors.subCategoryId
      case 3:
        return formik.values.price && formik.values.stock !== undefined && !formik.errors.price && !formik.errors.stock && !formik.errors.precio_de_oferta
      default:
        return true
    }
  }

  useEffect(() => {
    if (product?.imagen) {
      setImagePreview(buildImageUrl(product.imagen))
    }
  }, [product])

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaInfoCircle className="text-2xl text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Información Básica</h3>
              <p className="text-muted-foreground">Ingresa el nombre y descripción del producto</p>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                  Nombre del Producto *
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Ej: Smartphone Samsung Galaxy"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.name}
                  className={`w-full px-4 py-3 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                    formik.touched.name && formik.errors.name 
                      ? 'border-red-500 bg-red-50' 
                      : 'border-border bg-background hover:border-primary/50'
                  }`}
                />
                {formik.touched.name && formik.errors.name && (
                  <p className="text-red-500 text-sm mt-1">{formik.errors.name}</p>
                )}
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
                  Descripción *
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  placeholder="Describe las características principales del producto..."
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.description}
                  className={`w-full px-4 py-3 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 resize-vertical ${
                    formik.touched.description && formik.errors.description 
                      ? 'border-red-500 bg-red-50' 
                      : 'border-border bg-background hover:border-primary/50'
                  }`}
                />
                {formik.touched.description && formik.errors.description && (
                  <p className="text-red-500 text-sm mt-1">{formik.errors.description}</p>
                )}
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaTag className="text-2xl text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Categorización</h3>
              <p className="text-muted-foreground">Selecciona la categoría y subcategoría del producto</p>
            </div>

            <div>
              <label htmlFor="subCategoryId" className="block text-sm font-medium text-foreground mb-2">
                Subcategoría *
              </label>
              <select
                id="subCategoryId"
                name="subCategoryId"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.subCategoryId}
                className={`w-full px-4 py-3 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                  formik.touched.subCategoryId && formik.errors.subCategoryId 
                    ? 'border-red-500 bg-red-50' 
                    : 'border-border bg-background hover:border-primary/50'
                }`}
              >
                <option value="">Seleccionar subcategoría</option>
                {subcategories
                  .sort((a, b) => {
                    const catCompare = (a.category?.name || '').localeCompare(b.category?.name || '');
                    if (catCompare !== 0) return catCompare;
                    return a.name.localeCompare(b.name);
                  })
                  .map((subcategory) => (
                    <option key={subcategory.id} value={subcategory.id}>
                      {subcategory.name} ({subcategory.category?.name || 'Sin categoría'})
                    </option>
                  ))}
              </select>
              {formik.touched.subCategoryId && formik.errors.subCategoryId && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.subCategoryId}</p>
              )}
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaDollarSign className="text-2xl text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Precios y Stock</h3>
              <p className="text-muted-foreground">Define el precio y la cantidad disponible</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-foreground mb-2">
                  Precio Regular (S/) *
                </label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.price}
                  className={`w-full px-4 py-3 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                    formik.touched.price && formik.errors.price 
                      ? 'border-red-500 bg-red-50' 
                      : 'border-border bg-background hover:border-primary/50'
                  }`}
                />
                {formik.touched.price && formik.errors.price && (
                  <p className="text-red-500 text-sm mt-1">{formik.errors.price}</p>
                )}
              </div>

              <div>
                <label htmlFor="precio_de_oferta" className="block text-sm font-medium text-foreground mb-2">
                  Precio de Oferta (S/)
                  <span className="text-muted-foreground text-xs ml-1">(Opcional)</span>
                </label>
                <input
                  id="precio_de_oferta"
                  name="precio_de_oferta"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.precio_de_oferta}
                  className={`w-full px-4 py-3 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                    formik.touched.precio_de_oferta && formik.errors.precio_de_oferta 
                      ? 'border-red-500 bg-red-50' 
                      : 'border-border bg-background hover:border-primary/50'
                  }`}
                />
                {formik.touched.precio_de_oferta && formik.errors.precio_de_oferta && (
                  <p className="text-red-500 text-sm mt-1">{formik.errors.precio_de_oferta}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label htmlFor="stock" className="block text-sm font-medium text-foreground mb-2">
                  Stock Disponible *
                </label>
                <input
                  id="stock"
                  name="stock"
                  type="number"
                  placeholder="0"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.stock}
                  className={`w-full px-4 py-3 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                    formik.touched.stock && formik.errors.stock 
                      ? 'border-red-500 bg-red-50' 
                      : 'border-border bg-background hover:border-primary/50'
                  }`}
                />
                {formik.touched.stock && formik.errors.stock && (
                  <p className="text-red-500 text-sm mt-1">{formik.errors.stock}</p>
                )}
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaImage className="text-2xl text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Imagen del Producto</h3>
              <p className="text-muted-foreground">Sube una imagen representativa del producto</p>
            </div>

            <div className="space-y-4">
              {!imagePreview ? (
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                  <FaUpload className="text-4xl text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">Arrastra una imagen aquí o haz clic para seleccionar</p>
                  <input
                    id="imagen"
                    name="imagen"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="imagen"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg cursor-pointer hover:bg-primary/90 transition-colors"
                  >
                    <FaUpload />
                    Seleccionar Imagen
                  </label>
                </div>
              ) : (
                <div className="relative">
                  <img 
                    src={imagePreview} 
                    alt="Vista previa" 
                    className="w-full max-w-md mx-auto rounded-lg shadow-lg"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                  >
                    <FaTrash />
                  </button>
                  <div className="mt-4 text-center">
                    <input
                      id="imagen-replace"
                      name="imagen"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="imagen-replace"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-lg cursor-pointer hover:bg-secondary/90 transition-colors"
                    >
                      <FaUpload />
                      Cambiar Imagen
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-card rounded-lg shadow-sm">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          {product ? 'Editar Producto' : 'Crear Nuevo Producto'}
        </h2>
        <p className="text-muted-foreground">
          Completa la información del producto paso a paso
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                currentStep >= step.id 
                  ? 'bg-primary border-primary text-white' 
                  : 'border-border text-muted-foreground'
              }`}>
                {currentStep > step.id ? <FaCheck /> : step.icon}
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-4 transition-colors ${
                  currentStep > step.id ? 'bg-primary' : 'bg-border'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-sm">
          {steps.map((step) => (
            <span key={step.id} className={`font-medium ${
              currentStep >= step.id ? 'text-primary' : 'text-muted-foreground'
            }`}>
              {step.title}
            </span>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <form onSubmit={formik.handleSubmit}>
        <div className="min-h-[400px] mb-8">
          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <div>
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="flex items-center gap-2 px-6 py-3 border border-border rounded-lg text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
              >
                <FaArrowLeft />
                Anterior
              </button>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 border border-border rounded-lg text-muted-foreground hover:text-foreground hover:border-red-500 hover:text-red-500 transition-colors"
            >
              Cancelar
            </button>

            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={nextStep}
                disabled={!canProceedToNext()}
                className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Siguiente
                <FaArrowRight />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <FaCheck />
                    {product ? 'Actualizar Producto' : 'Crear Producto'}
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}

export default ProductoForm
