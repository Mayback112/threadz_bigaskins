import { Link, useNavigate } from 'react-router-dom';
import { useWishlist } from '@/context/wishlist-context';
import { Button } from '@/component/ui/button';
import { Card, CardContent } from '@/component/ui/card';
import { Heart, ShoppingCart, Trash2, Package, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { GridBackground } from '@/component/ui/grid-background';

export function Wishlist() {
    const { wishlistItems, removeFromWishlist, isLoading } = useWishlist();
    const { toast } = useToast();
    const navigate = useNavigate();

    const handleRemove = async (productId: string, productName: string) => {
        try {
            await removeFromWishlist(productId);
            toast({
                title: 'Removed from Wishlist',
                description: `${productName} has been removed from your wishlist.`,
                variant: 'destructive',
            });
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to remove item from wishlist.',
                variant: 'destructive',
            });
        }
    };

    if (isLoading) {
        return (
            <GridBackground>
                <div className="container mx-auto px-4 py-16">
                    <div className="flex items-center justify-center min-h-[400px]">
                        <div className="text-center">
                            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
                            <p className="text-muted-foreground">Loading wishlist...</p>
                        </div>
                    </div>
                </div>
            </GridBackground>
        );
    }

    if (wishlistItems.length === 0) {
        return (
            <GridBackground>
                <div className="container mx-auto px-4 py-16">
                    <div className="flex flex-col items-center justify-center text-center">
                        <div className="mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-muted">
                            <Heart className="h-16 w-16 text-muted-foreground" />
                        </div>
                        <h1 className="mb-2 text-3xl font-bold">Your wishlist is empty</h1>
                        <p className="mb-6 text-muted-foreground max-w-md">
                            Start adding products you love to your wishlist and keep track of items you want to purchase later.
                        </p>
                        <Link to="/products">
                            <Button size="lg">
                                <Package className="mr-2 h-5 w-5" />
                                Browse Products
                            </Button>
                        </Link>
                    </div>
                </div>
            </GridBackground>
        );
    }

    return (
        <GridBackground>
            <div className="py-8">
                <div className="container mx-auto px-4">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold mb-2">My Wishlist</h1>
                        <p className="text-muted-foreground">
                            You have {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} in your wishlist
                        </p>
                    </div>

                    {/* Wishlist Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {wishlistItems.map((item) => (
                            <Card key={item.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
                                <Link to={`/product/${item.productId}`}>
                                    <div className="aspect-square overflow-hidden relative">
                                        <img
                                            src={item.productMainImageUrl || item.productImage || '/placeholder.jpg'}
                                            alt={item.productName}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        {item.inStock === false && (
                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                <span className="bg-destructive text-destructive-foreground text-xs font-semibold px-2 py-1 rounded">
                                                    Out of Stock
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </Link>
                                <CardContent className="p-4">
                                    <Link to={`/product/${item.productId}`}>
                                        <h3 className="font-semibold mb-1 hover:text-primary transition-colors line-clamp-1">
                                            {item.productName}
                                        </h3>
                                    </Link>
                                    {item.productSku && (
                                        <p className="text-xs text-muted-foreground mb-2">SKU: {item.productSku}</p>
                                    )}
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-lg font-bold">GHS {item.productPrice.toFixed(2)}</span>
                                        {item.inStock !== undefined && item.inStock !== null && (
                                            <span className={`text-xs font-medium ${item.inStock === true ? 'text-green-600' : 'text-destructive'}`}>
                                                {item.inStock === true ? 'In Stock' : 'Out of Stock'}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            onClick={() => navigate(`/product/${item.productId}`)}
                                            className="flex-1"
                                            size="sm"
                                            disabled={item.inStock === false}
                                        >
                                            <ShoppingCart className="mr-2 h-4 w-4" />
                                            View Product
                                        </Button>
                                        <Button
                                            onClick={() => handleRemove(item.productId, item.productName)}
                                            variant="outline"
                                            size="sm"
                                            className="text-destructive hover:text-destructive"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="mt-8 flex justify-center gap-4">
                        <Link to="/products">
                            <Button variant="outline" size="lg">
                                Continue Shopping
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </GridBackground>
    );
}
