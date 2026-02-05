import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/component/ui/button';
import { ProductCard } from '@/component/product-card';
import { productService, type Product } from '@/services/product.service';
import { useToast } from '@/hooks/use-toast';

// Category image mapping - same as CategoryGrid
const getCategoryImage = (categoryName: string): string => {
    const category = categoryName.toLowerCase();
    if (category.includes('clothing') || category.includes('apparel') || category.includes('wear')) {
        return 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&q=80';
    }
    if (category.includes('shoe') || category.includes('footwear') || category.includes('sneaker')) {
        return 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&q=80';
    }
    if (category.includes('jewelry') || category.includes('jewellery') || category.includes('accessory')) {
        return 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80';
    }
    if (category.includes('bag') || category.includes('handbag') || category.includes('purse')) {
        return 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80';
    }
    if (category.includes('watch') || category.includes('timepiece')) {
        return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80';
    }
    if (category.includes('sunglass') || category.includes('eyewear')) {
        return 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80';
    }
    if (category.includes('dress')) {
        return 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80';
    }
    if (category.includes('shirt') || category.includes('blouse') || category.includes('top')) {
        return 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80';
    }
    if (category.includes('pant') || category.includes('trouser') || category.includes('jean')) {
        return 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80';
    }
    if (category.includes('jacket') || category.includes('coat')) {
        return 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80';
    }
    return 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80';
};

export function Home() {
    const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Array<{ name: string; count: number; image: string }>>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setIsLoading(true);
                const products = await productService.getNewArrivals();
                setFeaturedProducts(products);
            } catch (error: any) {
                toast({
                    title: 'Error',
                    description: 'Failed to load products.',
                    variant: 'destructive',
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setIsCategoriesLoading(true);
                const groupedProducts = await productService.getProductsGroupedByCategory();
                
                // Convert to array
                const categoryList = Object.entries(groupedProducts).map(([name, products]) => ({
                    name,
                    count: products.length,
                    image: getCategoryImage(name)
                }));

                // Calculate which 6 categories to show based on current day
                // This rotates categories every day
                const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
                const offset = (dayOfYear * 6) % categoryList.length;
                
                // Get 6 categories starting from offset, wrapping around if needed
                const selectedCategories: typeof categoryList = [];
                for (let i = 0; i < 6 && i < categoryList.length; i++) {
                    const index = (offset + i) % categoryList.length;
                    selectedCategories.push(categoryList[index]);
                }
                
                setCategories(selectedCategories);
            } catch (error: any) {
                toast({
                    title: 'Error',
                    description: 'Failed to load categories.',
                    variant: 'destructive',
                });
            } finally {
                setIsCategoriesLoading(false);
            }
        };

        fetchCategories();
    }, []);

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-muted/50 to-muted">
                <div className="container mx-auto px-4 py-20 md:py-32">
                    <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
                        <div className="flex flex-col justify-center space-y-6">
                            <div className="space-y-4">
                                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                                    Discover Your Style with{' '}
                                    <span className="text-primary">Premium Products</span>
                                </h1>
                                <p className="text-lg text-muted-foreground md:text-xl">
                                    Shop the latest trends in fashion, electronics, and lifestyle.
                                    Quality products delivered to your doorstep.
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-4">
                                <Link to="/products">
                                    <Button size="lg" className="gap-2">
                                        Shop Now <ArrowRight className="h-4 w-4" />
                                    </Button>
                                </Link>
                                <Link to="/products">
                                    <Button size="lg" variant="outline">
                                        View Collections
                                    </Button>
                                </Link>
                            </div>
                            <div className="flex gap-8 pt-4">
                                <div>
                                    <div className="text-3xl font-bold">10K+</div>
                                    <div className="text-sm text-muted-foreground">Happy Customers</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold">500+</div>
                                    <div className="text-sm text-muted-foreground">Products</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold">4.8</div>
                                    <div className="text-sm text-muted-foreground">Avg Rating</div>
                                </div>
                            </div>
                        </div>
                        <div className="relative hidden lg:block">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-4">
                                    <img
                                        src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600"
                                        alt="Shopping"
                                        className="rounded-lg object-cover w-full h-64"
                                    />
                                    <img
                                        src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=600"
                                        alt="Products"
                                        className="rounded-lg object-cover w-full h-48"
                                    />
                                </div>
                                <div className="mt-8 space-y-4">
                                    <img
                                        src="https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=600"
                                        alt="Fashion"
                                        className="rounded-lg object-cover w-full h-48"
                                    />
                                    <img
                                        src="https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=600"
                                        alt="Style"
                                        className="rounded-lg object-cover w-full h-64"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <div className="mb-12 text-center">
                        <h2 className="mb-4 text-3xl font-bold md:text-4xl">Shop by Category</h2>
                        <p className="text-lg text-muted-foreground">
                            Explore our wide range of product categories
                        </p>
                    </div>
                    {isCategoriesLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
                                {categories.map((category) => (
                                    <Link
                                        key={category.name}
                                        to={`/category/${category.name.toLowerCase()}`}
                                        className="group relative aspect-square overflow-hidden rounded-lg border bg-muted transition-all hover:shadow-lg"
                                    >
                                        <img
                                            src={category.image}
                                            alt={category.name}
                                            className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                                        <div className="absolute bottom-0 left-0 right-0 p-4">
                                            <h3 className="font-semibold">{category.name}</h3>
                                            <p className="text-xs text-muted-foreground">{category.count} items</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                            <div className="mt-8 text-center">
                                <Link to="/categories">
                                    <Button size="lg" variant="outline">
                                        View All Categories
                                    </Button>
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </section>

            {/* New Arrivals Section */}
            <section className="bg-muted/50 py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <div className="mb-12 text-center">
                        <h2 className="mb-4 text-3xl font-bold md:text-4xl">New Arrivals</h2>
                        <p className="text-lg text-muted-foreground">
                            Discover our latest collection of premium products
                        </p>
                    </div>
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="text-center">
                                <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
                                <p className="text-muted-foreground">Loading products...</p>
                            </div>
                        </div>
                    ) : featuredProducts.length > 0 ? (
                        <>
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {featuredProducts.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                            <div className="mt-12 text-center">
                                <Link to="/products">
                                    <Button size="lg" variant="outline">
                                        View All Products
                                    </Button>
                                </Link>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">No featured products available at the moment.</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
