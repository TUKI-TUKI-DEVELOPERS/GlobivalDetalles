import React, { useState, useEffect } from 'react'
import styled from "styled-components"
import { 
  FaPlus, 
  FaTrash, 
  FaEye, 
  FaEyeSlash, 
  FaImage,
  FaSearch,
  FaFilter,
  FaUpload,
  FaCheck,
  FaTimes
} from 'react-icons/fa'
import { toast } from 'react-toastify'

// Constantes temporales
const IMAGE_BASE_URL = '/images'

import { bannerService } from '../../services/api'

// Helper para construir URLs de imagen
const buildImageUrl = (path?: string) => {
  if (!path) return ""
  if (/^https?:\/\//.test(path)) return path
  const clean = path.replace(/^\/+/, "")
  return clean.startsWith("storage/")
    ? `${IMAGE_BASE_URL}/${clean}`
    : `${IMAGE_BASE_URL}/storage/${clean}`
}

// Estilos consistentes con ProductosAdmin
const BannersContainer = styled.div`
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

const BannersHeader = styled.div`
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

const BannersTitle = styled.h1`
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

const SearchInput = styled.input`
  border: none;
  background: transparent;
  padding: ${({ theme }) => theme.spacing.md};
  width: 100%;
  color: var(--text-primary);
  font-size: 1rem;
  
  &:focus {
    outline: none;
  }
  
  &::placeholder {
    color: var(--text-muted);
  }
`

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  font-weight: 600;
  transition: all ${({ theme }) => theme.transitions.fast};
  box-shadow: var(--shadow-md);
  background: var(--accent-gradient);
  color: white;
  border: none;
  cursor: pointer;
  
  &:hover {
    box-shadow: var(--shadow-lg);
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
`

const FiltersContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  flex-wrap: wrap;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    gap: ${({ theme }) => theme.spacing.sm};
  }
`

const FilterButton = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== 'active' && prop !== '$active'
})<{ $active?: boolean; active?: boolean }>`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  font-weight: 500;
  transition: all ${({ theme }) => theme.transitions.fast};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  cursor: pointer;
  
  ${({ $active, active }) => ($active ?? active) ? `
    background: var(--accent-gradient);
    color: white;
    box-shadow: var(--shadow-md);
    border: none;
  ` : `
    background: var(--bg-card);
    color: var(--text-primary);
    border: 1px solid var(--border-color);
  `}
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }
`

const BannerGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`

const BannerCard = styled.div`
  background: var(--bg-card);
  border-radius: ${({ theme }) => theme.borderRadius.large};
  overflow: hidden;
  box-shadow: var(--shadow-md);
  transition: all ${({ theme }) => theme.transitions.medium};
  border: 1px solid var(--border-color);
  position: relative;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-lg);
  }
`

const BannerImage = styled.div`
  height: 200px;
  overflow: hidden;
  position: relative;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform ${({ theme }) => theme.transitions.medium};
  }
  
  &:hover img {
    transform: scale(1.05);
  }
`

const BannerContent = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
`

const BannerTitle = styled.h3`
  margin: 0 0 ${({ theme }) => theme.spacing.md};
  color: var(--text-primary);
  font-size: 1.2rem;
`

const BannerMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing.md};
`

