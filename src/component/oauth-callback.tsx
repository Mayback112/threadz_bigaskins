import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/component/ui/card';
import { Loader2 } from 'lucide-react';
import type { StoredUser } from '@/lib/userUtils';

export function OAuthCallback() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const { toast } = useToast();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const handleOAuthCallback = () => {
            try {
                // Parse hash parameters from URL
                const hash = location.hash.substring(1); // Remove the '#'
                const params = new URLSearchParams(hash);

                // Extract parameters
                const accessToken = params.get('accessToken');
                const userId = params.get('userId');
                const email = params.get('email');
                const firstName = params.get('firstName');
                const lastName = params.get('lastName');
                const tenantId = params.get('tenantId');
                const rolesString = params.get('roles');

                // Validate required parameters
                if (!accessToken || !userId || !email || !firstName || !lastName) {
                    throw new Error('Missing required authentication parameters');
                }

                // Store access token
                localStorage.setItem('accessToken', accessToken);

                // Note: Backend returns access token in hash, but no refresh token
                // If backend provides refresh token, extract and store it similarly

                // Parse roles
                const roles = rolesString ? [rolesString] : ['CUSTOMER'];

                // Create user object
                const userData: StoredUser = {
                    userId,
                    id: userId,
                    email,
                    firstName,
                    lastName,
                    phone: '', // Not provided by OAuth
                    referralSource: 'google_oauth',
                    receiveProductUpdates: false,
                    emailVerified: true, // OAuth users are pre-verified
                    role: roles[0] || 'CUSTOMER',
                    roles,
                    tenantId: tenantId || '',
                };

                // Log user in
                login(userData);

                // Show success message
                toast({
                    title: 'Login Successful',
                    description: `Welcome back, ${firstName}!`,
                });

                // Redirect to home and reload
                window.location.href = '/';
            } catch (err: any) {
                setError(err.message || 'Authentication failed');
                
                toast({
                    title: 'Authentication Failed',
                    description: err.message || 'Unable to complete authentication',
                    variant: 'destructive',
                });

                // Redirect to login after 3 seconds
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            }
        };

        handleOAuthCallback();
    }, [location, login, navigate, toast]);

    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <Card className="mx-auto max-w-md">
                    <CardHeader>
                        <CardTitle className="text-destructive">Authentication Error</CardTitle>
                        <CardDescription>
                            There was a problem completing your authentication
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">{error}</p>
                        <p className="text-xs text-muted-foreground">
                            Redirecting to login page...
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-background">
            <Card className="mx-auto max-w-md">
                <CardHeader>
                    <CardTitle>Completing Sign In</CardTitle>
                    <CardDescription>
                        Please wait while we complete your authentication...
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center py-8">
                    <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                    <p className="text-sm text-muted-foreground">Processing your login...</p>
                </CardContent>
            </Card>
        </div>
    );
}
