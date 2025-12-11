import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductCard } from '@/component/product-card';
import { Input } from '@/component/ui/input';
import { Button } from '@/component/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/component/ui/select';
import { Search, SlidersHorizontal, X, Loader2 } from 'lucide-react';
import { productService, type Product } from '@/services/product.service';
import { useToast } from '@/hooks/use-toast';

export function SearchPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const initialQuery = searchParams.get('q') || '';
    
    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const [category, setCategory] = useState('all');
    const [sortBy, setSortBy] = useState('relevance');
    const [priceRange, setPriceRange] = useState('all');
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    // Fetch products on mount
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setIsLoading(true);
                const allProducts = await productService.getAllProducts();
                setProducts(allProducts);
            } catch (error: any) {
                console.error('Failed to fetch products:', error);
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

    // Filter and sort products
    const filteredProducts = useMemo(() => {
        let filtered = products.filter(product => {
            // Search in name and description
            const matchesSearch = searchQuery === '' || 
                product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (product.brand && product.brand.toLowerCase().includes(searchQuery.toLowerCase()));

            // Filter by category
            const matchesCategory = category === 'all' || product.category.toLowerCase() === category.toLowerCase();

            // Filter by price range (using discountedPrice or costPrice)
            const productPrice = product.discountedPrice > 0 ? product.discountedPrice : product.costPrice;
            let matchesPrice = true;
            if (priceRange === 'under-50') {
                matchesPrice = productPrice < 50;
            } else if (priceRange === '50-100') {
                matchesPrice = productPrice >= 50 && productPrice <= 100;
            } else if (priceRange === '100-200') {
                matchesPrice = productPrice >= 100 && productPrice <= 200;
            } else if (priceRange === 'over-200') {
                matchesPrice = productPrice > 200;
            }

            return matchesSearch && matchesCategory && matchesPrice;
        });

        // Sort products
        if (sortBy === 'price-low') {
            filtered.sort((a, b) => {
                const priceA = a.discountedPrice > 0 ? a.discountedPrice : a.costPrice;
                const priceB = b.discountedPrice > 0 ? b.discountedPrice : b.costPrice;
                return priceA - priceB;
            });
        } else if (sortBy === 'price-high') {
            filtered.sort((a, b) => {
                const priceA = a.discountedPrice > 0 ? a.discountedPrice : a.costPrice;
                const priceB = b.discountedPrice > 0 ? b.discountedPrice : b.costPrice;
                return priceB - priceA;
            });
        } else if (sortBy === 'name') {
            filtered.sort((a, b) => a.name.localeCompare(b.name));
        }

        return filtered;
    }, [products, searchQuery, category, sortBy, priceRange]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery) {
            setSearchParams({ q: searchQuery });
        }
    };

    const clearFilters = () => {
        setSearchQuery('');
        setCategory('all');
        setSortBy('relevance');
        setPriceRange('all');
        setSearchParams({});
    };

    const categories = Array.from(new Set(products.map(p => p.category)));

    return (
        <div className="py-8">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-4">Search Products</h1>
                    <p className="text-muted-foreground">
                        Find exactly what you're looking for
                    </p>
                </div>

                {/* Search Bar */}
                <form onSubmit={handleSearch} className="mb-8">
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Search for products or categories..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 h-12 text-lg"
                            />
                        </div>
                        <Button type="submit" size="lg" className="px-8">
                            <Search className="mr-2 h-5 w-5" />
                            Search
                        </Button>
                    </div>
                </form>

                {/* Filters */}
                <div className="mb-6 bg-card rounded-lg border p-4">
                    <div className="flex items-center gap-2 mb-4">
                        <SlidersHorizontal className="h-5 w-5" />
                        <h2 className="font-semibold">Filters</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Category Filter */}
                        <div>
                            <label className="text-sm font-medium mb-2 block">Category</label>
                            <Select value={category} onValueChange={setCategory}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All Categories" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Categories</SelectItem>
                                    {categories.map(cat => (
                                        <SelectItem key={cat} value={cat.toLowerCase()}>
                                            {cat}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Price Range Filter */}
                        <div>
                            <label className="text-sm font-medium mb-2 block">Price Range</label>
                            <Select value={priceRange} onValueChange={setPriceRange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All Prices" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Prices</SelectItem>
                                    <SelectItem value="under-50">Under GHS 50</SelectItem>
                                    <SelectItem value="50-100">GHS 50 - 100</SelectItem>
                                    <SelectItem value="100-200">GHS 100 - 200</SelectItem>
                                    <SelectItem value="over-200">Over GHS 200</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Sort By */}
                        <div>
                            <label className="text-sm font-medium mb-2 block">Sort By</label>
                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Relevance" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="relevance">Relevance</SelectItem>
                                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                                    <SelectItem value="name">Name: A to Z</SelectItem>
                                    <SelectItem value="rating">Highest Rated</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Clear Filters */}
                        <div className="flex items-end">
                            <Button
                                variant="outline"
                                onClick={clearFilters}
                                className="w-full"
                            >
                                <X className="mr-2 h-4 w-4" />
                                Clear Filters
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Results Count */}
                <div className="mb-6 flex items-center justify-between">
                    <p className="text-muted-foreground">
                        {filteredProducts.length} {filteredProducts.length === 1 ? 'result' : 'results'} found
                        {searchQuery && (
                            <span className="font-medium text-foreground ml-1">
                                for "{searchQuery}"
                            </span>
                        )}
                    </p>
                </div>

                {/* Products Grid */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-16">
                        <div className="text-center">
                            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
                            <p className="text-muted-foreground">Loading products...</p>
                        </div>
                    </div>
                ) : filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <Search className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                        <h2 className="text-2xl font-semibold mb-2">No products found</h2>
                        <p className="text-muted-foreground mb-6">
                            Try adjusting your search or filters to find what you're looking for
                        </p>
                        <Button onClick={clearFilters}>Clear All Filters</Button>
                    </div>
                )}
            </div>
        </div>
    );
}
