import React, { useState, useEffect } from 'react'
import styled from "styled-components"
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaEye, 
  FaEyeSlash, 
  FaQuoteLeft,
  FaSearch,
  FaFilter,
  FaStar,
  FaUser,
  FaCheck,
  FaTimes
} from 'react-icons/fa'
import { toast } from 'react-toastify'

// Servicio temporal para desarrollo
const testimonialService = {
  getTestimonials: () => Promise.resolve([]),
  createTestimonial: () => Promise.resolve({}),
  updateTestimonial: () => Promise.resolve({}),
  deleteTestimonial: () => Promise.resolve({}),
  toggleTestimonialVisibility: () => Promise.resolve({})
}

// Estilos consistentes con ProductosAdmin
const TestimoniosContainer = styled.div`
  padding: 1.5rem;
  background: linear-gradient(to bottom right, #f8fafc, #e0f2fe);
  min-height: calc(100vh - 160px);
  position: relative;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
  
  @media (max-width: 640px) {
    padding: 0.75rem;
  }
`

const TestimoniosHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
  
  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`

const TestimoniosTitle = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.5rem;
`

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background: white;
  border-radius: 0.5rem;
  padding: 0 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  flex: 1;
  max-width: 400px;
  
  svg {
    color: #6b7280;
    margin-right: 0.5rem;
  }
  
  input {
    border: none;
    background: transparent;
    padding: 0.75rem;
    color: #111827;
    font-size: 0.95rem;
    width: 100%;
    outline: none;
    
    &::placeholder {
      color: #9ca3af;
    }
  }
`

const FiltersContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`

const FilterButton = styled.button<{ active: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  background: ${props => props.active ? '#3b82f6' : 'white'};
  color: ${props => props.active ? 'white' : '#6b7280'};
  border: 1px solid ${props => props.active ? '#3b82f6' : '#e5e7eb'};
  
  &:hover {
    background: ${props => props.active ? '#2563eb' : '#f9fafb'};
  }
  
  svg {
    font-size: 0.9rem;
  }
`

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  background: #3b82f6;
  color: white;
  border: none;
  transition: all 0.2s ease;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  svg {
    font-size: 0.9rem;
  }
`

const TestimonioGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1rem;
  }
`

const TestimonioCard = styled.div`
  background: var(--bg-card);
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-md);
  }
`

const TestimonioImage = styled.div`
  height: 180px;
  overflow: hidden;
  background: var(--bg-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    transition: transform 0.5s ease;
  }
  
  svg {
    font-size: 3rem;
    color: var(--text-tertiary);
  }
  
  ${TestimonioCard}:hover & img {
    transform: scale(1.05);
  }
`

const TestimonioContent = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
`

const TestimonioTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 ${({ theme }) => theme.spacing.xs};
`

const TestimonioMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: ${({ theme }) => theme.spacing.md};
`

const TestimonioStatus = styled.div<{ active: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  font-size: 0.85rem;
  font-weight: 500;
  color: ${props => props.active ? 'var(--success)' : 'var(--danger)'};
`

const TestimonioActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
`

const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: all 0.2s ease;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  
  &.toggle {
    color: var(--text-secondary);
    
    &:hover {
      background: var(--bg-hover);
      color: var(--text-primary);
    }
  }
  
  &.delete {
    color: var(--danger);
    
    &:hover {
      background: var(--danger-light);
    }
  }
`

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  
  svg {
    font-size: 3rem;
    color: var(--text-tertiary);
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }
  
  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0 0 ${({ theme }) => theme.spacing.xs};
  }
  
  p {
    color: var(--text-secondary);
    margin-bottom: ${({ theme }) => theme.spacing.md};
    max-width: 400px;
  }
`

const LoadingSpinner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xl} 0;
  
  &:before {
    content: '';
    box-sizing: border-box;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 3px solid var(--border-color);
    border-top-color: var(--accent-primary);
    animation: spinner 0.6s linear infinite;
  }
  
  @keyframes spinner {
    to {
      transform: rotate(360deg);
    }
  }
`

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: ${({ theme }) => theme.spacing.md};
`

const ModalContent = styled.div`
  background: var(--bg-card);
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: var(--shadow-lg);
`

const ModalHeader = styled.div`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  h2 {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
  }
`

