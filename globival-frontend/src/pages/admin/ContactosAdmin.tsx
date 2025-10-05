import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { 
  FaEnvelope, 
  FaPhone, 
  FaUser, 
  FaCalendarAlt,
  FaEye,
  FaTrash,
  FaSearch,
  FaFilter,
  FaTimes,
  FaExclamationTriangle,
  FaDownload,
  FaFileExport,
  FaEyeSlash,
  FaCheck,
  FaPlus
} from 'react-icons/fa'
import { toast } from 'react-toastify'

// Servicio temporal para desarrollo
const contactService = {
  getContacts: () => Promise.resolve([]),
  deleteContact: () => Promise.resolve({}),
  markAsRead: () => Promise.resolve({})
}

// Styled Components
const ContactosContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(to bottom right, #f8fafc, #e0f2fe);
  padding: 1.5rem;
`;

const ContactosHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
  
  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

const ContactosTitle = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.5rem;
`;

const SearchBar = styled.div`
  position: relative;
  flex: 1;
  max-width: 32rem;
  
  svg {
    position: absolute;
    left: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    color: #9ca3af;
  }
  
  input {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 2.5rem;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    background-color: white;
    font-size: 0.875rem;
    
    &:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
    }
  }
`;

const FiltersContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const FilterButton = styled.button<{ active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s;
  background-color: ${props => props.active ? '#3b82f6' : 'white'};
  color: ${props => props.active ? 'white' : '#4b5563'};
  border: 1px solid ${props => props.active ? '#3b82f6' : '#e5e7eb'};
  
  &:hover {
    background-color: ${props => props.active ? '#2563eb' : '#f9fafb'};
  }
  
  svg {
    font-size: 0.75rem;
  }
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all 0.2s;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  
  &:hover {
    background-color: #2563eb;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }
`;

const ContactoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1.5rem;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const ContactoCard = styled.div`
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(8px);
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  overflow: hidden;
  transition: all 0.2s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  
  &:hover {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    transform: translateY(-2px);
  }
`;

const ContactoContent = styled.div`
  padding: 1.5rem;
`;

const ContactoTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.5rem;
`;

const ContactoMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
`;

const ContactoStatus = styled.span<{ read: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  background-color: ${props => props.read ? '#dcfce7' : '#fee2e2'};
  color: ${props => props.read ? '#166534' : '#991b1b'};
`;

const ContactoActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 0.375rem;
  transition: all 0.2s;
  
  &.view {
    color: #3b82f6;
    background-color: #eff6ff;
    
    &:hover {
      background-color: #dbeafe;
    }
  }
  
  &.delete {
    color: #ef4444;
    background-color: #fee2e2;
    
    &:hover {
      background-color: #fecaca;
    }
  }
  
  &.toggle {
    color: #10b981;
    background-color: #d1fae5;
    
    &:hover {
      background-color: #a7f3d0;
    }
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
  
  svg {
    font-size: 3.75rem;
    color: #d1d5db;
    margin-bottom: 1rem;
  }
  
  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #111827;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: #6b7280;
    margin-bottom: 1.5rem;
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  
  &:after {
    content: '';
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    border: 2px solid #e5e7eb;
    border-top-color: #3b82f6;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 1rem;
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: 0.5rem;
  width: 100%;
  max-width: 32rem;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  
  h2 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #111827;
  }
  
  button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    border-radius: 0.375rem;
    color: #6b7280;
    
    &:hover {
      background-color: #f3f4f6;
    }
  }
`;

const ModalBody = styled.div`
  padding: 1.5rem;
`;

const ModalFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid #e5e7eb;
`;

const Button = styled.button<{ variant?: 'primary' | 'danger' | 'secondary' }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: all 0.2s;
  
  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background-color: #3b82f6;
          color: white;
          &:hover {
            background-color: #2563eb;
          }
        `;
      case 'danger':
        return `
          background-color: #ef4444;
          color: white;
          &:hover {
            background-color: #dc2626;
          }
        `;
      default:
        return `
          background-color: #f3f4f6;
          color: #4b5563;
          &:hover {
            background-color: #e5e7eb;
          }
        `;
    }
  }}
`;

interface Contacto {
  id: number;
  nombre: string;
  email: string;
  telefono?: string;
  asunto: string;
  mensaje: string;
  leido: boolean;
  respondido: boolean;
  createdAt: string;
  updatedAt: string;
}

const ContactosAdmin: React.FC = () => {
  const [contactos, setContactos] = useState<Contacto[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'unread' | 'read'>('all')
  const [selectedContacto, setSelectedContacto] = useState<Contacto | null>(null)
  const [openDetail, setOpenDetail] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)

  useEffect(() => {
    fetchContactos()
  }, [])

  const fetchContactos = async () => {
    try {
      setLoading(true)
      // Intentar conectar al backend primero
      const response = await contactService.getAll()
      const data = Array.isArray(response.data) ? response.data : (response.data?.data || [])
      const mapped = data.map((c: any) => ({
        id: c.id,
        nombre: c.nombre,
        email: c.email,
        telefono: c.telefono,
        titulo: c.titulo,
        categoria: c.categoria,
        mensaje: c.mensaje,
        leido: !!c.leido,
        createdAt: c.created_at,
        updatedAt: c.updated_at,
      }))
      setContactos(mapped)
      toast.success('Contactos cargados correctamente')
    } catch (error) {
      console.error('Error al cargar contactos desde API, usando datos de prueba:', error)
      
      // Fallback a datos de prueba si la API falla
      const mockContactos: Contacto[] = [
        {
          id: 1,
          nombre: 'Patricia Jiménez',
          email: 'patricia.jimenez@email.com',
          telefono: '+57 300 123 4567',
          asunto: 'Consulta sobre productos para boda',
          mensaje: 'Hola, estoy interesada en conocer más sobre sus productos para decoración de bodas. ¿Podrían enviarme un catálogo con precios?',
          leido: false,
          respondido: false,
          createdAt: '2024-02-15T10:30:00Z',
          updatedAt: '2024-02-15T10:30:00Z'
        },
        {
          id: 2,
          nombre: 'Roberto Silva',
          email: 'roberto.silva@empresa.com',
          telefono: '+57 301 987 6543',
          asunto: 'Cotización para evento corporativo',
          mensaje: 'Buenos días, necesito una cotización para un evento corporativo de 200 personas. El evento será el próximo mes.',
          leido: true,
          respondido: true,
          createdAt: '2024-02-10T14:15:00Z',
          updatedAt: '2024-02-12T09:20:00Z'
        },
        {
          id: 3,
          nombre: 'Carmen López',
          email: 'carmen.lopez@gmail.com',
          telefono: '+57 302 456 7890',
          asunto: 'Información sobre delivery',
          mensaje: '¿Hacen entregas a domicilio en la ciudad? Me interesa hacer un pedido para una celebración familiar.',
          leido: true,
          respondido: false,
          createdAt: '2024-02-08T16:45:00Z',
          updatedAt: '2024-02-08T16:45:00Z'
        },
        {
          id: 4,
          nombre: 'Diego Morales',
          email: 'diego.morales@hotmail.com',
          asunto: 'Problema con pedido anterior',
          mensaje: 'Tuve un inconveniente con mi último pedido. Algunos productos llegaron dañados. ¿Podrían ayudarme con esto?',
          leido: false,
          respondido: false,
          createdAt: '2024-02-14T11:20:00Z',
          updatedAt: '2024-02-14T11:20:00Z'
        },
        {
          id: 5,
          nombre: 'Lucía Herrera',
          email: 'lucia.herrera@yahoo.com',
          telefono: '+57 304 321 0987',
          asunto: 'Felicitaciones por el servicio',
          mensaje: 'Quería felicitarlos por el excelente servicio. Los productos que pedí para mi evento quedaron perfectos. ¡Muchas gracias!',
          leido: true,
          respondido: true,
          createdAt: '2024-02-05T13:10:00Z',
          updatedAt: '2024-02-06T08:30:00Z'
        }
      ]
      
      setContactos(mockContactos)
      toast.warning('Usando datos de prueba - Backend no disponible')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenDetail = (contacto: Contacto) => {
    setSelectedContacto(contacto)
    setOpenDetail(true)
    if (!contacto.leido) {
      markAsRead(contacto.id)
    }
  }

  const handleCloseDetail = () => {
    setOpenDetail(false)
    setSelectedContacto(null)
  }

  const handleOpenDelete = (contacto: Contacto) => {
    setSelectedContacto(contacto)
    setOpenDelete(true)
  }

  const handleCloseDelete = () => {
    setOpenDelete(false)
    setSelectedContacto(null)
  }



  const markAsRead = async (contactoId: number) => {
    try {
      await contactService.markAsRead(contactoId)
      toast.success('Mensaje marcado como leído')
      setContactos(prev => prev.map(c => 
        c.id === contactoId ? { ...c, leido: true } : c
      ))
    } catch (error) {
      console.error('Error al marcar como leído:', error)
      toast.error('Error al marcar como leído')
    }
  }

  const handleDelete = async () => {
    if (!selectedContacto) return

    try {
      await contactService.delete(selectedContacto.id)
      toast.success('Contacto eliminado correctamente')
      handleCloseDelete()
      fetchContactos()
    } catch (error) {
      console.error('Error al eliminar contacto:', error)
      toast.error('Error al eliminar el contacto')
    }
  }



  const exportToCSV = () => {
    const headers = ['ID', 'Nombre', 'Email', 'Teléfono', 'Asunto', 'Mensaje', 'Estado', 'Fecha']
    const csvContent = [
      headers.join(','),
      ...contactos.map(contacto => [
        contacto.id,
        `"${contacto.nombre}"`,
        contacto.email,
        contacto.telefono || '',
        `"${contacto.asunto}"`,
        `"${contacto.mensaje.replace(/"/g, '""')}"`,
        contacto.leido ? 'Leído' : 'No leído',
        formatDate(contacto.createdAt)
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `contactos_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const filteredContactos = contactos.filter(contacto => {
    const matchesSearch = contacto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contacto.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contacto.asunto.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contacto.mensaje.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'unread' && !contacto.leido) ||
                         (filterStatus === 'read' && contacto.leido)
    return matchesSearch && matchesFilter
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

  const getStatusColor = (contacto: Contacto) => {
    if (contacto.leido) return 'bg-blue-100 text-blue-800'
    return 'bg-red-100 text-red-800'
  }

  const getStatusText = (contacto: Contacto) => {
    if (contacto.leido) return 'Leído'
    return 'No leído'
  }

  const getPriorityLevel = (contacto: Contacto) => {
    const keywords = ['urgente', 'importante', 'problema', 'error', 'ayuda']
    const hasUrgentKeywords = keywords.some(keyword => 
      contacto.asunto.toLowerCase().includes(keyword) || 
      contacto.mensaje.toLowerCase().includes(keyword)
    )
    return hasUrgentKeywords ? 'high' : 'normal'
  }

  return (
    <ContactosContainer>
      <ContactosHeader>
        <div>
          <ContactosTitle>Gestión de Contactos</ContactosTitle>
          <p className="text-gray-600">Administra los mensajes y consultas de tus clientes</p>
        </div>
        <ActionButton onClick={exportToCSV}>
          <FaFileExport />
          Exportar CSV
        </ActionButton>
      </ContactosHeader>

      <div>
        {/* Filters and Search */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <SearchBar>
            <FaSearch />
            <input
              type="text"
              placeholder="Buscar contactos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchBar>
          
          <FiltersContainer>
            <FilterButton 
              active={filterStatus === 'all'} 
              onClick={() => setFilterStatus('all')}
            >
              <FaFilter />
              Todos
            </FilterButton>
            <FilterButton 
              active={filterStatus === 'unread'} 
              onClick={() => setFilterStatus('unread')}
            >
              <FaEnvelope />
              No leídos
            </FilterButton>
            <FilterButton 
              active={filterStatus === 'read'} 
              onClick={() => setFilterStatus('read')}
            >
              <FaCheck />
              Leídos
            </FilterButton>
          </FiltersContainer>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Contactos</p>
                <p className="text-2xl font-bold text-gray-900">{contactos.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FaEnvelope className="text-blue-600 text-xl" />
              </div>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">No Leídos</p>
                <p className="text-2xl font-bold text-red-600">
                  {contactos.filter(c => !c.leido).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <FaExclamationTriangle className="text-red-600 text-xl" />
              </div>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Leídos</p>
                <p className="text-2xl font-bold text-blue-600">
                  {contactos.filter(c => c.leido).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FaEye className="text-blue-600 text-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contactos List */}
      {loading ? (
        <LoadingSpinner />
      ) : filteredContactos.length === 0 ? (
        <EmptyState>
          <FaEnvelope />
          <h3>No hay contactos</h3>
          <p>
            {searchTerm || filterStatus !== 'all'
              ? 'No se encontraron contactos con los filtros aplicados'
              : 'No hay mensajes de contacto disponibles'
            }
          </p>
        </EmptyState>
      ) : (
        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="divide-y divide-gray-100">
            {filteredContactos.map((contacto) => (
              <div 
                key={contacto.id} 
                className={`p-6 hover:bg-gray-50 transition-colors ${
                  !contacto.leido ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <FaUser className="text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{contacto.nombre}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <FaEnvelope className="text-xs" />
                            {contacto.email}
                          </span>
                          {contacto.telefono && (
                            <span className="flex items-center gap-1">
                              <FaPhone className="text-xs" />
                              {contacto.telefono}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900">{contacto.asunto}</h4>
                        {getPriorityLevel(contacto) === 'high' && (
                          <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                            Prioridad Alta
                          </span>
                        )}
                      </div>
                      <p className="text-gray-700 text-sm line-clamp-2">
                        {contacto.mensaje}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <ContactoStatus read={contacto.leido}>
                          {getStatusText(contacto)}
                        </ContactoStatus>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <FaCalendarAlt />
                          {formatDate(contacto.createdAt)}
                        </span>
                      </div>
                      
                      <ContactoActions>
                        <IconButton
                          className="view"
                          onClick={() => handleOpenDetail(contacto)}
                          title="Ver detalles"
                        >
                          <FaEye />
                        </IconButton>
                        <IconButton
                          className="delete"
                          onClick={() => handleOpenDelete(contacto)}
                          title="Eliminar"
                        >
                          <FaTrash />
                        </IconButton>
                      </ContactoActions>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
        {/* Modals */}
        {/* Detail Modal */}
      {openDetail && selectedContacto && (
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>
              <h2>Detalles del Contacto</h2>
              <button onClick={handleCloseDetail}>
                <FaTimes />
              </button>
            </ModalHeader>
            <ModalBody>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <FaUser className="text-blue-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{selectedContacto.nombre}</h3>
                    <div className="flex items-center gap-4 text-gray-600">
                      <span className="flex items-center gap-1">
                        <FaEnvelope className="text-sm" />
                        {selectedContacto.email}
                      </span>
                      {selectedContacto.telefono && (
                        <span className="flex items-center gap-1">
                          <FaPhone className="text-sm" />
                          {selectedContacto.telefono}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Asunto
                  </label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                    {selectedContacto.asunto}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mensaje
                  </label>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">
                      {selectedContacto.mensaje}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-4">
                    <ContactoStatus read={selectedContacto.leido}>
                      {getStatusText(selectedContacto)}
                    </ContactoStatus>
                    {getPriorityLevel(selectedContacto) === 'high' && (
                      <span className="px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full">
                        Prioridad Alta
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    {formatDate(selectedContacto.createdAt)}
                  </p>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              {!selectedContacto.leido && (
                <Button 
                  variant="primary"
                  onClick={() => markAsRead(selectedContacto)}
                >
                  <FaCheck />
                  Marcar como leído
                </Button>
              )}
              <Button onClick={handleCloseDetail}>
                Cerrar
              </Button>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* Delete Modal */}
      {openDelete && selectedContacto && (
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>
              <h2>Eliminar Contacto</h2>
              <button onClick={handleCloseDelete}>
                <FaTimes />
              </button>
            </ModalHeader>
            <ModalBody>
              <div className="text-center">
                <FaExclamationTriangle className="mx-auto text-5xl text-yellow-500 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">¿Estás seguro?</h3>
                <p className="text-gray-600">
                  ¿Realmente deseas eliminar el mensaje de <strong>{selectedContacto.nombre}</strong>?
                  <br />Esta acción no se puede deshacer.
                </p>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button 
                variant="danger"
                onClick={handleDelete}
              >
                <FaTrash />
                Eliminar
              </Button>
              <Button onClick={handleCloseDelete}>
                Cancelar
              </Button>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}
    </ContactosContainer>
  )
}

export default ContactosAdmin