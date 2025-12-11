import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Truck, MapPin, Loader2 } from 'lucide-react';
import { Button } from '@/component/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/component/ui/card';
import { Input } from '@/component/ui/input';
import { Label } from '@/component/ui/label';
import { Separator } from '@/component/ui/separator';
import { useCart } from '@/context/cart-context';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-context';
import { orderService } from '@/services/order.service';
import { paymentService } from '@/services/payment.service';

export function Checkout() {
    const { items, totalPrice, clearCart } = useCart();
    const { toast } = useToast();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [isProcessing, setIsProcessing] = useState(false);
    
    // Form data
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState(user?.email || '');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [country, setCountry] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!user) {
            toast({
                title: 'Authentication Required',
                description: 'Please login to complete your order.',
                variant: 'destructive',
            });
            navigate('/login');
            return;
        }

        setIsProcessing(true);

        try {
            // Create orders for each product in cart
            const orderPromises = items.map(item => 
                orderService.createOrder({
                    productId: item.product.id,
                    quantity: item.quantity,
                    phoneNumber: phone,
                    shippingCountry: country,
                    shippingStreetAddress: address,
                    shippingRegion: `${city}, ${state}`,
                    shippingPostalCode: zipCode,
                })
            );

            const orders = await Promise.all(orderPromises);
            const orderIds = orders.map(order => order.id || order.orderId).filter(Boolean) as string[];

            // Initialize Paystack payment
            const paymentResponse = await paymentService.initializePayment({
                orderIds: orderIds,
                amount: totalPrice,
                email: email,
                currency: 'GHS',
                callbackUrl: `${window.location.origin}/payment/success`,
            });

            // Redirect to Paystack payment page
            const authUrl = paymentResponse.authorizationUrl || paymentResponse.data?.authorizationUrl;
            
            if (authUrl) {
                // Clear cart before redirect
                clearCart();
                window.location.href = authUrl;
            } else {
                throw new Error('Failed to initialize payment');
            }

        } catch (error: any) {
            console.error('Checkout error:', error);
            toast({
                title: 'Order Failed',
                description: error.message || 'Failed to process order. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setIsProcessing(false);
        }
    };

    if (items.length === 0) {
        navigate('/cart');
        return null;
    }

    return (
        <div className="min-h-screen py-8">
            <div className="container mx-auto px-4">
                <h1 className="mb-8 text-3xl font-bold">Checkout</h1>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-8 lg:grid-cols-3">
                        {/* Checkout Forms */}
                        <div className="space-y-6 lg:col-span-2">
                            {/* Shipping Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <MapPin className="h-5 w-5" />
                                        Shipping Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="firstName">First Name</Label>
                                            <Input 
                                                id="firstName" 
                                                value={firstName}
                                                onChange={(e) => setFirstName(e.target.value)}
                                                required 
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="lastName">Last Name</Label>
                                            <Input 
                                                id="lastName" 
                                                value={lastName}
                                                onChange={(e) => setLastName(e.target.value)}
                                                required 
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input 
                                            id="email" 
                                            type="email" 
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required 
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <Input 
                                            id="phone" 
                                            type="tel" 
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            required 
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="address">Street Address</Label>
                                        <Input 
                                            id="address" 
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            required 
                                        />
                                    </div>
                                    <div className="grid gap-4 md:grid-cols-3">
                                        <div className="space-y-2">
                                            <Label htmlFor="city">City</Label>
                                            <Input 
                                                id="city" 
                                                value={city}
                                                onChange={(e) => setCity(e.target.value)}
                                                required 
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="state">State/Region</Label>
                                            <Input 
                                                id="state" 
                                                value={state}
                                                onChange={(e) => setState(e.target.value)}
                                                required 
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="zip">ZIP/Postal Code</Label>
                                            <Input 
                                                id="zip" 
                                                value={zipCode}
                                                onChange={(e) => setZipCode(e.target.value)}
                                                required 
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="country">Country</Label>
                                        <Input 
                                            id="country" 
                                            value={country}
                                            onChange={(e) => setCountry(e.target.value)}
                                            required 
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Shipping & Delivery Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Truck className="h-5 w-5" />
                                        Shipping & Delivery
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="rounded-lg border p-4 bg-muted/50">
                                        <p className="text-sm text-muted-foreground">
                                            <strong className="text-foreground">Note:</strong> Shipping and delivery costs will be communicated to you by the store owner after your order is placed. 
                                            You will be contacted via email or phone with the delivery details and associated costs.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Payment Method */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <CreditCard className="h-5 w-5" />
                                        Payment Method
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="rounded-lg border p-4 flex items-center gap-3">
                                        <div className="flex-1">
                                            <div className="font-medium">Paystack Payment</div>
                                            <div className="text-sm text-muted-foreground mt-1">
                                                Secure payment via Paystack. Pay with card, bank transfer, or mobile money.
                                            </div>
                                        </div>
                                        <img 
                                            src="https://paystack.com/assets/img/paystack-logo.png" 
                                            alt="Paystack" 
                                            className="h-8"
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Order Summary */}
                        <div>
                            <Card className="sticky top-24">
                                <CardHeader>
                                    <CardTitle>Order Summary</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-3">
                                        {items.map((item) => {
                                            const productPrice = item.product.discountedPrice > 0 
                                                ? item.product.discountedPrice 
                                                : item.product.costPrice || item.product.price || 0;
                                            return (
                                                <div
                                                    key={`${item.product.id}-${item.size}-${item.color}`}
                                                    className="flex justify-between text-sm"
                                                >
                                                    <div className="flex-1">
                                                        <div className="font-medium">{item.product.name}</div>
                                                        <div className="text-muted-foreground">
                                                            {item.size} / {item.color} × {item.quantity}
                                                        </div>
                                                    </div>
                                                    <div className="font-medium">
                                                        GHS {(productPrice * item.quantity).toFixed(2)}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <Separator />

                                    <div className="flex justify-between">
                                        <span className="font-semibold">Total</span>
                                        <span className="text-xl font-bold">GHS {totalPrice.toFixed(2)}</span>
                                    </div>

                                    <div className="text-xs text-muted-foreground text-center">
                                        Shipping and delivery costs will be communicated separately
                                    </div>

                                    <Button type="submit" className="w-full" size="lg" disabled={isProcessing}>
                                        {isProcessing ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                <CreditCard className="mr-2 h-5 w-5" />
                                                Proceed to Payment
                                            </>
                                        )}
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
