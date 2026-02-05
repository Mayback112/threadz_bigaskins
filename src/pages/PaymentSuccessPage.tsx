import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/component/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/component/ui/card';
import { GridBackground } from '@/component/ui/grid-background';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { paymentService } from '@/services/payment.service';
import { useToast } from '@/hooks/use-toast';

export default function PaymentSuccessPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { toast } = useToast();
    const [isVerifying, setIsVerifying] = useState(true);
    const [paymentVerified, setPaymentVerified] = useState(false);
    const [redirectCountdown, setRedirectCountdown] = useState(5);

    useEffect(() => {
        const verifyPayment = async () => {
            const reference = searchParams.get('reference');
            
            if (!reference) {
                toast({
                    title: 'Invalid Payment Reference',
                    description: 'No payment reference found.',
                    variant: 'destructive',
                });
                navigate('/');
                return;
            }

            try {
                setIsVerifying(true);
                const response = await paymentService.verifyPayment(reference);
                
                if (response.success && response.status === 'success') {
                    setPaymentVerified(true);
                    toast({
                        title: 'Payment Successful!',
                        description: 'Your order has been placed successfully.',
                    });
                } else {
                    toast({
                        title: 'Payment Verification Failed',
                        description: response.message || 'Unable to verify payment.',
                        variant: 'destructive',
                    });
                    navigate('/cart');
                }
            } catch (error: any) {
                toast({
                    title: 'Verification Error',
                    description: 'Failed to verify payment. Please contact support.',
                    variant: 'destructive',
                });
                navigate('/cart');
            } finally {
                setIsVerifying(false);
            }
        };

        verifyPayment();
    }, [searchParams]);

    useEffect(() => {
        if (paymentVerified && redirectCountdown > 0) {
            const timer = setTimeout(() => {
                setRedirectCountdown(redirectCountdown - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (paymentVerified && redirectCountdown === 0) {
            navigate('/profile');
        }
    }, [paymentVerified, redirectCountdown, navigate]);

    if (isVerifying) {
        return (
            <GridBackground>
                <div className="flex items-center justify-center min-h-screen py-12">
                    <div className="container mx-auto px-4">
                        <Card className="mx-auto max-w-md">
                            <CardContent className="p-12">
                                <div className="text-center space-y-4">
                                    <Loader2 className="h-16 w-16 animate-spin mx-auto text-primary" />
                                    <h2 className="text-xl font-semibold">Verifying Payment...</h2>
                                    <p className="text-sm text-muted-foreground">
                                        Please wait while we confirm your payment
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </GridBackground>
        );
    }

    return (
        <GridBackground>
            <div className="flex items-center justify-center min-h-screen py-12">
                <div className="container mx-auto px-4">
                    <Card className="mx-auto max-w-md">
                        <CardHeader className="space-y-1">
                            <div className="flex justify-center mb-4">
                                <div className="rounded-full bg-green-100 p-4 dark:bg-green-900">
                                    <CheckCircle2 className="h-16 w-16 text-green-600 dark:text-green-400" />
                                </div>
                            </div>
                            <CardTitle className="text-2xl font-bold text-center">
                                Payment Successful!
                            </CardTitle>
                            <CardDescription className="text-center">
                                Thank you for your order. Your payment has been processed successfully.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="rounded-lg border p-4 bg-muted/50">
                                <p className="text-sm text-muted-foreground text-center">
                                    You will receive an email confirmation shortly. The store owner will contact you regarding shipping and delivery details.
                                </p>
                            </div>
                            
                            <div className="text-center text-sm text-muted-foreground">
                                Redirecting to your orders in {redirectCountdown} seconds...
                            </div>

                            <Button 
                                onClick={() => navigate('/profile')} 
                                className="w-full" 
                                size="lg"
                            >
                                View My Orders
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </GridBackground>
    );
}
