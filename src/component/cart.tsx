import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { Button } from '@/component/ui/button';
import { Card, CardContent } from '@/component/ui/card';
import { Separator } from '@/component/ui/separator';
import { useCart } from '@/context/cart-context';
import { GridBackground } from '@/component/ui/grid-background';

export function Cart() {
    const { items, removeFromCart, updateQuantity, totalPrice } = useCart();

    if (items.length === 0) {
        return (
            <GridBackground>
                <div className="container mx-auto px-4 py-16">
                    <div className="flex flex-col items-center justify-center text-center">
                        <ShoppingBag className="mb-4 h-24 w-24 text-muted-foreground" />
                        <h1 className="mb-2 text-2xl font-bold">Your cart is empty</h1>
                        <p className="mb-6 text-muted-foreground">
                            Add some products to get started
                        </p>
                        <Link to="/products">
                            <Button size="lg">Continue Shopping</Button>
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
                <h1 className="mb-8 text-3xl font-bold">Shopping Cart</h1>

                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Cart Items */}
                    <div className="space-y-4 lg:col-span-2">
                        {items.map((item) => (
                            <Card key={`${item.product.id}-${item.size}-${item.color}`}>
                                <CardContent className="p-4">
                                    <div className="flex gap-4">
                                        <img
                                            src={item.product.mainImageUrl || item.product.image}
                                            alt={item.product.name}
                                            className="h-24 w-24 rounded-md object-cover"
                                        />
                                        <div className="flex flex-1 flex-col justify-between">
                                            <div>
                                                <Link
                                                    to={`/product/${item.product.id}`}
                                                    className="font-semibold hover:underline"
                                                >
                                                    {item.product.name}
                                                </Link>
                                                <div className="mt-1 flex gap-3 text-sm text-muted-foreground">
                                                    <span>Size: {item.size}</span>
                                                    <span>Color: {item.color}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center rounded-md border">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <Minus className="h-3 w-3" />
                                                    </Button>
                                                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                                    >
                                                        <Plus className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                                <div className="flex items-center gap-4">
                          <span className="font-semibold">
                            GHS {((item.product.discountedPrice > 0 ? item.product.discountedPrice : item.product.costPrice || item.product.price) * item.quantity).toFixed(2)}
                          </span>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-destructive"
                                                        onClick={() => removeFromCart(item.product.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div>
                        <Card className="sticky top-24">
                            <CardContent className="p-6">
                                <h2 className="mb-4 text-xl font-semibold">Order Summary</h2>
                                <div className="space-y-3">
                                    <Separator />
                                    <div className="flex justify-between">
                                        <span className="font-semibold">Total</span>
                                        <span className="text-xl font-bold">GHS {totalPrice.toFixed(2)}</span>
                                    </div>
                                </div>

                                <div className="mt-4 rounded-lg bg-muted/50 p-3">
                                    <p className="text-xs font-medium text-foreground mb-1">
                                        Shipping & Delivery
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Shipping and delivery costs will be communicated to you by the store owner after placing your order.
                                    </p>
                                </div>

                                <div className="mt-6 space-y-2">
                                    <Link to="/checkout" className="block">
                                        <Button className="w-full" size="lg">
                                            Proceed to Checkout
                                        </Button>
                                    </Link>
                                    <Link to="/products" className="block">
                                        <Button variant="outline" className="w-full">
                                            Continue Shopping
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
                </div>
            </div>
        </GridBackground>
    );
}
