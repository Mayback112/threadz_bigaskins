import { useNavigate } from 'react-router-dom';
import { Button } from '@/component/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/component/ui/card';
import { GridBackground } from '@/component/ui/grid-background';
import { CheckCircle2 } from 'lucide-react';

interface SuccessPageProps {
    title: string;
    description: string;
    buttonText?: string;
    redirectTo?: string;
}

export function SuccessPage({ 
    title, 
    description, 
    buttonText = 'Continue',
    redirectTo = '/'
}: SuccessPageProps) {
    const navigate = useNavigate();

    const handleContinue = () => {
        navigate(redirectTo);
    };

    return (
        <GridBackground>
            <div className="flex items-center justify-center py-12">
                <div className="container mx-auto px-4">
                    <Card className="mx-auto max-w-md">
                        <CardHeader className="space-y-1">
                            <div className="flex justify-center mb-4">
                                <div className="rounded-full bg-green-100 p-4 dark:bg-green-900">
                                    <CheckCircle2 className="h-16 w-16 text-green-600 dark:text-green-400" />
                                </div>
                            </div>
                            <CardTitle className="text-2xl font-bold text-center">{title}</CardTitle>
                            <CardDescription className="text-center">
                                {description}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Button onClick={handleContinue} className="w-full" size="lg">
                                {buttonText}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </GridBackground>
    );
}
