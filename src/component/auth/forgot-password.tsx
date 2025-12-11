import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/component/ui/button.tsx';
import { Input } from '@/component/ui/input.tsx';
import { Label } from '@/component/ui/label.tsx';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/component/ui/card.tsx';
import { useToast } from '@/hooks/use-toast.ts';
import { GridBackground } from '@/component/ui/grid-background.tsx';
import { authService } from '@/services/auth.service.ts';
import { Loader2, Mail, Lock, CheckCircle2, ArrowLeft, Eye, EyeOff } from 'lucide-react';

type Step = 'email' | 'otp' | 'password' | 'success';

export function ForgotPassword() {
    const [step, setStep] = useState<Step>('email');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { toast } = useToast();
    const navigate = useNavigate();

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await authService.forgotPassword({ email });
            
            toast({
                title: 'Verification Code Sent',
                description: 'Please check your email for the verification code.',
            });

            setStep('otp');
        } catch (error: any) {
            console.error('Forgot password error:', error);
            toast({
                title: 'Error',
                description: error.message || 'Unable to send verification code',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (otp.length !== 6) {
            toast({
                title: 'Invalid Code',
                description: 'Please enter a valid 6-digit code',
                variant: 'destructive',
            });
            return;
        }

        setStep('password');
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast({
                title: 'Passwords Do Not Match',
                description: 'Please make sure both passwords are the same',
                variant: 'destructive',
            });
            return;
        }

        if (newPassword.length < 6) {
            toast({
                title: 'Password Too Short',
                description: 'Password must be at least 6 characters long',
                variant: 'destructive',
            });
            return;
        }

        setIsLoading(true);

        try {
            await authService.resetPasswordWithOtp({
                email,
                otp,
                newPassword,
                confirmPassword,
            });

            setStep('success');
        } catch (error: any) {
            console.error('Password reset error:', error);
            toast({
                title: 'Password Reset Failed',
                description: error.message || 'Unable to reset password',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleBackToLogin = () => {
        navigate('/login');
    };

    return (
        <GridBackground>
            <div className="flex items-center justify-center py-12">
                <div className="container mx-auto px-4">
                    <Card className="mx-auto max-w-md">
                        <CardHeader className="space-y-1">
                            <CardTitle className="text-2xl font-bold">
                                {step === 'email' && 'Forgot Password'}
                                {step === 'otp' && 'Verify Your Email'}
                                {step === 'password' && 'Reset Password'}
                                {step === 'success' && 'Password Reset Successful'}
                            </CardTitle>
                            <CardDescription>
                                {step === 'email' && 'Enter your email address and we\'ll send you a verification code'}
                                {step === 'otp' && `We've sent a verification code to ${email}`}
                                {step === 'password' && 'Enter your new password'}
                                {step === 'success' && 'Your password has been successfully reset'}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {step === 'email' && (
                                <form onSubmit={handleSendOtp} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="name@example.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                                disabled={isLoading}
                                                className="pl-9"
                                            />
                                        </div>
                                    </div>
                                    <Button type="submit" className="w-full" disabled={isLoading}>
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Sending Code...
                                            </>
                                        ) : (
                                            'Send Verification Code'
                                        )}
                                    </Button>
                                </form>
                            )}

                            {step === 'otp' && (
                                <form onSubmit={handleVerifyOtp} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="otp">Verification Code</Label>
                                        <Input
                                            id="otp"
                                            type="text"
                                            placeholder="Enter 6-digit code"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                            required
                                            maxLength={6}
                                            className="text-center text-lg tracking-widest"
                                        />
                                    </div>
                                    <Button type="submit" className="w-full">
                                        Verify Code
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full"
                                        onClick={() => setStep('email')}
                                    >
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        Back
                                    </Button>
                                </form>
                            )}

                            {step === 'password' && (
                                <form onSubmit={handleResetPassword} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="newPassword">New Password</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="newPassword"
                                                type={showNewPassword ? "text" : "password"}
                                                placeholder="••••••••"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                required
                                                disabled={isLoading}
                                                className="pl-9 pr-10"
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                                disabled={isLoading}
                                            >
                                                {showNewPassword ? (
                                                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                                                ) : (
                                                    <Eye className="h-4 w-4 text-muted-foreground" />
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="confirmPassword"
                                                type={showConfirmPassword ? "text" : "password"}
                                                placeholder="••••••••"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                required
                                                disabled={isLoading}
                                                className="pl-9 pr-10"
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                disabled={isLoading}
                                            >
                                                {showConfirmPassword ? (
                                                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                                                ) : (
                                                    <Eye className="h-4 w-4 text-muted-foreground" />
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                    <Button type="submit" className="w-full" disabled={isLoading}>
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Resetting Password...
                                            </>
                                        ) : (
                                            'Reset Password'
                                        )}
                                    </Button>
                                </form>
                            )}

                            {step === 'success' && (
                                <div className="text-center py-6">
                                    <div className="mb-4 flex justify-center">
                                        <div className="rounded-full bg-green-100 p-3 dark:bg-green-900">
                                            <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
                                        </div>
                                    </div>
                                    <p className="text-muted-foreground mb-6">
                                        Your password has been successfully reset. You can now log in with your new password.
                                    </p>
                                    <Button onClick={handleBackToLogin} className="w-full">
                                        Go to Login
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                        <CardFooter className="flex justify-center">
                            <p className="text-sm text-muted-foreground">
                                Remember your password?{' '}
                                <Link to="/login" className="font-medium text-primary hover:underline">
                                    Back to Login
                                </Link>
                            </p>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </GridBackground>
    );
}
