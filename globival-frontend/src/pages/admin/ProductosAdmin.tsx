"use client"

import { useState, useEffect } from "react"
import styled from "styled-components"
import { FaPlus, FaEdit, FaTrash, FaSearch } from "react-icons/fa"
import { toast } from "react-toastify"
import { productService, subcategoryService } from "../../services/api"
import ProductoForm from "../../components/admin/ProductoForm"
import { IMAGE_BASE_URL } from "../../config/constants"

// Helper para construir URLs de imagen evitando dobles "/storage" y barras
const buildImageUrl = (path?: string) => {
  if (!path) return ""
  if (/^https?:\/\//.test(path)) return path
  const clean = path.replace(/^\/+/, "")
  return clean.startsWith("storage/")
    ? `${IMAGE_BASE_URL}/${clean}`
    : `${IMAGE_BASE_URL}/storage/${clean}`
}

const ProductosContainer = styled.div`
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

const ProductosHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    align-items: stretch;
    gap: ${({ theme }) => theme.spacing.md};
    margin-bottom: ${({ theme }) => theme.spacing.lg};
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    gap: ${({ theme }) => theme.spacing.sm};
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }
`

const ProductosTitle = styled.h1`
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

// Vista de tabla para desktop
const ProductosTable = styled.div`
  background: var(--bg-card);
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  overflow: hidden;
  overflow-x: auto;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-color);
  backdrop-filter: blur(15px);
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 1rem;
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

const ProductImage = styled.div`
  width: 60px;
  height: 60px;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  overflow: hidden;
  background: var(--bg-secondary);
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
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

// Vista de tarjetas para móviles
const ProductosGrid = styled.div`
  display: none;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: ${({ theme }) => theme.spacing.md};
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.sm};
  }
`

const ProductCard = styled.div`
  background: var(--bg-card);
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: ${({ theme }) => theme.spacing.md};
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-color);
  transition: all ${({ theme }) => theme.transitions.medium};
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(15px);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, var(--accent-glow), transparent);
    opacity: 0;
    transition: opacity 0.5s ease;
    z-index: 0;
  }
  
  &:hover {
    transform: translateY(-5px) scale(1.02);
    box-shadow: var(--shadow-xl);
    
    &::before {
      opacity: 0.1;
    }
  }
  
  & > * {
    position: relative;
    z-index: 1;
  }
`

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`

const CardImage = styled.div`
  width: 60px;
  height: 60px;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  overflow: hidden;
  background: var(--bg-secondary);
  margin-right: ${({ theme }) => theme.spacing.md};
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

const CardInfo = styled.div`
  flex: 1;
`

const CardTitle = styled.h3`
  margin: 0 0 ${({ theme }) => theme.spacing.xs} 0;
  font-size: 1.1rem;
  color: var(--text-primary);
`

const CardPrice = styled.div`
  font-weight: 600;
  color: var(--accent-primary);
  font-size: 1rem;
`

const CardDetails = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};
`

const CardDetail = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  font-size: 0.9rem;
  
  span:first-child {
    color: var(--text-secondary);
  }
  
  span:last-child {
    color: var(--text-primary);
    font-weight: 500;
  }
`

const CardActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`

