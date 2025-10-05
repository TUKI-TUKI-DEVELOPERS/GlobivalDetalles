import React, { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { 
  FaTag, 
  FaInfoCircle, 
  FaCheck,
  FaArrowLeft, 
  FaArrowRight,
  FaTimes,
  FaLayerGroup
} from 'react-icons/fa'

interface Category {
  id: number;
  name: string;
}

interface Subcategory {
  id: number;
  name: string;
  categoryId: number;
  category?: Category;
}

interface SubcategoryFormProps {
  subcategory?: Subcategory | null;
  categories: Category[];
  onSave: (subcategoryData: { name: string; categoryId: number }) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const validationSchema = Yup.object({
  name: Yup.string()
    .required("El nombre es requerido")
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(50, "El nombre no puede exceder 50 caracteres"),
  categoryId: Yup.number()
    .required("La categoría es requerida")
    .positive("Debe seleccionar una categoría válida")
})

const SubcategoryForm = ({ subcategory, categories, onSave, onCancel, isSubmitting = false }: SubcategoryFormProps) => {
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 3

  const steps = [
    { id: 1, title: 'Información Básica', icon: <FaInfoCircle /> },
    { id: 2, title: 'Categoría Padre', icon: <FaLayerGroup /> },
    { id: 3, title: 'Confirmación', icon: <FaCheck /> }
  ]

  const formik = useFormik({
    initialValues: {
      name: subcategory?.name || "",
      categoryId: subcategory?.categoryId || "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await onSave({ 
          name: values.name, 
          categoryId: Number(values.categoryId) 
        })
      } catch (error) {
        console.error("Error al guardar la subcategoría:", error)
      }
    },
  })

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
        return formik.values.name && !formik.errors.name
      case 2:
        return formik.values.categoryId && !formik.errors.categoryId
      default:
        return true
    }
  }

  const getSelectedCategory = () => {
    return categories.find(cat => cat.id === Number(formik.values.categoryId))
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaInfoCircle className="text-2xl text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Información de la Subcategoría</h3>
              <p className="text-muted-foreground">Ingresa el nombre de la subcategoría</p>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                  Nombre de la Subcategoría *
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Ej: Smartphones, Laptops, Camisas..."
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
                <p className="text-muted-foreground text-xs mt-1">
                  El nombre debe ser específico y descriptivo
                </p>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaLayerGroup className="text-2xl text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Categoría Padre</h3>
              <p className="text-muted-foreground">Selecciona la categoría a la que pertenece</p>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="categoryId" className="block text-sm font-medium text-foreground mb-2">
                  Categoría *
                </label>
                <select
                  id="categoryId"
                  name="categoryId"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.categoryId}
                  className={`w-full px-4 py-3 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                    formik.touched.categoryId && formik.errors.categoryId 
                      ? 'border-red-500 bg-red-50' 
                      : 'border-border bg-background hover:border-primary/50'
                  }`}
                >
                  <option value="">Seleccionar categoría</option>
                  {categories
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                </select>
                {formik.touched.categoryId && formik.errors.categoryId && (
                  <p className="text-red-500 text-sm mt-1">{formik.errors.categoryId}</p>
                )}
                <p className="text-muted-foreground text-xs mt-1">
                  La subcategoría se organizará dentro de esta categoría
                </p>
              </div>

              {formik.values.categoryId && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <FaTag className="text-blue-600" />
                    <div>
                      <h4 className="text-blue-800 font-medium">Categoría seleccionada</h4>
                      <p className="text-blue-700 text-sm">
                        {getSelectedCategory()?.name}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCheck className="text-2xl text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Confirmar Información</h3>
              <p className="text-muted-foreground">Revisa los datos antes de guardar</p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <span className="text-muted-foreground font-medium">Nombre:</span>
                  <span className="text-foreground font-semibold">{formik.values.name}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <span className="text-muted-foreground font-medium">Categoría:</span>
                  <span className="text-foreground font-semibold">
                    {getSelectedCategory()?.name}
                  </span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-muted-foreground font-medium">Acción:</span>
                  <span className="text-foreground font-semibold">
                    {subcategory ? 'Actualizar subcategoría existente' : 'Crear nueva subcategoría'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <FaInfoCircle className="text-blue-600 mt-0.5" />
                <div>
                  <h4 className="text-blue-800 font-medium mb-1">Información importante</h4>
                  <p className="text-blue-700 text-sm">
                    {subcategory 
                      ? 'Al actualizar esta subcategoría, todos los productos asociados mantendrán su vinculación.'
                      : 'Una vez creada, podrás agregar productos a esta subcategoría.'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-1">
                {subcategory ? 'Editar Subcategoría' : 'Nueva Subcategoría'}
              </h2>
              <p className="text-muted-foreground">
                {subcategory ? 'Modifica la información de la subcategoría' : 'Crea una nueva subcategoría para organizar productos'}
              </p>
            </div>
            <button
              onClick={onCancel}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <FaTimes className="text-muted-foreground" />
            </button>
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
            <div className="min-h-[300px] mb-8">
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
                        {subcategory ? 'Actualizar Subcategoría' : 'Crear Subcategoría'}
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SubcategoryForm