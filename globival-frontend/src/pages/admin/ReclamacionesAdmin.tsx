import React, { useState, useEffect } from 'react'
import { 
  FaExclamationTriangle, 
  FaUser, 
  FaCalendarAlt,
  FaEye,
  FaTrash,
  FaSearch,
  FaFilter,
  FaCheck,
  FaTimes,
  FaClock,
  FaFlag,
  FaDownload,
  FaFileExport,
  FaCommentDots,
  FaEdit
} from 'react-icons/fa'
import { toast } from 'react-toastify'
import { claimService } from '../../services/api'

interface Reclamacion {
  id: number;
  nombre: string;
  email: string;
  telefono?: string;
  asunto: string;
  descripcion: string;
  categoria: string;
  prioridad: 'baja' | 'media' | 'alta' | 'critica';
  estado: 'pendiente' | 'en_proceso' | 'resuelto' | 'cerrado';
  fechaIncidente?: string;
  respuesta?: string;
  createdAt: string;
  updatedAt: string;
}

const ReclamacionesAdmin: React.FC = () => {
  const [reclamaciones, setReclamaciones] = useState<Reclamacion[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'pendiente' | 'en_proceso' | 'resuelto' | 'cerrado'>('all')
  const [filterPriority, setFilterPriority] = useState<'all' | 'baja' | 'media' | 'alta' | 'critica'>('all')
  const [selectedReclamacion, setSelectedReclamacion] = useState<Reclamacion | null>(null)
  const [openDetail, setOpenDetail] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const [openResponse, setOpenResponse] = useState(false)
  const [responseMessage, setResponseMessage] = useState('')
  const [newStatus, setNewStatus] = useState<'pendiente' | 'en_proceso' | 'resuelto' | 'cerrado'>('pendiente')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchReclamaciones()
  }, [])

  const fetchReclamaciones = async () => {
    try {
      setLoading(true)
      // Intentar conectar al backend primero
      const response = await claimService.getAll()
      const data = Array.isArray(response.data) ? response.data : (response.data?.data || [])
      const mapped = data.map((r: any) => ({
        id: r.id,
        nombre: r.nombre || r.name || '',
        email: r.email,
        telefono: r.telefono || r.phone,
        asunto: r.asunto || r.titulo || r.subject || '',
        descripcion: r.descripcion || r.mensaje || r.description || '',
        categoria: r.categoria || r.category || 'General',
        prioridad: (r.prioridad || r.priority || 'media'),
        estado: (r.estado || r.status || 'pendiente'),
        fechaIncidente: r.fecha_incidente || r.fechaIncidente || r.incident_date || '',
        respuesta: r.respuesta || r.response || '',
        createdAt: r.created_at || r.createdAt,
        updatedAt: r.updated_at || r.updatedAt,
      }))
      setReclamaciones(mapped)
      toast.success('Reclamaciones cargadas correctamente')
    } catch (error) {
      console.error('Error al cargar reclamaciones desde API, usando datos de prueba:', error)
      
      // Fallback a datos de prueba si la API falla
      const mockReclamaciones: Reclamacion[] = [
        {
          id: 1,
          nombre: 'Sandra Pérez',
          email: 'sandra.perez@email.com',
          telefono: '+57 300 555 1234',
          asunto: 'Producto defectuoso en pedido #1234',
          descripcion: 'Recibí un producto dañado en mi último pedido. El empaque estaba roto y el contenido se derramó. Necesito una solución urgente.',
          categoria: 'Calidad del producto',
          prioridad: 'alta',
          estado: 'pendiente',
          fechaIncidente: '2024-02-14T08:30:00Z',
          createdAt: '2024-02-14T10:15:00Z',
          updatedAt: '2024-02-14T10:15:00Z'
        },
        {
          id: 2,
          nombre: 'Miguel Torres',
          email: 'miguel.torres@empresa.com',
          telefono: '+57 301 666 7890',
          asunto: 'Retraso en entrega de pedido urgente',
          descripcion: 'Mi pedido tenía fecha de entrega para ayer y aún no ha llegado. Es para un evento importante hoy en la noche.',
          categoria: 'Entrega',
          prioridad: 'critica',
          estado: 'en_proceso',
          fechaIncidente: '2024-02-13T16:00:00Z',
          respuesta: 'Hemos contactado al transportador y su pedido será entregado en las próximas 2 horas. Disculpe las molestias.',
          createdAt: '2024-02-13T18:30:00Z',
          updatedAt: '2024-02-14T09:45:00Z'
        },
        {
          id: 3,
          nombre: 'Elena Vargas',
          email: 'elena.vargas@gmail.com',
          asunto: 'Cobro duplicado en mi tarjeta',
          descripcion: 'Me cobraron dos veces el mismo pedido en mi tarjeta de crédito. Adjunto los comprobantes de pago.',
          categoria: 'Facturación',
          prioridad: 'media',
          estado: 'resuelto',
          fechaIncidente: '2024-02-10T14:20:00Z',
          respuesta: 'Hemos procesado el reembolso del cobro duplicado. El dinero aparecerá en su cuenta en 3-5 días hábiles.',
          createdAt: '2024-02-10T15:00:00Z',
          updatedAt: '2024-02-12T11:30:00Z'
        },
        {
          id: 4,
          nombre: 'Ricardo Mendoza',
          email: 'ricardo.mendoza@hotmail.com',
          telefono: '+57 302 777 4567',
          asunto: 'Atención al cliente deficiente',
          descripcion: 'El personal de atención al cliente fue muy grosero cuando llamé para hacer una consulta sobre mi pedido.',
          categoria: 'Servicio al cliente',
          prioridad: 'baja',
          estado: 'cerrado',
          fechaIncidente: '2024-02-08T10:15:00Z',
          respuesta: 'Hemos hablado con nuestro equipo de atención al cliente y hemos tomado las medidas correctivas necesarias. Disculpe las molestias.',
          createdAt: '2024-02-08T11:00:00Z',
          updatedAt: '2024-02-09T16:20:00Z'
        }
      ]
      
      setReclamaciones(mockReclamaciones)
      toast.warning('Usando datos de prueba - Backend no disponible')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenDetail = (reclamacion: Reclamacion) => {
    setSelectedReclamacion(reclamacion)
    setOpenDetail(true)
  }

  const handleCloseDetail = () => {
    setOpenDetail(false)
    setSelectedReclamacion(null)
  }

  const handleOpenDelete = (reclamacion: Reclamacion) => {
    setSelectedReclamacion(reclamacion)
    setOpenDelete(true)
  }

  const handleCloseDelete = () => {
    setOpenDelete(false)
    setSelectedReclamacion(null)
  }

  const handleOpenResponse = (reclamacion: Reclamacion) => {
    setSelectedReclamacion(reclamacion)
    setResponseMessage(reclamacion.respuesta || '')
    setNewStatus(reclamacion.estado)
    setOpenResponse(true)
  }

  const handleCloseResponse = () => {
    setOpenResponse(false)
    setSelectedReclamacion(null)
    setResponseMessage('')
    setNewStatus('pendiente')
  }

  const handleDelete = async () => {
    if (!selectedReclamacion) return

    try {
      // Acción local: eliminar de la lista (backend no soporta delete)
      setReclamaciones(prev => prev.filter(r => r.id !== selectedReclamacion.id))
      toast.success('Reclamación eliminada localmente')
      handleCloseDelete()
    } catch (error) {
      console.error('Error al eliminar reclamación:', error)
      toast.error('Error al eliminar la reclamación')
    }
  }

  const handleResponse = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedReclamacion) return

    setIsSubmitting(true)
    try {
      // Acción local: actualizar estado y respuesta (backend no soporta update)
      setReclamaciones(prev => prev.map(r => 
        r.id === selectedReclamacion.id 
          ? { ...r, respuesta: responseMessage, estado: newStatus, updatedAt: new Date().toISOString() } 
          : r
      ))
      toast.success('Reclamación actualizada localmente')
      handleCloseResponse()
    } catch (error) {
      console.error('Error al actualizar reclamación:', error)
      toast.error('Error al actualizar la reclamación')
    } finally {
      setIsSubmitting(false)
    }
  }

  const exportToCSV = () => {
    const headers = ['ID', 'Nombre', 'Email', 'Teléfono', 'Asunto', 'Categoría', 'Prioridad', 'Estado', 'Fecha Incidente', 'Fecha Creación']
    const csvContent = [
      headers.join(','),
      ...reclamaciones.map(reclamacion => [
        reclamacion.id,
        `"${reclamacion.nombre}"`,
        reclamacion.email,
        reclamacion.telefono || '',
        `"${reclamacion.asunto}"`,
        reclamacion.categoria,
        reclamacion.prioridad,
        reclamacion.estado,
        reclamacion.fechaIncidente || '',
        formatDate(reclamacion.createdAt)
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `reclamaciones_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const filteredReclamaciones = reclamaciones.filter(reclamacion => {
    const matchesSearch = reclamacion.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reclamacion.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reclamacion.asunto.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reclamacion.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reclamacion.categoria.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || reclamacion.estado === filterStatus
    const matchesPriority = filterPriority === 'all' || reclamacion.prioridad === filterPriority
    return matchesSearch && matchesStatus && matchesPriority
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

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'pendiente': return 'bg-red-100 text-red-800'
      case 'en_proceso': return 'bg-yellow-100 text-yellow-800'
      case 'resuelto': return 'bg-green-100 text-green-800'
      case 'cerrado': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (estado: string) => {
    switch (estado) {
      case 'pendiente': return 'Pendiente'
      case 'en_proceso': return 'En Proceso'
      case 'resuelto': return 'Resuelto'
      case 'cerrado': return 'Cerrado'
      default: return estado
    }
  }

  const getPriorityColor = (prioridad: string) => {
    switch (prioridad) {
      case 'baja': return 'bg-blue-100 text-blue-800'
      case 'media': return 'bg-yellow-100 text-yellow-800'
      case 'alta': return 'bg-orange-100 text-orange-800'
      case 'critica': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityText = (prioridad: string) => {
    switch (prioridad) {
      case 'baja': return 'Baja'
      case 'media': return 'Media'
      case 'alta': return 'Alta'
      case 'critica': return 'Crítica'
      default: return prioridad
    }
  }

  const getPriorityIcon = (prioridad: string) => {
    switch (prioridad) {
      case 'critica': return <FaExclamationTriangle className="text-red-600" />
      case 'alta': return <FaFlag className="text-orange-600" />
      default: return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-red-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Gestión de Reclamaciones
              </h1>
              <p className="text-gray-600">
                Administra las reclamaciones y quejas de tus clientes
              </p>
            </div>
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl"
            >
              <FaFileExport />
              Exportar CSV
            </button>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar reclamaciones..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <FaFilter className="text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as 'all' | 'pendiente' | 'en_proceso' | 'resuelto' | 'cerrado')}
                  className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="all">Todos los estados</option>
                  <option value="pendiente">Pendiente</option>
                  <option value="en_proceso">En Proceso</option>
                  <option value="resuelto">Resuelto</option>
                  <option value="cerrado">Cerrado</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <FaFlag className="text-gray-400" />
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value as 'all' | 'baja' | 'media' | 'alta' | 'critica')}
                  className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="all">Todas las prioridades</option>
                  <option value="baja">Baja</option>
                  <option value="media">Media</option>
                  <option value="alta">Alta</option>
                  <option value="critica">Crítica</option>
                </select>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{reclamaciones.length}</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <FaExclamationTriangle className="text-red-600 text-xl" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Pendientes</p>
                  <p className="text-2xl font-bold text-red-600">
                    {reclamaciones.filter(r => r.estado === 'pendiente').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <FaClock className="text-red-600 text-xl" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">En Proceso</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {reclamaciones.filter(r => r.estado === 'en_proceso').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <FaEdit className="text-yellow-600 text-xl" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Resueltas</p>
                  <p className="text-2xl font-bold text-green-600">
                    {reclamaciones.filter(r => r.estado === 'resuelto').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <FaCheck className="text-green-600 text-xl" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Críticas</p>
                  <p className="text-2xl font-bold text-red-600">
                    {reclamaciones.filter(r => r.prioridad === 'critica').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <FaFlag className="text-red-600 text-xl" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reclamaciones List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        ) : filteredReclamaciones.length === 0 ? (
          <div className="text-center py-12">
            <FaExclamationTriangle className="mx-auto text-6xl text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay reclamaciones</h3>
            <p className="text-gray-600">
              {searchTerm || filterStatus !== 'all' || filterPriority !== 'all'
                ? 'No se encontraron reclamaciones con los filtros aplicados'
                : 'No hay reclamaciones disponibles'
              }
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="divide-y divide-gray-100">
              {filteredReclamaciones.map((reclamacion) => (
                <div 
                  key={reclamacion.id} 
                  className={`p-6 hover:bg-gray-50 transition-colors ${
                    reclamacion.prioridad === 'critica' ? 'bg-red-50 border-l-4 border-l-red-500' : 
                    reclamacion.prioridad === 'alta' ? 'bg-orange-50 border-l-4 border-l-orange-500' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                          <FaUser className="text-red-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{reclamacion.nombre}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>{reclamacion.email}</span>
                            {reclamacion.telefono && <span>{reclamacion.telefono}</span>}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-gray-900">{reclamacion.asunto}</h4>
                          {getPriorityIcon(reclamacion.prioridad)}
                        </div>
                        <p className="text-gray-700 text-sm line-clamp-2 mb-2">
                          {reclamacion.descripcion}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span className="bg-gray-100 px-2 py-1 rounded">
                            {reclamacion.categoria}
                          </span>
                          {reclamacion.fechaIncidente && (
                            <span>
                              Incidente: {formatDate(reclamacion.fechaIncidente)}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(reclamacion.estado)}`}>
                            {getStatusText(reclamacion.estado)}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(reclamacion.prioridad)}`}>
                            {getPriorityText(reclamacion.prioridad)}
                          </span>
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <FaCalendarAlt />
                            {formatDate(reclamacion.createdAt)}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleOpenDetail(reclamacion)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Ver detalles"
                          >
                            <FaEye />
                          </button>
                          <button
                            onClick={() => handleOpenResponse(reclamacion)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Responder"
                          >
                            <FaCommentDots />
                          </button>
                          <button
                            onClick={() => handleOpenDelete(reclamacion)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Eliminar"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {openDetail && selectedReclamacion && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Detalles de la Reclamación
                </h2>
                <button
                  onClick={handleCloseDetail}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FaTimes className="text-gray-500" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                    <FaUser className="text-red-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{selectedReclamacion.nombre}</h3>
                    <div className="flex items-center gap-4 text-gray-600">
                      <span>{selectedReclamacion.email}</span>
                      {selectedReclamacion.telefono && <span>{selectedReclamacion.telefono}</span>}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Asunto
                    </label>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                      {selectedReclamacion.asunto}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categoría
                    </label>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                      {selectedReclamacion.categoria}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción
                  </label>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">
                      {selectedReclamacion.descripcion}
                    </p>
                  </div>
                </div>

                {selectedReclamacion.fechaIncidente && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha del Incidente
                    </label>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                      {formatDate(selectedReclamacion.fechaIncidente)}
                    </p>
                  </div>
                )}

                {selectedReclamacion.respuesta && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Respuesta
                    </label>
                    <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                      <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">
                        {selectedReclamacion.respuesta}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedReclamacion.estado)}`}>
                      {getStatusText(selectedReclamacion.estado)}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(selectedReclamacion.prioridad)}`}>
                      {getPriorityText(selectedReclamacion.prioridad)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {formatDate(selectedReclamacion.createdAt)}
                  </p>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t">
                  <button
                    onClick={handleCloseDetail}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cerrar
                  </button>
                  <button
                    onClick={() => {
                      handleCloseDetail()
                      handleOpenResponse(selectedReclamacion)
                    }}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <FaCommentDots />
                    Responder
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Response Modal */}
      {openResponse && selectedReclamacion && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Responder Reclamación
                </h2>
                <button
                  onClick={handleCloseResponse}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FaTimes className="text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleResponse} className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Reclamación:</p>
                  <p className="text-gray-900 text-sm font-medium mb-1">{selectedReclamacion.asunto}</p>
                  <p className="text-gray-700 text-sm">"{selectedReclamacion.descripcion}"</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estado *
                    </label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value as 'pendiente' | 'en_proceso' | 'resuelto' | 'cerrado')}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="pendiente">Pendiente</option>
                      <option value="en_proceso">En Proceso</option>
                      <option value="resuelto">Resuelto</option>
                      <option value="cerrado">Cerrado</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prioridad Actual
                    </label>
                    <div className="px-4 py-3 bg-gray-50 rounded-lg">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedReclamacion.prioridad)}`}>
                        {getPriorityText(selectedReclamacion.prioridad)}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Respuesta
                  </label>
                  <textarea
                    value={responseMessage}
                    onChange={(e) => setResponseMessage(e.target.value)}
                    rows={6}
                    placeholder="Escribe tu respuesta aquí..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t">
                  <button
                    type="button"
                    onClick={handleCloseResponse}
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
                        Actualizando...
                      </>
                    ) : (
                      <>
                        <FaCheck />
                        Actualizar
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
      {openDelete && selectedReclamacion && (
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
                ¿Estás seguro de que deseas eliminar la reclamación de "{selectedReclamacion.nombre}"? 
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
    </div>
  )
}

export default ReclamacionesAdmin
