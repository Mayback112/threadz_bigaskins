import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/component/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/component/ui/card';
import { Separator } from '@/component/ui/separator';
import { Badge } from '@/component/ui/badge';
import { GridBackground } from '@/component/ui/grid-background';
import { ChevronLeft, Loader2, Package, MapPin, CreditCard, Calendar } from 'lucide-react';
import { orderService, type OrderResponse } from '@/services/order.service';
import { useToast } from '@/hooks/use-toast';

export default function OrderDetailPage() {
    const { orderId } = useParams<{ orderId: string }>();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [order, setOrder] = useState<OrderResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            if (!orderId) {
                navigate('/profile');
                return;
            }

            try {
                setIsLoading(true);
                const orderData = await orderService.getOrderById(orderId);
                setOrder(orderData);
            } catch (error: any) {
                console.error('Failed to fetch order:', error);
                toast({
                    title: 'Error',
                    description: 'Failed to load order details.',
                    variant: 'destructive',
                });
                navigate('/profile');
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrder();
    }, [orderId]);

    const getStatusBadge = (status?: string) => {
        if (!status) return null;
        
        const statusLower = status.toLowerCase();
        const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
            delivered: 'default',
            completed: 'default',
            shipped: 'secondary',
            processing: 'secondary',
            pending: 'secondary',
            cancelled: 'destructive',
            refunded: 'destructive',
        };

        return (
            <Badge variant={variants[statusLower] || 'secondary'}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
        );
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (isLoading) {
        return (
            <GridBackground>
                <div className="container mx-auto px-4 py-8">
                    <div className="flex items-center justify-center min-h-[400px]">
                        <div className="text-center">
                            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
                            <p className="text-muted-foreground">Loading order details...</p>
                        </div>
                    </div>
                </div>
            </GridBackground>
        );
    }

    if (!order) {
        return (
            <GridBackground>
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center py-12">
                        <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                        <h2 className="text-2xl font-semibold mb-2">Order Not Found</h2>
                        <p className="text-muted-foreground mb-6">
                            The order you're looking for doesn't exist or has been removed.
                        </p>
                        <Link to="/profile">
                            <Button>Back to Orders</Button>
                        </Link>
                    </div>
                </div>
            </GridBackground>
        );
    }

    return (
        <GridBackground>
            <div className="container mx-auto px-4 py-8">
                {/* Back Button */}
                <Button 
                    variant="ghost" 
                    className="mb-6"
                    onClick={() => navigate('/profile')}
                >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Back to Orders
                </Button>

                {/* Order Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-3xl font-bold">
                                Order #{order.orderNumber || order.orderCode || order.id?.substring(0, 8)}
                            </h1>
                            <p className="text-muted-foreground">
                                Placed on {formatDate(order.dateCreated || order.createdAt)}
                            </p>
                        </div>
                        {getStatusBadge(order.status)}
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Order Details */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Product Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Package className="h-5 w-5" />
                                    Product Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {order.productName ? (
                                    <div className="space-y-4">
                                        <div className="flex gap-4">
                                            {order.productMainImageUrl && (
                                                <img 
                                                    src={order.productMainImageUrl} 
                                                    alt={order.productName}
                                                    className="w-24 h-24 object-cover rounded-md"
                                                />
                                            )}
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-lg">{order.productName}</h3>
                                                {order.productSku && (
                                                    <p className="text-sm text-muted-foreground">SKU: {order.productSku}</p>
                                                )}
                                                <p className="text-sm text-muted-foreground mt-2">
                                                    Quantity: {order.quantityOrdered || 1}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-muted-foreground">Product information not available</p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Shipping Address */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MapPin className="h-5 w-5" />
                                    Shipping Address
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {order.customerName && (
                                        <p className="font-medium">{order.customerName}</p>
                                    )}
                                    {(order.customerFirstName || order.customerLastName) && (
                                        <p className="font-medium">
                                            {order.customerFirstName} {order.customerLastName}
                                        </p>
                                    )}
                                    {order.shippingStreetAddress && (
                                        <p className="text-sm">{order.shippingStreetAddress}</p>
                                    )}
                                    {order.shippingRegion && (
                                        <p className="text-sm">{order.shippingRegion}</p>
                                    )}
                                    {order.shippingCountry && (
                                        <p className="text-sm">{order.shippingCountry}</p>
                                    )}
                                    {order.shippingPostalCode && (
                                        <p className="text-sm">Postal Code: {order.shippingPostalCode}</p>
                                    )}
                                    {order.customerPhone && (
                                        <p className="text-sm mt-3">Phone: {order.customerPhone}</p>
                                    )}
                                    {order.customerEmail && (
                                        <p className="text-sm">Email: {order.customerEmail}</p>
                                    )}
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
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Order Amount</span>
                                        <span className="font-medium">
                                            GHS {(order.amountPaid || order.totalAmount || order.amount || 0).toFixed(2)}
                                        </span>
                                    </div>
                                    {order.shippingCost !== undefined && order.shippingCost > 0 && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Shipping</span>
                                            <span className="font-medium">GHS {order.shippingCost.toFixed(2)}</span>
                                        </div>
                                    )}
                                    {order.tax !== undefined && order.tax > 0 && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Tax</span>
                                            <span className="font-medium">GHS {order.tax.toFixed(2)}</span>
                                        </div>
                                    )}
                                </div>

                                <Separator />

                                <div className="flex justify-between">
                                    <span className="font-semibold">Total</span>
                                    <span className="text-xl font-bold">
                                        GHS {(order.amountPaid || order.totalAmount || order.amount || 0).toFixed(2)}
                                    </span>
                                </div>

                                {/* Payment Information */}
                                <Separator />

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm">
                                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-muted-foreground">Payment Status:</span>
                                        <span className="font-medium">{order.paymentStatus || 'N/A'}</span>
                                    </div>
                                    {order.paymentReference && (
                                        <div className="flex items-start gap-2 text-sm">
                                            <span className="text-muted-foreground">Reference:</span>
                                            <span className="font-mono text-xs break-all">{order.paymentReference}</span>
                                        </div>
                                    )}
                                    {order.paymentTimestamp && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-muted-foreground">Paid on:</span>
                                            <span className="text-xs">{formatDate(order.paymentTimestamp)}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
                                    <p className="font-medium text-foreground mb-1">Note</p>
                                    <p>
                                        The store owner will contact you regarding shipping and delivery details.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </GridBackground>
    );
}