const ModalBody = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
`

const ModalFooter = styled.div`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.sm};
`

const FormGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};
  
  label {
    display: block;
    font-weight: 500;
    margin-bottom: ${({ theme }) => theme.spacing.xs};
    color: var(--text-primary);
  }
  
  input[type="text"],
  textarea {
    width: 100%;
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
    border: 1px solid var(--border-color);
    border-radius: ${({ theme }) => theme.borderRadius.md};
    background: var(--bg-input);
    color: var(--text-primary);
    transition: all 0.2s ease;
    
    &:focus {
      border-color: var(--accent-primary);
      box-shadow: 0 0 0 3px var(--accent-primary-transparent);
      outline: none;
    }
  }
  
  textarea {
    min-height: 100px;
    resize: vertical;
  }
`

const ImagePreview = styled.div`
  margin-top: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  overflow: hidden;
  border: 1px solid var(--border-color);
  
  img {
    width: 100%;
    height: auto;
    display: block;
  }
`

const FileInput = styled.div`
  position: relative;
  margin-top: ${({ theme }) => theme.spacing.xs};
  
  input[type="file"] {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
  }
  
  .file-label {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: ${({ theme }) => theme.spacing.xs};
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
    background: var(--bg-secondary);
    border: 1px dashed var(--border-color);
    border-radius: ${({ theme }) => theme.borderRadius.md};
    color: var(--text-secondary);
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
      background: var(--bg-hover);
    }
  }
`

const RatingSelector = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-top: ${({ theme }) => theme.spacing.xs};
`

const StarButton = styled.button<{ active: boolean }>`
  background: none;
  border: none;
  padding: ${({ theme }) => theme.spacing.xs};
  color: ${props => props.active ? 'var(--warning)' : 'var(--text-tertiary)'};
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: scale(1.2);
  }
`

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-top: ${({ theme }) => theme.spacing.xs};
  
  input[type="checkbox"] {
    width: 18px;
    height: 18px;
    cursor: pointer;
  }
  
  label {
    margin: 0;
    cursor: pointer;
  }
`

const Button = styled.button`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: 500;
  transition: all 0.2s ease;
  
  &.primary {
    background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
    color: white;
    border: none;
    
    &:hover {
      box-shadow: var(--shadow-md);
    }
    
    &:disabled {
      background: var(--text-tertiary);
      cursor: not-allowed;
    }
  }
  
  &.secondary {
    background: var(--bg-secondary);
    color: var(--text-secondary);
    border: 1px solid var(--border-color);
    
    &:hover {
      background: var(--bg-hover);
    }
  }
  
  &.danger {
    background: var(--danger);
    color: white;
    border: none;
    
    &:hover {
      background: var(--danger-dark);
    }
  }
`

interface Testimonio {
  id: number;
  nombre: string;
  cargo?: string;
  empresa?: string;
  testimonio: string;
  calificacion: number;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
  imageUrl?: string;
  imageIsSvg?: boolean;
  imageDimensions?: { width: number; height: number } | null;
}

