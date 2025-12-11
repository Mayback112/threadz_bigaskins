import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, Search, Heart } from 'lucide-react';
import { Button } from '@/component/ui/button';
import { useCart } from '@/context/cart-context';
import { useAuth } from '@/context/auth-context';
import { useWishlist } from '@/context/wishlist-context';
import { Badge } from '@/component/ui/badge';
import { Input } from '@/component/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/component/ui/sheet';
import { Avatar, AvatarFallback } from '@/component/ui/avatar';
import { useState } from 'react';

export function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { totalItems } = useCart();
    const { wishlistCount } = useWishlist();
    const { user, isAuthenticated } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [mobileSearchQuery, setMobileSearchQuery] = useState('');

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

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Shop', path: '/products' },
        { name: 'Categories', path: '/categories' },
        // { name: 'Booking', path: '/booking' },
        { name: 'Contact', path: '/contact' },
    ];

    const handleSearch = (e: React.FormEvent, query: string) => {
        e.preventDefault();
        if (query.trim()) {
            navigate(`/search?q=${encodeURIComponent(query.trim())}`);
        }
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                            <span className="text-lg font-bold">TB</span>
                        </div>
                        <span className="hidden text-lg font-bold sm:inline-block">Threadz BigAskins</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden gap-6 md:flex">
                        {navLinks.map((link) => {
                            const isActive = location.pathname === link.path;
                            return (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className={`text-sm transition-colors hover:text-foreground ${
                                        isActive 
                                            ? 'font-bold text-foreground underline underline-offset-4' 
                                            : 'font-medium text-muted-foreground'
                                    }`}
                                >
                                    {link.name}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Search Bar - Desktop */}
                    <div className="hidden flex-1 px-8 md:block md:max-w-md">
                        <form onSubmit={(e) => handleSearch(e, searchQuery)}>
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Search products..."
                                    className="pl-8"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </form>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-2">
                        {isAuthenticated && user ? (
                            <Link to="/profile">
                                <Button variant="ghost" size="icon" className="rounded-full" aria-label="User profile">
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                                            {getInitials(user)}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </Link>
                        ) : (
                            <Link to="/login">
                                <Button variant="ghost" size="icon" aria-label="Login">
                                    <User className="h-5 w-5" />
                                </Button>
                            </Link>
                        )}

                        <Link to="/wishlist">
                            <Button variant="ghost" size="icon" className="relative" aria-label="Wishlist">
                                <Heart className="h-5 w-5" />
                                {wishlistCount > 0 && (
                                    <Badge
                                        variant="destructive"
                                        className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                                    >
                                        {wishlistCount}
                                    </Badge>
                                )}
                            </Button>
                        </Link>

                        <Link to="/cart">
                            <Button variant="ghost" size="icon" className="relative" aria-label="Shopping cart">
                                <ShoppingCart className="h-5 w-5" />
                                {totalItems > 0 && (
                                    <Badge
                                        variant="destructive"
                                        className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                                    >
                                        {totalItems}
                                    </Badge>
                                )}
                            </Button>
                        </Link>

                        {/* Mobile Menu */}
                        <Sheet>
                            <SheetTrigger asChild className="md:hidden">
                                <Button variant="ghost" size="icon" aria-label="Menu">
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-64">
                                <div className="flex flex-col gap-4 pt-8">
                                    {/* Mobile Search */}
                                    <form onSubmit={(e) => handleSearch(e, mobileSearchQuery)}>
                                        <div className="relative">
                                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                type="search"
                                                placeholder="Search products..."
                                                className="pl-8"
                                                value={mobileSearchQuery}
                                                onChange={(e) => setMobileSearchQuery(e.target.value)}
                                            />
                                        </div>
                                    </form>

                                    <nav className="flex flex-col gap-2">
                                        {navLinks.map((link) => {
                                            const isActive = location.pathname === link.path;
                                            return (
                                                <Link
                                                    key={link.name}
                                                    to={link.path}
                                                    className={`rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-foreground ${
                                                        isActive 
                                                            ? 'font-bold text-foreground underline underline-offset-4' 
                                                            : 'font-medium text-muted-foreground'
                                                    }`}
                                                >
                                                    {link.name}
                                                </Link>
                                            );
                                        })}
                                    </nav>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </header>
    );
}
