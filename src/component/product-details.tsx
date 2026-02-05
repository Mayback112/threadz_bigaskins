import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Minus, Plus, ShoppingCart, Heart, Share2, Loader2 } from 'lucide-react';
import { Button } from '@/component/ui/button';
import { Badge } from '@/component/ui/badge';
import { Separator } from '@/component/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/component/ui/radio-group';
import { Label } from '@/component/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/component/ui/tabs';
import { useCart } from '@/context/cart-context';
import { useToast } from '@/hooks/use-toast';
import { GridBackground } from '@/component/ui/grid-background';
import { productService, type Product, type VariantOption } from '@/services/product.service';
import { useWishlist } from '@/context/wishlist-context';

export function ProductDetail() {
    const { id } = useParams();
    const { addToCart } = useCart();
    const { toast } = useToast();
    const { addToWishlist, isInWishlist } = useWishlist();

    const [product, setProduct] = useState<Product | null>(null);
    const [variantOptions, setVariantOptions] = useState<VariantOption[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [selectedVariant, setSelectedVariant] = useState<Record<string, string>>({});

    useEffect(() => {
        const fetchProduct = async () => {
            if (!id) return;

            try {
                setIsLoading(true);
                const productData = await productService.getProductById(id);
                setProduct(productData);

                // Fetch variant options if product has variants
                if (productData.hasVariants) {
                    const options = await productService.getVariantOptions(id);
                    setVariantOptions(options);
                }
            } catch (error: any) {
                toast({
                    title: 'Error',
                    description: 'Failed to load product details.',
                    variant: 'destructive',
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    if (isLoading) {
        return (
            <GridBackground>
                <div className="container mx-auto px-4 py-16">
                    <div className="flex items-center justify-center min-h-[400px]">
                        <div className="text-center">
                            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
                            <p className="text-muted-foreground">Loading product details...</p>
                        </div>
                    </div>
                </div>
            </GridBackground>
        );
    }

    if (!product) {
        return (
            <GridBackground>
                <div className="container mx-auto px-4 py-16 text-center">
                    <h1 className="mb-4 text-2xl font-bold">Product not found</h1>
                    <Link to="/products">
                        <Button>Back to Shop</Button>
                    </Link>
                </div>
            </GridBackground>
        );
    }

    const handleAddToCart = () => {
        // Check if product requires variant selection
        if (product.hasVariants && variantOptions.length > 0) {
            const missingOptions = variantOptions.filter(opt => !selectedVariant[opt.optionName]);
            if (missingOptions.length > 0) {
                toast({
                    title: 'Selection Required',
                    description: `Please select: ${missingOptions.map(o => o.optionName).join(', ')}`,
                    variant: 'destructive',
                });
                return;
            }
        }

        if (!product.inStock) {
            toast({
                title: 'Out of Stock',
                description: 'This product is currently unavailable',
                variant: 'destructive',
            });
            return;
        }

        // For now, we'll pass the product info to cart
        // Note: You might need to update cart context to handle the new Product type
        addToCart(product as any, quantity, selectedVariant['Size'] || '', selectedVariant['Color'] || '');
        toast({
            title: 'Added to Cart',
            description: `${quantity} × ${product.name} added to your cart`,
        });
    };

    const handleAddToWishlist = async () => {
        try {
            await addToWishlist(product.id);
            toast({
                title: 'Added to Wishlist',
                description: `${product.name} has been added to your wishlist.`,
            });
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message || 'Failed to add to wishlist',
                variant: 'destructive',
            });
        }
    };

    const displayPrice = product.discountedPrice > 0 ? product.discountedPrice : product.costPrice;
    // Only show original price if there's a real discount (discounted price is lower than cost price)
    const originalPrice = product.discountedPrice > 0 && product.costPrice > product.discountedPrice ? product.costPrice : 0;
    const discount = originalPrice > 0
        ? Math.round(((originalPrice - displayPrice) / originalPrice) * 100)
        : 0;

    const inWishlist = isInWishlist(product.id);
    // Only add imageUrls if they exist and are different from mainImageUrl
    const images = product.imageUrls.length > 0 
        ? [product.mainImageUrl, ...product.imageUrls.filter(img => img !== product.mainImageUrl)]
        : [product.mainImageUrl];

    return (
        <GridBackground>
            <div className="py-8">
                <div className="container mx-auto px-4">
                {/* Breadcrumb */}
                <div className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
                    <Link to="/" className="hover:text-foreground">Home</Link>
                    <span>/</span>
                    <Link to="/products" className="hover:text-foreground">Products</Link>
                    <span>/</span>
                    <span className="text-foreground">{product.name}</span>
                </div>

                <div className="grid gap-8 lg:grid-cols-2">
                    {/* Product Images */}
                    <div className="space-y-4">
                        <div className="aspect-square overflow-hidden rounded-lg border bg-muted">
                            <img
                                src={images[selectedImage]}
                                alt={product.name}
                                className="h-full w-full object-cover"
                            />
                        </div>
                        {images.length > 1 && (
                            <div className="grid grid-cols-4 gap-4">
                                {images.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`aspect-square overflow-hidden rounded-lg border-2 ${
                                            selectedImage === index ? 'border-primary' : 'border-transparent'
                                        }`}
                                    >
                                        <img
                                            src={image}
                                            alt={`${product.name} ${index + 1}`}
                                            className="h-full w-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="space-y-6">
                        <div>
                            <div className="mb-2 flex items-center gap-2">
                                <Badge variant="secondary">{product.category}</Badge>
                                {product.isFeatured && <Badge>Featured</Badge>}
                                {product.isNew && <Badge variant="default">New</Badge>}
                                {product.isBestseller && <Badge variant="default">Bestseller</Badge>}
                                {product.isOnSale && <Badge variant="destructive">Sale</Badge>}
                                {discount > 0 && <Badge variant="destructive">-{discount}%</Badge>}
                                {!product.inStock && <Badge variant="destructive">Out of Stock</Badge>}
                            </div>
                            <h1 className="mb-4 text-3xl font-bold md:text-4xl">{product.name}</h1>
                            {product.brand && (
                                <p className="text-sm text-muted-foreground mb-2">Brand: {product.brand}</p>
                            )}
                            <div className="flex items-center gap-3">
                                <span className="text-3xl font-bold">GHS {displayPrice.toFixed(2)}</span>
                                {originalPrice > 0 && (
                                    <span className="text-xl text-muted-foreground line-through">
                                        GHS {originalPrice.toFixed(2)}
                                    </span>
                                )}
                            </div>
                            {product.inStock && product.totalQuantity > 0 && product.totalQuantity <= product.lowStockThreshold && (
                                <p className="text-sm text-orange-600 mt-2">
                                    Only {product.totalQuantity} left in stock!
                                </p>
                            )}
                        </div>

                        <Separator />

                        <div>
                            <p className="text-muted-foreground">{product.description}</p>
                        </div>

                        <Separator />

                        {/* Variant Options */}
                        {variantOptions.map((option) => (
                            <div key={option.optionName}>
                                <Label className="mb-3 block text-sm font-semibold">{option.optionName}</Label>
                                <RadioGroup 
                                    value={selectedVariant[option.optionName] || ''} 
                                    onValueChange={(value) => setSelectedVariant(prev => ({...prev, [option.optionName]: value}))}
                                >
                                    <div className="flex flex-wrap gap-2">
                                        {option.optionValues.map((value) => (
                                            <div key={value}>
                                                <RadioGroupItem
                                                    value={value}
                                                    id={`${option.optionName}-${value}`}
                                                    className="peer sr-only"
                                                />
                                                <Label
                                                    htmlFor={`${option.optionName}-${value}`}
                                                    className="flex cursor-pointer items-center justify-center rounded-md border-2 border-muted bg-popover px-4 py-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                                >
                                                    {value}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                </RadioGroup>
                            </div>
                        ))}

                        {/* Quantity */}
                        <div>
                            <Label className="mb-3 block text-sm font-semibold">Quantity</Label>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center rounded-md border">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        disabled={quantity <= 1}
                                    >
                                        <Minus className="h-4 w-4" />
                                    </Button>
                                    <span className="w-12 text-center font-medium">{quantity}</span>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setQuantity(Math.min(product.totalQuantity, quantity + 1))}
                                        disabled={quantity >= product.totalQuantity}
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                                {product.totalQuantity > 0 && (
                                    <span className="text-sm text-muted-foreground">
                                        {product.totalQuantity} items in stock
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <Button 
                                className="flex-1" 
                                size="lg" 
                                onClick={handleAddToCart}
                                disabled={!product.inStock}
                            >
                                <ShoppingCart className="mr-2 h-5 w-5" />
                                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                            </Button>
                            <Button 
                                variant={inWishlist ? "default" : "outline"} 
                                size="icon" 
                                className="h-12 w-12"
                                onClick={handleAddToWishlist}
                                disabled={inWishlist}
                            >
                                <Heart className={`h-5 w-5 ${inWishlist ? 'fill-current' : ''}`} />
                            </Button>
                            <Button variant="outline" size="icon" className="h-12 w-12">
                                <Share2 className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Product Details Tabs */}
                <div className="mt-16">
                    <Tabs defaultValue="description" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="description">Description</TabsTrigger>
                            <TabsTrigger value="details">Details</TabsTrigger>
                            <TabsTrigger value="shipping">Shipping</TabsTrigger>
                        </TabsList>
                        <TabsContent value="description" className="space-y-4 py-6">
                            <div>
                                <h3 className="mb-3 text-lg font-semibold">Product Description</h3>
                                <p className="text-muted-foreground">{product.description}</p>
                            </div>
                            {product.shortDescription && (
                                <div>
                                    <h3 className="mb-3 text-lg font-semibold">Summary</h3>
                                    <p className="text-muted-foreground">{product.shortDescription}</p>
                                </div>
                            )}
                        </TabsContent>
                        <TabsContent value="details" className="space-y-4 py-6">
                            <h3 className="mb-4 text-lg font-semibold">Product Specifications</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <span className="text-sm text-muted-foreground">Category:</span>
                                    <p className="font-medium">{product.category}</p>
                                </div>
                                {product.brand && (
                                    <div className="space-y-2">
                                        <span className="text-sm text-muted-foreground">Brand:</span>
                                        <p className="font-medium">{product.brand}</p>
                                    </div>
                                )}
                                {product.weight > 0 && (
                                    <div className="space-y-2">
                                        <span className="text-sm text-muted-foreground">Weight:</span>
                                        <p className="font-medium">{product.weight} kg</p>
                                    </div>
                                )}
                                {(product.length > 0 || product.width > 0 || product.height > 0) && (
                                    <div className="space-y-2">
                                        <span className="text-sm text-muted-foreground">Dimensions:</span>
                                        <p className="font-medium">
                                            {product.length} × {product.width} × {product.height} cm
                                        </p>
                                    </div>
                                )}
                                {product.supplierName && (
                                    <div className="space-y-2">
                                        <span className="text-sm text-muted-foreground">Supplier:</span>
                                        <p className="font-medium">{product.supplierName}</p>
                                    </div>
                                )}
                            </div>
                        </TabsContent>
                        <TabsContent value="shipping" className="space-y-4 py-6">
                            <div>
                                <h3 className="mb-2 font-semibold">Shipping & Delivery</h3>
                                <p className="text-sm text-muted-foreground mb-3">
                                    Shipping and delivery costs will be communicated to you by the store owner.
                                    Orders are typically processed within 1-2 business days.
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    For any questions regarding shipping, please contact our customer service team.
                                </p>
                            </div>
                            <div>
                                <h3 className="mb-2 font-semibold">Returns & Exchanges</h3>
                                <p className="text-sm text-muted-foreground">
                                    We offer a 30-day return policy for all items. Products must be unused and in
                                    original packaging. Return shipping costs may apply.
                                </p>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
                </div>
            </div>
        </GridBackground>
    );
}
