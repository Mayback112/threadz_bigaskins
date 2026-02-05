import { useState, useEffect } from 'react';
import { ShoppingBag, Loader2 } from 'lucide-react';
import { ProductCard } from '@/component/product-card';
import { productService, type Product } from '@/services/product.service';
import { useToast } from '@/hooks/use-toast';

export function Products() {
    const [products, setProducts] = useState<Product[]>([]);
    const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setIsLoading(true);
                const allProducts = await productService.getAllProducts();
                setProducts(allProducts);
                setFeaturedProducts(allProducts.filter(p => p.isFeatured));
            } catch (error: any) {
                toast({
                    title: 'Error',
                    description: 'Failed to load products. Please try again later.',
                    variant: 'destructive',
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
                        <p className="text-muted-foreground">Loading products...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-12 text-center">
                <h1 className="text-4xl font-bold mb-4">All Products</h1>
                <p className="text-muted-foreground text-lg">
                    Browse our complete collection of premium products
                </p>
            </div>

            {/* Featured Products Section */}
            {featuredProducts.length > 0 && (
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-3xl font-bold mb-2">Featured Products</h2>
                            <p className="text-muted-foreground">Handpicked items just for you</p>
                        </div>
                        <ShoppingBag className="w-8 h-8 text-primary" />
                    </div>

                    {/* Products Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {featuredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            )}

            {/* All Products Section */}
            <div className="mt-16">
                <div className="mb-6">
                    <h2 className="text-3xl font-bold mb-2">All Products</h2>
                    <p className="text-muted-foreground">Browse our complete collection</p>
                </div>

                {products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">No products available at the moment.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
