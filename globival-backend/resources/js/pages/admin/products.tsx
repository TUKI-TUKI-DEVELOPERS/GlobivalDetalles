import { useEffect, useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import InputError from '@/components/input-error';

// Tipos
interface SubCategory { id: number; name: string; }
interface Product {
  id?: number;
  name: string;
  description?: string | null;
  price: number | string;
  precio_de_oferta?: number | string | null;
  stock?: number | null;
  SKU?: string | null;
  sub_category_id: number;
  imagen?: File | string | null;
}

// Utilidades
const formatMoney = (value: string | number) => {
  const num = Number(String(value).replace(/[^\d.-]/g, ''));
  return isNaN(num) ? '' : num.toFixed(2);
};

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Productos', href: '/admin/productos' },
];

export default function AdminProductsPage() {
  // Estado de subcategorías (para el select)
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const [loadingSubs, setLoadingSubs] = useState(false);

  // Formulario con Inertia useForm
  const { data, setData, post, put, processing, errors, reset } = useForm<Product>({
    name: '',
    description: '',
    price: '' as unknown as number,
    precio_de_oferta: '' as unknown as number,
    stock: 0,
    SKU: '',
    sub_category_id: 0,
    imagen: null,
  });

  // Cargar subcategorías al montar
  useEffect(() => {
    const fetchSubs = async () => {
      setLoadingSubs(true);
      try {
        const res = await fetch('/api/subcategories');
        const json = await res.json();
        setSubcategories(json);
      } catch (e) {
        console.error('Error cargando subcategorías', e);
      } finally {
        setLoadingSubs(false);
      }
    };
    fetchSubs();
  }, []);

  // Handlers
  const handleChange = (field: keyof Product, value: any) => {
    setData(field, value);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatMoney(e.target.value);
    setData('price', formatted);
  };

  const handleOfferPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatMoney(e.target.value);
    setData('precio_de_oferta', formatted);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setData('imagen', file ?? null);
  };

  const handleSubmitCreate = (e: React.FormEvent) => {
    e.preventDefault();
    post('/api/products', {
      forceFormData: true,
      onSuccess: () => {
        reset();
      },
    });
  };

  const handleSubmitUpdate = (productId: number) => (e: React.FormEvent) => {
    e.preventDefault();
    put(`/api/products/${productId}`, {
      forceFormData: true,
    });
  };

  // UI del formulario rediseñado
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Productos" />
      <div className="grid gap-6 p-4">
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Crear / Editar Producto</h2>
            <p className="text-sm text-muted-foreground">Completa los campos de manera clara y lógica.</p>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={handleSubmitCreate}>
              {/* Grupo: Información básica */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="name">Nombre</Label>
                  <Input id="name" value={data.name} onChange={e => handleChange('name', e.target.value)} placeholder="Ej. Zapatillas deportivas" />
                  <InputError message={errors.name} />
                </div>
                <div>
                  <Label htmlFor="SKU">SKU</Label>
                  <Input id="SKU" value={data.SKU ?? ''} onChange={e => handleChange('SKU', e.target.value)} placeholder="Código interno opcional" />
                  <InputError message={errors.SKU} />
                </div>
              </div>

              {/* Grupo: Descripción */}
              <div>
                <Label htmlFor="description">Descripción</Label>
                <Input id="description" value={data.description ?? ''} onChange={e => handleChange('description', e.target.value)} placeholder="Descripción detallada del producto" />
                <InputError message={errors.description} />
              </div>

              {/* Grupo: Precios */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <Label htmlFor="price">Precio</Label>
                  <Input id="price" value={String(data.price ?? '')} onChange={handlePriceChange} placeholder="0.00" inputMode="decimal" />
                  <InputError message={errors.price} />
                </div>
                <div>
                  <Label htmlFor="precio_de_oferta">Precio de oferta</Label>
                  <Input id="precio_de_oferta" value={String(data.precio_de_oferta ?? '')} onChange={handleOfferPriceChange} placeholder="0.00" inputMode="decimal" />
                  <InputError message={errors.precio_de_oferta} />
                </div>
                <div>
                  <Label htmlFor="stock">Stock</Label>
                  <Input id="stock" type="number" min={0} value={String(data.stock ?? 0)} onChange={e => handleChange('stock', Number(e.target.value))} />
                  <InputError message={errors.stock} />
                </div>
              </div>

              {/* Grupo: Categoría */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="sub_category_id">Subcategoría</Label>
                  <Select onValueChange={(val) => handleChange('sub_category_id', Number(val))} value={String(data.sub_category_id || '')}>
                    <SelectTrigger id="sub_category_id">
                      <SelectValue placeholder={loadingSubs ? 'Cargando...' : 'Selecciona una subcategoría'} />
                    </SelectTrigger>
                    <SelectContent>
                      {subcategories.map((sc) => (
                        <SelectItem key={sc.id} value={String(sc.id)}>
                          {sc.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <InputError message={errors.sub_category_id} />
                </div>
                <div>
                  <Label htmlFor="imagen">Imagen</Label>
                  <Input id="imagen" type="file" accept="image/*" onChange={handleImageChange} />
                  <InputError message={errors.imagen} />
                </div>
              </div>

              {/* Acciones */}
              <div className="flex gap-3">
                <Button type="submit" disabled={processing}>
                  {processing ? 'Guardando...' : 'Guardar producto'}
                </Button>
                <Button type="button" variant="secondary" onClick={() => reset()}>Limpiar</Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Lista simple para editar existentes (como demostración) */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Editar Producto existente</h3>
            <p className="text-sm text-muted-foreground">Selecciona un producto y actualiza campos específicos.</p>
          </CardHeader>
          <CardContent>
            {/* Nota: Idealmente listaríamos productos con paginación. Aquí se asume que el admin navegará desde otra vista. */}
            <p className="text-sm">Usa el mismo formulario superior y envía con método PUT a /api/products/:id</p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}