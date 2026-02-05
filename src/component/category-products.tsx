import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ProductCard } from '@/component/product-card';
import { Button } from '@/component/ui/button';
import { ChevronLeft, Package, Loader2 } from 'lucide-react';
import { productService, type Product } from '@/services/product.service';
import { useToast } from '@/hooks/use-toast';

export function CategoryProducts() {
    const { category } = useParams<{ category: string }>();
    const navigate = useNavigate();
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();
    
    // Decode URL-encoded category name and capitalize properly
    const decodedCategory = category ? decodeURIComponent(category) : '';
    const categoryName = decodedCategory
        ? decodedCategory.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')
        : '';

    useEffect(() => {
        const fetchProducts = async () => {
            if (!decodedCategory) {
                return;
            }
            
            try {
                setIsLoading(true);
                
                // Fetch all products
                const allProducts = await productService.getAllProducts();
                
                // Find products where category starts with or contains the parent category
                // This handles hierarchical categories (e.g., "Clothing & Accessories > Men's Shirts")
                const categoryProducts = allProducts.filter(product => {
                    const productCategory = product.category.toLowerCase();
                    const searchCategory = decodedCategory.toLowerCase();
                    
                    // Check if category matches exactly or starts with the parent category
                    return productCategory === searchCategory || 
                           productCategory.startsWith(searchCategory + ' >') ||
                           productCategory.startsWith(searchCategory + '/') ||
                           productCategory.startsWith(searchCategory + '-');
                });
                
                setProducts(categoryProducts);
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
    }, [decodedCategory]);

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
            {/* Back Button */}
            <Button 
                variant="ghost" 
                className="mb-6"
                onClick={() => navigate(-1)}
            >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
            </Button>

            {/* Category Header */}
            <div className="mb-12">
                <div className="flex items-center gap-3 mb-4">
                    <Package className="w-8 h-8 text-primary" />
                    <h1 className="text-4xl font-bold">{categoryName}</h1>
                </div>
                <p className="text-muted-foreground text-lg">
                    Showing {products.length} {products.length === 1 ? 'product' : 'products'} in this category
                </p>
            </div>

            {/* Products Grid */}
            {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <h2 className="text-2xl font-semibold mb-2">No Products Found</h2>
                    <p className="text-muted-foreground mb-6">
                        There are no products in the {categoryName} category yet.
                    </p>
                    <Link to="/products">
                        <Button>Browse All Products</Button>
                    </Link>
                </div>
            )}
        </div>
    );
}
