"use client"

import { useState, useEffect } from "react"
import styled from "styled-components"
import { FaPlus, FaEdit, FaTrash, FaSearch } from "react-icons/fa"
import { toast } from "react-toastify"
import { subcategoryService, categoryService } from "../../services/api"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"

// Definir tipos para las interfaces
interface Category {
  id: number
  name: string
}

interface Subcategory {
  id: number
  name: string
  categoryId: number
  category?: Category
}

interface FormValues {
  name: string
  categoryId: number | string
}

const SubcategoriasContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  background: var(--bg-primary);
  min-height: calc(100vh - 160px);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 30%, var(--accent-glow) 0%, transparent 40%),
      radial-gradient(circle at 80% 70%, var(--accent-glow) 0%, transparent 40%);
    opacity: 0.3;
    z-index: -1;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.md};
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => theme.spacing.sm};
  }
`

const SubcategoriasHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
`

const SubcategoriasTitle = styled.h1`
  margin: 0;
  font-size: 2rem;
  color: var(--text-primary);
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 1.6rem;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 1.4rem;
  }
`

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background: var(--bg-card);
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: 0 ${({ theme }) => theme.spacing.md};
  flex: 1;
  max-width: 400px;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-color);
  backdrop-filter: blur(15px);
  transition: all ${({ theme }) => theme.transitions.medium};
  
  &:focus-within {
    box-shadow: var(--shadow-lg);
    border-color: var(--accent-primary);
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    max-width: none;
  }
  
  input {
    flex: 1;
    background: none;
    border: none;
    padding: ${({ theme }) => theme.spacing.md};
    color: var(--text-primary);
    font-size: 1rem;
    
    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
      font-size: 0.95rem;
      padding: ${({ theme }) => theme.spacing.sm};
    }
    
    &:focus {
      outline: none;
    }
    
    &::placeholder {
      color: var(--text-secondary);
    }
  }
  
  svg {
    color: var(--text-secondary);
    font-size: 1.1rem;
  }
`

const AddButton = styled.button`
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all ${({ theme }) => theme.transitions.medium};
  box-shadow: var(--shadow-md);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transform: translateX(-100%);
    transition: transform 0.6s ease;
  }
  
  &:hover::before {
    transform: translateX(100%);
  }
  
  svg {
    margin-right: ${({ theme }) => theme.spacing.sm};
    font-size: 1.1rem;
  }
  
  &:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: var(--shadow-xl);
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 100%;
    justify-content: center;
    font-size: 0.95rem;
    padding: ${({ theme }) => theme.spacing.md};
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => theme.spacing.sm};
    font-size: 0.9rem;
  }
`

const SubcategoriasTable = styled.div`
  background: var(--bg-card);
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  overflow: hidden;
  overflow-x: auto;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-color);
  backdrop-filter: blur(15px);
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`

const TableHead = styled.thead`
  background: var(--bg-secondary);
  
  th {
    padding: ${({ theme }) => theme.spacing.md};
    text-align: left;
    font-weight: 600;
    color: var(--text-primary);
  }
`

const TableBody = styled.tbody`
  tr {
    border-bottom: 1px solid var(--border-color);
    transition: all ${({ theme }) => theme.transitions.fast};
    
    &:hover {
      background: var(--accent-glow);
    }
    
    &:last-child {
      border-bottom: none;
    }
  }
  
  td {
    padding: ${({ theme }) => theme.spacing.md};
    color: var(--text-primary);
  }
`

const ActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`

const EditButton = styled.button`
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  border: 1px solid var(--border-color);
  
  &:hover {
    background: var(--accent-primary);
    color: white;
    transform: translateY(-1px);
    box-shadow: var(--shadow-sm);
  }
`

const DeleteButton = styled.button`
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    background: linear-gradient(135deg, #dc2626, #b91c1c);
    transform: translateY(-1px);
    box-shadow: var(--shadow-sm);
  }
`

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: ${({ theme }) => theme.spacing.md};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => theme.spacing.sm};
  }
`

const ModalContent = styled.div`
  background: var(--bg-card);
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: ${({ theme }) => theme.spacing.xl};
  width: 90%;
  max-width: 500px;
  box-shadow: var(--shadow-xl);
  border: 1px solid var(--border-color);
  backdrop-filter: blur(20px);
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.lg};
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => theme.spacing.md};
  }
`

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  
  h2 {
    margin: 0;
    color: var(--text-primary);
  }
`

const CloseButton = styled.button`
  background: none;
  border: none;
  color: var(--text-primary);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 5px;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    color: var(--accent-primary);
    background: var(--accent-glow);
  }
`

const FormGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`

const Label = styled.label`
  display: block;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  font-weight: 500;
`

const StyledField = styled(Field)`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: ${({ theme }) => theme.borderRadius.small};
  color: var(--text-primary);
  font-size: 1rem;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:focus {
    outline: none;
    border-color: var(--accent-primary);
    box-shadow: 0 0 0 3px var(--accent-glow);
  }
  
  &::placeholder {
    color: var(--text-secondary);
  }
`

const ErrorText = styled.div`
  color: #ef4444;
  font-size: 0.85rem;
  margin-top: ${({ theme }) => theme.spacing.xs};
`

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.xl};
`

const CancelButton = styled.button`
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  border: 1px solid var(--border-color);
  
  &:hover {
    background: var(--accent-glow);
    transform: translateY(-1px);
  }
`

const SaveButton = styled.button`
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  box-shadow: var(--shadow-md);
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: var(--shadow-lg);
  }
  
  &:disabled {
    background: var(--bg-secondary);
    cursor: not-allowed;
    opacity: 0.6;
  }
`

const NoResults = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
  color: var(--text-secondary);
  font-style: italic;
`

// Esquema de validación mejorado
const SubcategorySchema = Yup.object().shape({
  name: Yup.string()
    .required("El nombre es requerido")
    .min(3, "El nombre debe tener al menos 3 caracteres"),
  categoryId: Yup.string()
    .required("La categoría es requerida")
    .test(
      "is-valid-category",
      "La categoría es requerida",
      (value) => {
        if (!value) return false
        return true
      },
    ),
})

const SubcategoriasAdmin = () => {
  const [subcategories, setSubcategories] = useState<Subcategory[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [filteredSubcategories, setFilteredSubcategories] = useState<Subcategory[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentSubcategory, setCurrentSubcategory] = useState<Subcategory | null>(null)
  // Estado para controlar si hay una operación en curso
  const [isOperationInProgress, setIsOperationInProgress] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [subcategoriesRes, categoriesRes] = await Promise.all([
          subcategoryService.getAll(),
          categoryService.getAll(),
        ])

        setSubcategories(subcategoriesRes.data)
        setFilteredSubcategories(subcategoriesRes.data)
        setCategories(categoriesRes.data)
        setLoading(false)
      } catch {
        toast.error("Error al cargar las subcategorías")
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const filtered = subcategories.filter(
        (subcategory) =>
          subcategory.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          subcategory.category?.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredSubcategories(filtered)
    } else {
      setFilteredSubcategories(subcategories)
    }
  }, [searchTerm, subcategories])

  const handleAddSubcategory = () => {
    setCurrentSubcategory(null)
    setIsModalOpen(true)
  }

  const handleEditSubcategory = (subcategory: Subcategory) => {
    setCurrentSubcategory(subcategory)
    setIsModalOpen(true)
  }

  const handleDeleteSubcategory = async (id: number) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta subcategoría?")) {
      try {
        await subcategoryService.delete(id)
        setSubcategories((prev) => prev.filter((subcategory) => subcategory.id !== id))
        toast.success("Subcategoría eliminada correctamente")
      } catch {
        toast.error("Error al eliminar la subcategoría")
      }
    }
  }

  // Función mejorada para guardar subcategorías
  const handleSaveSubcategory = async (values: FormValues) => {
    // Si ya hay una operación en curso, no permitir otra
    if (isOperationInProgress) {
      toast.info("Hay una operación en curso, por favor espere")
      return
    }



    try {
      setIsOperationInProgress(true)

      if (!values.categoryId) {
        toast.error("Debe seleccionar una categoría")
        return
      }

      const subcategoryData = {
        name: values.name,
        categoryId: parseInt(values.categoryId),
      }
      

      
      if (isNaN(subcategoryData.categoryId)) {
        toast.error("ID de categoría inválido")
        return
      }

      if (currentSubcategory) {
        // Actualizar subcategoría
        const response = await subcategoryService.update(currentSubcategory.id, subcategoryData)

        // Actualizar el estado con una nueva copia del array
        const updatedSubcategories = subcategories.map((s) => (s.id === currentSubcategory.id ? response.data : s))
        setSubcategories([...updatedSubcategories])

        toast.success("Subcategoría actualizada correctamente")
      } else {
        // Crear nueva subcategoría
        const response = await subcategoryService.create(subcategoryData)

        // Actualizar el estado con una nueva copia del array
        setSubcategories((prevSubcategories) => [...prevSubcategories, response.data])

        toast.success("Subcategoría creada correctamente")
      }

      // Limpiar el estado y cerrar el modal
      setCurrentSubcategory(null)
      setIsModalOpen(false)
    } catch {
      toast.error("Error al guardar la subcategoría")
    } finally {
      setIsOperationInProgress(false)
    }
  }

  // Asegurar que el modal se cierre correctamente
  const closeModal = () => {
    setIsModalOpen(false)
    setCurrentSubcategory(null)
  }

  const getCategoryName = (categoryId: number) => {
    const category = categories.find((cat) => cat.id === categoryId)
    return category ? category.name : "N/A"
  }

  // Función para manejar los cambios de campo (comentada por no uso)
  // const handleFieldChange = (e, setFieldValue) => {
  //   const { name, value } = e.target

  //   if (name === "categoryId") {
  //     const numValue = value === "" ? "" : Number(value)
  //     setFieldValue(name, numValue)
  //   } else {
  //     setFieldValue(name, value)
  //   }
  // }

  return (
    <SubcategoriasContainer>
      <SubcategoriasHeader>
        <SubcategoriasTitle>Gestión de Subcategorías</SubcategoriasTitle>

        <SearchBar>
          <FaSearch />
          <input
            type="text"
            placeholder="Buscar subcategorías..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchBar>

        <AddButton onClick={handleAddSubcategory}>
          <FaPlus />
          Nueva Subcategoría
        </AddButton>
      </SubcategoriasHeader>

      <SubcategoriasTable>
        {loading ? (
          <NoResults>Cargando subcategorías...</NoResults>
        ) : filteredSubcategories.length > 0 ? (
          <Table>
            <TableHead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Acciones</th>
              </tr>
            </TableHead>
            <TableBody>
              {filteredSubcategories.map((subcategory) => (
                <tr key={subcategory.id}>
                  <td>{subcategory.id}</td>
                  <td>{subcategory.name}</td>
                  <td>{subcategory.category?.name || getCategoryName(subcategory.categoryId)}</td>
                  <td>
                    <ActionButtons>
                      <EditButton onClick={() => handleEditSubcategory(subcategory)}>
                        <FaEdit />
                      </EditButton>
                      <DeleteButton onClick={() => handleDeleteSubcategory(subcategory.id)}>
                        <FaTrash />
                      </DeleteButton>
                    </ActionButtons>
                  </td>
                </tr>
              ))}
            </TableBody>
          </Table>
        ) : (
          <NoResults>No se encontraron subcategorías</NoResults>
        )}
      </SubcategoriasTable>

      {isModalOpen && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <h2>{currentSubcategory ? "Editar Subcategoría" : "Nueva Subcategoría"}</h2>
              <CloseButton onClick={closeModal}>×</CloseButton>
            </ModalHeader>

            <Formik
              enableReinitialize
              initialValues={{ 
                name: currentSubcategory?.name || "", 
                categoryId: currentSubcategory?.categoryId ? String(currentSubcategory.categoryId) : "",
              }}
              validationSchema={SubcategorySchema}
              validateOnChange={true}
              validateOnBlur={true}
              onSubmit={(values: FormValues, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
                handleSaveSubcategory(values)
                setSubmitting(false)
              }}
            >
              {({ isSubmitting }) => (
                <Form>
                  <FormGroup>
                    <Label htmlFor="name">Nombre de la Subcategoría</Label>
                    <StyledField type="text" name="name" id="name" placeholder="Nombre de la subcategoría" />
                    <ErrorMessage name="name" component={ErrorText} />
                  </FormGroup>

                  <FormGroup>
                    <Label htmlFor="categoryId">Categoría</Label>
                    <Field name="categoryId">
                      {({ field, form }) => (
                        <select
                          {...field}
                          className="form-control"
                          style={{
                            width: "100%",
                            padding: "0.5rem",
                            backgroundColor: "#2b2b2b",
                            color: "white",
                            border: "1px solid #404040",
                            borderRadius: "4px",
                          }}
                          onChange={(e) => {
                            const value = e.target.value
                            form.setFieldValue("categoryId", value)
                          }}
                          value={field.value}
                        >
                          <option value="">Seleccionar categoría</option>
                          {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      )}
                    </Field>
                    <ErrorMessage name="categoryId" component={ErrorText} />
                  </FormGroup>

                  <ButtonGroup>
                    <CancelButton type="button" onClick={() => setIsModalOpen(false)}>
                      Cancelar
                    </CancelButton>
                    <SaveButton type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Guardando..." : currentSubcategory ? "Actualizar" : "Crear"}
                    </SaveButton>
                  </ButtonGroup>
                </Form>
              )}
            </Formik>
          </ModalContent>
        </Modal>
      )}
    </SubcategoriasContainer>
  )
}

export default SubcategoriasAdmin
