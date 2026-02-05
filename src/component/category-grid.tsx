import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/component/ui/card';
import { ArrowRight, Loader2 } from 'lucide-react';
import { productService } from '@/services/product.service';
import { useToast } from '@/hooks/use-toast';

// Category image mapping - add your Unsplash or image URLs here
const getCategoryImage = (categoryName: string): string => {
    const category = categoryName.toLowerCase();
    
    // Fashion category mappings with Unsplash images
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
    if (category.includes('hat') || category.includes('cap')) {
        return 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=800&q=80';
    }
    if (category.includes('belt')) {
        return 'https://images.unsplash.com/photo-1624222247344-550fb60583aa?w=800&q=80';
    }
    if (category.includes('scarf') || category.includes('shawl')) {
        return 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800&q=80';
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
    if (category.includes('suit')) {
        return 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80';
    }
    
    // Default fallback image for unknown categories
    return 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80';
};

interface CategoryGridProps {
    maxCategories?: number; // Optional prop to limit number of categories shown
}

export function CategoryGrid({ maxCategories }: CategoryGridProps) {
    const navigate = useNavigate();
    const [categories, setCategories] = useState<Array<{ name: string; count: number; image: string }>>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setIsLoading(true);
                const groupedProducts = await productService.getProductsGroupedByCategory();
                
                // Convert grouped products to category array with counts
                const categoryList = Object.entries(groupedProducts).map(([name, products]) => ({
                    name,
                    count: products.length,
                    image: getCategoryImage(name)
                }));
                
                // Limit categories if maxCategories is specified
                const limitedCategories = maxCategories 
                    ? categoryList.slice(0, maxCategories) 
                    : categoryList;
                
                setCategories(limitedCategories);
            } catch (error: any) {
                toast({
                    title: 'Error',
                    description: 'Failed to load categories.',
                    variant: 'destructive',
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchCategories();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
                    <p className="text-sm text-muted-foreground">Loading categories...</p>
                </div>
            </div>
        );
    }

    if (categories.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">No categories available.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
                <Card 
                    key={category.name}
                    className="group cursor-pointer overflow-hidden hover:shadow-lg transition-all duration-300"
                    onClick={() => navigate(`/category/${category.name.toLowerCase()}`)}
                >
                    <div className="relative h-64 overflow-hidden">
                        <img
                            src={category.image}
                            alt={category.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-2xl font-bold mb-1">{category.name}</h3>
                                    <p className="text-sm text-gray-200">{category.count} Products</p>
                                </div>
                                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                            </div>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
}
