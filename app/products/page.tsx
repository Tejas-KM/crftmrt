import { ProductsClient } from '@/components/ProductsClient';
import { allProducts, categories } from '@/data/products';

interface ProductsPageProps {
  searchParams: {
    category?: string;
    search?: string;
    sort?: string;
  };
}

export const metadata = {
  title: 'All Products - CraftMart',
  description: 'Browse our complete collection of premium interior materials',
};

export default function ProductsPage({ searchParams }: ProductsPageProps) {
  return (
    <ProductsClient 
      products={allProducts} 
      categories={categories}
      searchParams={searchParams}
    />
  );
}
