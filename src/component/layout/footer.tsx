import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail } from 'lucide-react';
import { Input } from '@/component/ui/input';
import { Button } from '@/component/ui/button';

export function Footer() {
    return (
        <footer className="border-t bg-background">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {/* Company Info */}
                    <div>
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                                <span className="text-lg font-bold">TB</span>
                            </div>
                            <span className="text-lg font-bold">Threadz BigAskins</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">
                            Your premium destination for fashion and clothing. Quality threads delivered to your door.
                        </p>
                        <div className="flex gap-2">
                            <Button variant="ghost" size="icon" aria-label="Facebook">
                                <Facebook className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" aria-label="Twitter">
                                <Twitter className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" aria-label="Instagram">
                                <Instagram className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="mb-4 text-sm font-semibold">Quick Links</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link to="/" className="text-muted-foreground hover:text-foreground">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/products" className="text-muted-foreground hover:text-foreground">
                                    Shop
                                </Link>
                            </li>
                            <li>
                                <Link to="/" className="text-muted-foreground hover:text-foreground">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link to="/" className="text-muted-foreground hover:text-foreground">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h3 className="mb-4 text-sm font-semibold">Customer Service</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link to="/" className="text-muted-foreground hover:text-foreground">
                                    FAQ
                                </Link>
                            </li>
                            <li>
                                <Link to="/" className="text-muted-foreground hover:text-foreground">
                                    Shipping Info
                                </Link>
                            </li>
                            <li>
                                <Link to="/" className="text-muted-foreground hover:text-foreground">
                                    Returns
                                </Link>
                            </li>
                            <li>
                                <Link to="/" className="text-muted-foreground hover:text-foreground">
                                    Track Order
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="mb-4 text-sm font-semibold">Newsletter</h3>
                        <p className="mb-4 text-sm text-muted-foreground">
                            Subscribe to get special offers and updates.
                        </p>
                        <div className="flex gap-2">
                            <Input placeholder="Your email" type="email" />
                            <Button size="icon">
                                <Mail className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
                    <p>&copy; 2024 Threadz BigAskins. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
