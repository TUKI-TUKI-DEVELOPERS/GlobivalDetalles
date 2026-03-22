import ProductDetail from "./ProductDetail";

// Pre-generate pages for product IDs 1-200
export function generateStaticParams() {
  return Array.from({ length: 200 }, (_, i) => ({
    id: String(i + 1),
  }));
}

export default async function ProductoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ProductDetail id={id} />;
}
