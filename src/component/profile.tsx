import { useEffect, useState } from 'react';
import { Package, Settings, LogOut, Loader2 } from 'lucide-react';
import { Button } from '@/component/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/component/ui/card';
import { Tabs, TabsContent } from '@/component/ui/tabs';
import { Badge } from '@/component/ui/badge';
import { Separator } from '@/component/ui/separator';
import { GridBackground } from '@/component/ui/grid-background';
import { useAuth } from '@/context/auth-context';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { authService } from '@/services/auth.service';
import { orderService, type OrderResponse } from '@/services/order.service';

export function Profile() {
    const { user, logout, updateUser } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingProfile, setIsLoadingProfile] = useState(true);
    const [isLoadingOrders, setIsLoadingOrders] = useState(false);
    const [activeTab, setActiveTab] = useState('orders');
    const [orders, setOrders] = useState<OrderResponse[]>([]);

    useEffect(() => {
        // Fetch profile data from backend when component mounts
        const fetchProfile = async () => {
            try {
                const profile = await authService.getProfile();
                const userData = authService.convertToStoredUser(profile);
                updateUser(userData);
            } catch (error: any) {
                console.error('Failed to fetch profile:', error);
                // If token is invalid, logout
                if (error.status === 401 || error.status === 403) {
                    logout();
                    navigate('/login');
                }
            } finally {
                setIsLoadingProfile(false);
            }
        };

        if (user) {
            fetchProfile();
        } else {
            setIsLoadingProfile(false);
        }
    }, []);

    useEffect(() => {
        // Fetch orders when orders tab is active
        const fetchOrders = async () => {
            if (activeTab !== 'orders' || !user) return;
            
            try {
                setIsLoadingOrders(true);
                const response = await orderService.getMyOrders(0, 20);
                setOrders(response.orders);
            } catch (error: any) {
                console.error('Failed to fetch orders:', error);
                toast({
                    title: 'Error',
                    description: 'Failed to load orders. Please try again later.',
                    variant: 'destructive',
                });
            } finally {
                setIsLoadingOrders(false);
            }
        };

        fetchOrders();
    }, [activeTab, user]);

    const handleLogout = async () => {
        setIsLoading(true);
        
        try {
            // Call backend logout endpoint
            await authService.logout();
            
            // Clear local state
            logout();
            
            toast({
                title: 'Logged Out',
                description: 'You have been successfully logged out.',
            });
            
            navigate('/');
        } catch (error: any) {
            console.error('Logout error:', error);
            // Even if backend call fails, clear local state
            logout();
            navigate('/');
        } finally {
            setIsLoading(false);
        }
    };

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

    const getInitials = (user: any) => {
        if (!user) return 'U';
        const firstName = user.firstName || '';
        const lastName = user.lastName || '';
        if (firstName && lastName) {
            return `${firstName[0]}${lastName[0]}`.toUpperCase();
        }
        if (firstName) {
            return firstName.substring(0, 2).toUpperCase();
        }
        return 'U';
    };

    if (isLoadingProfile) {
        return (
            <GridBackground>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
                        <p className="text-muted-foreground">Loading profile...</p>
                    </div>
                </div>
            </GridBackground>
        );
    }

    return (
        <GridBackground>
            <div className="py-8">
                <div className="container mx-auto px-4">
                <div className="mb-8">
                    <h1 className="mb-2 text-3xl font-bold">My Account</h1>
                    <p className="text-muted-foreground">Manage your account and orders</p>
                </div>

                <div className="grid gap-8 lg:grid-cols-4">
                    {/* Sidebar */}
                    <aside className="space-y-2 lg:col-span-1">
                        <Card>
                            <CardContent className="p-6">
                                <div className="mb-4 flex flex-col items-center text-center">
                                    <div className="mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-primary text-3xl font-bold text-primary-foreground">
                                        {user ? getInitials(user) : 'U'}
                                    </div>
                                    <h3 className="font-semibold">{user ? `${user.firstName} ${user.lastName}` : 'Guest'}</h3>
                                    <p className="text-sm text-muted-foreground">{user?.email || 'Not logged in'}</p>
                                </div>
                                <Separator className="my-4" />
                                <nav className="space-y-2">
                                    <Button 
                                        variant={activeTab === 'orders' ? 'secondary' : 'ghost'} 
                                        className="w-full justify-start" 
                                        size="sm"
                                        onClick={() => setActiveTab('orders')}
                                    >
                                        <Package className="mr-2 h-4 w-4" />
                                        Orders
                                    </Button>
                                    <Button 
                                        variant={activeTab === 'account' ? 'secondary' : 'ghost'} 
                                        className="w-full justify-start" 
                                        size="sm"
                                        onClick={() => setActiveTab('account')}
                                    >
                                        <Settings className="mr-2 h-4 w-4" />
                                        Account Details
                                    </Button>
                                    <Separator className="my-2" />
                                    <Button 
                                        variant="ghost" 
                                        className="w-full justify-start text-destructive" 
                                        size="sm"
                                        onClick={handleLogout}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Logging out...
                                            </>
                                        ) : (
                                            <>
                                                <LogOut className="mr-2 h-4 w-4" />
                                                Logout
                                            </>
                                        )}
                                    </Button>
                                </nav>
                            </CardContent>
                        </Card>
                    </aside>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsContent value="orders" className="space-y-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Order History</CardTitle>
                                        <CardDescription>View and track your orders</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        {isLoadingOrders ? (
                                            <div className="flex items-center justify-center py-12">
                                                <div className="text-center">
                                                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
                                                    <p className="text-sm text-muted-foreground">Loading orders...</p>
                                                </div>
                                            </div>
                                        ) : orders.length > 0 ? (
                                            <div className="space-y-4">
                                                {orders.map((order) => (
                                                    <div
                                                        key={order.id || order.orderId}
                                                        className="flex items-center justify-between rounded-lg border p-4 hover:bg-accent cursor-pointer transition-colors"
                                                        onClick={() => navigate(`/order/${order.id || order.orderId}`)}
                                                    >
                                                        <div className="space-y-1 flex-1">
                                                            <div className="flex items-center gap-3">
                                                                <span className="font-semibold">
                                                                    {order.orderNumber || order.orderCode || order.id?.substring(0, 8)}
                                                                </span>
                                                                {getStatusBadge(order.status)}
                                                            </div>
                                                            <p className="text-sm text-muted-foreground">
                                                                {order.dateCreated ? new Date(order.dateCreated).toLocaleDateString() : 
                                                                 order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                                                            </p>
                                                            {order.productName && (
                                                                <p className="text-sm font-medium">{order.productName}</p>
                                                            )}
                                                            {order.quantityOrdered && (
                                                                <p className="text-xs text-muted-foreground">Quantity: {order.quantityOrdered}</p>
                                                            )}
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="font-semibold">
                                                                GHS {(order.amountPaid || order.totalAmount || order.amount || 0).toFixed(2)}
                                                            </p>
                                                            {order.paymentStatus && (
                                                                <p className="text-xs text-muted-foreground mt-1">
                                                                    {order.paymentStatus}
                                                                </p>
                                                            )}
                                                            <p className="text-xs text-primary mt-2">View Details →</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-12">
                                                <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                                                <p className="text-muted-foreground mb-2">No orders yet</p>
                                                <p className="text-sm text-muted-foreground mb-4">
                                                    Start shopping to see your orders here
                                                </p>
                                                <Button onClick={() => navigate('/products')}>
                                                    Browse Products
                                                </Button>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="account">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Account Details</CardTitle>
                                        <CardDescription>Update your personal information</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div>
                                                <label className="mb-2 block text-sm font-medium">First Name</label>
                                                <input
                                                    type="text"
                                                    value={user?.firstName || ''}
                                                    readOnly
                                                    className="w-full rounded-md border bg-muted px-3 py-2"
                                                />
                                            </div>
                                            <div>
                                                <label className="mb-2 block text-sm font-medium">Last Name</label>
                                                <input
                                                    type="text"
                                                    value={user?.lastName || ''}
                                                    readOnly
                                                    className="w-full rounded-md border bg-muted px-3 py-2"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="mb-2 block text-sm font-medium">Email</label>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="email"
                                                    value={user?.email || ''}
                                                    readOnly
                                                    className="w-full rounded-md border bg-muted px-3 py-2"
                                                />
                                                {user?.emailVerified && (
                                                    <Badge variant="default" className="whitespace-nowrap">Verified</Badge>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="mb-2 block text-sm font-medium">Phone</label>
                                            <input
                                                type="tel"
                                                value={user?.phone || 'Not provided'}
                                                readOnly
                                                className="w-full rounded-md border bg-muted px-3 py-2"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-2 block text-sm font-medium">Referral Source</label>
                                            <input
                                                type="text"
                                                value={user?.referralSource || 'Not provided'}
                                                readOnly
                                                className="w-full rounded-md border bg-muted px-3 py-2"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-2 block text-sm font-medium">User ID</label>
                                            <input
                                                type="text"
                                                value={user?.userId || ''}
                                                readOnly
                                                className="w-full rounded-md border bg-muted px-3 py-2 font-mono text-sm"
                                            />
                                        </div>
                                        {user?.role && (
                                            <div>
                                                <label className="mb-2 block text-sm font-medium">Role</label>
                                                <Badge variant="secondary" className="text-sm">{user.role}</Badge>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                id="receiveUpdates"
                                                checked={user?.receiveProductUpdates || false}
                                                readOnly
                                                className="h-4 w-4 rounded border-gray-300"
                                            />
                                            <label htmlFor="receiveUpdates" className="text-sm font-medium">
                                                Receive product updates
                                            </label>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
                </div>
            </div>
        </GridBackground>
    );
}