const TestimoniosAdmin: React.FC = () => {
  const [testimonios, setTestimonios] = useState<Testimonio[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'inactive'>('all')
  const [filterRating, setFilterRating] = useState<'all' | '5' | '4' | '3' | '2' | '1'>('all')
  const [openForm, setOpenForm] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const [currentTestimonio, setCurrentTestimonio] = useState<Testimonio | null>(null)
  const [formData, setFormData] = useState({
    nombre: '',
    cargo: '',
    empresa: '',
    testimonio: '',
    calificacion: 5,
    activo: true,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)

  useEffect(() => {
    fetchTestimonios()
  }, [])

  const fetchTestimonios = async () => {
    try {
      setLoading(true)
      // Intentar conectar al backend primero
      const response = await testimonialService.getAll()
      const data = Array.isArray(response.data) ? response.data : response.data?.data || []
      const mapped = data.map((t: any) => ({
        id: t.id,
        nombre: t.name || '',
        cargo: '',
        empresa: '',
        testimonio: t.message || '',
        calificacion: 5,
        activo: Boolean(t.active),
        createdAt: t.created_at || new Date().toISOString(),
        updatedAt: t.updated_at || t.created_at || new Date().toISOString(),
        imageUrl: t.image_url || null,
        imageIsSvg: Boolean(t.image_is_svg),
        imageDimensions: t.image_dimensions || null,
      }))
      setTestimonios(mapped)
      toast.success('Testimonios cargados correctamente')
    } catch (error) {
      console.error('Error al cargar testimonios desde API, usando datos de prueba:', error)
      
      // Fallback a datos de prueba si la API falla
      const mockTestimonios: Testimonio[] = [
        {
          id: 1,
          nombre: 'María González',
          cargo: 'Gerente de Compras',
          empresa: 'Empresa ABC',
          testimonio: 'Excelente servicio y productos de alta calidad. Muy recomendado para cualquier evento especial.',
          calificacion: 5,
          activo: true,
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z'
        },
        {
          id: 2,
          nombre: 'Carlos Rodríguez',
          cargo: 'Director de Eventos',
          empresa: 'Eventos Premium',
          testimonio: 'Los detalles que ofrecen son únicos y de excelente calidad. Nuestros clientes siempre quedan satisfechos.',
          calificacion: 5,
          activo: true,
          createdAt: '2024-01-20T14:15:00Z',
          updatedAt: '2024-01-20T14:15:00Z'
        },
        {
          id: 3,
          nombre: 'Ana Martínez',
          cargo: 'Coordinadora',
          empresa: 'Bodas & Más',
          testimonio: 'Profesionalismo y atención al detalle excepcionales. Definitivamente volveremos a trabajar con ellos.',
          calificacion: 4,
          activo: true,
          createdAt: '2024-01-25T09:45:00Z',
          updatedAt: '2024-01-25T09:45:00Z'
        },
        {
          id: 4,
          nombre: 'Luis Fernández',
          cargo: 'Organizador de Eventos',
          empresa: 'Celebraciones Especiales',
          testimonio: 'Gran variedad de productos y excelente servicio al cliente. Los recomiendo ampliamente.',
          calificacion: 5,
          activo: false,
          createdAt: '2024-02-01T16:20:00Z',
          updatedAt: '2024-02-01T16:20:00Z'
        }
      ]
      
      setTestimonios(mockTestimonios)
      toast.warning('Usando datos de prueba - Backend no disponible')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenForm = (testimonio?: Testimonio) => {
    if (testimonio) {
      setCurrentTestimonio(testimonio)
      setFormData({
        nombre: testimonio.nombre,
        cargo: testimonio.cargo || '',
        empresa: testimonio.empresa || '',
        testimonio: testimonio.testimonio,
        calificacion: testimonio.calificacion,
        activo: testimonio.activo,
      })
    } else {
      setCurrentTestimonio(null)
      setFormData({
        nombre: '',
        cargo: '',
        empresa: '',
        testimonio: '',
        calificacion: 5,
        activo: true,
      })
    }
    setOpenForm(true)
  }

  const handleCloseForm = () => {
    setOpenForm(false)
    setCurrentTestimonio(null)
    setFormData({
      nombre: '',
      cargo: '',
      empresa: '',
      testimonio: '',
      calificacion: 5,
      activo: true,
    })
    setImageFile(null)
  }

  const handleOpenDelete = (testimonio: Testimonio) => {
    setCurrentTestimonio(testimonio)
    setOpenDelete(true)
  }

  const handleCloseDelete = () => {
    setOpenDelete(false)
    setCurrentTestimonio(null)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : 
               name === 'calificacion' ? parseInt(value) : value,
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setImageFile(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (currentTestimonio) {
        toast.error('La edición de testimonios no está disponible actualmente')
      } else {
        const fd = new FormData()
        fd.append('name', formData.nombre)
        fd.append('message', formData.testimonio)
        fd.append('active', String(formData.activo))
        if (imageFile) {
          fd.append('image', imageFile)
        } else {
          toast.error('Debes subir una imagen para el testimonio')
          setIsSubmitting(false)
          return
        }
        await testimonialService.create(fd)
        toast.success('Testimonio creado correctamente')
      }

      handleCloseForm()
      fetchTestimonios()
    } catch (error) {
      console.error('Error al guardar testimonio:', error)
      toast.error('Error al guardar el testimonio')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!currentTestimonio) return

    try {
      await testimonialService.delete(currentTestimonio.id)
      toast.success('Testimonio eliminado correctamente')
      handleCloseDelete()
      fetchTestimonios()
    } catch (error) {
      console.error('Error al eliminar testimonio:', error)
      toast.error('Error al eliminar el testimonio')
    }
  }

  const toggleTestimonioStatus = async (testimonio: Testimonio) => {
    try {
      await testimonialService.toggleActive(testimonio.id)
      toast.success(`Testimonio ${!testimonio.activo ? 'activado' : 'desactivado'} correctamente`)
      fetchTestimonios()
    } catch (error) {
      console.error('Error al cambiar estado del testimonio:', error)
      toast.error('Error al cambiar el estado del testimonio')
    }
  }

  const filteredTestimonios = testimonios.filter(testimonio => {
    const matchesSearch = testimonio.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         testimonio.empresa?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         testimonio.testimonio.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterActive === 'all' || 
                         (filterActive === 'active' && testimonio.activo) ||
                         (filterActive === 'inactive' && !testimonio.activo)
    const matchesRating = filterRating === 'all' || testimonio.calificacion === parseInt(filterRating)
    return matchesSearch && matchesFilter && matchesRating
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <FaStar
        key={index}
        className={`${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}
      />
    ))
  }

  const getAverageRating = () => {
    if (testimonios.length === 0) return 0
    const sum = testimonios.reduce((acc, t) => acc + t.calificacion, 0)
    return (sum / testimonios.length).toFixed(1)
  }

  return (
    <>
    <TestimoniosContainer>
      <TestimoniosHeader>
        <TestimoniosTitle>Gestión de Testimonios</TestimoniosTitle>
        <ActionButton onClick={() => handleOpenForm()}>
          <FaPlus />
          Nuevo Testimonio
        </ActionButton>
      </TestimoniosHeader>

      <div>
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <SearchBar>
            <FaSearch />
            <input
              type="text"
              placeholder="Buscar testimonios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchBar>
          
          <FiltersContainer>
            <FilterButton 
              active={filterActive === 'all'} 
              onClick={() => setFilterActive('all')}
            >
              <FaFilter />
              Todos
            </FilterButton>
            <FilterButton 
              active={filterActive === 'active'} 
              onClick={() => setFilterActive('active')}
            >
              <FaEye />
              Activos
            </FilterButton>
            <FilterButton 
              active={filterActive === 'inactive'} 
              onClick={() => setFilterActive('inactive')}
            >
              <FaEyeSlash />
              Inactivos
            </FilterButton>
          </FiltersContainer>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Testimonios</p>
                <p className="text-2xl font-bold text-gray-900">{testimonios.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FaQuoteLeft className="text-blue-600 text-xl" />
              </div>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Activos</p>
                <p className="text-2xl font-bold text-green-600">
                  {testimonios.filter(t => t.activo).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FaEye className="text-green-600 text-xl" />
              </div>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Promedio</p>
                <p className="text-2xl font-bold text-yellow-600">{getAverageRating()}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <FaStar className="text-yellow-600 text-xl" />
              </div>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">5 Estrellas</p>
                <p className="text-2xl font-bold text-purple-600">
                  {testimonios.filter(t => t.calificacion === 5).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <FaStar className="text-purple-600 text-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonios Grid */}
      {loading ? (
        <LoadingSpinner />
      ) : filteredTestimonios.length === 0 ? (
        <EmptyState>
          <FaQuoteLeft />
          <h3>No hay testimonios</h3>
          <p>
            {searchTerm || filterActive !== 'all' || filterRating !== 'all'
              ? 'No se encontraron testimonios con los filtros aplicados'
              : 'Comienza agregando el primer testimonio'
            }
          </p>
          {!searchTerm && filterActive === 'all' && filterRating === 'all' && (
            <ActionButton onClick={() => handleOpenForm()}>
              <FaPlus />
              Crear Testimonio
            </ActionButton>
          )}
        </EmptyState>
      ) : (
        <TestimonioGrid>
          {filteredTestimonios.map((testimonio) => (
            <TestimonioCard key={testimonio.id}>
              <TestimonioImage>
                {testimonio.imageUrl ? (
                  testimonio.imageIsSvg ? (
                    <img
                      src={testimonio.imageUrl}
                      alt={`Imagen de ${testimonio.nombre}`}
                      style={{ objectFit: 'contain' }}
                    />
                  ) : (
                    <img
                      src={testimonio.imageUrl}
                      alt={`Imagen de ${testimonio.nombre}`}
                      style={{
                        objectFit: testimonio.imageDimensions ? 'contain' : 'cover',
                        width: '100%',
                        height: '100%'
                      }}
                    />
                  )
                ) : (
                  <FaUser />
                )}
              </TestimonioImage>
              
              <TestimonioContent>
                <TestimonioTitle>
                  {testimonio.nombre}
                </TestimonioTitle>
                <div className="flex items-center gap-1 mb-2">
                  {renderStars(testimonio.calificacion)}
                  <span className="ml-2 text-sm text-gray-600">
                    ({testimonio.calificacion}/5)
                  </span>
                </div>
                
                <div className="mb-4">
                  <FaQuoteLeft className="text-gray-300 text-lg mb-2" />
                  <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
                    {testimonio.testimonio}
                  </p>
                </div>
                
                {testimonio.cargo && (
                  <p className="text-xs text-gray-500">
                    {testimonio.cargo}
                    {testimonio.empresa && ` en ${testimonio.empresa}`}
                  </p>
                )}
                
                <TestimonioMeta>
                  <TestimonioStatus active={testimonio.activo}>
                    {testimonio.activo ? (
                      <>
                        <FaEye />
                        Activo
                      </>
                    ) : (
                      <>
                        <FaEyeSlash />
                        Inactivo
                      </>
                    )}
                  </TestimonioStatus>

                  <TestimonioActions>
                    <IconButton 
                      className="toggle"
                      onClick={() => toggleTestimonioStatus(testimonio)}
                      title={testimonio.activo ? 'Desactivar' : 'Activar'}
                    >
                      {testimonio.activo ? <FaEyeSlash /> : <FaEye />}
                    </IconButton>
                    <IconButton 
                      className="delete"
                      onClick={() => handleOpenDelete(testimonio)}
                      title="Eliminar"
                    >
                      <FaTrash />
                    </IconButton>
                  </TestimonioActions>
                </TestimonioMeta>
              </TestimonioContent>
            </TestimonioCard>
          ))}
        </TestimonioGrid>
      )}
      </TestimoniosContainer>

      {/* Form Modal */}
      {openForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {currentTestimonio ? 'Editar Testimonio' : 'Nuevo Testimonio'}
                </h2>
                <button
                  onClick={handleCloseForm}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FaTimes className="text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre *
                    </label>
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      required
                      placeholder="Nombre del cliente"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cargo
                    </label>
                    <input
                      type="text"
                      name="cargo"
                      value={formData.cargo}
                      onChange={handleInputChange}
                      placeholder="Cargo o posición"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Empresa
                  </label>
                  <input
                    type="text"
                    name="empresa"
                    value={formData.empresa}
                    onChange={handleInputChange}
                    placeholder="Nombre de la empresa"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Testimonio *
                  </label>
                  <textarea
                    name="testimonio"
                    value={formData.testimonio}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    placeholder="Escribe el testimonio del cliente..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Imagen * (SVG o raster)
                  </label>
                  <input
                    type="file"
                    accept="image/*,.svg"
                    onChange={handleFileChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Tamaño máximo 2MB. Formatos: SVG (preferido) o JPG/PNG. Recomendado en raster: 480x320 px.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Calificación *
                  </label>
                  <select
                    name="calificacion"
                    value={formData.calificacion}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={5}>5 estrellas - Excelente</option>
                    <option value={4}>4 estrellas - Muy bueno</option>
                    <option value={3}>3 estrellas - Bueno</option>
                    <option value={2}>2 estrellas - Regular</option>
                    <option value={1}>1 estrella - Malo</option>
                  </select>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="activo"
                    name="activo"
                    checked={formData.activo}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="activo" className="ml-2 text-sm text-gray-700">
                    Testimonio activo (visible en el sitio web)
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t">
                  <button
                    type="button"
                    onClick={handleCloseForm}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      <>
                        <FaCheck />
                        {currentTestimonio ? 'Actualizar Testimonio' : 'Crear Testimonio'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {openDelete && currentTestimonio && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Confirmar Eliminación
                </h3>
                <button
                  onClick={handleCloseDelete}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FaTimes className="text-gray-500" />
                </button>
              </div>
              
              <p className="text-gray-600 mb-6">
                ¿Estás seguro de que deseas eliminar el testimonio de "{currentTestimonio.nombre}"? 
                Esta acción no se puede deshacer.
              </p>
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={handleCloseDelete}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
  }

export default TestimoniosAdmin