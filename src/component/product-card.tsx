import { Link } from 'react-router-dom';
import { useState } from 'react';
import { ShoppingCart, Heart } from 'lucide-react';
import { Button } from '@/component/ui/button';
import { Badge } from '@/component/ui/badge';
import { Card, CardContent, CardFooter } from '@/component/ui/card';
import { useWishlist } from '@/context/wishlist-context';
import { useToast } from '@/hooks/use-toast';
import type { Product } from '@/services/product.service';

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const { toast } = useToast();
    const inWishlist = isInWishlist(product.id);
    const [isHovered, setIsHovered] = useState(false);
    const secondImage = product.imageUrls && product.imageUrls.length > 1 ? product.imageUrls[1] : null;

    // Calculate discount percentage from discountedPrice vs costPrice
    const discount = product.discountedPrice > 0 && product.costPrice > product.discountedPrice
        ? Math.round(((product.costPrice - product.discountedPrice) / product.costPrice) * 100)
        : 0;

    const displayPrice = product.discountedPrice > 0 ? product.discountedPrice : product.costPrice;
    // Only show original price if there's a real discount (discounted price is lower than cost price)
    const originalPrice = product.discountedPrice > 0 && product.costPrice > product.discountedPrice ? product.costPrice : 0;

    const handleWishlistToggle = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        try {
            if (inWishlist) {
                await removeFromWishlist(product.id);
                toast({
                    title: 'Removed from Wishlist',
                    description: `${product.name} has been removed from your wishlist.`,
                });
            } else {
                await addToWishlist(product.id);
                toast({
                    title: 'Added to Wishlist',
                    description: `${product.name} has been added to your wishlist.`,
                });
            }
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message || 'Failed to update wishlist. Please try again.',
                variant: 'destructive',
            });
        }
    };

    return (
        <Card className="group overflow-hidden transition-shadow hover:shadow-xl rounded-2xl"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Link to={`/product/${product.id}`}>
                <div className="relative aspect-square overflow-hidden bg-muted rounded-t-2xl">
                    <img
                        src={product.mainImageUrl}
                        alt={product.name}
                        className={`absolute inset-0 h-full w-full object-cover transition-all duration-500 ${
                            secondImage
                                ? isHovered ? 'opacity-0' : 'opacity-100'
                                : isHovered ? 'scale-105' : 'scale-100'
                        }`}
                    />
                    {secondImage && (
                        <img
                            src={secondImage}
                            alt={`${product.name} - alternate view`}
                            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                        />
                    )}
                    {discount > 0 && (
                        <Badge className="absolute right-2 top-2" variant="destructive">
                            -{discount}%
                        </Badge>
                    )}
                    {product.isFeatured && (
                        <Badge className="absolute left-2 top-2" variant="secondary">
                            Featured
                        </Badge>
                    )}
                    {product.isNew && (
                        <Badge className="absolute left-2 top-10" variant="default">
                            New
                        </Badge>
                    )}
                    {!product.inStock && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <Badge variant="destructive">Out of Stock</Badge>
                        </div>
                    )}
                    <Button
                        variant="secondary"
                        size="icon"
                        className="absolute right-2 bottom-2 rounded-full"
                        onClick={handleWishlistToggle}
                    >
                        <Heart 
                            className={`h-4 w-4 ${inWishlist ? 'fill-red-500 text-red-500' : ''}`}
                        />
                    </Button>
                </div>
            </Link>

            <CardContent className="p-4">
                <Link to={`/product/${product.id}`}>
                    <p className="text-xs text-muted-foreground mb-1">{product.category}</p>
                    <h3 className="font-semibold line-clamp-1 mb-2 hover:underline">
                        {product.name}
                    </h3>
                    {product.brand && (
                        <p className="text-xs text-muted-foreground mb-2">{product.brand}</p>
                    )}
                    <div className="flex items-center gap-2">
                        <span className="text-lg font-bold">GHS {displayPrice.toFixed(2)}</span>
                        {originalPrice > 0 && (
                            <span className="text-sm text-muted-foreground line-through">
                                GHS {originalPrice.toFixed(2)}
                            </span>
                        )}
                    </div>
                </Link>
            </CardContent>

            <CardFooter className="p-4 pt-0">
                <Link to={`/product/${product.id}`} className="w-full">
                    <Button 
                        className="w-full" 
                        size="sm" 
                        disabled={!product.inStock || !product.discountedPrice || product.discountedPrice <= 0}
                    >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        {!product.discountedPrice || product.discountedPrice <= 0 
                            ? 'Price Not Set' 
                            : product.inStock ? 'Add to Cart' : 'Out of Stock'}
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    );
}