const CardButton = styled.button`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.sm};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &.edit {
    background: var(--bg-secondary);
    color: var(--text-primary);
    border: 1px solid var(--border-color);
    
    &:hover {
      background: var(--accent-primary);
      color: white;
    }
  }
  
  &.delete {
    background: linear-gradient(135deg, #ef4444, #dc2626);
    color: white;
    
    &:hover {
      background: linear-gradient(135deg, #dc2626, #b91c1c);
    }
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
  justify-content: center;
  align-items: center;
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
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
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

const NoProducts = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
  color: var(--text-secondary);
  font-style: italic;
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

function ProductosAdmin() {
  const [products, setProducts] = useState<Product[]>([])
  const [subcategories, setSubcategories] = useState<Subcategory[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null)
  // Estado para controlar si hay una operación en curso
  const [isOperationInProgress, setIsOperationInProgress] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, subcategoriesRes] = await Promise.all([
          productService.getAll(),
          subcategoryService.getAll(),
        ])

        setProducts(productsRes.data)
        setFilteredProducts(productsRes.data)
        // Asumiendo que la respuesta de subcategorías ya incluye la información de la categoría
        setSubcategories(subcategoriesRes.data)
        setLoading(false)
      } catch {
        toast.error("Error al cargar los productos")
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const filtered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredProducts(filtered)
    } else {
      setFilteredProducts(products)
    }
  }, [searchTerm, products])

  const handleAddProduct = () => {
    setCurrentProduct(null)
    setIsModalOpen(true)
  }

  const handleEditProduct = (product: Product) => {
    setCurrentProduct(product)
    setIsModalOpen(true)
  }

  const handleDeleteProduct = async (id: number) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      try {
        await productService.delete(id)
        // Actualizar el estado con una nueva copia del array
        setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id))
        toast.success("Producto eliminado correctamente")
      } catch {
        toast.error("Error al eliminar el producto")
      }
    }
  }

  // Función mejorada para guardar productos (mapea claves al backend)
  const handleSaveProduct = async (formData: FormData) => {
    // Si ya hay una operación en curso, no permitir otra
    if (isOperationInProgress) {
      toast.info("Hay una operación en curso, por favor espere")
      return
    }

    try {
      setIsOperationInProgress(true)

      // Construir un FormData que cumpla con lo que espera el backend (snake_case y claves correctas)
      const apiForm = new FormData()

      // name y description
      const name = formData.get("name")
      if (name !== null) apiForm.append("name", String(name))

      const description = formData.get("description")
      if (description !== null) apiForm.append("description", String(description))

      // price → decimal:2
      const price = formData.get("price")
      if (price !== null) {
        const n = Number(String(price).trim())
        if (!Number.isNaN(n)) apiForm.append("price", n.toFixed(2))
      }

      // precio_de_oferta → decimal:2 si viene con valor, si viene vacío lo omitimos
      const precioOferta = formData.get("precio_de_oferta")
      if (precioOferta !== null && String(precioOferta).trim() !== "") {
        const po = Number(String(precioOferta).trim())
        if (!Number.isNaN(po)) apiForm.append("precio_de_oferta", po.toFixed(2))
      }

      // stock → entero, por defecto 0 si viene vacío
      const stock = formData.get("stock")
      if (stock !== null && String(stock).trim() !== "") {
        const s = parseInt(String(stock).trim(), 10)
        if (!Number.isNaN(s)) apiForm.append("stock", String(s))
      } else {
        apiForm.append("stock", "0")
      }

      // SKU: puede venir como "sku" desde el formulario, convertir a "SKU"
      const skuLower = formData.get("sku")
      const skuUpper = formData.get("SKU")
      if (skuUpper !== null) {
        apiForm.append("SKU", String(skuUpper))
      } else if (skuLower !== null) {
        apiForm.append("SKU", String(skuLower))
      }

      // Imagen: si el form usa "image", renombrar a "imagen"
      const image = formData.get("image")
      const imagen = formData.get("imagen")
      if (image instanceof File || image instanceof Blob) {
        apiForm.append("imagen", image)
      } else if (imagen instanceof File || imagen instanceof Blob) {
        apiForm.append("imagen", imagen)
      }

      // subCategoryId → sub_category_id (numérico)
      const subCategoryId = formData.get("subCategoryId") ?? formData.get("sub_category_id")
      if (subCategoryId !== null) {
        const numericId = Number(String(subCategoryId).trim())
        if (!Number.isNaN(numericId)) {
          apiForm.append("sub_category_id", String(numericId))
        }
      }

      if (currentProduct) {
        // Actualizar producto
        const response = await productService.update(currentProduct.id, apiForm)

        // Actualizar el estado con una nueva copia del array
        const updatedProducts = products.map((p) => (p.id === currentProduct.id ? response.data : p))
        setProducts([...updatedProducts])

        toast.success("Producto actualizado correctamente")
      } else {
        // Crear nuevo producto
        const response = await productService.create(apiForm)

        // Actualizar el estado con una nueva copia del array
        setProducts((prevProducts) => [...prevProducts, response.data])

        toast.success("Producto creado correctamente")
      }

      // Limpiar el estado y cerrar el modal
      setCurrentProduct(null)
      setIsModalOpen(false)
    } catch {
      toast.error("Error al guardar el producto")
    } finally {
      setIsOperationInProgress(false)
    }
  }

  // Asegurar que el modal se cierre correctamente
  const closeModal = () => {
    setIsModalOpen(false)
    setCurrentProduct(null)
  }

  return (
    <ProductosContainer>
      <ProductosHeader>
        <ProductosTitle>Gestión de Productos</ProductosTitle>

        <SearchBar>
          <FaSearch />
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchBar>

        <AddButton onClick={handleAddProduct}>
          <FaPlus />
          Nuevo Producto
        </AddButton>
      </ProductosHeader>

      <ProductosTable>
        {loading ? (
          <NoProducts>Cargando productos...</NoProducts>
        ) : filteredProducts.length > 0 ? (
          <Table>
            <TableHead>
              <tr>
                <th>Imagen</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Subcategoría</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Acciones</th>
              </tr>
            </TableHead>
            <TableBody>
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td>
                    <ProductImage>
                      <img
                        src={
                          product.imagen
                            ? buildImageUrl(product.imagen)
                            : "/images/product-placeholder.jpg"
                        }
                        alt={product.name}
                      />
                    </ProductImage>
                  </td>
                  <td>{product.name}</td>
                  <td>{product.description || "Sin descripción"}</td>
                  <td>{product.subCategory?.name || "N/A"}</td>
                  <td>
                    {product.precio_de_oferta ? (
                      <>
                        <span style={{ textDecoration: "line-through", marginRight: "8px" }}>S/ {product.price}</span>
                        <span style={{ color: "var(--color-primary)" }}>S/ {product.precio_de_oferta}</span>
                      </>
                    ) : (
                      `S/ ${product.price}`
                    )}
                  </td>
                  <td>{product.stock}</td>
                  <td>
                    <ActionButtons>
                      <EditButton onClick={() => handleEditProduct(product)}>
                        <FaEdit />
                      </EditButton>
                      <DeleteButton onClick={() => handleDeleteProduct(product.id)}>
                        <FaTrash />
                      </DeleteButton>
                    </ActionButtons>
                  </td>
                </tr>
              ))}
            </TableBody>
          </Table>
        ) : (
          <NoProducts>No se encontraron productos</NoProducts>
        )}
      </ProductosTable>

      <ProductosGrid>
        {loading ? (
          <NoProducts>Cargando productos...</NoProducts>
        ) : filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard key={product.id}>
              <CardHeader>
                <CardImage>
                  <img
                    src={
                      product.imagen
                        ? buildImageUrl(product.imagen)
                        : "/images/product-placeholder.jpg"
                    }
                    alt={product.name}
                  />
                </CardImage>
                <CardInfo>
                  <CardTitle>{product.name}</CardTitle>
                  <CardPrice>
                    {product.precio_de_oferta ? (
                      <>
                        <span style={{ textDecoration: "line-through", marginRight: "8px" }}>S/ {product.price}</span>
                        <span style={{ color: "var(--color-primary)" }}>S/ {product.precio_de_oferta}</span>
                      </>
                    ) : (
                      `S/ ${product.price}`
                    )}
                  </CardPrice>
                </CardInfo>
              </CardHeader>
              <CardDetails>
                <CardDetail>
                  <span>Descripción:</span>
                  <span>{product.description || "Sin descripción"}</span>
                </CardDetail>
                <CardDetail>
                  <span>Subcategoría:</span>
                  <span>{product.subCategory?.name || "N/A"}</span>
                </CardDetail>
                <CardDetail>
                  <span>Stock:</span>
                  <span>{product.stock}</span>
                </CardDetail>
              </CardDetails>
              <CardActions>
                <CardButton onClick={() => handleEditProduct(product)} className="edit">
                  <FaEdit />
                  Editar
                </CardButton>
                <CardButton onClick={() => handleDeleteProduct(product.id)} className="delete">
                  <FaTrash />
                  Eliminar
                </CardButton>
              </CardActions>
            </ProductCard>
          ))
        ) : (
          <NoProducts>No se encontraron productos</NoProducts>
        )}
      </ProductosGrid>

      {isModalOpen && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <h2>{currentProduct ? "Editar Producto" : "Nuevo Producto"}</h2>
              <CloseButton onClick={closeModal}>×</CloseButton>
            </ModalHeader>

            <ProductoForm
              product={currentProduct}
              subcategories={subcategories}
              onSave={handleSaveProduct}
              onCancel={closeModal}
              isSubmitting={isOperationInProgress}
            />
          </ModalContent>
        </Modal>
      )}
    </ProductosContainer>
  )
}

export default ProductosAdmin