const BannerStatus = styled.span<{ active: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  font-size: 0.8rem;
  font-weight: 500;
  
  ${({ active }) => active ? `
    background-color: var(--success-light);
    color: var(--success);
  ` : `
    background-color: var(--danger-light);
    color: var(--danger);
  `}
`

const BannerActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`

const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: ${({ theme }) => theme.borderRadius.circle};
  transition: all ${({ theme }) => theme.transitions.fast};
  background: transparent;
  border: none;
  cursor: pointer;
  
  &.toggle {
    color: var(--text-muted);
    
    &:hover {
      background-color: var(--bg-hover);
      color: var(--accent-primary);
    }
  }
  
  &.delete {
    color: var(--danger);
    
    &:hover {
      background-color: var(--danger-light);
    }
  }
`

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl} 0;
  
  svg {
    font-size: 4rem;
    color: var(--text-muted);
    margin-bottom: ${({ theme }) => theme.spacing.lg};
  }
  
  h3 {
    font-size: 1.5rem;
    color: var(--text-primary);
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }
  
  p {
    color: var(--text-muted);
    margin-bottom: ${({ theme }) => theme.spacing.lg};
  }
`

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  
  &:after {
    content: "";
    width: 40px;
    height: 40px;
    border: 4px solid var(--border-color);
    border-top-color: var(--accent-primary);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: ${({ theme }) => theme.spacing.md};
`

const ModalContent = styled.div`
  background: var(--bg-card);
  border-radius: ${({ theme }) => theme.borderRadius.large};
  box-shadow: var(--shadow-xl);
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  animation: modalFadeIn 0.3s ease-out;
  
  @keyframes modalFadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid var(--border-color);
  
  h2 {
    margin: 0;
    font-size: 1.5rem;
    color: var(--text-primary);
  }
`

const ModalBody = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
`

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid var(--border-color);
`

const FormGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  
  label {
    display: block;
    margin-bottom: ${({ theme }) => theme.spacing.sm};
    font-weight: 500;
    color: var(--text-primary);
  }
  
  input, textarea {
    width: 100%;
    padding: ${({ theme }) => theme.spacing.md};
    border-radius: ${({ theme }) => theme.borderRadius.medium};
    border: 1px solid var(--border-color);
    background: var(--bg-input);
    color: var(--text-primary);
    font-size: 1rem;
    transition: all ${({ theme }) => theme.transitions.fast};
    
    &:focus {
      outline: none;
      border-color: var(--accent-primary);
      box-shadow: 0 0 0 2px var(--accent-primary-alpha);
    }
  }
`

const ImagePreview = styled.div`
  margin-top: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  overflow: hidden;
  border: 1px solid var(--border-color);
  
  img {
    width: 100%;
    height: auto;
    max-height: 200px;
    object-fit: contain;
  }
`

const FileInput = styled.div`
  position: relative;
  
  input[type="file"] {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
  }
  
  .file-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: ${({ theme }) => theme.spacing.sm};
    padding: ${({ theme }) => theme.spacing.md};
    border-radius: ${({ theme }) => theme.borderRadius.medium};
    border: 1px dashed var(--border-color);
    background: var(--bg-input);
    color: var(--text-muted);
    font-weight: 500;
    transition: all ${({ theme }) => theme.transitions.fast};
    text-align: center;
    
    &:hover {
      border-color: var(--accent-primary);
      color: var(--accent-primary);
    }
  }
`

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  
  input[type="checkbox"] {
    width: auto;
  }
`

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  font-weight: 600;
  transition: all ${({ theme }) => theme.transitions.fast};
  cursor: pointer;
  
  ${({ variant }) => {
    switch (variant) {
      case 'primary':
        return `
          background: var(--accent-gradient);
          color: white;
          border: none;
          box-shadow: var(--shadow-md);
          
          &:hover {
            box-shadow: var(--shadow-lg);
            transform: translateY(-2px);
          }
          
          &:active {
            transform: translateY(0);
          }
        `;
      case 'danger':
        return `
          background: var(--danger);
          color: white;
          border: none;
          
          &:hover {
            background: var(--danger-dark);
          }
        `;
      default:
        return `
          background: var(--bg-card);
          color: var(--text-primary);
          border: 1px solid var(--border-color);
          
          &:hover {
            background: var(--bg-hover);
          }
        `;
    }
  }}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`

interface Banner {
  id: number;
  title: string | null;
  image: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

const BannersAdmin: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'inactive'>('all')
  const [openForm, setOpenForm] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const [currentBanner, setCurrentBanner] = useState<Banner | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    active: true,
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchBanners()
  }, [])

  const fetchBanners = async () => {
    try {
      setLoading(true)
      let response
      try {
        response = await bannerService.getAll()
      } catch (err1: any) {
        // Si falla, lanzamos el error
        throw err1
      }
      const raw = response?.data
      const data = Array.isArray(raw) ? raw : (raw?.data || [])
      const mapped = data.map((b: any) => ({
        id: b.id,
        title: b.title ?? b.titulo ?? null,
        image: b.image ?? b.imagen ?? '',
        active: !!(b.active ?? (b.activo ?? false)),
        createdAt: b.created_at ?? b.createdAt ?? new Date().toISOString(),
        updatedAt: b.updated_at ?? b.updatedAt ?? new Date().toISOString(),
      }))
      setBanners(mapped)
    } catch (error) {
      console.error('Error al cargar banners:', error)
      toast.error('Error al cargar los banners')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenForm = (banner?: Banner) => {
    if (banner) {
      setCurrentBanner(banner)
      setFormData({
        title: banner.title || '',
        active: banner.active,
      })
      setPreviewImage(buildImageUrl(banner.image))
    } else {
      setCurrentBanner(null)
      setFormData({ title: '', active: true })
      setPreviewImage(null)
      setSelectedFile(null)
    }
    setOpenForm(true)
  }

  const handleCloseForm = () => {
    setOpenForm(false)
    setCurrentBanner(null)
    setFormData({ title: '', active: true })
    setPreviewImage(null)
    setSelectedFile(null)
  }

  const handleOpenDelete = (banner: Banner) => {
    setCurrentBanner(banner)
    setOpenDelete(true)
  }

  const handleCloseDelete = () => {
    setOpenDelete(false)
    setCurrentBanner(null)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target
    setFormData({
      ...formData,
      [name]: name === 'active' ? checked : value,
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedFile(file)
      
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formDataToSend = new FormData()
      // Enviar tanto claves en inglés como en español por compatibilidad
      formDataToSend.append('title', formData.title)
      formDataToSend.append('titulo', formData.title)
      formDataToSend.append('active', formData.active ? '1' : '0')
      formDataToSend.append('activo', formData.active ? '1' : '0')
      if (selectedFile) {
        formDataToSend.append('image', selectedFile)
        formDataToSend.append('imagen', selectedFile)
      }

      if (currentBanner) {
        // El backend no expone endpoint de actualización para banners
        // Estrategia: crear un nuevo banner con los cambios y luego eliminar o desactivar el anterior
        if (!selectedFile) {
          throw new Error('El backend no soporta editar banners. Para actualizar, selecciona una nueva imagen y crearemos un banner de reemplazo.')
        }
        // 1) Crear nuevo banner con los cambios
        await bannerService.create(formDataToSend)
        // 2) Intentar eliminar el anterior (requiere auth). Si falla, desactivar si estaba activo.
        try {
          await bannerService.delete(currentBanner.id)
        } catch (errDelete: any) {
          try {
            if (currentBanner.active) {
              await bannerService.toggleActive(currentBanner.id)
            }
          } catch (errToggle: any) {}
        }
        toast.success('Banner actualizado creando uno nuevo y reemplazando el anterior')
      } else {
        // Creación
        if (!selectedFile) {
          throw new Error('La imagen es obligatoria para crear un banner')
        }
        await bannerService.create(formDataToSend)
        toast.success('Banner creado correctamente')
      }

      handleCloseForm()
      fetchBanners()
    } catch (error: any) {
      console.error('Error al guardar banner:', error)
      const message = error?.response?.data?.message || error?.message || 'Error al guardar el banner'
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!currentBanner) return

    try {
      // Intento: DELETE en ruta pública
      try {
        await bannerService.delete(currentBanner.id)
        toast.success('Banner eliminado correctamente')
        handleCloseDelete()
        fetchBanners()
        return
      } catch (errPublicDelete: any) {}

      // Fallback: desactivar usando el endpoint dedicado
      try {
        await bannerService.toggleActive(currentBanner.id)
        toast.success('Banner desactivado correctamente (eliminación no permitida)')
        handleCloseDelete()
        fetchBanners()
        return
      } catch (errToggle: any) {}

      toast.error('No se pudo eliminar ni desactivar el banner')
    } catch (error: any) {
      console.error('Error al eliminar banner:', error)
      const message = error?.response?.data?.message || error?.message || 'Error al eliminar el banner'
      toast.error(message)
    }
  }

  const toggleBannerStatus = async (banner: Banner) => {
    try {
      await bannerService.toggleActive(banner.id)
      toast.success(`Banner ${!banner.active ? 'activado' : 'desactivado'} correctamente`)
      fetchBanners()
    } catch (error: any) {
      console.error('Error al cambiar estado del banner:', error)
      const message = error?.response?.data?.message || error?.message || 'Error al cambiar el estado del banner'
      toast.error(message)
    }
  }

  const filteredBanners = banners.filter(banner => {
    const matchesSearch = banner.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         banner.id.toString().includes(searchTerm)
    const matchesFilter = filterActive === 'all' || 
                         (filterActive === 'active' && banner.active) ||
                         (filterActive === 'inactive' && !banner.active)
    return matchesSearch && matchesFilter
  })

  // Mapa de orden por pestaña (solo banners activos dentro del conjunto filtrado)
  const activeOrderMap = new Map<number, number>()
  filteredBanners.filter(b => b.active).forEach((b, idx) => {
    activeOrderMap.set(b.id, idx + 1)
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

  return (
    <BannersContainer>
      <BannersHeader>
        <BannersTitle>Gestión de Banners</BannersTitle>
        <ActionButton onClick={() => handleOpenForm()}>
          <FaPlus />
          Nuevo Banner
        </ActionButton>
      </BannersHeader>

      <div>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <SearchBar>
            <FaSearch className="text-gray-400" />
            <SearchInput
              type="text"
              placeholder="Buscar banners..."
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Banners</p>
                <p className="text-2xl font-bold text-gray-900">{banners.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FaImage className="text-blue-600 text-xl" />
              </div>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Activos</p>
                <p className="text-2xl font-bold text-green-600">
                  {banners.filter(b => b.active).length}
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
                <p className="text-gray-600 text-sm">Inactivos</p>
                <p className="text-2xl font-bold text-red-600">
                  {banners.filter(b => !b.active).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <FaEyeSlash className="text-red-600 text-xl" />
              </div>
            </div>
          </div>
        </div>

      {/* Banners Grid */}
      {loading ? (
        <LoadingSpinner />
      ) : filteredBanners.length === 0 ? (
        <EmptyState>
          <FaImage />
          <h3>No hay banners</h3>
          <p>
            {searchTerm || filterActive !== 'all' 
              ? 'No se encontraron banners con los filtros aplicados'
              : 'Comienza creando tu primer banner'
            }
          </p>
          {!searchTerm && filterActive === 'all' && (
            <ActionButton onClick={() => handleOpenForm()}>
              <FaPlus />
              Crear Banner
            </ActionButton>
          )}
        </EmptyState>
      ) : (
        <BannerGrid>
          {filteredBanners.map((banner) => (
            <BannerCard key={banner.id}>
              <BannerImage>
                <img
                  src={buildImageUrl(banner.image)}
                  alt={banner.title || 'Banner'}
                />
              </BannerImage>
              
              <BannerContent>
                <BannerTitle>
                  {banner.title || 'Sin título'}
                </BannerTitle>
                <p className="text-sm text-gray-600">
                  Creado: {formatDate(banner.createdAt)}
                </p>
                
                <BannerMeta>
                  {/* Orden visual por pestaña */}
                  <BannerStatus active={banner.active}>
                    {banner.active ? (
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
                  </BannerStatus>

                  <BannerActions>
                    <IconButton 
                      className="toggle"
                      onClick={() => toggleBannerStatus(banner)}
                      title={banner.active ? 'Desactivar' : 'Activar'}
                    >
                      {banner.active ? <FaEyeSlash /> : <FaEye />}
                    </IconButton>
                    <IconButton 
                      className="delete"
                      onClick={() => handleOpenDelete(banner)}
                      title="Eliminar"
                    >
                      <FaTrash />
                    </IconButton>
                  </BannerActions>
                </BannerMeta>
              </BannerContent>
            </BannerCard>
          ))}
        </BannerGrid>
      )}
      </div>

      {/* Form Modal */}
      {openForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {currentBanner ? 'Editar Banner' : 'Nuevo Banner'}
                </h2>
                <button
                  onClick={handleCloseForm}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FaTimes className="text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título del Banner
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Ingresa el título del banner"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Imagen del Banner
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                    {previewImage ? (
                      <div className="space-y-4">
                        <img
                          src={previewImage}
                          alt="Preview"
                          className="max-w-full h-48 object-cover mx-auto rounded-lg"
                        />
                        <div className="flex justify-center gap-2">
                          <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                            <FaUpload className="inline mr-2" />
                            Cambiar Imagen
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleFileChange}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <FaUpload className="mx-auto text-4xl text-gray-400" />
                        <div>
                          <label className="cursor-pointer bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                            Seleccionar Imagen
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleFileChange}
                              className="hidden"
                              required={!currentBanner}
                            />
                          </label>
                        </div>
                        <p className="text-sm text-gray-500">
                          Formatos soportados: JPG, PNG, GIF (máx. 5MB)
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="active"
                    name="active"
                    checked={formData.active}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="active" className="ml-2 text-sm text-gray-700">
                    Banner activo (visible en el sitio web)
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
                        {currentBanner ? 'Actualizar Banner' : 'Crear Banner'}
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
      {openDelete && currentBanner && (
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
                ¿Estás seguro de que deseas eliminar el banner "{currentBanner.title || 'Sin título'}"? 
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
    </BannersContainer>
  )
}

export default BannersAdmin